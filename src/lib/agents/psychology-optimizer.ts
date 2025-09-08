// Psychology Optimizer Agent - Customer Behavior & Conversion Psychology
// Specializes in Alex Hormozi's psychological frameworks and timing optimization

import { AgentAnalysis, BusinessContext } from './main-conductor';

export interface PsychologyAnalysis {
  upsellTiming: UpsellTimingAnalysis;
  buyingPsychology: BuyingPsychologyAnalysis;
  conversionOptimization: ConversionOptimization;
  behavioralTriggers: BehavioralTriggers;
}

export interface UpsellTimingAnalysis {
  currentTiming: string;
  optimalMoments: OptimalMoment[];
  timingScore: number; // 1-10
  improvements: string[];
}

export interface OptimalMoment {
  moment: string;
  description: string;
  conversionPotential: number; // 1-10
  currentlyUsed: boolean;
  implementation: string;
}

export interface BuyingPsychologyAnalysis {
  customerType: 'hyper-buyer' | 'deliberate' | 'price-sensitive';
  buyingCycle: 'active' | 'dormant' | 'research';
  decisionFactors: DecisionFactor[];
  psychologicalState: string;
}

export interface DecisionFactor {
  factor: string;
  importance: number; // 1-10
  currentAddress: number; // 1-10
  optimizationActions: string[];
}

export interface ConversionOptimization {
  currentConversion: number;
  potentialConversion: number;
  conversionBarriers: string[];
  quickWins: string[];
  psychologyFixes: string[];
}

export interface BehavioralTriggers {
  scarcity: TriggerAnalysis;
  urgency: TriggerAnalysis;
  social_proof: TriggerAnalysis;
  authority: TriggerAnalysis;
  reciprocity: TriggerAnalysis;
}

export interface TriggerAnalysis {
  present: boolean;
  effectiveness: number; // 1-10
  recommendations: string[];
}

export class PsychologyOptimizer {
  private diagnosticQuestions = [
    "When do you currently try to upsell your customers?",
    "What objections do customers most commonly raise?",
    "How do customers typically find out about your offers?",
    "What makes customers hesitate before buying?",
    "Do you track when customers are most likely to make additional purchases?",
    "What social proof elements do you currently use?",
    "How do you create urgency in your offers?",
    "What happens when customers say no to an offer?"
  ];

  private fiveMoments = [
    {
      moment: 'immediately',
      description: 'Right after the initial purchase decision',
      bestFor: 'Complementary products that solve immediate next problems'
    },
    {
      moment: 'next_step',
      description: '24-72 hours after initial purchase',
      bestFor: 'Education-based upsells and onboarding enhancements'
    },
    {
      moment: 'big_win',
      description: 'After customer achieves a significant milestone',
      bestFor: 'Advanced products that build on their success'
    },
    {
      moment: 'halfway',
      description: 'At the midpoint of their journey/program',
      bestFor: 'Acceleration products and additional support'
    },
    {
      moment: 'last_chance',
      description: 'At the end of their program or before leaving',
      bestFor: 'Continuity offers and next-level programs'
    }
  ];

  async analyze(query: string, context: BusinessContext): Promise<AgentAnalysis> {
    const findings: string[] = [];
    const recommendations: string[] = [];

    // 1. Analyze Upsell Timing using 5 Moments Framework
    const upsellTiming = this.analyzeUpsellTiming(context, query);
    findings.push(`Upsell Timing Score: ${upsellTiming.timingScore}/10`);
    findings.push(`Optimal Moments Used: ${upsellTiming.optimalMoments.filter(m => m.currentlyUsed).length}/5`);

    // 2. Assess Customer Buying Psychology
    const buyingPsychology = this.analyzeBuyingPsychology(context, query);
    findings.push(`Customer Type: ${buyingPsychology.customerType}`);
    findings.push(`Buying Cycle: ${buyingPsychology.buyingCycle}`);
    findings.push(`Psychological State: ${buyingPsychology.psychologicalState}`);

    // 3. Evaluate Conversion Optimization Opportunities
    const conversionOptimization = this.evaluateConversionOptimization(context, buyingPsychology);
    findings.push(`Current Conversion Estimate: ${conversionOptimization.currentConversion}%`);
    findings.push(`Potential Conversion: ${conversionOptimization.potentialConversion}%`);
    findings.push(`Conversion Barriers: ${conversionOptimization.conversionBarriers.length}`);

    // 4. Analyze Behavioral Triggers
    const behavioralTriggers = this.analyzeBehavioralTriggers(context, query);
    const triggerEffectiveness = this.calculateTriggerEffectiveness(behavioralTriggers);
    findings.push(`Behavioral Triggers Score: ${triggerEffectiveness}/10`);

    // 5. Generate psychology-based recommendations
    recommendations.push(...this.generatePsychologyRecommendations(upsellTiming, buyingPsychology, conversionOptimization, behavioralTriggers, context));

    // 6. MCP Enhancement - Behavioral Testing
    const testingData = await this.enhanceWithBehavioralTesting(context, conversionOptimization);
    if (testingData) {
      findings.push(...testingData.insights);
      recommendations.push(...testingData.recommendations);
    }

    return {
      agentType: 'psychology',
      findings,
      recommendations,
      metrics: { upsellTiming, buyingPsychology, conversionOptimization, behavioralTriggers },
      confidence: this.calculateConfidence(context)
    };
  }

  private analyzeUpsellTiming(context: BusinessContext, query: string): UpsellTimingAnalysis {
    const queryLower = query.toLowerCase();
    
    // Determine current timing approach
    let currentTiming = 'unknown';
    if (queryLower.includes('after') || queryLower.includes('end')) {
      currentTiming = 'end_of_service';
    } else if (queryLower.includes('immediate') || queryLower.includes('checkout')) {
      currentTiming = 'immediately';
    } else if (queryLower.includes('email') || queryLower.includes('follow up')) {
      currentTiming = 'follow_up';
    }

    // Analyze each of the 5 optimal moments
    const optimalMoments: OptimalMoment[] = this.fiveMoments.map(moment => ({
      moment: moment.moment,
      description: moment.description,
      conversionPotential: this.estimateConversionPotential(moment.moment, context),
      currentlyUsed: this.isCurrentlyUsed(moment.moment, queryLower, currentTiming),
      implementation: moment.bestFor
    }));

    // Calculate timing score
    const usedMoments = optimalMoments.filter(m => m.currentlyUsed).length;
    const timingScore = Math.round((usedMoments / 5) * 10);

    const improvements: string[] = [];
    if (timingScore < 5) {
      improvements.push("Implement systematic upsell timing based on customer psychology");
      improvements.push("Stop trying to upsell at the point of greatest satisfaction");
    }
    
    optimalMoments.filter(m => !m.currentlyUsed && m.conversionPotential > 7).forEach(moment => {
      improvements.push(`Add ${moment.moment} upsells: ${moment.implementation}`);
    });

    return {
      currentTiming,
      optimalMoments,
      timingScore,
      improvements
    };
  }

  private estimateConversionPotential(moment: string, context: BusinessContext): number {
    // Hormozi's research on upsell moment effectiveness
    const momentScores: { [key: string]: number } = {
      immediately: 8, // High due to buying momentum
      next_step: 9,   // Highest - problem awareness created
      big_win: 8,     // High due to trust and new problems revealed
      halfway: 7,     // Good momentum, still engaged
      last_chance: 5  // Lower but still valuable
    };

    let baseScore = momentScores[moment] || 5;
    
    // Adjust based on business context
    if (context.businessStage === 'mature' && context.ltv && context.ltv > 5000) {
      baseScore += 1; // Established businesses with high LTV can leverage timing better
    }

    return Math.min(baseScore, 10);
  }

  private isCurrentlyUsed(moment: string, queryLower: string, currentTiming: string): boolean {
    switch (moment) {
      case 'immediately':
        return queryLower.includes('immediate') || currentTiming === 'immediately';
      case 'next_step':
        return queryLower.includes('follow up') || queryLower.includes('email') || currentTiming === 'follow_up';
      case 'big_win':
        return queryLower.includes('milestone') || queryLower.includes('success');
      case 'halfway':
        return queryLower.includes('middle') || queryLower.includes('halfway');
      case 'last_chance':
        return queryLower.includes('end') || queryLower.includes('final') || currentTiming === 'end_of_service';
      default:
        return false;
    }
  }

  private analyzeBuyingPsychology(context: BusinessContext, query: string): BuyingPsychologyAnalysis {
    const queryLower = query.toLowerCase();
    
    // Determine customer type
    let customerType: 'hyper-buyer' | 'deliberate' | 'price-sensitive' = 'deliberate';
    if (queryLower.includes('expensive') || queryLower.includes('price') || queryLower.includes('cost')) {
      customerType = 'price-sensitive';
    } else if (queryLower.includes('premium') || queryLower.includes('high-end') || (context.grossMargin && context.grossMargin > 80)) {
      customerType = 'hyper-buyer';
    }

    // Determine buying cycle
    let buyingCycle: 'active' | 'dormant' | 'research' = 'research';
    if (queryLower.includes('buy now') || queryLower.includes('purchase')) {
      buyingCycle = 'active';
    } else if (queryLower.includes('thinking') || queryLower.includes('considering')) {
      buyingCycle = 'research';
    }

    // Analyze decision factors
    const decisionFactors: DecisionFactor[] = [
      {
        factor: 'Price/Value Ratio',
        importance: customerType === 'price-sensitive' ? 9 : 6,
        currentAddress: context.grossMargin && context.grossMargin > 70 ? 8 : 5,
        optimizationActions: ['Improve value stacking', 'Add bonuses and guarantees']
      },
      {
        factor: 'Trust/Credibility',
        importance: 8,
        currentAddress: context.businessStage === 'mature' ? 8 : 4,
        optimizationActions: ['Add testimonials', 'Showcase results', 'Provide guarantees']
      },
      {
        factor: 'Urgency/Scarcity',
        importance: 7,
        currentAddress: 3, // Most businesses don't use this well
        optimizationActions: ['Add time-limited bonuses', 'Show inventory levels', 'Create deadline pressure']
      },
      {
        factor: 'Social Proof',
        importance: 8,
        currentAddress: context.customerCount && context.customerCount > 100 ? 6 : 3,
        optimizationActions: ['Display customer count', 'Show recent purchases', 'Feature success stories']
      }
    ];

    const psychologicalState = this.determinePsychologicalState(customerType, buyingCycle, context);

    return {
      customerType,
      buyingCycle,
      decisionFactors,
      psychologicalState
    };
  }

  private determinePsychologicalState(customerType: string, buyingCycle: string, context: BusinessContext): string {
    if (buyingCycle === 'active' && customerType === 'hyper-buyer') {
      return 'Ready to buy - maximize value and create urgency';
    } else if (buyingCycle === 'research' && customerType === 'deliberate') {
      return 'Information gathering - provide proof and reduce risk';
    } else if (customerType === 'price-sensitive') {
      return 'Price focused - emphasize value and ROI';
    } else {
      return 'Standard buying psychology - follow proven frameworks';
    }
  }

  private evaluateConversionOptimization(context: BusinessContext, psychology: BuyingPsychologyAnalysis): ConversionOptimization {
    // Estimate current conversion based on business stage and context
    let currentConversion = 5; // Default assumption
    if (context.businessStage === 'mature') currentConversion = 8;
    else if (context.businessStage === 'growth') currentConversion = 6;

    // Calculate potential conversion based on psychological factors
    const avgDecisionFactorGap = psychology.decisionFactors.reduce((sum, factor) => 
      sum + (factor.importance - factor.currentAddress), 0) / psychology.decisionFactors.length;

    const potentialConversion = Math.min(currentConversion + (avgDecisionFactorGap * 2), 25);

    const conversionBarriers: string[] = [];
    const quickWins: string[] = [];
    const psychologyFixes: string[] = [];

    psychology.decisionFactors.forEach(factor => {
      const gap = factor.importance - factor.currentAddress;
      if (gap > 3) {
        conversionBarriers.push(`${factor.factor}: ${gap} point gap`);
        quickWins.push(factor.optimizationActions[0]);
        psychologyFixes.push(...factor.optimizationActions);
      }
    });

    return {
      currentConversion,
      potentialConversion,
      conversionBarriers,
      quickWins: [...new Set(quickWins)], // Remove duplicates
      psychologyFixes: [...new Set(psychologyFixes)] // Remove duplicates
    };
  }

  private analyzeBehavioralTriggers(context: BusinessContext, query: string): BehavioralTriggers {
    const queryLower = query.toLowerCase();

    return {
      scarcity: {
        present: queryLower.includes('limited') || queryLower.includes('exclusive'),
        effectiveness: queryLower.includes('limited') ? 7 : 2,
        recommendations: ['Add inventory counters', 'Create member-only access', 'Limit enrollment periods']
      },
      urgency: {
        present: queryLower.includes('deadline') || queryLower.includes('expires'),
        effectiveness: queryLower.includes('deadline') ? 6 : 2,
        recommendations: ['Add countdown timers', 'Create time-limited bonuses', 'Set enrollment deadlines']
      },
      social_proof: {
        present: queryLower.includes('testimonial') || queryLower.includes('reviews'),
        effectiveness: context.customerCount && context.customerCount > 50 ? 8 : 4,
        recommendations: ['Display customer count', 'Show recent purchases', 'Feature success stories']
      },
      authority: {
        present: queryLower.includes('expert') || queryLower.includes('certified'),
        effectiveness: context.businessStage === 'mature' ? 7 : 4,
        recommendations: ['Highlight credentials', 'Show media mentions', 'Display awards and recognition']
      },
      reciprocity: {
        present: queryLower.includes('free') || queryLower.includes('bonus'),
        effectiveness: queryLower.includes('free') ? 6 : 3,
        recommendations: ['Provide valuable free content', 'Add surprise bonuses', 'Offer free consultations']
      }
    };
  }

  private calculateTriggerEffectiveness(triggers: BehavioralTriggers): number {
    const triggerArray = Object.values(triggers);
    const avgEffectiveness = triggerArray.reduce((sum, trigger) => sum + trigger.effectiveness, 0) / triggerArray.length;
    return Math.round(avgEffectiveness);
  }

  private generatePsychologyRecommendations(
    timing: UpsellTimingAnalysis,
    psychology: BuyingPsychologyAnalysis,
    conversion: ConversionOptimization,
    triggers: BehavioralTriggers,
    context: BusinessContext
  ): string[] {
    const recommendations: string[] = [];

    // Hormozi's core psychology principles
    recommendations.push("Sell at the point of greatest deprivation, not greatest satisfaction");
    
    // Timing-specific recommendations
    recommendations.push(...timing.improvements);

    // Quick wins for conversion
    recommendations.push(...conversion.quickWins.slice(0, 3));

    // Psychology-specific recommendations based on customer type
    if (psychology.customerType === 'hyper-buyer') {
      recommendations.push("Create premium, high-value offers with immediate access");
      recommendations.push("Use exclusivity and VIP positioning");
    } else if (psychology.customerType === 'price-sensitive') {
      recommendations.push("Emphasize ROI and payment plans");
      recommendations.push("Use downsell strategies for rejected prospects");
    } else {
      recommendations.push("Provide comprehensive proof and risk reversal");
      recommendations.push("Use social proof and testimonials heavily");
    }

    // Behavioral trigger improvements
    Object.entries(triggers).forEach(([trigger, analysis]) => {
      if (analysis.effectiveness < 6) {
        recommendations.push(analysis.recommendations[0]);
      }
    });

    // Business stage specific psychology
    if (context.businessStage === 'startup') {
      recommendations.push("Focus on building trust and credibility first");
      recommendations.push("Use founder story and personal connection");
    } else if (context.businessStage === 'scale') {
      recommendations.push("Implement systematic psychological triggers across all touchpoints");
      recommendations.push("Use advanced behavioral economics principles");
    }

    // Hormozi's advanced psychology concepts
    recommendations.push("Create hyper-buying cycles by solving one problem completely before introducing the next");
    recommendations.push("Use the bike shop example: when someone buys a bike, they enter hyper-buying mode for all bike accessories");

    return recommendations.slice(0, 10); // Limit to most important recommendations
  }

  private async enhanceWithBehavioralTesting(context: BusinessContext, conversion: ConversionOptimization): Promise<any> {
    // This would integrate with Playwright MCP for behavioral testing
    try {
      // Placeholder for Playwright MCP integration
      // const testResults = await playwrightMCP.browser_navigate({
      //   url: context.websiteUrl
      // });

      const insights = [
        "Behavioral testing would be performed using Playwright MCP",
        `Conversion optimization potential: ${conversion.potentialConversion - conversion.currentConversion}%`,
        "A/B testing capabilities available for psychological triggers"
      ];

      const recommendations = [
        "Set up automated conversion testing for different psychological triggers",
        "Test upsell timing variations using behavioral automation",
        "Monitor customer behavior patterns for optimization opportunities"
      ];

      return { insights, recommendations };
    } catch (error) {
      return null;
    }
  }

  private calculateConfidence(context: BusinessContext): number {
    let confidence = 60; // Higher base for psychology analysis

    if (context.customerCount && context.customerCount > 100) confidence += 15;
    if (context.businessStage === 'growth' || context.businessStage === 'scale') confidence += 10;
    if (context.ltv && context.cac && context.ltv > context.cac * 3) confidence += 15;

    return Math.min(confidence, 90); // Cap at 90% for behavioral predictions
  }

  getDiagnosticQuestions(): string[] {
    return this.diagnosticQuestions;
  }

  getFiveMoments() {
    return this.fiveMoments;
  }
}