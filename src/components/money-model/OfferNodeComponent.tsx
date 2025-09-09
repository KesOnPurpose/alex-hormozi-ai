'use client'

import { Handle, Position } from 'reactflow'
import { OfferNode } from '@/types/money-model'

interface OfferNodeData {
  offer: OfferNode
  isSelected: boolean
  onSelect: () => void
  onUpdate: (updates: Partial<OfferNode>) => void
  onDelete: () => void
  onDuplicate: () => void
  onEdit: () => void
  aiInsights: any[]
}

interface OfferNodeComponentProps {
  data: OfferNodeData
  selected?: boolean
}

export default function OfferNodeComponent({ data, selected }: OfferNodeComponentProps) {
  const { offer, isSelected, onSelect, onUpdate, onDelete, onDuplicate, onEdit, aiInsights } = data

  const getOfferColor = () => {
    switch (offer.type) {
      case 'attraction': return 'border-blue-500 bg-blue-500/10'
      case 'core': return 'border-purple-500 bg-purple-500/10'
      case 'upsell': return 'border-green-500 bg-green-500/10'
      case 'downsell': return 'border-yellow-500 bg-yellow-500/10'
      case 'continuity': return 'border-red-500 bg-red-500/10'
      default: return 'border-gray-500 bg-gray-500/10'
    }
  }

  const getOfferIcon = () => {
    switch (offer.type) {
      case 'attraction': return '🎯'
      case 'core': return '💎'
      case 'upsell': return '📈'
      case 'downsell': return '🔄'
      case 'continuity': return '🔁'
      default: return '📦'
    }
  }

  const getStatusColor = () => {
    switch (offer.status) {
      case 'active': return 'text-green-400 bg-green-500/20'
      case 'planned': return 'text-blue-400 bg-blue-500/20'
      case 'paused': return 'text-yellow-400 bg-yellow-500/20'
      case 'archived': return 'text-gray-400 bg-gray-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  return (
    <div
      onClick={onSelect}
      className={`relative bg-slate-800 border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl ${
        getOfferColor()
      } ${isSelected ? 'ring-2 ring-white/50 shadow-2xl' : ''}`}
      style={{ minHeight: '180px' }}
    >
      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-slate-600 border-2 border-white/20"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-slate-600 border-2 border-white/20"
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{getOfferIcon()}</span>
          <div>
            <h3 className="text-white font-semibold text-sm">{offer.name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor()}`}>
              {offer.status}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-white font-bold text-lg">${offer.price.toLocaleString()}</div>
          <div className="text-gray-400 text-xs">{offer.type}</div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-300 text-xs mb-3 line-clamp-2">{offer.description}</p>

      {/* Key Metrics */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs">Monthly Revenue:</span>
          <span className="text-green-400 text-xs font-medium">
            ${Math.round(offer.metrics.currentMonthlyRevenue).toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs">Conversion Rate:</span>
          <span className="text-blue-400 text-xs font-medium">{offer.metrics.conversionRate}%</span>
        </div>
        {offer.connections.length > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-xs">Connections:</span>
            <span className="text-purple-400 text-xs font-medium">{offer.connections.length}</span>
          </div>
        )}
      </div>

      {/* AI Insights Badge */}
      {aiInsights.length > 0 && (
        <div className="absolute top-2 right-2">
          <div className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold">
            🤖 {aiInsights.length}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {isSelected && (
        <div className="absolute -top-10 right-0 flex space-x-1 bg-slate-800 rounded-lg px-2 py-1 shadow-lg border border-white/20">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
            className="text-green-400 hover:text-green-300 p-1 rounded text-xs transition-colors"
            title="Edit offer details"
          >
            ✏️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDuplicate()
            }}
            className="text-blue-400 hover:text-blue-300 p-1 rounded text-xs transition-colors"
            title="Duplicate offer"
          >
            📄
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="text-red-400 hover:text-red-300 p-1 rounded text-xs transition-colors"
            title="Delete offer"
          >
            🗑️
          </button>
        </div>
      )}

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl opacity-25 -z-10"></div>
      )}
    </div>
  )
}