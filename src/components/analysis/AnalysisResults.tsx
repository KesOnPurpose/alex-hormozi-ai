'use client';

import React, { useState } from 'react';
import { AnalysisResult } from './DocumentAnalyzer';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  Eye, 
  BarChart3,
  DollarSign,
  Target,
  Zap,
  ArrowRight,
  Star,
  Lightbulb,
  FileText,
  Calculator
} from 'lucide-react';

interface AnalysisResultsProps {
  results: AnalysisResult[];
  onViewAgent: (agentType: string) => void;
  onDownloadReport: () => void;
}

export function AnalysisResults({ results, onViewAgent, onDownloadReport }: AnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'constraints' | 'frameworks' | 'metrics'>('overview');
  const mainResult = results[0]; // For now, handle single result

  if (!mainResult) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-400/20 border-red-400/30';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'low': return 'text-green-400 bg-green-400/20 border-green-400/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  const formatCurrency = (value?: number) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  const formatPercentage = (value?: number) => {
    if (value === undefined) return 'N/A';
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl p-6 border border-purple-400/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-600 rounded-lg p-3">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Analysis Complete</h2>
              <p className="text-purple-300">
                {mainResult.documentType.replace('_', ' ').toUpperCase()} • {(mainResult.confidence * 100).toFixed(1)}% Confidence
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onDownloadReport}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Download Report</span>
            </button>
            <button 
              onClick={() => onViewAgent('constraint-analyzer')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>Deep Dive Analysis</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/10 rounded-xl p-1 flex space-x-1">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'constraints', label: 'Constraints', icon: AlertTriangle },
          { id: 'frameworks', label: 'Frameworks', icon: Target },
          { id: 'metrics', label: 'Metrics', icon: BarChart3 }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors flex-1 justify-center ${
              activeTab === tab.id 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Tabs */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Insights */}
            <div className="bg-white/10 rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-400" />
                Key Insights
              </h3>
              <div className="space-y-4">
                {mainResult.insights.map((insight, index) => (
                  <div key={index} className={`rounded-lg p-4 border ${getPriorityColor(insight.priority)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{insight.title}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs px-2 py-1 rounded bg-white/20">{insight.framework}</span>
                        <div className="flex">
                          {[...Array(insight.priority === 'high' ? 3 : insight.priority === 'medium' ? 2 : 1)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm opacity-90">{insight.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <ActionCard
                title="Fix Conversion Issues"
                description="Apply Grand Slam Offer framework"
                icon={<Target className="h-5 w-5" />}
                onClick={() => onViewAgent('offer-analyzer')}
                priority="high"
              />
              <ActionCard
                title="Build Money Model"
                description="Design 4-prong revenue system"
                icon={<DollarSign className="h-5 w-5" />}
                onClick={() => onViewAgent('money-model-architect')}
                priority="high"
              />
              <ActionCard
                title="Optimize Unit Economics"
                description="Improve CAC and LTV ratios"
                icon={<Calculator className="h-5 w-5" />}
                onClick={() => onViewAgent('financial-calculator')}
                priority="medium"
              />
            </div>
          </div>
        )}

        {activeTab === 'constraints' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">Identified Constraints</h3>
            {mainResult.hormoziAnalysis.constraints.map((constraint, index) => (
              <div key={index} className="bg-white/10 rounded-xl p-6 border border-white/20">
                <div className="flex items-start space-x-4">
                  <div className="bg-red-600/20 rounded-lg p-2 mt-1">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white">{constraint}</p>
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <button 
                        onClick={() => onViewAgent('constraint-analyzer')}
                        className="text-purple-400 hover:text-purple-300 flex items-center space-x-1"
                      >
                        <span>Analyze this constraint</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'frameworks' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">Recommended Frameworks</h3>
            {mainResult.hormoziAnalysis.recommendations.map((rec, index) => (
              <div key={index} className="bg-white/10 rounded-xl p-6 border border-white/20">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-600/20 rounded-lg p-2 mt-1">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white">{rec}</p>
                    <div className="mt-3 flex space-x-2">
                      <span className="text-xs px-2 py-1 bg-purple-600/20 text-purple-300 rounded">
                        {mainResult.hormoziAnalysis.frameworks[index % mainResult.hormoziAnalysis.frameworks.length]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <MetricCard
                title="Monthly Revenue"
                value={formatCurrency(mainResult.metrics.revenue)}
                icon={<DollarSign className="h-6 w-6" />}
                trend="up"
              />
              <MetricCard
                title="Customer Acquisition Cost"
                value={formatCurrency(mainResult.metrics.cac)}
                icon={<Target className="h-6 w-6" />}
                trend="down"
              />
              <MetricCard
                title="Lifetime Value"
                value={formatCurrency(mainResult.metrics.ltv)}
                icon={<TrendingUp className="h-6 w-6" />}
                trend="up"
              />
              <MetricCard
                title="Gross Margins"
                value={formatPercentage(mainResult.metrics.margins)}
                icon={<BarChart3 className="h-6 w-6" />}
                trend="neutral"
              />
              <MetricCard
                title="Growth Rate"
                value={formatPercentage(mainResult.metrics.growthRate)}
                icon={<Zap className="h-6 w-6" />}
                trend="up"
              />
              <MetricCard
                title="LTV:CAC Ratio"
                value={`${((mainResult.metrics.ltv || 0) / (mainResult.metrics.cac || 1)).toFixed(1)}:1`}
                icon={<Calculator className="h-6 w-6" />}
                trend={((mainResult.metrics.ltv || 0) / (mainResult.metrics.cac || 1)) > 3 ? 'up' : 'down'}
              />
            </div>

            <div className="bg-white/10 rounded-xl p-6 border border-white/20">
              <h4 className="text-lg font-semibold text-white mb-4">Metric Analysis</h4>
              <div className="space-y-3 text-gray-300">
                <p>• LTV:CAC ratio of {((mainResult.metrics.ltv || 0) / (mainResult.metrics.cac || 1)).toFixed(1)}:1 indicates {((mainResult.metrics.ltv || 0) / (mainResult.metrics.cac || 1)) > 3 ? 'healthy' : 'concerning'} unit economics</p>
                <p>• {formatPercentage(mainResult.metrics.margins)} gross margins suggest {(mainResult.metrics.margins || 0) > 0.6 ? 'excellent' : 'room for improvement in'} pricing power</p>
                <p>• {formatPercentage(mainResult.metrics.growthRate)} monthly growth rate {(mainResult.metrics.growthRate || 0) > 0.1 ? 'exceeds' : 'falls below'} industry benchmarks</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ActionCard({ title, description, icon, onClick, priority }: {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  priority: 'high' | 'medium' | 'low';
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white/10 hover:bg-white/20 rounded-xl p-4 text-left transition-all border border-white/20 hover:border-purple-400/50"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="text-purple-400">{icon}</div>
        <div className={`text-xs px-2 py-1 rounded ${
          priority === 'high' ? 'bg-red-600/20 text-red-400' : 
          priority === 'medium' ? 'bg-yellow-600/20 text-yellow-400' : 
          'bg-green-600/20 text-green-400'
        }`}>
          {priority.toUpperCase()}
        </div>
      </div>
      <h4 className="font-medium text-white mb-1">{title}</h4>
      <p className="text-gray-400 text-sm">{description}</p>
    </button>
  );
}

function MetricCard({ title, value, icon, trend }: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
}) {
  return (
    <div className="bg-white/10 rounded-xl p-4 border border-white/20">
      <div className="flex items-center justify-between mb-2">
        <div className="text-purple-400">{icon}</div>
        <div className={`text-xs ${
          trend === 'up' ? 'text-green-400' : 
          trend === 'down' ? 'text-red-400' : 
          'text-gray-400'
        }`}>
          {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
        </div>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-gray-400 text-sm">{title}</div>
    </div>
  );
}