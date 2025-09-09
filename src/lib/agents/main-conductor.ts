// Alex Hormozi AI Coaching Orchestra - Main Conductor
// Central intelligence hub that routes queries and orchestrates N8n workflow agents

export interface CoachingSession {
  userId: string;
  businessContext: BusinessContext;
  query: string;
  sessionType: 'diagnostic' | 'strategic' | 'implementation';
}

export interface BusinessContext {
  industry?: string;
  currentRevenue?: number;
  customerCount?: number;
  cac?: number;
  ltv?: number;
  grossMargin?: number;
  businessStage: 'startup' | 'growth' | 'scale' | 'mature';
}

export interface CoachingResponse {
  analysis: AgentAnalysis[];
  synthesis: string;
  actionItems: ActionItem[];
  nextSteps: string[];
  frameworks: string[];
  mcpData?: any;
}

export interface AgentAnalysis {
  agentType: string;
  findings: string[];
  recommendations: string[];
  metrics?: any;
  confidence: number;
}

export interface ActionItem {
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  timeline: string;
  frameworks: string[];
  mcpSupport?: string;
}

export class MainConductor {
  private n8nBaseUrl: string;

  constructor() {
    // N8n webhook URLs - using environment variables
    this.n8nBaseUrl = process.env.N8N_WEBHOOK_BASE_URL || 'https://purposewaze.app.n8n.cloud/webhook-test';
  }

  async conductCoachingSession(session: CoachingSession): Promise<CoachingResponse> {
    const { query, businessContext, sessionType, userId } = session;

    try {
      // Call our new API endpoint that handles N8n webhooks
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          businessContext,
          sessionType,
          userId,
          agent: 'master-conductor' // Start with master conductor
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Return the formatted response from our API
      return {
        analysis: data.analysis || [],
        synthesis: data.synthesis,
        actionItems: data.actionItems || [],
        nextSteps: data.nextSteps || [],
        frameworks: data.frameworks || []
      };
      
    } catch (error) {
      console.error('Error in coaching session:', error);
      // Ultimate fallback with Alex Hormozi principles
      return this.fallbackToDirectAgents(query, businessContext, sessionType);
    }
  }

  private async fallbackToDirectAgents(query: string, businessContext: BusinessContext, sessionType: string): Promise<CoachingResponse> {
    // Original logic preserved as fallback
    const requiredAgents = this.determineRequiredAgents(query, sessionType);
    const analyses: AgentAnalysis[] = [];

    if (requiredAgents.includes('offer')) {
      analyses.push(await this.callOfferAnalyzer(query, businessContext, sessionType));
    }

    if (requiredAgents.includes('money-model')) {
      analyses.push(await this.callMoneyModelArchitect(query, businessContext, sessionType));
    }

    if (requiredAgents.includes('financial')) {
      analyses.push(await this.callFinancialCalculator(query, businessContext, sessionType));
    }

    if (requiredAgents.includes('psychology')) {
      analyses.push(await this.callPsychologyOptimizer(query, businessContext, sessionType));
    }

    if (requiredAgents.includes('implementation')) {
      analyses.push(await this.callImplementationPlanner(query, businessContext, sessionType, analyses));
    }

    if (requiredAgents.includes('constraint-analyzer')) {
      analyses.push(await this.callConstraintAnalyzer(query, businessContext, sessionType));
    }

    if (requiredAgents.includes('coaching-methodology')) {
      analyses.push(await this.callCoachingMethodology(query, businessContext, sessionType));
    }

    // 3. Synthesize findings using Hormozi meta-frameworks
    const synthesis = this.synthesizeFindings(analyses, businessContext);

    // 4. Generate prioritized action items
    const actionItems = this.generateActionItems(analyses, businessContext);

    // 5. Provide next steps
    const nextSteps = this.generateNextSteps(analyses, businessContext);

    // 6. Identify applicable frameworks
    const frameworks = this.identifyFrameworks(analyses);

    return {
      analysis: analyses,
      synthesis,
      actionItems,
      nextSteps,
      frameworks
    };
  }

  private determineRequiredAgents(query: string, sessionType: string): string[] {
    const queryLower = query.toLowerCase();
    const agents: string[] = [];

    // Always start with constraint analysis for comprehensive coaching
    if (!queryLower.includes('just tell me') && !queryLower.includes('only need')) {
      agents.push('constraint-analyzer');
    }

    // Keyword-based routing logic
    if (this.matchesOfferKeywords(queryLower)) {
      agents.push('offer');
    }

    if (this.matchesMoneyModelKeywords(queryLower)) {
      agents.push('money-model');
    }

    if (this.matchesFinancialKeywords(queryLower)) {
      agents.push('financial');
    }

    if (this.matchesPsychologyKeywords(queryLower)) {
      agents.push('psychology');
    }

    if (this.matchesImplementationKeywords(queryLower)) {
      agents.push('implementation');
    }

    // Add coaching methodology for comprehensive coaching queries
    if (this.matchesCoachingKeywords(queryLower)) {
      agents.push('coaching-methodology');
    }

    // For strategic sessions, engage all agents
    if (sessionType === 'strategic') {
      return ['constraint-analyzer', 'coaching-methodology', 'offer', 'money-model', 'financial', 'psychology', 'implementation'];
    }

    // Default to constraint analysis if no specific matches
    return agents.length > 0 ? agents : ['constraint-analyzer'];
  }

  private matchesOfferKeywords(query: string): boolean {
    const keywords = ['offer', 'value', 'pricing', 'positioning', 'competitor', 'market'];
    return keywords.some(keyword => query.includes(keyword));
  }

  private matchesMoneyModelKeywords(query: string): boolean {
    const keywords = ['revenue', 'upsell', 'downsell', 'continuity', 'money model', 'monetize'];
    return keywords.some(keyword => query.includes(keyword));
  }

  private matchesFinancialKeywords(query: string): boolean {
    const keywords = ['cac', 'ltv', 'profit', 'margin', 'metrics', 'payback', 'financial'];
    return keywords.some(keyword => query.includes(keyword));
  }

  private matchesPsychologyKeywords(query: string): boolean {
    const keywords = ['conversion', 'psychology', 'timing', 'behavior', 'customer', 'buying'];
    return keywords.some(keyword => query.includes(keyword));
  }

  private matchesImplementationKeywords(query: string): boolean {
    const keywords = ['implement', 'execute', 'plan', 'next steps', 'action', 'roadmap'];
    return keywords.some(keyword => query.includes(keyword));
  }

  private matchesCoachingKeywords(query: string): boolean {
    const keywords = ['coaching', 'methodology', 'framework', 'constraint', 'bottleneck', 'growth', 'analyze', 'diagnostic'];
    return keywords.some(keyword => query.includes(keyword));
  }

  private synthesizeFindings(analyses: AgentAnalysis[], context: BusinessContext): string {
    // Alex Hormozi's meta-synthesis approach
    let synthesis = "Based on the comprehensive analysis using Alex Hormozi's frameworks:\n\n";

    // Identify the biggest leverage point
    const leveragePoint = this.identifyBiggestLeverage(analyses, context);
    synthesis += `**Biggest Leverage Opportunity**: ${leveragePoint}\n\n`;

    // Apply the three fundamental business numbers
    const fundamentals = this.analyzeFundamentals(analyses, context);
    synthesis += `**Business Fundamentals Assessment**:\n${fundamentals}\n\n`;

    // Provide strategic direction
    const strategic = this.provideStrategicDirection(analyses, context);
    synthesis += `**Strategic Direction**: ${strategic}\n\n`;

    return synthesis;
  }

  private identifyBiggestLeverage(analyses: AgentAnalysis[], context: BusinessContext): string {
    // Hormozi prioritization: 1) CFA achievement, 2) Offer optimization, 3) Scale constraints
    
    const financialAnalysis = analyses.find(a => a.agentType === 'financial');
    if (financialAnalysis && this.needsCFAWork(context)) {
      return "Achieving Client Financed Acquisition (30-day gross profit > CAC) - this will unlock unlimited growth";
    }

    const offerAnalysis = analyses.find(a => a.agentType === 'offer');
    if (offerAnalysis && this.needsOfferWork(context)) {
      return "Grand Slam Offer optimization - improving your value equation to command premium pricing";
    }

    return "Money model architecture - building systematic revenue optimization";
  }

  private needsCFAWork(context: BusinessContext): boolean {
    if (!context.cac || !context.grossMargin) return true;
    // Calculate if 30-day gross profit > CAC
    const monthlyRevenue = context.currentRevenue ? context.currentRevenue / 12 : 0;
    const grossProfitPerCustomer = monthlyRevenue * (context.grossMargin / 100) / (context.customerCount || 1);
    return grossProfitPerCustomer <= context.cac;
  }

  private needsOfferWork(context: BusinessContext): boolean {
    // Heuristic: if gross margin < 80% for service business, offer needs work
    return !context.grossMargin || context.grossMargin < 80;
  }

  private analyzeFundamentals(analyses: AgentAnalysis[], context: BusinessContext): string {
    let fundamentals = "";
    
    // The three numbers that matter: CAC, GP, Payback Period
    if (context.cac && context.grossMargin) {
      const level = this.determineAdvertisingLevel(context);
      fundamentals += `• **Advertising Level**: ${level}\n`;
    }

    fundamentals += `• **Current Business Stage**: ${context.businessStage}\n`;
    fundamentals += `• **Primary Constraint**: ${this.identifyConstraint(analyses, context)}\n`;

    return fundamentals;
  }

  private determineAdvertisingLevel(context: BusinessContext): string {
    if (!context.cac || !context.ltv || !context.grossMargin) return "Data insufficient";

    const ltv = context.ltv;
    const cac = context.cac;
    
    // Calculate 30-day gross profit (simplified)
    const monthlyRevenue = context.currentRevenue ? context.currentRevenue / 12 : 0;
    const grossProfitPerCustomer = monthlyRevenue * (context.grossMargin / 100) / (context.customerCount || 1);

    if (ltv <= cac) return "Level 0 (Unprofitable - Critical Issue)";
    if (grossProfitPerCustomer <= cac) return "Level 1 (Basic Viability - Needs Improvement)";
    if (grossProfitPerCustomer <= cac * 2) return "Level 2 (Self-Funding Growth - Good)";
    return "Level 3 (Unlimited Scale - Excellent)";
  }

  private identifyConstraint(analyses: AgentAnalysis[], context: BusinessContext): string {
    // Hormozi constraint identification
    if (this.needsCFAWork(context)) return "Cash flow and growth funding";
    if (this.needsOfferWork(context)) return "Offer attractiveness and pricing power";
    return "Operational capacity and systems";
  }

  private provideStrategicDirection(analyses: AgentAnalysis[], context: BusinessContext): string {
    // Alex Hormozi's strategic prioritization
    if (context.businessStage === 'startup') {
      return "Focus on achieving Product-Market Fit through Grand Slam Offer development, then optimize for Client Financed Acquisition.";
    }
    if (context.businessStage === 'growth') {
      return "Prioritize money model architecture and CFA achievement to enable unlimited advertising scale.";
    }
    if (context.businessStage === 'scale') {
      return "Optimize operational constraints and build systematic revenue optimization across all touchpoints.";
    }
    return "Focus on strategic acquisitions and market expansion while maintaining CFA across all channels.";
  }

  private generateActionItems(analyses: AgentAnalysis[], context: BusinessContext): ActionItem[] {
    const actionItems: ActionItem[] = [];

    analyses.forEach(analysis => {
      analysis.recommendations.forEach(rec => {
        actionItems.push({
          title: this.extractActionTitle(rec),
          description: rec,
          priority: this.determinePriority(rec, context),
          timeline: this.estimateTimeline(rec),
          frameworks: this.identifyApplicableFrameworks(rec)
        });
      });
    });

    // Sort by priority and return top 8
    return actionItems
      .sort((a, b) => this.getPriorityWeight(a.priority) - this.getPriorityWeight(b.priority))
      .slice(0, 8);
  }

  private extractActionTitle(recommendation: string): string {
    // Extract the first actionable phrase
    const match = recommendation.match(/^([^.!?]*[.!?])/);
    return match ? match[1].substring(0, 60) + '...' : recommendation.substring(0, 60) + '...';
  }

  private determinePriority(recommendation: string, context: BusinessContext): 'critical' | 'high' | 'medium' | 'low' {
    const criticalKeywords = ['cfa', 'cash flow', 'acquisition cost', 'gross profit'];
    const highKeywords = ['offer', 'pricing', 'value', 'upsell'];
    
    const recLower = recommendation.toLowerCase();
    
    if (criticalKeywords.some(keyword => recLower.includes(keyword))) return 'critical';
    if (highKeywords.some(keyword => recLower.includes(keyword))) return 'high';
    return 'medium';
  }

  private estimateTimeline(recommendation: string): string {
    if (recommendation.toLowerCase().includes('test') || recommendation.toLowerCase().includes('experiment')) {
      return '1-2 weeks';
    }
    if (recommendation.toLowerCase().includes('implement') || recommendation.toLowerCase().includes('build')) {
      return '2-4 weeks';
    }
    return '1-2 weeks';
  }

  private identifyApplicableFrameworks(recommendation: string): string[] {
    const frameworks: string[] = [];
    const recLower = recommendation.toLowerCase();

    if (recLower.includes('cfa') || recLower.includes('client financed')) {
      frameworks.push('Client Financed Acquisition');
    }
    if (recLower.includes('offer') || recLower.includes('value equation')) {
      frameworks.push('Grand Slam Offer');
    }
    if (recLower.includes('upsell') || recLower.includes('4 prong')) {
      frameworks.push('4-Prong Money Model');
    }
    if (recLower.includes('timing') || recLower.includes('moment')) {
      frameworks.push('5 Upsell Moments');
    }

    return frameworks;
  }

  private getPriorityWeight(priority: string): number {
    const weights = { critical: 1, high: 2, medium: 3, low: 4 };
    return weights[priority as keyof typeof weights] || 4;
  }

  private generateNextSteps(analyses: AgentAnalysis[], context: BusinessContext): string[] {
    const steps: string[] = [];

    // Hormozi's systematic approach
    if (this.needsCFAWork(context)) {
      steps.push("Calculate your current 30-day gross profit per customer");
      steps.push("Identify immediate upsell opportunities to reach CFA");
      steps.push("Test the top 3 CFA strategies within 2 weeks");
    } else {
      steps.push("Document your current money model architecture");
      steps.push("Identify the next constraint limiting growth");
      steps.push("Scale advertising spend systematically");
    }

    steps.push("Schedule weekly metrics review to track progress");
    return steps;
  }

  private identifyFrameworks(analyses: AgentAnalysis[]): string[] {
    const allFrameworks = new Set<string>();
    
    analyses.forEach(analysis => {
      // Extract frameworks from analysis
      if (analysis.agentType === 'offer') {
        allFrameworks.add('Grand Slam Offer');
        allFrameworks.add('Value Equation');
      }
      if (analysis.agentType === 'money-model') {
        allFrameworks.add('4-Prong Money Model');
        allFrameworks.add('Sequential Offers');
      }
      if (analysis.agentType === 'financial') {
        allFrameworks.add('Client Financed Acquisition');
        allFrameworks.add('3 Levels of Advertising');
      }
      if (analysis.agentType === 'psychology') {
        allFrameworks.add('5 Upsell Moments');
        allFrameworks.add('Point of Greatest Deprivation');
      }
    });

    return Array.from(allFrameworks);
  }

  // Master Conductor N8n Workflow Integration
  private async callMasterConductor(query: string, businessContext: BusinessContext, sessionType: string): Promise<any> {
    try {
      const response = await fetch(process.env.N8N_MASTER_CONDUCTOR || `${this.n8nBaseUrl}/master-conductor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          businessContext,
          sessionType,
          userId: 'frontend-user'
        })
      });

      if (!response.ok) {
        throw new Error(`Master Conductor API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error calling Master Conductor workflow:', error);
      throw error;
    }
  }

  // Individual Agent N8n Workflow Integration Methods
  private async callOfferAnalyzer(query: string, businessContext: BusinessContext, sessionType: string): Promise<AgentAnalysis> {
    try {
      const response = await fetch(process.env.N8N_OFFER_ANALYZER || `${this.n8nBaseUrl}/offer-analyzer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          businessContext,
          sessionType
        })
      });

      if (!response.ok) {
        throw new Error(`Offer Analyzer API error: ${response.status}`);
      }

      const data = await response.json();
      return this.convertOfferAnalysisToAgentAnalysis(data);
    } catch (error) {
      console.error('Error calling Offer Analyzer workflow:', error);
      return {
        agentType: 'offer',
        findings: ['Error connecting to Offer Analyzer workflow'],
        recommendations: ['Please check N8n workflow configuration'],
        confidence: 0
      };
    }
  }

  private async callFinancialCalculator(query: string, businessContext: BusinessContext, sessionType: string): Promise<AgentAnalysis> {
    try {
      const response = await fetch(process.env.N8N_FINANCIAL_CALCULATOR || `${this.n8nBaseUrl}/financial-calculator`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          businessContext,
          sessionType
        })
      });

      if (!response.ok) {
        throw new Error(`Financial Calculator API error: ${response.status}`);
      }

      const data = await response.json();
      return this.convertFinancialAnalysisToAgentAnalysis(data);
    } catch (error) {
      console.error('Error calling Financial Calculator workflow:', error);
      return {
        agentType: 'financial',
        findings: ['Error connecting to Financial Calculator workflow'],
        recommendations: ['Please check N8n workflow configuration'],
        confidence: 0
      };
    }
  }

  private async callMoneyModelArchitect(query: string, businessContext: BusinessContext, sessionType: string): Promise<AgentAnalysis> {
    try {
      const response = await fetch(process.env.N8N_MONEY_MODEL_ARCHITECT || `${this.n8nBaseUrl}/money-model-architect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          businessContext,
          sessionType
        })
      });

      if (!response.ok) {
        throw new Error(`Money Model Architect API error: ${response.status}`);
      }

      const data = await response.json();
      return this.convertMoneyModelAnalysisToAgentAnalysis(data);
    } catch (error) {
      console.error('Error calling Money Model Architect workflow:', error);
      return {
        agentType: 'money-model',
        findings: ['Error connecting to Money Model Architect workflow'],
        recommendations: ['Please check N8n workflow configuration'],
        confidence: 0
      };
    }
  }

  private async callPsychologyOptimizer(query: string, businessContext: BusinessContext, sessionType: string): Promise<AgentAnalysis> {
    try {
      const response = await fetch(process.env.N8N_PSYCHOLOGY_OPTIMIZER || `${this.n8nBaseUrl}/psychology-optimizer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          businessContext,
          sessionType
        })
      });

      if (!response.ok) {
        throw new Error(`Psychology Optimizer API error: ${response.status}`);
      }

      const data = await response.json();
      return this.convertPsychologyAnalysisToAgentAnalysis(data);
    } catch (error) {
      console.error('Error calling Psychology Optimizer workflow:', error);
      return {
        agentType: 'psychology',
        findings: ['Error connecting to Psychology Optimizer workflow'],
        recommendations: ['Please check N8n workflow configuration'],
        confidence: 0
      };
    }
  }

  private async callImplementationPlanner(query: string, businessContext: BusinessContext, sessionType: string, otherAnalyses: AgentAnalysis[]): Promise<AgentAnalysis> {
    try {
      const response = await fetch(process.env.N8N_IMPLEMENTATION_PLANNER || `${this.n8nBaseUrl}/implementation-planner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          businessContext,
          sessionType,
          agentInputs: otherAnalyses
        })
      });

      if (!response.ok) {
        throw new Error(`Implementation Planner API error: ${response.status}`);
      }

      const data = await response.json();
      return this.convertImplementationAnalysisToAgentAnalysis(data);
    } catch (error) {
      console.error('Error calling Implementation Planner workflow:', error);
      return {
        agentType: 'implementation',
        findings: ['Error connecting to Implementation Planner workflow'],
        recommendations: ['Please check N8n workflow configuration'],
        confidence: 0
      };
    }
  }

  // Data conversion methods to transform N8n workflow responses to AgentAnalysis format
  private convertOfferAnalysisToAgentAnalysis(data: any): AgentAnalysis {
    const analysis = data?.analysis;
    if (!analysis) {
      return {
        agentType: 'offer',
        findings: ['Invalid response from Offer Analyzer'],
        recommendations: ['Check workflow configuration'],
        confidence: 0
      };
    }

    const businessInsights = data?.businessInsights || {};
    const isCoaching = businessInsights.isCoachingBusiness;

    return {
      agentType: 'offer',
      findings: [
        `Value Equation Score: ${businessInsights.valueEquationTotal || 'N/A'}`,
        `Dream Outcome: ${analysis.valueEquationScores?.dreamOutcome || 0}/100`,
        `Perceived Likelihood: ${analysis.valueEquationScores?.perceivedLikelihood || 0}/100`,
        `Time Delay: ${analysis.valueEquationScores?.timeDelay || 0}/100`,
        `Effort & Sacrifice: ${analysis.valueEquationScores?.effortSacrifice || 0}/100`,
        ...(analysis.offerStrengths || []),
        ...(isCoaching ? ['Coaching-specific analysis completed'] : [])
      ],
      recommendations: [
        ...(analysis.implementationPriority?.immediate || []),
        ...(analysis.actionableRecommendations || []),
        ...(isCoaching && analysis.coachingSpecificInsights ? [
          `Authority: ${analysis.coachingSpecificInsights.authorityOpportunities?.[0] || 'Build credibility'}`,
          `Delivery: ${analysis.coachingSpecificInsights.deliveryOptimization?.[0] || 'Optimize model'}`,
          `Community: ${analysis.coachingSpecificInsights.communityIntegration?.[0] || 'Add accountability'}`
        ] : [])
      ].slice(0, 8), // Limit to 8 recommendations
      metrics: {
        valueEquationScores: analysis.valueEquationScores,
        competitiveAdvantages: analysis.competitiveAdvantages,
        expectedImpact: analysis.expectedImpact,
        coachingSpecificInsights: isCoaching ? analysis.coachingSpecificInsights : null,
        implementationPriority: analysis.implementationPriority
      },
      confidence: analysis.confidenceScore || 0
    };
  }

  private convertFinancialAnalysisToAgentAnalysis(data: any): AgentAnalysis {
    const analysis = data?.analysis;
    if (!analysis) {
      return {
        agentType: 'financial',
        findings: ['Invalid response from Financial Calculator'],
        recommendations: ['Check workflow configuration'],
        confidence: 0
      };
    }

    return {
      agentType: 'financial',
      findings: [
        `Current CFA Status: ${analysis.cfaAnalysis?.gapAnalysis || 'Unknown'}`,
        `Advertising Level: ${analysis.advertisingLevel?.current || 0}`,
        `CAC: $${analysis.metricsAnalysis?.cac || 0}`,
        `LTV: $${analysis.metricsAnalysis?.ltv || 0}`,
        `Payback Period: ${analysis.metricsAnalysis?.paybackPeriod || 0} days`
      ],
      recommendations: analysis.optimizationRecommendations || [],
      metrics: {
        cfaAnalysis: analysis.cfaAnalysis,
        advertisingLevel: analysis.advertisingLevel,
        metricsAnalysis: analysis.metricsAnalysis
      },
      confidence: analysis.confidenceScore || 0
    };
  }

  private convertMoneyModelAnalysisToAgentAnalysis(data: any): AgentAnalysis {
    const analysis = data?.analysis;
    if (!analysis) {
      return {
        agentType: 'money-model',
        findings: ['Invalid response from Money Model Architect'],
        recommendations: ['Check workflow configuration'],
        confidence: 0
      };
    }

    return {
      agentType: 'money-model',
      findings: [
        `Current Model Structure: ${analysis.currentModel?.structure || 'Unknown'}`,
        `Attraction Offer: ${analysis.prongAnalysis?.attraction?.exists ? 'Implemented' : 'Missing'}`,
        `Upsell Sequence: ${analysis.prongAnalysis?.upsell?.exists ? 'Implemented' : 'Missing'}`,
        `Downsell Options: ${analysis.prongAnalysis?.downsell?.exists ? 'Implemented' : 'Missing'}`,
        `Continuity Revenue: ${analysis.prongAnalysis?.continuity?.exists ? 'Implemented' : 'Missing'}`
      ],
      recommendations: analysis.revenueOptimization || [],
      metrics: {
        prongAnalysis: analysis.prongAnalysis,
        projectedImpact: analysis.projectedImpact
      },
      confidence: analysis.confidenceScore || 0
    };
  }

  private convertPsychologyAnalysisToAgentAnalysis(data: any): AgentAnalysis {
    const analysis = data?.analysis;
    if (!analysis) {
      return {
        agentType: 'psychology',
        findings: ['Invalid response from Psychology Optimizer'],
        recommendations: ['Check workflow configuration'],
        confidence: 0
      };
    }

    const moments = analysis.upsellMoments;
    return {
      agentType: 'psychology',
      findings: [
        `Immediate Upsell: ${moments?.immediately?.implemented ? 'Implemented' : 'Missing'}`,
        `Next Step (24-72h): ${moments?.nextStep?.implemented ? 'Implemented' : 'Missing'}`,
        `After Big Win: ${moments?.afterBigWin?.implemented ? 'Implemented' : 'Missing'}`,
        `Halfway Point: ${moments?.halfwayPoint?.implemented ? 'Implemented' : 'Missing'}`,
        `Last Chance: ${moments?.lastChance?.implemented ? 'Implemented' : 'Missing'}`
      ],
      recommendations: analysis.conversionOptimization || [],
      metrics: {
        upsellMoments: analysis.upsellMoments,
        persuasionStrategy: analysis.persuasionStrategy
      },
      confidence: analysis.confidenceScore || 0
    };
  }

  private convertImplementationAnalysisToAgentAnalysis(data: any): AgentAnalysis {
    const analysis = data?.analysis;
    if (!analysis) {
      return {
        agentType: 'implementation',
        findings: ['Invalid response from Implementation Planner'],
        recommendations: ['Check workflow configuration'],
        confidence: 0
      };
    }

    return {
      agentType: 'implementation',
      findings: [
        `Critical Actions: ${analysis.prioritizedActions?.critical?.length || 0}`,
        `High Priority Actions: ${analysis.prioritizedActions?.high?.length || 0}`,
        `Medium Priority Actions: ${analysis.prioritizedActions?.medium?.length || 0}`,
        `Estimated Duration: ${analysis.implementationRoadmap?.phase1?.duration || 'Unknown'}`
      ],
      recommendations: [
        ...(analysis.prioritizedActions?.critical?.map((action: any) => action.action) || []),
        ...(analysis.prioritizedActions?.high?.map((action: any) => action.action) || [])
      ].slice(0, 5),
      metrics: {
        implementationRoadmap: analysis.implementationRoadmap,
        resourceRequirements: analysis.resourceRequirements
      },
      confidence: analysis.confidenceScore || 0
    };
  }

  // New Agent Integration Methods
  private async callConstraintAnalyzer(query: string, businessContext: BusinessContext, sessionType: string): Promise<AgentAnalysis> {
    try {
      const response = await fetch(process.env.N8N_CONSTRAINT_ANALYZER || `${this.n8nBaseUrl}/constraint-analyzer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          businessContext,
          sessionType
        })
      });

      if (!response.ok) {
        throw new Error(`Constraint Analyzer API error: ${response.status}`);
      }

      const data = await response.json();
      return this.convertConstraintAnalysisToAgentAnalysis(data);
    } catch (error) {
      console.error('Error calling Constraint Analyzer workflow:', error);
      return {
        agentType: 'constraint-analyzer',
        findings: ['Error connecting to Constraint Analyzer workflow'],
        recommendations: ['Please check N8n workflow configuration'],
        confidence: 0
      };
    }
  }

  private async callCoachingMethodology(query: string, businessContext: BusinessContext, sessionType: string): Promise<AgentAnalysis> {
    try {
      const response = await fetch(process.env.N8N_COACHING_METHODOLOGY || `${this.n8nBaseUrl}/coaching-methodology`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          businessContext,
          sessionType
        })
      });

      if (!response.ok) {
        throw new Error(`Coaching Methodology API error: ${response.status}`);
      }

      const data = await response.json();
      return this.convertCoachingMethodologyToAgentAnalysis(data);
    } catch (error) {
      console.error('Error calling Coaching Methodology workflow:', error);
      return {
        agentType: 'coaching-methodology',
        findings: ['Error connecting to Coaching Methodology workflow'],
        recommendations: ['Please check N8n workflow configuration'],
        confidence: 0
      };
    }
  }

  // New Data Conversion Methods
  private convertConstraintAnalysisToAgentAnalysis(data: any): AgentAnalysis {
    const analysis = data?.analysis;
    if (!analysis) {
      return {
        agentType: 'constraint-analyzer',
        findings: ['Invalid response from Constraint Analyzer'],
        recommendations: ['Check workflow configuration'],
        confidence: 0
      };
    }

    return {
      agentType: 'constraint-analyzer',
      findings: [
        `Primary Constraint: ${analysis.primaryConstraint || 'Unknown'}`,
        `Constraint Evidence: ${analysis.constraintEvidence || 'Not provided'}`,
        `Root Cause: ${analysis.rootCause || 'Not analyzed'}`,
        `Next Constraint: ${analysis.nextConstraint || 'Unknown'}`
      ],
      recommendations: [
        ...(Array.isArray(analysis.actionPlan) ? 
          analysis.actionPlan.map((action: any) => action.step || action) : 
          [analysis.actionPlan || 'No action plan provided']
        )
      ].slice(0, 8),
      metrics: {
        primaryConstraint: analysis.primaryConstraint,
        applicableFrameworks: analysis.applicableFrameworks,
        expectedOutcomes: analysis.expectedOutcomes
      },
      confidence: analysis.confidenceScore || 0.8
    };
  }

  private convertCoachingMethodologyToAgentAnalysis(data: any): AgentAnalysis {
    const analysis = data?.analysis;
    if (!analysis) {
      return {
        agentType: 'coaching-methodology',
        findings: ['Invalid response from Coaching Methodology'],
        recommendations: ['Check workflow configuration'],
        confidence: 0
      };
    }

    return {
      agentType: 'coaching-methodology',
      findings: [
        `Primary Constraint: ${analysis.primaryConstraint || 'Unknown'}`,
        `Applied Frameworks: ${(analysis.applicableFrameworks || []).join(', ') || 'None'}`,
        `Alex Quote: "${analysis.alexQuote || 'Focus on what moves the needle'}"`,
        `Expected Outcomes: ${analysis.expectedOutcomes || 'Not specified'}`
      ],
      recommendations: [
        analysis.coachingResponse || 'No coaching response provided',
        ...(Array.isArray(analysis.actionPlan) ? 
          analysis.actionPlan.map((action: any) => action.step || action) : 
          []
        )
      ].slice(0, 8),
      metrics: {
        primaryConstraint: analysis.primaryConstraint,
        applicableFrameworks: analysis.applicableFrameworks,
        alexQuote: analysis.alexQuote,
        coachingResponse: analysis.coachingResponse
      },
      confidence: analysis.confidenceScore || 0.9
    };
  }
}