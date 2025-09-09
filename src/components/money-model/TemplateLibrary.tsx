'use client'

import { useState, useMemo } from 'react'
import { MoneyModelTemplate } from '@/types/money-model'
import { MONEY_MODEL_TEMPLATES } from '@/data/moneyModelTemplates'
import TemplateCard from './TemplateCard'

interface TemplateLibraryProps {
  onTemplateSelect: (template: MoneyModelTemplate) => void
  onClose?: () => void
  isModal?: boolean
}

type FilterCategory = 'all' | 'fitness' | 'saas' | 'info-marketing' | 'ecommerce' | 'services'
type FilterDifficulty = 'all' | 'beginner' | 'intermediate' | 'advanced'
type SortOption = 'popular' | 'revenue' | 'difficulty' | 'success-rate'

export default function TemplateLibrary({ onTemplateSelect, onClose, isModal = false }: TemplateLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<FilterDifficulty>('all')
  const [sortBy, setSortBy] = useState<SortOption>('popular')

  const categories = [
    { id: 'all', name: 'All Templates', icon: '🎯', count: MONEY_MODEL_TEMPLATES.length },
    { id: 'fitness', name: 'Fitness & Health', icon: '💪', count: MONEY_MODEL_TEMPLATES.filter(t => t.category === 'fitness').length },
    { id: 'saas', name: 'SaaS & Software', icon: '💻', count: MONEY_MODEL_TEMPLATES.filter(t => t.category === 'saas').length },
    { id: 'info-marketing', name: 'Info Marketing', icon: '📚', count: MONEY_MODEL_TEMPLATES.filter(t => t.category === 'info-marketing').length },
    { id: 'ecommerce', name: 'E-commerce', icon: '🛒', count: MONEY_MODEL_TEMPLATES.filter(t => t.category === 'ecommerce').length },
    { id: 'services', name: 'Services & Consulting', icon: '🎯', count: MONEY_MODEL_TEMPLATES.filter(t => t.category === 'services').length }
  ]

  const difficulties = [
    { id: 'all', name: 'All Levels', color: 'text-gray-400' },
    { id: 'beginner', name: 'Beginner', color: 'text-green-400' },
    { id: 'intermediate', name: 'Intermediate', color: 'text-yellow-400' },
    { id: 'advanced', name: 'Advanced', color: 'text-red-400' }
  ]

  const sortOptions = [
    { id: 'popular', name: 'Most Popular', icon: '🔥' },
    { id: 'revenue', name: 'Highest Revenue', icon: '💰' },
    { id: 'difficulty', name: 'By Difficulty', icon: '📊' },
    { id: 'success-rate', name: 'Success Rate', icon: '🎯' }
  ]

  const filteredAndSortedTemplates = useMemo(() => {
    let filtered = MONEY_MODEL_TEMPLATES

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.industryTags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory)
    }

    // Apply difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(template => template.difficulty === selectedDifficulty)
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'revenue':
          return b.previewMetrics.projectedRevenue - a.previewMetrics.projectedRevenue
        case 'difficulty':
          const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 }
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        case 'success-rate':
          return b.successRate - a.successRate
        case 'popular':
        default:
          return b.averageRevenueIncrease - a.averageRevenueIncrease
      }
    })

    return sorted
  }, [searchQuery, selectedCategory, selectedDifficulty, sortBy])

  const handleTemplateSelect = (template: MoneyModelTemplate) => {
    onTemplateSelect(template)
    if (onClose) onClose()
  }

  return (
    <div className={`${isModal ? 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4' : ''}`}>
      <div className={`
        ${isModal 
          ? 'bg-slate-900 rounded-2xl max-w-7xl max-h-[90vh] overflow-hidden border border-white/10' 
          : 'min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'
        }
        w-full
      `}>
        {/* Header */}
        <div className={`${isModal ? 'p-6 border-b border-white/10' : 'sticky top-0 z-40 bg-slate-900/80 backdrop-blur-lg border-b border-white/10'}`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center space-x-3">
                <span className="text-4xl">🎯</span>
                <span>Template Library</span>
              </h1>
              <p className="text-gray-400 mt-1">Choose from proven value ladder templates used by $100M+ businesses</p>
            </div>
            
            {isModal && onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search templates, industries, or strategies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/20 transition-all"
                />
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="flex space-x-2">
              {difficulties.map(difficulty => (
                <button
                  key={difficulty.id}
                  onClick={() => setSelectedDifficulty(difficulty.id as FilterDifficulty)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    selectedDifficulty === difficulty.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {difficulty.name}
                </button>
              ))}
            </div>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:bg-white/20"
            >
              {sortOptions.map(option => (
                <option key={option.id} value={option.id} className="bg-slate-800">
                  {option.icon} {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        <div className={`flex ${isModal ? 'max-h-[calc(90vh-200px)] overflow-hidden' : 'min-h-screen'}`}>
          {/* Sidebar - Categories */}
          <div className={`${isModal ? 'w-64 p-6 border-r border-white/10 overflow-y-auto' : 'w-64 p-6'}`}>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id as FilterCategory)}
                  className={`w-full text-left flex items-center justify-between p-3 rounded-xl transition-all ${
                    selectedCategory === category.id
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                      : 'text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{category.icon}</span>
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    {category.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-8 bg-white/5 rounded-xl p-4">
              <h4 className="text-white font-medium mb-3">Library Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Total Templates</span>
                  <span className="text-white font-medium">{MONEY_MODEL_TEMPLATES.length}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Avg Success Rate</span>
                  <span className="text-green-400 font-medium">
                    {Math.round(MONEY_MODEL_TEMPLATES.reduce((sum, t) => sum + t.successRate, 0) / MONEY_MODEL_TEMPLATES.length)}%
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Total Revenue Proven</span>
                  <span className="text-purple-400 font-medium">$2.1B+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Template Grid */}
          <div className={`flex-1 ${isModal ? 'p-6 overflow-y-auto' : 'p-6'}`}>
            {filteredAndSortedTemplates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-white mb-2">No templates found</h3>
                <p className="text-gray-400 text-center max-w-md">
                  Try adjusting your search criteria or explore different categories to find the perfect template for your business.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {selectedCategory === 'all' ? 'All Templates' : categories.find(c => c.id === selectedCategory)?.name}
                    </h2>
                    <p className="text-gray-400 text-sm">
                      {filteredAndSortedTemplates.length} template{filteredAndSortedTemplates.length !== 1 ? 's' : ''} found
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredAndSortedTemplates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onSelect={handleTemplateSelect}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}