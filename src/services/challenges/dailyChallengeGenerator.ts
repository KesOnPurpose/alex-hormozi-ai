// Daily Challenge Generation Service
// Creates personalized challenges based on Alex Hormozi frameworks and user data

export interface DailyChallenge {
  id: string;
  type: 'revenue' | 'framework' | 'habit' | 'constraint' | 'team' | 'learning';
  title: string;
  description: string;
  framework: string; // Which Hormozi framework this relates to
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  timeRequired: string; // e.g., "5 minutes", "30 minutes", "2 hours"
  deadline: Date;
  success_criteria: string;
  hints: string[];
  relatedResources: string[];
  completed: boolean;
  completedAt?: Date;
  proof?: ChallengeProof;
}

export interface ChallengeProof {
  type: 'text' | 'number' | 'image' | 'link' | 'boolean';
  value: any;
  timestamp: Date;
  verified: boolean;
}

export interface UserChallengeContext {
  userId: string;
  businessTier: 'level0' | 'level1' | 'level2' | 'level3' | 'level4';
  monthlyRevenue?: number;
  primaryConstraint?: 'leads' | 'conversion' | 'fulfillment' | 'profit' | 'unknown';
  completedChallenges: string[]; // Challenge IDs completed in last 30 days
  currentStreak: number;
  preferredDifficulty?: 'easy' | 'medium' | 'hard';
  preferredTypes?: Array<DailyChallenge['type']>;
  availableTime?: 'low' | 'medium' | 'high'; // How much time they typically have
}

const CHALLENGE_TEMPLATES = {
  // === REVENUE CHALLENGES ===
  revenue: {
    beat_yesterday: {
      title: "Beat Yesterday's Revenue",
      description: "Generate more revenue today than you did yesterday",
      framework: "Money Velocity",
      difficulties: {
        easy: { multiplier: 1.05, xp: 25 },
        medium: { multiplier: 1.15, xp: 50 },
        hard: { multiplier: 1.25, xp: 100 }
      },
      success_criteria: "Revenue today > {target_amount}",
      hints: [
        "Focus on your highest-converting offer",
        "Follow up with recent leads",
        "Add urgency to your current promotion"
      ]
    },
    
    transaction_volume: {
      title: "Hit Transaction Target",
      description: "Complete a specific number of transactions today",
      framework: "Volume Metrics",
      difficulties: {
        easy: { count: 3, xp: 20 },
        medium: { count: 6, xp: 40 },
        hard: { count: 10, xp: 80 }
      },
      success_criteria: "Complete {target_count} transactions",
      hints: [
        "Focus on your core offer",
        "Reach out to warm leads",
        "Optimize for quick wins"
      ]
    },

    upsell_focus: {
      title: "Upsell Challenge",
      description: "Successfully upsell at least one customer today",
      framework: "4-Prong Money Model",
      difficulties: {
        easy: { count: 1, xp: 30 },
        medium: { count: 2, xp: 60 },
        hard: { count: 3, xp: 120 }
      },
      success_criteria: "Complete {target_count} successful upsells",
      hints: [
        "Identify recent customers who could benefit from additional services",
        "Use the 5 Upsell Moments framework",
        "Focus on value, not price"
      ]
    }
  },

  // === FRAMEWORK CHALLENGES ===
  framework: {
    grand_slam_audit: {
      title: "Grand Slam Offer Audit",
      description: "Analyze your current offer using the Grand Slam framework",
      framework: "Grand Slam Offers",
      difficulties: {
        easy: { xp: 40, depth: "basic" },
        medium: { xp: 80, depth: "detailed" },
        hard: { xp: 160, depth: "comprehensive" }
      },
      success_criteria: "Complete offer analysis with improvement recommendations",
      hints: [
        "Focus on the Value Equation: Dream Outcome / (Time Delay × Effort & Sacrifice)",
        "Identify ways to increase perceived likelihood of achievement",
        "Look for ways to reduce time delay and effort required"
      ]
    },

    constraint_identification: {
      title: "Find Your Current Constraint",
      description: "Identify which of the 4 Universal Constraints is limiting your business right now",
      framework: "4 Universal Constraints",
      difficulties: {
        easy: { xp: 35, analysis: "surface" },
        medium: { xp: 70, analysis: "deep" },
        hard: { xp: 140, analysis: "strategic" }
      },
      success_criteria: "Identify primary constraint with supporting evidence",
      hints: [
        "Look at your funnel: Where do most people drop off?",
        "Analyze: Leads → Conversion → Fulfillment → Profit",
        "The constraint is the step that limits everything else"
      ]
    },

    value_ladder_design: {
      title: "Design Your Value Ladder",
      description: "Create or optimize your value ladder with multiple offers",
      framework: "Value Ladder",
      difficulties: {
        easy: { offers: 3, xp: 50 },
        medium: { offers: 5, xp: 100 },
        hard: { offers: 7, xp: 200 }
      },
      success_criteria: "Design value ladder with {offer_count} complementary offers",
      hints: [
        "Start with a low-risk, high-value entry offer",
        "Each step should naturally lead to the next",
        "Price based on value delivered, not time invested"
      ]
    }
  },

  // === HABIT CHALLENGES ===
  habit: {
    morning_planning: {
      title: "Morning Revenue Planning",
      description: "Start your day by planning your revenue-generating activities",
      framework: "Daily Systems",
      difficulties: {
        easy: { duration: "5 minutes", xp: 15 },
        medium: { duration: "15 minutes", xp: 30 },
        hard: { duration: "30 minutes", xp: 60 }
      },
      success_criteria: "Complete morning planning session",
      hints: [
        "Identify your ONE most important revenue activity for today",
        "Block time for high-impact activities",
        "Set a specific revenue goal for the day"
      ]
    },

    follow_up_blitz: {
      title: "Follow-Up Blitz",
      description: "Follow up with prospects and customers who haven't responded",
      framework: "Sales Systems",
      difficulties: {
        easy: { contacts: 5, xp: 25 },
        medium: { contacts: 10, xp: 50 },
        hard: { contacts: 20, xp: 100 }
      },
      success_criteria: "Follow up with {contact_count} prospects",
      hints: [
        "Use multiple channels: email, text, phone, social",
        "Provide value in every follow-up",
        "Ask specific questions to re-engage"
      ]
    },

    metrics_review: {
      title: "Daily Metrics Check",
      description: "Review and record your key business metrics",
      framework: "Data-Driven Decisions",
      difficulties: {
        easy: { metrics: 3, xp: 20 },
        medium: { metrics: 5, xp: 40 },
        hard: { metrics: 8, xp: 80 }
      },
      success_criteria: "Track {metric_count} key business metrics",
      hints: [
        "Focus on leading indicators, not just results",
        "Track: Leads, Conversion %, Revenue, Expenses",
        "Look for patterns and trends"
      ]
    }
  },

  // === CONSTRAINT CHALLENGES ===
  constraint: {
    lead_generation_sprint: {
      title: "Lead Generation Sprint",
      description: "Generate qualified leads using multiple channels",
      framework: "Lead Generation Systems",
      difficulties: {
        easy: { leads: 5, xp: 30 },
        medium: { leads: 15, xp: 60 },
        hard: { leads: 30, xp: 120 }
      },
      success_criteria: "Generate {lead_count} qualified leads",
      hints: [
        "Use content to attract your ideal customer",
        "Leverage social proof and testimonials",
        "Make an irresistible lead magnet"
      ]
    },

    conversion_optimization: {
      title: "Conversion Rate Boost",
      description: "Improve your conversion rate through testing and optimization",
      framework: "Conversion Optimization",
      difficulties: {
        easy: { improvement: 5, xp: 40 },
        medium: { improvement: 10, xp: 80 },
        hard: { improvement: 20, xp: 160 }
      },
      success_criteria: "Improve conversion rate by {improvement}%",
      hints: [
        "Test different headlines and offers",
        "Address common objections upfront",
        "Add social proof and testimonials"
      ]
    }
  },

  // === LEARNING CHALLENGES ===
  learning: {
    framework_deep_dive: {
      title: "Framework Deep Dive",
      description: "Study and implement one specific Alex Hormozi framework",
      framework: "Variable",
      difficulties: {
        easy: { depth: "overview", xp: 25 },
        medium: { depth: "detailed", xp: 50 },
        hard: { depth: "implementation", xp: 100 }
      },
      success_criteria: "Complete framework study and create implementation plan",
      hints: [
        "Choose a framework that addresses your current constraint",
        "Take notes and create an action plan",
        "Identify the first 3 actions you'll take"
      ]
    }
  }
};

export class DailyChallengeGenerator {
  private userId: string;
  private context: UserChallengeContext;

  constructor(context: UserChallengeContext) {
    this.userId = context.userId;
    this.context = context;
  }

  public generateDailyChallenge(): DailyChallenge {
    // Determine challenge type based on user context
    const challengeType = this.selectChallengeType();
    
    // Select specific challenge template
    const template = this.selectChallengeTemplate(challengeType);
    
    // Determine difficulty
    const difficulty = this.selectDifficulty();
    
    // Generate the challenge
    return this.createChallenge(challengeType, template, difficulty);
  }

  public generateBeatYesterdayChallenge(yesterdayRevenue: number): DailyChallenge {
    const difficulty = this.selectDifficulty();
    const template = CHALLENGE_TEMPLATES.revenue.beat_yesterday;
    const config = template.difficulties[difficulty];
    
    const targetAmount = Math.round(yesterdayRevenue * config.multiplier);
    
    return {
      id: `beat-yesterday-${Date.now()}`,
      type: 'revenue',
      title: template.title,
      description: `Generate at least ${this.formatCurrency(targetAmount)} today (${Math.round((config.multiplier - 1) * 100)}% more than yesterday's ${this.formatCurrency(yesterdayRevenue)})`,
      framework: template.framework,
      difficulty,
      xpReward: config.xp,
      timeRequired: "Throughout the day",
      deadline: this.getEndOfDay(),
      success_criteria: template.success_criteria.replace('{target_amount}', this.formatCurrency(targetAmount)),
      hints: template.hints,
      relatedResources: [
        "/agents/money-model-architect",
        "/business-templates?filter=revenue"
      ],
      completed: false
    };
  }

  private selectChallengeType(): DailyChallenge['type'] {
    const { primaryConstraint, businessTier, currentStreak, preferredTypes } = this.context;
    
    // If user has preferred types, weight them heavily
    if (preferredTypes && preferredTypes.length > 0) {
      return this.weightedRandomSelect(preferredTypes, [1, 1, 1, 1, 1]);
    }
    
    // Weight based on business tier and constraint
    let weights: Record<DailyChallenge['type'], number> = {
      revenue: 0.3,
      framework: 0.2,
      habit: 0.2,
      constraint: 0.2,
      team: 0.05,
      learning: 0.05
    };
    
    // Adjust based on primary constraint
    if (primaryConstraint === 'leads') {
      weights.constraint = 0.4;
      weights.revenue = 0.2;
    } else if (primaryConstraint === 'conversion') {
      weights.framework = 0.4;
      weights.revenue = 0.3;
    } else if (primaryConstraint === 'profit') {
      weights.revenue = 0.5;
      weights.framework = 0.3;
    }
    
    // Early stage businesses focus more on habits and learning
    if (businessTier === 'level0' || businessTier === 'level1') {
      weights.habit = 0.3;
      weights.learning = 0.2;
      weights.framework = 0.3;
      weights.revenue = 0.2;
    }
    
    // Team challenges for higher tier businesses
    if (businessTier === 'level3' || businessTier === 'level4') {
      weights.team = 0.15;
    }
    
    // Streak bonus - mix it up for longer streaks
    if (currentStreak > 7) {
      const types = Object.keys(weights) as DailyChallenge['type'][];
      return types[Math.floor(Math.random() * types.length)];
    }
    
    return this.weightedRandomFromObject(weights);
  }

  private selectChallengeTemplate(type: DailyChallenge['type']): any {
    const templates = CHALLENGE_TEMPLATES[type];
    if (!templates) return CHALLENGE_TEMPLATES.revenue.beat_yesterday;
    
    const templateKeys = Object.keys(templates);
    const randomKey = templateKeys[Math.floor(Math.random() * templateKeys.length)];
    return templates[randomKey];
  }

  private selectDifficulty(): 'easy' | 'medium' | 'hard' {
    const { preferredDifficulty, currentStreak, businessTier } = this.context;
    
    // Use preferred difficulty if set
    if (preferredDifficulty) return preferredDifficulty;
    
    // Adjust based on streak (gradual difficulty increase)
    if (currentStreak < 3) return 'easy';
    if (currentStreak < 7) return Math.random() < 0.7 ? 'easy' : 'medium';
    if (currentStreak < 14) return Math.random() < 0.5 ? 'medium' : 'hard';
    
    // Higher tier businesses can handle harder challenges
    if (businessTier === 'level3' || businessTier === 'level4') {
      return Math.random() < 0.6 ? 'hard' : 'medium';
    }
    
    // Default distribution
    const rand = Math.random();
    if (rand < 0.5) return 'easy';
    if (rand < 0.8) return 'medium';
    return 'hard';
  }

  private createChallenge(type: DailyChallenge['type'], template: any, difficulty: 'easy' | 'medium' | 'hard'): DailyChallenge {
    const config = template.difficulties[difficulty];
    
    return {
      id: `${type}-${template.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      type,
      title: template.title,
      description: this.personalizeDescription(template.description, config),
      framework: template.framework,
      difficulty,
      xpReward: config.xp,
      timeRequired: this.estimateTimeRequired(type, difficulty),
      deadline: this.getEndOfDay(),
      success_criteria: this.personalizeCriteria(template.success_criteria, config),
      hints: template.hints,
      relatedResources: this.getRelatedResources(type, template.framework),
      completed: false
    };
  }

  private personalizeDescription(description: string, config: any): string {
    // Replace placeholders with specific values
    return description
      .replace('{target_count}', config.count?.toString() || '1')
      .replace('{target_amount}', config.amount ? this.formatCurrency(config.amount) : '')
      .replace('{multiplier}', config.multiplier ? `${((config.multiplier - 1) * 100).toFixed(0)}%` : '');
  }

  private personalizeCriteria(criteria: string, config: any): string {
    return criteria
      .replace('{target_count}', config.count?.toString() || '1')
      .replace('{target_amount}', config.amount ? this.formatCurrency(config.amount) : '')
      .replace('{contact_count}', config.contacts?.toString() || '5')
      .replace('{lead_count}', config.leads?.toString() || '5')
      .replace('{metric_count}', config.metrics?.toString() || '3')
      .replace('{offer_count}', config.offers?.toString() || '3')
      .replace('{improvement}', config.improvement?.toString() || '10');
  }

  private estimateTimeRequired(type: DailyChallenge['type'], difficulty: 'easy' | 'medium' | 'hard'): string {
    const timeEstimates = {
      revenue: { easy: "30 minutes", medium: "1-2 hours", hard: "3-4 hours" },
      framework: { easy: "15 minutes", medium: "45 minutes", hard: "2 hours" },
      habit: { easy: "10 minutes", medium: "20 minutes", hard: "45 minutes" },
      constraint: { easy: "45 minutes", medium: "2 hours", hard: "4 hours" },
      team: { easy: "30 minutes", medium: "1 hour", hard: "2 hours" },
      learning: { easy: "20 minutes", medium: "1 hour", hard: "2 hours" }
    };
    
    return timeEstimates[type][difficulty];
  }

  private getRelatedResources(type: DailyChallenge['type'], framework: string): string[] {
    const baseResources = [
      "/business-templates",
      "/agents",
      "/progress"
    ];
    
    const typeResources = {
      revenue: ["/dashboard", "/agents/money-model-architect"],
      framework: ["/agents/offer-analyzer", "/agents/constraint-analyzer"],
      habit: ["/settings", "/profile"],
      constraint: ["/agents/constraint-analyzer"],
      team: ["/team", "/settings"],
      learning: ["/business-templates", "/agents/coaching-methodology"]
    };
    
    return [...baseResources, ...(typeResources[type] || [])];
  }

  private getEndOfDay(): Date {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return today;
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  private weightedRandomSelect<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < items.length; i++) {
      random -= weights[i];
      if (random <= 0) return items[i];
    }
    
    return items[0];
  }

  private weightedRandomFromObject<T>(obj: Record<string, number>): T {
    const entries = Object.entries(obj);
    const keys = entries.map(([key]) => key) as T[];
    const weights = entries.map(([, weight]) => weight);
    return this.weightedRandomSelect(keys, weights);
  }
}

// React hook for easy component integration
export function useDailyChallengeGenerator(context: UserChallengeContext) {
  const generator = new DailyChallengeGenerator(context);
  
  return {
    generateDaily: () => generator.generateDailyChallenge(),
    generateBeatYesterday: (yesterdayRevenue: number) => 
      generator.generateBeatYesterdayChallenge(yesterdayRevenue)
  };
}

// Challenge completion tracking
export interface ChallengeTracker {
  completeChallenge(challengeId: string, proof?: ChallengeProof): Promise<void>;
  getChallengeHistory(userId: string, days?: number): Promise<DailyChallenge[]>;
  getCurrentStreak(userId: string): Promise<number>;
  getXpTotal(userId: string): Promise<number>;
}

export class LocalChallengeTracker implements ChallengeTracker {
  async completeChallenge(challengeId: string, proof?: ChallengeProof): Promise<void> {
    const completed = this.getCompletedChallenges();
    completed.push({
      challengeId,
      completedAt: new Date(),
      proof
    });
    localStorage.setItem('completedChallenges', JSON.stringify(completed));
  }

  async getChallengeHistory(userId: string, days: number = 30): Promise<DailyChallenge[]> {
    // This would normally come from a database
    // For now, return empty array
    return [];
  }

  async getCurrentStreak(userId: string): Promise<number> {
    const completed = this.getCompletedChallenges();
    // Simple streak calculation - in reality, this would be more sophisticated
    return Math.min(completed.length, 7);
  }

  async getXpTotal(userId: string): Promise<number> {
    const completed = this.getCompletedChallenges();
    // Mock XP calculation
    return completed.length * 35; // Average 35 XP per challenge
  }

  private getCompletedChallenges(): any[] {
    const stored = localStorage.getItem('completedChallenges');
    return stored ? JSON.parse(stored) : [];
  }
}