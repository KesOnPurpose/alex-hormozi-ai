/**
 * ============================================================================
 * ALEX HORMOZI COPY GENERATION AI
 * ============================================================================
 * Intelligent copy generation based on Alex Hormozi's proven frameworks
 * - Value Equation: Dream Outcome ÷ (Time Delay × Effort × Sacrifice) × Likelihood of Achievement
 * - Grand Slam Offer: Value + Urgency + Scarcity + Bonuses + Guarantees + Naming
 * - Pain/Dream framework for emotional triggers
 * ============================================================================
 */

import { OfferNode, OfferCopy } from '@/types/money-model'

export class CopyGenerationAI {
  // Alex Hormozi's Value Equation Framework
  private calculateValueScore(offer: OfferNode): number {
    const dreamOutcome = offer.metrics.lifetimeValue
    const timeDelay = this.getTimeDelayScore(offer.metrics.deliveryTimeframe)
    const effort = 10 - offer.metrics.customerEffortRequired // Invert for easier scoring
    const sacrifice = offer.price
    const likelihood = offer.metrics.conversionRate
    
    return (dreamOutcome / (timeDelay * (10 - effort) * Math.log10(sacrifice + 1))) * (likelihood / 100)
  }

  private getTimeDelayScore(timeframe: string): number {
    if (timeframe.includes('immediate')) return 1
    if (timeframe.includes('day')) return 2
    if (timeframe.includes('week')) return 4
    if (timeframe.includes('month')) return 8
    return 10
  }

  // Generate headlines using Hormozi's frameworks
  generateHeadline(offer: OfferNode): string {
    const valueScore = this.calculateValueScore(offer)
    const templates = this.getHeadlineTemplates(offer.type, valueScore)
    
    return this.personalizeTemplate(templates[0], offer)
  }

  private getHeadlineTemplates(type: string, valueScore: number): string[] {
    const templates = {
      attraction: [
        'Get {RESULT} Without {PAIN_POINT} (Even If {OBJECTION})',
        'The {TIME_FRAME} System That {TRANSFORMATION}',
        'How to {DESIRED_OUTCOME} in {TIME_FRAME} or Less',
        'Stop {CURRENT_STRUGGLE} - Start {DESIRED_OUTCOME}'
      ],
      core: [
        'Transform Your {AREA} with the {METHOD_NAME} System',
        'The Complete {TRANSFORMATION} Program That {GUARANTEE}',
        '{RESULT} Guaranteed in {TIME_FRAME} or Your Money Back',
        'The {SUPERLATIVE} Way to {OUTCOME} Without {SACRIFICE}'
      ],
      upsell: [
        'Accelerate Your {CURRENT_RESULT} by {MULTIPLIER}x',
        'The Advanced {SYSTEM} for {ENHANCED_OUTCOME}',
        'Go from {CURRENT_STATE} to {ELEVATED_STATE} Faster',
        'The {VIP_EXPERIENCE} That {EXCLUSIVE_BENEFIT}'
      ],
      downsell: [
        'Essential {SOLUTION} at {DISCOUNT}% Off',
        'The Simplified Path to {OUTCOME}',
        'Get Started with {BASIC_SOLUTION} Today',
        '{CORE_VALUE} Without the Premium Price'
      ]
    }

    return templates[type as keyof typeof templates] || templates.core
  }

  private personalizeTemplate(template: string, offer: OfferNode): string {
    const replacements = {
      '{RESULT}': this.getResultPhrase(offer),
      '{PAIN_POINT}': this.getPainPoint(offer.type),
      '{OBJECTION}': this.getCommonObjection(offer.type),
      '{TIME_FRAME}': offer.metrics.deliveryTimeframe,
      '{TRANSFORMATION}': this.getTransformation(offer),
      '{DESIRED_OUTCOME}': this.getDesiredOutcome(offer.type),
      '{CURRENT_STRUGGLE}': this.getCurrentStruggle(offer.type),
      '{AREA}': this.getBusinessArea(offer.type),
      '{METHOD_NAME}': this.getMethodName(offer.name),
      '{GUARANTEE}': this.getGuarantee(offer),
      '{SUPERLATIVE}': this.getSuperlative(offer),
      '{OUTCOME}': this.getOutcome(offer),
      '{SACRIFICE}': this.getSacrifice(offer.type),
      '{CURRENT_RESULT}': this.getCurrentResult(offer.type),
      '{MULTIPLIER}': this.getMultiplier(offer),
      '{ENHANCED_OUTCOME}': this.getEnhancedOutcome(offer),
      '{CURRENT_STATE}': this.getCurrentState(offer.type),
      '{ELEVATED_STATE}': this.getElevatedState(offer.type),
      '{VIP_EXPERIENCE}': this.getVIPExperience(offer),
      '{EXCLUSIVE_BENEFIT}': this.getExclusiveBenefit(offer),
      '{SOLUTION}': this.getSolution(offer.name),
      '{DISCOUNT}': this.getDiscountPercentage(offer),
      '{BASIC_SOLUTION}': this.getBasicSolution(offer.name),
      '{CORE_VALUE}': this.getCoreValue(offer)
    }

    let result = template
    Object.entries(replacements).forEach(([key, value]) => {
      result = result.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), value)
    })

    return result
  }

  // Generate value propositions using Hormozi's pain/dream framework
  generateValueProposition(offer: OfferNode): string {
    const painPoints = this.getPainPoints(offer.type)
    const dreamOutcome = this.getDreamOutcome(offer.type)
    const mechanism = this.getMechanism(offer.name)
    
    return `Transform from ${painPoints[0]} to ${dreamOutcome} using our proven ${mechanism} system in just ${offer.metrics.deliveryTimeframe}.`
  }

  // Generate social proof using specific metrics
  generateSocialProof(offer: OfferNode) {
    const baseCustomers = Math.floor(offer.metrics.customersPerMonth * 12)
    const successRate = Math.min(95, 70 + offer.metrics.conversionRate)
    const averageResult = this.calculateAverageResult(offer)

    return {
      customersServed: baseCustomers,
      successRate,
      averageResult,
      testimonials: this.generateTestimonials(offer, successRate)
    }
  }

  private calculateAverageResult(offer: OfferNode): string {
    if (offer.metrics.lifetimeValue > 10000) {
      return `$${Math.floor(offer.metrics.lifetimeValue/1000)}k+ in value`
    } else if (offer.metrics.lifetimeValue > 1000) {
      return `$${Math.floor(offer.metrics.lifetimeValue/100)*100}+ return`
    } else {
      return `${offer.metrics.conversionRate * 2}% improvement`
    }
  }

  // Generate urgency using scarcity and time-sensitivity
  generateUrgency(offer: OfferNode) {
    const urgencyTypes = {
      high_ticket: { type: 'scarcity', message: 'Only 10 spots available this month' },
      medium_ticket: { type: 'time-sensitive', message: 'Special pricing ends in 48 hours' },
      low_ticket: { type: 'seasonal', message: 'Limited-time launch offer' },
      free: { type: 'launch', message: 'Get instant access while it\'s free' }
    }

    const category = offer.price > 1000 ? 'high_ticket' : 
                    offer.price > 100 ? 'medium_ticket' : 
                    offer.price > 0 ? 'low_ticket' : 'free'

    return urgencyTypes[category]
  }

  // Generate risk reversal using guarantees
  generateRiskReversal(offer: OfferNode) {
    const guaranteeStrength = offer.metrics.conversionRate > 20 ? 'strong' : 'standard'
    
    const guarantees = {
      strong: {
        guarantee: '60-day money-back guarantee + keep all bonuses',
        trial: offer.price > 0 ? '14-day free trial with full access' : 'Free forever, no strings attached',
        refundPolicy: 'Full refund within 60 days, no questions asked'
      },
      standard: {
        guarantee: '30-day money-back guarantee',
        trial: offer.price > 0 ? '7-day free trial' : 'Free access included',
        refundPolicy: 'Full refund if not satisfied within 30 days'
      }
    }

    return guarantees[guaranteeStrength]
  }

  // Generate value stack using Hormozi's value stacking method
  generateValueStack(offer: OfferNode) {
    const baseValue = offer.price * 3
    const bonusMultiplier = offer.metrics.lifetimeValue / offer.price

    const components = [
      {
        component: `Core ${this.getMethodName(offer.name)} System`,
        value: Math.floor(baseValue * 0.4),
        description: 'Complete step-by-step training and implementation guide'
      },
      {
        component: 'Exclusive Bonus Materials',
        value: Math.floor(baseValue * 0.3),
        description: 'Templates, worksheets, and done-for-you resources'
      },
      {
        component: 'Premium Support & Updates',
        value: Math.floor(baseValue * 0.2),
        description: 'Ongoing assistance and lifetime updates'
      },
      {
        component: 'Fast-Action Bonus',
        value: Math.floor(baseValue * 0.1),
        description: 'Exclusive bonus for taking action today'
      }
    ]

    const totalValue = components.reduce((sum, comp) => sum + comp.value, 0)

    return {
      perceivedValue: totalValue,
      valueBreakdown: components
    }
  }

  // Generate objection handling using common business objections
  generateObjectionHandling(offer: OfferNode) {
    const objections = {
      price: {
        objection: `${offer.price > 1000 ? 'This is expensive' : 'Is this really worth it'}?`,
        response: `The average customer recoups their investment ${Math.floor(offer.metrics.lifetimeValue / offer.price)}x over. This pays for itself.`,
        evidence: `${Math.floor(offer.metrics.customersPerMonth * 12)} customers with ${Math.min(95, 70 + offer.metrics.conversionRate)}% success rate`
      },
      time: {
        objection: 'I don\'t have time to implement this',
        response: `Our system is designed for busy people. Most see results in just ${offer.metrics.deliveryTimeframe}.`,
        evidence: `Average time to first result: ${offer.metrics.deliveryTimeframe}`
      },
      skepticism: {
        objection: 'How do I know this will work for me?',
        response: 'We have a proven track record and offer a full money-back guarantee.',
        evidence: `${Math.floor(offer.metrics.customersPerMonth * 12)} satisfied customers`
      },
      comparison: {
        objection: 'I can find cheaper alternatives',
        response: `Cheaper options cost more in the long run. Our premium approach delivers ${Math.floor(offer.metrics.lifetimeValue / offer.price)}x better results.`,
        evidence: `ROI comparison shows ${Math.floor((offer.metrics.lifetimeValue - offer.price) / offer.price * 100)}% better returns`
      }
    }

    return Object.values(objections)
  }

  // Main generation function
  generateEnhancedCopy(offer: OfferNode): OfferCopy {
    const valueStack = this.generateValueStack(offer)
    
    return {
      headline: this.generateHeadline(offer),
      subheadline: this.generateSubheadline(offer),
      valueProposition: this.generateValueProposition(offer),
      
      testimonialSnippets: this.generateTestimonials(offer, 85),
      socialProofMetrics: this.generateSocialProof(offer),
      
      urgencyIndicator: this.generateUrgency(offer),
      riskReversal: this.generateRiskReversal(offer),
      
      perceivedValue: valueStack.perceivedValue,
      valueBreakdown: valueStack.valueBreakdown,
      
      ctaVariations: this.generateCTAVariations(offer),
      commonObjections: this.generateObjectionHandling(offer)
    }
  }

  // Helper methods for template personalization
  private getResultPhrase(offer: OfferNode): string {
    if (offer.metrics.lifetimeValue > 10000) return 'Massive ROI'
    if (offer.metrics.lifetimeValue > 1000) return 'Significant Results'
    return 'Real Results'
  }

  private getPainPoint(type: string): string {
    const painPoints = {
      attraction: 'wasting time on strategies that don\'t work',
      core: 'struggling with inconsistent results',
      upsell: 'leaving money on the table',
      downsell: 'missing out on essential tools'
    }
    return painPoints[type as keyof typeof painPoints] || 'current challenges'
  }

  private getCommonObjection(type: string): string {
    const objections = {
      attraction: 'You\'ve Tried Everything Before',
      core: 'You\'re Not Sure It Will Work',
      upsell: 'You Think You Don\'t Need More',
      downsell: 'You\'re On a Tight Budget'
    }
    return objections[type as keyof typeof objections] || 'You\'re Skeptical'
  }

  private generateSubheadline(offer: OfferNode): string {
    return `The proven system that delivers ${this.calculateAverageResult(offer)} in ${offer.metrics.deliveryTimeframe}`
  }

  private generateTestimonials(offer: OfferNode, successRate: number): string[] {
    const templates = [
      `This ${offer.name.toLowerCase()} completely transformed my business in just ${offer.metrics.deliveryTimeframe}!`,
      `I was skeptical at first, but the results speak for themselves - ${this.calculateAverageResult(offer)}!`,
      `The step-by-step system made it easy to implement, even with my busy schedule.`,
      `Worth every penny - I've already seen ${Math.floor(offer.metrics.lifetimeValue/offer.price)}x return on my investment.`
    ]
    
    return templates.slice(0, 2)
  }

  private generateCTAVariations(offer: OfferNode) {
    return [
      {
        primary: offer.price === 0 ? 'Get Free Access Now' : 'Get Started Today',
        urgency: offer.price > 1000 ? 'Reserve Your Spot' : 'Claim Your Discount',
        benefit: `Start Your Transformation`
      }
    ]
  }

  // Additional helper methods...
  private getPainPoints(type: string): string[] {
    const painPoints = {
      attraction: ['struggling with inconsistent results', 'wasting time on ineffective strategies'],
      core: ['feeling overwhelmed by complexity', 'lack of clear direction'],
      upsell: ['missing advanced opportunities', 'plateau in growth'],
      downsell: ['budget constraints', 'need for simpler solutions']
    }
    return painPoints[type as keyof typeof painPoints] || ['current challenges', 'missed opportunities']
  }

  private getDreamOutcome(type: string): string {
    const outcomes = {
      attraction: 'consistent, predictable results',
      core: 'complete business transformation',
      upsell: 'accelerated growth and success',
      downsell: 'essential improvements on budget'
    }
    return outcomes[type as keyof typeof outcomes] || 'your desired outcome'
  }

  private getMechanism(name: string): string {
    return name.toLowerCase().includes('course') ? 'course' :
           name.toLowerCase().includes('program') ? 'program' :
           name.toLowerCase().includes('system') ? 'system' :
           name.toLowerCase().includes('challenge') ? 'challenge' :
           'method'
  }

  private getMethodName(name: string): string {
    return name.replace(/\b(course|program|system|challenge)\b/gi, '').trim() || name
  }

  private getGuarantee(offer: OfferNode): string {
    return offer.metrics.conversionRate > 20 ? 'guarantees results or your money back' : 'comes with our satisfaction guarantee'
  }

  private getSuperlative(offer: OfferNode): string {
    return offer.metrics.competitiveAdvantage > 8 ? 'revolutionary' :
           offer.metrics.competitiveAdvantage > 6 ? 'proven' :
           'effective'
  }

  private getOutcome(offer: OfferNode): string {
    return offer.type === 'attraction' ? 'get started' :
           offer.type === 'core' ? 'transform your business' :
           offer.type === 'upsell' ? 'accelerate your growth' :
           'improve your results'
  }

  private getSacrifice(type: string): string {
    return type === 'attraction' ? 'the learning curve' :
           type === 'core' ? 'the time investment' :
           'the premium price'
  }

  private getCurrentResult(type: string): string {
    return type === 'upsell' ? 'current progress' : 'existing results'
  }

  private getMultiplier(offer: OfferNode): string {
    return Math.max(2, Math.floor(offer.metrics.lifetimeValue / offer.price / 1000)).toString()
  }

  private getEnhancedOutcome(offer: OfferNode): string {
    return `${Math.floor(offer.metrics.lifetimeValue / 1000)}k+ in additional value`
  }

  private getCurrentState(type: string): string {
    return type === 'upsell' ? 'good results' : 'current situation'
  }

  private getElevatedState(type: string): string {
    return type === 'upsell' ? 'extraordinary results' : 'next level'
  }

  private getVIPExperience(offer: OfferNode): string {
    return offer.name.toLowerCase().includes('vip') ? 'VIP Experience' :
           offer.name.toLowerCase().includes('premium') ? 'Premium Experience' :
           'Elite Program'
  }

  private getExclusiveBenefit(offer: OfferNode): string {
    return `delivers ${Math.floor(offer.metrics.lifetimeValue / offer.price)}x better results`
  }

  private getSolution(name: string): string {
    return name.replace(/\b(essential|basic|simple)\b/gi, '').trim() || name
  }

  private getDiscountPercentage(offer: OfferNode): string {
    return offer.price < 100 ? '50' : offer.price < 500 ? '30' : '25'
  }

  private getBasicSolution(name: string): string {
    return `Essential ${name.replace(/\b(essential|basic|simple)\b/gi, '').trim()}`
  }

  private getCoreValue(offer: OfferNode): string {
    return `${Math.floor(offer.metrics.lifetimeValue / offer.price)}x value`
  }

  private getTransformation(offer: OfferNode): string {
    return `transforms ${this.getPainPoint(offer.type)} into ${this.getDreamOutcome(offer.type)}`
  }

  private getDesiredOutcome(type: string): string {
    return this.getDreamOutcome(type)
  }

  private getCurrentStruggle(type: string): string {
    return this.getPainPoints(type)[0]
  }

  private getBusinessArea(type: string): string {
    const areas = {
      attraction: 'Marketing',
      core: 'Business',
      upsell: 'Growth Strategy',
      downsell: 'Operations'
    }
    return areas[type as keyof typeof areas] || 'Business'
  }
}