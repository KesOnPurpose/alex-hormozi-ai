'use client'

import { useState } from 'react'

interface MetricDataPoint {
  date: string
  monthlyRevenue: number
  customerCount: number
  conversionRate: number
  avgOrderValue: number
  ltv: number
  cac: number
}

interface GrowthTimelineChartProps {
  data: MetricDataPoint[]
  selectedMetric: keyof Omit<MetricDataPoint, 'date'>
  onMetricChange: (metric: keyof Omit<MetricDataPoint, 'date'>) => void
}

export default function GrowthTimelineChart({ data, selectedMetric, onMetricChange }: GrowthTimelineChartProps) {
  const metrics = [
    { key: 'monthlyRevenue' as const, label: 'Monthly Revenue', color: 'text-green-400', bgColor: 'bg-green-500/20', format: (val: number) => `$${val.toLocaleString()}` },
    { key: 'customerCount' as const, label: 'Customers', color: 'text-blue-400', bgColor: 'bg-blue-500/20', format: (val: number) => val.toLocaleString() },
    { key: 'conversionRate' as const, label: 'Conversion Rate', color: 'text-purple-400', bgColor: 'bg-purple-500/20', format: (val: number) => `${val}%` },
    { key: 'avgOrderValue' as const, label: 'Avg Order Value', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', format: (val: number) => `$${val}` },
    { key: 'ltv' as const, label: 'Customer LTV', color: 'text-pink-400', bgColor: 'bg-pink-500/20', format: (val: number) => `$${val}` },
    { key: 'cac' as const, label: 'Customer CAC', color: 'text-orange-400', bgColor: 'bg-orange-500/20', format: (val: number) => `$${val}` }
  ]

  const currentMetric = metrics.find(m => m.key === selectedMetric)!
  
  const maxValue = Math.max(...data.map(d => d[selectedMetric] as number))
  const minValue = Math.min(...data.map(d => d[selectedMetric] as number))
  const range = maxValue - minValue || 1

  const getGrowthDirection = () => {
    if (data.length < 2) return 'neutral'
    const first = data[0][selectedMetric] as number
    const last = data[data.length - 1][selectedMetric] as number
    const growth = ((last - first) / first) * 100
    
    if (selectedMetric === 'cac') {
      return growth < 0 ? 'positive' : growth > 0 ? 'negative' : 'neutral'
    }
    return growth > 0 ? 'positive' : growth < 0 ? 'negative' : 'neutral'
  }

  const growthDirection = getGrowthDirection()
  const trendIcon = growthDirection === 'positive' ? '📈' : growthDirection === 'negative' ? '📉' : '➖'

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Growth Timeline</h3>
          <p className="text-gray-400 text-sm">Track your business metrics over time</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <span className="text-2xl">{trendIcon}</span>
          <span className={`text-sm font-medium ${currentMetric.color}`}>
            {currentMetric.label}
          </span>
        </div>
      </div>

      {/* Metric Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
        {metrics.map((metric) => (
          <button
            key={metric.key}
            onClick={() => onMetricChange(metric.key)}
            className={`p-3 rounded-lg border transition-all ${
              selectedMetric === metric.key
                ? `${metric.bgColor} border-current ${metric.color}`
                : 'bg-slate-700/50 border-white/10 text-gray-300 hover:bg-slate-700'
            }`}
          >
            <div className="text-xs font-medium mb-1">{metric.label}</div>
            <div className={`text-sm font-bold ${selectedMetric === metric.key ? '' : 'text-white'}`}>
              {metric.format(data[data.length - 1]?.[metric.key] as number || 0)}
            </div>
          </button>
        ))}
      </div>

      {/* Chart Area */}
      <div className="relative h-64 mb-4">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 pr-2">
          <span>{currentMetric.format(maxValue)}</span>
          <span>{currentMetric.format(minValue + (range * 0.5))}</span>
          <span>{currentMetric.format(minValue)}</span>
        </div>

        {/* Chart container */}
        <div className="ml-16 h-full relative bg-slate-900/30 rounded-lg p-4">
          {/* Grid lines */}
          <div className="absolute inset-4">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="absolute w-full border-t border-white/5" style={{ top: `${i * 25}%` }} />
            ))}
          </div>

          {/* Data points and line */}
          <div className="relative h-full">
            <svg className="absolute inset-0 w-full h-full">
              {/* Line path */}
              <path
                d={data.map((point, index) => {
                  const x = ((index / (data.length - 1)) * 100)
                  const y = (100 - (((point[selectedMetric] as number) - minValue) / range) * 100)
                  return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
                }).join(' ')}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`drop-shadow-sm ${currentMetric.color}`}
              />
              
              {/* Data points */}
              {data.map((point, index) => {
                const x = ((index / (data.length - 1)) * 100)
                const y = (100 - (((point[selectedMetric] as number) - minValue) / range) * 100)
                return (
                  <g key={index}>
                    <circle
                      cx={`${x}%`}
                      cy={`${y}%`}
                      r="4"
                      fill="currentColor"
                      className={`${currentMetric.color} drop-shadow-sm`}
                    />
                  </g>
                )
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* X-axis labels (dates) */}
      <div className="ml-16 flex justify-between text-xs text-gray-400">
        {data.map((point, index) => (
          <span key={index} className={index === 0 || index === data.length - 1 ? '' : 'hidden sm:block'}>
            {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        ))}
      </div>

      {/* Growth Summary */}
      <div className="mt-6 p-4 bg-slate-900/30 rounded-lg">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xs text-gray-400 mb-1">Period Growth</div>
            <div className={`font-bold ${growthDirection === 'positive' ? 'text-green-400' : growthDirection === 'negative' ? 'text-red-400' : 'text-gray-400'}`}>
              {data.length >= 2 ? (() => {
                const first = data[0][selectedMetric] as number
                const last = data[data.length - 1][selectedMetric] as number
                const growth = ((last - first) / first) * 100
                return `${growth > 0 ? '+' : ''}${growth.toFixed(1)}%`
              })() : '0%'}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Best Month</div>
            <div className="text-white font-bold">
              {currentMetric.format(Math.max(...data.map(d => d[selectedMetric] as number)))}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Current</div>
            <div className={`font-bold ${currentMetric.color}`}>
              {currentMetric.format(data[data.length - 1]?.[selectedMetric] as number || 0)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Trend</div>
            <div className="text-white font-bold">
              {growthDirection === 'positive' ? '🚀 Growing' : 
               growthDirection === 'negative' ? '📉 Declining' : 
               '➖ Stable'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}