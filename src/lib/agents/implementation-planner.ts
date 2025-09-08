// Implementation Planner Agent - Action Plans & Systematic Execution
// Specializes in turning Alex Hormozi's frameworks into actionable implementation roadmaps

import { AgentAnalysis, BusinessContext } from './main-conductor';

export interface ImplementationAnalysis {
  implementationPlan: ImplementationPlan;
  priorityMatrix: PriorityMatrix;
  resourceRequirements: ResourceRequirements;
  timeline: Timeline;
  riskAssessment: RiskAssessment;
}

export interface ImplementationPlan {
  phases: ImplementationPhase[];
  totalDuration: number; // in weeks
  successMetrics: string[];
  dependencies: string[];
}

export interface ImplementationPhase {
  phase: string;
  duration: number; // in weeks
  objectives: string[];
  deliverables: string[];
  prerequisites: string[];
  risks: string[];
}

export interface PriorityMatrix {
  critical: PriorityItem[];
  high: PriorityItem[];
  medium: PriorityItem[];
  low: PriorityItem[];
}

export interface PriorityItem {
  action: string;
  impact: number; // 1-10
  effort: number; // 1-10
  urgency: number; // 1-10
  frameworks: string[];
  dependencies: string[];
}

export interface ResourceRequirements {
  team: TeamRequirement[];
  technology: TechnologyRequirement[];
  budget: BudgetRequirement[];
  timeline: number; // in weeks
}

export interface TeamRequirement {
  role: string;
  timeCommitment: string;
  skills: string[];
  optional: boolean;
}

export interface TechnologyRequirement {
  tool: string;
  purpose: string;
  cost: string;
  alternatives: string[];
}

export interface BudgetRequirement {
  category: string;
  estimatedCost: number;
  priority: 'essential' | 'recommended' | 'nice-to-have';
  roi_timeline: string;
}

export interface Timeline {
  weeks: TimelineWeek[];
  milestones: Milestone[];
  criticalPath: string[];
}

export interface TimelineWeek {
  week: number;
  focus: string;
  tasks: string[];
  deliverables: string[];
  metrics: string[];
}

export interface Milestone {
  name: string;
  week: number;
  criteria: string[];
  dependencies: string[];
}

export interface RiskAssessment {
  risks: Risk[];
  mitigationStrategies: string[];
  contingencyPlans: string[];
}

export interface Risk {
  risk: string;
  probability: number; // 1-10
  impact: number; // 1-10
  mitigation: string[];
}

export class ImplementationPlanner {
  private diagnosticQuestions = [
    "What is your current team size and available time for implementation?",
    "What tools and systems do you currently have in place?",
    "What's your budget for implementing new strategies?",
    "How quickly do you need to see results?",
    "What has prevented you from implementing similar strategies before?",
    "Who will be responsible for executing these changes?",
    "What are your biggest constraints (time, money, team, knowledge)?",
    "How do you currently measure success and track progress?"
  ];

  async analyze(query: string, context: BusinessContext): Promise<AgentAnalysis> {
    const findings: string[] = [];
    const recommendations: string[] = [];

    // 1. Create Implementation Plan
    const implementationPlan = this.createImplementationPlan(context, query);
    findings.push(`Implementation Timeline: ${implementationPlan.totalDuration} weeks`);
    findings.push(`Implementation Phases: ${implementationPlan.phases.length}`);
    findings.push(`Success Metrics Defined: ${implementationPlan.successMetrics.length}`);

    // 2. Build Priority Matrix
    const priorityMatrix = this.buildPriorityMatrix(context, query);
    findings.push(`Critical Actions: ${priorityMatrix.critical.length}`);
    findings.push(`High Priority Actions: ${priorityMatrix.high.length}`);
    findings.push(`Quick Wins Available: ${priorityMatrix.high.filter(item => item.effort <= 3).length}`);

    // 3. Assess Resource Requirements
    const resourceRequirements = this.assessResourceRequirements(context, priorityMatrix);
    findings.push(`Team Requirements: ${resourceRequirements.team.length} roles`);
    findings.push(`Technology Stack: ${resourceRequirements.technology.length} tools`);
    findings.push(`Estimated Budget: $${resourceRequirements.budget.reduce((sum, req) => sum + req.estimatedCost, 0)}`);

    // 4. Create Detailed Timeline
    const timeline = this.createDetailedTimeline(implementationPlan, priorityMatrix);
    findings.push(`Key Milestones: ${timeline.milestones.length}`);
    findings.push(`Critical Path Items: ${timeline.criticalPath.length}`);

    // 5. Conduct Risk Assessment
    const riskAssessment = this.conductRiskAssessment(context, implementationPlan);
    findings.push(`Identified Risks: ${riskAssessment.risks.length}`);
    findings.push(`High-Risk Items: ${riskAssessment.risks.filter(r => r.probability * r.impact > 30).length}`);

    // 6. Generate Implementation Recommendations
    recommendations.push(...this.generateImplementationRecommendations(implementationPlan, priorityMatrix, resourceRequirements, riskAssessment, context));

    return {
      agentType: 'implementation',
      findings,
      recommendations,
      metrics: { implementationPlan, priorityMatrix, resourceRequirements, timeline, riskAssessment },
      confidence: this.calculateConfidence(context)
    };
  }

  private createImplementationPlan(context: BusinessContext, query: string): ImplementationPlan {
    const queryLower = query.toLowerCase();
    
    // Determine focus areas based on query and context
    const focusAreas = this.identifyFocusAreas(queryLower, context);
    
    // Create phases based on Hormozi's systematic approach
    const phases: ImplementationPhase[] = [];

    // Phase 1: Foundation & Metrics
    phases.push({
      phase: 'Foundation Setup',
      duration: 2,
      objectives: [
        'Establish baseline metrics and tracking',
        'Set up measurement systems',
        'Define success criteria'
      ],
      deliverables: [
        'Current CAC, LTV, and gross margin calculations',
        'Tracking dashboard setup',
        'Success metrics documentation'
      ],
      prerequisites: [],
      risks: ['Inaccurate baseline data', 'Lack of historical data']
    });

    // Phase 2: Quick Wins
    phases.push({
      phase: 'Quick Wins Implementation',
      duration: 3,
      objectives: [
        'Implement highest-impact, lowest-effort improvements',
        'Generate early momentum and results',
        'Build team confidence'
      ],
      deliverables: [
        'Immediate upsell offers launched',
        'Pricing optimizations implemented',
        'Basic automation setup'
      ],
      prerequisites: ['Foundation Setup completed'],
      risks: ['Over-optimization too quickly', 'Team overwhelm']
    });

    // Phase 3: Core Framework Implementation
    if (focusAreas.includes('cfa') || focusAreas.includes('financial')) {
      phases.push({
        phase: 'CFA Achievement',
        duration: 4,
        objectives: [
          'Achieve Client Financed Acquisition',
          'Optimize 30-day gross profit',
          'Implement systematic upsells'
        ],
        deliverables: [
          'CFA ratio > 1.0 achieved',
          'Upsell sequences implemented',
          'Payment term optimizations'
        ],
        prerequisites: ['Quick Wins Implementation completed'],
        risks: ['Customer resistance to changes', 'Cash flow disruption']
      });
    }

    if (focusAreas.includes('offer') || focusAreas.includes('value')) {
      phases.push({
        phase: 'Grand Slam Offer Development',
        duration: 3,
        objectives: [
          'Optimize value equation',
          'Implement Grand Slam Offer framework',
          'Test and refine offers'
        ],
        deliverables: [
          'Value equation optimized',
          'New offer structure launched',
          'A/B test results documented'
        ],
        prerequisites: ['Foundation Setup completed'],
        risks: ['Market rejection of new offers', 'Conversion rate drops']
      });
    }

    if (focusAreas.includes('money-model') || focusAreas.includes('revenue')) {
      phases.push({
        phase: '4-Prong Money Model',
        duration: 6,
        objectives: [
          'Implement complete 4-prong system',
          'Optimize each revenue stream',
          'Integrate all touchpoints'
        ],
        deliverables: [
          'All four prongs operational',
          'Revenue per customer increased',
          'Systematic monetization documented'
        ],
        prerequisites: ['Quick Wins Implementation completed'],
        risks: ['Complexity overwhelming customers', 'System integration challenges']
      });
    }

    // Final Phase: Optimization & Scale
    phases.push({
      phase: 'Optimization & Scale',
      duration: 4,
      objectives: [
        'Optimize all implemented systems',
        'Scale successful strategies',
        'Prepare for growth constraints'
      ],
      deliverables: [
        'Performance optimization completed',
        'Scaling processes documented',
        'Team training materials created'
      ],
      prerequisites: ['All previous phases completed'],
      risks: ['Operational constraints', 'Quality degradation']
    });

    const totalDuration = phases.reduce((sum, phase) => sum + phase.duration, 0);
    
    const successMetrics = [
      'CAC reduction of 20%+',
      'LTV increase of 30%+',
      'CFA ratio > 1.5',
      'Revenue per customer increase of 50%+',
      'Implementation timeline adherence > 90%'
    ];

    const dependencies = [
      'Team availability and commitment',
      'Access to customer data and metrics',
      'Budget approval for tools and testing',
      'Customer communication capabilities'
    ];

    return {
      phases,
      totalDuration,
      successMetrics,
      dependencies
    };
  }

  private identifyFocusAreas(query: string, context: BusinessContext): string[] {
    const focusAreas: string[] = [];
    
    if (query.includes('cfa') || query.includes('cash flow') || query.includes('financial')) {
      focusAreas.push('cfa', 'financial');
    }
    
    if (query.includes('offer') || query.includes('value') || query.includes('pricing')) {
      focusAreas.push('offer', 'value');
    }
    
    if (query.includes('revenue') || query.includes('money model') || query.includes('upsell')) {
      focusAreas.push('money-model', 'revenue');
    }
    
    if (query.includes('psychology') || query.includes('conversion') || query.includes('timing')) {
      focusAreas.push('psychology', 'conversion');
    }

    // Default focus based on business stage if no specific areas identified
    if (focusAreas.length === 0) {
      if (context.businessStage === 'startup') {
        focusAreas.push('offer', 'cfa');
      } else if (context.businessStage === 'growth') {
        focusAreas.push('money-model', 'financial');
      } else {
        focusAreas.push('optimization', 'scale');
      }
    }

    return focusAreas;
  }

  private buildPriorityMatrix(context: BusinessContext, query: string): PriorityMatrix {
    const actions: PriorityItem[] = [];

    // Financial actions
    actions.push({
      action: 'Calculate accurate CAC and LTV metrics',
      impact: 9,
      effort: 2,
      urgency: 10,
      frameworks: ['Client Financed Acquisition', 'Financial Calculator'],
      dependencies: ['Access to customer data']
    });

    actions.push({
      action: 'Implement immediate post-purchase upsell',
      impact: 8,
      effort: 4,
      urgency: 8,
      frameworks: ['5 Upsell Moments', '4-Prong Money Model'],
      dependencies: ['Upsell offer design']
    });

    actions.push({
      action: 'Optimize pricing for value equation',
      impact: 9,
      effort: 3,
      urgency: 7,
      frameworks: ['Grand Slam Offer', 'Value Equation'],
      dependencies: ['Competitive analysis']
    });

    actions.push({
      action: 'Create downsell offers for rejected prospects',
      impact: 6,
      effort: 5,
      urgency: 5,
      frameworks: ['4-Prong Money Model', 'Psychology Optimization'],
      dependencies: ['Main offer optimization']
    });

    actions.push({
      action: 'Set up recurring revenue stream',
      impact: 9,
      effort: 7,
      urgency: 6,
      frameworks: ['4-Prong Money Model', 'Continuity Offers'],
      dependencies: ['Service delivery capability']
    });

    actions.push({
      action: 'Implement behavioral triggers (scarcity, urgency)',
      impact: 7,
      effort: 3,
      urgency: 7,
      frameworks: ['Psychology Optimization'],
      dependencies: ['Offer structure finalization']
    });

    actions.push({
      action: 'Test and optimize upsell timing',
      impact: 8,
      effort: 4,
      urgency: 6,
      frameworks: ['5 Upsell Moments', 'Psychology Optimization'],
      dependencies: ['Customer journey mapping']
    });

    actions.push({
      action: 'Create comprehensive measurement dashboard',
      impact: 7,
      effort: 6,
      urgency: 8,
      frameworks: ['Business Metrics', 'Financial Calculator'],
      dependencies: ['Data integration setup']
    });

    // Prioritize actions
    const critical = actions.filter(a => a.urgency >= 8 && a.impact >= 8);
    const high = actions.filter(a => (a.urgency >= 6 && a.impact >= 7) && !critical.includes(a));
    const medium = actions.filter(a => (a.urgency >= 4 && a.impact >= 5) && !critical.includes(a) && !high.includes(a));
    const low = actions.filter(a => !critical.includes(a) && !high.includes(a) && !medium.includes(a));

    return { critical, high, medium, low };
  }

  private assessResourceRequirements(context: BusinessContext, priorities: PriorityMatrix): ResourceRequirements {
    const allActions = [...priorities.critical, ...priorities.high, ...priorities.medium];
    
    const team: TeamRequirement[] = [
      {
        role: 'Implementation Lead',
        timeCommitment: '20-30 hours/week',
        skills: ['Project management', 'Business analysis', 'Hormozi frameworks'],
        optional: false
      },
      {
        role: 'Data Analyst',
        timeCommitment: '10-15 hours/week',
        skills: ['Excel/Sheets', 'Dashboard creation', 'Metrics tracking'],
        optional: false
      },
      {
        role: 'Marketing/Sales Support',
        timeCommitment: '15-20 hours/week',
        skills: ['Customer communication', 'Offer creation', 'A/B testing'],
        optional: false
      },
      {
        role: 'Technical Support',
        timeCommitment: '5-10 hours/week',
        skills: ['Automation tools', 'Integration setup', 'Testing'],
        optional: true
      }
    ];

    const technology: TechnologyRequirement[] = [
      {
        tool: 'Analytics Dashboard',
        purpose: 'Track CAC, LTV, and key metrics',
        cost: '$50-200/month',
        alternatives: ['Google Analytics', 'Mixpanel', 'Custom spreadsheet']
      },
      {
        tool: 'Email Marketing Platform',
        purpose: 'Automated upsell sequences',
        cost: '$100-500/month',
        alternatives: ['ConvertKit', 'Klaviyo', 'ActiveCampaign']
      },
      {
        tool: 'A/B Testing Tool',
        purpose: 'Test offers and timing',
        cost: '$100-300/month',
        alternatives: ['Google Optimize (free)', 'Optimizely', 'VWO']
      },
      {
        tool: 'Customer Survey Platform',
        purpose: 'Gather feedback and insights',
        cost: '$50-150/month',
        alternatives: ['Typeform', 'SurveyMonkey', 'Google Forms']
      }
    ];

    const budget: BudgetRequirement[] = [
      {
        category: 'Tools and Software',
        estimatedCost: 5000,
        priority: 'essential',
        roi_timeline: '3-6 months'
      },
      {
        category: 'Testing and Optimization',
        estimatedCost: 3000,
        priority: 'recommended',
        roi_timeline: '2-4 months'
      },
      {
        category: 'Team Training',
        estimatedCost: 2000,
        priority: 'recommended',
        roi_timeline: '6-12 months'
      },
      {
        category: 'Consulting/Support',
        estimatedCost: 8000,
        priority: 'nice-to-have',
        roi_timeline: '3-6 months'
      }
    ];

    const timeline = Math.max(12, allActions.length * 0.5); // Minimum 12 weeks

    return { team, technology, budget, timeline };
  }

  private createDetailedTimeline(plan: ImplementationPlan, priorities: PriorityMatrix): Timeline {
    const weeks: TimelineWeek[] = [];
    const milestones: Milestone[] = [];
    let currentWeek = 1;

    // Build weekly timeline
    plan.phases.forEach((phase, phaseIndex) => {
      for (let week = 0; week < phase.duration; week++) {
        const weekNumber = currentWeek + week;
        const isFirstWeek = week === 0;
        const isLastWeek = week === phase.duration - 1;

        weeks.push({
          week: weekNumber,
          focus: phase.phase,
          tasks: isFirstWeek ? phase.objectives.slice(0, 2) : 
                 isLastWeek ? [`Complete ${phase.phase}`, 'Prepare for next phase'] :
                 phase.objectives.slice(2),
          deliverables: isLastWeek ? phase.deliverables : [`Progress on ${phase.phase}`],
          metrics: [`Track phase ${phaseIndex + 1} KPIs`, 'Weekly progress review']
        });
      }

      // Add milestone at end of each phase
      milestones.push({
        name: `${phase.phase} Complete`,
        week: currentWeek + phase.duration - 1,
        criteria: phase.deliverables,
        dependencies: phase.prerequisites
      });

      currentWeek += phase.duration;
    });

    const criticalPath = [
      'Foundation Setup',
      'Quick Wins Implementation',
      'Core Framework Implementation',
      'Optimization & Scale'
    ];

    return { weeks, milestones, criticalPath };
  }

  private conductRiskAssessment(context: BusinessContext, plan: ImplementationPlan): RiskAssessment {
    const risks: Risk[] = [
      {
        risk: 'Team capacity constraints',
        probability: 7,
        impact: 8,
        mitigation: ['Secure team commitment upfront', 'Plan for part-time resources', 'Prioritize ruthlessly']
      },
      {
        risk: 'Customer resistance to changes',
        probability: 6,
        impact: 7,
        mitigation: ['Communicate changes clearly', 'Test changes with small groups', 'Provide grandfathering options']
      },
      {
        risk: 'Technical integration challenges',
        probability: 5,
        impact: 6,
        mitigation: ['Start with simple solutions', 'Plan for technical support', 'Have backup options']
      },
      {
        risk: 'Cash flow disruption during changes',
        probability: 4,
        impact: 9,
        mitigation: ['Test changes carefully', 'Maintain current revenue streams', 'Plan for temporary dips']
      },
      {
        risk: 'Lack of accurate baseline data',
        probability: 8,
        impact: 6,
        mitigation: ['Start data collection immediately', 'Use estimates initially', 'Refine over time']
      }
    ];

    const mitigationStrategies = [
      'Start with highest-impact, lowest-risk changes',
      'Maintain detailed progress tracking and communication',
      'Build in buffer time for unexpected challenges',
      'Create fallback plans for critical changes'
    ];

    const contingencyPlans = [
      'If team capacity becomes constrained: reduce scope and focus on critical items',
      'If customer resistance is high: slow rollout and increase communication',
      'If technical challenges arise: revert to manual processes temporarily',
      'If cash flow is impacted: pause non-critical changes and stabilize'
    ];

    return { risks, mitigationStrategies, contingencyPlans };
  }

  private generateImplementationRecommendations(
    plan: ImplementationPlan,
    priorities: PriorityMatrix,
    resources: ResourceRequirements,
    risks: RiskAssessment,
    context: BusinessContext
  ): string[] {
    const recommendations: string[] = [];

    // Hormozi's implementation philosophy
    recommendations.push("Start with the highest-leverage activities that require the least change");
    recommendations.push("Focus on one framework at a time to avoid overwhelming the team");

    // Priority-based recommendations
    recommendations.push(`Begin with ${priorities.critical.length} critical actions in first 2 weeks`);
    recommendations.push("Quick wins first: implement easy changes to build momentum");

    // Resource-specific recommendations
    if (resources.team.length > 3) {
      recommendations.push("Assign clear ownership for each implementation area");
    }
    recommendations.push("Set up weekly progress reviews and metric tracking");

    // Risk mitigation recommendations
    const highRisks = risks.risks.filter(r => r.probability * r.impact > 30);
    if (highRisks.length > 0) {
      recommendations.push(`Address ${highRisks.length} high-risk areas proactively`);
    }

    // Business stage specific recommendations
    if (context.businessStage === 'startup') {
      recommendations.push("Focus on CFA achievement before scaling complexity");
      recommendations.push("Test all changes with small customer segments first");
    } else if (context.businessStage === 'growth') {
      recommendations.push("Implement systematic processes for all new strategies");
      recommendations.push("Plan for operational scaling alongside revenue optimization");
    } else if (context.businessStage === 'scale') {
      recommendations.push("Focus on automation and delegation of implementation");
      recommendations.push("Create documented processes for team replication");
    }

    // Timeline recommendations
    recommendations.push(`Plan for ${plan.totalDuration}-week implementation timeline`);
    recommendations.push("Build in 20% buffer time for unexpected challenges");

    // Success tracking recommendations
    recommendations.push("Track leading indicators (activities) not just lagging indicators (results)");
    recommendations.push("Celebrate milestone achievements to maintain team momentum");

    return recommendations.slice(0, 12); // Limit to most important recommendations
  }

  private calculateConfidence(context: BusinessContext): number {
    let confidence = 70; // Higher base for implementation planning

    if (context.businessStage === 'growth' || context.businessStage === 'scale') confidence += 10;
    if (context.currentRevenue && context.currentRevenue > 500000) confidence += 10;
    if (context.customerCount && context.customerCount > 100) confidence += 5;

    return Math.min(confidence, 85); // Cap at 85% for implementation predictions
  }

  getDiagnosticQuestions(): string[] {
    return this.diagnosticQuestions;
  }
}