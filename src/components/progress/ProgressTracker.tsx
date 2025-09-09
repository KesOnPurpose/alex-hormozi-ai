'use client';

import React, { useState, useEffect } from 'react';
import { 
  Target, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Calendar,
  Star,
  Flame,
  Trophy,
  ChevronRight,
  Plus,
  Edit3,
  BarChart3
} from 'lucide-react';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  category: 'assessment' | 'revenue' | 'constraint' | 'implementation' | 'engagement';
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  deadline?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
  framework: string;
  createdDate: string;
  completedDate?: string;
  linkedAgent?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  timeframe: '30' | '60' | '90'; // days
  category: 'revenue' | 'customers' | 'conversion' | 'efficiency';
  createdDate: string;
  deadline: string;
  status: 'active' | 'completed' | 'paused';
  milestones: string[]; // milestone IDs
}

export interface ProgressStats {
  currentStreak: number;
  longestStreak: number;
  totalMilestones: number;
  completedMilestones: number;
  businessLevel: 'Beginner' | 'Growing' | 'Scaling' | 'Optimizing' | 'Master';
  experiencePoints: number;
  nextLevelXP: number;
}

interface ProgressTrackerProps {
  onMilestoneComplete: (milestoneId: string) => void;
  onGoalCreate: (goal: Omit<Goal, 'id' | 'createdDate'>) => void;
}

export function ProgressTracker({ onMilestoneComplete, onGoalCreate }: ProgressTrackerProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [progressStats, setProgressStats] = useState<ProgressStats | null>(null);
  const [activeView, setActiveView] = useState<'overview' | 'milestones' | 'goals' | 'achievements'>('overview');
  const [showGoalCreator, setShowGoalCreator] = useState(false);

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = () => {
    // Load or generate milestone data
    const mockMilestones: Milestone[] = [
      {
        id: '1',
        title: 'Complete Business Assessment',
        description: 'Finish the comprehensive 6-step business assessment to identify your constraints',
        category: 'assessment',
        priority: 'high',
        status: 'completed',
        framework: 'Business Foundation',
        createdDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        completedDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        title: 'Increase Monthly Revenue by $10,000',
        description: 'Apply Grand Slam Offer framework to boost revenue',
        category: 'revenue',
        targetValue: 45000,
        currentValue: 38500,
        unit: 'USD',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'high',
        status: 'in_progress',
        framework: 'Grand Slam Offer',
        createdDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        linkedAgent: 'offer-analyzer'
      },
      {
        id: '3',
        title: 'Fix Lead Conversion Constraint',
        description: 'Implement sales optimization strategies to improve conversion rate from 2% to 5%',
        category: 'constraint',
        targetValue: 5,
        currentValue: 3.2,
        unit: '%',
        deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'high',
        status: 'in_progress',
        framework: '4 Universal Constraints',
        createdDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        linkedAgent: 'constraint-analyzer'
      },
      {
        id: '4',
        title: 'Build 4-Prong Money Model',
        description: 'Design and implement upsell, downsell, and continuity offers',
        category: 'implementation',
        priority: 'medium',
        status: 'not_started',
        framework: '4-Prong Money Model',
        createdDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        linkedAgent: 'money-model-architect'
      },
      {
        id: '5',
        title: 'Maintain 7-Day Engagement Streak',
        description: 'Use the platform daily for one week to build momentum',
        category: 'engagement',
        targetValue: 7,
        currentValue: 4,
        unit: 'days',
        priority: 'low',
        status: 'in_progress',
        framework: 'Consistency Framework',
        createdDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    const mockGoals: Goal[] = [
      {
        id: '1',
        title: 'Double Monthly Revenue',
        description: 'Grow from $35K to $70K monthly using Alex Hormozi frameworks',
        targetValue: 70000,
        currentValue: 38500,
        unit: 'USD',
        timeframe: '90',
        category: 'revenue',
        createdDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        deadline: new Date(Date.now() + 83 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        milestones: ['2', '3', '4']
      }
    ];

    const mockProgressStats: ProgressStats = {
      currentStreak: 4,
      longestStreak: 12,
      totalMilestones: 5,
      completedMilestones: 1,
      businessLevel: 'Growing',
      experiencePoints: 1250,
      nextLevelXP: 2000
    };

    setMilestones(mockMilestones);
    setGoals(mockGoals);
    setProgressStats(mockProgressStats);
  };

  const completeMilestone = (milestoneId: string) => {
    setMilestones(prev => prev.map(milestone => 
      milestone.id === milestoneId 
        ? { ...milestone, status: 'completed', completedDate: new Date().toISOString() }
        : milestone
    ));
    onMilestoneComplete(milestoneId);
  };

  const getStatusColor = (status: Milestone['status']) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'in_progress': return 'text-blue-400 bg-blue-400/20 border-blue-400/30';
      case 'overdue': return 'text-red-400 bg-red-400/20 border-red-400/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  const getPriorityColor = (priority: Milestone['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getBusinessLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'text-gray-400 bg-gray-400/20';
      case 'Growing': return 'text-blue-400 bg-blue-400/20';
      case 'Scaling': return 'text-purple-400 bg-purple-400/20';
      case 'Optimizing': return 'text-yellow-400 bg-yellow-400/20';
      case 'Master': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  if (!progressStats) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl p-6 border border-purple-400/30">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Your Business Transformation</h2>
            <p className="text-purple-300">Track your journey with Alex Hormozi's proven frameworks</p>
          </div>
          <div className={`px-4 py-2 rounded-full border ${getBusinessLevelColor(progressStats.businessLevel)}`}>
            <div className="flex items-center space-x-2">
              <Trophy className="h-4 w-4" />
              <span className="font-semibold">{progressStats.businessLevel}</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Flame className="h-5 w-5 text-orange-400" />
              <span className="text-2xl font-bold text-white">{progressStats.currentStreak}</span>
            </div>
            <div className="text-sm text-gray-400">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <span className="text-2xl font-bold text-white">{progressStats.completedMilestones}</span>
            </div>
            <div className="text-sm text-gray-400">Milestones Complete</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="text-2xl font-bold text-white">{progressStats.experiencePoints}</span>
            </div>
            <div className="text-sm text-gray-400">Experience Points</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-purple-400" />
              <span className="text-2xl font-bold text-white">{((progressStats.experiencePoints / progressStats.nextLevelXP) * 100).toFixed(0)}%</span>
            </div>
            <div className="text-sm text-gray-400">To Next Level</div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>{progressStats.businessLevel}</span>
            <span>{progressStats.experiencePoints} / {progressStats.nextLevelXP} XP</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(progressStats.experiencePoints / progressStats.nextLevelXP) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white/10 rounded-xl p-1 flex space-x-1">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'milestones', label: 'Milestones', icon: Target },
          { id: 'goals', label: 'Goals', icon: Calendar },
          { id: 'achievements', label: 'Achievements', icon: Trophy }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors flex-1 justify-center ${
              activeView === tab.id 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeView === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Active Goals */}
          <div className="bg-white/10 rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-400" />
              Active Goals
            </h3>
            <div className="space-y-4">
              {goals.filter(g => g.status === 'active').map(goal => (
                <div key={goal.id} className="bg-white/5 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-white">{goal.title}</h4>
                    <span className="text-xs text-gray-400">{goal.timeframe} days</span>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white">
                        {goal.currentValue.toLocaleString()} / {goal.targetValue.toLocaleString()} {goal.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${calculateProgress(goal.currentValue, goal.targetValue)}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Urgent Milestones */}
          <div className="bg-white/10 rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-red-400" />
              Priority Milestones
            </h3>
            <div className="space-y-3">
              {milestones
                .filter(m => m.status !== 'completed' && m.priority === 'high')
                .slice(0, 3)
                .map(milestone => (
                <div key={milestone.id} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-white text-sm">{milestone.title}</h4>
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(milestone.priority)}`} />
                  </div>
                  <p className="text-xs text-gray-400 mb-3">{milestone.description}</p>
                  {milestone.targetValue && (
                    <div className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white">
                          {milestone.currentValue} / {milestone.targetValue} {milestone.unit}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1">
                        <div 
                          className="bg-blue-600 h-1 rounded-full"
                          style={{ width: `${calculateProgress(milestone.currentValue || 0, milestone.targetValue)}%` }}
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-purple-400">{milestone.framework}</span>
                    {milestone.status !== 'completed' && (
                      <button
                        onClick={() => completeMilestone(milestone.id)}
                        className="text-xs text-green-400 hover:text-green-300"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeView === 'milestones' && (
        <div className="bg-white/10 rounded-xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">All Milestones</h3>
            <div className="text-sm text-gray-400">
              {progressStats.completedMilestones} of {progressStats.totalMilestones} completed
            </div>
          </div>
          <div className="space-y-4">
            {milestones.map(milestone => (
              <MilestoneCard 
                key={milestone.id} 
                milestone={milestone} 
                onComplete={() => completeMilestone(milestone.id)}
              />
            ))}
          </div>
        </div>
      )}

      {activeView === 'goals' && (
        <div className="bg-white/10 rounded-xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">Business Goals</h3>
            <button 
              onClick={() => setShowGoalCreator(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>New Goal</span>
            </button>
          </div>
          <div className="space-y-6">
            {goals.map(goal => (
              <GoalCard key={goal.id} goal={goal} milestones={milestones} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MilestoneCard({ milestone, onComplete }: { milestone: Milestone; onComplete: () => void }) {
  const getStatusColor = (status: Milestone['status']) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'in_progress': return 'text-blue-400 bg-blue-400/20 border-blue-400/30';
      case 'overdue': return 'text-red-400 bg-red-400/20 border-red-400/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  return (
    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h4 className="font-medium text-white">{milestone.title}</h4>
            <div className={`px-2 py-1 rounded text-xs ${getStatusColor(milestone.status)}`}>
              {milestone.status.replace('_', ' ').toUpperCase()}
            </div>
          </div>
          <p className="text-sm text-gray-400 mb-3">{milestone.description}</p>
        </div>
        {milestone.status === 'completed' && (
          <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
        )}
      </div>

      {milestone.targetValue && (
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Progress</span>
            <span className="text-white">
              {milestone.currentValue || 0} / {milestone.targetValue} {milestone.unit}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((milestone.currentValue || 0) / milestone.targetValue) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4 text-xs text-gray-400">
          <span className="text-purple-400">{milestone.framework}</span>
          {milestone.deadline && (
            <span className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {new Date(milestone.deadline).toLocaleDateString()}
            </span>
          )}
        </div>
        {milestone.status !== 'completed' && (
          <button
            onClick={onComplete}
            className="text-sm text-green-400 hover:text-green-300 flex items-center space-x-1"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Complete</span>
          </button>
        )}
      </div>
    </div>
  );
}

function GoalCard({ goal, milestones }: { goal: Goal; milestones: Milestone[] }) {
  const progress = (goal.currentValue / goal.targetValue) * 100;
  const linkedMilestones = milestones.filter(m => goal.milestones.includes(m.id));
  const completedMilestones = linkedMilestones.filter(m => m.status === 'completed').length;

  return (
    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-semibold text-white mb-1">{goal.title}</h4>
          <p className="text-sm text-gray-400">{goal.description}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">{goal.timeframe} days</div>
          <div className="text-xs text-gray-500">
            {Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} remaining
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Progress</span>
          <span className="text-white">
            {goal.currentValue.toLocaleString()} / {goal.targetValue.toLocaleString()} {goal.unit}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-green-600 to-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="text-right text-sm text-gray-400 mt-1">{progress.toFixed(1)}% complete</div>
      </div>

      {linkedMilestones.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h5 className="text-sm font-medium text-white">Related Milestones</h5>
            <span className="text-xs text-gray-400">{completedMilestones} / {linkedMilestones.length}</span>
          </div>
          <div className="space-y-2">
            {linkedMilestones.map(milestone => (
              <div key={milestone.id} className="flex items-center justify-between p-2 bg-white/5 rounded">
                <div className="flex items-center space-x-2">
                  {milestone.status === 'completed' ? (
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                  ) : (
                    <div className="h-4 w-4 border border-gray-400 rounded-full" />
                  )}
                  <span className="text-sm text-gray-300">{milestone.title}</span>
                </div>
                <span className="text-xs text-purple-400">{milestone.framework}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}