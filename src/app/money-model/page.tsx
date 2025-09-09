'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useHotkeys } from 'react-hotkeys-hook'
import { OfferNode, ViewMode, MoneyModel, OfferType, MoneyModelTemplate } from '@/types/money-model'
import ValueLadderCanvas from '@/components/money-model/ValueLadderCanvas'
import TemplateLibrary from '@/components/money-model/TemplateLibrary'
import EnhancedOfferDisplay from '@/components/money-model/EnhancedOfferDisplay'
import { MoneyModelAI } from '@/services/MoneyModelAI'
import { getTemplateById } from '@/data/moneyModelTemplates'
import { useHistory } from '@/hooks/useHistory'

export default function MoneyModelBuilder() {
  const searchParams = useSearchParams()
  const [viewMode, setViewMode] = useState<ViewMode>('visual')
  
  // Initialize with empty array, will be populated later
  const { 
    state: offers, 
    pushToHistory, 
    undo, 
    redo, 
    canUndo, 
    canRedo, 
    reset: resetHistory 
  } = useHistory<OfferNode[]>([])
  
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null)
  const [showAIInsights, setShowAIInsights] = useState(true)
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false)
  const [loadedTemplate, setLoadedTemplate] = useState<MoneyModelTemplate | null>(null)
  const [selectedOfferIndex, setSelectedOfferIndex] = useState<number | null>(null)
  const [showOfferDetail, setShowOfferDetail] = useState(false)

  // Keyboard shortcuts for undo/redo
  useHotkeys('mod+z', (e) => {
    e.preventDefault()
    undo()
  }, { enableOnContentEditable: true })

  useHotkeys('mod+shift+z', (e) => {
    e.preventDefault()
    redo()
  }, { enableOnContentEditable: true })

  useHotkeys('mod+y', (e) => {
    e.preventDefault()
    redo()
  }, { enableOnContentEditable: true })

  // Initialize with template or sample data
  useEffect(() => {
    // Check for template parameter in URL
    const templateId = searchParams.get('template')
    let templateToLoad = null

    if (templateId) {
      templateToLoad = getTemplateById(templateId)
    } else {
      // Check localStorage for selected template
      const storedTemplate = localStorage.getItem('selectedTemplate')
      if (storedTemplate) {
        try {
          templateToLoad = JSON.parse(storedTemplate)
          localStorage.removeItem('selectedTemplate') // Clear after use
        } catch (error) {
          console.error('Failed to parse stored template:', error)
        }
      }
    }

    if (templateToLoad) {
      // We'll load the template after the functions are defined
      setTimeout(() => loadTemplate(templateToLoad), 0)
    } else {
      // Initialize with sample data for demo
      const sampleOffers: OfferNode[] = [
      {
        id: 'offer_1',
        name: 'Free Lead Magnet',
        description: 'Ultimate Business Checklist',
        price: 0,
        type: 'attraction',
        status: 'active',
        position: { x: 100, y: 200 },
        size: { width: 300, height: 200 },
        metrics: {
          currentMonthlyRevenue: 0,
          projectedMonthlyRevenue: 0,
          averageOrderValue: 0,
          conversionRate: 12,
          trafficVolume: 1000,
          customersPerMonth: 120,
          costToDeliver: 0,
          profitMargin: 100,
          customerAcquisitionCost: 25,
          lifetimeValue: 400,
          deliveryTimeframe: 'immediate',
          customerEffortRequired: 2,
          marketDemand: 9,
          competitiveAdvantage: 7,
          implementationComplexity: 2
        },
        connections: [{
          id: 'conn_1',
          fromOfferId: 'offer_1',
          toOfferId: 'offer_2',
          conversionRate: 15,
          averageTimeBetween: 'immediate',
          trigger: 'purchase'
        }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['lead-gen']
      },
      {
        id: 'offer_2',
        name: 'Quick Win Course',
        description: '7-Day Business Breakthrough',
        price: 47,
        type: 'attraction',
        status: 'active',
        position: { x: 400, y: 100 },
        size: { width: 300, height: 200 },
        metrics: {
          currentMonthlyRevenue: 850,
          projectedMonthlyRevenue: 1400,
          averageOrderValue: 47,
          conversionRate: 15,
          trafficVolume: 120,
          customersPerMonth: 18,
          costToDeliver: 15,
          profitMargin: 68,
          customerAcquisitionCost: 25,
          lifetimeValue: 400,
          deliveryTimeframe: '7 days',
          customerEffortRequired: 4,
          marketDemand: 8,
          competitiveAdvantage: 6,
          implementationComplexity: 3
        },
        connections: [{
          id: 'conn_2',
          fromOfferId: 'offer_2',
          toOfferId: 'offer_3',
          conversionRate: 25,
          averageTimeBetween: '3 days',
          trigger: 'result achieved'
        }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['course']
      },
      {
        id: 'offer_3',
        name: 'Core Program',
        description: 'Complete Business Transformation',
        price: 497,
        type: 'core',
        status: 'active',
        position: { x: 700, y: 200 },
        size: { width: 300, height: 200 },
        metrics: {
          currentMonthlyRevenue: 2235,
          projectedMonthlyRevenue: 4470,
          averageOrderValue: 497,
          conversionRate: 25,
          trafficVolume: 18,
          customersPerMonth: 4.5,
          costToDeliver: 100,
          profitMargin: 80,
          customerAcquisitionCost: 25,
          lifetimeValue: 1500,
          deliveryTimeframe: '30 days',
          customerEffortRequired: 7,
          marketDemand: 9,
          competitiveAdvantage: 8,
          implementationComplexity: 6
        },
        connections: [{
          id: 'conn_3',
          fromOfferId: 'offer_3',
          toOfferId: 'offer_4',
          conversionRate: 35,
          averageTimeBetween: '7 days',
          trigger: 'purchase'
        }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['core']
      },
      {
        id: 'offer_4',
        name: 'VIP Mastermind',
        description: 'Elite Business Coaching',
        price: 2997,
        type: 'upsell',
        status: 'active',
        position: { x: 1000, y: 100 },
        size: { width: 300, height: 200 },
        metrics: {
          currentMonthlyRevenue: 4495,
          projectedMonthlyRevenue: 8991,
          averageOrderValue: 2997,
          conversionRate: 35,
          trafficVolume: 4.5,
          customersPerMonth: 1.5,
          costToDeliver: 500,
          profitMargin: 83,
          customerAcquisitionCost: 25,
          lifetimeValue: 5000,
          deliveryTimeframe: '90 days',
          customerEffortRequired: 8,
          marketDemand: 7,
          competitiveAdvantage: 9,
          implementationComplexity: 8
        },
        connections: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['premium']
      }
    ]

      resetHistory(sampleOffers)
    }
  }, [searchParams])

  // Run AI analysis when offers change
  useEffect(() => {
    if (offers.length > 0 && showAIInsights) {
      runAIAnalysis()
    }
  }, [offers, showAIInsights])


  const runAIAnalysis = async () => {
    setIsLoading(true)
    try {
      const ai = new MoneyModelAI()
      const visual = ai.analyzeVisualStructure(offers)
      const metrics = ai.analyzeTextMetrics(offers)
      const master = ai.combinedAnalysis(visual, metrics, offers)
      
      setAiAnalysis({
        success: true,
        data: { visual, metrics, master }
      })
    } catch (error) {
      console.error('AI Analysis failed:', error)
    }
    setIsLoading(false)
  }

  const totalCurrentRevenue = offers.reduce((sum, offer) => sum + offer.metrics.currentMonthlyRevenue, 0)
  const totalProjectedRevenue = offers.reduce((sum, offer) => sum + offer.metrics.projectedMonthlyRevenue, 0)
  const revenueIncrease = totalProjectedRevenue - totalCurrentRevenue
  const increasePercentage = totalCurrentRevenue > 0 ? ((revenueIncrease / totalCurrentRevenue) * 100) : 0

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const loadTemplate = (template: MoneyModelTemplate) => {
    console.log('Loading template:', template.name)
    
    // Convert template offer nodes to full OfferNode objects with unique IDs
    const templateOffers: OfferNode[] = template.offerNodes.map((offerNode, index) => ({
      ...offerNode,
      id: `template_offer_${Date.now()}_${index}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Auto-position offers in a flowing layout
      position: {
        x: 150 + (index * 400),
        y: 150 + (index % 2 === 0 ? 0 : 100)
      }
    }))

    // Create connections between offers based on template
    const connectionsToAdd = template.connections || []
    templateOffers.forEach((offer, index) => {
      if (index < templateOffers.length - 1 && index < connectionsToAdd.length) {
        const connection = connectionsToAdd[index]
        offer.connections = [{
          id: `template_conn_${Date.now()}_${index}`,
          fromOfferId: offer.id,
          toOfferId: templateOffers[index + 1].id,
          conversionRate: connection.conversionRate,
          averageTimeBetween: connection.averageTimeBetween,
          trigger: connection.trigger
        }]
      }
    })

    resetHistory(templateOffers)
    setLoadedTemplate(template)
    setShowTemplateLibrary(false)
    
    // Show AI insights for template
    setShowAIInsights(true)
  }

  const handleTemplateSelect = (template: MoneyModelTemplate) => {
    // Show confirmation dialog
    const hasExistingWork = offers.length > 0
    if (hasExistingWork) {
      const confirmed = window.confirm(
        `Loading "${template.name}" will replace your current money model. Are you sure you want to continue?`
      )
      if (!confirmed) return
    }
    
    loadTemplate(template)
  }

  const startFromScratch = () => {
    const confirmed = window.confirm(
      'This will clear your current money model and start fresh. Are you sure?'
    )
    if (!confirmed) return
    
    resetHistory([])
    setLoadedTemplate(null)
    setSelectedOfferId(null)
    setAiAnalysis(null)
  }

  const selectedOffer = offers.find(o => o.id === selectedOfferId)

  const handleOfferEducationClick = (offerIndex: number) => {
    setSelectedOfferIndex(offerIndex)
    setShowOfferDetail(true)
  }

  const handleCloseOfferDetail = () => {
    setShowOfferDetail(false)
    setSelectedOfferIndex(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-slate-900/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
                <span>💰</span>
                <span>Visual Money Model Builder</span>
              </h1>
              <p className="text-gray-400 text-sm">Build Alex's 4-Prong Money Model with drag-and-drop + detailed analysis</p>
            </div>

            {/* Template Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowTemplateLibrary(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all flex items-center space-x-2"
              >
                <span>📚</span>
                <span>Browse Templates</span>
              </button>
              
              {offers.length > 0 && (
                <button
                  onClick={startFromScratch}
                  className="px-4 py-2 bg-gray-600/20 hover:bg-gray-600/30 text-gray-300 font-medium rounded-lg transition-all flex items-center space-x-2 border border-gray-500/30"
                >
                  <span>🆕</span>
                  <span>Start Fresh</span>
                </button>
              )}

              {/* Undo/Redo buttons */}
              <div className="flex space-x-1">
                <button
                  onClick={undo}
                  disabled={!canUndo}
                  className={`p-2 rounded-lg text-sm transition-colors ${
                    canUndo 
                      ? 'bg-white/10 text-white hover:bg-white/20' 
                      : 'bg-white/5 text-gray-500 cursor-not-allowed'
                  }`}
                  title="Undo (Cmd+Z)"
                >
                  ↶
                </button>
                <button
                  onClick={redo}
                  disabled={!canRedo}
                  className={`p-2 rounded-lg text-sm transition-colors ${
                    canRedo 
                      ? 'bg-white/10 text-white hover:bg-white/20' 
                      : 'bg-white/5 text-gray-500 cursor-not-allowed'
                  }`}
                  title="Redo (Cmd+Shift+Z)"
                >
                  ↷
                </button>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-4">
              <div className="bg-slate-800 rounded-full p-1 flex">
                <button
                  onClick={() => setViewMode('visual')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    viewMode === 'visual' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  🎨 Visual
                </button>
                <button
                  onClick={() => setViewMode('text')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    viewMode === 'text' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  📝 Text
                </button>
                <button
                  onClick={() => setViewMode('split')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    viewMode === 'split' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  ⚡ Both
                </button>
              </div>

              <button
                onClick={() => setShowAIInsights(!showAIInsights)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  showAIInsights
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                    : 'bg-slate-700 text-gray-400 border border-gray-600'
                }`}
              >
                🤖 AI Insights
              </button>
            </div>
          </div>

          {/* Loaded Template Info */}
          {loadedTemplate && (
            <div className="mt-4 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-xl p-4 border border-purple-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <div className="text-white font-semibold">
                      Using Template: {loadedTemplate.name}
                    </div>
                    <div className="text-purple-300 text-sm">
                      {loadedTemplate.description}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-bold text-sm">
                    +{loadedTemplate.averageRevenueIncrease}% Expected Increase
                  </div>
                  <div className="text-gray-400 text-xs">
                    {loadedTemplate.successRate}% Success Rate
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="bg-white/10 backdrop-blur rounded-xl p-3">
              <div className="text-gray-400 text-xs">Current Revenue</div>
              <div className="text-white text-lg font-bold">{formatCurrency(totalCurrentRevenue)}</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-3">
              <div className="text-gray-400 text-xs">Projected Revenue</div>
              <div className="text-green-400 text-lg font-bold">{formatCurrency(totalProjectedRevenue)}</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-3">
              <div className="text-gray-400 text-xs">Potential Increase</div>
              <div className="text-blue-400 text-lg font-bold">
                {formatCurrency(revenueIncrease)} 
                <span className="text-sm ml-1">({increasePercentage.toFixed(0)}%)</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-3">
              <div className="text-gray-400 text-xs">Offers Active</div>
              <div className="text-white text-lg font-bold">
                {offers.filter(o => o.status === 'active').length}/{offers.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-180px)]">
        {/* Visual Mode */}
        {(viewMode === 'visual' || viewMode === 'split') && (
          <div className={viewMode === 'split' ? 'w-2/3' : 'w-full'}>
            <ValueLadderCanvas
              offers={offers}
              onOffersChange={pushToHistory}
              onOfferSelect={setSelectedOfferId}
              selectedOfferId={selectedOfferId}
              showAIInsights={showAIInsights}
            />
          </div>
        )}

        {/* Text Mode / Properties Panel */}
        {(viewMode === 'text' || viewMode === 'split') && (
          <div className={`bg-slate-800/50 border-l border-white/10 overflow-y-auto ${
            viewMode === 'split' ? 'w-1/3' : 'w-full'
          }`}>
            <div className="p-6">
              {selectedOffer ? (
                // Selected Offer Details
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Offer Details</h3>
                    <button
                      onClick={() => setSelectedOfferId(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Offer Header */}
                  <div className="bg-white/5 rounded-xl p-4 mb-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-3xl">{selectedOffer.type === 'attraction' ? '🎯' : selectedOffer.type === 'core' ? '💎' : selectedOffer.type === 'upsell' ? '📈' : selectedOffer.type === 'downsell' ? '🔄' : '🔁'}</span>
                      <div>
                        <div className="text-white text-lg font-bold">{selectedOffer.name}</div>
                        <div className="text-gray-400 text-sm capitalize">{selectedOffer.type} Offer</div>
                      </div>
                    </div>
                    <div className="text-purple-400 text-2xl font-bold">{formatCurrency(selectedOffer.price)}</div>
                  </div>

                  {/* Key Metrics */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-semibold mb-3">Revenue Metrics</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="text-gray-400 text-xs">Current Revenue</div>
                          <div className="text-white font-semibold">{formatCurrency(selectedOffer.metrics.currentMonthlyRevenue)}</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="text-gray-400 text-xs">Projected Revenue</div>
                          <div className="text-green-400 font-semibold">{formatCurrency(selectedOffer.metrics.projectedMonthlyRevenue)}</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="text-gray-400 text-xs">Conversion Rate</div>
                          <div className="text-white font-semibold">{selectedOffer.metrics.conversionRate}%</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="text-gray-400 text-xs">Customers/Month</div>
                          <div className="text-white font-semibold">{selectedOffer.metrics.customersPerMonth}</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-semibold mb-3">Performance Scores</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Market Demand</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-700 rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${selectedOffer.metrics.marketDemand * 10}%` }} />
                            </div>
                            <span className="text-white text-sm">{selectedOffer.metrics.marketDemand}/10</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Competitive Advantage</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-700 rounded-full h-2">
                              <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${selectedOffer.metrics.competitiveAdvantage * 10}%` }} />
                            </div>
                            <span className="text-white text-sm">{selectedOffer.metrics.competitiveAdvantage}/10</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Connections */}
                    {selectedOffer.connections.length > 0 && (
                      <div>
                        <h4 className="text-white font-semibold mb-3">Customer Flow</h4>
                        <div className="space-y-2">
                          {selectedOffer.connections.map((connection, index) => (
                            <div key={index} className="bg-white/5 rounded-lg p-3">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Next Offer</span>
                                <span className="text-green-400 font-semibold">{connection.conversionRate}%</span>
                              </div>
                              <div className="text-white text-sm mt-1">
                                Trigger: {connection.trigger}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Overview Mode
                <div>
                  <h3 className="text-xl font-bold text-white mb-6">Money Model Overview</h3>
                  
                  {/* AI Analysis Summary */}
                  {aiAnalysis?.data?.master && (
                    <div className="bg-white/5 rounded-xl p-4 mb-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-2xl">🤖</span>
                        <h4 className="text-white font-semibold">AI Analysis</h4>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="text-gray-400 text-sm">Structure Recognition</div>
                          <div className="text-white">{aiAnalysis.data.visual.patternRecognized}</div>
                          <div className="text-blue-400 text-sm">Score: {aiAnalysis.data.visual.structureScore}/100</div>
                        </div>

                        <div>
                          <div className="text-gray-400 text-sm">Top Priority Actions</div>
                          <div className="space-y-2 mt-2">
                            {aiAnalysis.data.master.priorityActions.slice(0, 3).map((action: any, index: number) => (
                              <div key={index} className="bg-white/5 rounded-lg p-3">
                                <div className="text-yellow-400 text-xs font-medium">{action.impact.toUpperCase()}</div>
                                <div className="text-white text-sm">{action.title}</div>
                                <div className="text-green-400 text-xs">+{formatCurrency(action.expectedReturn)}/month</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Enhanced Offer List */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-white font-semibold">All Offers ({offers.length})</h4>
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="text-gray-400">Enhanced View</span>
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {offers.map(offer => (
                        <EnhancedOfferDisplay
                          key={offer.id}
                          offer={offer}
                          onOfferSelect={setSelectedOfferId}
                          isSelected={offer.id === selectedOfferId}
                          showFullDetails={!selectedOffer}
                          formatCurrency={formatCurrency}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Template Library Modal */}
      {showTemplateLibrary && (
        <TemplateLibrary
          onTemplateSelect={handleTemplateSelect}
          onClose={() => setShowTemplateLibrary(false)}
          isModal={true}
        />
      )}

    </div>
  )
}