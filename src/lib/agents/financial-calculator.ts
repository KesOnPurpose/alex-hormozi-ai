// Financial Calculator Agent - CFA and Business Metrics Analysis
// Specializes in Alex Hormozi's financial frameworks and Client Financed Acquisition

import { AgentAnalysis, BusinessContext } from './main-conductor';

export interface FinancialAnalysis {
  cfaAnalysis: CFAAnalysis;
  advertisingLevel: AdvertisingLevel;
  businessMetrics: BusinessMetrics;
  growthProjections: GrowthProjections;
}

export interface CFAAnalysis {
  thirtyDayGrossProfit: number;
  cac: number;
  cfaRatio: number;
  achievesCFA: boolean;
  timeToBreakeven: number; // in days
  recommendations: string[];
}

export interface AdvertisingLevel {
  currentLevel: 0 | 1 | 2 | 3;
  levelDescription: string;
  requirements: string;
  nextLevelActions: string[];
}

export interface BusinessMetrics {
  ltvcacRatio: number;
  grossMargin: number;
  paybackPeriod: number; // in months
  growthConstraint: 'capital' | 'operational' | 'market' | 'none';
  metrics: any;
}

export interface GrowthProjections {
  monthlyGrowthPotential: number;
  yearOneProjection: number;
  scalingBottlenecks: string[];
  investmentNeeds: number;
}

export class FinancialCalculator {
  private diagnosticQuestions = [
    "What's your current customer acquisition cost (CAC)?",
    "How much gross profit do you make per customer in the first 30 days?",
    "What's your lifetime value per customer?",
    "What's your gross profit margin?",
    "How long does it take to break even on a new customer?",
    "What percentage of customers pay upfront vs. monthly?",
    "What's your current monthly recurring revenue?",
    "How much could you spend per day on advertising if money wasn't a constraint?"
  ];

  async analyze(query: string, context: BusinessContext): Promise<AgentAnalysis> {
    const findings: string[] = [];
    const recommendations: string[] = [];

    // 1. Calculate CFA Status
    const cfaAnalysis = this.calculateCFA(context);
    findings.push(`CFA Status: ${cfaAnalysis.achievesCFA ? 'ACHIEVED' : 'NOT ACHIEVED'}`);
    findings.push(`30-day GP/CAC ratio: ${cfaAnalysis.cfaRatio.toFixed(2)}x`);

    // 2. Determine Advertising Level
    const advertisingLevel = this.determineAdvertisingLevel(context, cfaAnalysis);
    findings.push(`Current Advertising Level: ${advertisingLevel.currentLevel}`);
    findings.push(`Status: ${advertisingLevel.levelDescription}`);

    // 3. Calculate Business Metrics
    const businessMetrics = this.calculateBusinessMetrics(context, cfaAnalysis);
    findings.push(`LTV/CAC ratio: ${businessMetrics.ltvcacRatio.toFixed(2)}x`);
    findings.push(`Primary constraint: ${businessMetrics.growthConstraint}`);

    // 4. Project Growth Potential
    const growthProjections = this.calculateGrowthProjections(context, cfaAnalysis, advertisingLevel);
    findings.push(`Monthly growth potential: ${growthProjections.monthlyGrowthPotential}%`);

    // 5. Generate Hormozi-style financial recommendations
    recommendations.push(...this.generateFinancialRecommendations(cfaAnalysis, advertisingLevel, businessMetrics, context));

    // 6. MCP Enhancement - Real-time calculations
    const calculationData = await this.enhanceWithCalculations(context, cfaAnalysis);
    if (calculationData) {
      findings.push(...calculationData.insights);
      recommendations.push(...calculationData.recommendations);
    }

    return {
      agentType: 'financial',
      findings,
      recommendations,
      metrics: { cfaAnalysis, advertisingLevel, businessMetrics, growthProjections },
      confidence: this.calculateConfidence(context)
    };
  }

  private calculateCFA(context: BusinessContext): CFAAnalysis {
    const cac = context.cac || 0;
    const grossMargin = (context.grossMargin || 50) / 100;
    
    // Estimate monthly revenue per customer
    const estimatedMonthlyRevenue = this.estimateMonthlyRevenuePerCustomer(context);
    const thirtyDayGrossProfit = estimatedMonthlyRevenue * grossMargin;
    
    const cfaRatio = cac > 0 ? thirtyDayGrossProfit / cac : 0;
    const achievesCFA = cfaRatio > 1;
    
    // Calculate time to breakeven in days
    const dailyGrossProfit = thirtyDayGrossProfit / 30;
    const timeToBreakeven = dailyGrossProfit > 0 ? cac / dailyGrossProfit : Infinity;

    const recommendations: string[] = [];
    
    if (!achievesCFA) {
      const shortfall = cac - thirtyDayGrossProfit;
      recommendations.push(`Need to increase 30-day gross profit by $${shortfall.toFixed(2)} to achieve CFA`);
      recommendations.push("Consider immediate upsells, higher pricing, or front-loaded payment terms");
      recommendations.push("Focus on reducing customer acquisition cost through better targeting");
    } else {
      const excess = thirtyDayGrossProfit - cac;
      recommendations.push(`CFA achieved with $${excess.toFixed(2)} excess - reinvest in advertising`);
      recommendations.push("Scale advertising spend aggressively while maintaining CFA ratio");
    }

    return {
      thirtyDayGrossProfit,
      cac,
      cfaRatio,
      achievesCFA,
      timeToBreakeven: Math.round(timeToBreakeven),
      recommendations
    };
  }

  private estimateMonthlyRevenuePerCustomer(context: BusinessContext): number {
    if (context.currentRevenue && context.customerCount) {
      return (context.currentRevenue / 12) / context.customerCount;
    }
    
    // Fallback estimation based on business stage
    const stageMultipliers = {
      startup: 100,
      growth: 500,
      scale: 2000,
      mature: 5000
    };
    
    return stageMultipliers[context.businessStage] || 500;
  }

  private determineAdvertisingLevel(context: BusinessContext, cfaAnalysis: CFAAnalysis): AdvertisingLevel {
    const ltv = context.ltv || 0;
    const cac = context.cac || 0;
    const ltvCacRatio = cac > 0 ? ltv / cac : 0;
    
    // Alex Hormozi's 3 Levels of Advertising
    if (ltvCacRatio <= 1) {
      return {
        currentLevel: 0,
        levelDescription: "Unprofitable - losing money on each customer",
        requirements: "LTV must be greater than CAC",
        nextLevelActions: [
          "Increase lifetime value through better retention",
          "Reduce customer acquisition cost",
          "Improve offer to justify higher pricing"
        ]
      };
    } else if (!cfaAnalysis.achievesCFA) {
      return {
        currentLevel: 1,
        levelDescription: "Basic Viability - profitable but cash flow constrained",
        requirements: "30-day gross profit > CAC",
        nextLevelActions: [
          "Add immediate upsells after initial purchase",
          "Implement front-loaded payment terms",
          "Create higher-margin initial offers"
        ]
      };
    } else if (cfaAnalysis.cfaRatio < 2) {
      return {
        currentLevel: 2,
        levelDescription: "Self-Funding Growth - can reinvest profits",
        requirements: "30-day gross profit > 2x CAC",
        nextLevelActions: [
          "Optimize upsell sequences for faster payback",
          "Increase initial transaction value",
          "Test premium pricing tiers"
        ]
      };
    } else {
      return {
        currentLevel: 3,
        levelDescription: "Unlimited Scale - maximum advertising freedom",
        requirements: "Maintained with operational scaling",
        nextLevelActions: [
          "Scale advertising spend exponentially",
          "Expand to new channels and markets",
          "Focus on operational constraints"
        ]
      };
    }
  }

  private calculateBusinessMetrics(context: BusinessContext, cfaAnalysis: CFAAnalysis): BusinessMetrics {
    const ltv = context.ltv || 0;
    const cac = context.cac || 1;
    const ltvcacRatio = ltv / cac;
    const grossMargin = context.grossMargin || 50;
    
    // Calculate payback period in months
    const monthlyGrossProfit = cfaAnalysis.thirtyDayGrossProfit;
    const paybackPeriod = monthlyGrossProfit > 0 ? cac / monthlyGrossProfit : Infinity;
    
    // Identify growth constraint
    let growthConstraint: 'capital' | 'operational' | 'market' | 'none' = 'capital';
    
    if (cfaAnalysis.achievesCFA && cfaAnalysis.cfaRatio > 2) {
      growthConstraint = 'operational'; // Money isn't the constraint anymore
    } else if (cfaAnalysis.achievesCFA) {
      growthConstraint = 'none'; // Balanced growth
    } else if (context.businessStage === 'mature') {
      growthConstraint = 'market'; // Market saturation
    }

    return {
      ltvcacRatio,
      grossMargin,
      paybackPeriod,
      growthConstraint,
      metrics: {
        monthlyGrossProfit: cfaAnalysis.thirtyDayGrossProfit,
        breakEvenDays: cfaAnalysis.timeToBreakeven,
        excessCash: Math.max(0, cfaAnalysis.thirtyDayGrossProfit - cac)
      }
    };
  }

  private calculateGrowthProjections(context: BusinessContext, cfaAnalysis: CFAAnalysis, advertisingLevel: AdvertisingLevel): GrowthProjections {
    let monthlyGrowthPotential = 0;
    let yearOneProjection = context.currentRevenue || 0;
    const scalingBottlenecks: string[] = [];
    let investmentNeeds = 0;

    // Growth potential based on advertising level
    switch (advertisingLevel.currentLevel) {
      case 0:
        monthlyGrowthPotential = 5; // Limited growth due to losses
        scalingBottlenecks.push("Negative unit economics");
        investmentNeeds = Math.abs(cfaAnalysis.thirtyDayGrossProfit - cfaAnalysis.cac) * 100; // Estimate fix cost
        break;
      case 1:
        monthlyGrowthPotential = 15; // Moderate growth, cash flow limited
        scalingBottlenecks.push("Cash flow constraints");
        investmentNeeds = cfaAnalysis.cac * 50; // Working capital needs
        break;
      case 2:
        monthlyGrowthPotential = 30; // Strong growth potential
        scalingBottlenecks.push("Operational capacity");
        investmentNeeds = 0; // Self-funding
        break;
      case 3:
        monthlyGrowthPotential = 50; // Unlimited growth potential
        scalingBottlenecks.push("Market size", "Team scaling");
        investmentNeeds = 0; // Self-funding with excess
        break;
    }

    // Calculate year-one projection with compound growth
    yearOneProjection = yearOneProjection * Math.pow(1 + (monthlyGrowthPotential / 100), 12);

    return {
      monthlyGrowthPotential,
      yearOneProjection,
      scalingBottlenecks,
      investmentNeeds
    };
  }

  private generateFinancialRecommendations(
    cfaAnalysis: CFAAnalysis,
    advertisingLevel: AdvertisingLevel,
    businessMetrics: BusinessMetrics,
    context: BusinessContext
  ): string[] {
    const recommendations: string[] = [];

    // Add CFA-specific recommendations
    recommendations.push(...cfaAnalysis.recommendations);

    // Add advertising level recommendations
    recommendations.push(...advertisingLevel.nextLevelActions);

    // Hormozi's financial philosophy recommendations
    if (businessMetrics.ltvcacRatio < 3) {
      recommendations.push("Focus on increasing LTV through better retention and upsells");
    }

    if (businessMetrics.paybackPeriod > 6) {
      recommendations.push("Reduce payback period through front-loaded offers and immediate upsells");
    }

    // Business stage specific financial recommendations
    if (context.businessStage === 'startup') {
      recommendations.push("Prioritize achieving CFA before scaling marketing spend");
      recommendations.push("Test multiple pricing models to optimize unit economics");
    } else if (context.businessStage === 'growth' && cfaAnalysis.achievesCFA) {
      recommendations.push("Reinvest all excess CFA cash into advertising for exponential growth");
      recommendations.push("Monitor for operational constraints as growth accelerates");
    }

    // Constraint-specific recommendations
    switch (businessMetrics.growthConstraint) {
      case 'capital':
        recommendations.push("Focus on CFA achievement to eliminate capital constraints");
        break;
      case 'operational':
        recommendations.push("Invest in systems and team to handle increased volume");
        break;
      case 'market':
        recommendations.push("Explore adjacent markets or improve market penetration");
        break;
    }

    return recommendations;
  }

  private async enhanceWithCalculations(context: BusinessContext, cfaAnalysis: CFAAnalysis): Promise<any> {
    // This would integrate with IDE MCP for complex financial modeling
    try {
      // Placeholder for IDE MCP integration for advanced calculations
      // const calculations = await ideMCP.executeCode({
      //   code: `
      //     import numpy as np
      //     import pandas as pd
      //     
      //     # Advanced financial modeling
      //     cac = ${context.cac}
      //     ltv = ${context.ltv}
      //     gross_margin = ${context.grossMargin}
      //     
      //     # Calculate growth scenarios
      //     scenarios = calculate_growth_scenarios(cac, ltv, gross_margin)
      //     return scenarios
      //   `
      // });

      const insights = [
        "Advanced financial modeling would be performed using IDE MCP",
        `Break-even analysis: ${cfaAnalysis.timeToBreakeven} days`,
        `Cash conversion efficiency: ${cfaAnalysis.cfaRatio.toFixed(2)}x`
      ];

      const recommendations = [
        "Monte Carlo analysis would show growth probability distributions",
        "Scenario modeling would identify optimal pricing strategies"
      ];

      return { insights, recommendations };
    } catch (error) {
      return null;
    }
  }

  private calculateConfidence(context: BusinessContext): number {
    let confidence = 30; // Lower base for financial calculations

    if (context.cac) confidence += 25;
    if (context.ltv) confidence += 25;
    if (context.grossMargin) confidence += 20;
    if (context.currentRevenue && context.customerCount) confidence += 20;

    return Math.min(confidence, 90); // Cap at 90% for financial projections
  }

  // Utility methods for financial calculations
  calculateCFARatio(thirtyDayGP: number, cac: number): number {
    return cac > 0 ? thirtyDayGP / cac : 0;
  }

  calculateLTVCACRatio(ltv: number, cac: number): number {
    return cac > 0 ? ltv / cac : 0;
  }

  calculatePaybackPeriod(cac: number, monthlyGrossProfit: number): number {
    return monthlyGrossProfit > 0 ? cac / monthlyGrossProfit : Infinity;
  }

  getDiagnosticQuestions(): string[] {
    return this.diagnosticQuestions;
  }
}