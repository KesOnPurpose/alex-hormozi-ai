// Money Model Architect Agent - 4-Prong Framework & Sequential Monetization
// Specializes in building systematic revenue optimization using Alex Hormozi's methodologies

import { AgentAnalysis, BusinessContext } from './main-conductor';

export interface MoneyModelAnalysis {
  fourProngAssessment: FourProngAssessment;
  sequentialOffers: SequentialOffers;
  monetizationGaps: MonetizationGaps;
  revenueOptimization: RevenueOptimization;
}

export interface FourProngAssessment {
  attraction: ProngAnalysis;
  upsell: ProngAnalysis;
  downsell: ProngAnalysis;
  continuity: ProngAnalysis;
  overallMaturity: number; // 1-10
}

export interface ProngAnalysis {
  exists: boolean;
  effectiveness: number; // 1-10
  purpose: string;
  currentImplementation: string;
  recommendations: string[];
}

export interface SequentialOffers {
  customerJourney: JourneyStage[];
  touchpointOptimization: TouchpointOptimization[];
  revenueSequence: RevenueSequence;
}

export interface JourneyStage {
  stage: string;
  offers: string[];
  conversion: number;
  revenue: number;
  gaps: string[];
}

export interface TouchpointOptimization {
  touchpoint: string;
  currentValue: number;
  potentialValue: number;
  optimizationActions: string[];
}

export interface RevenueSequence {
  totalTouchpoints: number;
  revenuePerCustomer: number;
  optimization: string[];
}

export interface MonetizationGaps {
  missedOpportunities: string[];
  underperformingAreas: string[];
  quickWins: string[];
  strategicImprovements: string[];
}

export interface RevenueOptimization {
  currentRevenue: number;
  optimizedRevenue: number;
  improvementPotential: number; // percentage
  priorityActions: string[];
}

export class MoneyModelArchitect {
  private diagnosticQuestions = [
    "What happens immediately after someone makes their first purchase?",
    "Do you have different pricing options for different customer segments?",
    "What ongoing products or services do you offer existing customers?",
    "How do you handle customers who don't buy your main offer?",
    "What additional problems do you solve for customers over time?",
    "How many times does the average customer buy from you?",
    "What's your current average revenue per customer?",
    "Do you have any recurring revenue streams?"
  ];

  async analyze(query: string, context: BusinessContext): Promise<AgentAnalysis> {
    const findings: string[] = [];
    const recommendations: string[] = [];

    // 1. Assess 4-Prong Money Model Implementation
    const fourProngAssessment = this.assessFourProngModel(context, query);
    findings.push(`4-Prong Model Maturity: ${fourProngAssessment.overallMaturity}/10`);
    findings.push(`Strongest Prong: ${this.identifyStrongestProng(fourProngAssessment)}`);
    findings.push(`Weakest Prong: ${this.identifyWeakestProng(fourProngAssessment)}`);

    // 2. Map Sequential Offers
    const sequentialOffers = this.mapSequentialOffers(context, fourProngAssessment);
    findings.push(`Customer Journey Touchpoints: ${sequentialOffers.totalTouchpoints}`);
    findings.push(`Revenue Per Customer: $${sequentialOffers.revenuePerCustomer.toFixed(2)}`);

    // 3. Identify Monetization Gaps
    const monetizationGaps = this.identifyMonetizationGaps(fourProngAssessment, sequentialOffers, context);
    findings.push(`Missed Opportunities: ${monetizationGaps.missedOpportunities.length}`);
    findings.push(`Quick Wins Available: ${monetizationGaps.quickWins.length}`);

    // 4. Calculate Revenue Optimization Potential
    const revenueOptimization = this.calculateRevenueOptimization(context, monetizationGaps, sequentialOffers);
    findings.push(`Revenue Optimization Potential: ${revenueOptimization.improvementPotential}%`);

    // 5. Generate Hormozi-style money model recommendations
    recommendations.push(...this.generateMoneyModelRecommendations(fourProngAssessment, sequentialOffers, monetizationGaps, context));

    // 6. MCP Enhancement - Workflow Automation
    const automationData = await this.enhanceWithAutomation(context, fourProngAssessment);
    if (automationData) {
      findings.push(...automationData.insights);
      recommendations.push(...automationData.recommendations);
    }

    return {
      agentType: 'money-model',
      findings,
      recommendations,
      metrics: { fourProngAssessment, sequentialOffers, monetizationGaps, revenueOptimization },
      confidence: this.calculateConfidence(context)
    };
  }

  private assessFourProngModel(context: BusinessContext, query: string): FourProngAssessment {
    // Analyze each prong of the 4-prong model
    const attraction = this.analyzeProng('attraction', context, query);
    const upsell = this.analyzeProng('upsell', context, query);
    const downsell = this.analyzeProng('downsell', context, query);
    const continuity = this.analyzeProng('continuity', context, query);

    const overallMaturity = Math.round(
      (attraction.effectiveness + upsell.effectiveness + downsell.effectiveness + continuity.effectiveness) / 4
    );

    return {
      attraction,
      upsell,
      downsell,
      continuity,
      overallMaturity
    };
  }

  private analyzeProng(prongType: string, context: BusinessContext, query: string): ProngAnalysis {
    const queryLower = query.toLowerCase();
    let exists = false;
    let effectiveness = 1;
    let purpose = '';
    let currentImplementation = 'Not implemented';
    const recommendations: string[] = [];

    switch (prongType) {
      case 'attraction':
        purpose = 'Liquidate customer acquisition cost with initial offer';
        exists = context.cac ? true : false;
        
        if (context.cac && context.grossMargin) {
          const estimatedMonthlyGP = (context.currentRevenue || 0) / 12 * (context.grossMargin / 100) / (context.customerCount || 1);
          effectiveness = estimatedMonthlyGP > context.cac ? 8 : 3;
          currentImplementation = estimatedMonthlyGP > context.cac ? 'Achieving CAC liquidation' : 'Not liquidating CAC';
        }

        if (!exists || effectiveness < 5) {
          recommendations.push('Create attraction offer that covers customer acquisition cost');
          recommendations.push('Test free-plus-shipping or low-ticket front-end offers');
        }
        break;

      case 'upsell':
        purpose = 'Maximize profit per customer with premium options';
        exists = queryLower.includes('upsell') || context.businessStage !== 'startup';
        effectiveness = exists ? 6 : 2;
        currentImplementation = exists ? 'Basic upsell implementation' : 'No upsells identified';

        if (!exists || effectiveness < 7) {
          recommendations.push('Develop immediate post-purchase upsell sequence');
          recommendations.push('Create premium service tiers or add-ons');
        }
        break;

      case 'downsell':
        purpose = 'Maximize conversion for price-sensitive customers';
        exists = queryLower.includes('downsell') || queryLower.includes('payment plan');
        effectiveness = exists ? 5 : 1;
        currentImplementation = exists ? 'Some downsell options available' : 'No downsell strategy';

        if (!exists || effectiveness < 6) {
          recommendations.push('Create downsell offers for rejected customers');
          recommendations.push('Implement payment plans or lite versions');
        }
        break;

      case 'continuity':
        purpose = 'Stabilize cash flow with recurring revenue';
        exists = queryLower.includes('recurring') || queryLower.includes('subscription') || context.businessStage === 'scale';
        effectiveness = exists ? 7 : 2;
        currentImplementation = exists ? 'Some recurring elements' : 'No recurring revenue model';

        if (!exists || effectiveness < 7) {
          recommendations.push('Develop ongoing service or product subscriptions');
          recommendations.push('Create membership or community components');
        }
        break;
    }

    return {
      exists,
      effectiveness,
      purpose,
      currentImplementation,
      recommendations
    };
  }

  private identifyStrongestProng(assessment: FourProngAssessment): string {
    const prongs = [
      { name: 'Attraction', score: assessment.attraction.effectiveness },
      { name: 'Upsell', score: assessment.upsell.effectiveness },
      { name: 'Downsell', score: assessment.downsell.effectiveness },
      { name: 'Continuity', score: assessment.continuity.effectiveness }
    ];

    return prongs.reduce((prev, current) => current.score > prev.score ? current : prev).name;
  }

  private identifyWeakestProng(assessment: FourProngAssessment): string {
    const prongs = [
      { name: 'Attraction', score: assessment.attraction.effectiveness },
      { name: 'Upsell', score: assessment.upsell.effectiveness },
      { name: 'Downsell', score: assessment.downsell.effectiveness },
      { name: 'Continuity', score: assessment.continuity.effectiveness }
    ];

    return prongs.reduce((prev, current) => current.score < prev.score ? current : prev).name;
  }

  private mapSequentialOffers(context: BusinessContext, assessment: FourProngAssessment): SequentialOffers {
    // Map customer journey stages and touchpoints
    const customerJourney: JourneyStage[] = [
      {
        stage: 'Initial Contact',
        offers: ['Lead Magnet', 'Free Consultation'],
        conversion: 0.3,
        revenue: 0,
        gaps: assessment.attraction.exists ? [] : ['No attraction offer']
      },
      {
        stage: 'First Purchase',
        offers: ['Main Offer'],
        conversion: 0.1,
        revenue: this.estimateMainOfferRevenue(context),
        gaps: []
      },
      {
        stage: 'Immediate Upsell',
        offers: assessment.upsell.exists ? ['Premium Add-on'] : [],
        conversion: assessment.upsell.exists ? 0.3 : 0,
        revenue: assessment.upsell.exists ? this.estimateMainOfferRevenue(context) * 0.5 : 0,
        gaps: assessment.upsell.recommendations
      },
      {
        stage: 'Ongoing Relationship',
        offers: assessment.continuity.exists ? ['Recurring Service'] : [],
        conversion: assessment.continuity.exists ? 0.6 : 0,
        revenue: assessment.continuity.exists ? this.estimateMainOfferRevenue(context) * 0.3 : 0,
        gaps: assessment.continuity.recommendations
      }
    ];

    const touchpointOptimization: TouchpointOptimization[] = customerJourney.map(stage => ({
      touchpoint: stage.stage,
      currentValue: stage.revenue * stage.conversion,
      potentialValue: stage.revenue * Math.min(stage.conversion * 1.5, 0.8),
      optimizationActions: stage.gaps
    }));

    const revenueSequence: RevenueSequence = {
      totalTouchpoints: customerJourney.length,
      revenuePerCustomer: customerJourney.reduce((sum, stage) => sum + (stage.revenue * stage.conversion), 0),
      optimization: this.generateSequenceOptimization(customerJourney)
    };

    return {
      customerJourney,
      touchpointOptimization,
      revenueSequence
    };
  }

  private estimateMainOfferRevenue(context: BusinessContext): number {
    if (context.currentRevenue && context.customerCount) {
      return (context.currentRevenue / 12) / context.customerCount;
    }
    
    // Fallback based on business stage
    const stageRevenues = {
      startup: 500,
      growth: 2000,
      scale: 5000,
      mature: 10000
    };
    
    return stageRevenues[context.businessStage] || 1000;
  }

  private generateSequenceOptimization(journey: JourneyStage[]): string[] {
    const optimizations: string[] = [];
    
    journey.forEach((stage, index) => {
      if (stage.gaps.length > 0) {
        optimizations.push(`${stage.stage}: ${stage.gaps[0]}`);
      }
      
      if (stage.conversion < 0.2 && index > 0) {
        optimizations.push(`${stage.stage}: Improve conversion through better timing and offer`);
      }
    });
    
    return optimizations;
  }

  private identifyMonetizationGaps(assessment: FourProngAssessment, offers: SequentialOffers, context: BusinessContext): MonetizationGaps {
    const missedOpportunities: string[] = [];
    const underperformingAreas: string[] = [];
    const quickWins: string[] = [];
    const strategicImprovements: string[] = [];

    // Check each prong for gaps
    if (!assessment.attraction.exists || assessment.attraction.effectiveness < 5) {
      missedOpportunities.push('No effective attraction offer to liquidate CAC');
      quickWins.push('Create free-plus-shipping or low-cost front-end offer');
    }

    if (!assessment.upsell.exists || assessment.upsell.effectiveness < 6) {
      missedOpportunities.push('Missing immediate post-purchase upsells');
      quickWins.push('Add simple upsell after main purchase');
    }

    if (!assessment.downsell.exists || assessment.downsell.effectiveness < 5) {
      missedOpportunities.push('No downsell strategy for rejected customers');
      strategicImprovements.push('Develop payment plans and lite versions');
    }

    if (!assessment.continuity.exists || assessment.continuity.effectiveness < 6) {
      missedOpportunities.push('No recurring revenue streams');
      strategicImprovements.push('Build subscription or membership model');
    }

    // Analyze revenue sequence for underperforming areas
    offers.touchpointOptimization.forEach(touchpoint => {
      const improvementPotential = (touchpoint.potentialValue - touchpoint.currentValue) / touchpoint.currentValue;
      if (improvementPotential > 0.5) {
        underperformingAreas.push(`${touchpoint.touchpoint}: ${Math.round(improvementPotential * 100)}% improvement potential`);
      }
    });

    return {
      missedOpportunities,
      underperformingAreas,
      quickWins,
      strategicImprovements
    };
  }

  private calculateRevenueOptimization(context: BusinessContext, gaps: MonetizationGaps, offers: SequentialOffers): RevenueOptimization {
    const currentRevenue = offers.revenueSequence.revenuePerCustomer * (context.customerCount || 100);
    
    // Calculate improvement potential based on gaps
    let improvementMultiplier = 1;
    
    // Each missing prong represents significant opportunity
    if (gaps.missedOpportunities.length > 0) {
      improvementMultiplier += gaps.missedOpportunities.length * 0.3; // 30% per missing prong
    }
    
    // Quick wins provide immediate gains
    improvementMultiplier += gaps.quickWins.length * 0.15; // 15% per quick win
    
    const optimizedRevenue = currentRevenue * improvementMultiplier;
    const improvementPotential = Math.round(((optimizedRevenue - currentRevenue) / currentRevenue) * 100);

    const priorityActions = [
      ...gaps.quickWins.slice(0, 2),
      ...gaps.strategicImprovements.slice(0, 2)
    ];

    return {
      currentRevenue,
      optimizedRevenue,
      improvementPotential,
      priorityActions
    };
  }

  private generateMoneyModelRecommendations(
    assessment: FourProngAssessment,
    offers: SequentialOffers,
    gaps: MonetizationGaps,
    context: BusinessContext
  ): string[] {
    const recommendations: string[] = [];

    // Prioritize based on Hormozi's framework
    recommendations.push("Implement the complete 4-Prong Money Model for maximum customer value");

    // Add specific recommendations for each prong
    recommendations.push(...assessment.attraction.recommendations);
    recommendations.push(...assessment.upsell.recommendations);
    recommendations.push(...assessment.downsell.recommendations);
    recommendations.push(...assessment.continuity.recommendations);

    // Add gap-based recommendations
    recommendations.push(...gaps.quickWins);
    recommendations.push(...gaps.strategicImprovements.slice(0, 2));

    // Business stage specific recommendations
    if (context.businessStage === 'startup') {
      recommendations.push("Focus on attraction and upsell prongs first to achieve CFA");
    } else if (context.businessStage === 'growth') {
      recommendations.push("Implement all four prongs systematically to maximize revenue per customer");
    } else if (context.businessStage === 'scale') {
      recommendations.push("Optimize existing prongs and create advanced monetization sequences");
    }

    // Sequential offer recommendations
    recommendations.push(...offers.revenueSequence.optimization);

    // Hormozi's core money model principles
    recommendations.push("Map complete customer journey from first contact to maximum monetization");
    recommendations.push("Test and optimize each touchpoint for maximum conversion and value");
    recommendations.push("Create systematic upsell sequences based on customer success milestones");

    return recommendations.slice(0, 12); // Limit to most important recommendations
  }

  private async enhanceWithAutomation(context: BusinessContext, assessment: FourProngAssessment): Promise<any> {
    // This would integrate with N8n MCP for workflow automation
    try {
      // Placeholder for N8n MCP integration
      // const workflows = await n8nMCP.searchNodes({
      //   query: 'upsell automation email sequence customer journey',
      //   limit: 5
      // });

      const insights = [
        "N8n workflow automation would be integrated here",
        `4-Prong Model Automation Score: ${assessment.overallMaturity}/10`,
        "Automated sequences available for each money model prong"
      ];

      const recommendations = [
        "Create automated upsell sequences using N8n workflows",
        "Set up customer journey automation based on purchase behavior",
        "Implement automated downsell triggers for declined customers"
      ];

      return { insights, recommendations };
    } catch (error) {
      return null;
    }
  }

  private calculateConfidence(context: BusinessContext): number {
    let confidence = 40; // Base confidence for money model analysis

    if (context.currentRevenue) confidence += 20;
    if (context.customerCount) confidence += 20;
    if (context.ltv) confidence += 15;
    if (context.businessStage === 'growth' || context.businessStage === 'scale') confidence += 15;

    return Math.min(confidence, 85); // Cap at 85% for strategic recommendations
  }

  getDiagnosticQuestions(): string[] {
    return this.diagnosticQuestions;
  }
}