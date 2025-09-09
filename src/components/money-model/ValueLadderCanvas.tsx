'use client'

import { useCallback, useState, useEffect } from 'react'
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  Connection,
  NodeTypes,
  MarkerType,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow'
import 'reactflow/dist/style.css'

import { OfferNode, OfferType, Connection as ModelConnection } from '@/types/money-model'
import OfferNodeComponent from './OfferNodeComponent'
import ConnectionEditModal from './ConnectionEditModal'
import OfferDetailSidebar from './OfferDetailSidebar'
import { MoneyModelAI } from '@/services/MoneyModelAI'

interface ValueLadderCanvasProps {
  offers: OfferNode[]
  onOffersChange: (offers: OfferNode[]) => void
  onOfferSelect: (offerId: string | null) => void
  selectedOfferId: string | null
  showAIInsights: boolean
}


const nodeTypes: NodeTypes = {
  offerNode: OfferNodeComponent,
}

// Inner component that uses ReactFlow hooks
function ValueLadderCanvasInner({ 
  offers, 
  onOffersChange, 
  onOfferSelect,
  selectedOfferId,
  showAIInsights
}: ValueLadderCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [selectedConnection, setSelectedConnection] = useState<ModelConnection | null>(null)
  const [showConnectionModal, setShowConnectionModal] = useState(false)
  const [financialMetrics, setFinancialMetrics] = useState<any>(null)
  const [showOfferSidebar, setShowOfferSidebar] = useState(false)
  const [sidebarOffer, setSidebarOffer] = useState<OfferNode | null>(null)
  // const { getNodes } = useReactFlow() // Temporarily commented out to test basic functionality

  // Convert offers to ReactFlow nodes
  useEffect(() => {
    const flowNodes = offers.map((offer, index): Node => {
      return {
        id: offer.id,
        type: 'offerNode',
        position: offer.position,
        data: {
          offer,
          isSelected: offer.id === selectedOfferId,
          onSelect: () => onOfferSelect(offer.id),
          onUpdate: (updates: Partial<OfferNode>) => updateOffer(offer.id, updates),
          onDelete: () => deleteOffer(offer.id),
          onDuplicate: () => duplicateOffer(offer.id),
          onEdit: () => openOfferSidebar(offer),
          aiInsights: aiAnalysis?.data?.master?.priorityActions?.filter(
            (action: any) => action.title.includes(offer.name)
          ) || [],
        },
        style: {
          width: 300,
          height: getNodeHeight(offer),
        },
        className: `offer-node offer-${offer.type} ${offer.id === selectedOfferId ? 'selected' : ''}`,
      }
    })
    setNodes(flowNodes)
  }, [offers, selectedOfferId, aiAnalysis])

  // Convert connections to ReactFlow edges
  useEffect(() => {
    const flowEdges: Edge[] = []
    
    offers.forEach(offer => {
      offer.connections.forEach(connection => {
        const targetOffer = offers.find(o => o.id === connection.toOfferId)
        if (targetOffer) {
          flowEdges.push({
            id: connection.id,
            source: offer.id,
            target: connection.toOfferId,
            label: `${connection.conversionRate}%`,
            labelBgPadding: [8, 4],
            labelBgBorderRadius: 4,
            labelBgStyle: { fill: '#1f2937', color: '#fff' },
            style: { 
              strokeWidth: 2,
              stroke: getConnectionColor(connection.conversionRate)
            },
            markerEnd: {
              type: MarkerType.Arrow,
              color: getConnectionColor(connection.conversionRate),
              width: 20,
              height: 20,
            },
            animated: connection.conversionRate > 30,
            data: { connection }
          })
        }
      })
    })
    
    setEdges(flowEdges)
  }, [offers])

  // Run AI analysis when offers change
  useEffect(() => {
    if (offers.length > 0 && showAIInsights) {
      runAIAnalysis()
    }
  }, [offers, showAIInsights])

  // Calculate financial metrics in real-time
  useEffect(() => {
    if (offers.length > 0) {
      calculateFinancialMetrics()
    }
  }, [offers])

  const runAIAnalysis = async () => {
    const ai = new MoneyModelAI()
    const visual = ai.analyzeVisualStructure(offers)
    const metrics = ai.analyzeTextMetrics(offers)
    const master = ai.combinedAnalysis(visual, metrics, offers)
    
    setAiAnalysis({
      success: true,
      data: { visual, metrics, master }
    })
  }

  const calculateFinancialMetrics = () => {
    let totalMonthlyRevenue = 0
    let totalMonthlyProfit = 0
    let totalCustomers = 0
    let weightedAOV = 0
    let totalCosts = 0

    offers.forEach(offer => {
      const customers = offer.metrics.customersPerMonth || 0
      const revenue = customers * offer.price
      const costs = customers * (offer.metrics.costToDeliver || 0)
      const profit = revenue - costs

      totalMonthlyRevenue += revenue
      totalMonthlyProfit += profit
      totalCustomers += customers
      totalCosts += costs

      if (customers > 0) {
        weightedAOV += offer.price * customers
      }
    })

    const averageAOV = totalCustomers > 0 ? weightedAOV / totalCustomers : 0
    const profitMargin = totalMonthlyRevenue > 0 ? (totalMonthlyProfit / totalMonthlyRevenue) * 100 : 0
    const annualRevenue = totalMonthlyRevenue * 12
    const annualProfit = totalMonthlyProfit * 12

    // Calculate conversion flow metrics
    let flowMetrics = {}
    offers.forEach(offer => {
      const connections = offer.connections
      if (connections.length > 0) {
        connections.forEach(conn => {
          const conversionRate = conn.conversionRate / 100
          const sourceCustomers = offer.metrics.customersPerMonth || 0
          const convertedCustomers = sourceCustomers * conversionRate
          
          flowMetrics[conn.toOfferId] = {
            sourceOffer: offer.name,
            convertedCustomers,
            conversionRate: conn.conversionRate
          }
        })
      }
    })

    setFinancialMetrics({
      totalMonthlyRevenue,
      totalMonthlyProfit,
      totalCustomers,
      averageAOV,
      profitMargin,
      annualRevenue,
      annualProfit,
      totalCosts,
      flowMetrics
    })
  }


  const openOfferSidebar = useCallback((offer: OfferNode) => {
    setSidebarOffer(offer)
    setShowOfferSidebar(true)
  }, [])

  const closeSidebar = useCallback(() => {
    setShowOfferSidebar(false)
    setSidebarOffer(null)
  }, [])

  const updateOfferFromSidebar = useCallback((updates: Partial<OfferNode>) => {
    if (!sidebarOffer) return
    
    const updatedOffers = offers.map(offer => 
      offer.id === sidebarOffer.id ? { ...offer, ...updates } : offer
    )
    onOffersChange(updatedOffers)
    
    // Update the sidebar offer state to reflect changes
    setSidebarOffer(prev => prev ? { ...prev, ...updates } : null)
  }, [offers, onOffersChange, sidebarOffer])

  const updateOffer = (offerId: string, updates: Partial<OfferNode>) => {
    const updatedOffers = offers.map(offer => 
      offer.id === offerId ? { ...offer, ...updates } : offer
    )
    onOffersChange(updatedOffers)
  }

  const deleteOffer = (offerId: string) => {
    // Remove the offer and all connections to/from it
    const updatedOffers = offers
      .filter(offer => offer.id !== offerId)
      .map(offer => ({
        ...offer,
        connections: offer.connections.filter(conn => 
          conn.toOfferId !== offerId
        )
      }))
    
    onOffersChange(updatedOffers)
    
    // Clear selection if deleted offer was selected
    if (offerId === selectedOfferId) {
      onOfferSelect(null)
    }
  }

  const duplicateOffer = (offerId: string) => {
    const offerToDuplicate = offers.find(offer => offer.id === offerId)
    if (!offerToDuplicate) return

    const newOfferId = `offer_${Date.now()}`
    const duplicatedOffer: OfferNode = {
      ...offerToDuplicate,
      id: newOfferId,
      name: `${offerToDuplicate.name} (Copy)`,
      position: {
        x: offerToDuplicate.position.x + 50,
        y: offerToDuplicate.position.y + 50
      },
      connections: [], // Don't duplicate connections initially
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    onOffersChange([...offers, duplicatedOffer])
    onOfferSelect(newOfferId) // Select the new duplicated offer
  }

  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return
      
      const sourceOffer = offers.find(o => o.id === params.source)
      if (!sourceOffer) return

      const newConnection: ModelConnection = {
        id: `connection_${Date.now()}`,
        fromOfferId: params.source,
        toOfferId: params.target,
        conversionRate: getDefaultConversionRate(sourceOffer.type),
        averageTimeBetween: 'immediate',
        trigger: 'purchase'
      }

      const updatedOffers = offers.map(offer => 
        offer.id === params.source 
          ? { ...offer, connections: [...offer.connections, newConnection] }
          : offer
      )
      
      onOffersChange(updatedOffers)
    },
    [offers, onOffersChange]
  )

  const onNodeDragStop = useCallback(
    (event: any, node: Node) => {
      updateOffer(node.id, { 
        position: { x: node.position.x, y: node.position.y }
      })
    },
    [updateOffer]
  )

  const addNewOffer = (type: OfferType, position: { x: number, y: number }) => {
    const newOffer: OfferNode = {
      id: `offer_${Date.now()}`,
      name: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Offer`,
      description: `A ${type} offer in your value ladder`,
      price: getDefaultPrice(type),
      type,
      status: 'planned',
      position,
      size: { width: 300, height: 200 },
      metrics: {
        currentMonthlyRevenue: 0,
        projectedMonthlyRevenue: 0,
        averageOrderValue: getDefaultPrice(type),
        conversionRate: getDefaultConversionRate(type),
        trafficVolume: 100,
        customersPerMonth: 0,
        costToDeliver: 0,
        profitMargin: 80,
        customerAcquisitionCost: 50,
        lifetimeValue: getDefaultPrice(type) * 2,
        deliveryTimeframe: 'immediate',
        customerEffortRequired: 5,
        marketDemand: 7,
        competitiveAdvantage: 6,
        implementationComplexity: 4
      },
      connections: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: []
    }

    onOffersChange([...offers, newOffer])
  }

  const handleConnectionClick = useCallback((connection: ModelConnection) => {
    setSelectedConnection(connection)
    setShowConnectionModal(true)
  }, [])

  const handleConnectionSave = useCallback((updatedConnection: ModelConnection) => {
    const updatedOffers = offers.map(offer => ({
      ...offer,
      connections: offer.connections.map(conn =>
        conn.id === updatedConnection.id ? updatedConnection : conn
      )
    }))
    onOffersChange(updatedOffers)
  }, [offers, onOffersChange])

  const handleConnectionDelete = useCallback(() => {
    if (!selectedConnection) return
    
    const updatedOffers = offers.map(offer => ({
      ...offer,
      connections: offer.connections.filter(conn => conn.id !== selectedConnection.id)
    }))
    onOffersChange(updatedOffers)
  }, [offers, onOffersChange, selectedConnection])

  const onPaneClick = useCallback(
    (event: any) => {
      // Clear selection when clicking empty space
      onOfferSelect(null)
    },
    [onOfferSelect]
  )

  const autoArrangeOffers = useCallback(() => {
    if (offers.length === 0) return

    const updatedOffers = [...offers]
    const offersByType: { [key in OfferType]: OfferNode[] } = {
      attraction: [],
      core: [],
      upsell: [],
      downsell: [],
      continuity: []
    }

    // Group offers by type
    updatedOffers.forEach(offer => {
      offersByType[offer.type].push(offer)
    })

    let currentY = 100
    const typeOrder: OfferType[] = ['attraction', 'core', 'upsell', 'downsell', 'continuity']
    const xPositions = {
      attraction: 200,
      core: 600,
      upsell: 1000,
      downsell: 400,
      continuity: 800
    }

    // Position offers in a logical flow
    typeOrder.forEach(type => {
      const offersOfType = offersByType[type]
      if (offersOfType.length === 0) return

      offersOfType.forEach((offer, index) => {
        const updatedOffer = updatedOffers.find(o => o.id === offer.id)
        if (updatedOffer) {
          updatedOffer.position = {
            x: xPositions[type],
            y: currentY + (index * 250)
          }
        }
      })

      if (offersOfType.length > 0) {
        currentY += offersOfType.length * 250 + 100
      }
    })

    onOffersChange(updatedOffers)
  }, [offers, onOffersChange])

  const exportAsImage = useCallback(() => {
    // Simplified export - just trigger browser print for now
    const printContent = `
      <html>
        <head>
          <title>Value Ladder Export - ${new Date().toLocaleDateString()}</title>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              font-family: Arial, sans-serif; 
              background: white;
            }
            .header { 
              text-align: center; 
              margin-bottom: 20px; 
              font-size: 24px; 
              font-weight: bold; 
            }
            .offer { 
              border: 2px solid #ccc; 
              border-radius: 8px; 
              padding: 15px; 
              margin: 10px 0; 
              page-break-inside: avoid;
            }
            .offer-attraction { border-color: #3b82f6; }
            .offer-core { border-color: #8b5cf6; }
            .offer-upsell { border-color: #10b981; }
            .offer-downsell { border-color: #f59e0b; }
            .offer-continuity { border-color: #ef4444; }
          </style>
        </head>
        <body>
          <div class="header">Value Ladder Export (PNG)</div>
          ${offers.map(offer => `
            <div class="offer offer-${offer.type}">
              <h3>${offer.name} (${offer.type.toUpperCase()})</h3>
              <p><strong>Price:</strong> $${offer.price.toLocaleString()}</p>
              <p><strong>Description:</strong> ${offer.description}</p>
              <p><strong>Status:</strong> ${offer.status}</p>
            </div>
          `).join('')}
        </body>
      </html>
    `

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 500)
    }
  }, [offers])

  const exportAsPDF = useCallback(() => {
    // Create a print-friendly version
    const printContent = `
      <html>
        <head>
          <title>Value Ladder Export</title>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              font-family: Arial, sans-serif; 
              background: white;
            }
            .header { 
              text-align: center; 
              margin-bottom: 20px; 
              font-size: 24px; 
              font-weight: bold; 
            }
            .offer { 
              border: 2px solid #ccc; 
              border-radius: 8px; 
              padding: 15px; 
              margin: 10px 0; 
              page-break-inside: avoid;
            }
            .offer-attraction { border-color: #3b82f6; }
            .offer-core { border-color: #8b5cf6; }
            .offer-upsell { border-color: #10b981; }
            .offer-downsell { border-color: #f59e0b; }
            .offer-continuity { border-color: #ef4444; }
          </style>
        </head>
        <body>
          <div class="header">Value Ladder - ${new Date().toLocaleDateString()}</div>
          ${offers.map(offer => `
            <div class="offer offer-${offer.type}">
              <h3>${offer.name} (${offer.type.toUpperCase()})</h3>
              <p><strong>Price:</strong> $${offer.price.toLocaleString()}</p>
              <p><strong>Description:</strong> ${offer.description}</p>
              <p><strong>Status:</strong> ${offer.status}</p>
              ${offer.connections.length > 0 ? `
                <p><strong>Connects to:</strong> ${offer.connections.map(conn => {
                  const targetOffer = offers.find(o => o.id === conn.toOfferId)
                  return targetOffer ? `${targetOffer.name} (${conn.conversionRate}%)` : 'Unknown'
                }).join(', ')}</p>
              ` : ''}
            </div>
          `).join('')}
        </body>
      </html>
    `

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 500)
    }
  }, [offers])

  return (
    <div className="h-full w-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onPaneClick={onPaneClick}
        onEdgeClick={(event, edge) => {
          const connection = edge.data?.connection
          if (connection) {
            handleConnectionClick(connection)
          }
        }}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="top-right"
        className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
      >
        <Controls className="bg-slate-800 border-white/10" />
        <MiniMap 
          nodeColor={getNodeColor}
          className="bg-slate-800/80 border border-white/10 rounded-lg"
          maskColor="rgba(0, 0, 0, 0.8)"
        />
        <Background 
          variant="dots" 
          gap={20} 
          size={1} 
          color="#374151" 
        />
      </ReactFlow>

      {/* AI Insights Panel */}
      {showAIInsights && aiAnalysis?.data?.master && (
        <div className="absolute top-4 left-4 w-80 bg-slate-800/90 backdrop-blur border border-white/10 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-3">
            <div className="text-xl">🤖</div>
            <h3 className="text-white font-semibold">AI Analysis</h3>
          </div>
          
          <div className="space-y-3">
            <div className="text-sm">
              <div className="text-purple-400 font-medium">Structure Score</div>
              <div className="text-white">{aiAnalysis.data.visual.structureScore}/100</div>
            </div>
            
            <div className="text-sm">
              <div className="text-blue-400 font-medium">Pattern Recognized</div>
              <div className="text-white text-xs">{aiAnalysis.data.visual.patternRecognized}</div>
            </div>

            {aiAnalysis.data.master.priorityActions.slice(0, 2).map((action: any, index: number) => (
              <div key={index} className="bg-white/5 rounded-lg p-3">
                <div className="text-yellow-400 text-xs font-medium">{action.impact.toUpperCase()}</div>
                <div className="text-white text-sm">{action.title}</div>
                <div className="text-gray-400 text-xs mt-1">{action.description}</div>
                <div className="text-green-400 text-xs mt-1">+${action.expectedReturn.toLocaleString()}/month</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Financial Metrics Panel */}
      {financialMetrics && offers.length > 0 && (
        <div className="absolute top-4 right-4 w-80 bg-slate-800/90 backdrop-blur border border-white/10 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-3">
            <div className="text-xl">💰</div>
            <h3 className="text-white font-semibold">Financial Metrics</h3>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-sm">
                <div className="text-green-400 font-medium">Monthly Revenue</div>
                <div className="text-white font-bold">${financialMetrics.totalMonthlyRevenue.toLocaleString()}</div>
              </div>
              
              <div className="text-sm">
                <div className="text-blue-400 font-medium">Monthly Profit</div>
                <div className="text-white font-bold">${financialMetrics.totalMonthlyProfit.toLocaleString()}</div>
              </div>
              
              <div className="text-sm">
                <div className="text-purple-400 font-medium">Total Customers</div>
                <div className="text-white font-bold">{financialMetrics.totalCustomers.toLocaleString()}</div>
              </div>
              
              <div className="text-sm">
                <div className="text-orange-400 font-medium">Avg AOV</div>
                <div className="text-white font-bold">${financialMetrics.averageAOV.toFixed(0)}</div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-yellow-400 text-xs font-medium">PROFIT MARGIN</div>
              <div className="text-white text-lg font-bold">{financialMetrics.profitMargin.toFixed(1)}%</div>
            </div>

            <div className="text-sm">
              <div className="text-gray-400 font-medium">Annual Projection</div>
              <div className="text-green-300 font-bold">${financialMetrics.annualRevenue.toLocaleString()}</div>
              <div className="text-blue-300 text-xs">Profit: ${financialMetrics.annualProfit.toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}


      {/* Controls Toolbar */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col space-y-3">
        {/* Action Buttons */}
        <div className="flex justify-center space-x-2">
          <button
            onClick={autoArrangeOffers}
            className="bg-purple-600/90 hover:bg-purple-700/90 backdrop-blur border border-purple-400/20 rounded-lg px-4 py-2 flex items-center space-x-2 text-white text-sm font-medium transition-colors shadow-lg"
            disabled={offers.length === 0}
          >
            <span>🎯</span>
            <span>Auto-Arrange</span>
          </button>
          
          <button
            onClick={exportAsImage}
            className="bg-green-600/90 hover:bg-green-700/90 backdrop-blur border border-green-400/20 rounded-lg px-4 py-2 flex items-center space-x-2 text-white text-sm font-medium transition-colors shadow-lg"
            disabled={offers.length === 0}
          >
            <span>📸</span>
            <span>Export PNG</span>
          </button>
          
          <button
            onClick={exportAsPDF}
            className="bg-red-600/90 hover:bg-red-700/90 backdrop-blur border border-red-400/20 rounded-lg px-4 py-2 flex items-center space-x-2 text-white text-sm font-medium transition-colors shadow-lg"
            disabled={offers.length === 0}
          >
            <span>📄</span>
            <span>Export PDF</span>
          </button>
        </div>
        
        {/* Add Offer Toolbar */}
        <div className="bg-slate-800/90 backdrop-blur border border-white/10 rounded-full px-6 py-3 flex items-center space-x-4">
          <span className="text-white text-sm font-medium">Add Offer:</span>
          {(['attraction', 'core', 'upsell', 'downsell', 'continuity'] as OfferType[]).map(type => (
            <button
              key={type}
              onClick={() => addNewOffer(type, { x: 400, y: 200 })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${getOfferButtonStyle(type)}`}
            >
              {getOfferIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Connection Edit Modal */}
      {selectedConnection && (
        <ConnectionEditModal
          connection={selectedConnection}
          isOpen={showConnectionModal}
          onClose={() => setShowConnectionModal(false)}
          onSave={handleConnectionSave}
          onDelete={handleConnectionDelete}
          fromOfferName={offers.find(o => o.id === selectedConnection.fromOfferId)?.name || 'Unknown'}
          toOfferName={offers.find(o => o.id === selectedConnection.toOfferId)?.name || 'Unknown'}
        />
      )}

      {/* Offer Detail Sidebar */}
      <OfferDetailSidebar
        offer={sidebarOffer}
        isOpen={showOfferSidebar}
        onClose={closeSidebar}
        onUpdate={updateOfferFromSidebar}
      />
    </div>
  )
}

// Outer component that provides ReactFlow context
export default function ValueLadderCanvas(props: ValueLadderCanvasProps) {
  return (
    <ReactFlowProvider>
      <ValueLadderCanvasInner {...props} />
    </ReactFlowProvider>
  )
}

// Helper functions
function getNodeHeight(offer: OfferNode): number {
  let height = 180 // Base height
  if (offer.connections.length > 0) height += 30
  if (offer.analysis?.recommendations.length) height += 40
  return height
}

function getConnectionColor(conversionRate: number): string {
  if (conversionRate >= 40) return '#10b981' // Green
  if (conversionRate >= 25) return '#f59e0b' // Yellow
  return '#ef4444' // Red
}

function getDefaultConversionRate(offerType: OfferType): number {
  const rates = {
    attraction: 8,
    core: 20,
    upsell: 25,
    downsell: 35,
    continuity: 60
  }
  return rates[offerType]
}

function getDefaultPrice(offerType: OfferType): number {
  const prices = {
    attraction: 47,
    core: 497,
    upsell: 997,
    downsell: 197,
    continuity: 97
  }
  return prices[offerType]
}

function getNodeColor(node: Node): string {
  const colors = {
    attraction: '#3b82f6', // Blue
    core: '#8b5cf6',       // Purple
    upsell: '#10b981',     // Green
    downsell: '#f59e0b',   // Yellow
    continuity: '#ef4444', // Red
  }
  return colors[node.data?.offer?.type as OfferType] || '#6b7280'
}

function getOfferButtonStyle(type: OfferType): string {
  const styles = {
    attraction: 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-300',
    core: 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-300',
    upsell: 'bg-green-600/20 hover:bg-green-600/30 text-green-300',
    downsell: 'bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-300',
    continuity: 'bg-red-600/20 hover:bg-red-600/30 text-red-300',
  }
  return styles[type]
}

function getOfferIcon(type: OfferType): string {
  const icons = {
    attraction: '🎯',
    core: '💎',
    upsell: '📈',
    downsell: '🔄',
    continuity: '🔁',
  }
  return icons[type]
}