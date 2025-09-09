'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Target, Zap, AlertTriangle } from 'lucide-react';

interface MetricData {
  current: number;
  previous: number;
  target?: number;
  trend: 'up' | 'down' | 'flat';
  trendPercentage: number;
  isGood: boolean;
}

interface LiveMetricCardProps {
  title: string;
  value: number;
  subtitle: string;
  format: 'currency' | 'number' | 'percentage';
  target?: number;
  trend?: string;
  trendPositive?: boolean;
  className?: string;
  updateInterval?: number;
  volatility?: number;
}

export function LiveMetricCard({ 
  title, 
  value, 
  subtitle, 
  format, 
  target,
  trend: initialTrend,
  trendPositive: initialTrendPositive,
  className = '',
  updateInterval = 5000,
  volatility = 0.02
}: LiveMetricCardProps) {
  const [metricData, setMetricData] = useState<MetricData>({
    current: value,
    previous: value * 0.95,
    target,
    trend: initialTrendPositive ? 'up' : initialTrendPositive === false ? 'down' : 'flat',
    trendPercentage: initialTrendPositive ? 5 : initialTrendPositive === false ? -5 : 0,
    isGood: initialTrendPositive !== false
  });
  const [isLive, setIsLive] = useState(false);
  const [pulseActive, setPulseActive] = useState(false);

  // Format value based on type
  const formatValue = (val: number): string => {
    switch (format) {
      case 'currency':
        return `$${val.toLocaleString()}`;
      case 'percentage':
        return `${val.toFixed(1)}%`;
      default:
        return val.toLocaleString();
    }
  };

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setMetricData(prev => {
        // Calculate change based on volatility
        const change = (Math.random() - 0.5) * 2 * volatility * prev.current;
        const newValue = Math.max(0, prev.current + change);
        
        // Determine trend
        const trendPercentage = ((newValue - prev.current) / prev.current) * 100;
        const newTrend = trendPercentage > 0.1 ? 'up' : trendPercentage < -0.1 ? 'down' : 'flat';
        
        // Determine if trend is good based on metric type and context
        let isGood = true;
        if (title.toLowerCase().includes('cac') || title.toLowerCase().includes('cost')) {
          isGood = newTrend === 'down' || newTrend === 'flat';
        } else {
          isGood = newTrend === 'up' || newTrend === 'flat';
        }

        // Trigger pulse animation on significant changes
        if (Math.abs(trendPercentage) > 1) {
          setPulseActive(true);
          setTimeout(() => setPulseActive(false), 1000);
        }

        return {
          current: newValue,
          previous: prev.current,
          target,
          trend: newTrend,
          trendPercentage: Math.abs(trendPercentage),
          isGood
        };
      });
    }, updateInterval);

    return () => clearInterval(interval);
  }, [isLive, updateInterval, volatility, title, target]);

  // Calculate target progress
  const targetProgress = target ? Math.min(100, (metricData.current / target) * 100) : null;
  
  // Get trend icon and color
  const getTrendIcon = () => {
    switch (metricData.trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = () => {
    if (metricData.trend === 'flat') return 'text-gray-400';
    return metricData.isGood ? 'text-green-400' : 'text-red-400';
  };

  const getCardBorder = () => {
    if (!isLive) return 'border-white/20';
    if (metricData.trend === 'flat') return 'border-gray-400/30';
    return metricData.isGood ? 'border-green-400/30' : 'border-red-400/30';
  };

  return (
    <div className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 border transition-all duration-300 ${getCardBorder()} ${
      pulseActive ? 'scale-105 shadow-lg' : ''
    } ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <div className="flex items-center space-x-2">
          {/* Live Indicator */}
          <button
            onClick={() => setIsLive(!isLive)}
            className={`w-2 h-2 rounded-full transition-all ${
              isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-500'
            }`}
            title={isLive ? 'Live updates active' : 'Click to enable live updates'}
          />
          
          {/* Trend Indicator */}
          <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="text-sm font-medium">
              {metricData.trend !== 'flat' ? `${metricData.trendPercentage.toFixed(1)}%` : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Value */}
      <div className="mb-3">
        <div className={`text-2xl font-bold text-white transition-colors duration-300 ${
          pulseActive ? 'text-purple-300' : ''
        }`}>
          {formatValue(metricData.current)}
        </div>
        <div className="text-xs text-gray-500">{subtitle}</div>
      </div>

      {/* Target Progress Bar (if target is provided) */}
      {target && targetProgress !== null && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400">Target Progress</span>
            <span className="text-xs font-medium text-white">{targetProgress.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-500 ${
                targetProgress >= 100 ? 'bg-green-400' : targetProgress >= 75 ? 'bg-yellow-400' : 'bg-purple-400'
              }`}
              style={{ width: `${Math.min(100, targetProgress)}%` }}
            />
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Target: {formatValue(target)}
          </div>
        </div>
      )}

      {/* Additional Metrics */}
      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10">
        <div>
          <div className="text-xs text-gray-400">Previous</div>
          <div className="text-sm font-medium text-gray-300">
            {formatValue(metricData.previous)}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Change</div>
          <div className={`text-sm font-medium ${getTrendColor()}`}>
            {metricData.trend === 'flat' ? '—' : 
             `${metricData.trend === 'up' ? '+' : '-'}${metricData.trendPercentage.toFixed(1)}%`}
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
        <div className="flex items-center space-x-2">
          {/* Performance Indicator */}
          {target && (
            <>
              {targetProgress >= 100 ? (
                <div className="flex items-center space-x-1 text-green-400">
                  <Target className="w-3 h-3" />
                  <span className="text-xs">Target Met</span>
                </div>
              ) : targetProgress >= 75 ? (
                <div className="flex items-center space-x-1 text-yellow-400">
                  <Zap className="w-3 h-3" />
                  <span className="text-xs">On Track</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-red-400">
                  <AlertTriangle className="w-3 h-3" />
                  <span className="text-xs">Below Target</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Live Status */}
        {isLive && (
          <div className="flex items-center space-x-1 text-green-400">
            <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs">LIVE</span>
          </div>
        )}
      </div>
    </div>
  );
}