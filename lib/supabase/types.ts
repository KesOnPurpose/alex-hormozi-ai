export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          business_level: 'beginner' | 'growth' | 'scale' | 'enterprise'
          detected_sophistication: Json
          onboarding_completed: boolean
          preferences: Json
          timezone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          business_level?: 'beginner' | 'growth' | 'scale' | 'enterprise'
          detected_sophistication?: Json
          onboarding_completed?: boolean
          preferences?: Json
          timezone?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          business_level?: 'beginner' | 'growth' | 'scale' | 'enterprise'
          detected_sophistication?: Json
          onboarding_completed?: boolean
          preferences?: Json
          timezone?: string
          created_at?: string
          updated_at?: string
        }
      }
      business_profiles: {
        Row: {
          id: string
          user_id: string
          business_name: string
          industry: string | null
          business_type: string | null
          stage: 'startup' | 'growth' | 'scale' | 'mature' | null
          description: string | null
          monthly_revenue: number
          customer_count: number
          new_customers_monthly: number
          churn_rate: number
          cac: number
          ltv: number
          ltv_cac_ratio: number
          gross_margin: number
          net_margin: number
          primary_constraint: 'leads' | 'sales' | 'delivery' | 'profit' | 'unknown'
          constraint_confidence: number
          constraint_history: Json
          constraint_last_updated: string
          revenue_goal: number | null
          target_date: string | null
          goals: Json
          ai_context: Json
          metrics_snapshot: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          industry?: string | null
          business_type?: string | null
          stage?: 'startup' | 'growth' | 'scale' | 'mature' | null
          description?: string | null
          monthly_revenue?: number
          customer_count?: number
          new_customers_monthly?: number
          churn_rate?: number
          cac?: number
          ltv?: number
          ltv_cac_ratio?: number
          gross_margin?: number
          net_margin?: number
          primary_constraint?: 'leads' | 'sales' | 'delivery' | 'profit' | 'unknown'
          constraint_confidence?: number
          constraint_history?: Json
          constraint_last_updated?: string
          revenue_goal?: number | null
          target_date?: string | null
          goals?: Json
          ai_context?: Json
          metrics_snapshot?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string
          industry?: string | null
          business_type?: string | null
          stage?: 'startup' | 'growth' | 'scale' | 'mature' | null
          description?: string | null
          monthly_revenue?: number
          customer_count?: number
          new_customers_monthly?: number
          churn_rate?: number
          cac?: number
          ltv?: number
          ltv_cac_ratio?: number
          gross_margin?: number
          net_margin?: number
          primary_constraint?: 'leads' | 'sales' | 'delivery' | 'profit' | 'unknown'
          constraint_confidence?: number
          constraint_history?: Json
          constraint_last_updated?: string
          revenue_goal?: number | null
          target_date?: string | null
          goals?: Json
          ai_context?: Json
          metrics_snapshot?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          business_id: string | null
          session_title: string | null
          session_type: string
          workspace: string
          messages: Json
          message_count: number
          conversation_context: Json
          agent_memory: Json
          learned_preferences: Json
          insights_generated: Json
          action_items: Json
          recommendations: Json
          frameworks_applied: string[]
          is_archived: boolean
          last_message_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_id?: string | null
          session_title?: string | null
          session_type?: string
          workspace?: string
          messages?: Json
          message_count?: number
          conversation_context?: Json
          agent_memory?: Json
          learned_preferences?: Json
          insights_generated?: Json
          action_items?: Json
          recommendations?: Json
          frameworks_applied?: string[]
          is_archived?: boolean
          last_message_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_id?: string | null
          session_title?: string | null
          session_type?: string
          workspace?: string
          messages?: Json
          message_count?: number
          conversation_context?: Json
          agent_memory?: Json
          learned_preferences?: Json
          insights_generated?: Json
          action_items?: Json
          recommendations?: Json
          frameworks_applied?: string[]
          is_archived?: boolean
          last_message_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      business_metrics_history: {
        Row: {
          id: string
          business_id: string
          metric_date: string
          monthly_revenue: number | null
          customer_count: number | null
          new_customers: number | null
          churned_customers: number | null
          churn_rate: number | null
          cac: number | null
          ltv: number | null
          ltv_cac_ratio: number | null
          gross_margin: number | null
          net_margin: number | null
          monthly_profit: number | null
          leads_generated: number | null
          qualified_leads: number | null
          conversion_rate: number | null
          close_rate: number | null
          average_deal_size: number | null
          delivery_capacity: number | null
          customer_satisfaction: number | null
          thirty_day_cash: number | null
          cfa_achieved: boolean
          payback_period_days: number | null
          custom_metrics: Json
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          business_id: string
          metric_date: string
          monthly_revenue?: number | null
          customer_count?: number | null
          new_customers?: number | null
          churned_customers?: number | null
          churn_rate?: number | null
          cac?: number | null
          ltv?: number | null
          ltv_cac_ratio?: number | null
          gross_margin?: number | null
          net_margin?: number | null
          monthly_profit?: number | null
          leads_generated?: number | null
          qualified_leads?: number | null
          conversion_rate?: number | null
          close_rate?: number | null
          average_deal_size?: number | null
          delivery_capacity?: number | null
          customer_satisfaction?: number | null
          thirty_day_cash?: number | null
          cfa_achieved?: boolean
          payback_period_days?: number | null
          custom_metrics?: Json
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          metric_date?: string
          monthly_revenue?: number | null
          customer_count?: number | null
          new_customers?: number | null
          churned_customers?: number | null
          churn_rate?: number | null
          cac?: number | null
          ltv?: number | null
          ltv_cac_ratio?: number | null
          gross_margin?: number | null
          net_margin?: number | null
          monthly_profit?: number | null
          leads_generated?: number | null
          qualified_leads?: number | null
          conversion_rate?: number | null
          close_rate?: number | null
          average_deal_size?: number | null
          delivery_capacity?: number | null
          customer_satisfaction?: number | null
          thirty_day_cash?: number | null
          cfa_achieved?: boolean
          payback_period_days?: number | null
          custom_metrics?: Json
          notes?: string | null
          created_at?: string
        }
      }
      strategy_implementations: {
        Row: {
          id: string
          business_id: string
          conversation_id: string | null
          strategy_type: string
          strategy_name: string
          alex_framework: string | null
          description: string | null
          recommended_date: string | null
          planned_date: string | null
          implementation_date: string | null
          completion_date: string | null
          status: 'planned' | 'in_progress' | 'completed' | 'measuring' | 'cancelled'
          expected_impact: Json
          actual_impact: Json
          metrics_before: Json
          metrics_after: Json
          investment_cost: number
          roi_percentage: number | null
          payback_days: number | null
          implementation_notes: string | null
          blockers: string | null
          lessons_learned: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          conversation_id?: string | null
          strategy_type: string
          strategy_name: string
          alex_framework?: string | null
          description?: string | null
          recommended_date?: string | null
          planned_date?: string | null
          implementation_date?: string | null
          completion_date?: string | null
          status?: 'planned' | 'in_progress' | 'completed' | 'measuring' | 'cancelled'
          expected_impact?: Json
          actual_impact?: Json
          metrics_before?: Json
          metrics_after?: Json
          investment_cost?: number
          roi_percentage?: number | null
          payback_days?: number | null
          implementation_notes?: string | null
          blockers?: string | null
          lessons_learned?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          conversation_id?: string | null
          strategy_type?: string
          strategy_name?: string
          alex_framework?: string | null
          description?: string | null
          recommended_date?: string | null
          planned_date?: string | null
          implementation_date?: string | null
          completion_date?: string | null
          status?: 'planned' | 'in_progress' | 'completed' | 'measuring' | 'cancelled'
          expected_impact?: Json
          actual_impact?: Json
          metrics_before?: Json
          metrics_after?: Json
          investment_cost?: number
          roi_percentage?: number | null
          payback_days?: number | null
          implementation_notes?: string | null
          blockers?: string | null
          lessons_learned?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      business_milestones: {
        Row: {
          id: string
          business_id: string
          milestone_type: string
          milestone_name: string
          milestone_description: string | null
          achieved_date: string
          metric_name: string | null
          metric_value: number | null
          metric_unit: string | null
          previous_value: number | null
          alex_contribution: string | null
          strategies_involved: string[]
          time_to_achieve_days: number | null
          celebration_message: string | null
          badge_earned: string | null
          points_awarded: number
          is_major_milestone: boolean
          is_shareable: boolean
          shared_publicly: boolean
          created_at: string
        }
        Insert: {
          id?: string
          business_id: string
          milestone_type: string
          milestone_name: string
          milestone_description?: string | null
          achieved_date: string
          metric_name?: string | null
          metric_value?: number | null
          metric_unit?: string | null
          previous_value?: number | null
          alex_contribution?: string | null
          strategies_involved?: string[]
          time_to_achieve_days?: number | null
          celebration_message?: string | null
          badge_earned?: string | null
          points_awarded?: number
          is_major_milestone?: boolean
          is_shareable?: boolean
          shared_publicly?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          milestone_type?: string
          milestone_name?: string
          milestone_description?: string | null
          achieved_date?: string
          metric_name?: string | null
          metric_value?: number | null
          metric_unit?: string | null
          previous_value?: number | null
          alex_contribution?: string | null
          strategies_involved?: string[]
          time_to_achieve_days?: number | null
          celebration_message?: string | null
          badge_earned?: string | null
          points_awarded?: number
          is_major_milestone?: boolean
          is_shareable?: boolean
          shared_publicly?: boolean
          created_at?: string
        }
      }
      learning_progress: {
        Row: {
          id: string
          user_id: string
          concept: string
          concept_category: string | null
          understanding_level: number
          interactions_count: number
          first_interaction: string
          last_interaction: string
          learning_method: string | null
          questions_asked: number
          examples_viewed: number
          can_explain: boolean
          can_calculate: boolean
          can_implement: boolean
          mastery_achieved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          concept: string
          concept_category?: string | null
          understanding_level?: number
          interactions_count?: number
          first_interaction?: string
          last_interaction?: string
          learning_method?: string | null
          questions_asked?: number
          examples_viewed?: number
          can_explain?: boolean
          can_calculate?: boolean
          can_implement?: boolean
          mastery_achieved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          concept?: string
          concept_category?: string | null
          understanding_level?: number
          interactions_count?: number
          first_interaction?: string
          last_interaction?: string
          learning_method?: string | null
          questions_asked?: number
          examples_viewed?: number
          can_explain?: boolean
          can_calculate?: boolean
          can_implement?: boolean
          mastery_achieved?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      shared_business_intelligence: {
        Row: {
          id: string
          user_id: string
          business_id: string | null
          current_constraint: string | null
          business_stage: string | null
          discoveries: Json
          context: Json
          agent_interactions: Json
          last_agent_visited: string | null
          agent_sequence: string[]
          completion_percentage: number
          agents_consulted: string[]
          total_insights_generated: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_id?: string | null
          current_constraint?: string | null
          business_stage?: string | null
          discoveries?: Json
          context?: Json
          agent_interactions?: Json
          last_agent_visited?: string | null
          agent_sequence?: string[]
          completion_percentage?: number
          agents_consulted?: string[]
          total_insights_generated?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_id?: string | null
          current_constraint?: string | null
          business_stage?: string | null
          discoveries?: Json
          context?: Json
          agent_interactions?: Json
          last_agent_visited?: string | null
          agent_sequence?: string[]
          completion_percentage?: number
          agents_consulted?: string[]
          total_insights_generated?: number
          created_at?: string
          updated_at?: string
        }
      }
      agent_discoveries: {
        Row: {
          id: string
          user_id: string
          business_id: string | null
          intelligence_id: string
          agent_type: string
          discovery_type: string
          discovery_category: string | null
          title: string
          description: string | null
          discovery_data: Json
          related_discoveries: string[] | null
          confidence_score: number | null
          implementation_status: string
          expected_impact: string | null
          actual_impact: Json | null
          revenue_impact: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_id?: string | null
          intelligence_id: string
          agent_type: string
          discovery_type: string
          discovery_category?: string | null
          title: string
          description?: string | null
          discovery_data?: Json
          related_discoveries?: string[] | null
          confidence_score?: number | null
          implementation_status?: string
          expected_impact?: string | null
          actual_impact?: Json | null
          revenue_impact?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_id?: string | null
          intelligence_id?: string
          agent_type?: string
          discovery_type?: string
          discovery_category?: string | null
          title?: string
          description?: string | null
          discovery_data?: Json
          related_discoveries?: string[] | null
          confidence_score?: number | null
          implementation_status?: string
          expected_impact?: string | null
          actual_impact?: Json | null
          revenue_impact?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      cross_agent_insights: {
        Row: {
          id: string
          user_id: string
          business_id: string | null
          intelligence_id: string
          insight_type: string
          priority_level: string
          contributing_agents: string[]
          source_discoveries: string[] | null
          title: string
          description: string
          insight_data: Json
          suggested_actions: string[] | null
          next_agent_recommendation: string | null
          user_acknowledged: boolean
          action_taken: boolean
          user_feedback: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_id?: string | null
          intelligence_id: string
          insight_type: string
          priority_level?: string
          contributing_agents: string[]
          source_discoveries?: string[] | null
          title: string
          description: string
          insight_data?: Json
          suggested_actions?: string[] | null
          next_agent_recommendation?: string | null
          user_acknowledged?: boolean
          action_taken?: boolean
          user_feedback?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_id?: string | null
          intelligence_id?: string
          insight_type?: string
          priority_level?: string
          contributing_agents?: string[]
          source_discoveries?: string[] | null
          title?: string
          description?: string
          insight_data?: Json
          suggested_actions?: string[] | null
          next_agent_recommendation?: string | null
          user_acknowledged?: boolean
          action_taken?: boolean
          user_feedback?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      business_dashboard: {
        Row: {
          business_id: string
          business_name: string
          user_id: string
          monthly_revenue: number
          customer_count: number
          primary_constraint: 'leads' | 'sales' | 'delivery' | 'profit' | 'unknown'
          constraint_confidence: number
          last_updated: string | null
          cac: number | null
          ltv: number | null
          ltv_cac_ratio: number | null
          thirty_day_cash: number | null
          cfa_achieved: boolean | null
          revenue_growth_percentage: number | null
          constraints_resolved: number | null
          active_strategies: number | null
          completed_strategies: number | null
          milestones_this_month: number | null
        }
      }
    }
    Functions: {
      detect_business_level: {
        Args: { revenue: number }
        Returns: string
      }
      calculate_constraint_priority: {
        Args: {
          leads_per_month: number
          conversion_rate: number
          churn_rate: number
          profit_margin: number
        }
        Returns: Json
      }
    }
  }
}

// Helper types for common operations
export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type BusinessProfile = Database['public']['Tables']['business_profiles']['Row']
export type Conversation = Database['public']['Tables']['conversations']['Row']
export type BusinessMetric = Database['public']['Tables']['business_metrics_history']['Row']
export type StrategyImplementation = Database['public']['Tables']['strategy_implementations']['Row']
export type BusinessMilestone = Database['public']['Tables']['business_milestones']['Row']
export type LearningProgress = Database['public']['Tables']['learning_progress']['Row']
export type BusinessDashboard = Database['public']['Views']['business_dashboard']['Row']
export type SharedBusinessIntelligence = Database['public']['Tables']['shared_business_intelligence']['Row']
export type AgentDiscovery = Database['public']['Tables']['agent_discoveries']['Row']
export type CrossAgentInsight = Database['public']['Tables']['cross_agent_insights']['Row']

export type BusinessLevel = 'beginner' | 'growth' | 'scale' | 'enterprise'
export type ConstraintType = 'leads' | 'sales' | 'delivery' | 'profit' | 'unknown'
export type ImplementationStatus = 'planned' | 'in_progress' | 'completed' | 'measuring' | 'cancelled'
export type AgentType = 'money-model-architect' | 'offer-analyzer' | 'financial-calculator' | 'constraint-analyzer' | 'psychology-optimizer' | 'implementation-planner' | 'coaching-methodology' | 'master-conductor'