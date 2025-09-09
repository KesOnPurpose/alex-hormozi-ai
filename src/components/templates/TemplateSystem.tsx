'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Star,
  Clock,
  Users,
  TrendingUp,
  Target,
  Zap,
  CheckCircle,
  ArrowRight,
  Download,
  Heart,
  Eye
} from 'lucide-react';

interface Template {
  id: string;
  title: string;
  description: string;
  category: 'grand_slam_offer' | 'constraint_solving' | '4_prong_money' | 'cfa_optimization' | 'value_equation';
  businessType: 'service' | 'product' | 'saas' | 'ecommerce' | 'coaching' | 'agency' | 'franchise';
  revenueRange: '0-10k' | '10k-50k' | '50k-250k' | '250k-1m' | '1m+';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  framework: string;
  tags: string[];
  rating: number;
  usageCount: number;
  isFavorite: boolean;
  components: TemplateComponent[];
  outcomes: string[];
  requirements: string[];
}

interface TemplateComponent {
  type: 'milestone' | 'goal' | 'metric' | 'action' | 'framework_application';
  title: string;
  description: string;
  timeframe?: string;
  targetValue?: number;
  unit?: string;
  priority: 'high' | 'medium' | 'low';
  hormoziFramework: string;
}

interface TemplateSystemProps {
  onTemplateSelect: (template: Template) => void;
  selectedCategories?: string[];
  selectedBusinessTypes?: string[];
}

export function TemplateSystem({ 
  onTemplateSelect, 
  selectedCategories = [], 
  selectedBusinessTypes = [] 
}: TemplateSystemProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'recent'>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const templateDatabase: Template[] = [
    {
      id: 'gso-service-scaling',
      title: 'Service Business Grand Slam Offer',
      description: 'Transform your service business with an irresistible offer that increases close rates and pricing power',
      category: 'grand_slam_offer',
      businessType: 'service',
      revenueRange: '10k-50k',
      difficulty: 'intermediate',
      estimatedTime: '2-3 weeks',
      framework: 'Value Equation + Offer Creation',
      tags: ['high-value', 'service-based', 'pricing', 'positioning'],
      rating: 4.8,
      usageCount: 1247,
      isFavorite: true,
      outcomes: [
        'Increase close rates by 40-60%',
        'Command premium pricing',
        'Reduce sales cycle length',
        'Create market differentiation'
      ],
      requirements: [
        'Existing service business with revenue',
        'Clear target audience definition',
        'Basic understanding of customer pain points'
      ],
      components: [
        {
          type: 'framework_application',
          title: 'Value Equation Analysis',
          description: 'Maximize (Dream Outcome × Perceived Likelihood) / (Time Delay × Effort & Sacrifice)',
          priority: 'high',
          hormoziFramework: 'Value Equation'
        },
        {
          type: 'milestone',
          title: 'Complete Market Research',
          description: 'Identify top 3 customer pain points and desired outcomes',
          timeframe: '3-5 days',
          priority: 'high',
          hormoziFramework: 'Grand Slam Offer'
        },
        {
          type: 'goal',
          title: 'Create Irresistible Offer Package',
          description: 'Bundle services with bonuses, guarantees, and urgency/scarcity',
          timeframe: '1 week',
          priority: 'high',
          hormoziFramework: 'Offer Creation'
        },
        {
          type: 'metric',
          title: 'Close Rate Improvement',
          description: 'Track conversion rate from leads to clients',
          targetValue: 50,
          unit: '% increase',
          priority: 'high',
          hormoziFramework: 'Performance Tracking'
        }
      ]
    },
    {
      id: 'constraint-lead-gen',
      title: 'Lead Generation Constraint Solver',
      description: 'Systematic approach to identify and eliminate lead generation bottlenecks using the 4 Universal Constraints',
      category: 'constraint_solving',
      businessType: 'agency',
      revenueRange: '50k-250k',
      difficulty: 'intermediate',
      estimatedTime: '3-4 weeks',
      framework: '4 Universal Constraints',
      tags: ['lead-generation', 'bottlenecks', 'scaling', 'systematic'],
      rating: 4.6,
      usageCount: 892,
      isFavorite: false,
      outcomes: [
        'Identify primary constraint limiting growth',
        'Increase lead volume by 200-300%',
        'Improve lead quality and conversion',
        'Create scalable lead generation system'
      ],
      requirements: [
        'Existing marketing activities',
        'Basic lead tracking system',
        'Understanding of current funnel metrics'
      ],
      components: [
        {
          type: 'framework_application',
          title: 'Constraint Identification Audit',
          description: 'Analyze leads, conversion, fulfillment, and profit margins to find bottleneck',
          priority: 'high',
          hormoziFramework: '4 Universal Constraints'
        },
        {
          type: 'milestone',
          title: 'Lead Volume Baseline',
          description: 'Establish current lead generation metrics and sources',
          timeframe: '2-3 days',
          priority: 'high',
          hormoziFramework: 'Constraint Analysis'
        },
        {
          type: 'action',
          title: 'Implement Lead Magnet Strategy',
          description: 'Create high-value lead magnets targeting ideal customer pain points',
          timeframe: '1 week',
          priority: 'high',
          hormoziFramework: 'Lead Generation'
        },
        {
          type: 'metric',
          title: 'Lead Generation Volume',
          description: 'Monthly qualified leads generated',
          targetValue: 250,
          unit: '% increase',
          priority: 'high',
          hormoziFramework: 'Performance Tracking'
        }
      ]
    },
    {
      id: '4prong-saas-recurring',
      title: 'SaaS 4-Prong Money Model',
      description: 'Maximize SaaS revenue through strategic upsells, downsells, cross-sells, and continuity optimization',
      category: '4_prong_money',
      businessType: 'saas',
      revenueRange: '250k-1m',
      difficulty: 'advanced',
      estimatedTime: '4-6 weeks',
      framework: '4-Prong Money Model',
      tags: ['recurring-revenue', 'upsells', 'churn-reduction', 'ltv'],
      rating: 4.9,
      usageCount: 567,
      isFavorite: true,
      outcomes: [
        'Increase ARPU by 60-80%',
        'Reduce churn rate by 40%',
        'Implement systematic upsell sequences',
        'Optimize pricing tiers and packaging'
      ],
      requirements: [
        'SaaS product with existing customer base',
        'Subscription billing system in place',
        'Customer usage and behavior data'
      ],
      components: [
        {
          type: 'framework_application',
          title: '4-Prong Revenue Analysis',
          description: 'Audit current upsells, downsells, cross-sells, and continuity systems',
          priority: 'high',
          hormoziFramework: '4-Prong Money Model'
        },
        {
          type: 'milestone',
          title: 'Customer Segmentation Map',
          description: 'Identify customer segments and their expansion opportunities',
          timeframe: '1 week',
          priority: 'high',
          hormoziFramework: 'Customer Analysis'
        },
        {
          type: 'goal',
          title: 'Implement Upsell Automation',
          description: 'Create automated upsell sequences based on usage triggers',
          timeframe: '2-3 weeks',
          priority: 'high',
          hormoziFramework: 'Revenue Optimization'
        },
        {
          type: 'metric',
          title: 'Monthly Recurring Revenue Growth',
          description: 'Track MRR expansion from existing customers',
          targetValue: 70,
          unit: '% increase',
          priority: 'high',
          hormoziFramework: 'Revenue Tracking'
        }
      ]
    },
    {
      id: 'cfa-ecommerce-optimization',
      title: 'E-commerce CFA Optimization',
      description: 'Optimize Customer Acquisition Cost and maximize profitability through strategic CFA implementation',
      category: 'cfa_optimization',
      businessType: 'ecommerce',
      revenueRange: '50k-250k',
      difficulty: 'intermediate',
      estimatedTime: '2-3 weeks',
      framework: 'CFA (Customer, Fulfillment, Acquisition)',
      tags: ['customer-acquisition', 'profitability', 'scaling', 'optimization'],
      rating: 4.7,
      usageCount: 734,
      isFavorite: false,
      outcomes: [
        'Reduce CAC by 30-50%',
        'Increase customer lifetime value',
        'Optimize fulfillment costs',
        'Scale profitable ad campaigns'
      ],
      requirements: [
        'Running paid advertising campaigns',
        'E-commerce store with transaction data',
        'Basic understanding of unit economics'
      ],
      components: [
        {
          type: 'framework_application',
          title: 'CFA System Audit',
          description: 'Analyze customer acquisition costs, fulfillment efficiency, and profitability',
          priority: 'high',
          hormoziFramework: 'CFA Framework'
        },
        {
          type: 'milestone',
          title: 'Unit Economics Baseline',
          description: 'Calculate current CAC, LTV, and contribution margins',
          timeframe: '3-5 days',
          priority: 'high',
          hormoziFramework: 'Financial Analysis'
        },
        {
          type: 'action',
          title: 'Optimize Ad Spend Allocation',
          description: 'Reallocate budget to highest ROI channels and audiences',
          timeframe: '1 week',
          priority: 'high',
          hormoziFramework: 'Acquisition Optimization'
        },
        {
          type: 'metric',
          title: 'Customer Acquisition Cost',
          description: 'Average cost to acquire one customer',
          targetValue: 40,
          unit: '% reduction',
          priority: 'high',
          hormoziFramework: 'CFA Tracking'
        }
      ]
    },
    {
      id: 'value-equation-coaching',
      title: 'Coaching Business Value Maximization',
      description: 'Apply Value Equation principles to create premium coaching programs with maximum perceived value',
      category: 'value_equation',
      businessType: 'coaching',
      revenueRange: '10k-50k',
      difficulty: 'beginner',
      estimatedTime: '1-2 weeks',
      framework: 'Value Equation',
      tags: ['coaching', 'premium-pricing', 'value-creation', 'positioning'],
      rating: 4.5,
      usageCount: 1156,
      isFavorite: true,
      outcomes: [
        'Increase program pricing by 100-200%',
        'Improve client results and satisfaction',
        'Reduce delivery time and effort',
        'Create scalable coaching systems'
      ],
      requirements: [
        'Coaching or consulting business',
        'Clear niche and target audience',
        'Basic program or service offering'
      ],
      components: [
        {
          type: 'framework_application',
          title: 'Value Equation Optimization',
          description: 'Maximize dream outcome and likelihood while minimizing time delay and effort',
          priority: 'high',
          hormoziFramework: 'Value Equation'
        },
        {
          type: 'milestone',
          title: 'Dream Outcome Definition',
          description: 'Clearly define and quantify client transformation goals',
          timeframe: '2-3 days',
          priority: 'high',
          hormoziFramework: 'Outcome Clarity'
        },
        {
          type: 'goal',
          title: 'Program Restructure',
          description: 'Redesign coaching program to maximize value equation variables',
          timeframe: '1 week',
          priority: 'high',
          hormoziFramework: 'Program Design'
        },
        {
          type: 'metric',
          title: 'Program Pricing Power',
          description: 'Average program price increase',
          targetValue: 150,
          unit: '% increase',
          priority: 'high',
          hormoziFramework: 'Value Measurement'
        }
      ]
    },
    {
      id: 'franchise-scaling-template',
      title: 'Franchise System Scaling',
      description: 'Comprehensive template for scaling franchise operations using Hormozi\'s proven systems',
      category: 'constraint_solving',
      businessType: 'franchise',
      revenueRange: '1m+',
      difficulty: 'advanced',
      estimatedTime: '6-8 weeks',
      framework: 'Full Hormozi System Integration',
      tags: ['franchise', 'scaling', 'systems', 'operations'],
      rating: 4.8,
      usageCount: 234,
      isFavorite: false,
      outcomes: [
        'Accelerate franchise expansion',
        'Standardize operations across locations',
        'Improve franchisee success rates',
        'Optimize unit economics per location'
      ],
      requirements: [
        'Existing franchise concept',
        'Proven business model',
        'Capital for expansion'
      ],
      components: [
        {
          type: 'framework_application',
          title: 'Multi-Location Constraint Analysis',
          description: 'Identify constraints at corporate and franchisee levels',
          priority: 'high',
          hormoziFramework: 'Systematic Scaling'
        },
        {
          type: 'milestone',
          title: 'Franchise Performance Metrics',
          description: 'Establish KPIs for franchise success measurement',
          timeframe: '1 week',
          priority: 'high',
          hormoziFramework: 'Performance Systems'
        }
      ]
    }
  ];

  const categories = [
    { id: 'all', label: 'All Categories', icon: Target },
    { id: 'grand_slam_offer', label: 'Grand Slam Offers', icon: Star },
    { id: 'constraint_solving', label: 'Constraint Solving', icon: Zap },
    { id: '4_prong_money', label: '4-Prong Money Model', icon: TrendingUp },
    { id: 'cfa_optimization', label: 'CFA Optimization', icon: Users },
    { id: 'value_equation', label: 'Value Equation', icon: CheckCircle }
  ];

  const businessTypes = [
    { id: 'all', label: 'All Business Types' },
    { id: 'service', label: 'Service Business' },
    { id: 'product', label: 'Product Business' },
    { id: 'saas', label: 'SaaS' },
    { id: 'ecommerce', label: 'E-commerce' },
    { id: 'coaching', label: 'Coaching' },
    { id: 'agency', label: 'Agency' },
    { id: 'franchise', label: 'Franchise' }
  ];

  const filteredTemplates = useMemo(() => {
    let filtered = templateDatabase.filter(template => {
      const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      const matchesBusinessType = selectedBusinessType === 'all' || template.businessType === selectedBusinessType;
      const matchesDifficulty = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesBusinessType && matchesDifficulty;
    });

    // Sort templates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.usageCount - a.usageCount;
        case 'rating':
          return b.rating - a.rating;
        case 'recent':
          return b.usageCount - a.usageCount; // Using usage as proxy for recent
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, selectedBusinessType, selectedDifficulty, sortBy]);

  const getCategoryIcon = (category: string) => {
    const categoryObj = categories.find(c => c.id === category);
    return categoryObj?.icon || Target;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-400/10';
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/10';
      case 'advanced': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getBusinessTypeIcon = (businessType: string) => {
    switch (businessType) {
      case 'service': return '🔧';
      case 'product': return '📦';
      case 'saas': return '💻';
      case 'ecommerce': return '🛒';
      case 'coaching': return '🎯';
      case 'agency': return '🏢';
      case 'franchise': return '🏬';
      default: return '💼';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Business Templates</h2>
        <p className="text-gray-300">Proven templates based on Alex Hormozi's frameworks for rapid business transformation</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              showFilters 
                ? 'bg-purple-600 text-white' 
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4 border-t border-white/10">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-400"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id} className="bg-slate-800">
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Business Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Business Type</label>
              <select
                value={selectedBusinessType}
                onChange={(e) => setSelectedBusinessType(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-400"
              >
                {businessTypes.map(type => (
                  <option key={type.id} value={type.id} className="bg-slate-800">
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-400"
              >
                <option value="all" className="bg-slate-800">All Levels</option>
                <option value="beginner" className="bg-slate-800">Beginner</option>
                <option value="intermediate" className="bg-slate-800">Intermediate</option>
                <option value="advanced" className="bg-slate-800">Advanced</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'popular' | 'rating' | 'recent')}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-400"
              >
                <option value="popular" className="bg-slate-800">Most Popular</option>
                <option value="rating" className="bg-slate-800">Highest Rated</option>
                <option value="recent" className="bg-slate-800">Recently Added</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-300">
          Found {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
        </p>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
              <div className="bg-current rounded-sm"></div>
              <div className="bg-current rounded-sm"></div>
              <div className="bg-current rounded-sm"></div>
              <div className="bg-current rounded-sm"></div>
            </div>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <div className="w-4 h-4 flex flex-col gap-0.5">
              <div className="bg-current h-0.5 rounded"></div>
              <div className="bg-current h-0.5 rounded"></div>
              <div className="bg-current h-0.5 rounded"></div>
            </div>
          </button>
        </div>
      </div>

      {/* Templates Grid/List */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' 
          : 'grid-cols-1'
      }`}>
        {filteredTemplates.map((template) => {
          const CategoryIcon = getCategoryIcon(template.category);
          
          return (
            <div
              key={template.id}
              className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 hover:border-purple-400/50 transition-all duration-300 cursor-pointer group"
              onClick={() => onTemplateSelect(template)}
            >
              {viewMode === 'grid' ? (
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-600/20 rounded-lg p-2">
                        <CategoryIcon className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <span className="text-2xl">{getBusinessTypeIcon(template.businessType)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {template.isFavorite && (
                        <Heart className="h-4 w-4 text-red-400 fill-current" />
                      )}
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-300">{template.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Title and Description */}
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {template.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-3">
                    {template.description}
                  </p>

                  {/* Framework */}
                  <div className="flex items-center space-x-2 mb-4">
                    <Zap className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm text-gray-300">{template.framework}</span>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{template.estimatedTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{template.usageCount}</span>
                    </div>
                  </div>

                  {/* Difficulty Badge */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                      {template.difficulty}
                    </span>
                    <ArrowRight className="h-4 w-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ) : (
                <div className="p-6 flex items-center space-x-6">
                  {/* Icon and Business Type */}
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-600/20 rounded-lg p-3">
                      <CategoryIcon className="h-6 w-6 text-purple-400" />
                    </div>
                    <span className="text-3xl">{getBusinessTypeIcon(template.businessType)}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors">
                        {template.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {template.isFavorite && (
                          <Heart className="h-4 w-4 text-red-400 fill-current" />
                        )}
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-300">{template.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-400 mb-3">
                      {template.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Zap className="h-4 w-4 text-yellow-400" />
                          <span>{template.framework}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{template.estimatedTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{template.usageCount}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                          {template.difficulty}
                        </span>
                        <ArrowRight className="h-5 w-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-white mb-2">No templates found</h3>
          <p className="text-gray-400 mb-4">Try adjusting your search criteria or filters</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedBusinessType('all');
              setSelectedDifficulty('all');
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}