import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { BusinessLevel, BusinessProfile, BusinessDashboard } from '@/lib/supabase/types'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  AlertTriangle, 
  CheckCircle,
  Trophy,
  Lightbulb,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'

interface DashboardData {
  businessDashboard: BusinessDashboard | null
  loading: boolean
  error: string | null
}

export function AdaptiveDashboard() {
  const { user, userProfile, businessProfiles } = useAuth()
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    businessDashboard: null,
    loading: true,
    error: null
  })
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessProfile | null>(null)

  // Get user's business level for adaptive UI
  const businessLevel: BusinessLevel = userProfile?.business_level || 'beginner'
  const isAdvanced = ['scale', 'enterprise'].includes(businessLevel)
  const isIntermediate = ['growth', 'scale'].includes(businessLevel)

  useEffect(() => {
    if (businessProfiles.length > 0 && !selectedBusiness) {
      setSelectedBusiness(businessProfiles[0])
    }
  }, [businessProfiles, selectedBusiness])

  useEffect(() => {
    if (selectedBusiness) {
      loadDashboardData(selectedBusiness.id)
    }
  }, [selectedBusiness])

  const loadDashboardData = async (businessId: string) => {
    try {
      setDashboardData(prev => ({ ...prev, loading: true, error: null }))

      const { data, error } = await supabase
        .from('business_dashboard')
        .select('*')
        .eq('business_id', businessId)
        .single()

      if (error) {
        setDashboardData(prev => ({ 
          ...prev, 
          loading: false, 
          error: error.message 
        }))
        return
      }

      setDashboardData({
        businessDashboard: data,
        loading: false,
        error: null
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setDashboardData(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Failed to load dashboard data' 
      }))
    }
  }

  const getConstraintColor = (constraint: string) => {
    switch (constraint) {
      case 'leads': return 'bg-blue-500'
      case 'sales': return 'bg-green-500'
      case 'delivery': return 'bg-yellow-500'
      case 'profit': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const getConstraintIcon = (constraint: string) => {
    switch (constraint) {
      case 'leads': return <Users className="w-4 h-4" />
      case 'sales': return <TrendingUp className="w-4 h-4" />
      case 'delivery': return <Activity className="w-4 h-4" />
      case 'profit': return <DollarSign className="w-4 h-4" />
      default: return <AlertTriangle className="w-4 h-4" />
    }
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

  const formatPercentage = (value: number | null) => {
    if (!value) return '0%'
    return `${value.toFixed(1)}%`
  }

  if (dashboardData.loading) {
    return (
      <div className="p-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

  if (dashboardData.error || !dashboardData.businessDashboard) {
    return (
      <div className="p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Data Available
        </h3>
        <p className="text-gray-600 mb-4">
          {dashboardData.error || 'Complete your business setup to see your dashboard'}
        </p>
        <Button onClick={() => window.location.href = '/onboarding'}>
          Complete Setup
        </Button>
      </div>
    )
  }

  const dashboard = dashboardData.businessDashboard

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {dashboard.business_name}
          </h1>
          <p className="text-gray-600">
            {businessLevel.charAt(0).toUpperCase() + businessLevel.slice(1)} Level Business
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className={getConstraintColor(dashboard.primary_constraint)}>
            {getConstraintIcon(dashboard.primary_constraint)}
            <span className="ml-2 text-white">
              {dashboard.primary_constraint.toUpperCase()} Focus
            </span>
          </Badge>
          <Badge variant="outline">
            {dashboard.constraint_confidence}% Confidence
          </Badge>
        </div>
      </div>

      {/* Key Metrics - Adaptive based on level */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue - Always visible */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(dashboard.monthly_revenue)}
            </div>
            {dashboard.revenue_growth_percentage !== null && (
              <p className={`text-xs ${
                dashboard.revenue_growth_percentage >= 0 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {dashboard.revenue_growth_percentage >= 0 ? '+' : ''}
                {dashboard.revenue_growth_percentage}% from last month
              </p>
            )}
          </CardContent>
        </Card>

        {/* Customers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard.customer_count}</div>
            <p className="text-xs text-muted-foreground">
              Active customer base
            </p>
          </CardContent>
        </Card>

        {/* LTV/CAC Ratio - Show if intermediate+ or has data */}
        {(isIntermediate || dashboard.ltv_cac_ratio) && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">LTV/CAC Ratio</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboard.ltv_cac_ratio ? dashboard.ltv_cac_ratio.toFixed(1) : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                {businessLevel === 'beginner' ? 'Target: 3.0+' : 'Healthy: 3.0+, Great: 5.0+'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* CFA Status - Advanced metric */}
        {(isAdvanced || dashboard.cfa_achieved) && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CFA Status</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                {dashboard.cfa_achieved ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-yellow-500" />
                )}
                <span className="text-2xl font-bold">
                  {dashboard.cfa_achieved ? 'Achieved' : 'Pending'}
                </span>
              </div>
              {dashboard.thirty_day_cash && (
                <p className="text-xs text-muted-foreground">
                  30-day cash: {formatCurrency(dashboard.thirty_day_cash)}
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Adaptive Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {isIntermediate && <TabsTrigger value="strategies">Strategies</TabsTrigger>}
          {isAdvanced && <TabsTrigger value="analytics">Advanced Analytics</TabsTrigger>}
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Constraint */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {getConstraintIcon(dashboard.primary_constraint)}
                  <span className="ml-2">Current Focus: {dashboard.primary_constraint.toUpperCase()}</span>
                </CardTitle>
                <CardDescription>
                  {businessLevel === 'beginner' ? 
                    'This is the main area limiting your business growth right now.' :
                    'Primary constraint analysis with confidence scoring.'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Confidence Level</span>
                    <span>{dashboard.constraint_confidence}%</span>
                  </div>
                  <Progress value={dashboard.constraint_confidence} className="w-full" />
                </div>
                {businessLevel === 'beginner' && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-1">
                      What this means:
                    </h4>
                    <p className="text-sm text-blue-800">
                      {dashboard.primary_constraint === 'leads' && 
                        'You need more potential customers to grow your business.'}
                      {dashboard.primary_constraint === 'sales' && 
                        'You need to improve at converting leads into paying customers.'}
                      {dashboard.primary_constraint === 'delivery' && 
                        'You need to improve your service delivery or capacity.'}
                      {dashboard.primary_constraint === 'profit' && 
                        'You need to improve your profit margins or reduce costs.'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Progress Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Constraints Resolved</span>
                  <Badge variant="outline">{dashboard.constraints_resolved || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Active Strategies</span>
                  <Badge variant="outline">{dashboard.active_strategies || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Completed Strategies</span>
                  <Badge variant="outline">{dashboard.completed_strategies || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>This Month's Milestones</span>
                  <Badge variant="outline">{dashboard.milestones_this_month || 0}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {isIntermediate && (
          <TabsContent value="strategies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Strategy Implementation</CardTitle>
                <CardDescription>
                  Track your Alex Hormozi framework implementations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Strategy tracking will be populated from your conversation history and implementation progress.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {isAdvanced && (
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>CAC</span>
                      <span>{formatCurrency(dashboard.cac)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>LTV</span>
                      <span>{formatCurrency(dashboard.ltv)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payback Period</span>
                      <span>{dashboard.thirty_day_cash ? '< 30 days' : 'Calculating...'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Growth Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Revenue Growth</span>
                      <span className={dashboard.revenue_growth_percentage && dashboard.revenue_growth_percentage >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatPercentage(dashboard.revenue_growth_percentage)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>CFA Status</span>
                      <Badge variant={dashboard.cfa_achieved ? 'default' : 'outline'}>
                        {dashboard.cfa_achieved ? 'Achieved' : 'Working'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}

        <TabsContent value="milestones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Recent Achievements
              </CardTitle>
              <CardDescription>
                Celebrate your business growth milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your achievements and milestones will appear here as you grow your business using Alex's strategies.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions - Adaptive */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="w-5 h-5 mr-2" />
            Recommended Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboard.primary_constraint === 'leads' && (
              <Button variant="outline" className="justify-start">
                <Users className="w-4 h-4 mr-2" />
                Work on Lead Generation
              </Button>
            )}
            {dashboard.primary_constraint === 'sales' && (
              <Button variant="outline" className="justify-start">
                <TrendingUp className="w-4 h-4 mr-2" />
                Improve Sales Process
              </Button>
            )}
            {!dashboard.cfa_achieved && (
              <Button variant="outline" className="justify-start">
                <Target className="w-4 h-4 mr-2" />
                Work Toward CFA
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}