'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircle, 
  ArrowRight, 
  Target,
  DollarSign, 
  Users, 
  BarChart,
  Building,
  Star,
  Zap,
  Brain,
  TrendingUp,
  AlertCircle,
  Clock,
  Award,
  Lightbulb,
  Play,
  Download,
  Share2
} from 'lucide-react';

interface BusinessProfile {
  businessStage: string;
  monthlyRevenue: string;
  primaryChallenge: string;
  businessType: string;
  industry: string;
  teamSize: string;
  knowsMetrics: boolean;
  desiredOutcome: string;
  sophisticationScore: number;
  assessmentData: Record<string, any>;
}

interface RecommendedPath {
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  frameworks: string[];
}

interface AssessmentResultsProps {
  profile: BusinessProfile;
  onContinue?: (route: string) => void;
}

export function AssessmentResults({ profile, onContinue }: AssessmentResultsProps) {
  const router = useRouter();
  const [selectedPath, setSelectedPath] = useState<string>('');
  const [showDetails, setShowDetails] = useState(false);

  // Generate personalized recommendations based on profile
  const generateRecommendations = (): RecommendedPath[] => {
    const recommendations: RecommendedPath[] = [];

    // Primary constraint-based recommendations
    if (profile.primaryChallenge === 'leads') {
      recommendations.push({
        title: 'Lead Generation Mastery',
        description: 'Focus on solving your lead constraint using proven acquisition frameworks',
        icon: <Target className="w-6 h-6" />,
        route: '/agents/constraint-analyzer',
        priority: 'high',
        estimatedTime: '15-30 minutes',
        frameworks: ['4 Universal Constraints', 'Lead Magnets', 'Traffic Systems']
      });
    }

    if (profile.primaryChallenge === 'conversion') {
      recommendations.push({
        title: 'Grand Slam Offer Creation',
        description: 'Build irresistible offers that convert leads into paying customers',
        icon: <DollarSign className="w-6 h-6" />,
        route: '/agents/offer-analyzer',
        priority: 'high',
        estimatedTime: '20-40 minutes',
        frameworks: ['Grand Slam Offer', 'Value Equation', 'Pricing Psychology']
      });
    }

    if (profile.primaryChallenge === 'profit') {
      recommendations.push({
        title: 'Money Model Optimization',
        description: 'Design a 4-prong money model to maximize revenue per customer',
        icon: <BarChart className="w-6 h-6" />,
        route: '/agents/money-model-architect',
        priority: 'high',
        estimatedTime: '25-45 minutes',
        frameworks: ['4-Prong Money Model', 'Upsell Sequences', 'LTV Optimization']
      });
    }

    if (profile.primaryChallenge === 'unsure') {
      recommendations.push({
        title: 'Complete Constraint Analysis',
        description: 'Identify your real bottleneck with comprehensive business diagnostics',
        icon: <Brain className="w-6 h-6" />,
        route: '/agents/constraint-analyzer',
        priority: 'high',
        estimatedTime: '30-60 minutes',
        frameworks: ['4 Universal Constraints', 'Business Diagnostics', 'Growth Analysis']
      });
    }

    // Sophistication-based recommendations
    if (profile.sophisticationScore >= 8) {
      recommendations.push({
        title: 'Advanced Agent Collaboration',
        description: 'Access all AI agents for comprehensive multi-framework analysis',
        icon: <Zap className="w-6 h-6" />,
        route: '/agents',
        priority: 'medium',
        estimatedTime: '45-90 minutes',
        frameworks: ['All Frameworks', 'Advanced Analytics', 'Custom Strategies']
      });
    }

    // Add chat option for personalized guidance
    recommendations.push({
      title: 'Guided AI Coaching Session',
      description: 'Start with an interactive coaching session tailored to your specific situation',
      icon: <Users className="w-6 h-6" />,
      route: '/chat',
      priority: profile.sophisticationScore < 4 ? 'high' : 'medium',
      estimatedTime: '10-20 minutes',
      frameworks: ['Adaptive Coaching', 'Personalized Insights', 'Interactive Analysis']
    });

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const recommendations = generateRecommendations();
  const primaryRecommendation = recommendations[0];

  const getStageInfo = () => {
    const stageMap = {
      'complete_beginner': {
        title: 'Idea Stage Explorer',
        description: 'Ready to transform your idea into a profitable business',
        color: 'text-blue-400',
        icon: <Lightbulb className="w-8 h-8" />
      },
      'have_business': {
        title: 'Growth Stage Entrepreneur', 
        description: 'Building momentum and breaking through constraints',
        color: 'text-green-400',
        icon: <TrendingUp className="w-8 h-8" />
      },
      'scaling_business': {
        title: 'Scale Stage Operator',
        description: 'Systematizing for explosive growth',
        color: 'text-orange-400', 
        icon: <BarChart className="w-8 h-8" />
      },
      'experienced_operator': {
        title: 'Advanced Business Strategist',
        description: 'Optimizing for maximum efficiency and profit',
        color: 'text-purple-400',
        icon: <Award className="w-8 h-8" />
      }
    };

    return stageMap[profile.businessStage as keyof typeof stageMap] || stageMap.complete_beginner;
  };

  const getIndustryInsight = () => {
    const industryInsights = {
      'coaching_consulting': 'Perfect for Alex Hormozi\'s expertise - high-margin, scalable knowledge business',
      'ecommerce': 'Great opportunity for 4-prong money models and upsell optimization',
      'saas_software': 'Ideal for LTV optimization and subscription revenue modeling',
      'agency_services': 'Focus on systemization and delivery constraint optimization',
      'local_business': 'Excellent for grand slam offers and local market domination',
      'health_fitness': 'Alex\'s specialty - proven frameworks for gym and fitness businesses',
      'real_estate': 'High-value transactions perfect for advanced money models'
    };

    return industryInsights[profile.industry as keyof typeof industryInsights] || 
           'Industry-specific strategies available through our comprehensive analysis';
  };

  const handleContinue = (route: string) => {
    if (onContinue) {
      onContinue(route);
    } else {
      router.push(route);
    }
  };

  const stageInfo = getStageInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-green-500/20 border border-green-500/50">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Assessment Complete!
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Based on your responses, we've identified your business profile and created a personalized action plan.
          </p>
        </div>

        {/* Results Grid */}
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8 mb-12">
          
          {/* Business Profile */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 h-full">
              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${stageInfo.color.replace('text', 'bg').replace('-400', '-500/20')}`}>
                  {stageInfo.icon}
                </div>
                <h3 className={`text-xl font-bold ${stageInfo.color} mb-2`}>
                  {stageInfo.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {stageInfo.description}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <span className="text-gray-400">Industry:</span>
                  <span className="text-white font-medium">
                    {profile.industry?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'General'}
                  </span>
                </div>
                
                {profile.monthlyRevenue && (
                  <div className="flex items-center justify-between py-2 border-b border-white/10">
                    <span className="text-gray-400">Revenue Stage:</span>
                    <span className="text-green-400 font-medium">
                      ${profile.monthlyRevenue.replace('-', ' - $')}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <span className="text-gray-400">Experience Level:</span>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${
                          i < Math.ceil(profile.sophisticationScore / 2) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-600'
                        }`} 
                      />
                    ))}
                    <span className="text-white ml-2 text-sm">
                      {profile.sophisticationScore}/10
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-blue-300 text-sm leading-relaxed">
                  💡 <strong>Industry Insight:</strong> {getIndustryInsight()}
                </p>
              </div>
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center">
                  <Target className="w-6 h-6 mr-3 text-purple-400" />
                  Your Personalized Action Plan
                </h3>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Tailored for</div>
                  <div className="text-purple-400 font-semibold">
                    {profile.primaryChallenge?.replace('_', ' ').toUpperCase()} Constraint
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className={`relative p-6 rounded-xl border transition-all cursor-pointer group ${
                      index === 0 
                        ? 'border-purple-400/50 bg-purple-500/10 hover:bg-purple-500/20' 
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    } ${selectedPath === rec.route ? 'ring-2 ring-purple-400' : ''}`}
                    onClick={() => setSelectedPath(rec.route)}
                  >
                    {index === 0 && (
                      <div className="absolute -top-3 -right-3 bg-purple-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                        RECOMMENDED
                      </div>
                    )}
                    
                    <div className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 p-3 rounded-full ${
                        rec.priority === 'high' 
                          ? 'bg-red-500/20 border border-red-500/50' 
                          : 'bg-blue-500/20 border border-blue-500/50'
                      }`}>
                        {rec.icon}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-lg font-bold text-white group-hover:text-purple-300">
                            {rec.title}
                          </h4>
                          <div className="flex items-center text-sm text-gray-400 ml-4">
                            <Clock className="w-4 h-4 mr-1" />
                            {rec.estimatedTime}
                          </div>
                        </div>
                        
                        <p className="text-gray-400 text-sm mb-3 leading-relaxed">
                          {rec.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                          {rec.frameworks.slice(0, 3).map((framework, fIndex) => (
                            <span 
                              key={fIndex} 
                              className="text-xs bg-purple-600/20 text-purple-300 px-2 py-1 rounded-full"
                            >
                              {framework}
                            </span>
                          ))}
                          {rec.frameworks.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{rec.frameworks.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0">
                        <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-purple-400 transition-colors" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Transform Your Business?</h3>
              <p className="text-gray-300">
                Choose your path and start implementing Alex Hormozi's proven frameworks today.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button
                onClick={() => handleContinue(primaryRecommendation.route)}
                className="flex-1 md:flex-none bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center"
              >
                <Play className="w-5 h-5 mr-2" />
                Start with {primaryRecommendation.title}
              </button>
              
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex-1 md:flex-none bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 font-semibold py-4 px-8 rounded-xl transition-all flex items-center justify-center"
              >
                <Brain className="w-5 h-5 mr-2" />
                View Detailed Analysis
              </button>
            </div>

            <div className="flex justify-center space-x-6 mt-6 pt-6 border-t border-white/10">
              <button className="flex items-center text-gray-400 hover:text-white transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Download PDF Report
              </button>
              <button className="flex items-center text-gray-400 hover:text-white transition-colors">
                <Share2 className="w-4 h-4 mr-2" />
                Share Results
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Analysis (Expandable) */}
        {showDetails && (
          <div className="max-w-4xl mx-auto mt-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <BarChart className="w-6 h-6 mr-3 text-green-400" />
                Detailed Business Analysis
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Key Insights</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      Your primary constraint is <strong>{profile.primaryChallenge}</strong> - we'll focus there first
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      At your sophistication level, we recommend starting with proven frameworks
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      Your industry has specific optimization opportunities we'll address
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Next 30 Days</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="text-yellow-400 font-semibold">Week 1-2</div>
                      <div className="text-gray-300 text-sm">Complete constraint analysis and identify quick wins</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="text-blue-400 font-semibold">Week 3-4</div>
                      <div className="text-gray-300 text-sm">Implement primary framework and measure results</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trust Signals */}
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <div className="flex items-center justify-center space-x-8 text-gray-400">
            <div className="flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-400" />
              <span className="text-sm">Proven Frameworks</span>
            </div>
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-400" />
              <span className="text-sm">1,260+ Businesses</span>
            </div>
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
              <span className="text-sm">Real Results</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}