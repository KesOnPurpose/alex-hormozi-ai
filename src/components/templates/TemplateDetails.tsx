'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  Target, 
  CheckCircle,
  Star,
  Download,
  Play,
  Heart,
  Share2,
  AlertCircle,
  TrendingUp,
  Zap,
  Award,
  Calendar,
  BookOpen
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

interface TemplateDetailsProps {
  template: Template;
  onBack: () => void;
  onImplementTemplate: (template: Template) => void;
  onAddToFavorites?: (templateId: string) => void;
}

export function TemplateDetails({ 
  template, 
  onBack, 
  onImplementTemplate,
  onAddToFavorites 
}: TemplateDetailsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'components' | 'implementation' | 'success'>('overview');
  const [isImplementing, setIsImplementing] = useState(false);

  const handleImplement = async () => {
    setIsImplementing(true);
    
    // Simulate implementation process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onImplementTemplate(template);
    setIsImplementing(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'low': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getComponentIcon = (type: string) => {
    switch (type) {
      case 'milestone': return Target;
      case 'goal': return Award;
      case 'metric': return TrendingUp;
      case 'action': return Play;
      case 'framework_application': return Zap;
      default: return CheckCircle;
    }
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'components', label: 'Components', icon: Target },
    { id: 'implementation', label: 'Implementation', icon: Play },
    { id: 'success', label: 'Success Metrics', icon: TrendingUp }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Templates</span>
        </button>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onAddToFavorites?.(template.id)}
            className={`p-2 rounded-lg transition-colors ${
              template.isFavorite
                ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >
            <Heart className={`h-4 w-4 ${template.isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button className="p-2 rounded-lg bg-white/10 text-gray-400 hover:bg-white/20 transition-colors">
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Template Header */}
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl p-8 border border-purple-400/20">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-5xl">{getBusinessTypeIcon(template.businessType)}</span>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{template.title}</h1>
              <p className="text-lg text-gray-300 max-w-3xl">{template.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
            <span className="text-lg font-semibold text-white">{template.rating}</span>
            <span className="text-sm text-gray-400">({template.usageCount} uses)</span>
          </div>
        </div>

        {/* Meta Information */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <Clock className="h-5 w-5 text-blue-400 mx-auto mb-1" />
            <div className="text-sm font-medium text-white">{template.estimatedTime}</div>
            <div className="text-xs text-gray-400">Duration</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
              {template.difficulty}
            </div>
            <div className="text-xs text-gray-400 mt-1">Difficulty</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <Zap className="h-5 w-5 text-yellow-400 mx-auto mb-1" />
            <div className="text-sm font-medium text-white">{template.framework}</div>
            <div className="text-xs text-gray-400">Framework</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <Users className="h-5 w-5 text-green-400 mx-auto mb-1" />
            <div className="text-sm font-medium text-white capitalize">{template.businessType}</div>
            <div className="text-xs text-gray-400">Business Type</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-1">
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Expected Outcomes */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                <span>Expected Outcomes</span>
              </h3>
              <div className="grid gap-3">
                {template.outcomes.map((outcome, index) => (
                  <div key={index} className="flex items-start space-x-3 bg-white/5 rounded-lg p-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-orange-400" />
                <span>Prerequisites</span>
              </h3>
              <div className="grid gap-3">
                {template.requirements.map((requirement, index) => (
                  <div key={index} className="flex items-start space-x-3 bg-white/5 rounded-lg p-3">
                    <div className="h-2 w-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">{requirement}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {template.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'components' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">Template Components</h3>
            {template.components.map((component, index) => {
              const Icon = getComponentIcon(component.type);
              return (
                <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-600/20 rounded-lg p-2">
                        <Icon className="h-4 w-4 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{component.title}</h4>
                        <p className="text-sm text-gray-400 capitalize">{component.type.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(component.priority)}`}>
                      {component.priority}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-3">{component.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center space-x-4">
                      {component.timeframe && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{component.timeframe}</span>
                        </div>
                      )}
                      {component.targetValue && (
                        <div className="flex items-center space-x-1">
                          <Target className="h-3 w-3" />
                          <span>{component.targetValue}{component.unit}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-purple-400 font-medium">{component.hormoziFramework}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'implementation' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Implementation Plan</h3>
            
            {/* Phase-based Implementation */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-lg p-4 border border-purple-400/20">
                <h4 className="font-semibold text-white mb-2">Phase 1: Foundation (Week 1)</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• Complete prerequisite assessment</li>
                  <li>• Set up tracking systems and metrics</li>
                  <li>• Establish baseline measurements</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-r from-blue-600/10 to-green-600/10 rounded-lg p-4 border border-blue-400/20">
                <h4 className="font-semibold text-white mb-2">Phase 2: Implementation (Weeks 2-3)</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• Execute high-priority components</li>
                  <li>• Apply Alex Hormozi frameworks</li>
                  <li>• Monitor progress and adjust approach</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-r from-green-600/10 to-yellow-600/10 rounded-lg p-4 border border-green-400/20">
                <h4 className="font-semibold text-white mb-2">Phase 3: Optimization (Week 4+)</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• Analyze results and performance</li>
                  <li>• Fine-tune based on data</li>
                  <li>• Scale successful elements</li>
                </ul>
              </div>
            </div>

            {/* Success Checklist */}
            <div>
              <h4 className="font-semibold text-white mb-3">Success Checklist</h4>
              <div className="space-y-2">
                {[
                  'All prerequisites met and validated',
                  'Baseline metrics established and tracked',
                  'Key framework principles applied',
                  'Progress monitored and documented',
                  'Results measured against targets',
                  'System optimized based on performance'
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 bg-white/5 rounded">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'success' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Success Metrics & KPIs</h3>
            
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {template.components
                .filter(c => c.type === 'metric')
                .map((metric, index) => (
                  <div key={index} className="bg-gradient-to-br from-purple-600/10 to-blue-600/10 rounded-lg p-4 border border-purple-400/20">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{metric.title}</h4>
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    </div>
                    <p className="text-sm text-gray-300 mb-3">{metric.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-purple-400">
                        {metric.targetValue}{metric.unit}
                      </span>
                      <span className="text-xs text-gray-400">{metric.hormoziFramework}</span>
                    </div>
                  </div>
                ))}
            </div>

            {/* Tracking Guidelines */}
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-3">Measurement Guidelines</h4>
              <div className="space-y-3 text-gray-300">
                <p>• Establish baseline measurements before implementation</p>
                <p>• Track metrics weekly during implementation phase</p>
                <p>• Use data to make informed optimization decisions</p>
                <p>• Document insights and lessons learned</p>
                <p>• Celebrate milestones and achievements</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <div className="text-center">
          <Download className="h-8 w-8 text-blue-400 mx-auto mb-2" />
          <button className="text-blue-400 hover:text-blue-300 font-medium">
            Export Template
          </button>
        </div>
        
        <button
          onClick={handleImplement}
          disabled={isImplementing}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isImplementing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Implementing...</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              <span>Implement Template</span>
            </>
          )}
        </button>
        
        <div className="text-center">
          <Share2 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <button className="text-gray-400 hover:text-gray-300 font-medium">
            Share Template
          </button>
        </div>
      </div>
    </div>
  );
}