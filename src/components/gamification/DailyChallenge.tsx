'use client';

import React, { useState, useEffect } from 'react';
import { 
  DailyChallenge, 
  UserChallengeContext, 
  useDailyChallengeGenerator,
  LocalChallengeTracker,
  ChallengeProof 
} from '@/services/challenges/dailyChallengeGenerator';
import { useFeatureFlag } from '@/contexts/FeatureFlagContext';
import { 
  Target, 
  Clock, 
  Award, 
  CheckCircle, 
  Lightbulb, 
  Zap,
  Star,
  Trophy,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

interface DailyChallengeProps {
  userContext: UserChallengeContext;
  yesterdayRevenue?: number;
  className?: string;
}

export function DailyChallengeCard({ userContext, yesterdayRevenue, className = '' }: DailyChallengeProps) {
  const isEnabled = useFeatureFlag('DAILY_CHALLENGES');
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showHints, setShowHints] = useState(false);
  const [completionProof, setCompletionProof] = useState<string>('');
  const [isCompleting, setIsCompleting] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  
  const { generateDaily, generateBeatYesterday } = useDailyChallengeGenerator(userContext);
  const tracker = new LocalChallengeTracker();

  // Feature flag fallback
  if (!isEnabled) {
    return null; // Graceful degradation - just don't show anything
  }

  useEffect(() => {
    generateTodaysChallenge();
    loadUserStats();
  }, [userContext.userId]);

  const generateTodaysChallenge = async () => {
    setIsLoading(true);
    try {
      // Check if we already have today's challenge
      const today = new Date().toDateString();
      const savedChallenge = localStorage.getItem(`challenge_${today}_${userContext.userId}`);
      
      if (savedChallenge) {
        setChallenge(JSON.parse(savedChallenge));
      } else {
        // Generate new challenge
        let newChallenge: DailyChallenge;
        
        // If we have yesterday's revenue and it's a good candidate for beat-yesterday
        if (yesterdayRevenue && yesterdayRevenue > 0 && Math.random() < 0.4) {
          newChallenge = generateBeatYesterday(yesterdayRevenue);
        } else {
          newChallenge = generateDaily();
        }
        
        // Save today's challenge
        localStorage.setItem(`challenge_${today}_${userContext.userId}`, JSON.stringify(newChallenge));
        setChallenge(newChallenge);
      }
    } catch (error) {
      console.error('Failed to generate challenge:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserStats = async () => {
    try {
      const [streak, xp] = await Promise.all([
        tracker.getCurrentStreak(userContext.userId),
        tracker.getXpTotal(userContext.userId)
      ]);
      setCurrentStreak(streak);
      setTotalXp(xp);
    } catch (error) {
      console.error('Failed to load user stats:', error);
    }
  };

  const completeChallenge = async () => {
    if (!challenge || isCompleting) return;
    
    setIsCompleting(true);
    try {
      const proof: ChallengeProof = {
        type: 'text',
        value: completionProof,
        timestamp: new Date(),
        verified: false // In a real app, this might require verification
      };
      
      await tracker.completeChallenge(challenge.id, proof);
      
      // Update challenge state
      const completedChallenge = { 
        ...challenge, 
        completed: true, 
        completedAt: new Date(),
        proof 
      };
      setChallenge(completedChallenge);
      
      // Update local storage
      const today = new Date().toDateString();
      localStorage.setItem(`challenge_${today}_${userContext.userId}`, JSON.stringify(completedChallenge));
      
      // Update user stats
      await loadUserStats();
      
      // Clear completion proof
      setCompletionProof('');
      
    } catch (error) {
      console.error('Failed to complete challenge:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'from-green-500 to-emerald-500';
      case 'medium': return 'from-yellow-500 to-orange-500';
      case 'hard': return 'from-red-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'revenue': return <Target className="h-5 w-5" />;
      case 'framework': return <Zap className="h-5 w-5" />;
      case 'habit': return <Clock className="h-5 w-5" />;
      case 'constraint': return <Award className="h-5 w-5" />;
      case 'team': return <Trophy className="h-5 w-5" />;
      case 'learning': return <Lightbulb className="h-5 w-5" />;
      default: return <Target className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 bg-white/20 rounded w-1/3"></div>
            <div className="h-8 bg-white/20 rounded w-16"></div>
          </div>
          <div className="h-4 bg-white/20 rounded w-2/3"></div>
          <div className="h-10 bg-white/20 rounded"></div>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center ${className}`}>
        <Target className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-400">No challenge available today.</p>
        <button
          onClick={generateTodaysChallenge}
          className="mt-3 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Generate Challenge
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-lg rounded-xl border border-purple-400/20 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`bg-gradient-to-r ${getDifficultyColor(challenge.difficulty)} p-2 rounded-lg text-white`}>
              {getTypeIcon(challenge.type)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{challenge.title}</h3>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <span className="capitalize">{challenge.difficulty} • {challenge.timeRequired}</span>
                <span className="flex items-center space-x-1">
                  <Star className="h-3 w-3 text-yellow-400" />
                  <span>{challenge.xpReward} XP</span>
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            {challenge.completed ? (
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">Completed!</span>
              </div>
            ) : (
              <div className="text-purple-300 text-sm">
                <div>Deadline: {new Date(challenge.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            )}
          </div>
        </div>
        
        <p className="text-gray-300 mb-3">{challenge.description}</p>
        
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <div className="text-sm text-purple-300 font-medium mb-1">Success Criteria:</div>
          <div className="text-white">{challenge.success_criteria}</div>
        </div>
      </div>

      {/* Framework Badge */}
      <div className="px-6 py-3 bg-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium text-white">Framework: {challenge.framework}</span>
          </div>
          <div className="text-xs text-gray-400 uppercase tracking-wide">
            {challenge.type} Challenge
          </div>
        </div>
      </div>

      {/* Hints Section */}
      {!challenge.completed && (
        <div className="px-6 py-4 border-b border-white/10">
          <button
            onClick={() => setShowHints(!showHints)}
            className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <Lightbulb className="h-4 w-4" />
            <span className="text-sm font-medium">
              {showHints ? 'Hide Hints' : 'Show Hints'}
            </span>
          </button>
          
          {showHints && (
            <div className="mt-3 space-y-2">
              {challenge.hints.map((hint, index) => (
                <div key={index} className="flex items-start space-x-2 text-sm text-gray-300">
                  <span className="text-purple-400 font-bold">{index + 1}.</span>
                  <span>{hint}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Completion Section */}
      <div className="p-6">
        {challenge.completed ? (
          <div className="text-center space-y-3">
            <div className="bg-green-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
              <Trophy className="h-8 w-8 text-green-400" />
            </div>
            <div>
              <div className="text-green-300 font-semibold">Challenge Complete!</div>
              <div className="text-sm text-gray-400">
                Completed at {challenge.completedAt?.toLocaleTimeString()}
              </div>
              {challenge.proof && (
                <div className="text-xs text-gray-500 mt-1">
                  Proof: {challenge.proof.value}
                </div>
              )}
            </div>
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-3">
              <div className="text-white font-semibold">+{challenge.xpReward} XP Earned!</div>
              <div className="text-sm text-gray-300">Total XP: {totalXp + challenge.xpReward}</div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Mark as Complete (Optional: Add proof or notes)
              </label>
              <textarea
                value={completionProof}
                onChange={(e) => setCompletionProof(e.target.value)}
                placeholder="e.g., 'Generated $150 in revenue today' or 'Completed offer analysis document'"
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:border-purple-400"
                rows={2}
              />
            </div>
            
            <button
              onClick={completeChallenge}
              disabled={isCompleting}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center space-x-2"
            >
              {isCompleting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Complete Challenge</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Related Resources */}
      {challenge.relatedResources.length > 0 && (
        <div className="px-6 pb-6">
          <div className="text-sm font-medium text-white mb-2">Related Resources:</div>
          <div className="flex flex-wrap gap-2">
            {challenge.relatedResources.map((resource, index) => (
              <a
                key={index}
                href={resource}
                className="text-xs bg-white/10 hover:bg-white/20 text-purple-300 hover:text-purple-200 px-2 py-1 rounded-full transition-colors flex items-center space-x-1"
              >
                <ArrowRight className="h-3 w-3" />
                <span>{resource.replace('/', '').replace('-', ' ')}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Streak and XP Display Component
interface StreakDisplayProps {
  streak: number;
  totalXp: number;
  className?: string;
}

export function StreakDisplay({ streak, totalXp, className = '' }: StreakDisplayProps) {
  const getStreakIcon = () => {
    if (streak >= 30) return '🏆';
    if (streak >= 14) return '⚡';
    if (streak >= 7) return '🔥';
    if (streak >= 3) return '✨';
    return '💫';
  };

  const getStreakMessage = () => {
    if (streak >= 30) return 'Legendary Streak!';
    if (streak >= 14) return 'On Fire!';
    if (streak >= 7) return 'Great Momentum!';
    if (streak >= 3) return 'Building Habits!';
    if (streak >= 1) return 'Getting Started!';
    return 'Start Your Journey!';
  };

  return (
    <div className={`bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg p-4 border border-orange-400/20 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="text-3xl">{getStreakIcon()}</div>
        <div>
          <div className="text-white font-semibold">
            {streak} Day Streak
          </div>
          <div className="text-orange-300 text-sm">{getStreakMessage()}</div>
          <div className="text-xs text-gray-400 mt-1">
            Total XP: {totalXp.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}

// Combined component for easy usage
interface DailyChallengeSystemProps {
  userContext: UserChallengeContext;
  yesterdayRevenue?: number;
  className?: string;
}

export function DailyChallengeSystem({ userContext, yesterdayRevenue, className = '' }: DailyChallengeSystemProps) {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  
  const tracker = new LocalChallengeTracker();

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [streak, xp] = await Promise.all([
          tracker.getCurrentStreak(userContext.userId),
          tracker.getXpTotal(userContext.userId)
        ]);
        setCurrentStreak(streak);
        setTotalXp(xp);
      } catch (error) {
        console.error('Failed to load stats:', error);
      }
    };

    loadStats();
  }, [userContext.userId]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Streak Display */}
      <StreakDisplay streak={currentStreak} totalXp={totalXp} />
      
      {/* Daily Challenge */}
      <DailyChallengeCard 
        userContext={userContext} 
        yesterdayRevenue={yesterdayRevenue}
      />
    </div>
  );
}