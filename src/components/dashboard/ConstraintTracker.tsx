'use client';

import React, { useState, useEffect } from 'react';
import { Users, DollarSign, Truck, TrendingUp, CheckCircle, AlertCircle, Clock, Target } from 'lucide-react';

type ConstraintType = 'LEADS' | 'SALES' | 'DELIVERY' | 'PROFIT';

interface Constraint {
  type: ConstraintType;
  name: string;
  description: string;
  icon: React.ReactNode;
  current: number;
  target: number;
  status: 'critical' | 'warning' | 'good' | 'excellent';
  progress: number;
  improvement: number; // % improvement from last period
  actions: string[];
  timeToResolve: string;
}

interface ConstraintTrackerProps {
  businessData: {
    leads: number;
    conversionRate: number;
    customerSatisfaction: number;
    profitMargin: number;
  };
  className?: string;
}

export function ConstraintTracker({ businessData, className = '' }: ConstraintTrackerProps) {
  const [constraints, setConstraints] = useState<Constraint[]>([]);
  const [primaryConstraint, setPrimaryConstraint] = useState<ConstraintType>('LEADS');
  const [isLive, setIsLive] = useState(false);

  // Initialize constraints based on business data
  const initializeConstraints = (): Constraint[] => {
    const baseConstraints: Constraint[] = [
      {
        type: 'LEADS',
        name: 'Lead Generation',
        description: 'Not enough qualified prospects',
        icon: <Users className="w-5 h-5" />,
        current: businessData.leads || 100,
        target: 500,
        status: 'warning',
        progress: ((businessData.leads || 100) / 500) * 100,
        improvement: Math.random() * 10 - 2, // -2% to +8% random
        actions: [
          'Optimize ad targeting',
          'Create lead magnets',
          'Improve SEO strategy',
          'Partner with influencers'
        ],
        timeToResolve: '2-4 weeks'
      },
      {
        type: 'SALES',
        name: 'Conversion Rate',
        description: 'Can\'t convert prospects to customers',
        icon: <DollarSign className="w-5 h-5" />,
        current: businessData.conversionRate || 15,
        target: 30,
        status: 'critical',
        progress: ((businessData.conversionRate || 15) / 30) * 100,
        improvement: Math.random() * 8 - 1,
        actions: [
          'Improve sales scripts',
          'Add social proof',
          'Create urgency offers',
          'Train sales team'
        ],
        timeToResolve: '3-6 weeks'
      },
      {
        type: 'DELIVERY',
        name: 'Customer Success',
        description: 'Can\'t retain customers or deliver efficiently',
        icon: <Truck className="w-5 h-5" />,
        current: businessData.customerSatisfaction || 78,
        target: 90,
        status: 'good',
        progress: ((businessData.customerSatisfaction || 78) / 90) * 100,
        improvement: Math.random() * 6 - 1,
        actions: [
          'Streamline onboarding',
          'Improve support response time',
          'Create success metrics',
          'Implement feedback loops'
        ],
        timeToResolve: '4-8 weeks'
      },
      {
        type: 'PROFIT',
        name: 'Profit Margins',
        description: 'Good revenue but poor margins',
        icon: <TrendingUp className="w-5 h-5" />,
        current: businessData.profitMargin || 35,
        target: 60,
        status: 'warning',
        progress: ((businessData.profitMargin || 35) / 60) * 100,
        improvement: Math.random() * 4 - 1,
        actions: [
          'Reduce operational costs',
          'Increase pricing',
          'Improve efficiency',
          'Eliminate waste'
        ],
        timeToResolve: '6-12 weeks'
      }
    ];

    // Determine status based on progress
    return baseConstraints.map(constraint => {
      let status: 'critical' | 'warning' | 'good' | 'excellent';
      if (constraint.progress >= 90) status = 'excellent';
      else if (constraint.progress >= 70) status = 'good';
      else if (constraint.progress >= 50) status = 'warning';
      else status = 'critical';

      return { ...constraint, status };
    });
  };

  // Identify primary constraint (lowest progress)
  const identifyPrimaryConstraint = (constraints: Constraint[]): ConstraintType => {
    const sorted = [...constraints].sort((a, b) => a.progress - b.progress);
    return sorted[0].type;
  };

  // Simulate real-time updates
  useEffect(() => {
    const initialConstraints = initializeConstraints();
    setConstraints(initialConstraints);
    setPrimaryConstraint(identifyPrimaryConstraint(initialConstraints));

    if (!isLive) return;

    const interval = setInterval(() => {
      setConstraints(prev => {
        const updated = prev.map(constraint => {
          // Small random changes
          const change = (Math.random() - 0.5) * 2; // -1 to +1
          const newCurrent = Math.max(0, constraint.current + change);
          const newProgress = Math.min(100, (newCurrent / constraint.target) * 100);
          
          let newStatus: 'critical' | 'warning' | 'good' | 'excellent';
          if (newProgress >= 90) newStatus = 'excellent';
          else if (newProgress >= 70) newStatus = 'good';
          else if (newProgress >= 50) newStatus = 'warning';
          else newStatus = 'critical';

          const newImprovement = ((newCurrent - constraint.current) / constraint.current) * 100;

          return {
            ...constraint,
            current: newCurrent,
            progress: newProgress,
            status: newStatus,
            improvement: newImprovement
          };
        });

        setPrimaryConstraint(identifyPrimaryConstraint(updated));
        return updated;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isLive, businessData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-400 border-green-400/30 bg-green-400/10';
      case 'good': return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
      case 'warning': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
      case 'critical': return 'text-red-400 border-red-400/30 bg-red-400/10';
      default: return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="w-4 h-4" />;
      case 'good': return <Target className="w-4 h-4" />;
      case 'warning': return <Clock className="w-4 h-4" />;
      case 'critical': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">
            4 Universal Business Constraints
          </h3>
          <p className="text-sm text-gray-400">
            Alex Hormozi's constraint identification system
          </p>
        </div>
        
        <button
          onClick={() => setIsLive(!isLive)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
            isLive 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
          }`}
        >
          {isLive ? '🔴 LIVE' : '▶ Start Live'}
        </button>
      </div>

      {/* Primary Constraint Alert */}
      <div className="mb-6 p-4 bg-red-500/10 border border-red-400/30 rounded-lg">
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <div>
            <div className="font-medium text-red-300">Primary Constraint Identified</div>
            <div className="text-sm text-gray-300">
              {constraints.find(c => c.type === primaryConstraint)?.name} is your biggest bottleneck right now
            </div>
          </div>
        </div>
      </div>

      {/* Constraints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {constraints.map((constraint, index) => {
          const isPrimary = constraint.type === primaryConstraint;
          const statusColor = getStatusColor(constraint.status);
          
          return (
            <div
              key={constraint.type}
              className={`relative p-4 rounded-lg border transition-all ${statusColor} ${
                isPrimary ? 'ring-2 ring-red-400/50' : ''
              }`}
            >
              {/* Primary Constraint Badge */}
              {isPrimary && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  PRIMARY
                </div>
              )}

              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {constraint.icon}
                  <div>
                    <div className="font-medium text-white">{constraint.name}</div>
                    <div className="text-xs text-gray-400">{constraint.description}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(constraint.status)}
                </div>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-300">Progress</span>
                  <span className="text-sm font-medium text-white">
                    {constraint.progress.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      constraint.status === 'excellent' ? 'bg-green-400' :
                      constraint.status === 'good' ? 'bg-blue-400' :
                      constraint.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${constraint.progress}%` }}
                  />
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                <div>
                  <div className="text-gray-400">Current</div>
                  <div className="font-medium text-white">
                    {constraint.current.toFixed(constraint.type === 'LEADS' ? 0 : 1)}
                    {constraint.type === 'SALES' || constraint.type === 'DELIVERY' || constraint.type === 'PROFIT' ? '%' : ''}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Target</div>
                  <div className="font-medium text-white">
                    {constraint.target}
                    {constraint.type === 'SALES' || constraint.type === 'DELIVERY' || constraint.type === 'PROFIT' ? '%' : ''}
                  </div>
                </div>
              </div>

              {/* Improvement */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <div className="text-xs text-gray-400">7-day change</div>
                <div className={`text-sm font-medium flex items-center space-x-1 ${
                  constraint.improvement >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {constraint.improvement >= 0 ? 
                    <TrendingUp className="w-3 h-3" /> : 
                    <DollarSign className="w-3 h-3 rotate-180" />
                  }
                  <span>{constraint.improvement.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Plan for Primary Constraint */}
      <div className="bg-white/5 rounded-lg p-4">
        <h4 className="font-medium text-white mb-3 flex items-center">
          <Target className="w-4 h-4 mr-2 text-purple-400" />
          Immediate Action Plan - {constraints.find(c => c.type === primaryConstraint)?.name}
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-400 mb-2">Priority Actions</div>
            <ul className="space-y-1">
              {constraints.find(c => c.type === primaryConstraint)?.actions.slice(0, 3).map((action, index) => (
                <li key={index} className="text-sm text-gray-300 flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  {action}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-2">Timeline</div>
            <div className="text-sm text-white">
              {constraints.find(c => c.type === primaryConstraint)?.timeToResolve}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Focus 80% of resources here until resolved
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}