import { NextRequest, NextResponse } from 'next/server';
// import { SupabaseService } from '@/lib/supabase';

// N8n workflow webhook URLs - only coaching-methodology is currently active
const N8N_WEBHOOKS = {
  'coaching-methodology': 'https://purposewaze.app.n8n.cloud/webhook-test/agent-template'
};

interface CoachingRequest {
  query: string;
  businessContext?: {
    businessStage: string;
    industry?: string;
    currentRevenue?: number;
    customerCount?: number;
    cac?: number;
    ltv?: number;
    grossMargin?: number;
  };
  businessId?: string; // Reference to existing business profile
  sessionType: 'diagnostic' | 'strategic' | 'implementation';
  userId: string;
  agent?: keyof typeof N8N_WEBHOOKS; // Specific agent or let master conductor decide
}

export async function POST(request: NextRequest) {
  try {
    const body: CoachingRequest = await request.json();
    
    // Validate required fields
    if (!body.query || !body.sessionType || !body.userId) {
      return NextResponse.json(
        { error: 'Missing required fields: query, sessionType, or userId' },
        { status: 400 }
      );
    }

    // Default to coaching-methodology since it's the only n8n workflow currently active
    const targetAgent = body.agent || 'coaching-methodology';
    const webhookUrl = N8N_WEBHOOKS[targetAgent];

    // If requested agent doesn't have n8n workflow, use coaching-methodology as fallback
    const activeWebhookUrl = webhookUrl || N8N_WEBHOOKS['coaching-methodology'];
    
    if (!activeWebhookUrl) {
      return NextResponse.json(
        { error: 'No active n8n workflow available' },
        { status: 400 }
      );
    }

    console.log(`🎯 Routing to ${targetAgent}: ${body.query.substring(0, 50)}...`);

    // TODO: Save coaching session to database when Supabase is configured
    const sessionId = Date.now().toString(); // Temporary session ID for testing

    // Call N8n webhook
    const n8nResponse = await fetch(activeWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: body.query,
        businessContext: body.businessContext || {
          businessStage: 'startup'
        },
        sessionType: body.sessionType,
        userId: body.userId,
        agentType: targetAgent,
        timestamp: new Date().toISOString()
      }),
    });

    if (!n8nResponse.ok) {
      console.error(`N8n webhook failed: ${n8nResponse.status} ${n8nResponse.statusText}`);
      throw new Error(`N8n webhook returned ${n8nResponse.status}`);
    }

    const result = await n8nResponse.json();
    
    console.log(`✅ ${targetAgent} response received`);
    
    // TODO: Update the saved session with the N8n response when Supabase is configured
    
    // Format response for frontend
    const formattedResponse = {
      sessionId: sessionId,
      agent: targetAgent,
      timestamp: new Date().toISOString(),
      query: body.query,
      response: result,
      
      // Extract key information for UI
      synthesis: result.synthesis || result.analysis?.coachingResponse || result.orchestration?.orchestrationPlan || 'Analysis completed successfully.',
      
      analysis: [{
        agentType: targetAgent,
        findings: Array.isArray(result.analysis?.evidence) ? result.analysis.evidence : 
                 Array.isArray(result.analysis?.recommendations) ? result.analysis.recommendations :
                 result.analysis?.actionableRecommendations || ['Analysis completed'],
        confidence: result.analysis?.confidenceScore || result.confidenceScore || 0.85,
        metrics: result.analysis || result.orchestration || {}
      }],
      
      actionItems: result.analysis?.prioritizedRecommendations?.map((rec: any) => ({
        title: rec.strategy || rec,
        priority: rec.priority === 1 ? 'critical' : rec.priority === 2 ? 'high' : 'medium',
        timeline: rec.timeline || '1-2 weeks',
        metric: rec.impact || 'Success completion'
      })) || result.analysis?.actionableRecommendations?.slice(0, 5).map((rec: string, index: number) => ({
        title: rec,
        priority: index < 2 ? 'high' : 'medium',
        timeline: '1-2 weeks',
        metric: 'Implementation success'
      })) || [],
      
      nextSteps: result.analysis?.implementationPriority?.immediate || 
                 result.analysis?.recommendations?.slice(0, 3) || 
                 ['Continue with systematic implementation', 'Monitor progress weekly', 'Adjust based on results'],
      
      frameworks: result.frameworks || result.metadata?.frameworkApplied ? [result.metadata.frameworkApplied] : 
                  targetAgent === 'master-conductor' ? ['4 Universal Business Constraints', 'Multi-Agent Orchestration'] :
                  targetAgent === 'constraint-analyzer' ? ['4 Universal Constraints', 'Sequential Constraint Solving'] :
                  targetAgent === 'offer-analyzer' ? ['Grand Slam Offer', 'Value Equation'] :
                  targetAgent === 'financial-calculator' ? ['CFA Analysis', '3 Levels of Advertising'] :
                  ['Alex Hormozi Methodology']
    };

    return NextResponse.json(formattedResponse);

  } catch (error) {
    console.error('Coaching API error:', error);
    
    // Fallback response when N8n is unavailable
    return NextResponse.json({
      agent: 'fallback-coach',
      timestamp: new Date().toISOString(),
      synthesis: `I understand you're looking for coaching on: "${(await request.json()).query}". 

🎯 **Based on Alex Hormozi's 4 Universal Business Constraints:**

Every business growth is constrained by one of four things:
1. **LEADS** - Not enough qualified prospects
2. **SALES** - Can't convert prospects to customers  
3. **DELIVERY** - Can't retain customers or deliver efficiently
4. **PROFIT** - Good revenue but poor margins

**Next Steps:**
1. Identify which constraint is choking your growth first
2. Focus 100% on solving that constraint before moving to others
3. "Perfect one at a time - don't try to fix everything at once"

The N8n coaching workflows will provide more detailed analysis once they're fully connected. For now, start by honestly assessing which of the 4 constraints is your primary bottleneck.`,
      
      analysis: [{
        agentType: 'fallback-advisor',
        findings: [
          'N8n workflows temporarily unavailable',
          'Applying Alex Hormozi 4 Constraints framework',
          'Recommend constraint identification as first step'
        ],
        confidence: 0.75,
        metrics: { primaryConstraint: 'unknown', analysisMode: 'fallback' }
      }],
      
      actionItems: [
        {
          title: 'Identify your primary business constraint using the 4 Universal Constraints',
          priority: 'critical',
          timeline: 'This week',
          metric: 'Clear constraint identification'
        },
        {
          title: 'Set up N8n workflow connections for detailed analysis',
          priority: 'high', 
          timeline: 'Next week',
          metric: 'Full AI coaching system operational'
        }
      ],
      
      nextSteps: [
        'Determine which constraint (LEADS/SALES/DELIVERY/PROFIT) is your primary bottleneck',
        'Connect N8n workflows for comprehensive Alex Hormozi AI coaching',
        'Focus on systematic constraint resolution'
      ],
      
      frameworks: ['4 Universal Business Constraints', 'Alex Hormozi Methodology']
    });
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    message: 'Alex Hormozi AI Coaching API is running',
    activeAgents: Object.keys(N8N_WEBHOOKS),
    defaultAgent: 'coaching-methodology',
    timestamp: new Date().toISOString()
  });
}