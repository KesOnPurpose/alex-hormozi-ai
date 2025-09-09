'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import GrowthTimelineChart from '@/components/growth/GrowthTimelineChart'

interface BusinessMetrics {
  monthlyRevenue: number
  cac: number
  ltv: number
  conversionRate: number
  customerCount: number
  avgOrderValue: number
  dateRecorded: string
  source: string // 'baseline' | 'agent_session' | 'manual_update'
}

interface AgentInteraction {
  id: string
  agentType: string
  date: string
  duration: number // minutes
  discoveriesGenerated: number
  implementationsTriggered: number
  satisfactionScore: number
  keyInsights: string[]
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  dateEarned: string
  category: 'revenue' | 'constraint' | 'implementation' | 'engagement'
}

export default function ProfilePage() {
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab') || 'overview'
  
  const [userProfile, setUserProfile] = useState<any>(null)
  const [metricsHistory, setMetricsHistory] = useState<BusinessMetrics[]>([])
  const [agentHistory, setAgentHistory] = useState<AgentInteraction[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [insights, setInsights] = useState<any[]>([])
  const [selectedMetric, setSelectedMetric] = useState<keyof Omit<BusinessMetrics, 'dateRecorded' | 'source'>>('monthlyRevenue')

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = () => {
    // Load from localStorage (will be replaced with database calls)
    const businessProfile = localStorage.getItem('businessProfile')
    const onboardingAnswers = localStorage.getItem('onboardingAnswers')
    const analysisResults = localStorage.getItem('analysisResults')

    if (businessProfile) {
      const profile = JSON.parse(businessProfile)
      setUserProfile(profile)

      // Generate mock historical metrics timeline (30 days of data)
      const baseRevenue = parseInt(profile.monthlyRevenue?.replace(/[^0-9]/g, '') || '50000')
      const timelineData: BusinessMetrics[] = []
      
      for (let i = 29; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        const dayProgress = (29 - i) / 29 // 0 to 1 progress over 30 days
        
        // Simulate gradual improvement over time with some variance
        const growthFactor = 1 + (dayProgress * 0.4) // 0% to 40% growth over period
        const variance = 0.95 + Math.random() * 0.1 // ±5% daily variance
        
        timelineData.push({
          monthlyRevenue: Math.round(baseRevenue * growthFactor * variance),
          cac: Math.round((250 - dayProgress * 50) * variance), // CAC improves from $250 to $200
          ltv: Math.round((800 + dayProgress * 400) * variance), // LTV grows from $800 to $1200
          conversionRate: Number(((2.5 + dayProgress * 1.3) * variance).toFixed(1)), // 2.5% to 3.8%
          customerCount: Math.round((50 + dayProgress * 25) * variance), // 50 to 75 customers
          avgOrderValue: Math.round((160 + dayProgress * 40) * variance), // $160 to $200 AOV
          dateRecorded: date.toISOString(),
          source: i === 29 ? 'baseline' : i === 0 ? 'agent_session' : 'daily_tracking'
        })
      }

      setMetricsHistory(timelineData)

      // Generate mock agent interactions
      const mockAgentHistory: AgentInteraction[] = [
        {
          id: '1',
          agentType: 'constraint-analyzer',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          duration: 15,
          discoveriesGenerated: 3,
          implementationsTriggered: 2,
          satisfactionScore: 9,
          keyInsights: ['Primary constraint identified as sales conversion', 'Opportunity for $2,400/month growth']
        },
        {
          id: '2', 
          agentType: 'offer-analyzer',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          duration: 22,
          discoveriesGenerated: 4,
          implementationsTriggered: 3,
          satisfactionScore: 8,
          keyInsights: ['Grand Slam Offer framework applied', '15-20% conversion lift potential']
        }
      ]
      setAgentHistory(mockAgentHistory)

      // Generate achievements
      const mockAchievements: Achievement[] = [
        {
          id: '1',
          title: 'First Steps',
          description: 'Completed your first agent consultation',
          icon: '🎯',
          dateEarned: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          category: 'engagement'
        },
        {
          id: '2',
          title: 'Revenue Growth',
          description: 'Increased monthly revenue by 25%+',
          icon: '💰',
          dateEarned: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          category: 'revenue'
        },
        {
          id: '3',
          title: 'Implementation Hero',
          description: 'Implemented 5+ agent recommendations',
          icon: '⚡',
          dateEarned: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          category: 'implementation'
        }
      ]
      setAchievements(mockAchievements)

      // Generate insights
      const mockInsights = [
        {
          type: 'opportunity',
          title: 'Psychology Optimizer Ready',
          description: 'Based on your offer improvements, you\'re ready for conversion psychology optimization',
          priority: 'high',
          estimatedImpact: '$1,800/month',
          agentRecommendation: 'psychology-optimizer'
        },
        {
          type: 'warning',
          title: 'CAC Increasing',
          description: 'Your customer acquisition cost has increased 15% this month. Consider optimizing ad spend.',
          priority: 'medium',
          estimatedImpact: '$500/month savings',
          agentRecommendation: 'money-model-architect'
        }
      ]
      setInsights(mockInsights)
    }
  }

  const calculateGrowthPercentage = (current: number, baseline: number) => {
    if (baseline === 0) return 0
    return Math.round(((current - baseline) / baseline) * 100)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getAgentIcon = (agentType: string) => {
    const icons: { [key: string]: string } = {
      'constraint-analyzer': '🔍',
      'offer-analyzer': '💎',
      'money-model-architect': '💰',
      'financial-calculator': '📊',
      'psychology-optimizer': '🧠',
      'implementation-planner': '✅',
      'coaching-methodology': '🎓',
      'master-conductor': '🎭'
    }
    return icons[agentType] || '🤖'
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '🏠' },
    { id: 'growth', name: 'Growth Tracking', icon: '📈' },
    { id: 'history', name: 'Agent History', icon: '📜' },
    { id: 'insights', name: 'Insights', icon: '💡' },
    { id: 'achievements', name: 'Achievements', icon: '🏆' }
  ]

  const baseline = metricsHistory.find(m => m.source === 'baseline')
  const current = metricsHistory.find(m => m.source === 'agent_session') || metricsHistory[metricsHistory.length - 1]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-white">Your Business Profile</h1>
            <Link href="/agents" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
              Continue Coaching
            </Link>
          </div>
          <p className="text-gray-300">Track your business transformation journey with Alex Hormozi AI</p>
        </div>

        {/* Quick Stats */}
        {baseline && current && (
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <div className="text-sm text-gray-400 mb-1">Monthly Revenue</div>
              <div className="text-2xl font-bold text-white mb-1">{formatCurrency(current.monthlyRevenue)}</div>
              <div className={`text-sm flex items-center ${current.monthlyRevenue > baseline.monthlyRevenue ? 'text-green-400' : 'text-red-400'}`}>
                {current.monthlyRevenue > baseline.monthlyRevenue ? '↗' : '↘'} 
                {Math.abs(calculateGrowthPercentage(current.monthlyRevenue, baseline.monthlyRevenue))}%
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <div className="text-sm text-gray-400 mb-1">Customer LTV</div>
              <div className="text-2xl font-bold text-white mb-1">{formatCurrency(current.ltv)}</div>
              <div className={`text-sm flex items-center ${current.ltv > baseline.ltv ? 'text-green-400' : 'text-red-400'}`}>
                {current.ltv > baseline.ltv ? '↗' : '↘'} 
                {Math.abs(calculateGrowthPercentage(current.ltv, baseline.ltv))}%
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <div className="text-sm text-gray-400 mb-1">Conversion Rate</div>
              <div className="text-2xl font-bold text-white mb-1">{current.conversionRate}%</div>
              <div className={`text-sm flex items-center ${current.conversionRate > baseline.conversionRate ? 'text-green-400' : 'text-red-400'}`}>
                {current.conversionRate > baseline.conversionRate ? '↗' : '↘'} 
                {Math.abs(calculateGrowthPercentage(current.conversionRate, baseline.conversionRate))}%
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <div className="text-sm text-gray-400 mb-1">Total Customers</div>
              <div className="text-2xl font-bold text-white mb-1">{current.customerCount}</div>
              <div className={`text-sm flex items-center ${current.customerCount > baseline.customerCount ? 'text-green-400' : 'text-red-400'}`}>
                {current.customerCount > baseline.customerCount ? '↗' : '↘'} 
                {Math.abs(calculateGrowthPercentage(current.customerCount, baseline.customerCount))}%
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={`/profile?tab=${tab.id}`}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="text-sm">{tab.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Business Overview</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Your Journey</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-300">Business Stage</span>
                        <span className="text-purple-400 font-semibold capitalize">
                          {userProfile?.businessStage?.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-300">Primary Challenge</span>
                        <span className="text-blue-400 font-semibold capitalize">
                          {userProfile?.primaryChallenge || 'Not identified'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-300">Agents Consulted</span>
                        <span className="text-green-400 font-semibold">
                          {agentHistory.length} of 8
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Recent Achievements</h3>
                    <div className="space-y-3">
                      {achievements.slice(0, 3).map((achievement) => (
                        <div key={achievement.id} className="flex items-center p-3 bg-white/5 rounded-lg">
                          <div className="text-2xl mr-3">{achievement.icon}</div>
                          <div>
                            <div className="text-white font-semibold">{achievement.title}</div>
                            <div className="text-xs text-gray-400">
                              {new Date(achievement.dateEarned).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'growth' && baseline && current && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-white mb-4">Growth Tracking</h2>
              
              {/* Growth Timeline Chart */}
              <GrowthTimelineChart 
                data={metricsHistory.map(metric => ({
                  date: metric.dateRecorded,
                  monthlyRevenue: metric.monthlyRevenue,
                  customerCount: metric.customerCount,
                  conversionRate: metric.conversionRate,
                  avgOrderValue: metric.avgOrderValue,
                  ltv: metric.ltv,
                  cac: metric.cac
                }))}
                selectedMetric={selectedMetric}
                onMetricChange={setSelectedMetric}
              />
              
              {/* Before/After Comparison */}
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">📅 Baseline (30 days ago)</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-400">Monthly Revenue</span>
                      <span className="text-white font-semibold">{formatCurrency(baseline.monthlyRevenue)}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-400">Customer LTV</span>
                      <span className="text-white font-semibold">{formatCurrency(baseline.ltv)}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-400">Conversion Rate</span>
                      <span className="text-white font-semibold">{baseline.conversionRate}%</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">🚀 Current Performance</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-400">Monthly Revenue</span>
                      <div className="text-right">
                        <span className="text-white font-semibold">{formatCurrency(current.monthlyRevenue)}</span>
                        <div className="text-green-400 text-sm">
                          +{calculateGrowthPercentage(current.monthlyRevenue, baseline.monthlyRevenue)}%
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-400">Customer LTV</span>
                      <div className="text-right">
                        <span className="text-white font-semibold">{formatCurrency(current.ltv)}</span>
                        <div className="text-green-400 text-sm">
                          +{calculateGrowthPercentage(current.ltv, baseline.ltv)}%
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-400">Conversion Rate</span>
                      <div className="text-right">
                        <span className="text-white font-semibold">{current.conversionRate}%</span>
                        <div className="text-green-400 text-sm">
                          +{calculateGrowthPercentage(current.conversionRate, baseline.conversionRate)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Growth Impact */}
              <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-xl p-6 border border-green-400/30">
                <h3 className="text-lg font-semibold text-white mb-2">🎯 Total Growth Impact</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {formatCurrency((current.monthlyRevenue - baseline.monthlyRevenue) * 12)}
                    </div>
                    <div className="text-sm text-gray-300">Annual Revenue Increase</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {current.customerCount - baseline.customerCount}
                    </div>
                    <div className="text-sm text-gray-300">New Customers Added</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {agentHistory.reduce((sum, interaction) => sum + interaction.implementationsTriggered, 0)}
                    </div>
                    <div className="text-sm text-gray-300">Implementations Completed</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Agent Consultation History</h2>
              {agentHistory.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">🤖</div>
                  <div className="text-gray-400">No agent consultations yet</div>
                  <Link href="/agents" className="text-purple-400 hover:text-purple-300 underline">
                    Start your first consultation
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {agentHistory.map((interaction) => (
                    <div key={interaction.id} className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-3xl">{getAgentIcon(interaction.agentType)}</div>
                          <div>
                            <h3 className="text-lg font-semibold text-white capitalize">
                              {interaction.agentType.replace('-', ' ')}
                            </h3>
                            <div className="text-sm text-gray-400">
                              {new Date(interaction.date).toLocaleDateString()} • {interaction.duration} minutes
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-yellow-400 mb-1">
                            {'⭐'.repeat(Math.floor(interaction.satisfactionScore / 2))}
                          </div>
                          <div className="text-xs text-gray-400">
                            {interaction.satisfactionScore}/10 satisfaction
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                          <div className="text-lg font-semibold text-blue-400">{interaction.discoveriesGenerated}</div>
                          <div className="text-xs text-gray-400">Discoveries</div>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                          <div className="text-lg font-semibold text-green-400">{interaction.implementationsTriggered}</div>
                          <div className="text-xs text-gray-400">Implementations</div>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                          <div className="text-lg font-semibold text-purple-400">{interaction.keyInsights.length}</div>
                          <div className="text-xs text-gray-400">Key Insights</div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-2">Key Insights Generated:</h4>
                        <div className="space-y-1">
                          {interaction.keyInsights.map((insight, index) => (
                            <div key={index} className="text-sm text-gray-300 flex items-start">
                              <span className="text-purple-400 mr-2">•</span>
                              <span>{insight}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">AI Insights & Recommendations</h2>
              {insights.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">💡</div>
                  <div className="text-gray-400">No insights generated yet</div>
                  <div className="text-sm text-gray-500">Insights appear after agent consultations</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {insights.map((insight, index) => (
                    <div key={index} className={`rounded-xl p-6 border ${
                      insight.priority === 'high' 
                        ? 'bg-red-600/10 border-red-400/30' 
                        : insight.priority === 'medium'
                        ? 'bg-yellow-600/10 border-yellow-400/30'
                        : 'bg-blue-600/10 border-blue-400/30'
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`text-xs px-2 py-1 rounded-full uppercase font-semibold ${
                              insight.priority === 'high' 
                                ? 'bg-red-500 text-white' 
                                : insight.priority === 'medium'
                                ? 'bg-yellow-500 text-black'
                                : 'bg-blue-500 text-white'
                            }`}>
                              {insight.priority} Priority
                            </span>
                            <span className="text-xs text-gray-400 capitalize">{insight.type}</span>
                          </div>
                          <h3 className="text-lg font-semibold text-white">{insight.title}</h3>
                        </div>
                        <div className="text-right">
                          <div className="text-green-400 font-semibold">{insight.estimatedImpact}</div>
                          <div className="text-xs text-gray-400">Potential Impact</div>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 mb-4">{insight.description}</p>
                      
                      {insight.agentRecommendation && (
                        <Link 
                          href={`/agents/${insight.agentRecommendation}`}
                          className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          <span>{getAgentIcon(insight.agentRecommendation)}</span>
                          <span>Work with {insight.agentRecommendation.replace('-', ' ')}</span>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Achievements & Milestones</h2>
              {achievements.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">🏆</div>
                  <div className="text-gray-400">No achievements earned yet</div>
                  <div className="text-sm text-gray-500">Complete agent consultations to earn badges</div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
                      <div className="text-4xl mb-3">{achievement.icon}</div>
                      <h3 className="text-lg font-semibold text-white mb-2">{achievement.title}</h3>
                      <p className="text-sm text-gray-400 mb-3">{achievement.description}</p>
                      <div className="text-xs text-gray-500">
                        Earned {new Date(achievement.dateEarned).toLocaleDateString()}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${
                        achievement.category === 'revenue' ? 'bg-green-600/20 text-green-400' :
                        achievement.category === 'constraint' ? 'bg-red-600/20 text-red-400' :
                        achievement.category === 'implementation' ? 'bg-blue-600/20 text-blue-400' :
                        'bg-purple-600/20 text-purple-400'
                      }`}>
                        {achievement.category}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}