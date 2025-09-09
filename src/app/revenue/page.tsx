'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { FeatureFlagProvider, useFeatureFlags, FeatureFlagDebugPanel } from '@/contexts/FeatureFlagContext';
import { LiveRevenueTracker } from '@/components/revenue/LiveRevenueTracker';
import { DailyChallengeSystem } from '@/components/gamification/DailyChallenge';
import { UserChallengeContext } from '@/services/challenges/dailyChallengeGenerator';
import { DailyRevenueMetrics, useMockRevenueData } from '@/services/mockData/revenueData';
import { ArrowLeft, TrendingUp, Target, Zap } from 'lucide-react';

export default function RevenuePage() {
  return (
    <FeatureFlagProvider>
      <RevenuePageContent />
      <FeatureFlagDebugPanel />
    </FeatureFlagProvider>
  );
}

function RevenuePageContent() {
  const { user, setUser } = useFeatureFlags();
  const [yesterdayMetrics, setYesterdayMetrics] = useState<DailyRevenueMetrics | null>(null);
  const [userTier, setUserTier] = useState<string>('level1');
  const [isLoading, setIsLoading] = useState(true);

  const { getHistoricalMetrics } = useMockRevenueData(userTier);

  // Initialize user context if not already set
  useEffect(() => {
    if (!user) {
      // Try to load from localStorage
      const savedProfile = localStorage.getItem('businessProfile');
      if (savedProfile) {
        try {
          const profile = JSON.parse(savedProfile);
          const revenue = parseRevenueString(profile.monthlyRevenue);
          const tier = getBusinessTier(revenue);
          
          setUser({
            id: profile.id || 'demo-user',
            email: profile.email,
            monthlyRevenue: revenue,
            businessTier: tier,
            isBetaUser: false
          });
          setUserTier(tier);
        } catch (error) {
          console.warn('Failed to load user profile:', error);
          // Set default user
          setUser({
            id: 'demo-user',
            businessTier: 'level1'
          });
        }
      } else {
        // Set default user
        setUser({
          id: 'demo-user',
          businessTier: 'level1'
        });
      }
    } else if (user.businessTier) {
      setUserTier(user.businessTier);
    }
  }, [user]); // Remove setUser to prevent infinite loop

  // Load yesterday's metrics for challenge generation
  useEffect(() => {
    const loadYesterdayData = async () => {
      try {
        const historical = await getHistoricalMetrics(2); // Get last 2 days
        if (historical.length >= 2) {
          setYesterdayMetrics(historical[historical.length - 2]); // Yesterday's data
        }
      } catch (error) {
        console.error('Failed to load yesterday metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadYesterdayData();
  }, [getHistoricalMetrics]);

  const parseRevenueString = (revenueStr?: string): number => {
    if (!revenueStr) return 0;
    
    const ranges: Record<string, number> = {
      '0-1k': 500,
      '1k-10k': 5000,
      '10k-50k': 30000,
      '50k-250k': 150000,
      '250k-1m': 625000,
      '1m+': 1500000
    };
    
    return ranges[revenueStr] || 5000;
  };

  const getBusinessTier = (monthlyRevenue: number): string => {
    if (monthlyRevenue === 0) return 'level0';
    if (monthlyRevenue < 10000) return 'level1';
    if (monthlyRevenue < 100000) return 'level2';
    if (monthlyRevenue < 1000000) return 'level3';
    return 'level4';
  };

  // Create user challenge context
  const challengeContext: UserChallengeContext = {
    userId: user?.id || 'demo-user',
    businessTier: (user?.businessTier || 'level1') as any,
    monthlyRevenue: user?.monthlyRevenue || 5000,
    primaryConstraint: 'leads', // This would be determined by assessment
    completedChallenges: [],
    currentStreak: 0,
    preferredDifficulty: 'medium',
    availableTime: 'medium'
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-white/20 rounded w-1/3"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 h-96 bg-white/10 rounded-xl"></div>
              <div className="h-96 bg-white/10 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Revenue Command Center</h1>
              <p className="text-gray-300">
                Real-time revenue tracking with daily challenges to drive growth
              </p>
            </div>
            
            <div className="hidden md:flex items-center space-x-6 text-center">
              <div>
                <TrendingUp className="h-6 w-6 text-green-400 mx-auto mb-1" />
                <div className="text-sm text-gray-400">Live Tracking</div>
              </div>
              <div>
                <Target className="h-6 w-6 text-blue-400 mx-auto mb-1" />
                <div className="text-sm text-gray-400">Daily Goals</div>
              </div>
              <div>
                <Zap className="h-6 w-6 text-yellow-400 mx-auto mb-1" />
                <div className="text-sm text-gray-400">Challenges</div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Status Banner (for development/beta) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 bg-blue-600/20 border border-blue-400/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-blue-300">
              <div className="animate-pulse h-2 w-2 bg-blue-400 rounded-full"></div>
              <span className="font-medium">Beta Feature Active</span>
            </div>
            <p className="text-blue-200 text-sm mt-1">
              You're using the new Revenue Command Center with mock data. 
              This feature is currently in beta testing.
            </p>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Live Revenue Tracker */}
          <div className="lg:col-span-2">
            <LiveRevenueTracker 
              userTier={userTier}
              className="h-full"
            />
          </div>
          
          {/* Daily Challenge System */}
          <div>
            <DailyChallengeSystem 
              userContext={challengeContext}
              yesterdayRevenue={yesterdayMetrics?.totalRevenue}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Link 
            href="/agents/money-model-architect" 
            className="bg-white/10 hover:bg-white/20 rounded-xl p-6 transition-colors border border-white/10 group"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-purple-600 rounded-lg p-2 group-hover:bg-purple-500 transition-colors">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-semibold text-white">Optimize Revenue</h4>
            </div>
            <p className="text-sm text-gray-400">
              Use the Money Model Architect to design better revenue streams and increase your daily velocity.
            </p>
          </Link>
          
          <Link 
            href="/agents/constraint-analyzer" 
            className="bg-white/10 hover:bg-white/20 rounded-xl p-6 transition-colors border border-white/10 group"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-blue-600 rounded-lg p-2 group-hover:bg-blue-500 transition-colors">
                <Target className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-semibold text-white">Find Constraints</h4>
            </div>
            <p className="text-sm text-gray-400">
              Identify what's limiting your revenue growth using the 4 Universal Constraints framework.
            </p>
          </Link>
          
          <Link 
            href="/business-templates" 
            className="bg-white/10 hover:bg-white/20 rounded-xl p-6 transition-colors border border-white/10 group"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-green-600 rounded-lg p-2 group-hover:bg-green-500 transition-colors">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-semibold text-white">Use Templates</h4>
            </div>
            <p className="text-sm text-gray-400">
              Apply proven business templates to systematically increase your revenue potential.
            </p>
          </Link>
        </div>

        {/* Beta Feedback */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3">Beta Feedback</h3>
            <p className="text-gray-300 mb-4">
              Help us improve the Revenue Command Center! Your feedback is valuable.
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-purple-400 font-medium mb-2">What's Working Well:</div>
                <ul className="text-gray-400 space-y-1">
                  <li>• Real-time revenue visualization</li>
                  <li>• Personalized daily challenges</li>
                  <li>• Framework integration</li>
                  <li>• Goal progress tracking</li>
                </ul>
              </div>
              <div>
                <div className="text-yellow-400 font-medium mb-2">Coming Soon:</div>
                <ul className="text-gray-400 space-y-1">
                  <li>• Real payment processor integration</li>
                  <li>• Team collaboration features</li>
                  <li>• Advanced challenge types</li>
                  <li>• Mobile push notifications</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}