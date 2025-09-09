// Mock Revenue Data Service
// Generates realistic revenue data for testing without real integrations

import { useMemo, useCallback } from 'react';

export interface RevenueDataPoint {
  timestamp: Date;
  amount: number;
  transactionId: string;
  source: 'stripe' | 'paypal' | 'cash' | 'wire';
  customerType: 'new' | 'returning' | 'upsell';
  productType: 'core' | 'addon' | 'consulting' | 'course';
}

export interface DailyRevenueMetrics {
  date: string;
  totalRevenue: number;
  transactionCount: number;
  averageOrderValue: number;
  newCustomers: number;
  returningCustomers: number;
  upsellRevenue: number;
  hourlyBreakdown: HourlyRevenue[];
  conversionRate: number;
  goalProgress: number;
  goalAmount: number;
  streakDays: number;
}

export interface HourlyRevenue {
  hour: number; // 0-23
  revenue: number;
  transactions: number;
}

export interface MoneyVelocityMetrics {
  currentVelocity: number; // Revenue per hour
  averageVelocity: number;
  peakVelocity: number;
  timeToGoal: number; // Hours remaining to hit daily goal
  trendDirection: 'up' | 'down' | 'steady';
  accelerationFactor: number; // Rate of change
}

export interface BusinessTierData {
  tier: 'level0' | 'level1' | 'level2' | 'level3' | 'level4';
  monthlyRevenue: number;
  dailyGoal: number;
  seasonality: number; // Multiplier for seasonal variations
  growthRate: number; // Monthly growth rate
  volatility: number; // Revenue variance (0-1)
}

const BUSINESS_TIER_CONFIGS: Record<string, BusinessTierData> = {
  level0: {
    tier: 'level0',
    monthlyRevenue: 0,
    dailyGoal: 100,
    seasonality: 0.1,
    growthRate: 0.5, // 50% monthly growth target
    volatility: 0.3
  },
  level1: {
    tier: 'level1',
    monthlyRevenue: 5000,
    dailyGoal: 200,
    seasonality: 0.15,
    growthRate: 0.3,
    volatility: 0.25
  },
  level2: {
    tier: 'level2',
    monthlyRevenue: 30000,
    dailyGoal: 1200,
    seasonality: 0.2,
    growthRate: 0.2,
    volatility: 0.2
  },
  level3: {
    tier: 'level3',
    monthlyRevenue: 150000,
    dailyGoal: 6000,
    seasonality: 0.25,
    growthRate: 0.15,
    volatility: 0.15
  },
  level4: {
    tier: 'level4',
    monthlyRevenue: 625000,
    dailyGoal: 25000,
    seasonality: 0.3,
    growthRate: 0.1,
    volatility: 0.1
  }
};

export class MockRevenueDataService {
  private businessTier: BusinessTierData;
  private baseDate: Date;
  private dataHistory: Map<string, DailyRevenueMetrics[]> = new Map();

  constructor(userTier: string = 'level1') {
    this.businessTier = BUSINESS_TIER_CONFIGS[userTier] || BUSINESS_TIER_CONFIGS.level1;
    this.baseDate = new Date();
    this.baseDate.setHours(0, 0, 0, 0); // Start of day
  }

  // Generate realistic revenue patterns
  private generateRevenuePattern(date: Date): RevenueDataPoint[] {
    const transactions: RevenueDataPoint[] = [];
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Business hours pattern (more activity during business hours)
    const businessHoursMultiplier = this.getBusinessHoursMultiplier();
    
    // Weekend/weekday adjustment
    const weekendMultiplier = isWeekend ? 0.6 : 1.0;
    
    // Calculate expected transaction count for the day
    const baseTransactions = Math.floor(this.businessTier.dailyGoal / 150); // Assuming avg $150 per transaction
    const expectedTransactions = Math.max(1, Math.floor(baseTransactions * weekendMultiplier));
    
    // Generate transactions throughout the day
    for (let i = 0; i < expectedTransactions; i++) {
      const transaction = this.generateTransaction(date, businessHoursMultiplier);
      transactions.push(transaction);
    }
    
    return transactions.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  private getBusinessHoursMultiplier(): number[] {
    // 24-hour multiplier array (higher during business hours)
    return [
      0.1, 0.05, 0.05, 0.05, 0.1, 0.2, 0.4, 0.6, // 12am-7am (low activity)
      0.8, 1.0, 1.2, 1.4, 1.5, 1.3, 1.4, 1.6,   // 8am-3pm (business hours peak)
      1.4, 1.2, 1.0, 0.8, 0.6, 0.4, 0.3, 0.2    // 4pm-11pm (evening decline)
    ];
  }

  private generateTransaction(date: Date, hourlyMultipliers: number[]): RevenueDataPoint {
    // Pick a random hour weighted by business hours
    const hour = this.selectWeightedHour(hourlyMultipliers);
    const minute = Math.floor(Math.random() * 60);
    const second = Math.floor(Math.random() * 60);
    
    const timestamp = new Date(date);
    timestamp.setHours(hour, minute, second, 0);
    
    // Generate transaction amount with realistic distribution
    const baseAmount = this.businessTier.monthlyRevenue / 30 / 10; // Base transaction size
    const variance = 1 + (Math.random() - 0.5) * this.businessTier.volatility * 2;
    const amount = Math.max(10, Math.floor(baseAmount * variance));
    
    return {
      timestamp,
      amount,
      transactionId: this.generateTransactionId(),
      source: this.selectRandomSource(),
      customerType: this.selectCustomerType(),
      productType: this.selectProductType()
    };
  }

  private selectWeightedHour(multipliers: number[]): number {
    const weights = multipliers.map((mult, hour) => ({ hour, weight: mult }));
    const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const { hour, weight } of weights) {
      random -= weight;
      if (random <= 0) return hour;
    }
    
    return 12; // Default to noon
  }

  private generateTransactionId(): string {
    return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private selectRandomSource(): 'stripe' | 'paypal' | 'cash' | 'wire' {
    const sources = ['stripe', 'paypal', 'cash', 'wire'] as const;
    const weights = [0.7, 0.2, 0.08, 0.02]; // Stripe dominance
    return this.weightedRandom(sources, weights);
  }

  private selectCustomerType(): 'new' | 'returning' | 'upsell' {
    const types = ['new', 'returning', 'upsell'] as const;
    const weights = [0.4, 0.45, 0.15]; // Mix of new and returning
    return this.weightedRandom(types, weights);
  }

  private selectProductType(): 'core' | 'addon' | 'consulting' | 'course' {
    const types = ['core', 'addon', 'consulting', 'course'] as const;
    const weights = [0.6, 0.2, 0.15, 0.05]; // Core product dominance
    return this.weightedRandom(types, weights);
  }

  private weightedRandom<T>(items: readonly T[], weights: number[]): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < items.length; i++) {
      random -= weights[i];
      if (random <= 0) return items[i];
    }
    
    return items[0];
  }

  // Public API methods
  public async getTodaysMetrics(): Promise<DailyRevenueMetrics> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const transactions = this.generateRevenuePattern(today);
    return this.aggregateDailyMetrics(today, transactions);
  }

  public async getHistoricalMetrics(days: number = 30): Promise<DailyRevenueMetrics[]> {
    const metrics: DailyRevenueMetrics[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(this.baseDate);
      date.setDate(date.getDate() - i);
      
      const transactions = this.generateRevenuePattern(date);
      const dayMetrics = this.aggregateDailyMetrics(date, transactions);
      metrics.push(dayMetrics);
    }
    
    return metrics;
  }

  public async getCurrentVelocity(): Promise<MoneyVelocityMetrics> {
    const now = new Date();
    const currentHour = now.getHours();
    const todaysMetrics = await this.getTodaysMetrics();
    
    // Calculate current velocity (revenue per hour so far today)
    const hoursElapsed = Math.max(1, currentHour + (now.getMinutes() / 60));
    const currentVelocity = todaysMetrics.totalRevenue / hoursElapsed;
    
    // Historical average velocity
    const historical = await this.getHistoricalMetrics(7);
    const averageVelocity = historical.reduce((sum, day) => 
      sum + (day.totalRevenue / 24), 0
    ) / historical.length;
    
    // Peak velocity from today's hourly breakdown
    const peakVelocity = Math.max(...todaysMetrics.hourlyBreakdown.map(h => h.revenue));
    
    // Time to goal calculation
    const remainingRevenue = Math.max(0, todaysMetrics.goalAmount - todaysMetrics.totalRevenue);
    const remainingHours = 24 - hoursElapsed;
    const timeToGoal = currentVelocity > 0 ? remainingRevenue / currentVelocity : remainingHours;
    
    // Trend direction
    const recentVelocity = todaysMetrics.hourlyBreakdown
      .slice(-3)
      .reduce((sum, h) => sum + h.revenue, 0) / 3;
    const earlierVelocity = todaysMetrics.hourlyBreakdown
      .slice(0, Math.max(1, currentHour - 3))
      .reduce((sum, h) => sum + h.revenue, 0) / Math.max(1, currentHour - 3);
    
    let trendDirection: 'up' | 'down' | 'steady' = 'steady';
    if (recentVelocity > earlierVelocity * 1.1) trendDirection = 'up';
    else if (recentVelocity < earlierVelocity * 0.9) trendDirection = 'down';
    
    return {
      currentVelocity: Math.round(currentVelocity),
      averageVelocity: Math.round(averageVelocity),
      peakVelocity: Math.round(peakVelocity),
      timeToGoal: Math.max(0, Math.round(timeToGoal * 10) / 10),
      trendDirection,
      accelerationFactor: Math.round((currentVelocity / averageVelocity) * 100) / 100
    };
  }

  private aggregateDailyMetrics(date: Date, transactions: RevenueDataPoint[]): DailyRevenueMetrics {
    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    const newCustomers = transactions.filter(t => t.customerType === 'new').length;
    const returningCustomers = transactions.filter(t => t.customerType === 'returning').length;
    const upsellRevenue = transactions
      .filter(t => t.customerType === 'upsell')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Generate hourly breakdown
    const hourlyBreakdown: HourlyRevenue[] = [];
    for (let hour = 0; hour < 24; hour++) {
      const hourTransactions = transactions.filter(t => t.timestamp.getHours() === hour);
      hourlyBreakdown.push({
        hour,
        revenue: hourTransactions.reduce((sum, t) => sum + t.amount, 0),
        transactions: hourTransactions.length
      });
    }
    
    // Calculate goal progress
    const goalAmount = this.businessTier.dailyGoal;
    const goalProgress = Math.min(100, (totalRevenue / goalAmount) * 100);
    
    // Simple streak calculation (mock - in reality would come from database)
    const streakDays = Math.floor(Math.random() * 14) + 1; // 1-14 day streak
    
    return {
      date: date.toISOString().split('T')[0],
      totalRevenue: Math.round(totalRevenue),
      transactionCount: transactions.length,
      averageOrderValue: transactions.length > 0 ? Math.round(totalRevenue / transactions.length) : 0,
      newCustomers,
      returningCustomers,
      upsellRevenue: Math.round(upsellRevenue),
      hourlyBreakdown,
      conversionRate: Math.round((Math.random() * 5 + 2) * 10) / 10, // 2-7% mock
      goalProgress: Math.round(goalProgress * 10) / 10,
      goalAmount,
      streakDays
    };
  }

  // Simulate real-time updates
  public async simulateRealTimeUpdate(): Promise<RevenueDataPoint | null> {
    // Randomly decide if a new transaction occurred (based on business velocity)
    const now = new Date();
    const currentHour = now.getHours();
    const hourlyMultipliers = this.getBusinessHoursMultiplier();
    const probability = hourlyMultipliers[currentHour] * 0.1; // 10% max probability per call
    
    if (Math.random() < probability) {
      return this.generateTransaction(now, hourlyMultipliers);
    }
    
    return null;
  }
}

// Singleton instance for consistent data
let mockRevenueService: MockRevenueDataService | null = null;

export function getMockRevenueService(userTier?: string): MockRevenueDataService {
  if (!mockRevenueService || (userTier && userTier !== mockRevenueService['businessTier'].tier)) {
    mockRevenueService = new MockRevenueDataService(userTier);
  }
  return mockRevenueService;
}

// React hook for easy component integration
export function useMockRevenueData(userTier?: string) {
  const service = useMemo(() => getMockRevenueService(userTier), [userTier]);
  
  const getTodaysMetrics = useCallback(() => service.getTodaysMetrics(), [service]);
  const getHistoricalMetrics = useCallback((days?: number) => service.getHistoricalMetrics(days), [service]);
  const getCurrentVelocity = useCallback(() => service.getCurrentVelocity(), [service]);
  const simulateRealTime = useCallback(() => service.simulateRealTimeUpdate(), [service]);
  
  return useMemo(() => ({
    getTodaysMetrics,
    getHistoricalMetrics,
    getCurrentVelocity,
    simulateRealTime
  }), [getTodaysMetrics, getHistoricalMetrics, getCurrentVelocity, simulateRealTime]);
}