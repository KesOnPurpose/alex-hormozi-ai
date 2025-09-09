'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Target, TrendingUp, Clock, DollarSign } from 'lucide-react';

interface CFADataPoint {
  month: string;
  cac: number;
  thirtyDayGP: number;
  cfaRatio: number;
  cfaAchieved: boolean;
}

interface CFAChartProps {
  currentCAC: number;
  currentGP: number;
  className?: string;
}

export function CFAChart({ currentCAC, currentGP, className = '' }: CFAChartProps) {
  const [cfaData, setCFAData] = useState<CFADataPoint[]>([]);
  const [isLive, setIsLive] = useState(false);

  // Generate CFA progression data
  const generateCFAData = (): CFADataPoint[] => {
    const data: CFADataPoint[] = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    for (let i = 0; i < months.length; i++) {
      // Simulate improvement over time
      const cacReduction = Math.max(0.7, 1 - (i * 0.05)); // CAC improves by 5% each month
      const gpImprovement = 1 + (i * 0.08); // GP improves by 8% each month
      
      const monthCAC = Math.round(currentCAC * cacReduction);
      const monthGP = Math.round(currentGP * gpImprovement);
      const ratio = monthGP / monthCAC;
      
      data.push({
        month: months[i],
        cac: monthCAC,
        thirtyDayGP: monthGP,
        cfaRatio: ratio,
        cfaAchieved: ratio >= 1.0
      });
    }
    
    return data;
  };

  // Simulate real-time updates
  useEffect(() => {
    const initialData = generateCFAData();
    setCFAData(initialData);
    
    const interval = setInterval(() => {
      if (isLive) {
        setCFAData(prevData => {
          const newData = [...prevData];
          const lastMonth = newData[newData.length - 1];
          
          // Small random improvements
          const cacChange = (Math.random() - 0.7) * 5; // Slight CAC reduction bias
          const gpChange = (Math.random() - 0.3) * 50; // Slight GP increase bias
          
          lastMonth.cac = Math.max(50, lastMonth.cac + cacChange);
          lastMonth.thirtyDayGP = Math.max(100, lastMonth.thirtyDayGP + gpChange);
          lastMonth.cfaRatio = lastMonth.thirtyDayGP / lastMonth.cac;
          lastMonth.cfaAchieved = lastMonth.cfaRatio >= 1.0;
          
          return newData;
        });
      }
    }, 4000); // Update every 4 seconds

    return () => clearInterval(interval);
  }, [isLive, currentCAC, currentGP]);

  const currentCFARatio = cfaData[cfaData.length - 1]?.cfaRatio || 0;
  const cfaProgress = Math.min(100, currentCFARatio * 100);
  const isCFAAchieved = currentCFARatio >= 1.0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900 border border-purple-400/30 rounded-lg p-4 shadow-lg">
          <p className="text-white font-medium mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-red-400 text-sm">CAC: ${data.cac}</p>
            <p className="text-green-400 text-sm">30-Day GP: ${data.thirtyDayGP}</p>
            <p className={`text-sm font-semibold ${data.cfaAchieved ? 'text-purple-400' : 'text-yellow-400'}`}>
              CFA Ratio: {data.cfaRatio.toFixed(2)}x
            </p>
            <p className={`text-xs ${data.cfaAchieved ? 'text-green-400' : 'text-red-400'}`}>
              {data.cfaAchieved ? '✅ CFA Achieved!' : '❌ Not CFA Yet'}
            </p>
          </div>
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
            <Target className="w-5 h-5 mr-2 text-purple-400" />
            Client Financed Acquisition
          </h3>
          <p className="text-sm text-gray-400">30-Day Gross Profit vs Customer Acquisition Cost</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className={`text-2xl font-bold ${isCFAAchieved ? 'text-green-400' : 'text-yellow-400'}`}>
              {currentCFARatio.toFixed(2)}x
            </div>
            <div className="text-sm text-gray-400">CFA Ratio</div>
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

      {/* CFA Status Banner */}
      <div className={`mb-6 p-4 rounded-lg ${
        isCFAAchieved 
          ? 'bg-green-500/20 border border-green-400/30' 
          : 'bg-yellow-500/20 border border-yellow-400/30'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${isCFAAchieved ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
            <span className={`font-medium ${isCFAAchieved ? 'text-green-300' : 'text-yellow-300'}`}>
              {isCFAAchieved ? 'CFA ACHIEVED!' : 'Working Toward CFA'}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-lg font-semibold text-white">${cfaData[cfaData.length - 1]?.thirtyDayGP || 0}</div>
              <div className="text-xs text-gray-400">30-Day GP</div>
            </div>
            <div className="text-gray-400">÷</div>
            <div className="text-right">
              <div className="text-lg font-semibold text-white">${cfaData[cfaData.length - 1]?.cac || 0}</div>
              <div className="text-xs text-gray-400">CAC</div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={cfaData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="month" 
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `${value.toFixed(1)}x`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* CFA Achievement Line */}
            <ReferenceLine y={1.0} stroke="#a855f7" strokeWidth={2} strokeDasharray="5 5" />
            
            <Bar 
              dataKey="cfaRatio" 
              radius={[4, 4, 0, 0]}
              fill={(entry: any) => entry?.cfaAchieved ? '#10b981' : '#f59e0b'}
            >
              {cfaData.map((entry, index) => (
                <Bar key={`bar-${index}`} fill={entry.cfaAchieved ? '#10b981' : '#f59e0b'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Progress Bar */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">CFA Progress</span>
          <span className="text-sm font-medium text-white">{cfaProgress.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              isCFAAchieved ? 'bg-green-400' : 'bg-yellow-400'
            }`}
            style={{ width: `${Math.min(100, cfaProgress)}%` }}
          ></div>
        </div>
      </div>

      {/* Action Insights */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/10">
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-white">Time to CFA</span>
          </div>
          <div className="text-lg font-semibold text-blue-400">
            {isCFAAchieved ? 'Achieved!' : `${Math.ceil((1.0 / currentCFARatio - 1) * 30)} days`}
          </div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-white">Monthly Impact</span>
          </div>
          <div className="text-lg font-semibold text-green-400">
            ${isCFAAchieved ? (currentGP - currentCAC).toLocaleString() : 'Pending'}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {!isCFAAchieved && (
        <div className="mt-4 p-3 bg-purple-500/10 border border-purple-400/30 rounded-lg">
          <h4 className="text-sm font-medium text-purple-300 mb-2">💡 CFA Optimization Tips</h4>
          <ul className="text-xs text-gray-300 space-y-1">
            <li>• Add immediate upsell to increase 30-day GP</li>
            <li>• Optimize ad targeting to reduce CAC</li>
            <li>• Create payment plans to boost initial purchases</li>
          </ul>
        </div>
      )}
    </div>
  );
}