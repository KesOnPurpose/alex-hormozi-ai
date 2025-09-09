/**
 * ============================================================================
 * AGENT INTELLIGENCE SERVICE
 * ============================================================================
 * Production-ready service layer for the Alex Hormozi AI Agent Intelligence System
 * Handles all cross-agent intelligence, discovery tracking, and smart handoffs
 * ============================================================================
 */

import { supabase } from '@/lib/supabase/client'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type AgentType = 
  | 'master-conductor'
  | 'constraint-analyzer' 
  | 'money-model-architect'
  | 'offer-analyzer'
  | 'financial-calculator'
  | 'psychology-optimizer'
  | 'implementation-planner'
  | 'coaching-methodology'

export type BusinessConstraint = 'leads' | 'sales' | 'delivery' | 'profit' | 'unknown'
export type BusinessStage = 'complete_beginner' | 'have_business' | 'scaling_business' | 'experienced_operator'

export interface BusinessContext {
  industry?: string
  revenue?: number
  employees?: number
  timeInBusiness?: number
  majorChallenges?: string[]
  currentFocus?: string
}

export interface ConstraintAnalysis {
  constraint: BusinessConstraint
  confidence: number
  reasoning: string
  indicators: string[]
  recommendations: string[]
}

export interface Discovery {
  id: string
  agent: string
  insight: string
  impact: 'low' | 'medium' | 'high'
  actionable: boolean
  timestamp: string
}

export interface AgentInteraction {
  agent: AgentType
  timestamp: string
  duration: number
  insights_generated: number
  actions_taken: string[]
  next_recommendations: string[]
}

export interface SessionData {
  start_time: string
  last_activity: string
  pages_visited: string[]
  time_spent: number
  user_inputs: Record<string, unknown>
}

export interface SharedBusinessIntelligence {
  id: string
  user_id: string
  business_id?: string
  current_constraint?: BusinessConstraint
  constraint_confidence?: number
  business_stage?: BusinessStage
  sophistication_score: number
  business_context: BusinessContext
  constraint_analysis: ConstraintAnalysis
  discoveries: Discovery[]
  cross_agent_context: Record<string, unknown>
  agent_interactions: AgentInteraction[]
  last_agent_visited?: string
  agent_sequence: string[]
  recommended_next_agent?: string
  completion_percentage: number
  agents_consulted: string[]
  total_insights_generated: number
  total_implementations: number
  estimated_revenue_impact: number
  session_data: SessionData
  onboarding_completed: boolean
  analysis_completed: boolean
  created_at: string
  updated_at: string
}

export interface AgentDiscovery {
  id: string
  user_id: string
  business_id?: string
  intelligence_id: string
  agent_type: AgentType
  discovery_type: string
  discovery_category?: string
  title: string
  description?: string
  discovery_data: Record<string, unknown>
  confidence_score?: number
  validation_status: 'pending' | 'validated' | 'implemented' | 'rejected'
  validation_data: Record<string, unknown>
  expected_impact?: string
  expected_revenue_impact?: number
  expected_timeframe?: string
  actual_impact?: Record<string, unknown>
  actual_revenue_impact?: number
  related_discoveries: string[]
  prerequisite_discoveries: string[]
  implementation_status: 'pending' | 'in_progress' | 'completed' | 'skipped' | 'failed'
  implementation_data: Record<string, unknown>
  implementation_notes?: string
  created_at: string
  updated_at: string
}

export interface CrossAgentInsight {
  id: string
  user_id: string
  business_id?: string
  intelligence_id: string
  insight_type: 'synergy' | 'conflict' | 'opportunity' | 'warning' | 'recommendation' | 'pattern' | 'optimization' | 'validation'
  priority_level: 'critical' | 'high' | 'medium' | 'low'
  urgency_level: 'immediate' | 'urgent' | 'normal' | 'low'
  contributing_agents: string[]
  source_discoveries: string[]
  data_sources: string[]
  title: string
  description: string
  insight_data: Record<string, any>
  suggested_actions: string[]
  next_agent_recommendation?: string
  implementation_priority: number
  projected_impact?: string
  projected_revenue_impact?: number
  projected_timeframe?: string
  confidence_score?: number
  user_acknowledged: boolean
  user_feedback?: string
  user_rating?: number
  action_taken: boolean
  action_data: Record<string, any>
  created_at: string
  updated_at: string
}

export interface AgentHandoff {
  id: string
  user_id: string
  intelligence_id: string
  from_agent?: string
  to_agent: string
  handoff_reason: string
  handoff_type: 'recommendation' | 'user_choice' | 'system_routing' | 'completion'
  context_summary?: string
  key_discoveries: string[]
  key_decisions: string[]
  open_questions: string[]
  suggested_focus?: string
  priority_items: string[]
  handoff_data: Record<string, any>
  previous_session_summary?: string
  continuation_prompt?: string
  context_completeness?: number
  handoff_success?: boolean
  user_satisfaction?: number
  created_at: string
}

export interface AgentRecommendation {
  agent: AgentType
  reason: string
  urgency: 'high' | 'medium' | 'low'
  confidence: number
}

export interface BusinessContext {
  currentConstraint?: BusinessConstraint
  businessStage?: BusinessStage
  businessModel?: string
  monthlyRevenue?: number
  teamSize?: number
  industry?: string
  primaryChallenge?: string
  [key: string]: unknown
}

export interface DiscoveryInput {
  agentType: AgentType
  discoveryType: string
  discoveryCategory?: string
  title: string
  description?: string
  discoveryData: Record<string, any>
  confidenceScore?: number
  expectedImpact?: string
  revenueImpact?: number
  expectedTimeframe?: string
}

// ============================================================================
// AGENT INTELLIGENCE SERVICE CLASS
// ============================================================================

export class AgentIntelligenceService {
  
  /**
   * Initialize or retrieve existing business intelligence record
   */
  static async getOrCreateIntelligence(
    userId: string, 
    businessId?: string
  ): Promise<SharedBusinessIntelligence | null> {
    try {
      // First try to get existing intelligence
      const { data: existing, error: fetchError } = await supabase
        .from('shared_business_intelligence')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()

      if (existing && !fetchError) {
        return existing
      }

      // Create new intelligence record
      const { data: newIntelligence, error: createError } = await supabase
        .from('shared_business_intelligence')
        .insert({
          user_id: userId,
          business_id: businessId,
          sophistication_score: 1,
          business_context: {},
          constraint_analysis: {},
          discoveries: {},
          cross_agent_context: {},
          agent_interactions: [],
          agent_sequence: [],
          completion_percentage: 0,
          agents_consulted: [],
          total_insights_generated: 0,
          total_implementations: 0,
          estimated_revenue_impact: 0,
          session_data: {},
          onboarding_completed: false,
          analysis_completed: false
        })
        .select()
        .single()

      if (createError) {
        console.error('Error creating intelligence record:', createError)
        return null
      }

      return newIntelligence
    } catch (error) {
      console.error('Error in getOrCreateIntelligence:', error)
      return null
    }
  }

  /**
   * Update business context and constraint analysis
   */
  static async updateBusinessContext(
    intelligenceId: string,
    context: BusinessContext
  ): Promise<boolean> {
    try {
      const updateData: Partial<SharedBusinessIntelligence> = {
        business_context: context,
        updated_at: new Date().toISOString()
      }

      // Update specific fields if provided
      if (context.currentConstraint) {
        updateData.current_constraint = context.currentConstraint
      }
      if (context.businessStage) {
        updateData.business_stage = context.businessStage
      }

      const { error } = await supabase
        .from('shared_business_intelligence')
        .update(updateData)
        .eq('id', intelligenceId)

      if (error) {
        console.error('Error updating business context:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in updateBusinessContext:', error)
      return false
    }
  }

  /**
   * Record agent visit and update sequence
   */
  static async recordAgentVisit(
    intelligenceId: string,
    agentType: AgentType
  ): Promise<boolean> {
    try {
      // Get current intelligence to update arrays
      const { data: intelligence, error: fetchError } = await supabase
        .from('shared_business_intelligence')
        .select('agents_consulted, agent_sequence')
        .eq('id', intelligenceId)
        .single()

      if (fetchError) {
        console.error('Error fetching intelligence for agent visit:', fetchError)
        return false
      }

      const agentsConsulted = intelligence.agents_consulted || []
      const agentSequence = intelligence.agent_sequence || []

      // Add to consulted agents if not already there
      const updatedConsulted = agentsConsulted.includes(agentType) 
        ? agentsConsulted 
        : [...agentsConsulted, agentType]

      // Add to sequence (allows duplicates)
      const updatedSequence = [...agentSequence, agentType]

      const { error } = await supabase
        .from('shared_business_intelligence')
        .update({
          last_agent_visited: agentType,
          agents_consulted: updatedConsulted,
          agent_sequence: updatedSequence,
          updated_at: new Date().toISOString()
        })
        .eq('id', intelligenceId)

      if (error) {
        console.error('Error recording agent visit:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in recordAgentVisit:', error)
      return false
    }
  }

  /**
   * Add discovery from agent interaction
   */
  static async addDiscovery(
    userId: string,
    intelligenceId: string,
    discovery: DiscoveryInput,
    businessId?: string
  ): Promise<AgentDiscovery | null> {
    try {
      const { data: newDiscovery, error } = await supabase
        .from('agent_discoveries')
        .insert({
          user_id: userId,
          business_id: businessId,
          intelligence_id: intelligenceId,
          agent_type: discovery.agentType,
          discovery_type: discovery.discoveryType,
          discovery_category: discovery.discoveryCategory,
          title: discovery.title,
          description: discovery.description,
          discovery_data: discovery.discoveryData,
          confidence_score: discovery.confidenceScore,
          expected_impact: discovery.expectedImpact,
          expected_revenue_impact: discovery.revenueImpact,
          expected_timeframe: discovery.expectedTimeframe,
          related_discoveries: [],
          prerequisite_discoveries: [],
          implementation_status: 'pending',
          implementation_data: {},
          validation_status: 'pending',
          validation_data: {}
        })
        .select()
        .single()

      if (error) {
        console.error('Error adding discovery:', error)
        return null
      }

      return newDiscovery
    } catch (error) {
      console.error('Error in addDiscovery:', error)
      return null
    }
  }

  /**
   * Get discoveries for specific agent
   */
  static async getAgentDiscoveries(
    intelligenceId: string,
    agentType?: AgentType
  ): Promise<AgentDiscovery[]> {
    try {
      let query = supabase
        .from('agent_discoveries')
        .select('*')
        .eq('intelligence_id', intelligenceId)
        .order('created_at', { ascending: false })

      if (agentType) {
        query = query.eq('agent_type', agentType)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching agent discoveries:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in getAgentDiscoveries:', error)
      return []
    }
  }

  /**
   * Get all discoveries organized by agent type
   */
  static async getAllDiscoveries(
    intelligenceId: string
  ): Promise<Record<string, AgentDiscovery[]>> {
    try {
      const { data, error } = await supabase
        .from('agent_discoveries')
        .select('*')
        .eq('intelligence_id', intelligenceId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching all discoveries:', error)
        return {}
      }

      // Group by agent type
      const grouped = (data || []).reduce((acc, discovery) => {
        const agentType = discovery.agent_type
        if (!acc[agentType]) {
          acc[agentType] = []
        }
        acc[agentType].push(discovery)
        return acc
      }, {} as Record<string, AgentDiscovery[]>)

      return grouped
    } catch (error) {
      console.error('Error in getAllDiscoveries:', error)
      return {}
    }
  }

  /**
   * Generate cross-agent insights using database function
   */
  static async generateCrossAgentInsights(intelligenceId: string): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('generate_cross_agent_insights', {
        p_intelligence_id: intelligenceId
      })

      if (error) {
        console.error('Error generating cross-agent insights:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in generateCrossAgentInsights:', error)
      return false
    }
  }

  /**
   * Get cross-agent insights for user
   */
  static async getCrossAgentInsights(
    intelligenceId: string,
    priorityLevel?: string
  ): Promise<CrossAgentInsight[]> {
    try {
      let query = supabase
        .from('cross_agent_insights')
        .select('*')
        .eq('intelligence_id', intelligenceId)
        .order('created_at', { ascending: false })

      if (priorityLevel) {
        query = query.eq('priority_level', priorityLevel)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching cross-agent insights:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in getCrossAgentInsights:', error)
      return []
    }
  }

  /**
   * Get next agent recommendation using database function
   */
  static async getNextAgentRecommendation(
    intelligenceId: string
  ): Promise<AgentRecommendation | null> {
    try {
      const { data, error } = await supabase.rpc('get_next_agent_recommendation', {
        p_intelligence_id: intelligenceId
      })

      if (error) {
        console.error('Error getting agent recommendation:', error)
        return null
      }

      return data as AgentRecommendation
    } catch (error) {
      console.error('Error in getNextAgentRecommendation:', error)
      return null
    }
  }

  /**
   * Create agent handoff record
   */
  static async createHandoff(
    userId: string,
    intelligenceId: string,
    fromAgent: AgentType | null,
    toAgent: AgentType,
    handoffData: {
      reason: string
      contextSummary?: string
      keyDecisions?: string[]
      openQuestions?: string[]
      suggestedFocus?: string
      priorityItems?: string[]
    }
  ): Promise<AgentHandoff | null> {
    try {
      const { data: handoff, error } = await supabase
        .from('agent_handoffs')
        .insert({
          user_id: userId,
          intelligence_id: intelligenceId,
          from_agent: fromAgent,
          to_agent: toAgent,
          handoff_reason: handoffData.reason,
          handoff_type: fromAgent ? 'recommendation' : 'system_routing',
          context_summary: handoffData.contextSummary,
          key_discoveries: [], // Can be populated later
          key_decisions: handoffData.keyDecisions || [],
          open_questions: handoffData.openQuestions || [],
          suggested_focus: handoffData.suggestedFocus,
          priority_items: handoffData.priorityItems || [],
          handoff_data: handoffData
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating handoff:', error)
        return null
      }

      return handoff
    } catch (error) {
      console.error('Error in createHandoff:', error)
      return null
    }
  }

  /**
   * Get completion percentage using database function
   */
  static async getCompletionPercentage(
    userId: string,
    intelligenceId: string
  ): Promise<number> {
    try {
      const { data, error } = await supabase.rpc('calculate_completion_percentage', {
        p_user_id: userId,
        p_intelligence_id: intelligenceId
      })

      if (error) {
        console.error('Error calculating completion percentage:', error)
        return 0
      }

      return data || 0
    } catch (error) {
      console.error('Error in getCompletionPercentage:', error)
      return 0
    }
  }

  /**
   * Get comprehensive intelligence summary
   */
  static async getIntelligenceSummary(intelligenceId: string): Promise<{
    intelligence: SharedBusinessIntelligence | null
    discoveries: Record<string, AgentDiscovery[]>
    recentInsights: CrossAgentInsight[]
    completionPercentage: number
  }> {
    try {
      // Get intelligence record
      const { data: intelligence, error: intError } = await supabase
        .from('shared_business_intelligence')
        .select('*')
        .eq('id', intelligenceId)
        .single()

      if (intError) {
        console.error('Error fetching intelligence:', intError)
        return {
          intelligence: null,
          discoveries: {},
          recentInsights: [],
          completionPercentage: 0
        }
      }

      // Get all discoveries
      const discoveries = await this.getAllDiscoveries(intelligenceId)

      // Get recent insights
      const recentInsights = await this.getCrossAgentInsights(intelligenceId)

      // Get completion percentage
      const completionPercentage = await this.getCompletionPercentage(
        intelligence.user_id,
        intelligenceId
      )

      return {
        intelligence,
        discoveries,
        recentInsights: recentInsights.slice(0, 5), // Last 5 insights
        completionPercentage
      }
    } catch (error) {
      console.error('Error in getIntelligenceSummary:', error)
      return {
        intelligence: null,
        discoveries: {},
        recentInsights: [],
        completionPercentage: 0
      }
    }
  }

  /**
   * Save conversation message
   */
  static async saveConversationMessage(
    userId: string,
    intelligenceId: string,
    agentType: AgentType,
    messageType: 'user' | 'agent' | 'system',
    content: string,
    metadata: Record<string, any> = {},
    conversationTurn: number,
    parentMessageId?: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('conversation_history')
        .insert({
          user_id: userId,
          intelligence_id: intelligenceId,
          agent_type: agentType,
          message_type: messageType,
          message_content: content,
          message_metadata: metadata,
          conversation_turn: conversationTurn,
          parent_message_id: parentMessageId,
          context_snapshot: {}, // Can be populated with current context
          agent_state: {}
        })

      if (error) {
        console.error('Error saving conversation message:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in saveConversationMessage:', error)
      return false
    }
  }

  /**
   * Get conversation history for an agent
   */
  static async getConversationHistory(
    intelligenceId: string,
    agentType: AgentType,
    limit: number = 50
  ): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('conversation_history')
        .select('*')
        .eq('intelligence_id', intelligenceId)
        .eq('agent_type', agentType)
        .order('created_at', { ascending: true })
        .limit(limit)

      if (error) {
        console.error('Error fetching conversation history:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in getConversationHistory:', error)
      return []
    }
  }

  /**
   * Record agent performance metrics
   */
  static async recordAgentPerformance(
    agentType: AgentType,
    userId: string,
    intelligenceId: string,
    performanceData: {
      sessionDuration?: number
      messagesExchanged?: number
      discoveriesGenerated?: number
      insightsProvided?: number
      userSatisfaction?: number
      discoveryAccuracy?: number
      recommendationQuality?: number
      contextRelevance?: number
    }
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('agent_performance')
        .insert({
          agent_type: agentType,
          user_id: userId,
          intelligence_id: intelligenceId,
          session_duration: performanceData.sessionDuration,
          messages_exchanged: performanceData.messagesExchanged || 0,
          discoveries_generated: performanceData.discoveriesGenerated || 0,
          insights_provided: performanceData.insightsProvided || 0,
          user_satisfaction: performanceData.userSatisfaction,
          discovery_accuracy: performanceData.discoveryAccuracy,
          recommendation_quality: performanceData.recommendationQuality,
          context_relevance: performanceData.contextRelevance,
          performance_data: performanceData
        })

      if (error) {
        console.error('Error recording agent performance:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in recordAgentPerformance:', error)
      return false
    }
  }
}