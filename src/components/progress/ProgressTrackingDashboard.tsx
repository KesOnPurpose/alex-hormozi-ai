import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { BusinessProfile, BusinessMetric, StrategyImplementation, BusinessMilestone } from '@/lib/supabase/types'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  Trophy,
  Calendar,
  CheckCircle,
  Clock,
  Lightbulb,
  Activity,
  Award,
  Zap
} from 'lucide-react'

interface ProgressData {
  metrics: BusinessMetric[]
  strategies: StrategyImplementation[]
  milestones: BusinessMilestone[]
  loading: boolean
  error: string | null
}

interface ProgressTrackingDashboardProps {
  businessProfile: BusinessProfile
}

export function ProgressTrackingDashboard({ businessProfile }: ProgressTrackingDashboardProps) {
  const { userProfile } = useAuth()
  const [progressData, setProgressData] = useState<ProgressData>({
    metrics: [],
    strategies: [],
    milestones: [],
    loading: true,
    error: null
  })

  const [selectedTimeframe, setSelectedTimeframe] = useState<'30d' | '90d' | '6m' | '1y'>('90d')

  useEffect(() => {
    loadProgressData()
  }, [businessProfile.id, selectedTimeframe])

  const loadProgressData = async () => {
    try {
      setProgressData(prev => ({ ...prev, loading: true, error: null }))

      const endDate = new Date()
      const startDate = new Date()
      
      switch (selectedTimeframe) {
        case '30d': startDate.setDate(endDate.getDate() - 30); break
        case '90d': startDate.setDate(endDate.getDate() - 90); break
        case '6m': startDate.setMonth(endDate.getMonth() - 6); break
        case '1y': startDate.setFullYear(endDate.getFullYear() - 1); break
      }

      // Load metrics history
      const { data: metrics, error: metricsError } = await supabase
        .from('business_metrics_history')
        .select('*')
        .eq('business_id', businessProfile.id)
        .gte('metric_date', startDate.toISOString().split('T')[0])
        .lte('metric_date', endDate.toISOString().split('T')[0])
        .order('metric_date', { ascending: true })

      // Load strategy implementations
      const { data: strategies, error: strategiesError } = await supabase
        .from('strategy_implementations')
        .select('*')
        .eq('business_id', businessProfile.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false })

      // Load milestones
      const { data: milestones, error: milestonesError } = await supabase
        .from('business_milestones')
        .select('*')
        .eq('business_id', businessProfile.id)
        .gte('achieved_date', startDate.toISOString().split('T')[0])
        .order('achieved_date', { ascending: false })

      if (metricsError) throw metricsError
      if (strategiesError) throw strategiesError
      if (milestonesError) throw milestonesError

      setProgressData({
        metrics: metrics || [],
        strategies: strategies || [],
        milestones: milestones || [],
        loading: false,
        error: null
      })
    } catch (error: any) {
      console.error('Error loading progress data:', error)
      setProgressData(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to load progress data'
      }))
    }
  }

  const calculateGrowthRate = (current: number, previous: number) => {
    if (!previous || previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  const formatCurrency = (amount: number | null) => {
    if (!amount) return '$0'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  // Prepare chart data
  const chartData = progressData.metrics.map(metric => ({
    date: formatDate(metric.metric_date),
    revenue: metric.monthly_revenue || 0,
    customers: metric.customer_count || 0,
    cac: metric.cac || 0,
    ltv: metric.ltv || 0,
    profit: metric.monthly_profit || 0
  }))

  // Calculate key metrics
  const latestMetric = progressData.metrics[progressData.metrics.length - 1]
  const previousMetric = progressData.metrics[progressData.metrics.length - 2]
  
  const revenueGrowth = latestMetric && previousMetric ? 
    calculateGrowthRate(latestMetric.monthly_revenue || 0, previousMetric.monthly_revenue || 0) : 0
  
  const customerGrowth = latestMetric && previousMetric ?
    calculateGrowthRate(latestMetric.customer_count || 0, previousMetric.customer_count || 0) : 0

  // Strategy status breakdown
  const strategyStatusCounts = progressData.strategies.reduce((acc, strategy) => {
    acc[strategy.status] = (acc[strategy.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const strategyChartData = Object.entries(strategyStatusCounts).map(([status, count]) => ({
    name: status.replace('_', ' ').toUpperCase(),
    value: count
  }))

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  if (progressData.loading) {
    return (
      <div className="p-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="space-y-2">
                <div className="w-24 h-4 bg-gray-200 rounded"></div>
                <div className="w-16 h-8 bg-gray-200 rounded"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Progress Dashboard</h1>
          <p className="text-gray-600">
            Track your growth using Alex Hormozi's frameworks
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={selectedTimeframe === '30d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeframe('30d')}
          >
            30D
          </Button>
          <Button
            variant={selectedTimeframe === '90d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeframe('90d')}
          >
            90D
          </Button>
          <Button
            variant={selectedTimeframe === '6m' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeframe('6m')}
          >
            6M
          </Button>
          <Button
            variant={selectedTimeframe === '1y' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeframe('1y')}
          >
            1Y
          </Button>
        </div>
      </div>

      {/* Key Progress Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Growth</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(latestMetric?.monthly_revenue)}
            </div>
            <div className={`text-xs flex items-center ${
              revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {revenueGrowth >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {revenueGrowth >= 0 ? '+' : ''}{revenueGrowth.toFixed(1)}% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Growth</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestMetric?.customer_count || 0}
            </div>
            <div className={`text-xs flex items-center ${
              customerGrowth >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {customerGrowth >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {customerGrowth >= 0 ? '+' : ''}{customerGrowth.toFixed(1)}% growth
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Strategies Implemented</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {progressData.strategies.filter(s => s.status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {progressData.strategies.length} total strategies
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Milestones Achieved</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {progressData.milestones.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {progressData.milestones.filter(m => m.is_major_milestone).length} major milestones
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="metrics">Metrics Trends</TabsTrigger>
          <TabsTrigger value="strategies">Strategy Impact</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Progression</CardTitle>
                <CardDescription>
                  Track your monthly revenue growth over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Customer Growth */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Base Growth</CardTitle>
                <CardDescription>
                  Your customer acquisition journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="customers" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        dot={{ fill: '#10b981' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Unit Economics */}
            {chartData.some(d => d.cac > 0 || d.ltv > 0) && (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Unit Economics Evolution</CardTitle>
                  <CardDescription>
                    CAC vs LTV progression showing your path to profitability
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis tickFormatter={(value) => formatCurrency(value)} />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Line 
                          type="monotone" 
                          dataKey="ltv" 
                          stroke="#8b5cf6" 
                          strokeWidth={3}
                          name="LTV"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="cac" 
                          stroke="#f59e0b" 
                          strokeWidth={3}
                          name="CAC"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="strategies" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Strategy Status Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Strategy Status</CardTitle>
                <CardDescription>
                  Current state of your implementations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={strategyChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label
                      >
                        {strategyChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Strategies */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Strategy Implementations</CardTitle>
                <CardDescription>
                  Your latest Alex Hormozi framework implementations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {progressData.strategies.slice(0, 10).map((strategy) => (
                    <div key={strategy.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{strategy.strategy_name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          {strategy.alex_framework && (
                            <Badge variant="outline" className="text-xs">
                              {strategy.alex_framework}
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {strategy.strategy_type}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {strategy.roi_percentage && (
                          <div className="text-sm font-medium text-green-600">
                            +{strategy.roi_percentage}% ROI
                          </div>
                        )}
                        <Badge variant={
                          strategy.status === 'completed' ? 'default' :
                          strategy.status === 'in_progress' ? 'secondary' :
                          'outline'
                        }>
                          {strategy.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {strategy.status === 'in_progress' && <Clock className="w-3 h-3 mr-1" />}
                          {strategy.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Milestones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Recent Achievements
                </CardTitle>
                <CardDescription>
                  Your business milestones powered by Alex's strategies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {progressData.milestones.map((milestone) => (
                    <div key={milestone.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <Award className="w-5 h-5 text-yellow-500" />
                            <h4 className="font-semibold">{milestone.milestone_name}</h4>
                            {milestone.is_major_milestone && (
                              <Badge variant="default" className="bg-yellow-500">
                                Major
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 mt-1">
                            {milestone.milestone_description}
                          </p>
                          
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="text-xs text-gray-500">
                              {formatDate(milestone.achieved_date)}
                            </div>
                            {milestone.metric_value && (
                              <div className="text-sm font-medium">
                                {milestone.metric_name}: {formatCurrency(milestone.metric_value)}
                              </div>
                            )}
                          </div>

                          {milestone.alex_contribution && (
                            <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                              <strong>Alex's Impact:</strong> {milestone.alex_contribution}
                            </div>
                          )}
                        </div>
                        
                        <div className="text-right">
                          {milestone.points_awarded && (
                            <Badge variant="outline">
                              +{milestone.points_awarded} pts
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {progressData.milestones.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No milestones yet. Keep implementing Alex's strategies!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Milestone Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Progress Indicators</CardTitle>
                <CardDescription>
                  Key business level achievements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Revenue Milestones */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Revenue Progress</span>
                    <span>{formatCurrency(latestMetric?.monthly_revenue)}</span>
                  </div>
                  <Progress 
                    value={Math.min((latestMetric?.monthly_revenue || 0) / 100000 * 100, 100)} 
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Next milestone: $100K/month
                  </div>
                </div>

                {/* Customer Milestones */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Customer Base</span>
                    <span>{latestMetric?.customer_count || 0} customers</span>
                  </div>
                  <Progress 
                    value={Math.min((latestMetric?.customer_count || 0) / 1000 * 100, 100)} 
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Next milestone: 1,000 customers
                  </div>
                </div>

                {/* CFA Achievement */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>CFA Status</span>
                    <Badge variant={latestMetric?.cfa_achieved ? 'default' : 'outline'}>
                      {latestMetric?.cfa_achieved ? 'Achieved' : 'In Progress'}
                    </Badge>
                  </div>
                  {!latestMetric?.cfa_achieved && (
                    <div className="text-xs text-gray-500">
                      Work on getting customers to pay more in 30 days than your CAC
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="w-5 h-5 mr-2" />
                AI-Powered Business Insights
              </CardTitle>
              <CardDescription>
                Personalized analysis based on your progress and Alex's methodologies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Growth Analysis */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Growth Pattern Analysis</h4>
                <p className="text-sm text-gray-600">
                  {revenueGrowth > 20 ? 
                    "Excellent growth trajectory! You're implementing Alex's strategies effectively. Focus on maintaining this momentum while preparing for scale constraints." :
                    revenueGrowth > 0 ?
                    "Positive growth trend detected. Consider doubling down on your highest-performing strategies and identifying the next constraint to break through." :
                    "Growth has stagnated. Let's identify your primary constraint and implement targeted Alex Hormozi frameworks to break through this plateau."
                  }
                </p>
              </div>

              {/* Strategy Recommendations */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Next Strategy Recommendations</h4>
                <div className="space-y-2">
                  {progressData.strategies.filter(s => s.status === 'completed').length < 3 && (
                    <div className="flex items-center text-sm">
                      <Target className="w-4 h-4 mr-2 text-blue-500" />
                      Implement Grand Slam Offer framework to increase conversion rates
                    </div>
                  )}
                  {!latestMetric?.cfa_achieved && (
                    <div className="flex items-center text-sm">
                      <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                      Focus on achieving CFA through pricing optimization and upsells
                    </div>
                  )}
                  <div className="flex items-center text-sm">
                    <Activity className="w-4 h-4 mr-2 text-purple-500" />
                    Address your primary constraint: {businessProfile.primary_constraint}
                  </div>
                </div>
              </div>

              {/* Performance Insights */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Performance Insights</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium">Strengths</div>
                    <ul className="text-sm text-gray-600 mt-1 space-y-1">
                      {revenueGrowth > 0 && <li>• Consistent revenue growth</li>}
                      {progressData.strategies.length > 0 && <li>• Active strategy implementation</li>}
                      {progressData.milestones.length > 0 && <li>• Achievement of key milestones</li>}
                    </ul>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Opportunities</div>
                    <ul className="text-sm text-gray-600 mt-1 space-y-1">
                      {!latestMetric?.cfa_achieved && <li>• Achieve CFA status</li>}
                      {(latestMetric?.ltv_cac_ratio || 0) < 3 && <li>• Improve LTV/CAC ratio</li>}
                      <li>• Focus on constraint: {businessProfile.primary_constraint}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}