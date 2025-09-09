'use client'

import { useState } from 'react'
import { OfferNode } from '@/types/money-model'
import { TrendingUp, DollarSign, Calculator, Target, Zap, Award, Clock, Users } from 'lucide-react'

interface RevenuePsychologyDisplayProps {
  offer: OfferNode
  formatCurrency: (amount: number) => string
}

export default function RevenuePsychologyDisplay({ offer, formatCurrency }: RevenuePsychologyDisplayProps) {
  const [activeTab, setActiveTab] = useState<'value' | 'roi' | 'comparison' | 'psychology'>('value')

  // Calculate psychological pricing metrics
  const perceivedValue = offer.copy?.perceivedValue || (offer.price * 5)
  const valueRatio = Math.floor(perceivedValue / offer.price)
  const dailyCost = offer.price / 365
  const costPerResult = offer.price / Math.max(1, offer.metrics.conversionRate)
  const roiMultiple = Math.floor(offer.metrics.lifetimeValue / offer.price)
  const breakEvenDays = Math.ceil(offer.price / (offer.metrics.currentMonthlyRevenue / 30))

  const tabs = [
    { id: 'value', label: 'Value Stack', icon: Award },
    { id: 'roi', label: 'ROI Timeline', icon: TrendingUp },
    { id: 'comparison', label: 'Cost Analysis', icon: Calculator },
    { id: 'psychology', label: 'Pricing Psychology', icon: Target }
  ]

  return (
    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold text-lg">Revenue Psychology Analysis</h3>
            <p className="text-gray-300 text-sm">Understanding the true value behind the price</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-400">{valueRatio}x</div>
            <div className="text-xs text-gray-400">Value Multiple</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-white/10">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-600/20 text-purple-300 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'value' && (
          <ValueStackView 
            offer={offer} 
            formatCurrency={formatCurrency}
            perceivedValue={perceivedValue}
            valueRatio={valueRatio}
          />
        )}

        {activeTab === 'roi' && (
          <ROITimelineView 
            offer={offer} 
            formatCurrency={formatCurrency}
            roiMultiple={roiMultiple}
            breakEvenDays={breakEvenDays}
          />
        )}

        {activeTab === 'comparison' && (
          <CostAnalysisView 
            offer={offer} 
            formatCurrency={formatCurrency}
            dailyCost={dailyCost}
            costPerResult={costPerResult}
          />
        )}

        {activeTab === 'psychology' && (
          <PricingPsychologyView 
            offer={offer} 
            formatCurrency={formatCurrency}
            valueRatio={valueRatio}
            perceivedValue={perceivedValue}
          />
        )}
      </div>
    </div>
  )
}

function ValueStackView({ offer, formatCurrency, perceivedValue, valueRatio }: any) {
  const valueBreakdown = offer.copy?.valueBreakdown || [
    { component: 'Core Program', value: offer.price * 2, description: 'Main training and system' },
    { component: 'Bonus Materials', value: offer.price * 1.5, description: 'Additional resources' },
    { component: 'Support & Updates', value: offer.price * 1.5, description: 'Ongoing assistance' }
  ]

  return (
    <div className="space-y-6">
      {/* Value Equation */}
      <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg p-4 border border-green-500/20">
        <div className="text-center mb-4">
          <div className="text-green-400 text-sm font-medium">TOTAL VALUE</div>
          <div className="text-white text-3xl font-bold">{formatCurrency(perceivedValue)}</div>
          <div className="text-gray-300 text-sm">vs Investment of {formatCurrency(offer.price)}</div>
        </div>
        
        <div className="flex items-center justify-center space-x-4 text-sm">
          <div className="text-center">
            <div className="text-white font-bold">{valueRatio}x</div>
            <div className="text-gray-400">Value Multiple</div>
          </div>
          <div className="text-purple-400">•</div>
          <div className="text-center">
            <div className="text-white font-bold">{formatCurrency(perceivedValue - offer.price)}</div>
            <div className="text-gray-400">Total Savings</div>
          </div>
        </div>
      </div>

      {/* Detailed Value Breakdown */}
      <div className="space-y-3">
        <h4 className="text-white font-semibold flex items-center">
          <Award className="w-4 h-4 mr-2" />
          What You Get
        </h4>
        
        {valueBreakdown.map((item: any, index: number) => (
          <div key={index} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">{item.component}</div>
              <div className="text-gray-400 text-sm">{item.description}</div>
            </div>
            <div className="text-green-400 font-bold">{formatCurrency(item.value)}</div>
          </div>
        ))}

        <div className="border-t border-white/10 pt-3">
          <div className="flex justify-between items-center font-bold">
            <div className="text-white">Total Package Value</div>
            <div className="text-green-400 text-lg">{formatCurrency(perceivedValue)}</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-gray-400">Your Investment Today</div>
            <div className="text-white">{formatCurrency(offer.price)}</div>
          </div>
          <div className="flex justify-between items-center text-lg font-bold">
            <div className="text-purple-300">You Save</div>
            <div className="text-purple-300">{formatCurrency(perceivedValue - offer.price)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ROITimelineView({ offer, formatCurrency, roiMultiple, breakEvenDays }: any) {
  const milestones = [
    { days: breakEvenDays, label: 'Break Even', value: offer.price, color: 'yellow' },
    { days: breakEvenDays * 2, label: '2x Return', value: offer.price * 2, color: 'green' },
    { days: breakEvenDays * 3, label: '3x Return', value: offer.price * 3, color: 'blue' },
    { days: Math.min(365, breakEvenDays * roiMultiple), label: `${roiMultiple}x Return`, value: offer.price * roiMultiple, color: 'purple' }
  ]

  return (
    <div className="space-y-6">
      {/* ROI Summary */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">{roiMultiple}x</div>
          <div className="text-gray-400 text-sm">Expected ROI</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-400">{breakEvenDays}</div>
          <div className="text-gray-400 text-sm">Days to Break Even</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-400">{Math.floor(365 / breakEvenDays)}</div>
          <div className="text-gray-400 text-sm">ROI Cycles/Year</div>
        </div>
      </div>

      {/* Timeline Visualization */}
      <div className="space-y-4">
        <h4 className="text-white font-semibold flex items-center">
          <TrendingUp className="w-4 h-4 mr-2" />
          ROI Timeline
        </h4>
        
        <div className="space-y-3">
          {milestones.map((milestone, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold ${
                milestone.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-300' :
                milestone.color === 'green' ? 'bg-green-500/20 text-green-300' :
                milestone.color === 'blue' ? 'bg-blue-500/20 text-blue-300' :
                'bg-purple-500/20 text-purple-300'
              }`}>
                {milestone.days}d
              </div>
              
              <div className="flex-1 flex justify-between items-center">
                <div>
                  <div className="text-white font-medium">{milestone.label}</div>
                  <div className="text-gray-400 text-sm">Day {milestone.days}</div>
                </div>
                <div className="text-white font-bold">{formatCurrency(milestone.value)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg p-4 border border-purple-500/20">
        <div className="text-purple-300 font-semibold mb-2">Investment Perspective</div>
        <div className="text-gray-300 text-sm">
          Most investments take years to see {roiMultiple}x returns. With this system, you could potentially achieve 
          the same results in just {Math.floor(breakEvenDays * roiMultiple / 30)} months based on our customer data.
        </div>
      </div>
    </div>
  )
}

function CostAnalysisView({ offer, formatCurrency, dailyCost, costPerResult }: any) {
  const comparisons = [
    { item: 'Daily Coffee', cost: 5, frequency: 'daily' },
    { item: 'Netflix Subscription', cost: 15, frequency: 'monthly' },
    { item: 'Gym Membership', cost: 50, frequency: 'monthly' },
    { item: 'Business Consultant', cost: 150, frequency: 'hourly' }
  ]

  return (
    <div className="space-y-6">
      {/* Cost Breakdown */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{formatCurrency(dailyCost)}</div>
          <div className="text-gray-400 text-sm">Per Day</div>
          <div className="text-xs text-gray-500 mt-1">Less than a coffee</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{formatCurrency(costPerResult)}</div>
          <div className="text-gray-400 text-sm">Per Result</div>
          <div className="text-xs text-gray-500 mt-1">Based on success rate</div>
        </div>
      </div>

      {/* Comparison with Common Expenses */}
      <div className="space-y-4">
        <h4 className="text-white font-semibold flex items-center">
          <Calculator className="w-4 h-4 mr-2" />
          Cost Comparison
        </h4>
        
        <div className="space-y-3">
          {comparisons.map((comp, index) => {
            const annualCost = comp.frequency === 'daily' ? comp.cost * 365 :
                              comp.frequency === 'monthly' ? comp.cost * 12 :
                              comp.cost * 40 // Assuming 40 hours per year for hourly
            const comparison = offer.price / annualCost
            
            return (
              <div key={index} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <div>
                  <div className="text-white font-medium">{comp.item}</div>
                  <div className="text-gray-400 text-sm">{formatCurrency(comp.cost)} {comp.frequency}</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">{formatCurrency(annualCost)}/year</div>
                  <div className="text-gray-400 text-sm">
                    {comparison < 1 ? `${Math.floor(comparison * 100)}% of` : `${Math.floor(comparison)}x more than`}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Value Perspective */}
      <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg p-4 border border-green-500/20">
        <div className="text-green-300 font-semibold mb-2">Cost vs. Opportunity Cost</div>
        <div className="text-gray-300 text-sm">
          The real cost isn't the {formatCurrency(offer.price)} investment—it's the {formatCurrency(offer.metrics.lifetimeValue)} 
          in potential returns you'll miss by not taking action today.
        </div>
      </div>
    </div>
  )
}

function PricingPsychologyView({ offer, formatCurrency, valueRatio, perceivedValue }: any) {
  const psychologyFactors = [
    {
      principle: 'Anchoring Effect',
      explanation: `By showing the ${formatCurrency(perceivedValue)} total value first, the ${formatCurrency(offer.price)} investment feels like a significant discount.`,
      impact: 'High',
      color: 'purple'
    },
    {
      principle: 'Loss Aversion',
      explanation: `Emphasizing what you'll miss out on (${formatCurrency(offer.metrics.lifetimeValue)} potential return) is more powerful than focusing on gains.`,
      impact: 'High',
      color: 'red'
    },
    {
      principle: 'Social Proof',
      explanation: `${Math.floor(offer.metrics.customersPerMonth * 12)} customers and ${Math.min(95, 70 + offer.metrics.conversionRate)}% success rate reduce perceived risk.`,
      impact: 'Medium',
      color: 'blue'
    },
    {
      principle: 'Scarcity',
      explanation: `Limited availability or time-sensitive pricing creates urgency and increases perceived value.`,
      impact: 'Medium',
      color: 'yellow'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Psychology Overview */}
      <div className="bg-white/5 rounded-lg p-4">
        <h4 className="text-white font-semibold mb-3 flex items-center">
          <Target className="w-4 h-4 mr-2" />
          Psychological Price Positioning
        </h4>
        <div className="text-gray-300 text-sm leading-relaxed">
          This pricing uses proven psychological principles to maximize perceived value while minimizing price resistance. 
          The {valueRatio}x value multiple creates a strong anchor that makes the actual price feel like a bargain.
        </div>
      </div>

      {/* Psychology Factors */}
      <div className="space-y-3">
        {psychologyFactors.map((factor, index) => (
          <div key={index} className="border-l-4 border-gray-600 pl-4 py-2">
            <div className="flex items-center justify-between mb-2">
              <div className="text-white font-medium">{factor.principle}</div>
              <div className={`px-2 py-1 rounded text-xs font-medium ${
                factor.impact === 'High' ? 'bg-red-500/20 text-red-300' :
                factor.impact === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-green-500/20 text-green-300'
              }`}>
                {factor.impact} Impact
              </div>
            </div>
            <div className="text-gray-400 text-sm">{factor.explanation}</div>
          </div>
        ))}
      </div>

      {/* Pricing Strategy */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-blue-500/20">
        <div className="text-blue-300 font-semibold mb-2">Strategic Pricing Analysis</div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Price Point:</span>
            <span className="text-white">{offer.price > 1000 ? 'Premium' : offer.price > 100 ? 'Mid-tier' : 'Entry-level'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Value Multiple:</span>
            <span className="text-white">{valueRatio}x (Ideal: 5-10x)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Psychological Barrier:</span>
            <span className="text-white">{offer.price > 1000 ? 'High consideration' : offer.price > 100 ? 'Medium consideration' : 'Impulse buy'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Risk Perception:</span>
            <span className="text-white">{offer.copy?.riskReversal?.guarantee ? 'Low (guaranteed)' : 'Medium'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}