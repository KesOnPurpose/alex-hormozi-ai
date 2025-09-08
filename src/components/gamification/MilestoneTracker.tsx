import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { BusinessProfile, BusinessMilestone } from '@/lib/supabase/types'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Trophy,
  Award,
  Star,
  Zap,
  Target,
  TrendingUp,
  DollarSign,
  Users,
  Flame,
  Crown,
  Medal,
  Gift,
  Sparkles,
  CheckCircle,
  Lock
} from 'lucide-react'

interface MilestoneTrackerProps {
  businessProfile: BusinessProfile
  onMilestoneAchieved?: (milestone: BusinessMilestone) => void
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  category: 'revenue' | 'customers' | 'strategy' | 'learning' | 'consistency'
  condition: (profile: BusinessProfile, metrics: any) => boolean
  points: number
  badge: string
  unlocked: boolean
  progress?: number
  maxProgress?: number
}

interface UserProgress {
  totalPoints: number
  currentLevel: number
  nextLevelPoints: number
  streak: number
  completedAchievements: string[]
  recentMilestones: BusinessMilestone[]
}

export function MilestoneTracker({ businessProfile, onMilestoneAchieved }: MilestoneTrackerProps) {
  const { user, userProfile } = useAuth()
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalPoints: 0,
    currentLevel: 1,
    nextLevelPoints: 100,
    streak: 0,
    completedAchievements: [],
    recentMilestones: []
  })
  
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [celebrationMode, setCelebrationMode] = useState<BusinessMilestone | null>(null)

  const businessLevel = userProfile?.business_level || 'beginner'

  // Define achievement templates
  const achievementTemplates: Omit<Achievement, 'unlocked' | 'progress'>[] = [
    // Revenue Milestones
    {
      id: 'first_1k',
      title: 'First $1K Month',
      description: 'Achieve your first $1,000 in monthly revenue',
      icon: <DollarSign className="w-6 h-6" />,
      category: 'revenue',
      condition: (profile) => (profile.monthly_revenue || 0) >= 1000,
      points: 50,
      badge: 'Revenue Starter'
    },
    {
      id: 'first_10k',
      title: 'Five Figure Founder',
      description: 'Reach $10,000 in monthly revenue',
      icon: <TrendingUp className="w-6 h-6" />,
      category: 'revenue',
      condition: (profile) => (profile.monthly_revenue || 0) >= 10000,
      points: 100,
      badge: 'Five Figure Club'
    },
    {
      id: 'first_100k',
      title: 'Six Figure Success',
      description: 'Achieve $100,000 in monthly revenue',
      icon: <Crown className="w-6 h-6" />,
      category: 'revenue',
      condition: (profile) => (profile.monthly_revenue || 0) >= 100000,
      points: 500,
      badge: 'Six Figure Superstar'
    },

    // Customer Milestones
    {
      id: 'first_100_customers',
      title: 'Century Club',
      description: 'Serve 100 customers',
      icon: <Users className="w-6 h-6" />,
      category: 'customers',
      condition: (profile) => (profile.customer_count || 0) >= 100,
      points: 75,
      badge: 'Customer Champion'
    },
    {
      id: 'first_1000_customers',
      title: 'Thousand Strong',
      description: 'Build a community of 1,000+ customers',
      icon: <Flame className="w-6 h-6" />,
      category: 'customers',
      condition: (profile) => (profile.customer_count || 0) >= 1000,
      points: 200,
      badge: 'Community Builder'
    },

    // Strategy Implementation
    {
      id: 'first_strategy',
      title: 'Strategic Starter',
      description: 'Implement your first Alex Hormozi strategy',
      icon: <Target className="w-6 h-6" />,
      category: 'strategy',
      condition: () => false, // Will be checked against strategy_implementations table
      points: 25,
      badge: 'Strategy Student'
    },
    {
      id: 'grand_slam_offer',
      title: 'Grand Slam Master',
      description: 'Complete a Grand Slam Offer workshop',
      icon: <Star className="w-6 h-6" />,
      category: 'strategy',
      condition: () => false, // Will be checked against completed workshops
      points: 100,
      badge: 'Offer Expert'
    },
    {
      id: 'money_model_architect',
      title: 'Money Model Architect',
      description: 'Implement the complete 4-Prong Money Model',
      icon: <Zap className="w-6 h-6" />,
      category: 'strategy',
      condition: () => false, // Will be checked against money model completion
      points: 150,
      badge: 'Revenue Engineer'
    },

    // Learning Achievements
    {
      id: 'cac_master',
      title: 'CAC Calculator',
      description: 'Master Customer Acquisition Cost concepts',
      icon: <Medal className="w-6 h-6" />,
      category: 'learning',
      condition: () => false, // Will be checked against learning_progress
      points: 30,
      badge: 'Metrics Master'
    },
    {
      id: 'ltv_expert',
      title: 'LTV Analyst',
      description: 'Master Lifetime Value calculations',
      icon: <Award className="w-6 h-6" />,
      category: 'learning',
      condition: () => false, // Will be checked against learning_progress
      points: 30,
      badge: 'Value Visionary'
    },

    // Consistency Achievements
    {
      id: 'seven_day_streak',
      title: 'Week Warrior',
      description: 'Use Alex AI for 7 consecutive days',
      icon: <Flame className="w-6 h-6" />,
      category: 'consistency',
      condition: () => false, // Will be checked against user sessions
      points: 40,
      badge: 'Consistent Creator'
    },
    {
      id: 'thirty_day_streak',
      title: 'Monthly Marathon',
      description: 'Maintain a 30-day learning streak',
      icon: <Trophy className="w-6 h-6" />,
      category: 'consistency',
      condition: () => false, // Will be checked against user sessions
      points: 150,
      badge: 'Dedication Master'
    }
  ]

  useEffect(() => {
    loadUserProgress()
    loadAchievements()
  }, [businessProfile.id])

  const loadUserProgress = async () => {
    if (!user) return

    try {
      setLoading(true)

      // Load milestones
      const { data: milestones, error: milestonesError } = await supabase
        .from('business_milestones')
        .select('*')
        .eq('business_id', businessProfile.id)
        .order('achieved_date', { ascending: false })

      if (milestonesError) throw milestonesError

      // Calculate total points
      const totalPoints = (milestones || []).reduce((sum, milestone) => sum + (milestone.points_awarded || 0), 0)
      
      // Calculate level (every 100 points = 1 level)
      const currentLevel = Math.floor(totalPoints / 100) + 1
      const nextLevelPoints = currentLevel * 100

      // Load user sessions for streak calculation
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { data: sessions, error: sessionsError } = await supabase
        .from('user_sessions')
        .select('session_start')
        .eq('user_id', user.id)
        .gte('session_start', thirtyDaysAgo.toISOString())
        .order('session_start', { ascending: false })

      let streak = 0
      if (!sessionsError && sessions) {
        // Calculate streak (simplified - consecutive days with sessions)
        const uniqueDays = new Set(
          sessions.map(session => new Date(session.session_start).toDateString())
        )
        streak = uniqueDays.size
      }

      setUserProgress({
        totalPoints,
        currentLevel,
        nextLevelPoints,
        streak,
        completedAchievements: [], // Will be populated in loadAchievements
        recentMilestones: milestones || []
      })

    } catch (error) {
      console.error('Error loading user progress:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAchievements = async () => {
    try {
      // Load additional data needed for achievement checking
      const [strategiesResult, learningResult] = await Promise.all([
        supabase
          .from('strategy_implementations')
          .select('*')
          .eq('business_id', businessProfile.id),
        supabase
          .from('learning_progress')
          .select('*')
          .eq('user_id', user?.id || '')
      ])

      const strategies = strategiesResult.data || []
      const learning = learningResult.data || []

      // Check each achievement
      const updatedAchievements = achievementTemplates.map(template => {
        let unlocked = false
        let progress = 0
        let maxProgress = 1

        // Check basic conditions
        if (template.condition(businessProfile, {})) {
          unlocked = true
        }

        // Check strategy-specific conditions
        if (template.id === 'first_strategy') {
          unlocked = strategies.filter(s => s.status === 'completed').length > 0
        }

        if (template.id === 'grand_slam_offer') {
          unlocked = strategies.some(s => 
            s.alex_framework === 'Grand Slam Offer' && s.status === 'completed'
          )
        }

        if (template.id === 'money_model_architect') {
          const moneyModelStrategies = strategies.filter(s => 
            s.alex_framework === '4-Prong Money Model' && s.status === 'completed'
          )
          unlocked = moneyModelStrategies.length >= 4
          progress = moneyModelStrategies.length
          maxProgress = 4
        }

        // Check learning-specific conditions
        if (template.id === 'cac_master') {
          const cacLearning = learning.find(l => l.concept === 'CAC')
          unlocked = cacLearning?.mastery_achieved || false
          progress = cacLearning?.understanding_level || 0
          maxProgress = 100
        }

        if (template.id === 'ltv_expert') {
          const ltvLearning = learning.find(l => l.concept === 'LTV')
          unlocked = ltvLearning?.mastery_achieved || false
          progress = ltvLearning?.understanding_level || 0
          maxProgress = 100
        }

        // Check consistency conditions (simplified)
        if (template.id === 'seven_day_streak') {
          unlocked = userProgress.streak >= 7
        }

        if (template.id === 'thirty_day_streak') {
          unlocked = userProgress.streak >= 30
        }

        return {
          ...template,
          unlocked,
          progress: maxProgress > 1 ? progress : undefined,
          maxProgress: maxProgress > 1 ? maxProgress : undefined
        } as Achievement
      })

      setAchievements(updatedAchievements)

      // Update completed achievements in progress
      const completedIds = updatedAchievements
        .filter(a => a.unlocked)
        .map(a => a.id)

      setUserProgress(prev => ({
        ...prev,
        completedAchievements: completedIds
      }))

    } catch (error) {
      console.error('Error loading achievements:', error)
    }
  }

  const triggerMilestone = async (milestone: Partial<BusinessMilestone>) => {
    if (!user) return

    try {
      const newMilestone = {
        business_id: businessProfile.id,
        milestone_type: milestone.milestone_type || 'custom',
        milestone_name: milestone.milestone_name || 'Achievement Unlocked',
        milestone_description: milestone.milestone_description,
        achieved_date: new Date().toISOString().split('T')[0],
        points_awarded: milestone.points_awarded || 50,
        badge_earned: milestone.badge_earned,
        celebration_message: milestone.celebration_message,
        is_major_milestone: milestone.is_major_milestone || false,
        alex_contribution: milestone.alex_contribution
      }

      const { data, error } = await supabase
        .from('business_milestones')
        .insert(newMilestone)
        .select()
        .single()

      if (!error && data) {
        setCelebrationMode(data)
        if (onMilestoneAchieved) {
          onMilestoneAchieved(data)
        }
        
        // Reload progress
        await loadUserProgress()
        
        // Auto-hide celebration after 5 seconds
        setTimeout(() => {
          setCelebrationMode(null)
        }, 5000)
      }

    } catch (error) {
      console.error('Error creating milestone:', error)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'revenue': return <DollarSign className="w-4 h-4" />
      case 'customers': return <Users className="w-4 h-4" />
      case 'strategy': return <Target className="w-4 h-4" />
      case 'learning': return <Medal className="w-4 h-4" />
      case 'consistency': return <Flame className="w-4 h-4" />
      default: return <Star className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'revenue': return 'bg-green-100 text-green-800 border-green-200'
      case 'customers': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'strategy': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'learning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'consistency': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getProgressToNextLevel = () => {
    const currentLevelMin = (userProgress.currentLevel - 1) * 100
    const progressInCurrentLevel = userProgress.totalPoints - currentLevelMin
    return (progressInCurrentLevel / 100) * 100
  }

  if (loading) {
    return (
      <div className="p-6 animate-pulse">
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Celebration Modal */}
      {celebrationMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md mx-4 text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">🎉 Milestone Achieved!</CardTitle>
              <CardDescription>{celebrationMode.milestone_name}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{celebrationMode.celebration_message}</p>
              <div className="flex justify-center space-x-2 mb-4">
                <Badge variant="default">+{celebrationMode.points_awarded} points</Badge>
                {celebrationMode.badge_earned && (
                  <Badge variant="outline">{celebrationMode.badge_earned}</Badge>
                )}
              </div>
              <Button onClick={() => setCelebrationMode(null)}>
                <Sparkles className="w-4 h-4 mr-2" />
                Awesome!
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* User Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-yellow-600" />
                <span>Level {userProgress.currentLevel}</span>
              </CardTitle>
              <CardDescription>
                {userProgress.totalPoints} total points • {userProgress.streak} day streak
              </CardDescription>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold">{userProgress.totalPoints}</div>
              <div className="text-sm text-gray-600">points</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Level {userProgress.currentLevel + 1}</span>
              <span>{userProgress.nextLevelPoints - userProgress.totalPoints} points needed</span>
            </div>
            <Progress value={getProgressToNextLevel()} className="w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="achievements" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="milestones">Recent Milestones</TabsTrigger>
          <TabsTrigger value="leaderboard">Progress Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <Card 
                key={achievement.id}
                className={`border-2 ${
                  achievement.unlocked 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-gray-50 opacity-75'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${
                      achievement.unlocked ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {achievement.unlocked ? achievement.icon : <Lock className="w-6 h-6 text-gray-400" />}
                    </div>
                    
                    <Badge variant="outline" className={getCategoryColor(achievement.category)}>
                      {getCategoryIcon(achievement.category)}
                      <span className="ml-1">{achievement.category}</span>
                    </Badge>
                  </div>
                  
                  <div>
                    <CardTitle className="text-lg">{achievement.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {achievement.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {achievement.unlocked ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                      )}
                      <span className="text-sm font-medium">
                        +{achievement.points} points
                      </span>
                    </div>
                    
                    {achievement.unlocked && (
                      <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                        {achievement.badge}
                      </Badge>
                    )}
                  </div>

                  {/* Progress bar for partially complete achievements */}
                  {!achievement.unlocked && achievement.progress !== undefined && achievement.maxProgress && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                      </div>
                      <Progress 
                        value={(achievement.progress / achievement.maxProgress) * 100} 
                        className="h-2"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Milestones</CardTitle>
              <CardDescription>Your latest business achievements</CardDescription>
            </CardHeader>
            <CardContent>
              {userProgress.recentMilestones.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No milestones achieved yet. Keep implementing Alex's strategies!</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => triggerMilestone({
                      milestone_type: 'demo',
                      milestone_name: 'First Steps',
                      milestone_description: 'Started your journey with Alex Hormozi AI',
                      points_awarded: 25,
                      badge_earned: 'Getting Started',
                      celebration_message: 'Welcome to your business growth journey! Every expert was once a beginner.',
                      alex_contribution: 'Introduced to Alex Hormozi frameworks and methodologies'
                    })}
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    Claim Your First Milestone
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userProgress.recentMilestones.slice(0, 10).map((milestone) => (
                    <div key={milestone.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Trophy className="w-5 h-5 text-yellow-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{milestone.milestone_name}</h4>
                          <Badge variant="outline">
                            +{milestone.points_awarded} pts
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 text-sm mt-1">
                          {milestone.milestone_description}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {new Date(milestone.achieved_date).toLocaleDateString()}
                          </span>
                          
                          {milestone.badge_earned && (
                            <Badge variant="outline" className="bg-yellow-50">
                              {milestone.badge_earned}
                            </Badge>
                          )}
                        </div>

                        {milestone.alex_contribution && (
                          <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                            <strong>Alex's Impact:</strong> {milestone.alex_contribution}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{userProgress.currentLevel}</CardTitle>
                <CardDescription>Current Level</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Progress value={getProgressToNextLevel()} className="mb-2" />
                <p className="text-xs text-gray-600">
                  {userProgress.nextLevelPoints - userProgress.totalPoints} points to next level
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{userProgress.completedAchievements.length}</CardTitle>
                <CardDescription>Achievements Unlocked</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Progress 
                  value={(userProgress.completedAchievements.length / achievements.length) * 100} 
                  className="mb-2" 
                />
                <p className="text-xs text-gray-600">
                  {achievements.length - userProgress.completedAchievements.length} remaining
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl flex items-center justify-center">
                  <Flame className="w-6 h-6 text-orange-500 mr-2" />
                  {userProgress.streak}
                </CardTitle>
                <CardDescription>Day Streak</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-xs text-gray-600">
                  {userProgress.streak === 0 ? 'Start your streak today!' :
                   userProgress.streak < 7 ? 'Keep it up!' :
                   userProgress.streak < 30 ? 'You\'re on fire!' :
                   'Legendary consistency!'
                  }
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Achievement Categories</CardTitle>
              <CardDescription>Your progress across different areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['revenue', 'customers', 'strategy', 'learning', 'consistency'].map(category => {
                  const categoryAchievements = achievements.filter(a => a.category === category)
                  const unlockedInCategory = categoryAchievements.filter(a => a.unlocked).length
                  const progress = categoryAchievements.length > 0 ? (unlockedInCategory / categoryAchievements.length) * 100 : 0
                  
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded ${getCategoryColor(category)}`}>
                          {getCategoryIcon(category)}
                        </div>
                        <div>
                          <div className="font-medium capitalize">{category}</div>
                          <div className="text-sm text-gray-600">
                            {unlockedInCategory}/{categoryAchievements.length} completed
                          </div>
                        </div>
                      </div>
                      <div className="w-24">
                        <Progress value={progress} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}