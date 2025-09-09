'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';

interface RevenueDataPoint {
  date: string;
  revenue: number;
  projected: number;
  target: number;
  actualDate: Date;
}

interface RevenueChartProps {
  currentRevenue: number;
  targetRevenue: number;
  className?: string;
}

export function RevenueChart({ currentRevenue, targetRevenue, className = '' }: RevenueChartProps) {
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
  const [isLive, setIsLive] = useState(false);

  // Generate initial data for the last 30 days
  const generateInitialData = (): RevenueDataPoint[] => {
    const data: RevenueDataPoint[] = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate realistic revenue progression with some volatility
      const baseRevenue = currentRevenue * 0.7; // Start 30% lower
      const growth = (currentRevenue - baseRevenue) * ((29 - i) / 29);
      const volatility = (Math.random() - 0.5) * (currentRevenue * 0.1);
      const actualRevenue = Math.max(0, baseRevenue + growth + volatility);
      
      // Projected revenue (optimistic trend)
      const projectedRevenue = actualRevenue * 1.15;
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: Math.round(actualRevenue),
        projected: Math.round(projectedRevenue),
        target: targetRevenue,
        actualDate: new Date(date)
      });
    }
    
    return data;
  };

  // Simulate real-time updates
  useEffect(() => {
    const initialData = generateInitialData();
    setRevenueData(initialData);
    
    const interval = setInterval(() => {
      if (isLive) {
        setRevenueData(prevData => {
          const newData = [...prevData];
          const lastDataPoint = newData[newData.length - 1];
          
          // Update the last data point with small changes
          const change = (Math.random() - 0.5) * (currentRevenue * 0.02);
          lastDataPoint.revenue = Math.max(0, lastDataPoint.revenue + change);
          lastDataPoint.projected = lastDataPoint.revenue * 1.15;
          
          return newData;
        });
      }
    }, 3000); // Update every 3 seconds when live

    return () => clearInterval(interval);
  }, [isLive, currentRevenue, targetRevenue]);

  const latestRevenue = revenueData[revenueData.length - 1]?.revenue || 0;
  const previousRevenue = revenueData[revenueData.length - 2]?.revenue || 0;
  const trend = latestRevenue > previousRevenue;
  const trendPercentage = previousRevenue > 0 ? ((latestRevenue - previousRevenue) / previousRevenue * 100) : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-purple-400/30 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className={`text-sm ${entry.dataKey === 'revenue' ? 'text-green-400' : 
                                               entry.dataKey === 'projected' ? 'text-blue-400' : 'text-purple-400'}`}>
              {entry.dataKey === 'revenue' ? 'Actual' : 
               entry.dataKey === 'projected' ? 'Projected' : 'Target'}: ${entry.value.toLocaleString()}
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
          <h3 className="text-lg font-semibold text-white mb-1">Revenue Tracking</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              {trend ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
              <span className={`text-sm font-medium ${trend ? 'text-green-400' : 'text-red-400'}`}>
                {trend ? '+' : ''}{trendPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="text-sm text-gray-400">
              Last 30 days
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-white">${latestRevenue.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Current</div>
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
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Target line */}
            <Line 
              type="monotone" 
              dataKey="target" 
              stroke="#a855f7" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
            
            {/* Projected area */}
            <Area
              type="monotone"
              dataKey="projected"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#projectedGradient)"
              strokeDasharray="3 3"
            />
            
            {/* Actual revenue area */}
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={3}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-300">Actual Revenue</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 border-2 border-blue-400 rounded-full bg-transparent"></div>
          <span className="text-sm text-gray-300">Projected</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-1 bg-purple-400 rounded"></div>
          <span className="text-sm text-gray-300">Target</span>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-white/10">
        <div className="text-center">
          <div className="text-lg font-semibold text-green-400">
            ${((latestRevenue - revenueData[0]?.revenue || 0)).toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">30-Day Growth</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-400">
            ${((revenueData[revenueData.length - 1]?.projected || 0) - latestRevenue).toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">Upside Potential</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-purple-400">
            {Math.round(((latestRevenue / targetRevenue) * 100))}%
          </div>
          <div className="text-xs text-gray-400">Target Progress</div>
        </div>
      </div>
    </div>
  );
}