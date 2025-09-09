'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Brain, TrendingUp, Clock, CheckCircle, AlertCircle, Target, Zap } from 'lucide-react';

interface AgentMetrics {
  name: string;
  successRate: number;
  averageConfidence: number;
  avgResponseTime: number;
  totalQueries: number;
  specializations: string[];
  recentPerformance: Array<{
    date: string;
    confidence: number;
    success: boolean;
    responseTime: number;
  }>;
}

interface QueryAnalytics {
  totalQueries: number;
  complexityDistribution: {
    simple: number;
    medium: number;
    complex: number;
    strategic: number;
  };
  successRate: number;
  averageResponseTime: number;
  topFrameworks: Array<{
    name: string;
    usage: number;
  }>;
}

interface AgentAnalyticsProps {
  className?: string;
  isLive?: boolean;
}

export function AgentAnalytics({ className = '', isLive = false }: AgentAnalyticsProps) {
  const [agentMetrics, setAgentMetrics] = useState<AgentMetrics[]>([]);
  const [queryAnalytics, setQueryAnalytics] = useState<QueryAnalytics | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'24h' | '7d' | '30d'>('7d');
  const [selectedAgent, setSelectedAgent] = useState<string>('all');

  // Generate mock analytics data
  useEffect(() => {
    const generateMockMetrics = (): AgentMetrics[] => {
      return [
        {
          name: 'constraint-analyzer',
          successRate: 0.92,
          averageConfidence: 0.89,
          avgResponseTime: 2.1,
          totalQueries: 156,
          specializations: ['Constraint Analysis', 'Growth Bottlenecks', 'System Diagnostics'],
          recentPerformance: generatePerformanceData()
        },
        {
          name: 'offer-analyzer',
          successRate: 0.87,
          averageConfidence: 0.85,
          avgResponseTime: 3.2,
          totalQueries: 142,
          specializations: ['Offer Optimization', 'Value Propositions', 'Pricing Strategy'],
          recentPerformance: generatePerformanceData()
        },
        {
          name: 'money-model-architect',
          successRate: 0.85,
          averageConfidence: 0.83,
          avgResponseTime: 4.1,
          totalQueries: 128,
          specializations: ['Revenue Models', 'Monetization', 'Upsell Strategy'],
          recentPerformance: generatePerformanceData()
        },
        {
          name: 'financial-calculator',
          successRate: 0.94,
          averageConfidence: 0.91,
          avgResponseTime: 1.8,
          totalQueries: 89,
          specializations: ['Financial Analysis', 'CFA Optimization', 'Unit Economics'],
          recentPerformance: generatePerformanceData()
        },
        {
          name: 'psychology-optimizer',
          successRate: 0.81,
          averageConfidence: 0.78,
          avgResponseTime: 2.9,
          totalQueries: 95,
          specializations: ['Customer Psychology', 'Conversion Timing', 'Behavioral Insights'],
          recentPerformance: generatePerformanceData()
        },
        {
          name: 'coaching-methodology',
          successRate: 0.90,
          averageConfidence: 0.88,
          avgResponseTime: 2.5,
          totalQueries: 174,
          specializations: ['Strategic Coaching', 'Framework Integration', 'Implementation'],
          recentPerformance: generatePerformanceData()
        }
      ];
    };

    const generateQueryAnalytics = (): QueryAnalytics => {
      return {
        totalQueries: 784,
        complexityDistribution: {
          simple: 234,
          medium: 312,
          complex: 189,
          strategic: 49
        },
        successRate: 0.87,
        averageResponseTime: 2.8,
        topFrameworks: [
          { name: 'Grand Slam Offer', usage: 156 },
          { name: '4 Universal Constraints', usage: 142 },
          { name: 'Client Financed Acquisition', usage: 98 },
          { name: '4-Prong Money Model', usage: 87 },
          { name: 'Value Equation', usage: 73 }
        ]
      };
    };

    setAgentMetrics(generateMockMetrics());
    setQueryAnalytics(generateQueryAnalytics());
  }, []);

  // Generate performance data
  const generatePerformanceData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        confidence: 0.7 + Math.random() * 0.25,
        success: Math.random() > 0.15,
        responseTime: 1.5 + Math.random() * 3
      });
    }
    return data;
  };

  // Real-time updates simulation
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setAgentMetrics(prev => prev.map(agent => ({
        ...agent,
        successRate: Math.max(0.5, Math.min(1.0, agent.successRate + (Math.random() - 0.5) * 0.02)),
        averageConfidence: Math.max(0.5, Math.min(1.0, agent.averageConfidence + (Math.random() - 0.5) * 0.01)),
        avgResponseTime: Math.max(1.0, agent.avgResponseTime + (Math.random() - 0.5) * 0.1)
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  const getAgentDisplayName = (name: string) => {
    return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getPerformanceColor = (value: number, type: 'rate' | 'time') => {
    if (type === 'rate') {
      if (value >= 0.9) return 'text-green-400';
      if (value >= 0.8) return 'text-yellow-400';
      return 'text-red-400';
    } else {
      if (value <= 2) return 'text-green-400';
      if (value <= 3) return 'text-yellow-400';
      return 'text-red-400';
    }
  };

  const complexityData = queryAnalytics ? [
    { name: 'Simple', value: queryAnalytics.complexityDistribution.simple, color: '#10b981' },
    { name: 'Medium', value: queryAnalytics.complexityDistribution.medium, color: '#f59e0b' },
    { name: 'Complex', value: queryAnalytics.complexityDistribution.complex, color: '#ef4444' },
    { name: 'Strategic', value: queryAnalytics.complexityDistribution.strategic, color: '#8b5cf6' }
  ] : [];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-purple-400/30 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: {typeof entry.value === 'number' ? 
                (entry.dataKey === 'confidence' ? `${(entry.value * 100).toFixed(1)}%` :
                 entry.dataKey === 'responseTime' ? `${entry.value.toFixed(1)}s` : entry.value) 
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-400" />
            Agent Performance Analytics
          </h3>
          <p className="text-sm text-gray-400">Real-time insights into AI agent performance</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value as '24h' | '7d' | '30d')}
            className="bg-gray-800 border border-gray-600 text-white px-3 py-1 rounded-lg text-sm"
          >
            <option value="24h">Last 24h</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
          
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            isLive ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-300'
          }`}>
            {isLive ? '🔴 LIVE' : 'STATIC'}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      {queryAnalytics && (
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-white">Total Queries</span>
            </div>
            <div className="text-2xl font-bold text-white">{queryAnalytics.totalQueries.toLocaleString()}</div>
            <div className="text-xs text-gray-400">Across all agents</div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-white">Success Rate</span>
            </div>
            <div className="text-2xl font-bold text-green-400">{(queryAnalytics.successRate * 100).toFixed(1)}%</div>
            <div className="text-xs text-gray-400">Overall performance</div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-white">Avg Response</span>
            </div>
            <div className="text-2xl font-bold text-yellow-400">{queryAnalytics.averageResponseTime.toFixed(1)}s</div>
            <div className="text-xs text-gray-400">Processing time</div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-white">Active Agents</span>
            </div>
            <div className="text-2xl font-bold text-purple-400">{agentMetrics.length}</div>
            <div className="text-xs text-gray-400">Currently deployed</div>
          </div>
        </div>
      )}

      {/* Agent Performance Chart */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Agent Performance Comparison</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agentMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  stroke="#9ca3af"
                  fontSize={10}
                  tickFormatter={getAgentDisplayName}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="successRate" fill="#10b981" name="Success Rate" />
                <Bar dataKey="averageConfidence" fill="#3b82f6" name="Confidence" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Query Complexity Distribution</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={complexityData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {complexityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Agent Metrics */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Detailed Agent Analysis</h4>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agentMetrics.map((agent) => (
            <div key={agent.name} className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-white">{getAgentDisplayName(agent.name)}</h5>
                <div className={`px-2 py-1 rounded-full text-xs ${
                  agent.successRate >= 0.9 ? 'bg-green-500/20 text-green-400' :
                  agent.successRate >= 0.8 ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {(agent.successRate * 100).toFixed(0)}%
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Confidence:</span>
                  <span className={`text-sm font-medium ${getPerformanceColor(agent.averageConfidence, 'rate')}`}>
                    {(agent.averageConfidence * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Response Time:</span>
                  <span className={`text-sm font-medium ${getPerformanceColor(agent.avgResponseTime, 'time')}`}>
                    {agent.avgResponseTime.toFixed(1)}s
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Total Queries:</span>
                  <span className="text-sm font-medium text-white">{agent.totalQueries}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10">
                <div className="text-xs text-gray-400 mb-2">Specializations</div>
                <div className="flex flex-wrap gap-1">
                  {agent.specializations.slice(0, 2).map((spec, index) => (
                    <span key={index} className="text-xs bg-purple-600/20 text-purple-300 px-2 py-1 rounded-full">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Frameworks Usage */}
      {queryAnalytics && (
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-white mb-4">Most Used Frameworks</h4>
          <div className="grid grid-cols-5 gap-4">
            {queryAnalytics.topFrameworks.map((framework, index) => (
              <div key={framework.name} className="bg-white/5 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-purple-400">{framework.usage}</div>
                <div className="text-sm text-white font-medium">{framework.name}</div>
                <div className="text-xs text-gray-400">queries</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}