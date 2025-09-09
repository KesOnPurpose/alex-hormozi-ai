'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  FeatureFlag, 
  FeatureFlagId, 
  FEATURE_FLAGS, 
  getEnvironmentOverrides, 
  BusinessTier,
  getBusinessTier,
  BETA_USERS 
} from '@/config/featureFlags';

interface User {
  id: string;
  email?: string;
  monthlyRevenue?: number;
  businessTier?: BusinessTier;
  isBetaUser?: boolean;
}

interface FeatureFlagContextType {
  // Core functionality
  isEnabled: (flagId: FeatureFlagId) => boolean;
  getFlag: (flagId: FeatureFlagId) => FeatureFlag | null;
  
  // User context
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Admin controls
  enableFlag: (flagId: FeatureFlagId) => void;
  disableFlag: (flagId: FeatureFlagId) => void;
  setRolloutPercentage: (flagId: FeatureFlagId, percentage: number) => void;
  
  // Emergency controls
  killAllFeatures: () => void;
  killFlag: (flagId: FeatureFlagId) => void;
  
  // Debugging
  getActiveFlags: () => FeatureFlagId[];
  getAllFlags: () => Record<FeatureFlagId, FeatureFlag>;
  
  // A/B Testing
  getExperimentVariant: (experimentId: string) => 'control' | 'variant';
}

const FeatureFlagContext = createContext<FeatureFlagContextType | null>(null);

interface FeatureFlagProviderProps {
  children: ReactNode;
  initialUser?: User;
}

export function FeatureFlagProvider({ children, initialUser }: FeatureFlagProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser || null);
  const [flags, setFlags] = useState<Record<FeatureFlagId, FeatureFlag>>(FEATURE_FLAGS);

  // Load user context on mount
  useEffect(() => {
    if (!user) {
      // Try to load user from localStorage or authentication
      const savedUser = loadUserFromStorage();
      if (savedUser) {
        setUser(savedUser);
      }
    }
  }, []);

  // Apply environment overrides on mount and when environment changes
  useEffect(() => {
    const overrides = getEnvironmentOverrides();
    if (Object.keys(overrides).length > 0) {
      setFlags(prevFlags => {
        const updatedFlags = { ...prevFlags };
        Object.entries(overrides).forEach(([flagId, override]) => {
          if (updatedFlags[flagId as FeatureFlagId]) {
            updatedFlags[flagId as FeatureFlagId] = {
              ...updatedFlags[flagId as FeatureFlagId],
              ...override
            };
          }
        });
        return updatedFlags;
      });
    }
  }, []);

  // Save flags to localStorage for admin overrides
  useEffect(() => {
    localStorage.setItem('featureFlags', JSON.stringify(flags));
  }, [flags]);

  const loadUserFromStorage = (): User | null => {
    try {
      const savedProfile = localStorage.getItem('businessProfile');
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        
        // Extract revenue from profile
        const revenue = parseRevenueString(profile.monthlyRevenue);
        const tier = getBusinessTier(revenue);
        
        return {
          id: profile.id || 'demo-user',
          email: profile.email,
          monthlyRevenue: revenue,
          businessTier: tier,
          isBetaUser: false // Will be determined by feature flag settings
        };
      }
    } catch (error) {
      console.warn('Failed to load user from storage:', error);
    }
    return null;
  };

  const parseRevenueString = (revenueStr?: string): number => {
    if (!revenueStr) return 0;
    
    // Handle ranges like "10k-50k"
    const ranges: Record<string, number> = {
      '0-1k': 500,
      '1k-10k': 5000,
      '10k-50k': 30000,
      '50k-250k': 150000,
      '250k-1m': 625000,
      '1m+': 1500000
    };
    
    return ranges[revenueStr] || 0;
  };

  const isUserInBetaGroup = (flagId: FeatureFlagId, userId: string): boolean => {
    const flag = flags[flagId];
    return flag.betaUsers.includes(userId) || BETA_USERS[flagId as keyof typeof BETA_USERS]?.includes(userId) || false;
  };

  const isUserInRolloutPercentage = (percentage: number, userId: string): boolean => {
    // Use consistent hash to ensure same user always gets same result
    const hash = simpleHash(userId);
    return (hash % 100) < percentage;
  };

  const isUserTierEnabled = (flag: FeatureFlag, userTier?: BusinessTier): boolean => {
    if (!userTier) return false;
    return flag.enabledTiers.includes('all') || flag.enabledTiers.includes(userTier);
  };

  const checkDependencies = (flag: FeatureFlag): boolean => {
    if (!flag.dependencies || flag.dependencies.length === 0) return true;
    
    return flag.dependencies.every(depId => {
      const dependency = flags[depId as FeatureFlagId];
      return dependency && isEnabled(depId as FeatureFlagId);
    });
  };

  const isEnabled = (flagId: FeatureFlagId): boolean => {
    const flag = flags[flagId];
    if (!flag) return false;

    // Kill switch check
    if (flag.killSwitch) return false;

    // Basic enabled check
    if (!flag.enabled) return false;

    // Dependency check
    if (!checkDependencies(flag)) return false;

    // User context required for further checks
    if (!user) return false;

    // Tier check
    if (!isUserTierEnabled(flag, user.businessTier)) return false;

    // Beta user check (overrides percentage)
    if (isUserInBetaGroup(flagId, user.id)) return true;

    // Rollout percentage check
    if (flag.rolloutPercentage === 0) return false;
    if (flag.rolloutPercentage === 100) return true;

    return isUserInRolloutPercentage(flag.rolloutPercentage, user.id);
  };

  const getFlag = (flagId: FeatureFlagId): FeatureFlag | null => {
    return flags[flagId] || null;
  };

  const enableFlag = (flagId: FeatureFlagId): void => {
    setFlags(prev => ({
      ...prev,
      [flagId]: { ...prev[flagId], enabled: true, killSwitch: false }
    }));
  };

  const disableFlag = (flagId: FeatureFlagId): void => {
    setFlags(prev => ({
      ...prev,
      [flagId]: { ...prev[flagId], enabled: false }
    }));
  };

  const setRolloutPercentage = (flagId: FeatureFlagId, percentage: number): void => {
    const clampedPercentage = Math.max(0, Math.min(100, percentage));
    setFlags(prev => ({
      ...prev,
      [flagId]: { ...prev[flagId], rolloutPercentage: clampedPercentage }
    }));
  };

  const killAllFeatures = (): void => {
    setFlags(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(flagId => {
        updated[flagId as FeatureFlagId] = {
          ...updated[flagId as FeatureFlagId],
          killSwitch: true,
          enabled: false
        };
      });
      return updated;
    });
  };

  const killFlag = (flagId: FeatureFlagId): void => {
    setFlags(prev => ({
      ...prev,
      [flagId]: { ...prev[flagId], killSwitch: true, enabled: false }
    }));
  };

  const getActiveFlags = (): FeatureFlagId[] => {
    return Object.keys(flags).filter(flagId => 
      isEnabled(flagId as FeatureFlagId)
    ) as FeatureFlagId[];
  };

  const getAllFlags = (): Record<FeatureFlagId, FeatureFlag> => {
    return flags;
  };

  const getExperimentVariant = (experimentId: string): 'control' | 'variant' => {
    if (!user) return 'control';
    
    // Consistent assignment based on user ID and experiment ID
    const hash = simpleHash(user.id + experimentId);
    return (hash % 2) === 0 ? 'control' : 'variant';
  };

  const contextValue: FeatureFlagContextType = {
    isEnabled,
    getFlag,
    user,
    setUser,
    enableFlag,
    disableFlag,
    setRolloutPercentage,
    killAllFeatures,
    killFlag,
    getActiveFlags,
    getAllFlags,
    getExperimentVariant
  };

  return (
    <FeatureFlagContext.Provider value={contextValue}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlags(): FeatureFlagContextType {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
  }
  return context;
}

// Utility hook for individual flags
export function useFeatureFlag(flagId: FeatureFlagId): boolean {
  const { isEnabled } = useFeatureFlags();
  return isEnabled(flagId);
}

// Higher-order component for feature flag wrapping
export function withFeatureFlag<P extends object>(
  flagId: FeatureFlagId,
  Component: React.ComponentType<P>,
  FallbackComponent?: React.ComponentType<P>
) {
  return function FeatureGatedComponent(props: P) {
    const isEnabled = useFeatureFlag(flagId);
    
    if (isEnabled) {
      return <Component {...props} />;
    }
    
    if (FallbackComponent) {
      return <FallbackComponent {...props} />;
    }
    
    return null;
  };
}

// Component for conditional rendering
interface FeatureGateProps {
  flag: FeatureFlagId;
  fallback?: ReactNode;
  children: ReactNode;
}

export function FeatureGate({ flag, fallback, children }: FeatureGateProps) {
  const isEnabled = useFeatureFlag(flag);
  
  if (isEnabled) {
    return <>{children}</>;
  }
  
  return <>{fallback || null}</>;
}

// Simple hash function for consistent user assignment
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Debug component for development
export function FeatureFlagDebugPanel() {
  const { getAllFlags, getActiveFlags, user } = useFeatureFlags();
  
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  const allFlags = getAllFlags();
  const activeFlags = getActiveFlags();
  
  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg max-w-sm max-h-96 overflow-auto text-xs">
      <div className="font-bold mb-2">🚩 Feature Flags Debug</div>
      
      <div className="mb-3">
        <div className="font-semibold">User Context:</div>
        <div>ID: {user?.id || 'None'}</div>
        <div>Tier: {user?.businessTier || 'None'}</div>
        <div>Revenue: ${user?.monthlyRevenue || 0}</div>
      </div>
      
      <div className="mb-3">
        <div className="font-semibold text-green-400">Active Flags ({activeFlags.length}):</div>
        {activeFlags.map(flag => (
          <div key={flag} className="text-green-300">• {flag}</div>
        ))}
      </div>
      
      <div>
        <div className="font-semibold text-gray-400">All Flags:</div>
        {Object.entries(allFlags).map(([flagId, flag]) => (
          <div key={flagId} className="flex justify-between">
            <span className={flag.enabled ? 'text-green-300' : 'text-red-300'}>
              {flagId}
            </span>
            <span>{flag.rolloutPercentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}