import { NextRequest, NextResponse } from 'next/server';
import { MockAgentService } from '@/lib/mock-agents';

// N8n workflow webhook URLs - Updated to use environment variables
const N8N_WEBHOOKS = {
  'master-conductor': process.env.N8N_MASTER_CONDUCTOR || 'https://purposewaze.app.n8n.cloud/webhook-test/master-conductor',
  'constraint-analyzer': process.env.N8N_CONSTRAINT_ANALYZER || 'https://purposewaze.app.n8n.cloud/webhook-test/constraint-analyzer',
  'offer-analyzer': process.env.N8N_OFFER_ANALYZER || 'https://purposewaze.app.n8n.cloud/webhook-test/offer-analyzer',
  'financial-calculator': process.env.N8N_FINANCIAL_CALCULATOR || 'https://purposewaze.app.n8n.cloud/webhook-test/financial-calculator',
  'money-model-architect': process.env.N8N_MONEY_MODEL_ARCHITECT || 'https://purposewaze.app.n8n.cloud/webhook-test/money-model-architect',
  'psychology-optimizer': process.env.N8N_PSYCHOLOGY_OPTIMIZER || 'https://purposewaze.app.n8n.cloud/webhook-test/psychology-optimizer',
  'implementation-planner': process.env.N8N_IMPLEMENTATION_PLANNER || 'https://purposewaze.app.n8n.cloud/webhook-test/implementation-planner',
  'coaching-methodology': process.env.N8N_COACHING_METHODOLOGY || 'https://purposewaze.app.n8n.cloud/webhook-test/coaching-methodology'
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
  sessionType: 'diagnostic' | 'strategic' | 'implementation';
  userId: string;
  agent?: keyof typeof N8N_WEBHOOKS; // Specific agent or let master conductor decide
}

export async function POST(request: NextRequest) {
  let body: CoachingRequest;
  try {
    body = await request.json();
    
    // Validate required fields
    if (!body.query || !body.sessionType || !body.userId) {
      return NextResponse.json(
        { error: 'Missing required fields: query, sessionType, or userId' },
        { status: 400 }
      );
    }

    // Start with Master Conductor unless specific agent requested
    const targetAgent = body.agent || 'master-conductor';
    const webhookUrl = N8N_WEBHOOKS[targetAgent];

    if (!webhookUrl) {
      return NextResponse.json(
        { error: 'Invalid agent specified' },
        { status: 400 }
      );
    }

    console.log(`🎯 Routing to ${targetAgent}: ${body.query.substring(0, 50)}...`);

    // Call N8n webhook
    const n8nResponse = await fetch(webhookUrl, {
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
        timestamp: new Date().toISOString()
      }),
    });

    if (!n8nResponse.ok) {
      console.error(`N8n webhook failed: ${n8nResponse.status} ${n8nResponse.statusText}`);
      
      // Use mock response when N8n is not available (404) or other errors
      console.log(`🤖 Using mock ${targetAgent} response for testing`);
      const mockResponse = MockAgentService.getMockResponse(targetAgent, body.query);
      
      // Format mock response similar to N8n response
      const formattedMockResponse = {
        agent: targetAgent,
        timestamp: new Date().toISOString(),
        query: body.query,
        response: mockResponse,
        
        synthesis: mockResponse.synthesis || 'Mock analysis completed successfully.',
        
        analysis: [{
          agentType: targetAgent,
          findings: Array.isArray(mockResponse.analysis?.evidence) ? mockResponse.analysis.evidence : 
                   Array.isArray(mockResponse.analysis?.actionableRecommendations) ? mockResponse.analysis.actionableRecommendations :
                   ['Mock analysis completed'],
          confidence: mockResponse.analysis?.confidenceScore || 0.85,
          metrics: mockResponse.analysis || {}
        }],
        
        actionItems: mockResponse.analysis?.prioritizedActions?.critical?.map((action: any) => ({
          title: action.action || action,
          priority: 'critical',
          timeline: action.timeline || '1-2 weeks',
          metric: 'Success completion'
        })) || mockResponse.analysis?.implementationPriority?.immediate?.map((rec: string) => ({
          title: rec,
          priority: 'high',
          timeline: '1-2 weeks',
          metric: 'Implementation success'
        })) || [],
        
        nextSteps: mockResponse.analysis?.implementationPriority?.immediate || 
                   ['Continue with systematic implementation', 'Monitor progress weekly', 'Adjust based on results'],
        
        frameworks: mockResponse.frameworks || ['Alex Hormozi Methodology']
      };

      return NextResponse.json(formattedMockResponse);
    }

    const result = await n8nResponse.json();
    
    console.log(`✅ ${targetAgent} response received`);
    
    // Handle array response from N8n (common format)
    const n8nResult = Array.isArray(result) ? result[0]?.result || result[0] : result;
    
    // Format response for frontend
    const formattedResponse = {
      agent: targetAgent,
      timestamp: new Date().toISOString(),
      query: body.query,
      response: result,
      
      // Extract key information for UI - Agent-specific formatting
      synthesis: (() => {
        switch (targetAgent) {
          case 'implementation-planner':
            return `📋 **90-Day Implementation Roadmap**

**Business Level**: ${n8nResult.businessLevelDetection?.detectedLevel || 'Assessed'} (${n8nResult.businessLevelDetection?.revenueRange || 'Revenue analyzed'})
**Primary Constraint**: ${n8nResult.constraintAnalysis?.primaryConstraint || 'Identified'}

**Phase 1 (Days 1-30): ${n8nResult.implementationRoadmap?.constraintStabilization?.title || 'Constraint Stabilization'}**
${n8nResult.implementationRoadmap?.constraintStabilization?.primaryFocus || 'Focus on immediate constraint resolution'}

**Phase 2 (Days 31-90): ${n8nResult.implementationRoadmap?.systematicSolution?.title || 'Systematic Solution'}**  
${n8nResult.implementationRoadmap?.systematicSolution?.primaryFocus || 'Implement systematic solutions'}

**Phase 3 (Days 91-180): ${n8nResult.implementationRoadmap?.constraintResolution?.title || 'Full Resolution'}**
${n8nResult.implementationRoadmap?.constraintResolution?.primaryFocus || 'Complete constraint resolution'}

**Success Metrics**: ${n8nResult.successMetrics?.revenueGrowth || 'Revenue growth targets established'}`;

          case 'constraint-analyzer':
            return `🎯 **Constraint Analysis Complete**

**Primary Constraint**: ${n8nResult.primaryConstraint || n8nResult.constraintAnalysis?.primaryConstraint || 'IDENTIFIED'}
**Constraint Severity**: ${n8nResult.constraintSeverity || 'HIGH'}
**Diagnosis Confidence**: ${n8nResult.diagnosisConfidence || n8nResult.confidenceLevel || '85'}%

**Evidence**:
${(n8nResult.constraintEvidence || n8nResult.constraintAnalysis?.constraintEvidence || ['Analysis completed']).map((evidence: string) => `• ${evidence}`).join('\n')}

**Alex Hormozi Quote**: "Every business has one constraint at a time that limits growth. Fix this first."

**Next Action**: Focus 100% energy on resolving the ${n8nResult.primaryConstraint || 'identified'} constraint before moving to others.`;

          case 'master-conductor':
            return `🎯 **Master Conductor Analysis**

**Business Level**: ${n8nResult.businessLevelDetection?.detectedLevel || 'Assessed'} (${n8nResult.businessLevelDetection?.revenueRange || 'Analyzed'})
**Primary Constraint**: ${n8nResult.primaryConstraint || 'Identified'}
**Required Agents**: ${n8nResult.requiredAgents?.join(', ') || 'Determined'}

**Orchestration Plan**: ${n8nResult.orchestrationPlan || 'Multi-agent analysis coordinated'}

**Agent Priority**:
- **Primary**: ${n8nResult.agentPriority?.primary || 'Assigned'}  
- **Secondary**: ${n8nResult.agentPriority?.secondary?.join(', ') || 'Supporting agents identified'}

**Expected Outcome**: ${n8nResult.reasoning || 'Systematic constraint resolution and business growth acceleration'}`;

          case 'offer-analyzer':
            return `💎 **Grand Slam Offer Analysis**

**Value Equation Assessment**:
- **Dream Outcome**: ${n8nResult.valueEquationScores?.dreamOutcome || 'Evaluated'}/100
- **Perceived Likelihood**: ${n8nResult.valueEquationScores?.perceivedLikelihood || 'Assessed'}/100  
- **Time Delay**: ${n8nResult.valueEquationScores?.timeDelay || 'Analyzed'}/100
- **Effort & Sacrifice**: ${n8nResult.valueEquationScores?.effortSacrifice || 'Reviewed'}/100

**Total Value Score**: ${n8nResult.valueEquationTotal || n8nResult.valueScore || 'Calculated'}/100

**Offer Optimization Strategy**: ${n8nResult.offerStrategy || 'Strengthen the weakest elements of your Value Equation to create an irresistible Grand Slam Offer'}

**Priority Focus**: ${n8nResult.primaryRecommendation || 'Increase perceived likelihood with proof elements and reduce customer effort'}`;

          case 'financial-calculator':
            return `📊 **Financial Analysis Complete**

**Current Metrics**:
- **CAC**: $${n8nResult.cac || n8nResult.metricsAnalysis?.cac || 'Calculated'}
- **LTV**: $${n8nResult.ltv || n8nResult.metricsAnalysis?.ltv || 'Analyzed'}
- **LTV:CAC Ratio**: ${n8nResult.ltvToCacRatio || n8nResult.metricsAnalysis?.ltvToCacRatio || 'Computed'}:1

**Advertising Level**: ${n8nResult.advertisingLevel?.current || 'Level 1'} (${n8nResult.advertisingLevel?.description || 'LTV > CAC'})

**CFA Analysis**: ${n8nResult.cfaStatus || (n8nResult.cfaAnalysis?.thirtyDayGP >= n8nResult.cac ? '✅ CFA Achievable' : '⚠️ Need higher 30-day GP')}
- **30-Day GP**: $${n8nResult.cfaAnalysis?.thirtyDayGP || 'Calculated'}
- **Gap to CFA**: $${n8nResult.cfaAnalysis?.gapAnalysis || 'Analyzed'}

**Recommendation**: ${n8nResult.primaryRecommendation || 'Focus on increasing front-loaded value to achieve Client Financed Acquisition'}`;

          case 'money-model-architect':
            return `🏗️ **4-Prong Money Model Architecture**

**Current Model Assessment**:
- **Attraction Offer**: ${n8nResult.prongAnalysis?.attraction?.exists ? '✅' : '❌'} ${n8nResult.prongAnalysis?.attraction?.optimization || 'Analyzed'}
- **Upsell**: ${n8nResult.prongAnalysis?.upsell?.exists ? '✅' : '❌'} ${n8nResult.prongAnalysis?.upsell?.opportunity || 'High opportunity'}
- **Downsell**: ${n8nResult.prongAnalysis?.downsell?.exists ? '✅' : '❌'} ${n8nResult.prongAnalysis?.downsell?.opportunity || 'Medium opportunity'}  
- **Continuity**: ${n8nResult.prongAnalysis?.continuity?.exists ? '✅' : '❌'} ${n8nResult.prongAnalysis?.continuity?.opportunity || 'High opportunity'}

**Projected Impact**: ${n8nResult.projectedImpact?.revenueIncrease || '150-200%'} revenue increase
**Average Order Value**: ${n8nResult.projectedImpact?.avgOrderValue || '2.5x'} improvement

**Implementation Priority**: ${n8nResult.implementationPriority || 'Start with highest-impact missing prong for immediate revenue boost'}`;

          case 'psychology-optimizer':
            return `🧠 **Psychology Optimization Analysis**

**5 Upsell Moments Assessment**:
- **Immediately**: ${n8nResult.upsellMoments?.immediately?.implemented ? '✅' : '🔥'} ${n8nResult.upsellMoments?.immediately?.opportunity || 'Critical opportunity'}
- **Next Step (24-72h)**: ${n8nResult.upsellMoments?.nextStep?.implemented ? '✅' : '⚡'} ${n8nResult.upsellMoments?.nextStep?.opportunity || 'High potential'}
- **After Big Win**: ${n8nResult.upsellMoments?.afterBigWin?.implemented ? '✅' : '🏆'} ${n8nResult.upsellMoments?.afterBigWin?.opportunity || 'Success momentum'}
- **Halfway Point**: ${n8nResult.upsellMoments?.halfwayPoint?.implemented ? '✅' : '📊'} ${n8nResult.upsellMoments?.halfwayPoint?.opportunity || 'Progress trigger'}
- **Last Chance**: ${n8nResult.upsellMoments?.lastChance?.implemented ? '✅' : '⏰'} ${n8nResult.upsellMoments?.lastChance?.opportunity || 'Urgency driver'}

**Primary Strategy**: ${n8nResult.persuasionStrategy?.primaryTrigger || 'Point of Greatest Deprivation'}
**Secondary Triggers**: ${n8nResult.persuasionStrategy?.secondaryTriggers?.join(', ') || 'Social Proof, Urgency, Authority'}

**Implementation Focus**: ${n8nResult.primaryRecommendation || 'Start with "Immediately" moment for 3x higher conversion rates'}`;

          case 'coaching-methodology':
            return `🎓 **Alex Hormozi Coaching Methodology**

**Systematic Approach**: ${n8nResult.coachingApproach || 'Constraint-focused systematic resolution'}
**Primary Framework**: ${n8nResult.applicableFrameworks?.[0] || '4 Universal Constraints'}

**Alex Hormozi Insight**: "${n8nResult.alexQuote || 'Perfect one at a time - don\'t try to fix everything at once.'}"

**Coaching Strategy**:
1. **Diagnose**: ${n8nResult.diagnosticApproach || 'Identify the primary constraint'}
2. **Focus**: ${n8nResult.focusStrategy || 'Apply 100% energy to that constraint'}  
3. **Resolve**: ${n8nResult.resolutionMethod || 'Use proven frameworks systematically'}
4. **Progress**: ${n8nResult.progressionPlan || 'Move to next constraint only after resolution'}

**Expected Outcome**: ${n8nResult.expectedOutcome || 'Clear constraint resolution and sustainable growth acceleration'}`;

          default:
            return result.synthesis || result.analysis?.coachingResponse || result.orchestration?.orchestrationPlan || 'Analysis completed successfully.';
        }
      })(),
      
      analysis: [{
        agentType: targetAgent,
        findings: targetAgent === 'implementation-planner' ? [
          `Business Level: ${n8nResult.businessLevelDetection?.detectedLevel || 'Assessed'}`,
          `Primary Constraint: ${n8nResult.constraintAnalysis?.primaryConstraint || 'Identified'}`,
          `Implementation Timeline: ${n8nResult.implementationRoadmap?.constraintStabilization?.timeline || '90 days'}`,
          `Resource Requirements: ${n8nResult.implementationRoadmap?.constraintStabilization?.resourcesRequired?.[0] || 'Defined'}`
        ] : Array.isArray(result.analysis?.evidence) ? result.analysis.evidence : 
                 Array.isArray(result.analysis?.recommendations) ? result.analysis.recommendations :
                 result.analysis?.actionableRecommendations || ['Analysis completed'],
        confidence: result.analysis?.confidenceScore || n8nResult.confidenceScore || result.confidenceScore || 0.85,
        metrics: n8nResult || result.analysis || result.orchestration || {}
      }],
      
      actionItems: targetAgent === 'implementation-planner' ? [
        ...(n8nResult.implementationRoadmap?.constraintStabilization?.keyActions || []).map((action: string, index: number) => ({
          title: action,
          priority: index < 2 ? 'critical' : 'high',
          timeline: n8nResult.implementationRoadmap?.constraintStabilization?.timeline || '30 days',
          metric: 'Phase 1 completion'
        })),
        ...(n8nResult.implementationRoadmap?.systematicSolution?.keyActions || []).slice(0, 2).map((action: string) => ({
          title: action,
          priority: 'high',
          timeline: '60 days',
          metric: 'Phase 2 completion'
        }))
      ] : result.analysis?.prioritizedRecommendations?.map((rec: any, index: number) => ({
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
      
      nextSteps: targetAgent === 'implementation-planner' ? [
        `Start with Phase 1: ${n8nResult.implementationRoadmap?.constraintStabilization?.title || 'Constraint Stabilization'}`,
        `Resource allocation: ${n8nResult.implementationRoadmap?.constraintStabilization?.resourcesRequired?.[0] || 'As planned'}`,
        `Track success metrics: ${n8nResult.successMetrics?.revenueGrowth || 'Revenue growth'}`
      ] : result.analysis?.implementationPriority?.immediate || 
                 result.analysis?.recommendations?.slice(0, 3) || 
                 ['Continue with systematic implementation', 'Monitor progress weekly', 'Adjust based on results'],
      
      frameworks: targetAgent === 'implementation-planner' ? 
        n8nResult.frameworks || ['90-Day Roadmap', 'Systematic Implementation', 'Constraint Resolution'] :
        result.frameworks || result.metadata?.frameworkApplied ? [result.metadata.frameworkApplied] : 
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
      synthesis: `I understand you're looking for coaching assistance. 

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
    availableAgents: Object.keys(N8N_WEBHOOKS),
    timestamp: new Date().toISOString()
  });
}