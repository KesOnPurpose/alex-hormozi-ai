// Unified Money Model Types for Visual + Text Dual-Mode System

export type OfferType = 'attraction' | 'core' | 'upsell' | 'downsell' | 'continuity'
export type OfferStatus = 'planned' | 'active' | 'paused' | 'archived'
export type ViewMode = 'visual' | 'text' | 'split'

export interface Position {
  x: number
  y: number
}

export interface OfferMetrics {
  // Revenue Data
  currentMonthlyRevenue: number
  projectedMonthlyRevenue: number
  averageOrderValue: number
  
  // Conversion Data
  conversionRate: number
  trafficVolume: number
  customersPerMonth: number
  
  // Performance Data
  costToDeliver: number
  profitMargin: number
  customerAcquisitionCost: number
  lifetimeValue: number
  
  // Time & Effort
  deliveryTimeframe: string // e.g., "immediate", "7 days", "30 days"
  customerEffortRequired: number // 1-10 scale
  
  // Validation Data
  marketDemand: number // 1-10 scale
  competitiveAdvantage: number // 1-10 scale
  implementationComplexity: number // 1-10 scale
}

export interface Connection {
  id: string
  fromOfferId: string
  toOfferId: string
  conversionRate: number
  averageTimeBetween: string // e.g., "immediate", "1 week", "1 month"
  trigger: string // e.g., "purchase", "result achieved", "time elapsed"
}

export interface OfferNode {
  id: string
  name: string
  description: string
  price: number
  type: OfferType
  status: OfferStatus
  
  // Visual Properties
  position: Position
  size: { width: number; height: number }
  color?: string
  
  // Detailed Metrics (for text mode)
  metrics: OfferMetrics
  
  // Flow Connections
  connections: Connection[]
  
  // AI Analysis Results
  analysis?: {
    valueScore: number // 1-100
    structuralScore: number // 1-100
    revenueImpact: number
    recommendations: string[]
    warnings: string[]
    opportunities: string[]
  }
  
  // Metadata
  createdAt: string
  updatedAt: string
  tags: string[]
}

export interface MoneyModel {
  id: string
  userId: string
  name: string
  description?: string
  
  // Core Structure
  offers: OfferNode[]
  
  // Global Settings
  targetMarket: string
  businessStage: string
  monthlyTraffic: number
  
  // Calculated Metrics
  totalCurrentRevenue: number
  totalProjectedRevenue: number
  averageCustomerLTV: number
  overallConversionRate: number
  
  // AI Analysis
  overallScore: number
  structureType: string // e.g., "Value Ladder", "Ascension Model", "Product Suite"
  aiInsights: {
    strengths: string[]
    weaknesses: string[]
    quickWins: string[]
    strategicMoves: string[]
  }
  
  // Version Control
  version: number
  lastOptimized: string
  
  // Metadata
  createdAt: string
  updatedAt: string
  isTemplate: boolean
  templateCategory?: string
}

// AI Analysis Types
export interface StructuralInsights {
  patternRecognized: string
  structureScore: number
  gapsIdentified: Array<{
    type: 'missing_bridge' | 'price_gap' | 'flow_break' | 'positioning_issue'
    severity: 'low' | 'medium' | 'high' | 'critical'
    description: string
    suggestedFix: string
    estimatedImpact: number
  }>
  flowAnalysis: Array<{
    path: string[]
    conversionRate: number
    revenueContribution: number
    bottlenecks: string[]
  }>
}

export interface MetricInsights {
  revenueOptimization: Array<{
    offerId: string
    currentPerformance: number
    potentialPerformance: number
    improvementStrategy: string
    confidenceLevel: number
  }>
  pricingAnalysis: Array<{
    offerId: string
    currentPrice: number
    suggestedPrice: number
    priceElasticity: number
    reasoning: string
  }>
  conversionOptimization: Array<{
    connectionId: string
    currentRate: number
    benchmarkRate: number
    optimizationTactics: string[]
  }>
}

export interface MasterInsights {
  priorityActions: Array<{
    id: string
    title: string
    description: string
    type: 'structural' | 'pricing' | 'positioning' | 'flow'
    impact: 'low' | 'medium' | 'high' | 'game_changer'
    effort: 'quick_win' | 'moderate' | 'major_project'
    expectedReturn: number
    timeToImplement: string
  }>
  
  scenarioModeling: Array<{
    name: string
    changes: string[]
    projectedRevenue: number
    implementationCost: number
    roi: number
    riskLevel: number
  }>
  
  benchmarkComparison: {
    industryAverage: number
    topPerformers: number
    yourPosition: number
    gapAnalysis: string[]
  }
}

// UI State Types
export interface MoneyModelViewState {
  viewMode: ViewMode
  selectedOfferId?: string
  selectedConnectionId?: string
  showAIInsights: boolean
  showMetrics: boolean
  zoomLevel: number
  panOffset: Position
  
  // Text Mode State
  activeTab: string
  expandedSections: string[]
  
  // Visual Mode State
  isDragging: boolean
  isConnecting: boolean
  connectionStart?: string
}

// Alex's Money Model Framework Types
export interface MoneyModelFramework {
  type: 'win-back-guarantee' | 'attraction-offer' | 'core-offer' | 'upsell-stack' | 'continuity-program' | 'downsell-recovery'
  name: string
  description: string
  keyPrinciples: string[]
  commonMistakes: string[]
  successMetrics: string[]
}

export interface OfferEducation {
  // Alex's Framework Mapping
  framework: MoneyModelFramework
  
  // Real-World Details
  realImplementation: {
    whatItActuallyIs: string
    whyItWorks: string[]
    keyNumbers: Array<{
      metric: string
      value: string | number
      context: string
    }>
    psychologyBehind: string
    commonVariations: string[]
  }
  
  // Learning Content
  masterclassNotes: {
    alexQuote?: string
    coreLesson: string
    implementationTips: string[]
    warningsSigns: string[]
  }
  
  // Connection Strategy
  flowStrategy?: {
    fromPrevious: string
    toNext: string
    conversionTactics: string[]
    timingNotes: string
  }
}

// Templates and Presets
export interface MoneyModelTemplate {
  id: string
  name: string
  description: string
  category: string
  industryTags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  
  // Template Structure
  offerNodes: Omit<OfferNode, 'id' | 'createdAt' | 'updatedAt'>[]
  connections: Omit<Connection, 'id' | 'fromOfferId' | 'toOfferId'>[]
  
  // Educational Content
  offerEducation: OfferEducation[]
  
  // Success Story
  successStory: {
    businessName: string
    timeframe: string
    results: Array<{
      metric: string
      before: string | number
      after: string | number
    }>
    keyInsight: string
  }
  
  // Success Metrics
  averageRevenueIncrease: number
  implementationTime: string
  successRate: number
  
  // Preview
  thumbnailUrl?: string
  previewMetrics: {
    totalOffers: number
    avgPrice: number
    projectedRevenue: number
  }
}

// API Response Types
export interface MoneyModelResponse {
  success: boolean
  data?: MoneyModel
  error?: string
}

export interface AIAnalysisResponse {
  success: boolean
  data?: {
    structural: StructuralInsights
    metrics: MetricInsights
    master: MasterInsights
  }
  error?: string
  processingTime?: number
}

// Event Types for Real-time Updates
export type MoneyModelEvent = 
  | { type: 'offer_updated'; offerId: string; changes: Partial<OfferNode> }
  | { type: 'offer_moved'; offerId: string; newPosition: Position }
  | { type: 'connection_added'; connection: Connection }
  | { type: 'connection_removed'; connectionId: string }
  | { type: 'ai_analysis_complete'; insights: MasterInsights }
  | { type: 'view_mode_changed'; newMode: ViewMode }

// Validation Schemas
export interface ValidationResult {
  isValid: boolean
  errors: Array<{
    field: string
    message: string
    severity: 'error' | 'warning'
  }>
  score: number
}