import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { SharedIntelligenceService } from '@/services/sharedIntelligence'
import type { SharedBusinessIntelligence, AgentDiscovery } from '@/lib/supabase/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Zap, 
  Target, 
  TrendingUp, 
  Users, 
  DollarSign,
  RefreshCw,
  Layers,
  Gift,
  Repeat,
  Calculator,
  Lightbulb,
  ArrowRight,
  PieChart
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'

interface MoneyModelLabProps {
  intelligenceId: string
}

interface MoneyModelComponent {
  name: string
  description: string
  currentRevenue: number
  projectedRevenue: number
  conversionRate: number
  averageValue: number
  implemented: boolean
}

interface UpsellMoment {
  moment: string
  description: string
  offerType: string
  conversionRate: number
  averageValue: number
  active: boolean
}

export function MoneyModelLab({ intelligenceId }: MoneyModelLabProps) {
  const { user } = useAuth()
  const [intelligence, setIntelligence] = useState<SharedBusinessIntelligence | null>(null)
  const [discoveries, setDiscoveries] = useState<{ [agentType: string]: AgentDiscovery[] }>({})
  const [loading, setLoading] = useState(true)
  const [moneyModel, setMoneyModel] = useState<MoneyModelComponent[]>([
    {
      name: 'Attraction Offer',
      description: 'Low-priced front-end offer to acquire customers',
      currentRevenue: 0,
      projectedRevenue: 0,
      conversionRate: 0,
      averageValue: 0,
      implemented: false
    },
    {
      name: 'Upsell Offers', 
      description: 'Higher-value offers presented after initial purchase',
      currentRevenue: 0,
      projectedRevenue: 0,
      conversionRate: 0,
      averageValue: 0,
      implemented: false
    },
    {
      name: 'Downsell Offers',
      description: 'Alternative offers when customer declines upsell',
      currentRevenue: 0,
      projectedRevenue: 0,
      conversionRate: 0,
      averageValue: 0,
      implemented: false
    },
    {
      name: 'Continuity Offers',
      description: 'Recurring revenue products or subscriptions',
      currentRevenue: 0,
      projectedRevenue: 0,
      conversionRate: 0,
      averageValue: 0,
      implemented: false
    }
  ])

  const [upsellMoments, setUpsellMoments] = useState<UpsellMoment[]>([
    {
      moment: 'Moment of Purchase',
      description: 'Right after they buy your main product',
      offerType: 'Implementation accelerator',
      conversionRate: 0,
      averageValue: 0,
      active: false
    },
    {
      moment: 'Point of Greatest Value', 
      description: 'When they get their biggest result',
      offerType: 'Advanced training or mastermind',
      conversionRate: 0,
      averageValue: 0,
      active: false
    },
    {
      moment: 'Before Transition',
      description: 'Before they move to next level/phase',
      offerType: 'Next level program',
      conversionRate: 0,
      averageValue: 0,
      active: false
    },
    {
      moment: 'During Success',
      description: 'When they achieve initial goal',
      offerType: 'Success maintenance program',
      conversionRate: 0,
      averageValue: 0,
      active: false
    },
    {
      moment: 'At Renewal',
      description: 'When contract/subscription comes up for renewal',
      offerType: 'Premium tier upgrade',
      conversionRate: 0,
      averageValue: 0,
      active: false
    }
  ])

  // Initialize intelligence integration
  useEffect(() => {
    if (intelligenceId && user) {
      loadIntelligenceData()
    }
  }, [intelligenceId, user])

  const loadIntelligenceData = async () => {
    try {
      setLoading(true)
      const summary = await SharedIntelligenceService.getIntelligenceSummary(intelligenceId)
      setIntelligence(summary.intelligence)
      setDiscoveries(summary.discoveries)
      
      // Update business level based on intelligence
      if (summary.intelligence.business_stage) {
        // This will be used instead of userProfile business_level
      }
    } catch (error) {
      console.error('Error loading intelligence data:', error)
    } finally {
      setLoading(false)
    }
  }

  const businessLevel = intelligence?.business_stage || 'beginner'
  const isAdvanced = ['scale', 'enterprise'].includes(businessLevel)

  const updateMoneyModelComponent = (index: number, field: keyof MoneyModelComponent, value: any) => {
    const updated = [...moneyModel]
    updated[index] = { ...updated[index], [field]: value }
    setMoneyModel(updated)
  }

  const updateUpsellMoment = (index: number, field: keyof UpsellMoment, value: any) => {
    const updated = [...upsellMoments]
    updated[index] = { ...updated[index], [field]: value }
    setUpsellMoments(updated)
  }

  const totalCurrentRevenue = moneyModel.reduce((sum, component) => sum + component.currentRevenue, 0)
  const totalProjectedRevenue = moneyModel.reduce((sum, component) => sum + component.projectedRevenue, 0)
  const revenueIncrease = totalProjectedRevenue - totalCurrentRevenue
  const revenueIncreasePercentage = totalCurrentRevenue > 0 ? (revenueIncrease / totalCurrentRevenue) * 100 : 0

  const implementedComponents = moneyModel.filter(c => c.implemented).length
  const activeUpsellMoments = upsellMoments.filter(m => m.active).length

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  // Chart data for revenue model visualization
  const revenueChartData = moneyModel.map(component => ({
    name: component.name.replace(' ', '\n'),
    current: component.currentRevenue,
    projected: component.projectedRevenue
  }))

  const getComponentIcon = (name: string) => {
    switch (name) {
      case 'Attraction Offer': return <Target className="w-5 h-5" />
      case 'Upsell Offers': return <TrendingUp className="w-5 h-5" />
      case 'Downsell Offers': return <RefreshCw className="w-5 h-5" />
      case 'Continuity Offers': return <Repeat className="w-5 h-5" />
      default: return <DollarSign className="w-5 h-5" />
    }
  }

  const getComponentColor = (name: string) => {
    switch (name) {
      case 'Attraction Offer': return 'border-blue-200 bg-blue-50'
      case 'Upsell Offers': return 'border-green-200 bg-green-50'
      case 'Downsell Offers': return 'border-yellow-200 bg-yellow-50'
      case 'Continuity Offers': return 'border-purple-200 bg-purple-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          💰 Money Model Laboratory
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Build Alex's 4-Prong Money Model + 5 Upsell Moments
        </p>

        {businessLevel === 'beginner' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5" />
              <div className="text-left">
                <h3 className="font-semibold text-blue-900">What is the 4-Prong Money Model?</h3>
                <p className="text-blue-800 text-sm mt-1">
                  Alex's framework for maximizing revenue per customer. Instead of one product, you create 
                  a system of 4 different offers that work together to dramatically increase customer lifetime value.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Revenue Impact Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Current Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalCurrentRevenue)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Projected Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(totalProjectedRevenue)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Potential Increase</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(revenueIncrease)}</div>
              <div className="text-sm text-gray-600">
                +{revenueIncreasePercentage.toFixed(0)}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Implementation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{implementedComponents}/4</div>
              <Progress value={(implementedComponents / 4) * 100} className="mt-2" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="money-model" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="money-model">4-Prong Model</TabsTrigger>
          <TabsTrigger value="upsell-moments">5 Upsell Moments</TabsTrigger>
          <TabsTrigger value="revenue-model">Revenue Modeling</TabsTrigger>
          <TabsTrigger value="ai-coach">AI Coach</TabsTrigger>
        </TabsList>

        <TabsContent value="money-model" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {moneyModel.map((component, index) => (
              <Card key={component.name} className={getComponentColor(component.name)}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getComponentIcon(component.name)}
                      <span>{component.name}</span>
                    </div>
                    <Badge variant={component.implemented ? 'default' : 'outline'}>
                      {component.implemented ? 'Active' : 'Planned'}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{component.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Current Monthly Revenue</label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={component.currentRevenue || ''}
                        onChange={(e) => updateMoneyModelComponent(index, 'currentRevenue', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Projected Monthly Revenue</label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={component.projectedRevenue || ''}
                        onChange={(e) => updateMoneyModelComponent(index, 'projectedRevenue', Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Conversion Rate (%)</label>
                      <Input
                        type="number"
                        placeholder="0"
                        max="100"
                        value={component.conversionRate || ''}
                        onChange={(e) => updateMoneyModelComponent(index, 'conversionRate', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Average Order Value</label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={component.averageValue || ''}
                        onChange={(e) => updateMoneyModelComponent(index, 'averageValue', Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`implemented-${index}`}
                      checked={component.implemented}
                      onChange={(e) => updateMoneyModelComponent(index, 'implemented', e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor={`implemented-${index}`} className="text-sm">
                      Currently implemented in business
                    </label>
                  </div>

                  {businessLevel === 'beginner' && (
                    <div className="p-3 bg-white border rounded text-sm">
                      <strong>Example for {component.name}:</strong>
                      <p className="mt-1">
                        {component.name === 'Attraction Offer' && 
                          "A $47 'Quick Win' course that solves an immediate problem and introduces your main solution."
                        }
                        {component.name === 'Upsell Offers' && 
                          "A $497 'Done With You' program offered immediately after they buy the attraction offer."
                        }
                        {component.name === 'Downsell Offers' && 
                          "A $197 'Starter Kit' when they decline the main upsell but want some help."
                        }
                        {component.name === 'Continuity Offers' && 
                          "A $97/month membership with ongoing support, tools, and accountability."
                        }
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upsell-moments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>The 5 Upsell Moments</span>
              </CardTitle>
              <CardDescription>
                {businessLevel === 'beginner' ? 
                  'Strategic moments when customers are most likely to buy additional products' :
                  'Optimize conversion rates at each critical customer journey moment'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upsellMoments.map((moment, index) => (
                  <Card key={moment.moment} className="border-dashed">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-semibold flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold mr-3">
                              {index + 1}
                            </div>
                            {moment.moment}
                          </h4>
                          <p className="text-sm text-gray-600 ml-11">{moment.description}</p>
                        </div>
                        <Badge variant={moment.active ? 'default' : 'outline'}>
                          {moment.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-11">
                        <div>
                          <label className="text-sm font-medium">Offer Type</label>
                          <Input
                            placeholder="e.g., Implementation guide"
                            value={moment.offerType}
                            onChange={(e) => updateUpsellMoment(index, 'offerType', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Conversion Rate (%)</label>
                          <Input
                            type="number"
                            placeholder="25"
                            max="100"
                            value={moment.conversionRate || ''}
                            onChange={(e) => updateUpsellMoment(index, 'conversionRate', Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Average Value</label>
                          <Input
                            type="number"
                            placeholder="497"
                            value={moment.averageValue || ''}
                            onChange={(e) => updateUpsellMoment(index, 'averageValue', Number(e.target.value))}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 ml-11">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`active-${index}`}
                            checked={moment.active}
                            onChange={(e) => updateUpsellMoment(index, 'active', e.target.checked)}
                            className="rounded"
                          />
                          <label htmlFor={`active-${index}`} className="text-sm">
                            Currently active in business
                          </label>
                        </div>
                        
                        {moment.active && moment.conversionRate > 0 && moment.averageValue > 0 && (
                          <div className="text-sm font-medium text-green-600">
                            Revenue Impact: {formatCurrency(moment.conversionRate * moment.averageValue / 100)}/customer
                          </div>
                        )}
                      </div>

                      {businessLevel === 'beginner' && (
                        <div className="mt-3 ml-11 p-3 bg-gray-50 rounded text-sm">
                          <strong>Why this moment works:</strong>
                          <p className="mt-1">
                            {index === 0 && "They just committed with money - they're in 'buying mode' and trust is highest."}
                            {index === 1 && "They're excited about their results and want to maximize their success."}
                            {index === 2 && "They need help transitioning to the next level of their journey."}
                            {index === 3 && "Success creates momentum - they want to maintain and expand their wins."}
                            {index === 4 && "They've proven the relationship works - perfect time for upgrades."}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">
                  🎯 Active Upsell Moments Impact
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-green-700">Active Moments:</span>
                    <span className="font-semibold ml-2">{activeUpsellMoments}/5</span>
                  </div>
                  <div>
                    <span className="text-green-700">Potential Revenue Boost:</span>
                    <span className="font-semibold ml-2">
                      {formatCurrency(upsellMoments.reduce((sum, m) => 
                        m.active ? sum + (m.conversionRate * m.averageValue / 100) : sum, 0
                      ))}/customer
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue-model" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Comparison Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Model Comparison</CardTitle>
                <CardDescription>Current vs Projected Monthly Revenue by Component</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        fontSize={12}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis tickFormatter={(value) => `$${value}`} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Bar dataKey="current" fill="#94a3b8" name="Current" />
                      <Bar dataKey="projected" fill="#3b82f6" name="Projected" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Modeling Calculator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="w-5 h-5" />
                  <span>Revenue Impact Calculator</span>
                </CardTitle>
                <CardDescription>Model the financial impact of your money model</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded">
                  <div>
                    <div className="text-sm text-gray-600">Current Monthly Revenue</div>
                    <div className="text-lg font-bold">{formatCurrency(totalCurrentRevenue)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Projected Monthly Revenue</div>
                    <div className="text-lg font-bold text-green-600">{formatCurrency(totalProjectedRevenue)}</div>
                  </div>
                </div>

                <div className="p-4 border rounded">
                  <div className="text-sm font-medium mb-2">Revenue Increase Breakdown:</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Monthly Increase:</span>
                      <span className="font-semibold text-green-600">{formatCurrency(revenueIncrease)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Annual Increase:</span>
                      <span className="font-semibold text-green-600">{formatCurrency(revenueIncrease * 12)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Percentage Increase:</span>
                      <span className="font-semibold text-blue-600">{revenueIncreasePercentage.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                  <h4 className="font-semibold text-blue-900 mb-2">Implementation Priority</h4>
                  <div className="space-y-2">
                    {moneyModel
                      .map((component, index) => ({ ...component, index }))
                      .sort((a, b) => (b.projectedRevenue - b.currentRevenue) - (a.projectedRevenue - a.currentRevenue))
                      .slice(0, 3)
                      .map((component, rank) => (
                        <div key={component.name} className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center text-xs font-bold">
                              {rank + 1}
                            </div>
                            <span>{component.name}</span>
                          </div>
                          <span className="font-semibold">
                            +{formatCurrency(component.projectedRevenue - component.currentRevenue)}
                          </span>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {isAdvanced && (
            <Card>
              <CardHeader>
                <CardTitle>Advanced Revenue Optimization</CardTitle>
                <CardDescription>Enterprise-level revenue model insights</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded">
                  <h4 className="font-semibold mb-2">Customer Lifetime Value</h4>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(totalProjectedRevenue * 12)}
                  </div>
                  <p className="text-sm text-gray-600">Annual revenue per customer</p>
                </div>

                <div className="p-4 border rounded">
                  <h4 className="font-semibold mb-2">Revenue Multiplier</h4>
                  <div className="text-2xl font-bold text-blue-600">
                    {totalCurrentRevenue > 0 ? (totalProjectedRevenue / totalCurrentRevenue).toFixed(1) : '0'}x
                  </div>
                  <p className="text-sm text-gray-600">Revenue multiplication factor</p>
                </div>

                <div className="p-4 border rounded">
                  <h4 className="font-semibold mb-2">Implementation ROI</h4>
                  <div className="text-2xl font-bold text-purple-600">
                    {revenueIncreasePercentage.toFixed(0)}%
                  </div>
                  <p className="text-sm text-gray-600">Return on implementation</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="ai-coach">
          <ConversationMemory 
            businessProfile={businessProfile}
            workspace="money_model"
            onInsightsGenerated={(insights) => {
              console.log('Money model insights generated:', insights)
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}