import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface User {
  id: string
  email: string
  name?: string
  company_name?: string
  created_at: string
  updated_at: string
}

export interface Business {
  id: string
  user_id: string
  name: string
  industry?: string
  current_revenue?: number
  customer_count?: number
  cac?: number  // Customer Acquisition Cost
  ltv?: number  // Lifetime Value
  gross_margin?: number
  business_stage: 'startup' | 'growth' | 'scale' | 'mature'
  created_at: string
  updated_at: string
}

export interface CoachingSession {
  id: string
  user_id: string
  business_id?: string
  query: string
  session_type: 'diagnostic' | 'strategic' | 'implementation'
  agent_used: string
  n8n_response?: any
  synthesis?: string
  action_items?: any[]
  next_steps?: string[]
  frameworks?: string[]
  confidence?: number
  created_at: string
}

export interface AgentAnalysis {
  id: string
  session_id: string
  agent_type: string
  findings?: string[]
  recommendations?: string[]
  metrics?: any
  confidence?: number
  created_at: string
}

export interface UserPreferences {
  id: string
  user_id: string
  preferred_session_type: 'diagnostic' | 'strategic' | 'implementation'
  notification_settings: any
  coaching_history_visible: boolean
  created_at: string
  updated_at: string
}

// Database operations
export class SupabaseService {
  
  // User operations
  static async getUser(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching user:', error)
      return null
    }
    return data
  }

  static async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating user:', error)
      return null
    }
    return data
  }

  // Business operations
  static async getUserBusinesses(userId: string): Promise<Business[]> {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching businesses:', error)
      return []
    }
    return data || []
  }

  static async createBusiness(business: Omit<Business, 'id' | 'created_at' | 'updated_at'>): Promise<Business | null> {
    const { data, error } = await supabase
      .from('businesses')
      .insert(business)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating business:', error)
      return null
    }
    return data
  }

  static async updateBusiness(businessId: string, updates: Partial<Business>): Promise<Business | null> {
    const { data, error } = await supabase
      .from('businesses')
      .update(updates)
      .eq('id', businessId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating business:', error)
      return null
    }
    return data
  }

  // Coaching session operations
  static async createCoachingSession(session: Omit<CoachingSession, 'id' | 'created_at'>): Promise<CoachingSession | null> {
    const { data, error } = await supabase
      .from('coaching_sessions')
      .insert(session)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating coaching session:', error)
      return null
    }
    return data
  }

  static async updateCoachingSession(sessionId: string, updates: Partial<CoachingSession>): Promise<CoachingSession | null> {
    const { data, error } = await supabase
      .from('coaching_sessions')
      .update(updates)
      .eq('id', sessionId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating coaching session:', error)
      return null
    }
    return data
  }

  static async getUserSessions(userId: string, limit: number = 50): Promise<CoachingSession[]> {
    const { data, error } = await supabase
      .from('coaching_sessions')
      .select(`
        *,
        businesses (
          name,
          industry
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) {
      console.error('Error fetching sessions:', error)
      return []
    }
    return data || []
  }

  static async getSession(sessionId: string): Promise<CoachingSession | null> {
    const { data, error } = await supabase
      .from('coaching_sessions')
      .select(`
        *,
        businesses (
          name,
          industry
        ),
        agent_analyses (*)
      `)
      .eq('id', sessionId)
      .single()
    
    if (error) {
      console.error('Error fetching session:', error)
      return null
    }
    return data
  }

  // Agent analysis operations
  static async createAgentAnalysis(analysis: Omit<AgentAnalysis, 'id' | 'created_at'>): Promise<AgentAnalysis | null> {
    const { data, error } = await supabase
      .from('agent_analyses')
      .insert(analysis)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating agent analysis:', error)
      return null
    }
    return data
  }

  // User preferences
  static async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching preferences:', error)
      return null
    }
    return data
  }

  static async updateUserPreferences(userId: string, updates: Partial<UserPreferences>): Promise<UserPreferences | null> {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({ user_id: userId, ...updates })
      .select()
      .single()
    
    if (error) {
      console.error('Error updating preferences:', error)
      return null
    }
    return data
  }

  // Analytics and insights
  static async getUserSessionStats(userId: string): Promise<any> {
    const { data, error } = await supabase
      .from('coaching_sessions')
      .select('session_type, agent_used, created_at, confidence')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching session stats:', error)
      return null
    }

    // Calculate stats
    const totalSessions = data.length
    const avgConfidence = data.reduce((sum, session) => sum + (session.confidence || 0), 0) / totalSessions
    const sessionsByType = data.reduce((acc, session) => {
      acc[session.session_type] = (acc[session.session_type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalSessions,
      avgConfidence: avgConfidence || 0,
      sessionsByType,
      recentSessions: data.slice(0, 5)
    }
  }
}