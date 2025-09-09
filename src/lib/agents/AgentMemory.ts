'use client';

export interface ConversationTurn {
  id: string;
  timestamp: Date;
  userQuery: string;
  agentResponse: string;
  selectedAgent: string;
  queryAnalysis: {
    intent: string;
    complexity: 'simple' | 'medium' | 'complex' | 'strategic';
    urgency: 'low' | 'medium' | 'high' | 'critical';
    businessContext: string[];
    frameworks: string[];
    confidence: number;
  };
  success: boolean;
  userFeedback?: 'positive' | 'negative' | 'neutral';
  executionTime: number;
  insights: string[];
  followUpSuggestions: string[];
}

export interface BusinessContext {
  industry?: string;
  businessModel?: string;
  currentRevenue?: number;
  teamSize?: number;
  mainChallenges: string[];
  successMetrics: string[];
  previousAnalyses: string[];
  preferredFrameworks: string[];
  avoidedTopics: string[];
  communicationStyle?: 'direct' | 'detailed' | 'casual' | 'formal';
  expertiseLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface AgentPersonalization {
  userId?: string;
  sessionId: string;
  conversationHistory: ConversationTurn[];
  businessContext: BusinessContext;
  learningPatterns: {
    preferredAgents: Map<string, number>;
    effectiveFrameworks: Map<string, number>;
    successfulQueryTypes: string[];
    commonMisunderstandings: string[];
    improvementAreas: string[];
  };
  contextualMemory: {
    recentTopics: string[];
    ongoingProjects: string[];
    pastRecommendations: string[];
    implementedSuggestions: string[];
    currentGoals: string[];
  };
  adaptations: {
    responseStyle: string;
    detailLevel: 'brief' | 'moderate' | 'comprehensive';
    visualPreferences: string[];
    preferredExamples: string[];
  };
}

export class AgentMemorySystem {
  private memory = new Map<string, AgentPersonalization>();
  private globalPatterns = new Map<string, number>();
  private frameworkEffectiveness = new Map<string, { success: number; total: number }>();

  constructor() {
    this.initializeGlobalPatterns();
  }

  private initializeGlobalPatterns() {
    // Initialize with baseline patterns
    this.globalPatterns.set('constraint-analysis-success', 0.89);
    this.globalPatterns.set('offer-optimization-success', 0.85);
    this.globalPatterns.set('financial-modeling-success', 0.91);
    this.globalPatterns.set('collaboration-effectiveness', 0.83);
  }

  // Create or retrieve user memory
  getPersonalization(sessionId: string, userId?: string): AgentPersonalization {
    const key = userId || sessionId;
    
    if (!this.memory.has(key)) {
      this.memory.set(key, {
        userId,
        sessionId,
        conversationHistory: [],
        businessContext: {
          mainChallenges: [],
          successMetrics: [],
          previousAnalyses: [],
          preferredFrameworks: [],
          avoidedTopics: []
        },
        learningPatterns: {
          preferredAgents: new Map(),
          effectiveFrameworks: new Map(),
          successfulQueryTypes: [],
          commonMisunderstandings: [],
          improvementAreas: []
        },
        contextualMemory: {
          recentTopics: [],
          ongoingProjects: [],
          pastRecommendations: [],
          implementedSuggestions: [],
          currentGoals: []
        },
        adaptations: {
          responseStyle: 'balanced',
          detailLevel: 'moderate',
          visualPreferences: [],
          preferredExamples: []
        }
      });
    }
    
    return this.memory.get(key)!;
  }

  // Add conversation turn to memory
  addConversationTurn(sessionId: string, turn: ConversationTurn, userId?: string) {
    const personalization = this.getPersonalization(sessionId, userId);
    
    // Add to conversation history
    personalization.conversationHistory.push(turn);
    
    // Keep only last 50 turns for performance
    if (personalization.conversationHistory.length > 50) {
      personalization.conversationHistory = personalization.conversationHistory.slice(-50);
    }
    
    // Update learning patterns
    this.updateLearningPatterns(personalization, turn);
    
    // Update contextual memory
    this.updateContextualMemory(personalization, turn);
    
    // Update business context
    this.updateBusinessContext(personalization, turn);
    
    // Update global patterns
    this.updateGlobalPatterns(turn);
  }

  private updateLearningPatterns(personalization: AgentPersonalization, turn: ConversationTurn) {
    const { learningPatterns } = personalization;
    
    // Track agent preference
    const currentScore = learningPatterns.preferredAgents.get(turn.selectedAgent) || 0;
    const newScore = turn.success ? currentScore + 1 : Math.max(0, currentScore - 0.5);
    learningPatterns.preferredAgents.set(turn.selectedAgent, newScore);
    
    // Track framework effectiveness
    turn.queryAnalysis.frameworks.forEach(framework => {
      const currentScore = learningPatterns.effectiveFrameworks.get(framework) || 0;
      const newScore = turn.success ? currentScore + 1 : Math.max(0, currentScore - 0.5);
      learningPatterns.effectiveFrameworks.set(framework, newScore);
    });
    
    // Track successful query types
    if (turn.success && turn.queryAnalysis.intent) {
      const queryType = `${turn.queryAnalysis.intent}-${turn.queryAnalysis.complexity}`;
      if (!learningPatterns.successfulQueryTypes.includes(queryType)) {
        learningPatterns.successfulQueryTypes.push(queryType);
      }
    }
    
    // Track misunderstandings
    if (!turn.success || turn.userFeedback === 'negative') {
      const misunderstanding = `${turn.queryAnalysis.intent} - ${turn.selectedAgent}`;
      if (!learningPatterns.commonMisunderstandings.includes(misunderstanding)) {
        learningPatterns.commonMisunderstandings.push(misunderstanding);
      }
    }
  }

  private updateContextualMemory(personalization: AgentPersonalization, turn: ConversationTurn) {
    const { contextualMemory } = personalization;
    
    // Extract topics from query
    const topics = this.extractTopics(turn.userQuery);
    topics.forEach(topic => {
      if (!contextualMemory.recentTopics.includes(topic)) {
        contextualMemory.recentTopics.unshift(topic);
      }
    });
    
    // Keep only recent topics
    contextualMemory.recentTopics = contextualMemory.recentTopics.slice(0, 10);
    
    // Track ongoing projects (inferred from repeated topics)
    this.identifyOngoingProjects(contextualMemory, topics);
    
    // Store recommendations
    if (turn.insights.length > 0) {
      contextualMemory.pastRecommendations.push(...turn.insights);
      contextualMemory.pastRecommendations = contextualMemory.pastRecommendations.slice(-20);
    }
  }

  private updateBusinessContext(personalization: AgentPersonalization, turn: ConversationTurn) {
    const { businessContext } = personalization;
    
    // Extract business context from query and analysis
    const contextClues = turn.queryAnalysis.businessContext;
    contextClues.forEach(context => {
      if (!businessContext.previousAnalyses.includes(context)) {
        businessContext.previousAnalyses.push(context);
      }
    });
    
    // Update preferred frameworks based on success
    if (turn.success) {
      turn.queryAnalysis.frameworks.forEach(framework => {
        if (!businessContext.preferredFrameworks.includes(framework)) {
          businessContext.preferredFrameworks.push(framework);
        }
      });
    }
  }

  private updateGlobalPatterns(turn: ConversationTurn) {
    // Update global success patterns
    const patternKey = `${turn.selectedAgent}-success`;
    const currentRate = this.globalPatterns.get(patternKey) || 0.5;
    const newRate = turn.success ? 
      currentRate * 0.95 + 0.05 : 
      currentRate * 0.98 + 0.02 * 0;
    this.globalPatterns.set(patternKey, newRate);
    
    // Update framework effectiveness globally
    turn.queryAnalysis.frameworks.forEach(framework => {
      let stats = this.frameworkEffectiveness.get(framework) || { success: 0, total: 0 };
      stats.total += 1;
      if (turn.success) stats.success += 1;
      this.frameworkEffectiveness.set(framework, stats);
    });
  }

  private extractTopics(query: string): string[] {
    const topics: string[] = [];
    const queryLower = query.toLowerCase();
    
    // Business topic keywords
    const topicPatterns = {
      'offer optimization': ['offer', 'pricing', 'value proposition'],
      'revenue model': ['revenue', 'money model', 'monetization'],
      'customer acquisition': ['leads', 'customers', 'acquisition', 'marketing'],
      'conversion optimization': ['conversion', 'sales', 'closing'],
      'scaling operations': ['scale', 'growth', 'operations', 'team'],
      'financial analysis': ['financial', 'profit', 'cac', 'ltv', 'metrics']
    };
    
    for (const [topic, keywords] of Object.entries(topicPatterns)) {
      if (keywords.some(keyword => queryLower.includes(keyword))) {
        topics.push(topic);
      }
    }
    
    return topics;
  }

  private identifyOngoingProjects(contextualMemory: any, topics: string[]) {
    // If same topics appear in multiple conversations, consider them ongoing projects
    const topicCounts = new Map<string, number>();
    
    // Count recent topic frequencies
    contextualMemory.recentTopics.forEach((topic: string) => {
      topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
    });
    
    // Add to ongoing projects if topic appears 3+ times
    topicCounts.forEach((count, topic) => {
      if (count >= 3 && !contextualMemory.ongoingProjects.includes(topic)) {
        contextualMemory.ongoingProjects.push(topic);
      }
    });
  }

  // Get contextual recommendations
  getContextualRecommendations(sessionId: string, query: string, userId?: string): {
    agentSuggestions: string[];
    frameworkRecommendations: string[];
    relatedTopics: string[];
    previousInsights: string[];
    warningFlags: string[];
  } {
    const personalization = this.getPersonalization(sessionId, userId);
    const queryTopics = this.extractTopics(query);
    
    // Get agent suggestions based on past success
    const agentSuggestions = Array.from(personalization.learningPatterns.preferredAgents.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([agent]) => agent);
    
    // Get framework recommendations
    const frameworkRecommendations = Array.from(personalization.learningPatterns.effectiveFrameworks.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([framework]) => framework);
    
    // Get related topics from memory
    const relatedTopics = personalization.contextualMemory.recentTopics
      .filter(topic => queryTopics.some(qTopic => 
        topic.toLowerCase().includes(qTopic.toLowerCase()) || 
        qTopic.toLowerCase().includes(topic.toLowerCase())
      ))
      .slice(0, 5);
    
    // Get relevant previous insights
    const previousInsights = personalization.contextualMemory.pastRecommendations
      .filter(insight => queryTopics.some(topic => 
        insight.toLowerCase().includes(topic.toLowerCase())
      ))
      .slice(0, 3);
    
    // Generate warning flags based on past misunderstandings
    const warningFlags = personalization.learningPatterns.commonMisunderstandings
      .filter(mistake => queryTopics.some(topic => 
        mistake.toLowerCase().includes(topic.toLowerCase())
      ))
      .slice(0, 2);
    
    return {
      agentSuggestions,
      frameworkRecommendations,
      relatedTopics,
      previousInsights,
      warningFlags
    };
  }

  // Get conversation context for better agent routing
  getConversationContext(sessionId: string, userId?: string): {
    recentQueries: string[];
    dominantIntent: string;
    averageComplexity: string;
    businessFocus: string[];
    communicationPattern: string;
  } {
    const personalization = this.getPersonalization(sessionId, userId);
    const recentHistory = personalization.conversationHistory.slice(-10);
    
    if (recentHistory.length === 0) {
      return {
        recentQueries: [],
        dominantIntent: 'unknown',
        averageComplexity: 'medium',
        businessFocus: [],
        communicationPattern: 'balanced'
      };
    }
    
    // Analyze recent patterns
    const intents = recentHistory.map(turn => turn.queryAnalysis.intent);
    const complexities = recentHistory.map(turn => turn.queryAnalysis.complexity);
    const businessContexts = recentHistory.flatMap(turn => turn.queryAnalysis.businessContext);
    
    // Find dominant patterns
    const intentCounts = this.countOccurrences(intents);
    const complexityCounts = this.countOccurrences(complexities);
    const businessCounts = this.countOccurrences(businessContexts);
    
    return {
      recentQueries: recentHistory.map(turn => turn.userQuery).slice(-5),
      dominantIntent: this.getMostCommon(intentCounts) || 'analyze',
      averageComplexity: this.getMostCommon(complexityCounts) || 'medium',
      businessFocus: Object.keys(businessCounts).slice(0, 3),
      communicationPattern: personalization.adaptations.responseStyle
    };
  }

  private countOccurrences(items: string[]): Record<string, number> {
    return items.reduce((counts, item) => {
      counts[item] = (counts[item] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
  }

  private getMostCommon(counts: Record<string, number>): string | null {
    return Object.keys(counts).reduce((max, key) => 
      counts[key] > (counts[max] || 0) ? key : max, 
      Object.keys(counts)[0]
    ) || null;
  }

  // Update user feedback
  updateUserFeedback(sessionId: string, turnId: string, feedback: 'positive' | 'negative' | 'neutral', userId?: string) {
    const personalization = this.getPersonalization(sessionId, userId);
    const turn = personalization.conversationHistory.find(t => t.id === turnId);
    
    if (turn) {
      turn.userFeedback = feedback;
      
      // Update learning patterns based on feedback
      if (feedback === 'negative') {
        const agentScore = personalization.learningPatterns.preferredAgents.get(turn.selectedAgent) || 0;
        personalization.learningPatterns.preferredAgents.set(turn.selectedAgent, Math.max(0, agentScore - 1));
      } else if (feedback === 'positive') {
        const agentScore = personalization.learningPatterns.preferredAgents.get(turn.selectedAgent) || 0;
        personalization.learningPatterns.preferredAgents.set(turn.selectedAgent, agentScore + 1);
      }
    }
  }

  // Get memory analytics
  getMemoryAnalytics(sessionId: string, userId?: string) {
    const personalization = this.getPersonalization(sessionId, userId);
    
    return {
      totalConversations: personalization.conversationHistory.length,
      successRate: personalization.conversationHistory.filter(t => t.success).length / 
                   Math.max(1, personalization.conversationHistory.length),
      averageExecutionTime: personalization.conversationHistory.reduce((sum, t) => sum + t.executionTime, 0) /
                           Math.max(1, personalization.conversationHistory.length),
      topAgents: Array.from(personalization.learningPatterns.preferredAgents.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([agent, score]) => ({ agent, score })),
      topFrameworks: Array.from(personalization.learningPatterns.effectiveFrameworks.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([framework, score]) => ({ framework, score })),
      recentTopics: personalization.contextualMemory.recentTopics.slice(0, 5),
      businessContext: personalization.businessContext,
      adaptations: personalization.adaptations
    };
  }

  // Clear memory (for privacy)
  clearMemory(sessionId: string, userId?: string) {
    const key = userId || sessionId;
    this.memory.delete(key);
  }
}