// Feature Flag Configuration
// This is the master control for all new features

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number; // 0-100
  betaUsers: string[];
  enabledTiers: BusinessTier[];
  killSwitch: boolean; // Emergency disable
  experimentId?: string; // For A/B testing
  dependencies?: string[]; // Other flags this depends on
}

export type BusinessTier = 'level0' | 'level1' | 'level2' | 'level3' | 'level4' | 'all';

export type FeatureFlagId = 
  // Phase 1 - Foundation
  | 'LIVE_REVENUE_TRACKER'
  | 'DAILY_CHALLENGES'
  | 'STREAK_TRACKING'
  
  // Phase 2 - Intelligence  
  | 'ADAPTIVE_AGENTS'
  | 'ROLE_DETECTION'
  | 'TIME_BASED_SWITCHING'
  
  // Phase 3 - Team Features
  | 'TEAM_COLLABORATION'
  | 'SLACK_INTEGRATION'
  | 'DEPARTMENT_DASHBOARDS'
  
  // Phase 4 - Advanced
  | 'COMPETITIVE_INTELLIGENCE'
  | 'MARKET_SCANNER'
  | 'PAYMENT_INTEGRATION'
  
  // System Features
  | 'AB_TESTING'
  | 'HEALTH_MONITORING'
  | 'SHADOW_MODE';

export const FEATURE_FLAGS: Record<FeatureFlagId, FeatureFlag> = {
  // === PHASE 1: FOUNDATION ===
  LIVE_REVENUE_TRACKER: {
    id: 'LIVE_REVENUE_TRACKER',
    name: 'Live Revenue Tracker',
    description: 'Real-time revenue dashboard with daily goals and velocity tracking',
    enabled: true,
    rolloutPercentage: 100, // Enable for internal testing
    betaUsers: [], // Will be populated with volunteer user IDs
    enabledTiers: ['all'], // Enable for all tiers during testing
    killSwitch: false,
    experimentId: 'revenue_tracker_v1',
    dependencies: []
  },

  DAILY_CHALLENGES: {
    id: 'DAILY_CHALLENGES',
    name: 'Daily Challenges System',
    description: 'Gamified daily challenges to increase engagement and drive actions',
    enabled: true,
    rolloutPercentage: 100, // Enable for internal testing
    betaUsers: [],
    enabledTiers: ['all'],
    killSwitch: false,
    experimentId: 'daily_challenges_v1',
    dependencies: []
  },

  STREAK_TRACKING: {
    id: 'STREAK_TRACKING',
    name: 'Streak Tracking',
    description: 'Track consecutive days of completing challenges and using app',
    enabled: true,
    rolloutPercentage: 100, // Enable for internal testing
    betaUsers: [],
    enabledTiers: ['all'],
    killSwitch: false,
    dependencies: ['DAILY_CHALLENGES']
  },

  // === PHASE 2: INTELLIGENCE ===
  ADAPTIVE_AGENTS: {
    id: 'ADAPTIVE_AGENTS',
    name: 'Adaptive Agent System',
    description: 'Smart agent routing based on user role and time of day',
    enabled: false, // Not ready yet
    rolloutPercentage: 100, // Enable for internal testing
    betaUsers: [],
    enabledTiers: ['level1', 'level2'],
    killSwitch: false,
    dependencies: ['ROLE_DETECTION']
  },

  ROLE_DETECTION: {
    id: 'ROLE_DETECTION',
    name: 'Automatic Role Detection',
    description: 'Detect user role and team size from behavior patterns',
    enabled: false,
    rolloutPercentage: 100, // Enable for internal testing
    betaUsers: [],
    enabledTiers: ['all'],
    killSwitch: false
  },

  TIME_BASED_SWITCHING: {
    id: 'TIME_BASED_SWITCHING',
    name: 'Time-Based Agent Switching',
    description: 'Switch agents based on time of day for solopreneurs',
    enabled: false,
    rolloutPercentage: 100, // Enable for internal testing
    betaUsers: [],
    enabledTiers: ['level1'],
    killSwitch: false,
    dependencies: ['ADAPTIVE_AGENTS', 'ROLE_DETECTION']
  },

  // === PHASE 3: TEAM FEATURES ===
  TEAM_COLLABORATION: {
    id: 'TEAM_COLLABORATION',
    name: 'Team Collaboration Features',
    description: 'Multi-user features for teams and departments',
    enabled: false,
    rolloutPercentage: 100, // Enable for internal testing
    betaUsers: [],
    enabledTiers: ['level2', 'level3', 'level4'],
    killSwitch: false
  },

  SLACK_INTEGRATION: {
    id: 'SLACK_INTEGRATION',
    name: 'Slack Bot Integration',
    description: 'Slack bot for team notifications and daily check-ins',
    enabled: false,
    rolloutPercentage: 100, // Enable for internal testing
    betaUsers: [],
    enabledTiers: ['level3', 'level4'],
    killSwitch: false,
    dependencies: ['TEAM_COLLABORATION']
  },

  DEPARTMENT_DASHBOARDS: {
    id: 'DEPARTMENT_DASHBOARDS',
    name: 'Department-Specific Dashboards',
    description: 'Specialized dashboards for marketing, sales, ops teams',
    enabled: false,
    rolloutPercentage: 100, // Enable for internal testing
    betaUsers: [],
    enabledTiers: ['level3', 'level4'],
    killSwitch: false,
    dependencies: ['TEAM_COLLABORATION']
  },

  // === PHASE 4: ADVANCED FEATURES ===
  COMPETITIVE_INTELLIGENCE: {
    id: 'COMPETITIVE_INTELLIGENCE',
    name: 'Competitive Intelligence Scanner',
    description: 'Market analysis and competitor tracking',
    enabled: false,
    rolloutPercentage: 100, // Enable for internal testing
    betaUsers: [],
    enabledTiers: ['level4'],
    killSwitch: false
  },

  MARKET_SCANNER: {
    id: 'MARKET_SCANNER',
    name: 'Market Opportunity Scanner',
    description: 'AI-powered market gap and opportunity identification',
    enabled: false,
    rolloutPercentage: 100, // Enable for internal testing
    betaUsers: [],
    enabledTiers: ['level4'],
    killSwitch: false,
    dependencies: ['COMPETITIVE_INTELLIGENCE']
  },

  PAYMENT_INTEGRATION: {
    id: 'PAYMENT_INTEGRATION',
    name: 'Live Payment Integration',
    description: 'Real-time Stripe/PayPal data integration',
    enabled: false, // High risk - enable carefully
    rolloutPercentage: 100, // Enable for internal testing
    betaUsers: [],
    enabledTiers: ['all'],
    killSwitch: false
  },

  // === SYSTEM FEATURES ===
  AB_TESTING: {
    id: 'AB_TESTING',
    name: 'A/B Testing Framework',
    description: 'Built-in A/B testing for feature optimization',
    enabled: true,
    rolloutPercentage: 100, // System feature
    betaUsers: [],
    enabledTiers: ['all'],
    killSwitch: false
  },

  HEALTH_MONITORING: {
    id: 'HEALTH_MONITORING',
    name: 'Health Monitoring Dashboard',
    description: 'Real-time system health and feature performance monitoring',
    enabled: true,
    rolloutPercentage: 100, // Admin feature
    betaUsers: [],
    enabledTiers: ['all'],
    killSwitch: false
  },

  SHADOW_MODE: {
    id: 'SHADOW_MODE',
    name: 'Shadow Mode Testing',
    description: 'Run new features invisibly to compare with existing',
    enabled: true,
    rolloutPercentage: 100, // Testing feature
    betaUsers: [],
    enabledTiers: ['all'],
    killSwitch: false
  }
};

// Environment variable overrides (for emergency control)
export const getEnvironmentOverrides = (): Partial<Record<FeatureFlagId, Partial<FeatureFlag>>> => {
  const overrides: Partial<Record<FeatureFlagId, Partial<FeatureFlag>>> = {};

  // Emergency kill switches
  if (process.env.KILL_ALL_FEATURES === 'true') {
    Object.keys(FEATURE_FLAGS).forEach(flagId => {
      overrides[flagId as FeatureFlagId] = { killSwitch: true, enabled: false };
    });
  }

  // Individual kill switches
  if (process.env.KILL_REVENUE_TRACKER === 'true') {
    overrides.LIVE_REVENUE_TRACKER = { killSwitch: true, enabled: false };
  }

  if (process.env.KILL_TEAM_FEATURES === 'true') {
    overrides.TEAM_COLLABORATION = { killSwitch: true, enabled: false };
    overrides.SLACK_INTEGRATION = { killSwitch: true, enabled: false };
    overrides.DEPARTMENT_DASHBOARDS = { killSwitch: true, enabled: false };
  }

  if (process.env.KILL_PAYMENT_INTEGRATION === 'true') {
    overrides.PAYMENT_INTEGRATION = { killSwitch: true, enabled: false };
  }

  // Rollout percentage overrides
  Object.keys(FEATURE_FLAGS).forEach(flagId => {
    const envVar = `ROLLOUT_${flagId}`;
    const percentage = process.env[envVar];
    if (percentage && !isNaN(Number(percentage))) {
      overrides[flagId as FeatureFlagId] = { 
        rolloutPercentage: Math.max(0, Math.min(100, Number(percentage)))
      };
    }
  });

  return overrides;
};

// Helper function to get business tier from revenue
export const getBusinessTier = (monthlyRevenue?: number): BusinessTier => {
  if (!monthlyRevenue || monthlyRevenue === 0) return 'level0';
  if (monthlyRevenue < 10000) return 'level1';
  if (monthlyRevenue < 100000) return 'level2';
  if (monthlyRevenue < 1000000) return 'level3';
  return 'level4';
};

// Beta user management
export const BETA_USERS = {
  // Add specific user IDs who opt into beta testing
  REVENUE_TRACKER: [
    'demo-user-1',
    'test-user-2',
    // Add more as we get volunteers
  ],
  DAILY_CHALLENGES: [
    'demo-user-1',
    // Add more
  ]
};

// Rollout schedule (for gradual rollout automation)
export const ROLLOUT_SCHEDULE = {
  LIVE_REVENUE_TRACKER: {
    phases: [
      { percentage: 1, duration: '2 hours', startDate: null },
      { percentage: 5, duration: '1 day', startDate: null },
      { percentage: 10, duration: '2 days', startDate: null },
      { percentage: 25, duration: '3 days', startDate: null },
      { percentage: 50, duration: '1 week', startDate: null },
      { percentage: 100, duration: 'permanent', startDate: null }
    ]
  }
};