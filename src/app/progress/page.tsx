'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ProgressTracker, Goal, Milestone } from '@/components/progress/ProgressTracker';
import { 
  ArrowLeft, 
  TrendingUp, 
  Target, 
  Calendar,
  Trophy,
  Zap,
  CheckCircle2
} from 'lucide-react';

export default function ProgressPage() {
  const [showCelebration, setShowCelebration] = useState(false);

  const handleMilestoneComplete = (milestoneId: string) => {
    // Show celebration animation
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
    
    // Update user stats, award XP, check for level up
    console.log(`Milestone ${milestoneId} completed!`);
    
    // TODO: Send to backend to update progress
    // TODO: Check if this completion unlocks new milestones or achievements
    // TODO: Calculate XP reward based on milestone difficulty and category
  };

  const handleGoalCreate = (goalData: Omit<Goal, 'id' | 'createdDate'>) => {
    console.log('Creating new goal:', goalData);
    // TODO: Send to backend to create goal and generate related milestones
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl p-8 border border-purple-400/30 text-center animate-pulse">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-2">Milestone Completed!</h2>
            <p className="text-purple-300">+50 XP • Keep up the momentum!</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/profile" 
            className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Progress Tracking</h1>
              <p className="text-gray-300">Monitor your business transformation journey</p>
            </div>
            
            {/* Quick Stats */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span className="text-lg font-bold text-white">1</span>
                </div>
                <div className="text-xs text-gray-400">Completed</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Target className="h-4 w-4 text-blue-400" />
                  <span className="text-lg font-bold text-white">4</span>
                </div>
                <div className="text-xs text-gray-400">In Progress</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span className="text-lg font-bold text-white">1250</span>
                </div>
                <div className="text-xs text-gray-400">Total XP</div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Framework Explanation */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 mb-8">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-lg p-4 mb-3">
                <Target className="h-6 w-6 text-purple-400 mx-auto" />
              </div>
              <h3 className="font-semibold text-white mb-1">Milestones</h3>
              <p className="text-xs text-gray-400">Specific, measurable achievements based on Alex Hormozi's frameworks</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600/20 rounded-lg p-4 mb-3">
                <Calendar className="h-6 w-6 text-blue-400 mx-auto" />
              </div>
              <h3 className="font-semibold text-white mb-1">Goals</h3>
              <p className="text-xs text-gray-400">30/60/90-day objectives with milestone breakdowns</p>
            </div>
            <div className="text-center">
              <div className="bg-green-600/20 rounded-lg p-4 mb-3">
                <TrendingUp className="h-6 w-6 text-green-400 mx-auto" />
              </div>
              <h3 className="font-semibold text-white mb-1">Progress</h3>
              <p className="text-xs text-gray-400">Real-time tracking with visual feedback and insights</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-600/20 rounded-lg p-4 mb-3">
                <Trophy className="h-6 w-6 text-yellow-400 mx-auto" />
              </div>
              <h3 className="font-semibold text-white mb-1">Rewards</h3>
              <p className="text-xs text-gray-400">XP system with business level progression and achievements</p>
            </div>
          </div>
        </div>

        {/* Main Progress Tracker */}
        <ProgressTracker 
          onMilestoneComplete={handleMilestoneComplete}
          onGoalCreate={handleGoalCreate}
        />

        {/* Framework Integration */}
        <div className="mt-8 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-xl p-6 border border-purple-400/20">
          <h3 className="text-lg font-semibold text-white mb-4">🎯 Alex Hormozi Framework Integration</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">4 Universal Constraints</h4>
              <p className="text-xs text-gray-400">Milestones automatically created for leads, conversion, fulfillment, and profit constraints</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">Grand Slam Offers</h4>
              <p className="text-xs text-gray-400">Track value equation improvements and offer performance metrics</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">4-Prong Money Model</h4>
              <p className="text-xs text-gray-400">Monitor implementation of upsells, downsells, and continuity systems</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">CFA Systems</h4>
              <p className="text-xs text-gray-400">Track customer acquisition cost optimization and payback periods</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Link 
            href="/agents" 
            className="bg-white/10 hover:bg-white/20 rounded-xl p-6 transition-colors border border-white/10"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-purple-600 rounded-lg p-2">
                <Target className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-semibold text-white">Work with Agents</h4>
            </div>
            <p className="text-sm text-gray-400">Get personalized recommendations to unlock new milestones</p>
          </Link>
          
          <Link 
            href="/upload" 
            className="bg-white/10 hover:bg-white/20 rounded-xl p-6 transition-colors border border-white/10"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-blue-600 rounded-lg p-2">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-semibold text-white">Upload Business Data</h4>
            </div>
            <p className="text-sm text-gray-400">Analyze documents to automatically track progress metrics</p>
          </Link>
          
          <Link 
            href="/profile?tab=achievements" 
            className="bg-white/10 hover:bg-white/20 rounded-xl p-6 transition-colors border border-white/10"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-yellow-600 rounded-lg p-2">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-semibold text-white">View Achievements</h4>
            </div>
            <p className="text-sm text-gray-400">See all your earned badges and business level progression</p>
          </Link>
        </div>
      </div>
    </div>
  );
}