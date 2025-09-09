'use client'

import { useState } from 'react'
import { MoneyModelTemplate } from '@/types/money-model'
import OfferDetailModal from './OfferDetailModal'

interface TemplateCardProps {
  template: MoneyModelTemplate
  onSelect: (template: MoneyModelTemplate) => void
}

export default function TemplateCard({ template, onSelect }: TemplateCardProps) {
  const [selectedOfferIndex, setSelectedOfferIndex] = useState<number | null>(null)
  const [showOfferDetail, setShowOfferDetail] = useState(false)
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-600/20'
      case 'intermediate': return 'text-yellow-400 bg-yellow-600/20'
      case 'advanced': return 'text-red-400 bg-red-600/20'
      default: return 'text-gray-400 bg-gray-600/20'
    }
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      fitness: '💪',
      saas: '💻',
      'info-marketing': '📚',
      ecommerce: '🛒',
      services: '🎯',
      default: '💰'
    }
    return icons[category as keyof typeof icons] || icons.default
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      fitness: 'from-orange-500/20 to-red-500/20 border-orange-500/30',
      saas: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
      'info-marketing': 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
      ecommerce: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
      services: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30',
      default: 'from-gray-500/20 to-slate-500/20 border-gray-500/30'
    }
    return colors[category as keyof typeof colors] || colors.default
  }

  const handleOfferClick = (index: number, event: React.MouseEvent) => {
    event.stopPropagation() // Prevent card selection
    setSelectedOfferIndex(index)
    setShowOfferDetail(true)
  }

  const handleCloseModal = () => {
    setShowOfferDetail(false)
    setSelectedOfferIndex(null)
  }

  // Create visual preview of value ladder structure
  const VisualPreview = () => {
    const offers = template.offerNodes
    const totalWidth = 240
    const totalHeight = 80
    const nodeWidth = 40
    const nodeHeight = 16

    return (
      <div className="mb-4 relative">
        <svg width={totalWidth} height={totalHeight} className="mb-2">
          {/* Background grid */}
          <defs>
            <pattern id={`grid-${template.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#grid-${template.id})`} />
          
          {/* Offer nodes */}
          {offers.map((offer, index) => {
            const x = (index * (totalWidth / offers.length)) + 20
            const y = totalHeight / 2 - nodeHeight / 2
            
            const getOfferColor = (type: string) => {
              const colors = {
                attraction: '#3b82f6',
                core: '#8b5cf6',
                upsell: '#10b981',
                downsell: '#f59e0b',
                continuity: '#ef4444'
              }
              return colors[type as keyof typeof colors] || '#6b7280'
            }

            return (
              <g key={index}>
                {/* Connection line to next offer */}
                {index < offers.length - 1 && (
                  <line
                    x1={x + nodeWidth}
                    y1={y + nodeHeight / 2}
                    x2={x + (totalWidth / offers.length) - 20}
                    y2={y + nodeHeight / 2}
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="2"
                    markerEnd={`url(#arrowhead-${template.id})`}
                  />
                )}
                
                {/* Clickable Offer node */}
                <rect
                  x={x}
                  y={y}
                  width={nodeWidth}
                  height={nodeHeight}
                  rx="4"
                  fill={getOfferColor(offer.type)}
                  opacity="0.8"
                  className="cursor-pointer hover:opacity-100 transition-opacity"
                  onClick={(e) => handleOfferClick(index, e as any)}
                />
                
                {/* Hover overlay for better UX */}
                <rect
                  x={x}
                  y={y}
                  width={nodeWidth}
                  height={nodeHeight}
                  rx="4"
                  fill="rgba(255,255,255,0.1)"
                  opacity="0"
                  className="cursor-pointer hover:opacity-100 transition-opacity"
                  onClick={(e) => handleOfferClick(index, e as any)}
                />
                
                {/* Price label */}
                <text
                  x={x + nodeWidth / 2}
                  y={y + nodeHeight + 12}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.8)"
                  fontSize="8"
                  fontFamily="monospace"
                  className="pointer-events-none"
                >
                  {offer.price === 0 ? 'FREE' : `$${offer.price}`}
                </text>
              </g>
            )
          })}
          
          {/* Arrow marker definition */}
          <defs>
            <marker
              id={`arrowhead-${template.id}`}
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="rgba(255,255,255,0.3)"
              />
            </marker>
          </defs>
        </svg>
        
        {/* Click hint */}
        <div className="text-center">
          <p className="text-xs text-gray-500">💡 Click any offer above to see Alex's breakdown</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`
        bg-gradient-to-br ${getCategoryColor(template.category)}
        border rounded-2xl p-6 cursor-pointer transition-all duration-300
        hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20
        group relative overflow-hidden
      `}
      onClick={() => onSelect(template)}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
      </div>

      {/* Header */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{getCategoryIcon(template.category)}</div>
            <div>
              <h3 className="text-white font-bold text-lg leading-tight group-hover:text-purple-200 transition-colors">
                {template.name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                  {template.difficulty}
                </span>
                <span className="text-gray-400 text-xs">{template.implementationTime}</span>
              </div>
            </div>
          </div>
          
          {/* Success rate indicator */}
          <div className="text-right">
            <div className="text-green-400 text-sm font-bold">{template.successRate}%</div>
            <div className="text-gray-400 text-xs">success rate</div>
          </div>
        </div>

        {/* Visual Preview */}
        <div className="mb-4">
          <VisualPreview />
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-2">
          {template.description}
        </p>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-white font-bold text-lg">{template.previewMetrics.totalOffers}</div>
            <div className="text-gray-400 text-xs">Offers</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-white font-bold text-lg">{formatCurrency(template.previewMetrics.avgPrice)}</div>
            <div className="text-gray-400 text-xs">Avg Price</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-green-400 font-bold text-lg">
              {formatCurrency(template.previewMetrics.projectedRevenue)}
            </div>
            <div className="text-gray-400 text-xs">Revenue</div>
          </div>
        </div>

        {/* Revenue Increase Highlight */}
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-purple-300 text-sm font-medium">Expected Revenue Increase</div>
              <div className="text-white text-xl font-bold">+{template.averageRevenueIncrease}%</div>
            </div>
            <div className="text-4xl opacity-50">📈</div>
          </div>
        </div>

        {/* Industry Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {template.industryTags.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300"
            >
              {tag}
            </span>
          ))}
          {template.industryTags.length > 3 && (
            <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-400">
              +{template.industryTags.length - 3} more
            </span>
          )}
        </div>

        {/* CTA Button */}
        <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 group-hover:scale-105">
          <span className="flex items-center justify-center space-x-2">
            <span>Load Template</span>
            <span className="text-lg">→</span>
          </span>
        </button>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/5 group-hover:to-blue-600/5 transition-all duration-300 rounded-2xl" />
      </div>

      {/* Offer Detail Modal */}
      {showOfferDetail && selectedOfferIndex !== null && template.offerEducation && template.offerEducation[selectedOfferIndex] && (
        <OfferDetailModal
          offerEducation={template.offerEducation[selectedOfferIndex]}
          offerName={template.offerNodes[selectedOfferIndex].name}
          offerPrice={template.offerNodes[selectedOfferIndex].price}
          onClose={handleCloseModal}
          isOpen={showOfferDetail}
        />
      )}
    </div>
  )
}