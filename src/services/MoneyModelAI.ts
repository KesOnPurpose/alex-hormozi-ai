// Dual-Mode AI Analysis Engine for Visual + Text Money Models
// Combines structural pattern recognition with detailed metric analysis

import { 
  OfferNode, 
  MoneyModel, 
  StructuralInsights, 
  MetricInsights, 
  MasterInsights,
  Connection,
  OfferType 
} from '@/types/money-model'

export class MoneyModelAI {
  
  /**
   * VISUAL ANALYSIS - Analyzes structure, patterns, and flow
   */
  analyzeVisualStructure(offers: OfferNode[]): StructuralInsights {
    const patternRecognized = this.recognizePattern(offers)
    const structureScore = this.calculateStructureScore(offers)
    const gapsIdentified = this.identifyStructuralGaps(offers)
    const flowAnalysis = this.analyzeCustomerFlow(offers)
    
    return {
      patternRecognized,
      structureScore,
      gapsIdentified,
      flowAnalysis
    }
  }
  
  /**
   * TEXT ANALYSIS - Analyzes metrics, numbers, and optimization
   */
  analyzeTextMetrics(offers: OfferNode[]): MetricInsights {
    const revenueOptimization = this.analyzeRevenueOptimization(offers)
    const pricingAnalysis = this.analyzePricing(offers)
    const conversionOptimization = this.analyzeConversions(offers)
    
    return {
      revenueOptimization,
      pricingAnalysis,
      conversionOptimization
    }
  }
  
  /**
   * COMBINED INTELLIGENCE - Merges both analyses for master insights
   */
  combinedAnalysis(visual: StructuralInsights, metrics: MetricInsights, offers: OfferNode[]): MasterInsights {
    const priorityActions = this.generatePriorityActions(visual, metrics, offers)
    const scenarioModeling = this.modelScenarios(offers, visual, metrics)
    const benchmarkComparison = this.benchmarkAgainstIndustry(offers)
    
    return {
      priorityActions,
      scenarioModeling,
      benchmarkComparison
    }
  }
  
  // === VISUAL ANALYSIS METHODS ===
  
  private recognizePattern(offers: OfferNode[]): string {
    const types = offers.map(o => o.type)
    const hasAttraction = types.includes('attraction')
    const hasCore = types.includes('core')
    const hasContinuity = types.includes('continuity')
    const hasUpsells = types.includes('upsell')
    const hasDownsells = types.includes('downsell')
    
    // Classic Hormozi patterns
    if (hasAttraction && hasCore && hasContinuity && hasUpsells) {
      return "Complete Value Ladder (Hormozi Model)"
    } else if (hasCore && hasUpsells && offers.length >= 3) {
      return "Ascension Model"
    } else if (hasAttraction && offers.length <= 3) {
      return "Simple Funnel"
    } else if (hasContinuity && offers.filter(o => o.type === 'continuity').length >= 2) {
      return "Subscription Stack"
    } else {
      return "Custom Structure"
    }
  }
  
  private calculateStructureScore(offers: OfferNode[]): number {
    let score = 0
    
    // Completeness scoring
    const types = new Set(offers.map(o => o.type))
    score += types.size * 15 // Variety bonus
    
    // Essential components
    if (types.has('attraction')) score += 20
    if (types.has('core')) score += 25
    if (types.has('continuity')) score += 20
    if (types.has('upsell')) score += 15
    
    // Flow scoring
    const avgConnections = offers.reduce((sum, o) => sum + o.connections.length, 0) / offers.length
    score += Math.min(avgConnections * 10, 20)
    
    // Position scoring (visual arrangement)
    score += this.scoreVisualArrangement(offers)
    
    return Math.min(score, 100)
  }
  
  private scoreVisualArrangement(offers: OfferNode[]): number {
    // Score based on logical visual flow
    const attractions = offers.filter(o => o.type === 'attraction')
    const core = offers.filter(o => o.type === 'core')
    const upsells = offers.filter(o => o.type === 'upsell')
    
    let score = 0
    
    // Attractions should be left/top (entry points)
    attractions.forEach(offer => {
      if (offer.position.x < 300) score += 5
    })
    
    // Core should be central
    core.forEach(offer => {
      if (offer.position.x > 200 && offer.position.x < 600) score += 5
    })
    
    // Upsells should be right/bottom (exit points)
    upsells.forEach(offer => {
      if (offer.position.x > 400) score += 5
    })
    
    return Math.min(score, 15)
  }
  
  private identifyStructuralGaps(offers: OfferNode[]) {
    const gaps = []
    const prices = offers.map(o => o.price).sort((a, b) => a - b)
    const types = new Set(offers.map(o => o.type))
    
    // Price gap analysis
    for (let i = 0; i < prices.length - 1; i++) {
      const gap = prices[i + 1] - prices[i]
      if (gap > prices[i] * 3) { // 3x jump is significant
        gaps.push({
          type: 'price_gap' as const,
          severity: gap > prices[i] * 5 ? 'high' as const : 'medium' as const,
          description: `Large price jump from $${prices[i]} to $${prices[i + 1]}`,
          suggestedFix: `Add bridge offer around $${Math.round((prices[i] + prices[i + 1]) / 2)}`,
          estimatedImpact: gap * 0.2 // 20% of gap value monthly
        })
      }
    }
    
    // Missing essential components
    if (!types.has('attraction')) {
      gaps.push({
        type: 'missing_bridge' as const,
        severity: 'high' as const,
        description: 'No attraction/front-end offer to acquire customers',
        suggestedFix: 'Add low-priced front-end offer ($27-$97)',
        estimatedImpact: 5000
      })
    }
    
    if (!types.has('continuity')) {
      gaps.push({
        type: 'positioning_issue' as const,
        severity: 'medium' as const,
        description: 'No recurring revenue component',
        suggestedFix: 'Add subscription/membership offer',
        estimatedImpact: 2000
      })
    }
    
    // Flow break analysis
    const flowBreaks = this.findFlowBreaks(offers)
    gaps.push(...flowBreaks)
    
    return gaps
  }
  
  private findFlowBreaks(offers: OfferNode[]) {
    const breaks = []
    const allConnections = offers.flatMap(o => o.connections)
    
    // Find offers with no incoming connections (except attraction offers)
    const connectedOffers = new Set(allConnections.map(c => c.toOfferId))
    
    offers.forEach(offer => {
      if (offer.type !== 'attraction' && !connectedOffers.has(offer.id)) {
        breaks.push({
          type: 'flow_break' as const,
          severity: 'medium' as const,
          description: `${offer.name} has no customer path leading to it`,
          suggestedFix: `Connect ${offer.name} to your customer journey`,
          estimatedImpact: offer.metrics.projectedMonthlyRevenue * 0.5
        })
      }
    })
    
    return breaks
  }
  
  private analyzeCustomerFlow(offers: OfferNode[]) {
    const paths = this.findAllCustomerPaths(offers)
    
    return paths.map(path => ({
      path: path.offerIds,
      conversionRate: path.overallConversion,
      revenueContribution: path.revenueContribution,
      bottlenecks: path.bottlenecks
    }))
  }
  
  private findAllCustomerPaths(offers: OfferNode[]) {
    // Find all possible customer journey paths
    const attractions = offers.filter(o => o.type === 'attraction')
    const paths = []
    
    attractions.forEach(attraction => {
      const path = this.tracePath(attraction, offers, [])
      if (path.length > 1) {
        paths.push({
          offerIds: path.map(o => o.name),
          overallConversion: this.calculatePathConversion(path),
          revenueContribution: this.calculatePathRevenue(path),
          bottlenecks: this.identifyBottlenecks(path)
        })
      }
    })
    
    return paths
  }
  
  private tracePath(currentOffer: OfferNode, allOffers: OfferNode[], visited: string[]): OfferNode[] {
    if (visited.includes(currentOffer.id)) return [currentOffer]
    
    const path = [currentOffer]
    visited.push(currentOffer.id)
    
    // Find the highest converting next step
    const bestConnection = currentOffer.connections
      .sort((a, b) => b.conversionRate - a.conversionRate)[0]
    
    if (bestConnection) {
      const nextOffer = allOffers.find(o => o.id === bestConnection.toOfferId)
      if (nextOffer) {
        path.push(...this.tracePath(nextOffer, allOffers, visited))
      }
    }
    
    return path
  }
  
  // === TEXT ANALYSIS METHODS ===
  
  private analyzeRevenueOptimization(offers: OfferNode[]) {
    return offers.map(offer => {
      const current = offer.metrics.currentMonthlyRevenue
      const projected = offer.metrics.projectedMonthlyRevenue
      const potential = this.calculateRevenuePotential(offer)
      
      return {
        offerId: offer.id,
        currentPerformance: current,
        potentialPerformance: potential,
        improvementStrategy: this.generateImprovementStrategy(offer, potential),
        confidenceLevel: this.calculateConfidence(offer)
      }
    })
  }
  
  private calculateRevenuePotential(offer: OfferNode): number {
    const { metrics } = offer
    
    // Market-based potential calculation
    const industryBenchmarks = this.getIndustryBenchmarks(offer.type)
    const optimizedConversion = Math.min(metrics.conversionRate * 1.5, industryBenchmarks.topConversion)
    const optimizedAOV = Math.min(offer.price * 1.2, industryBenchmarks.topAOV)
    
    return Math.round(metrics.trafficVolume * optimizedConversion * optimizedAOV / 100)
  }
  
  private getIndustryBenchmarks(offerType: OfferType) {
    // Industry benchmark data (would be from database in production)
    const benchmarks = {
      attraction: { topConversion: 15, topAOV: 97 },
      core: { topConversion: 25, topAOV: 997 },
      upsell: { topConversion: 35, topAOV: 1997 },
      downsell: { topConversion: 45, topAOV: 297 },
      continuity: { topConversion: 65, topAOV: 97 }
    }
    
    return benchmarks[offerType] || benchmarks.core
  }
  
  private analyzePricing(offers: OfferNode[]) {
    return offers.map(offer => {
      const valueScore = this.calculateValueScore(offer)
      const suggestedPrice = this.calculateOptimalPrice(offer, valueScore)
      
      return {
        offerId: offer.id,
        currentPrice: offer.price,
        suggestedPrice,
        priceElasticity: this.calculatePriceElasticity(offer),
        reasoning: this.generatePricingReasoning(offer, suggestedPrice)
      }
    })
  }
  
  private calculateValueScore(offer: OfferNode): number {
    const { metrics } = offer
    
    // Hormozi's Value Equation: (Dream Outcome × Perceived Likelihood) / (Time Delay × Effort & Sacrifice)
    const dreamOutcome = metrics.lifetimeValue / 100 // Normalize
    const likelihood = metrics.competitiveAdvantage * 10
    const timeDelay = offer.metrics.deliveryTimeframe === 'immediate' ? 1 : 5
    const effort = metrics.customerEffortRequired
    
    return Math.round((dreamOutcome * likelihood) / (timeDelay * effort))
  }
  
  private calculateOptimalPrice(offer: OfferNode, valueScore: number): number {
    const currentPrice = offer.price
    const valueMultiplier = valueScore / 50 // Normalize around 50
    const marketPosition = offer.metrics.competitiveAdvantage / 10
    
    const suggestedPrice = currentPrice * valueMultiplier * marketPosition
    
    // Keep within reasonable bounds
    return Math.round(Math.max(suggestedPrice, currentPrice * 0.8))
  }
  
  // === HELPER METHODS ===
  
  private calculatePathConversion(path: OfferNode[]): number {
    return path.reduce((conversion, offer, index) => {
      if (index === 0) return 1
      const connection = path[index - 1].connections.find(c => c.toOfferId === offer.id)
      return conversion * (connection?.conversionRate || 50) / 100
    }, 1)
  }
  
  private calculatePathRevenue(path: OfferNode[]): number {
    return path.reduce((revenue, offer) => revenue + offer.metrics.currentMonthlyRevenue, 0)
  }
  
  private identifyBottlenecks(path: OfferNode[]): string[] {
    const bottlenecks = []
    
    for (let i = 0; i < path.length - 1; i++) {
      const connection = path[i].connections.find(c => c.toOfferId === path[i + 1].id)
      if (connection && connection.conversionRate < 20) {
        bottlenecks.push(`Low conversion from ${path[i].name} to ${path[i + 1].name} (${connection.conversionRate}%)`)
      }
    }
    
    return bottlenecks
  }
  
  private generateImprovementStrategy(offer: OfferNode, potential: number): string {
    const current = offer.metrics.currentMonthlyRevenue
    const gap = potential - current
    
    if (gap > current * 0.5) {
      return "High-impact optimization: Focus on conversion rate and pricing"
    } else if (gap > current * 0.2) {
      return "Medium-impact optimization: Improve offer positioning"
    } else {
      return "Low-impact optimization: Fine-tune messaging"
    }
  }
  
  private calculateConfidence(offer: OfferNode): number {
    // Confidence based on data quality and market validation
    let confidence = 50
    
    if (offer.metrics.currentMonthlyRevenue > 0) confidence += 20
    if (offer.metrics.marketDemand > 7) confidence += 15
    if (offer.metrics.competitiveAdvantage > 7) confidence += 15
    
    return Math.min(confidence, 100)
  }
  
  private generatePricingReasoning(offer: OfferNode, suggestedPrice: number): string {
    const current = offer.price
    const change = suggestedPrice - current
    const changePercent = Math.round((change / current) * 100)
    
    if (changePercent > 20) {
      return `Strong value proposition supports ${changePercent}% increase`
    } else if (changePercent > 0) {
      return `Moderate increase of ${changePercent}% aligns with market value`
    } else {
      return `Current pricing is optimal for market position`
    }
  }
  
  private calculatePriceElasticity(offer: OfferNode): number {
    // Simplified elasticity calculation
    const competitiveAdvantage = offer.metrics.competitiveAdvantage
    const marketDemand = offer.metrics.marketDemand
    
    return Math.round(((competitiveAdvantage + marketDemand) / 20) * 100) / 100
  }
  
  private analyzeConversions(offers: OfferNode[]) {
    const allConnections = offers.flatMap(o => o.connections)
    
    return allConnections.map(connection => ({
      connectionId: connection.id,
      currentRate: connection.conversionRate,
      benchmarkRate: this.getBenchmarkConversion(connection),
      optimizationTactics: this.getOptimizationTactics(connection)
    }))
  }
  
  private getBenchmarkConversion(connection: Connection): number {
    // Industry benchmark conversions by trigger type
    const benchmarks = {
      'purchase': 25,
      'result achieved': 35,
      'time elapsed': 15
    }
    
    return benchmarks[connection.trigger as keyof typeof benchmarks] || 20
  }
  
  private getOptimizationTactics(connection: Connection): string[] {
    const tactics = []
    
    if (connection.conversionRate < 15) {
      tactics.push("Improve offer timing and positioning")
      tactics.push("Add social proof and urgency")
    }
    
    if (connection.trigger === 'time elapsed') {
      tactics.push("Reduce time delay between offers")
      tactics.push("Add nurture sequence")
    }
    
    return tactics
  }
  
  private generatePriorityActions(visual: StructuralInsights, metrics: MetricInsights, offers: OfferNode[]) {
    const actions = []
    
    // Combine structural and metric insights
    visual.gapsIdentified.forEach((gap, index) => {
      actions.push({
        id: `structural_${index}`,
        title: gap.description,
        description: gap.suggestedFix,
        type: 'structural' as const,
        impact: gap.severity === 'critical' ? 'game_changer' as const : 'high' as const,
        effort: 'moderate' as const,
        expectedReturn: gap.estimatedImpact,
        timeToImplement: '2-4 weeks'
      })
    })
    
    // Add revenue optimization actions
    metrics.revenueOptimization
      .sort((a, b) => b.potentialPerformance - a.potentialPerformance)
      .slice(0, 3)
      .forEach((opt, index) => {
        actions.push({
          id: `revenue_${index}`,
          title: `Optimize ${offers.find(o => o.id === opt.offerId)?.name}`,
          description: opt.improvementStrategy,
          type: 'pricing' as const,
          impact: 'high' as const,
          effort: 'quick_win' as const,
          expectedReturn: opt.potentialPerformance - opt.currentPerformance,
          timeToImplement: '1-2 weeks'
        })
      })
    
    return actions.sort((a, b) => b.expectedReturn - a.expectedReturn).slice(0, 8)
  }
  
  private modelScenarios(offers: OfferNode[], visual: StructuralInsights, metrics: MetricInsights) {
    return [
      {
        name: "Quick Wins Implementation",
        changes: ["Optimize top 3 offers", "Fix major price gaps"],
        projectedRevenue: offers.reduce((sum, o) => sum + o.metrics.projectedMonthlyRevenue, 0) * 1.3,
        implementationCost: 5000,
        roi: 260,
        riskLevel: 20
      },
      {
        name: "Complete Structure Overhaul",
        changes: ["Implement all recommendations", "Add missing offer types"],
        projectedRevenue: offers.reduce((sum, o) => sum + o.metrics.projectedMonthlyRevenue, 0) * 2.1,
        implementationCost: 25000,
        roi: 420,
        riskLevel: 60
      }
    ]
  }
  
  private benchmarkAgainstIndustry(offers: OfferNode[]) {
    const totalRevenue = offers.reduce((sum, o) => sum + o.metrics.currentMonthlyRevenue, 0)
    
    return {
      industryAverage: 45000,
      topPerformers: 150000,
      yourPosition: totalRevenue,
      gapAnalysis: [
        `You're ${totalRevenue > 45000 ? 'above' : 'below'} industry average`,
        `Top performers make ${Math.round((150000 - totalRevenue) / 1000)}K more per month`,
        `Focus on ${totalRevenue < 45000 ? 'conversion optimization' : 'scaling traffic'}`
      ]
    }
  }
}