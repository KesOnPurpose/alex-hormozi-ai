// Mock N8n Agent Responses for Testing
// This simulates what your N8n workflows would return when they're active

export interface MockAgentResponse {
  analysis: any;
  synthesis?: string;
  confidence?: number;
  frameworks?: string[];
}

export class MockAgentService {
  static getMockResponse(agentType: string, query: string): MockAgentResponse {
    const responses: Record<string, MockAgentResponse> = {
      'master-conductor': {
        analysis: {
          primaryConstraint: "Growth Scaling",
          orchestrationPlan: "Multi-agent analysis required for comprehensive business transformation",
          confidenceScore: 0.92,
          evidence: [
            "Revenue growth stagnation indicates systematic constraint",
            "Multiple growth levers need simultaneous optimization", 
            "Requires coordinated constraint resolution approach"
          ],
          actionableRecommendations: [
            "Identify the primary constraint limiting $50k+ growth",
            "Implement systematic constraint resolution methodology",
            "Focus on one constraint at a time for maximum impact"
          ]
        },
        synthesis: `🎯 **Master Conductor Analysis**

Based on your query, I'm orchestrating a comprehensive analysis using Alex Hormozi's proven frameworks.

**Primary Focus**: Growth constraint identification and systematic resolution
**Analysis Approach**: Multi-agent coordination for holistic business transformation
**Expected Outcome**: Clear roadmap for breaking through current revenue plateau

The constraint limiting your growth from $50k+ is likely one of the 4 Universal Constraints. Let's identify and resolve it systematically.`,
        frameworks: ['4 Universal Business Constraints', 'Multi-Agent Orchestration', 'Systematic Constraint Resolution']
      },

      'constraint-analyzer': {
        analysis: {
          primaryConstraint: "Sales Conversion",
          constraintEvidence: "Lead generation working but conversion rates below optimal",
          rootCause: "Offer positioning and value communication gaps",
          nextConstraint: "Delivery optimization once sales constraint resolved",
          confidenceScore: 0.88,
          actionPlan: [
            { step: "Audit current sales process and conversion metrics", priority: 1 },
            { step: "Analyze offer positioning against Grand Slam Offer framework", priority: 2 },
            { step: "Implement conversion optimization testing", priority: 3 }
          ]
        },
        synthesis: `🔍 **Constraint Analysis Complete**

**Primary Constraint Identified**: SALES (Conversion)
**Evidence**: You mentioned getting leads but struggling with conversion
**Root Cause**: Gap in offer positioning and value communication

"Every business has one constraint at a time that limits growth. Fix this first." - Alex Hormozi

**Next Constraint**: Once sales conversion is optimized, delivery and retention will become your next focus area.`,
        frameworks: ['4 Universal Constraints', 'Sequential Constraint Solving', 'Root Cause Analysis']
      },

      'offer-analyzer': {
        analysis: {
          valueEquationScores: {
            dreamOutcome: 75,
            perceivedLikelihood: 65,
            timeDelay: 70,
            effortSacrifice: 60
          },
          valueEquationTotal: 67.5,
          offerStrengths: [
            "Clear outcome promise established",
            "Industry expertise demonstrated"
          ],
          implementationPriority: {
            immediate: [
              "Increase perceived likelihood with proof elements",
              "Reduce customer effort and sacrifice requirements",
              "Add urgency and scarcity elements"
            ]
          },
          confidenceScore: 0.85
        },
        synthesis: `💎 **Grand Slam Offer Analysis**

**Current Value Equation Score**: 67.5/100
**Primary Opportunity**: Perceived Likelihood (65/100) needs strengthening

**Value Equation Breakdown**:
- Dream Outcome: 75/100 ✅ Good
- Perceived Likelihood: 65/100 ⚠️ Needs improvement  
- Time Delay: 70/100 ✅ Acceptable
- Effort & Sacrifice: 60/100 ⚠️ Too high

**Grand Slam Opportunity**: Add proof elements (testimonials, case studies, guarantees) to increase perceived likelihood to 90+.`,
        frameworks: ['Grand Slam Offer', 'Value Equation', 'Proof Elements Strategy']
      },

      'financial-calculator': {
        analysis: {
          cfaAnalysis: {
            gapAnalysis: "Currently at Level 1 - Need to reach Level 2 for CFA",
            thirtyDayGP: 400,
            targetCFA: 600
          },
          advertisingLevel: {
            current: 1,
            target: 2
          },
          metricsAnalysis: {
            cac: 300,
            ltv: 1500,
            paybackPeriod: 45,
            ltvToCacRatio: 5.0
          },
          confidenceScore: 0.91
        },
        synthesis: `📊 **Financial Analysis Complete**

**Current Status**: Level 1 Advertising (LTV > CAC ✅)
**CFA Goal**: Need $300 more in 30-day gross profit per customer

**Key Metrics**:
- CAC: $300
- LTV: $1,500  
- 30-day GP: ~$400 (Need $600+ for CFA)
- Payback: 45 days

**CFA Strategy**: Focus on immediate upsells and front-loaded value to increase 30-day gross profit by $200+ per customer.`,
        frameworks: ['Client Financed Acquisition', '3 Levels of Advertising', 'Unit Economics']
      },

      'money-model-architect': {
        analysis: {
          prongAnalysis: {
            attraction: { exists: true, optimization: "moderate" },
            upsell: { exists: false, opportunity: "high" },
            downsell: { exists: false, opportunity: "medium" },  
            continuity: { exists: false, opportunity: "high" }
          },
          projectedImpact: {
            revenueIncrease: "150-200%",
            avgOrderValue: "2.5x current"
          },
          confidenceScore: 0.89
        },
        synthesis: `🏗️ **4-Prong Money Model Architecture**

**Current State**: Single-prong model (main offer only)
**Opportunity**: 150-200% revenue increase with full 4-prong implementation

**Missing Prongs**:
- ❌ **Upsell**: Immediate revenue maximizer
- ❌ **Downsell**: Conversion recovery system  
- ❌ **Continuity**: Predictable recurring revenue

**Implementation Priority**: Start with Upsell prong for immediate impact, then build Continuity for stable cash flow.`,
        frameworks: ['4-Prong Money Model', 'Sequential Offers', 'Revenue Architecture']
      },

      'psychology-optimizer': {
        analysis: {
          upsellMoments: {
            immediately: { implemented: false, opportunity: "critical" },
            nextStep: { implemented: false, opportunity: "high" },
            afterBigWin: { implemented: false, opportunity: "high" },
            halfwayPoint: { implemented: false, opportunity: "medium" },
            lastChance: { implemented: false, opportunity: "medium" }
          },
          persuasionStrategy: {
            primaryTrigger: "Point of Greatest Deprivation",
            secondaryTriggers: ["Social Proof", "Urgency", "Authority"]
          },
          confidenceScore: 0.87
        },
        synthesis: `🧠 **Psychology Optimization Analysis**

**5 Upsell Moments Assessment**:
- 🔥 **Immediately**: Highest impact opportunity (not implemented)
- ⚡ **Next Step (24-72h)**: High conversion potential
- 🏆 **After Big Win**: Capitalize on success momentum

**Primary Strategy**: Point of Greatest Deprivation - present solutions exactly when customers feel the pain most acutely.

**Implementation**: Start with "Immediately" moment for 3x higher conversion rates.`,
        frameworks: ['5 Upsell Moments', 'Point of Greatest Deprivation', 'Behavioral Psychology']
      },

      'implementation-planner': {
        analysis: {
          implementationRoadmap: {
            phase1: { duration: "30 days", focus: "Constraint Resolution" },
            phase2: { duration: "30 days", focus: "Offer Optimization" }, 
            phase3: { duration: "30 days", focus: "Scale Systems" }
          },
          prioritizedActions: {
            critical: [
              { action: "Identify and resolve primary sales constraint", timeline: "Week 1-2" },
              { action: "Implement Grand Slam Offer improvements", timeline: "Week 3-4" }
            ],
            high: [
              { action: "Build upsell sequence for immediate revenue", timeline: "Week 5-6" },
              { action: "Test and optimize conversion funnel", timeline: "Week 7-8" }
            ]
          },
          resourceRequirements: {
            timeCommitment: "15-20 hours/week",
            budget: "$5,000-10,000 testing budget",
            team: "Marketing specialist recommended"
          },
          confidenceScore: 0.93
        },
        synthesis: `📋 **90-Day Implementation Roadmap**

**Phase 1 (Days 1-30): Constraint Resolution**
- Identify primary constraint limiting growth
- Implement systematic constraint resolution
- Establish baseline metrics and tracking

**Phase 2 (Days 31-60): Offer Optimization**  
- Execute Grand Slam Offer improvements
- Build and test upsell sequences
- Optimize conversion pathways

**Phase 3 (Days 61-90): Scale Systems**
- Implement full 4-prong money model
- Scale successful optimizations
- Prepare for next growth phase

**Resource Requirements**: 15-20hrs/week, $5-10k testing budget`,
        frameworks: ['Systematic Implementation', 'Phased Execution', 'Resource Planning']
      },

      'coaching-methodology': {
        analysis: {
          primaryConstraint: "Sales Conversion",
          applicableFrameworks: ['4 Universal Constraints', 'Grand Slam Offer', 'Systematic Constraint Resolution'],
          alexQuote: "The fastest way to grow is to identify your constraint, then focus 100% of your energy on solving it.",
          coachingResponse: "Based on your situation, we need to systematically identify which of the 4 Universal Constraints is limiting your growth, then apply the appropriate Alex Hormozi framework to resolve it.",
          confidenceScore: 0.95
        },
        synthesis: `🎓 **Coaching Methodology Applied**

**Systematic Approach**: Alex Hormozi's 4 Universal Constraints Framework
**Primary Focus**: Constraint identification and systematic resolution

**Alex Hormozi Quote**: "${query.includes('stalled') ? 'The fastest way to grow is to identify your constraint, then focus 100% of your energy on solving it.' : 'Perfect one at a time - don\'t try to fix everything at once.'}"

**Coaching Strategy**:
1. **Diagnose**: Identify the primary constraint
2. **Focus**: Apply 100% energy to that constraint
3. **Resolve**: Use proven frameworks systematically
4. **Move**: Only tackle next constraint once current is solved

**Expected Outcome**: Clear constraint resolution and sustainable growth acceleration.`,
        frameworks: ['Alex Hormozi Coaching System', 'Systematic Constraint Resolution', 'Sequential Problem Solving']
      }
    };

    return responses[agentType] || responses['master-conductor'];
  }
}