'use client';

export interface AgentCapability {
  name: string;
  description: string;
  expertise: string[];
  priority: number;
  averageConfidence: number;
  successRate: number;
  avgResponseTime: number;
}

export interface QueryAnalysis {
  intent: string;
  complexity: 'simple' | 'medium' | 'complex' | 'strategic';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  businessContext: string[];
  frameworks: string[];
  confidence: number;
}

export interface AgentSelection {
  agent: string;
  reason: string;
  confidence: number;
  expectedFrameworks: string[];
  estimatedTime: number;
  prerequisites: string[];
}

export interface RoutingDecision {
  primary: AgentSelection;
  secondary: AgentSelection[];
  collaborativeMode: boolean;
  executionPlan: string[];
  reasoning: string;
}

export class IntelligentAgentRouter {
  private agentCapabilities: Map<string, AgentCapability> = new Map();
  private queryHistory: QueryAnalysis[] = [];
  private agentPerformance: Map<string, number[]> = new Map();

  constructor() {
    this.initializeAgentCapabilities();
  }

  private initializeAgentCapabilities() {
    const capabilities: AgentCapability[] = [
      {
        name: 'constraint-analyzer',
        description: 'Identifies and analyzes business constraints using Hormozi\'s 4 Universal Constraints',
        expertise: ['bottlenecks', 'constraints', 'growth', 'scaling', 'operations', 'diagnostics'],
        priority: 10,
        averageConfidence: 0.92,
        successRate: 0.89,
        avgResponseTime: 2.3
      },
      {
        name: 'offer-analyzer', 
        description: 'Analyzes and optimizes offers using Grand Slam Offer framework',
        expertise: ['value proposition', 'pricing', 'offer structure', 'market positioning', 'competitive analysis'],
        priority: 9,
        averageConfidence: 0.88,
        successRate: 0.85,
        avgResponseTime: 3.1
      },
      {
        name: 'money-model-architect',
        description: 'Designs and optimizes 4-prong money models for revenue multiplication',
        expertise: ['revenue streams', 'upsells', 'downsells', 'continuity', 'monetization'],
        priority: 9,
        averageConfidence: 0.86,
        successRate: 0.83,
        avgResponseTime: 4.2
      },
      {
        name: 'financial-calculator',
        description: 'Analyzes financial metrics and CFA optimization',
        expertise: ['cac', 'ltv', 'cfa', 'metrics', 'profitability', 'unit economics'],
        priority: 8,
        averageConfidence: 0.91,
        successRate: 0.87,
        avgResponseTime: 1.8
      },
      {
        name: 'psychology-optimizer',
        description: 'Optimizes customer psychology and conversion timing',
        expertise: ['conversion psychology', 'timing', 'customer behavior', 'persuasion', 'sales psychology'],
        priority: 7,
        averageConfidence: 0.84,
        successRate: 0.81,
        avgResponseTime: 2.9
      },
      {
        name: 'implementation-planner',
        description: 'Creates actionable implementation plans and roadmaps',
        expertise: ['execution', 'planning', 'roadmaps', 'project management', 'implementation'],
        priority: 6,
        averageConfidence: 0.87,
        successRate: 0.82,
        avgResponseTime: 3.5
      },
      {
        name: 'coaching-methodology',
        description: 'Provides comprehensive coaching using Alex Hormozi\'s methodologies',
        expertise: ['coaching', 'mentorship', 'strategy', 'frameworks', 'business development'],
        priority: 8,
        averageConfidence: 0.90,
        successRate: 0.88,
        avgResponseTime: 2.7
      }
    ];

    capabilities.forEach(cap => {
      this.agentCapabilities.set(cap.name, cap);
    });
  }

  // Advanced query analysis using NLP-like techniques
  analyzeQuery(query: string, businessContext?: any): QueryAnalysis {
    const queryLower = query.toLowerCase();
    const words = queryLower.split(/\s+/);
    
    // Intent detection
    const intent = this.detectIntent(queryLower, words);
    
    // Complexity assessment
    const complexity = this.assessComplexity(query, words, businessContext);
    
    // Urgency detection
    const urgency = this.detectUrgency(queryLower, words);
    
    // Business context extraction
    const businessContexts = this.extractBusinessContext(queryLower);
    
    // Framework identification
    const frameworks = this.identifyFrameworks(queryLower);
    
    // Overall confidence in analysis
    const confidence = this.calculateAnalysisConfidence(intent, complexity, urgency, businessContexts);

    const analysis: QueryAnalysis = {
      intent,
      complexity,
      urgency,
      businessContext: businessContexts,
      frameworks,
      confidence
    };

    this.queryHistory.push(analysis);
    return analysis;
  }

  // Intelligent agent routing with reasoning
  routeQuery(query: string, businessContext?: any, sessionType?: string): RoutingDecision {
    const analysis = this.analyzeQuery(query, businessContext);
    
    // Score all agents for this query
    const agentScores = this.scoreAgents(analysis, query);
    
    // Select primary agent
    const primary = this.selectPrimaryAgent(agentScores, analysis);
    
    // Select secondary/collaborative agents
    const secondary = this.selectSecondaryAgents(agentScores, analysis, primary);
    
    // Determine if collaborative mode is needed
    const collaborativeMode = this.shouldUseCollaborativeMode(analysis, primary, secondary);
    
    // Create execution plan
    const executionPlan = this.createExecutionPlan(primary, secondary, collaborativeMode);
    
    // Generate reasoning
    const reasoning = this.generateRoutingReasoning(analysis, primary, secondary, collaborativeMode);

    return {
      primary,
      secondary,
      collaborativeMode,
      executionPlan,
      reasoning
    };
  }

  private detectIntent(query: string, words: string[]): string {
    const intentPatterns = {
      'analyze': ['analyze', 'review', 'examine', 'assess', 'evaluate', 'look at'],
      'optimize': ['optimize', 'improve', 'enhance', 'better', 'increase', 'boost'],
      'diagnose': ['diagnose', 'problem', 'issue', 'wrong', 'broken', 'stuck', 'constraint'],
      'plan': ['plan', 'strategy', 'roadmap', 'implement', 'execute', 'steps'],
      'compare': ['compare', 'versus', 'vs', 'difference', 'better than'],
      'learn': ['how', 'what', 'why', 'when', 'explain', 'understand', 'teach'],
      'create': ['create', 'build', 'make', 'design', 'develop', 'generate'],
      'fix': ['fix', 'solve', 'resolve', 'address', 'handle', 'deal with']
    };

    for (const [intent, patterns] of Object.entries(intentPatterns)) {
      if (patterns.some(pattern => query.includes(pattern))) {
        return intent;
      }
    }

    return 'general';
  }

  private assessComplexity(query: string, words: string[], businessContext?: any): 'simple' | 'medium' | 'complex' | 'strategic' {
    let complexityScore = 0;
    
    // Length factor
    if (words.length > 20) complexityScore += 2;
    else if (words.length > 10) complexityScore += 1;
    
    // Multiple concepts
    const concepts = ['offer', 'money model', 'financial', 'marketing', 'sales', 'operations'];
    const conceptCount = concepts.filter(concept => query.toLowerCase().includes(concept)).length;
    complexityScore += conceptCount;
    
    // Strategic keywords
    const strategicKeywords = ['strategy', 'comprehensive', 'overall', 'entire business', 'complete analysis'];
    if (strategicKeywords.some(keyword => query.toLowerCase().includes(keyword))) {
      complexityScore += 3;
    }
    
    // Business context complexity
    if (businessContext && Object.keys(businessContext).length > 5) {
      complexityScore += 1;
    }

    if (complexityScore >= 6) return 'strategic';
    if (complexityScore >= 4) return 'complex';
    if (complexityScore >= 2) return 'medium';
    return 'simple';
  }

  private detectUrgency(query: string, words: string[]): 'low' | 'medium' | 'high' | 'critical' {
    const urgencyKeywords = {
      'critical': ['urgent', 'asap', 'immediately', 'crisis', 'emergency', 'critical', 'failing'],
      'high': ['soon', 'quickly', 'fast', 'deadline', 'important', 'priority'],
      'medium': ['when possible', 'eventually', 'planning', 'future'],
      'low': ['curious', 'wondering', 'general', 'learn', 'understand']
    };

    for (const [level, keywords] of Object.entries(urgencyKeywords)) {
      if (keywords.some(keyword => query.includes(keyword))) {
        return level as 'low' | 'medium' | 'high' | 'critical';
      }
    }

    return 'medium';
  }

  private extractBusinessContext(query: string): string[] {
    const contextPatterns = {
      'coaching': ['coaching', 'coach', 'consultant', 'service'],
      'ecommerce': ['ecommerce', 'store', 'product', 'inventory', 'shipping'],
      'saas': ['saas', 'software', 'subscription', 'recurring', 'mrr'],
      'agency': ['agency', 'client', 'marketing', 'advertising'],
      'local': ['local', 'brick and mortar', 'physical location'],
      'online': ['online', 'digital', 'internet', 'virtual'],
      'startup': ['startup', 'new business', 'launching'],
      'scaling': ['scaling', 'growth', 'expanding', 'scale']
    };

    const contexts: string[] = [];
    for (const [context, patterns] of Object.entries(contextPatterns)) {
      if (patterns.some(pattern => query.includes(pattern))) {
        contexts.push(context);
      }
    }

    return contexts;
  }

  private identifyFrameworks(query: string): string[] {
    const frameworkKeywords = {
      'Grand Slam Offer': ['offer', 'value', 'pricing', 'grand slam'],
      '4-Prong Money Model': ['money model', 'upsell', 'downsell', 'continuity', '4 prong'],
      'Client Financed Acquisition': ['cfa', 'client financed', 'customer acquisition'],
      '4 Universal Constraints': ['constraint', 'bottleneck', 'leads', 'sales', 'delivery', 'profit'],
      '5 Upsell Moments': ['upsell timing', 'when to upsell', 'upsell moments'],
      'Value Equation': ['value equation', 'dream outcome', 'likelihood', 'time delay']
    };

    const frameworks: string[] = [];
    for (const [framework, keywords] of Object.entries(frameworkKeywords)) {
      if (keywords.some(keyword => query.includes(keyword))) {
        frameworks.push(framework);
      }
    }

    return frameworks;
  }

  private calculateAnalysisConfidence(intent: string, complexity: string, urgency: string, contexts: string[]): number {
    let confidence = 0.5;
    
    // Intent clarity
    if (intent !== 'general') confidence += 0.2;
    
    // Context clarity
    confidence += Math.min(contexts.length * 0.1, 0.3);
    
    // Complexity assessment confidence
    if (complexity === 'simple') confidence += 0.1;
    
    return Math.min(confidence, 0.95);
  }

  private scoreAgents(analysis: QueryAnalysis, query: string): Map<string, number> {
    const scores = new Map<string, number>();
    
    for (const [agentName, capability] of this.agentCapabilities) {
      let score = 0;
      
      // Base capability match
      const expertiseMatches = capability.expertise.filter(exp => 
        query.toLowerCase().includes(exp.toLowerCase())
      ).length;
      score += expertiseMatches * 20;
      
      // Framework alignment
      const frameworkMatches = analysis.frameworks.filter(framework =>
        capability.expertise.some(exp => framework.toLowerCase().includes(exp.toLowerCase()))
      ).length;
      score += frameworkMatches * 15;
      
      // Historical performance
      score += capability.successRate * 10;
      score += capability.averageConfidence * 10;
      
      // Response time bonus (faster is better for urgent queries)
      if (analysis.urgency === 'critical' && capability.avgResponseTime < 2) {
        score += 10;
      }
      
      // Priority weight
      score += capability.priority;
      
      scores.set(agentName, score);
    }
    
    return scores;
  }

  private selectPrimaryAgent(agentScores: Map<string, number>, analysis: QueryAnalysis): AgentSelection {
    const sortedAgents = Array.from(agentScores.entries())
      .sort(([,a], [,b]) => b - a);
    
    const [agentName, score] = sortedAgents[0];
    const capability = this.agentCapabilities.get(agentName)!;
    
    return {
      agent: agentName,
      reason: `Best match for ${analysis.intent} intent with ${Math.round(score)} compatibility score`,
      confidence: Math.min(score / 100, 0.95),
      expectedFrameworks: analysis.frameworks,
      estimatedTime: capability.avgResponseTime,
      prerequisites: []
    };
  }

  private selectSecondaryAgents(agentScores: Map<string, number>, analysis: QueryAnalysis, primary: AgentSelection): AgentSelection[] {
    const secondary: AgentSelection[] = [];
    const sortedAgents = Array.from(agentScores.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(1, 4); // Take top 3 secondary agents
    
    for (const [agentName, score] of sortedAgents) {
      if (score > 30 && agentName !== primary.agent) { // Only include if reasonably good match
        const capability = this.agentCapabilities.get(agentName)!;
        secondary.push({
          agent: agentName,
          reason: `Complementary expertise for ${analysis.complexity} analysis`,
          confidence: Math.min(score / 120, 0.85),
          expectedFrameworks: [],
          estimatedTime: capability.avgResponseTime,
          prerequisites: [primary.agent]
        });
      }
    }
    
    return secondary;
  }

  private shouldUseCollaborativeMode(analysis: QueryAnalysis, primary: AgentSelection, secondary: AgentSelection[]): boolean {
    return analysis.complexity === 'strategic' || 
           analysis.complexity === 'complex' ||
           analysis.frameworks.length > 2 ||
           secondary.length > 1;
  }

  private createExecutionPlan(primary: AgentSelection, secondary: AgentSelection[], collaborative: boolean): string[] {
    const plan: string[] = [];
    
    if (collaborative && secondary.length > 0) {
      plan.push(`1. Initialize collaborative analysis session`);
      plan.push(`2. ${primary.agent} leads primary analysis`);
      plan.push(`3. ${secondary.map(s => s.agent).join(', ')} provide complementary insights`);
      plan.push(`4. Cross-validate findings and recommendations`);
      plan.push(`5. Synthesize comprehensive response`);
    } else {
      plan.push(`1. ${primary.agent} performs focused analysis`);
      if (secondary.length > 0) {
        plan.push(`2. ${secondary[0].agent} validates findings`);
      }
      plan.push(`3. Generate actionable recommendations`);
    }
    
    return plan;
  }

  private generateRoutingReasoning(analysis: QueryAnalysis, primary: AgentSelection, secondary: AgentSelection[], collaborative: boolean): string {
    let reasoning = `Query analyzed as ${analysis.complexity} ${analysis.intent} with ${Math.round(analysis.confidence * 100)}% confidence. `;
    reasoning += `Selected ${primary.agent} as primary agent due to ${primary.reason}. `;
    
    if (collaborative) {
      reasoning += `Collaborative mode enabled with ${secondary.length} supporting agents for comprehensive analysis. `;
    }
    
    if (analysis.urgency === 'critical' || analysis.urgency === 'high') {
      reasoning += `High priority routing due to ${analysis.urgency} urgency. `;
    }
    
    return reasoning;
  }

  // Performance tracking
  updateAgentPerformance(agentName: string, confidence: number, success: boolean) {
    if (!this.agentPerformance.has(agentName)) {
      this.agentPerformance.set(agentName, []);
    }
    
    const performance = this.agentPerformance.get(agentName)!;
    performance.push(success ? confidence : 0);
    
    // Keep only last 50 performances
    if (performance.length > 50) {
      performance.shift();
    }
    
    // Update capability stats
    const capability = this.agentCapabilities.get(agentName);
    if (capability) {
      capability.averageConfidence = performance.reduce((sum, val) => sum + val, 0) / performance.length;
      capability.successRate = performance.filter(val => val > 0).length / performance.length;
    }
  }

  // Get routing analytics
  getRoutingAnalytics() {
    return {
      totalQueries: this.queryHistory.length,
      agentPerformance: Array.from(this.agentCapabilities.entries()).map(([name, capability]) => ({
        name,
        successRate: capability.successRate,
        averageConfidence: capability.averageConfidence,
        avgResponseTime: capability.avgResponseTime
      })),
      queryComplexityDistribution: {
        simple: this.queryHistory.filter(q => q.complexity === 'simple').length,
        medium: this.queryHistory.filter(q => q.complexity === 'medium').length,
        complex: this.queryHistory.filter(q => q.complexity === 'complex').length,
        strategic: this.queryHistory.filter(q => q.complexity === 'strategic').length
      }
    };
  }
}