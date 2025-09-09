import { MoneyModelTemplate, OfferNode, OfferType } from '@/types/money-model'

export const MONEY_MODEL_TEMPLATES: MoneyModelTemplate[] = [
  {
    id: 'hormozi-gym-launch',
    name: 'Hormozi\'s Gym Launch Model',
    description: 'The exact value ladder Alex used to scale Gym Launch to $100M+. Proven client-financed acquisition model.',
    category: 'fitness',
    industryTags: ['fitness', 'coaching', 'local-business'],
    difficulty: 'intermediate',
    averageRevenueIncrease: 340,
    implementationTime: '3-6 months',
    successRate: 78,
    thumbnailUrl: '/templates/gym-launch.svg',
    previewMetrics: {
      totalOffers: 4,
      avgPrice: 5659,
      projectedRevenue: 42000
    },
    
    // Success Story
    successStory: {
      businessName: 'Gym Launch',
      timeframe: '2017-2021',
      results: [
        { metric: 'Revenue', before: '$0', after: '$100M+' },
        { metric: 'Gyms Helped', before: '0', after: '4,000+' },
        { metric: 'CAC', before: 'Unknown', after: '$5' },
        { metric: 'LTV', before: 'Unknown', after: '$680' }
      ],
      keyInsight: 'Client-financed acquisition: Use the challenge to fund the core program acquisition.'
    },
    
    // Educational Content for Each Offer
    offerEducation: [
      {
        // Free PDF Guide
        framework: {
          type: 'attraction-offer',
          name: 'Lead Magnet',
          description: 'Low-barrier entry point that provides immediate value while qualifying prospects.',
          keyPrinciples: [
            'Must solve a specific, urgent problem',
            'Should take less than 15 minutes to consume',
            'Must naturally lead to the next offer',
            'Positions you as the expert'
          ],
          commonMistakes: [
            'Too generic or broad in scope',
            'Takes too long to get value',
            'Doesn\'t connect to your paid solution',
            'No clear next step'
          ],
          successMetrics: [
            '2-5% email-to-challenge conversion',
            '10-15% email open rates',
            'High download completion rate'
          ]
        },
        
        realImplementation: {
          whatItActuallyIs: 'A strategic "6-Week Challenge Blueprint" PDF that teaches gym owners the exact framework Hormozi uses to run profitable fitness challenges.',
          whyItWorks: [
            'Solves immediate cash flow problem',
            'Low time investment (15 min read)',
            'Positions challenges as THE solution',
            'Creates urgency around implementation'
          ],
          keyNumbers: [
            { metric: 'Conversion Rate', value: '2.3%', context: 'PDF downloads to challenge purchases' },
            { metric: 'CAC', value: '$5', context: 'Facebook ads to generate downloads' },
            { metric: 'Time to Value', value: '15 minutes', context: 'How long to implement first strategy' }
          ],
          psychologyBehind: 'Addresses the #1 fear of gym owners: "I need cash now but don\'t know how." The PDF gives them hope with a proven system.',
          commonVariations: [
            'Video training instead of PDF',
            'Email course over 5-7 days',
            'Live webinar with replay'
          ]
        },
        
        masterclassNotes: {
          alexQuote: 'The lead magnet must make the paid thing feel like the obvious next step.',
          coreLesson: 'Your free content should create MORE questions than it answers, naturally leading to your paid solution.',
          implementationTips: [
            'Use the "Trojan Horse" method - solve one problem while revealing a bigger opportunity',
            'Include a "implementation checklist" that requires tools/support to complete',
            'End with "Now that you know WHAT to do, here\'s HOW to do it..." transition'
          ],
          warningsSigns: [
            'People consume but don\'t buy anything else',
            'High download rates but low email engagement',
            'Lots of questions that your paid product doesn\'t answer'
          ]
        },
        
        flowStrategy: {
          fromPrevious: 'Entry point - typically Facebook/Google ads targeting "gym owner cash flow" keywords',
          toNext: 'Email sequence highlighting challenge success stories, creating urgency for next enrollment period',
          conversionTactics: [
            'Include gym owner case studies in PDF',
            'Add "limited time" challenge enrollment bonus',
            'Show exact revenue numbers from other gym owners'
          ],
          timingNotes: 'Most people take action within 72 hours of consuming the PDF or not at all'
        }
      },
      
      {
        // 6-Week Challenge
        framework: {
          type: 'attraction-offer',
          name: 'Irresistible Front-End Offer',
          description: 'Low-price, high-value offer designed to cover acquisition costs while qualifying serious buyers.',
          keyPrinciples: [
            'Price should cover customer acquisition cost',
            'Must deliver genuine transformation',
            'Creates natural urgency (limited time)',
            'Qualifies buyers for higher-ticket offers'
          ],
          commonMistakes: [
            'Priced too high for impulse purchase',
            'Over-delivers without clear upgrade path',
            'No deadline or scarcity',
            'Doesn\'t collect enough buyer data'
          ],
          successMetrics: [
            '60-70% complete the challenge',
            '66% conversion to main program',
            'Breakeven or profit on ad spend'
          ]
        },
        
        realImplementation: {
          whatItActuallyIs: 'A 6-week fitness transformation challenge for gym members, priced at $39 to cover ads and qualify serious prospects.',
          whyItWorks: [
            '$39 eliminates tire-kickers but stays impulse-purchase level',
            'Group format creates accountability and social proof',
            'Fixed timeframe creates urgency to start',
            'Results create natural testimonials for gym'
          ],
          keyNumbers: [
            { metric: 'Price Point', value: '$39', context: 'Sweet spot for impulse + commitment' },
            { metric: 'Completion Rate', value: '70%', context: 'Higher than typical due to price commitment' },
            { metric: 'Upgrade Rate', value: '66%', context: 'Challenge finishers who buy main program' }
          ],
          psychologyBehind: 'Small financial commitment creates psychological ownership. Group format leverages social proof and accountability.',
          commonVariations: [
            '30-day challenge format',
            'Different price points ($47, $97)',
            'Virtual vs in-person delivery'
          ]
        },
        
        masterclassNotes: {
          alexQuote: 'The goal of your challenge isn\'t to make money - it\'s to create customers who are ready to spend real money.',
          coreLesson: 'Your front-end offer should be a "sample" of your main thing, not something completely different.',
          implementationTips: [
            'Price it at your customer acquisition cost to break even',
            'Include bonus materials that expire to create urgency',
            'Track who engages most - they\'re your hottest prospects',
            'Use challenge as content for social proof in ads'
          ],
          warningsSigns: [
            'High enrollment but low completion rates',
            'Challenge participants don\'t upgrade',
            'Can\'t break even on advertising costs'
          ]
        },
        
        flowStrategy: {
          fromPrevious: 'Email nurture sequence from PDF download, highlighting transformation stories and challenge spots filling up',
          toNext: 'During challenge, showcase "what\'s possible" with full program. Final week focuses on upgrade urgency',
          conversionTactics: [
            'Week 4: Share case study of someone who got full transformation',
            'Week 5: Preview advanced strategies only available in main program',
            'Week 6: Limited-time upgrade bonus for challenge finishers'
          ],
          timingNotes: 'Conversion window is days 25-30 of challenge when results are visible but transformation incomplete'
        }
      },
      
      // Gym Launch Program (Core Offer)
      {
        framework: {
          type: 'core-offer',
          name: 'Core Value System',
          description: 'The main transformation product that delivers your primary promise and drives most revenue.',
          keyPrinciples: [
            'Must be the "real thing" customers actually want',
            'Price 10-20x higher than front-end offers',
            'Include implementation, not just information',
            'Provide clear path from problem to solution'
          ],
          commonMistakes: [
            'Making it too complicated or overwhelming',
            'Underpricing relative to value delivered',
            'Not connecting it to front-end experience',
            'Focusing on features instead of outcomes'
          ],
          successMetrics: [
            'High completion rates (60%+)',
            'Strong customer testimonials',
            'Natural word-of-mouth referrals',
            'Profitable at target price point'
          ]
        },
        
        realImplementation: {
          whatItActuallyIs: 'A complete business-in-a-box system that teaches gym owners how to run profitable 6-week challenges, including scripts, marketing templates, pricing strategies, and operational systems.',
          whyItWorks: [
            'Solves the complete problem, not just part of it',
            'Based on proven model (Alex\'s own success)',
            'Includes both strategy AND tactical implementation',
            'Provides ongoing support during implementation',
            'Price point reflects serious commitment level'
          ],
          keyNumbers: [
            { metric: 'Average Price', value: '$600', context: 'Per gym owner enrollee' },
            { metric: 'Conversion Rate', value: '66%', context: 'From 6-week challenge participants' },
            { metric: 'Implementation Time', value: '90 days', context: 'To full system deployment' },
            { metric: 'Success Rate', value: '78%', context: 'Gyms that implement successfully' }
          ],
          psychologyBehind: 'The price creates commitment - people who pay $600 actually implement because they have skin in the game. The comprehensive nature removes any excuse for failure.',
          commonVariations: [
            'Done-for-you version at $2,000-$5,000',
            'Industry-specific adaptations (yoga, crossfit, etc.)',
            'Group coaching cohorts vs self-paced',
            'White-label licensing for agencies'
          ]
        },
        
        masterclassNotes: {
          alexQuote: 'Your core offer is where you make your money and your reputation. Everything else just gets people to this moment.',
          coreLesson: 'The core offer must be priced high enough that you can afford to "lose money" on everything that comes before it in the funnel.',
          implementationTips: [
            'Include implementation calls, not just training videos',
            'Provide templates and swipe files for immediate use',
            'Create accountability through cohort starts or milestones',
            'Build in celebration moments for early wins'
          ],
          warningsSigns: [
            'Low completion rates despite good training',
            'Customers asking for refunds mid-program',
            'No organic referrals or testimonials coming in',
            'Need to constantly discount to make sales'
          ]
        },
        
        flowStrategy: {
          fromPrevious: 'Challenge graduates receive exclusive invite to "scale what worked in the challenge." Leverage their recent success as proof of concept.',
          toNext: 'Successful program graduates naturally want ongoing support and advanced strategies - perfect setup for continuity.',
          conversionTactics: [
            'Week 4 of challenge: Case study of gym that went from challenge to $50K/month',
            'Week 5: Preview of advanced systems only in full program',
            'Week 6: Graduate-only bonus call with program preview',
            'Graduation day: Limited-time action-taker bonus'
          ],
          timingNotes: 'Best conversion happens 7-14 days after challenge ends when they remember the work but haven\'t lost momentum'
        }
      },
      
      // Recurring Coaching (Continuity Program)
      {
        framework: {
          type: 'continuity-program',
          name: 'Recurring Revenue System',
          description: 'Ongoing service that provides continuous value while creating predictable recurring revenue.',
          keyPrinciples: [
            'Must provide ongoing value, not just periodic content',
            'Should solve evolving/advancing problems',
            'Create community and connection between members',
            'Price based on value of outcomes, not time spent'
          ],
          commonMistakes: [
            'Treating it like a membership site instead of coaching',
            'Not evolving content based on member progression',
            'Underpricing relative to business impact',
            'Failing to create member-to-member connections'
          ],
          successMetrics: [
            'Low monthly churn rate (<5%)',
            'High member engagement in community',
            'Members achieving measurable results',
            'Organic referrals from existing members'
          ]
        },
        
        realImplementation: {
          whatItActuallyIs: 'Elite mastermind for gym owners doing $30K+ monthly who want to scale to multiple locations, optimize operations, and build enterprise value.',
          whyItWorks: [
            'Exclusive positioning attracts serious operators only',
            'High price point filters for committed participants',
            'Peer learning accelerates results beyond solo coaching',
            'Direct access to Alex provides ultimate credibility',
            'Focus on scale problems, not startup problems'
          ],
          keyNumbers: [
            { metric: 'Monthly Price', value: '$20,000', context: 'Per member per month' },
            { metric: 'Member LTV', value: '$240,000+', context: 'Average 12+ month retention' },
            { metric: 'Conversion Rate', value: '35%', context: 'From program graduates' },
            { metric: 'Member Results', value: '3.2x ROI', context: 'Average business growth in year 1' }
          ],
          psychologyBehind: 'At this price and level, it becomes about peer status and continued advancement rather than basic knowledge. Members pay to stay connected to the highest level.',
          commonVariations: [
            'Industry-specific masterminds ($5K-$15K)',
            'Geographic/local business masterminds',
            'Skills-based tracks (marketing vs operations)',
            'Tiered levels (regional, national, international)'
          ]
        },
        
        masterclassNotes: {
          alexQuote: 'The best continuity programs aren\'t about what you teach - they\'re about who you become by being around other people at your level.',
          coreLesson: 'Continuity works when the value comes from the network and peer learning, not just from you delivering content.',
          implementationTips: [
            'Create member-only events and experiences',
            'Facilitate introductions between complementary members',
            'Share member wins and case studies regularly',
            'Evolve curriculum based on member businesses growing',
            'Include done-with-you implementation, not just strategy'
          ],
          warningsSigns: [
            'Members not interacting with each other',
            'Same questions being asked repeatedly',
            'Low attendance on group calls',
            'Members leaving after short periods'
          ]
        },
        
        flowStrategy: {
          fromPrevious: 'Program graduates who hit $30K+ months receive invitation to "join the operators already scaling past 6-figures."',
          toNext: 'This is the apex offer - focus on retention and referrals rather than upsells',
          conversionTactics: [
            'Month 2 of program: Case study of similar business scaling to 7-figures',
            'Month 3: Guest expert from mastermind shares advanced strategy',
            'Graduation: Application-only invitation to "see if you qualify"',
            'Social proof: Current member testimonials about peer network value'
          ],
          timingNotes: 'Best conversion when they hit their first $30K month and realize they need different problems solved'
        }
      }
    ],
    offerNodes: [
      {
        name: 'Free PDF Guide',
        description: '6-Week Challenge Blueprint',
        price: 0,
        type: 'attraction',
        status: 'active',
        position: { x: 100, y: 200 },
        size: { width: 300, height: 200 },
        metrics: {
          currentMonthlyRevenue: 0,
          projectedMonthlyRevenue: 0,
          averageOrderValue: 0,
          conversionRate: 2.3, // 2.3% of visitors convert to challenge
          trafficVolume: 5000,
          customersPerMonth: 115,
          costToDeliver: 0,
          profitMargin: 100,
          customerAcquisitionCost: 5,
          lifetimeValue: 680,
          deliveryTimeframe: 'immediate',
          customerEffortRequired: 2,
          marketDemand: 10,
          competitiveAdvantage: 8,
          implementationComplexity: 2
        },
        connections: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['lead-magnet', 'pdf']
      },
      {
        name: '6-Week Challenge',
        description: 'Transformation Challenge with Group Support',
        price: 39,
        type: 'attraction',
        status: 'active',
        position: { x: 500, y: 100 },
        size: { width: 300, height: 200 },
        metrics: {
          currentMonthlyRevenue: 4485,
          projectedMonthlyRevenue: 4485,
          averageOrderValue: 39,
          conversionRate: 66, // 66% go to main program
          trafficVolume: 115,
          customersPerMonth: 115,
          costToDeliver: 8,
          profitMargin: 79,
          customerAcquisitionCost: 5,
          lifetimeValue: 680,
          deliveryTimeframe: '6 weeks',
          customerEffortRequired: 6,
          marketDemand: 9,
          competitiveAdvantage: 9,
          implementationComplexity: 5
        },
        connections: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['challenge', 'community']
      },
      {
        name: 'Gym Launch Program',
        description: 'Complete Gym Business System',
        price: 600,
        type: 'core',
        status: 'active',
        position: { x: 900, y: 200 },
        size: { width: 300, height: 200 },
        metrics: {
          currentMonthlyRevenue: 45600,
          projectedMonthlyRevenue: 45600,
          averageOrderValue: 600,
          conversionRate: 35, // 35% of program buyers go recurring
          trafficVolume: 76,
          customersPerMonth: 76,
          costToDeliver: 120,
          profitMargin: 80,
          customerAcquisitionCost: 5,
          lifetimeValue: 20000,
          deliveryTimeframe: '90 days',
          customerEffortRequired: 8,
          marketDemand: 10,
          competitiveAdvantage: 10,
          implementationComplexity: 7
        },
        connections: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['program', 'system']
      },
      {
        name: 'Recurring Coaching',
        description: 'Ongoing Business Coaching & Support',
        price: 20000,
        type: 'continuity',
        status: 'active',
        position: { x: 1300, y: 100 },
        size: { width: 300, height: 200 },
        metrics: {
          currentMonthlyRevenue: 532000,
          projectedMonthlyRevenue: 532000,
          averageOrderValue: 20000,
          conversionRate: 0,
          trafficVolume: 27,
          customersPerMonth: 27,
          costToDeliver: 3000,
          profitMargin: 85,
          customerAcquisitionCost: 5,
          lifetimeValue: 20000,
          deliveryTimeframe: 'ongoing',
          customerEffortRequired: 9,
          marketDemand: 8,
          competitiveAdvantage: 10,
          implementationComplexity: 9
        },
        connections: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['recurring', 'high-ticket']
      }
    ],
    connections: [
      { conversionRate: 2.3, averageTimeBetween: 'immediate', trigger: 'pdf download' },
      { conversionRate: 66, averageTimeBetween: '2 weeks', trigger: 'challenge completion' },
      { conversionRate: 35, averageTimeBetween: '30 days', trigger: 'program success' }
    ]
  },
  
  {
    id: 'brunson-clickfunnels',
    name: 'Russell Brunson\'s ClickFunnels Model',
    description: 'The Perfect Webinar value ladder that built ClickFunnels into a $100M company.',
    category: 'saas',
    industryTags: ['saas', 'marketing', 'software', 'education'],
    difficulty: 'advanced',
    averageRevenueIncrease: 285,
    implementationTime: '6-12 months',
    successRate: 71,
    thumbnailUrl: '/templates/clickfunnels.svg',
    previewMetrics: {
      totalOffers: 4,
      avgPrice: 848,
      projectedRevenue: 28500
    },
    offerNodes: [
      {
        name: 'Expert Secrets Book',
        description: 'Free + Shipping Book Offer',
        price: 9.95,
        type: 'attraction',
        status: 'active',
        position: { x: 100, y: 200 },
        size: { width: 300, height: 200 },
        metrics: {
          currentMonthlyRevenue: 995,
          projectedMonthlyRevenue: 995,
          averageOrderValue: 9.95,
          conversionRate: 15, // 15% of book buyers go to course
          trafficVolume: 5000,
          customersPerMonth: 100,
          costToDeliver: 7,
          profitMargin: 30,
          customerAcquisitionCost: 15,
          lifetimeValue: 400,
          deliveryTimeframe: '7 days',
          customerEffortRequired: 3,
          marketDemand: 9,
          competitiveAdvantage: 8,
          implementationComplexity: 3
        },
        connections: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['book', 'shipping']
      },
      {
        name: 'Funnel Hacks Course',
        description: 'Complete Funnel Building Training',
        price: 97,
        type: 'core',
        status: 'active',
        position: { x: 500, y: 100 },
        size: { width: 300, height: 200 },
        metrics: {
          currentMonthlyRevenue: 1455,
          projectedMonthlyRevenue: 1455,
          averageOrderValue: 97,
          conversionRate: 30, // 30% of course buyers get OTO
          trafficVolume: 15,
          customersPerMonth: 15,
          costToDeliver: 15,
          profitMargin: 84,
          customerAcquisitionCost: 15,
          lifetimeValue: 400,
          deliveryTimeframe: '30 days',
          customerEffortRequired: 6,
          marketDemand: 10,
          competitiveAdvantage: 9,
          implementationComplexity: 5
        },
        connections: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['course', 'training']
      },
      {
        name: 'Funnel Hacks Masterclass',
        description: 'Advanced Funnel Strategies + Templates',
        price: 297,
        type: 'upsell',
        status: 'active',
        position: { x: 900, y: 200 },
        size: { width: 300, height: 200 },
        metrics: {
          currentMonthlyRevenue: 1336,
          projectedMonthlyRevenue: 1336,
          averageOrderValue: 297,
          conversionRate: 25, // 25% go to Inner Circle
          trafficVolume: 4.5,
          customersPerMonth: 4.5,
          costToDeliver: 30,
          profitMargin: 90,
          customerAcquisitionCost: 15,
          lifetimeValue: 2997,
          deliveryTimeframe: '60 days',
          customerEffortRequired: 7,
          marketDemand: 8,
          competitiveAdvantage: 9,
          implementationComplexity: 6
        },
        connections: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['masterclass', 'advanced']
      },
      {
        name: 'Inner Circle Mastermind',
        description: 'Exclusive High-Level Mastermind',
        price: 2997,
        type: 'upsell',
        status: 'active',
        position: { x: 1300, y: 100 },
        size: { width: 300, height: 200 },
        metrics: {
          currentMonthlyRevenue: 3371,
          projectedMonthlyRevenue: 3371,
          averageOrderValue: 2997,
          conversionRate: 0,
          trafficVolume: 1.125,
          customersPerMonth: 1.125,
          costToDeliver: 500,
          profitMargin: 83,
          customerAcquisitionCost: 15,
          lifetimeValue: 2997,
          deliveryTimeframe: '12 months',
          customerEffortRequired: 9,
          marketDemand: 7,
          competitiveAdvantage: 10,
          implementationComplexity: 8
        },
        connections: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['mastermind', 'exclusive']
      }
    ],
    
    successStory: {
      businessName: 'ClickFunnels',
      timeframe: '2014-2021', 
      results: [
        { metric: 'Revenue', before: '$0', after: '$100M+' },
        { metric: 'Users', before: '0', after: '100K+' }
      ],
      keyInsight: 'The Perfect Webinar framework created predictable, scalable conversions.'
    },
    
    offerEducation: [], // TODO: Add educational content for this template
    connections: [
      { conversionRate: 15, averageTimeBetween: 'immediate', trigger: 'book purchase' },
      { conversionRate: 30, averageTimeBetween: 'immediate', trigger: 'course purchase' },
      { conversionRate: 25, averageTimeBetween: '7 days', trigger: 'masterclass completion' }
    ]
  },

  {
    id: 'kennedy-gkic',
    
    successStory: {
      businessName: 'GKIC',
      timeframe: '1980-2020', 
      results: [
        { metric: 'Revenue', before: 'Unknown', after: '$100M+' },
        { metric: 'Members', before: '0', after: '10K+' }
      ],
      keyInsight: 'Progressive value ladder with recurring membership drove lifetime value.'
    },
    
    offerEducation: [], // TODO: Add educational content for this template
    name: 'Dan Kennedy\'s GKIC Empire',
    description: 'The legendary info marketing value ladder that generated over $100M in revenue.',
    category: 'info-marketing',
    industryTags: ['consulting', 'info-marketing', 'education', 'business'],
    difficulty: 'advanced',
    averageRevenueIncrease: 420,
    implementationTime: '12+ months',
    successRate: 65,
    thumbnailUrl: '/templates/gkic.svg',
    previewMetrics: {
      totalOffers: 4,
      avgPrice: 4548,
      projectedRevenue: 85000
    },
    offerNodes: [
      {
        name: 'No B.S. Newsletter',
        description: 'Monthly Business Newsletter',
        price: 97,
        type: 'attraction',
        status: 'active',
        position: { x: 100, y: 200 },
        size: { width: 300, height: 200 },
        metrics: {
          currentMonthlyRevenue: 9700,
          projectedMonthlyRevenue: 9700,
          averageOrderValue: 97,
          conversionRate: 23, // 23% go to Gold
          trafficVolume: 500,
          customersPerMonth: 100,
          costToDeliver: 12,
          profitMargin: 88,
          customerAcquisitionCost: 25,
          lifetimeValue: 2500,
          deliveryTimeframe: 'monthly',
          customerEffortRequired: 4,
          marketDemand: 8,
          competitiveAdvantage: 10,
          implementationComplexity: 4
        },
        connections: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['newsletter', 'monthly']
      },
      {
        name: 'Gold Membership',
        description: 'Gold Member Monthly Resources',
        price: 697,
        type: 'core',
        status: 'active',
        position: { x: 500, y: 100 },
        size: { width: 300, height: 200 },
        metrics: {
          currentMonthlyRevenue: 16031,
          projectedMonthlyRevenue: 16031,
          averageOrderValue: 697,
          conversionRate: 8, // 8% go to Platinum
          trafficVolume: 23,
          customersPerMonth: 23,
          costToDeliver: 80,
          profitMargin: 88,
          customerAcquisitionCost: 25,
          lifetimeValue: 5000,
          deliveryTimeframe: 'monthly',
          customerEffortRequired: 6,
          marketDemand: 9,
          competitiveAdvantage: 9,
          implementationComplexity: 6
        },
        connections: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['membership', 'gold']
      },
      {
        name: 'Platinum Membership',
        description: 'Premium Coaching & Resources',
        price: 2497,
        type: 'upsell',
        status: 'active',
        position: { x: 900, y: 200 },
        size: { width: 300, height: 200 },
        metrics: {
          currentMonthlyRevenue: 4594,
          projectedMonthlyRevenue: 4594,
          averageOrderValue: 2497,
          conversionRate: 12, // 12% go to Insiders Circle
          trafficVolume: 1.84,
          customersPerMonth: 1.84,
          costToDeliver: 300,
          profitMargin: 88,
          customerAcquisitionCost: 25,
          lifetimeValue: 15000,
          deliveryTimeframe: 'monthly',
          customerEffortRequired: 8,
          marketDemand: 7,
          competitiveAdvantage: 10,
          implementationComplexity: 7
        },
        connections: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['membership', 'platinum']
      },
      {
        name: 'Insiders Circle',
        description: 'Elite Mastermind & Direct Access',
        price: 15000,
        type: 'continuity',
        status: 'active',
        position: { x: 1300, y: 100 },
        size: { width: 300, height: 200 },
        metrics: {
          currentMonthlyRevenue: 33075,
          projectedMonthlyRevenue: 33075,
          averageOrderValue: 15000,
          conversionRate: 0,
          trafficVolume: 0.22,
          customersPerMonth: 0.22,
          costToDeliver: 2000,
          profitMargin: 87,
          customerAcquisitionCost: 25,
          lifetimeValue: 50000,
          deliveryTimeframe: 'quarterly',
          customerEffortRequired: 10,
          marketDemand: 5,
          competitiveAdvantage: 10,
          implementationComplexity: 10
        },
        connections: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['insiders', 'elite']
      }
    ],
    connections: [
      { conversionRate: 23, averageTimeBetween: '3 months', trigger: 'newsletter engagement' },
      { conversionRate: 8, averageTimeBetween: '6 months', trigger: 'gold member success' },
      { conversionRate: 12, averageTimeBetween: '12 months', trigger: 'platinum results' }
    ]
  },

  {
    id: 'saas-standard',
    
    successStory: {
      businessName: 'Typical SaaS',
      timeframe: '2-3 years',
      results: [
        { metric: 'MRR', before: '$0', after: '$50K+' },
        { metric: 'Churn Rate', before: '15%', after: '5%' }
      ],
      keyInsight: 'Freemium model with clear upgrade paths drives sustainable growth.'
    },
    
    offerEducation: [], // TODO: Add educational content for this template
    
    name: 'Standard SaaS Value Ladder',
    description: 'The proven SaaS pricing model used by companies like Slack, Zoom, and HubSpot.',
    category: 'saas',
    industryTags: ['saas', 'software', 'b2b', 'subscriptions'],
    difficulty: 'beginner',
    averageRevenueIncrease: 195,
    implementationTime: '2-4 months',
    successRate: 85,
    thumbnailUrl: '/templates/saas.svg',
    previewMetrics: {
      totalOffers: 4,
      avgPrice: 157,
      projectedRevenue: 18500
    },
    offerNodes: [
      {
        name: 'Free Trial',
        description: '14-Day Full Access Trial',
        price: 0,
        type: 'attraction',
        status: 'active',
        position: { x: 100, y: 200 },
        size: { width: 300, height: 200 },
        metrics: {
          currentMonthlyRevenue: 0,
          projectedMonthlyRevenue: 0,
          averageOrderValue: 0,
          conversionRate: 20, // 20% of trials convert to paid
          trafficVolume: 1000,
          customersPerMonth: 200,
          costToDeliver: 2,
          profitMargin: 100,
          customerAcquisitionCost: 50,
          lifetimeValue: 500,
          deliveryTimeframe: 'immediate',
          customerEffortRequired: 3,
          marketDemand: 10,
          competitiveAdvantage: 6,
          implementationComplexity: 3
        },
        connections: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['trial', 'free']
      },
      {
        name: 'Starter Plan',
        description: 'Basic Features for Small Teams',
        price: 29,
        type: 'core',
        status: 'active',
        position: { x: 500, y: 100 },
        size: { width: 300, height: 200 },
        metrics: {
          currentMonthlyRevenue: 5800,
          projectedMonthlyRevenue: 5800,
          averageOrderValue: 29,
          conversionRate: 35, // 35% upgrade to Pro
          trafficVolume: 200,
          customersPerMonth: 200,
          costToDeliver: 5,
          profitMargin: 83,
          customerAcquisitionCost: 50,
          lifetimeValue: 500,
          deliveryTimeframe: 'immediate',
          customerEffortRequired: 5,
          marketDemand: 10,
          competitiveAdvantage: 7,
          implementationComplexity: 4
        },
        connections: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['starter', 'basic']
      },
      {
        name: 'Pro Plan',
        description: 'Advanced Features for Growing Teams',
        price: 99,
        type: 'upsell',
        status: 'active',
        position: { x: 900, y: 200 },
        size: { width: 300, height: 200 },
        metrics: {
          currentMonthlyRevenue: 6930,
          projectedMonthlyRevenue: 6930,
          averageOrderValue: 99,
          conversionRate: 15, // 15% upgrade to Enterprise
          trafficVolume: 70,
          customersPerMonth: 70,
          costToDeliver: 12,
          profitMargin: 88,
          customerAcquisitionCost: 50,
          lifetimeValue: 1200,
          deliveryTimeframe: 'immediate',
          customerEffortRequired: 6,
          marketDemand: 9,
          competitiveAdvantage: 8,
          implementationComplexity: 5
        },
        connections: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['pro', 'popular']
      },
      {
        name: 'Enterprise Plan',
        description: 'Custom Solutions for Large Organizations',
        price: 499,
        type: 'upsell',
        status: 'active',
        position: { x: 1300, y: 100 },
        size: { width: 300, height: 200 },
        metrics: {
          currentMonthlyRevenue: 5240,
          projectedMonthlyRevenue: 5240,
          averageOrderValue: 499,
          conversionRate: 0,
          trafficVolume: 10.5,
          customersPerMonth: 10.5,
          costToDeliver: 75,
          profitMargin: 85,
          customerAcquisitionCost: 50,
          lifetimeValue: 5000,
          deliveryTimeframe: '30 days',
          customerEffortRequired: 8,
          marketDemand: 8,
          competitiveAdvantage: 9,
          implementationComplexity: 7
        },
        connections: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['enterprise', 'custom']
      }
    ],
    connections: [
      { conversionRate: 20, averageTimeBetween: '7 days', trigger: 'trial usage' },
      { conversionRate: 35, averageTimeBetween: '3 months', trigger: 'feature limits' },
      { conversionRate: 15, averageTimeBetween: '6 months', trigger: 'team growth' }
    ]
  },

  {
    id: 'ecommerce-standard',
    
    successStory: {
      businessName: 'E-commerce Brand',
      timeframe: '18 months',
      results: [
        { metric: 'Revenue', before: '$0', after: '$1M+' },
        { metric: 'LTV', before: '$50', after: '$200' }
      ],
      keyInsight: 'Tripwire product creates customers, continuity creates lifetime value.'
    },
    
    offerEducation: [], // TODO: Add educational content for this template
    
    name: 'E-commerce Value Ladder',
    description: 'The conversion-optimized e-commerce model that turns browsers into lifetime customers.',
    category: 'ecommerce',
    industryTags: ['ecommerce', 'retail', 'products', 'subscriptions'],
    difficulty: 'intermediate',
    averageRevenueIncrease: 225,
    implementationTime: '4-8 months',
    successRate: 72,
    thumbnailUrl: '/templates/ecommerce.svg',
    previewMetrics: {
      totalOffers: 4,
      avgPrice: 93,
      projectedRevenue: 15200
    },
    offerNodes: [
      {
        name: 'Lead Magnet',
        description: 'Free Guide + Email Capture',
        price: 0,
        type: 'attraction',
        status: 'active',
        position: { x: 100, y: 200 },
        size: { width: 300, height: 200 },
        metrics: {
          currentMonthlyRevenue: 0,
          projectedMonthlyRevenue: 0,
          averageOrderValue: 0,
          conversionRate: 8, // 8% of leads buy tripwire
          trafficVolume: 2000,
          customersPerMonth: 160,
          costToDeliver: 0,
          profitMargin: 100,
          customerAcquisitionCost: 5,
          lifetimeValue: 150,
          deliveryTimeframe: 'immediate',
          customerEffortRequired: 2,
          marketDemand: 9,
          competitiveAdvantage: 6,
          implementationComplexity: 2
        },
        connections: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['lead-magnet', 'free']
      },
      {
        name: 'Tripwire Product',
        description: 'Irresistible Low-Price Offer',
        price: 27,
        type: 'attraction',
        status: 'active',
        position: { x: 500, y: 100 },
        size: { width: 300, height: 200 },
        metrics: {
          currentMonthlyRevenue: 432,
          projectedMonthlyRevenue: 432,
          averageOrderValue: 27,
          conversionRate: 25, // 25% buy core product
          trafficVolume: 16,
          customersPerMonth: 16,
          costToDeliver: 8,
          profitMargin: 70,
          customerAcquisitionCost: 5,
          lifetimeValue: 150,
          deliveryTimeframe: '3 days',
          customerEffortRequired: 3,
          marketDemand: 8,
          competitiveAdvantage: 7,
          implementationComplexity: 3
        },
        connections: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['tripwire', 'low-price']
      },
      {
        name: 'Core Product',
        description: 'Main Product Line',
        price: 197,
        type: 'core',
        status: 'active',
        position: { x: 900, y: 200 },
        size: { width: 300, height: 200 },
        metrics: {
          currentMonthlyRevenue: 788,
          projectedMonthlyRevenue: 788,
          averageOrderValue: 197,
          conversionRate: 40, // 40% subscribe to continuity
          trafficVolume: 4,
          customersPerMonth: 4,
          costToDeliver: 50,
          profitMargin: 75,
          customerAcquisitionCost: 5,
          lifetimeValue: 400,
          deliveryTimeframe: '7 days',
          customerEffortRequired: 5,
          marketDemand: 9,
          competitiveAdvantage: 8,
          implementationComplexity: 5
        },
        connections: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['core', 'main-product']
      },
      {
        name: 'Subscription Box',
        description: 'Monthly Product Subscription',
        price: 47,
        type: 'continuity',
        status: 'active',
        position: { x: 1300, y: 100 },
        size: { width: 300, height: 200 },
        metrics: {
          currentMonthlyRevenue: 75,
          projectedMonthlyRevenue: 75,
          averageOrderValue: 47,
          conversionRate: 0,
          trafficVolume: 1.6,
          customersPerMonth: 1.6,
          costToDeliver: 20,
          profitMargin: 57,
          customerAcquisitionCost: 5,
          lifetimeValue: 470,
          deliveryTimeframe: 'monthly',
          customerEffortRequired: 4,
          marketDemand: 7,
          competitiveAdvantage: 6,
          implementationComplexity: 6
        },
        connections: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['subscription', 'recurring']
      }
    ],
    connections: [
      { conversionRate: 8, averageTimeBetween: '1 day', trigger: 'email sequence' },
      { conversionRate: 25, averageTimeBetween: '3 days', trigger: 'tripwire satisfaction' },
      { conversionRate: 40, averageTimeBetween: '14 days', trigger: 'product satisfaction' }
    ]
  },

  {
    id: 'coaching-consulting',
    
    successStory: {
      businessName: 'Coaching Business',
      timeframe: '12 months',
      results: [
        { metric: 'Revenue', before: '$0', after: '$500K+' },
        { metric: 'Students', before: '0', after: '200+' }
      ],
      keyInsight: 'Free value builds trust, group coaching scales expertise profitably.'
    },
    
    offerEducation: [], // TODO: Add educational content for this template
    
    name: 'Coaching & Consulting Model',
    description: 'The high-value service ladder that scales personal expertise into multiple revenue streams.',
    category: 'services',
    industryTags: ['coaching', 'consulting', 'services', 'expertise'],
    difficulty: 'beginner',
    averageRevenueIncrease: 350,
    implementationTime: '3-6 months',
    successRate: 80,
    thumbnailUrl: '/templates/coaching.svg',
    previewMetrics: {
      totalOffers: 4,
      avgPrice: 3374,
      projectedRevenue: 25500
    },
    offerNodes: [
      {
        name: 'Free Strategy Call',
        description: '45-Minute Discovery Call',
        price: 0,
        type: 'attraction',
        status: 'active',
        position: { x: 100, y: 200 },
        size: { width: 300, height: 200 },
        metrics: {
          currentMonthlyRevenue: 0,
          projectedMonthlyRevenue: 0,
          averageOrderValue: 0,
          conversionRate: 30, // 30% buy course
          trafficVolume: 100,
          customersPerMonth: 30,
          costToDeliver: 0,
          profitMargin: 100,
          customerAcquisitionCost: 25,
          lifetimeValue: 2500,
          deliveryTimeframe: 'immediate',
          customerEffortRequired: 4,
          marketDemand: 9,
          competitiveAdvantage: 8,
          implementationComplexity: 2
        },
        connections: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['consultation', 'free']
      },
      {
        name: 'Online Course',
        description: 'Comprehensive Training Program',
        price: 497,
        type: 'core',
        status: 'active',
        position: { x: 500, y: 100 },
        size: { width: 300, height: 200 },
        metrics: {
          currentMonthlyRevenue: 4470,
          projectedMonthlyRevenue: 4470,
          averageOrderValue: 497,
          conversionRate: 20, // 20% upgrade to group
          trafficVolume: 9,
          customersPerMonth: 9,
          costToDeliver: 50,
          profitMargin: 90,
          customerAcquisitionCost: 25,
          lifetimeValue: 2500,
          deliveryTimeframe: '60 days',
          customerEffortRequired: 7,
          marketDemand: 10,
          competitiveAdvantage: 8,
          implementationComplexity: 4
        },
        connections: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['course', 'training']
      },
      {
        name: 'Group Coaching',
        description: 'Small Group Mastermind',
        price: 2997,
        type: 'upsell',
        status: 'active',
        position: { x: 900, y: 200 },
        size: { width: 300, height: 200 },
        metrics: {
          currentMonthlyRevenue: 5394,
          projectedMonthlyRevenue: 5394,
          averageOrderValue: 2997,
          conversionRate: 33, // 33% go to 1-on-1
          trafficVolume: 1.8,
          customersPerMonth: 1.8,
          costToDeliver: 300,
          profitMargin: 90,
          customerAcquisitionCost: 25,
          lifetimeValue: 12000,
          deliveryTimeframe: '6 months',
          customerEffortRequired: 8,
          marketDemand: 8,
          competitiveAdvantage: 9,
          implementationComplexity: 6
        },
        connections: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['group', 'mastermind']
      },
      {
        name: '1-on-1 Coaching',
        description: 'Private Coaching Intensive',
        price: 10000,
        type: 'upsell',
        status: 'active',
        position: { x: 1300, y: 100 },
        size: { width: 300, height: 200 },
        metrics: {
          currentMonthlyRevenue: 5940,
          projectedMonthlyRevenue: 5940,
          averageOrderValue: 10000,
          conversionRate: 0,
          trafficVolume: 0.594,
          customersPerMonth: 0.594,
          costToDeliver: 1000,
          profitMargin: 90,
          customerAcquisitionCost: 25,
          lifetimeValue: 25000,
          deliveryTimeframe: '12 months',
          customerEffortRequired: 10,
          marketDemand: 6,
          competitiveAdvantage: 10,
          implementationComplexity: 7
        },
        connections: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['private', 'high-ticket']
      }
    ],
    connections: [
      { conversionRate: 30, averageTimeBetween: 'immediate', trigger: 'strategy call close' },
      { conversionRate: 20, averageTimeBetween: '30 days', trigger: 'course completion' },
      { conversionRate: 33, averageTimeBetween: '90 days', trigger: 'group success' }
    ]
  }
]

export function getTemplateById(id: string): MoneyModelTemplate | undefined {
  return MONEY_MODEL_TEMPLATES.find(template => template.id === id)
}

export function getTemplatesByCategory(category: string): MoneyModelTemplate[] {
  return MONEY_MODEL_TEMPLATES.filter(template => template.category === category)
}

export function getTemplatesByIndustry(industry: string): MoneyModelTemplate[] {
  return MONEY_MODEL_TEMPLATES.filter(template => 
    template.industryTags.includes(industry.toLowerCase())
  )
}

export function getTemplatesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): MoneyModelTemplate[] {
  return MONEY_MODEL_TEMPLATES.filter(template => template.difficulty === difficulty)
}