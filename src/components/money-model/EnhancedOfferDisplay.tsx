'use client'

import { useState } from 'react'
import { OfferNode } from '@/types/money-model'
import { CopyGenerationAI } from '@/services/CopyGenerationAI'
import RevenuePsychologyDisplay from './RevenuePsychologyDisplay'
import { ChevronDown, ChevronUp, Star, Clock, Shield, TrendingUp, Users, Target } from 'lucide-react'

interface EnhancedOfferDisplayProps {
  offer: OfferNode
  onOfferSelect: (offerId: string) => void
  isSelected: boolean
  showFullDetails?: boolean
  formatCurrency: (amount: number) => string
}

export default function EnhancedOfferDisplay({ 
  offer, 
  onOfferSelect, 
  isSelected, 
  showFullDetails = false,
  formatCurrency 
}: EnhancedOfferDisplayProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  
  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  // Generate enhanced copy using AI if not provided
  const copyAI = new CopyGenerationAI()
  const enhancedCopy = offer.copy || copyAI.generateEnhancedCopy(offer)
  
  const getOfferIcon = (type: string) => {
    switch (type) {
      case 'attraction': return '🎯'
      case 'core': return '💎'
      case 'upsell': return '📈'
      case 'downsell': return '🔄'
      case 'continuity': return '🔁'
      default: return '💡'
    }
  }

  const getPriorityLevel = (revenue: number) => {
    if (revenue > 5000) return { level: 'High', color: 'text-red-400', bg: 'bg-red-400/10' }
    if (revenue > 1000) return { level: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-400/10' }
    return { level: 'Low', color: 'text-green-400', bg: 'bg-green-400/10' }
  }

  const priority = getPriorityLevel(offer.metrics.currentMonthlyRevenue)

  return (
    <div className={`bg-white/5 hover:bg-white/10 rounded-xl border transition-all duration-300 ${
      isSelected ? 'border-purple-400 bg-purple-500/10' : 'border-white/10'
    }`}>
      {/* Enhanced Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4 flex-1">
            <div className="text-3xl">{getOfferIcon(offer.type)}</div>
            <div className="flex-1">
              {/* Value Proposition Headline */}
              <div className="text-lg font-bold text-white mb-1">
                {enhancedCopy.headline}
              </div>
              <div className="text-purple-300 text-sm mb-2">
                {enhancedCopy.subheadline}
              </div>
              <div className="text-gray-300 text-sm leading-relaxed">
                {enhancedCopy.valueProposition}
              </div>
            </div>
          </div>
          
          {/* Priority & Revenue Indicator */}
          <div className="text-right space-y-2">
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priority.bg} ${priority.color}`}>
              <Target className="w-3 h-3 mr-1" />
              {priority.level} Impact
            </div>
            <div className="text-white font-bold text-lg">{formatCurrency(offer.price)}</div>
            <div className="text-green-400 text-sm">{formatCurrency(offer.metrics.currentMonthlyRevenue)}/mo</div>
          </div>
        </div>

        {/* Enhanced Metrics Bar */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="text-center">
            <div className="text-white font-semibold">{offer.metrics.conversionRate}%</div>
            <div className="text-gray-400 text-xs">Conversion</div>
          </div>
          <div className="text-center">
            <div className="text-white font-semibold">{offer.metrics.customersPerMonth}</div>
            <div className="text-gray-400 text-xs">Customers/mo</div>
          </div>
          <div className="text-center">
            <div className="text-white font-semibold">{formatCurrency(offer.metrics.lifetimeValue)}</div>
            <div className="text-gray-400 text-xs">LTV</div>
          </div>
          <div className="text-center">
            <div className="text-white font-semibold">{offer.metrics.profitMargin}%</div>
            <div className="text-gray-400 text-xs">Profit</div>
          </div>
        </div>

        {/* Psychological Triggers Strip */}
        <div className="flex flex-wrap gap-2 mb-4">
          {enhancedCopy.urgencyIndicator && (
            <div className="inline-flex items-center px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {enhancedCopy.urgencyIndicator.message}
            </div>
          )}
          
          {enhancedCopy.socialProofMetrics.successRate > 0 && (
            <div className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
              <Users className="w-3 h-3 mr-1" />
              {enhancedCopy.socialProofMetrics.successRate}% Success Rate
            </div>
          )}
          
          {enhancedCopy.riskReversal.guarantee && (
            <div className="inline-flex items-center px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">
              <Shield className="w-3 h-3 mr-1" />
              Guaranteed
            </div>
          )}
          
          <div className="inline-flex items-center px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
            <TrendingUp className="w-3 h-3 mr-1" />
            {Math.round(enhancedCopy.perceivedValue / offer.price)}x Value
          </div>
        </div>

        {/* Quick CTA */}
        <button
          onClick={() => onOfferSelect(offer.id)}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-all text-sm ${
            isSelected 
              ? 'bg-purple-600 text-white' 
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          {isSelected ? 'Viewing Details' : enhancedCopy.ctaVariations[0]?.primary || 'View Details'}
        </button>
      </div>

      {/* Expandable Detailed Sections */}
      {showFullDetails && (
        <div className="border-t border-white/10">
          {/* Value Stack */}
          <ExpandableSection
            title="Value Breakdown"
            icon="💰"
            isExpanded={expandedSections.has('value')}
            onToggle={() => toggleSection('value')}
          >
            <div className="space-y-2">
              {enhancedCopy.valueBreakdown.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <div className="text-white text-sm">{item.component}</div>
                    <div className="text-gray-400 text-xs">{item.description}</div>
                  </div>
                  <div className="text-green-400 font-semibold">{formatCurrency(item.value)}</div>
                </div>
              ))}
              <div className="border-t border-white/10 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <div className="text-white font-semibold">Total Value</div>
                  <div className="text-green-400 font-bold">{formatCurrency(enhancedCopy.perceivedValue)}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-gray-400">Your Investment</div>
                  <div className="text-white">{formatCurrency(offer.price)}</div>
                </div>
                <div className="flex justify-between items-center font-bold">
                  <div className="text-purple-300">You Save</div>
                  <div className="text-purple-300">{formatCurrency(enhancedCopy.perceivedValue - offer.price)}</div>
                </div>
              </div>
            </div>
          </ExpandableSection>

          {/* Social Proof */}
          <ExpandableSection
            title="Social Proof"
            icon="⭐"
            isExpanded={expandedSections.has('social')}
            onToggle={() => toggleSection('social')}
          >
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-white font-bold text-lg">{enhancedCopy.socialProofMetrics.customersServed.toLocaleString()}</div>
                  <div className="text-gray-400 text-xs">Customers Served</div>
                </div>
                <div>
                  <div className="text-white font-bold text-lg">{enhancedCopy.socialProofMetrics.successRate}%</div>
                  <div className="text-gray-400 text-xs">Success Rate</div>
                </div>
                <div>
                  <div className="text-white font-bold text-lg">{enhancedCopy.socialProofMetrics.averageResult}</div>
                  <div className="text-gray-400 text-xs">Avg. Result</div>
                </div>
              </div>
              
              {enhancedCopy.testimonialSnippets.length > 0 && (
                <div className="space-y-2">
                  <div className="text-gray-400 text-xs font-medium">RECENT TESTIMONIALS</div>
                  {enhancedCopy.testimonialSnippets.slice(0, 2).map((testimonial, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-3 border-l-2 border-blue-400">
                      <div className="text-gray-300 text-sm italic">"{testimonial}"</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ExpandableSection>

          {/* Objection Handling */}
          <ExpandableSection
            title="Common Questions"
            icon="❓"
            isExpanded={expandedSections.has('objections')}
            onToggle={() => toggleSection('objections')}
          >
            <div className="space-y-3">
              {enhancedCopy.commonObjections.slice(0, 3).map((objection, index) => (
                <div key={index} className="space-y-2">
                  <div className="text-yellow-300 text-sm font-medium">Q: {objection.objection}</div>
                  <div className="text-gray-300 text-sm">A: {objection.response}</div>
                  {objection.evidence && (
                    <div className="text-blue-300 text-xs bg-blue-500/10 rounded px-2 py-1">
                      Evidence: {objection.evidence}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ExpandableSection>

          {/* Risk Reversal */}
          <ExpandableSection
            title="Risk Reversal"
            icon="🛡️"
            isExpanded={expandedSections.has('risk')}
            onToggle={() => toggleSection('risk')}
          >
            <div className="space-y-3">
              {enhancedCopy.riskReversal.guarantee && (
                <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                  <div className="text-green-300 text-sm font-semibold">Our Guarantee</div>
                  <div className="text-gray-300 text-sm mt-1">{enhancedCopy.riskReversal.guarantee}</div>
                </div>
              )}
              
              {enhancedCopy.riskReversal.trial && (
                <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
                  <div className="text-blue-300 text-sm font-semibold">Free Trial</div>
                  <div className="text-gray-300 text-sm mt-1">{enhancedCopy.riskReversal.trial}</div>
                </div>
              )}
              
              {enhancedCopy.riskReversal.refundPolicy && (
                <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                  <div className="text-purple-300 text-sm font-semibold">Refund Policy</div>
                  <div className="text-gray-300 text-sm mt-1">{enhancedCopy.riskReversal.refundPolicy}</div>
                </div>
              )}
            </div>
          </ExpandableSection>

          {/* Revenue Psychology Analysis */}
          <ExpandableSection
            title="Revenue Psychology"
            icon="💰"
            isExpanded={expandedSections.has('psychology')}
            onToggle={() => toggleSection('psychology')}
          >
            <RevenuePsychologyDisplay 
              offer={offer}
              formatCurrency={formatCurrency}
            />
          </ExpandableSection>
        </div>
      )}
    </div>
  )
}

interface ExpandableSectionProps {
  title: string
  icon: string
  isExpanded: boolean
  onToggle: () => void
  children: React.ReactNode
}

function ExpandableSection({ title, icon, isExpanded, onToggle, children }: ExpandableSectionProps) {
  return (
    <div className="border-t border-white/10">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <span className="text-lg">{icon}</span>
          <span className="text-white font-medium">{title}</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>
      
      {isExpanded && (
        <div className="px-6 pb-4">
          {children}
        </div>
      )}
    </div>
  )
}

// Generate default copy based on offer data
function generateDefaultCopy(offer: OfferNode) {
  const headlines = {
    attraction: `Get ${offer.name} - Free Value to Start Your Journey`,
    core: `Transform Your Business with ${offer.name}`,
    upsell: `Accelerate Your Success with ${offer.name}`,
    downsell: `Essential ${offer.name} at Special Pricing`,
    continuity: `Continue Growing with ${offer.name}`
  }

  const valueMultiplier = Math.max(5, Math.floor(offer.metrics.lifetimeValue / offer.price))

  return {
    headline: headlines[offer.type] || `Discover ${offer.name}`,
    subheadline: offer.description,
    valueProposition: `Get results faster with our proven system that has helped thousands achieve success.`,
    
    testimonialSnippets: [
      `This ${offer.name} completely changed my business approach!`,
      `I saw results within the first week of implementing this system.`
    ],
    
    socialProofMetrics: {
      customersServed: Math.floor(offer.metrics.customersPerMonth * 12),
      successRate: Math.min(95, 70 + offer.metrics.conversionRate),
      averageResult: offer.metrics.lifetimeValue > 1000 ? `$${Math.floor(offer.metrics.lifetimeValue/100)*100}+` : `${offer.metrics.conversionRate*2}% growth`
    },
    
    urgencyIndicator: {
      type: 'scarcity' as const,
      message: offer.price > 100 ? 'Limited spots available' : 'Special introductory pricing'
    },
    
    riskReversal: {
      guarantee: '30-day money-back guarantee',
      trial: offer.price === 0 ? 'Free forever' : '7-day free trial',
      refundPolicy: 'Full refund if not satisfied'
    },
    
    perceivedValue: offer.price * valueMultiplier,
    valueBreakdown: [
      { component: `Core ${offer.name} Program`, value: offer.price * 2, description: 'Complete system and training' },
      { component: 'Bonus Materials', value: offer.price * 1.5, description: 'Additional resources and tools' },
      { component: 'Support & Updates', value: offer.price * 1.5, description: 'Ongoing assistance and improvements' }
    ],
    
    ctaVariations: [
      { primary: 'Get Started Now', urgency: 'Claim Your Spot', benefit: 'Start Transforming Today' }
    ],
    
    commonObjections: [
      {
        objection: 'Is this really worth the investment?',
        response: `Yes! Our average customer sees ${valueMultiplier}x return on their investment within 90 days.`,
        evidence: `${offer.metrics.conversionRate}% of customers report positive ROI`
      },
      {
        objection: 'How do I know this will work for me?',
        response: 'We have a proven track record and offer a full money-back guarantee.',
        evidence: `${Math.floor(offer.metrics.customersPerMonth * 12)} satisfied customers`
      },
      {
        objection: 'I don\'t have time to implement this',
        response: `Our system is designed for busy people. Most see results in just ${offer.metrics.deliveryTimeframe}.`,
        evidence: `Average time to first result: ${offer.metrics.deliveryTimeframe}`
      }
    ]
  }
}