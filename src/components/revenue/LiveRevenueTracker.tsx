'use client';

import React, { useState, useEffect } from 'react';
import { DailyRevenueMetrics, MoneyVelocityMetrics, useMockRevenueData } from '@/services/mockData/revenueData';
import { useFeatureFlag } from '@/contexts/FeatureFlagContext';
import { DollarSign, TrendingUp, TrendingDown, Target, Zap, Clock, Users, Award } from 'lucide-react';

interface LiveRevenueTrackerProps {
  userTier?: string;
  className?: string;
}

export function LiveRevenueTracker({ userTier = 'level1', className = '' }: LiveRevenueTrackerProps) {
  const isEnabled = useFeatureFlag('LIVE_REVENUE_TRACKER');
  const [todaysMetrics, setTodaysMetrics] = useState<DailyRevenueMetrics | null>(null);
  const [velocityMetrics, setVelocityMetrics] = useState<MoneyVelocityMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  
  const { getTodaysMetrics, getCurrentVelocity, simulateRealTime } = useMockRevenueData(userTier);

  // Feature flag fallback
  if (!isEnabled) {
    return (
      <div className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 ${className}`}>
        <div className="text-center text-gray-400">
          <DollarSign className="h-8 w-8 mx-auto mb-2" />
          <p>Revenue tracking will be available soon!</p>
        </div>
      </div>
    );
  }

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [metrics, velocity] = await Promise.all([
          getTodaysMetrics(),
          getCurrentVelocity()
        ]);
        setTodaysMetrics(metrics);
        setVelocityMetrics(velocity);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Failed to load revenue data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [getTodaysMetrics, getCurrentVelocity]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const newTransaction = await simulateRealTime();
        if (newTransaction) {
          // Refresh data when new transaction comes in
          const [updatedMetrics, updatedVelocity] = await Promise.all([
            getTodaysMetrics(),
            getCurrentVelocity()
          ]);
          setTodaysMetrics(updatedMetrics);
          setVelocityMetrics(updatedVelocity);
          setLastUpdate(new Date());
        }
      } catch (error) {
        console.error('Real-time update failed:', error);
      }
    }, 30000); // Check for updates every 30 seconds

    return () => clearInterval(interval);
  }, [getTodaysMetrics, getCurrentVelocity, simulateRealTime]);

  if (isLoading) {
    return (
      <div className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/20 rounded w-3/4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-white/10 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!todaysMetrics || !velocityMetrics) {
    return (
      <div className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 ${className}`}>
        <div className="text-center text-red-400">
          <p>Failed to load revenue data. Please try again.</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'from-green-500 to-emerald-500';
    if (progress >= 75) return 'from-blue-500 to-cyan-500';
    if (progress >= 50) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getVelocityTrendIcon = () => {
    switch (velocityMetrics.trendDirection) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-400" />;
      default: return <TrendingUp className="h-4 w-4 text-yellow-400" />;
    }
  };

  return (
    <div className={`bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-lg rounded-xl border border-purple-400/20 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Today's Revenue</h2>
              <p className="text-purple-300 text-sm">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold text-white">
              {formatCurrency(todaysMetrics.totalRevenue)}
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                todaysMetrics.goalProgress >= 100 ? 'bg-green-500/20 text-green-300' :
                todaysMetrics.goalProgress >= 75 ? 'bg-blue-500/20 text-blue-300' :
                todaysMetrics.goalProgress >= 50 ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-red-500/20 text-red-300'
              }`}>
                {todaysMetrics.goalProgress.toFixed(1)}% of goal
              </div>
            </div>
          </div>
        </div>

        {/* Daily Goal Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-300">
            <span>Daily Goal: {formatCurrency(todaysMetrics.goalAmount)}</span>
            <span>
              {formatCurrency(todaysMetrics.goalAmount - todaysMetrics.totalRevenue)} remaining
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${getProgressColor(todaysMetrics.goalProgress)} transition-all duration-500 ease-out relative`}
              style={{ width: `${Math.min(100, todaysMetrics.goalProgress)}%` }}
            >
              {todaysMetrics.goalProgress >= 100 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Award className="h-4 w-4 text-white animate-pulse" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Money Velocity */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <Zap className="h-5 w-5 text-yellow-400" />
            {getVelocityTrendIcon()}
          </div>
          <div className="text-lg font-bold text-white">
            {formatCurrency(velocityMetrics.currentVelocity)}/hr
          </div>
          <div className="text-xs text-gray-400">Money Velocity</div>
          <div className="text-xs text-purple-300 mt-1">
            {velocityMetrics.accelerationFactor}x avg
          </div>
        </div>

        {/* Transaction Count */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <Target className="h-5 w-5 text-blue-400" />
            <div className="text-xs text-gray-400">{todaysMetrics.transactionCount}</div>
          </div>
          <div className="text-lg font-bold text-white">
            {formatCurrency(todaysMetrics.averageOrderValue)}
          </div>
          <div className="text-xs text-gray-400">Avg Order Value</div>
          <div className="text-xs text-blue-300 mt-1">
            {todaysMetrics.transactionCount} transactions
          </div>
        </div>

        {/* Time to Goal */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-5 w-5 text-green-400" />
            <div className="text-xs text-gray-400">ETA</div>
          </div>
          <div className="text-lg font-bold text-white">
            {velocityMetrics.timeToGoal > 24 ? '24+' : velocityMetrics.timeToGoal.toFixed(1)}h
          </div>
          <div className="text-xs text-gray-400">Time to Goal</div>
          <div className="text-xs text-green-300 mt-1">
            {velocityMetrics.timeToGoal <= 8 ? 'On track!' : 'Need boost'}
          </div>
        </div>

        {/* Customer Mix */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-5 w-5 text-purple-400" />
            <div className="text-xs text-gray-400">Mix</div>
          </div>
          <div className="text-lg font-bold text-white">
            {todaysMetrics.newCustomers}
          </div>
          <div className="text-xs text-gray-400">New Customers</div>
          <div className="text-xs text-purple-300 mt-1">
            {todaysMetrics.returningCustomers} returning
          </div>
        </div>
      </div>

      {/* Hourly Revenue Chart */}
      <div className="p-6 pt-0">
        <h3 className="text-lg font-semibold text-white mb-3">Hourly Performance</h3>
        <div className="grid grid-cols-12 gap-1 h-20">
          {todaysMetrics.hourlyBreakdown.map((hour) => {
            const maxRevenue = Math.max(...todaysMetrics.hourlyBreakdown.map(h => h.revenue));
            const height = maxRevenue > 0 ? (hour.revenue / maxRevenue) * 100 : 0;
            const currentHour = new Date().getHours();
            const isCurrentHour = hour.hour === currentHour;
            
            return (
              <div key={hour.hour} className="flex flex-col justify-end items-center">
                <div
                  className={`w-full rounded-t transition-all duration-300 ${
                    isCurrentHour ? 'bg-gradient-to-t from-yellow-500 to-yellow-400' :
                    height > 80 ? 'bg-gradient-to-t from-green-500 to-green-400' :
                    height > 50 ? 'bg-gradient-to-t from-blue-500 to-blue-400' :
                    height > 20 ? 'bg-gradient-to-t from-purple-500 to-purple-400' :
                    'bg-gradient-to-t from-gray-600 to-gray-500'
                  }`}
                  style={{ height: `${height}%`, minHeight: height > 0 ? '2px' : '0px' }}
                  title={`${hour.hour}:00 - ${formatCurrency(hour.revenue)}`}
                />
                <div className="text-xs text-gray-400 mt-1">
                  {hour.hour.toString().padStart(2, '0')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Streak Badge */}
      {todaysMetrics.streakDays > 1 && (
        <div className="px-6 pb-6">
          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg p-3 border border-orange-400/20">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-500 rounded-full p-2">
                <Award className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-white font-semibold">
                  🔥 {todaysMetrics.streakDays} Day Streak!
                </div>
                <div className="text-orange-300 text-sm">
                  Keep the momentum going - you're on fire!
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}