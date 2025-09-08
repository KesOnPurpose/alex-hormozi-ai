-- ============================================================================
-- ALEX HORMOZI AI - AGENT INTELLIGENCE DATABASE SCHEMA
-- ============================================================================
-- This schema enables persistent cross-agent intelligence, discovery tracking,
-- and intelligent handoffs between the 8 specialized AI agents.
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. SHARED BUSINESS INTELLIGENCE TABLE
-- ============================================================================
-- Central hub for all business intelligence gathered across agents
CREATE TABLE shared_business_intelligence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES business_profiles(id) ON DELETE CASCADE,
  
  -- Current business state (dynamically updated)
  current_constraint TEXT CHECK (current_constraint IN ('leads', 'sales', 'delivery', 'profit', 'unknown')),
  constraint_confidence INTEGER CHECK (constraint_confidence BETWEEN 0 AND 100),
  business_stage TEXT CHECK (business_stage IN ('complete_beginner', 'have_business', 'scaling_business', 'experienced_operator')),
  sophistication_score INTEGER DEFAULT 1 CHECK (sophistication_score BETWEEN 1 AND 10),
  
  -- Business context (JSON for flexibility)
  business_context JSONB DEFAULT '{}', -- revenue, industry, team_size, etc.
  constraint_analysis JSONB DEFAULT '{}', -- detailed constraint breakdown
  
  -- Agent discovery aggregation
  discoveries JSONB DEFAULT '{}', -- discoveries organized by agent type
  cross_agent_context JSONB DEFAULT '{}', -- synthesized insights across agents
  
  -- Agent interaction tracking
  agent_interactions JSONB DEFAULT '[]', -- chronological interaction log
  last_agent_visited TEXT,
  agent_sequence TEXT[] DEFAULT '{}', -- sequence of agents consulted
  recommended_next_agent TEXT, -- system recommendation for next agent
  
  -- Journey metrics
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage BETWEEN 0 AND 100),
  agents_consulted TEXT[] DEFAULT '{}', -- unique agents consulted
  total_insights_generated INTEGER DEFAULT 0,
  total_implementations INTEGER DEFAULT 0,
  estimated_revenue_impact DECIMAL DEFAULT 0,
  
  -- Session management
  session_data JSONB DEFAULT '{}', -- temporary session state
  onboarding_completed BOOLEAN DEFAULT FALSE,
  analysis_completed BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. AGENT DISCOVERIES TABLE  
-- ============================================================================
-- Individual discoveries made by each agent
CREATE TABLE agent_discoveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES business_profiles(id) ON DELETE CASCADE,
  intelligence_id UUID REFERENCES shared_business_intelligence(id) ON DELETE CASCADE,
  
  -- Discovery metadata
  agent_type TEXT NOT NULL CHECK (agent_type IN (
    'master-conductor', 'constraint-analyzer', 'money-model-architect', 
    'offer-analyzer', 'financial-calculator', 'psychology-optimizer',
    'implementation-planner', 'coaching-methodology'
  )),
  discovery_type TEXT NOT NULL, -- constraint_identification, revenue_opportunity, etc.
  discovery_category TEXT, -- business_analysis, financial_projection, etc.
  
  -- Discovery content
  title TEXT NOT NULL,
  description TEXT,
  discovery_data JSONB NOT NULL DEFAULT '{}', -- structured discovery data
  
  -- Confidence and validation
  confidence_score INTEGER CHECK (confidence_score BETWEEN 0 AND 100),
  validation_status TEXT DEFAULT 'pending' CHECK (validation_status IN ('pending', 'validated', 'implemented', 'rejected')),
  validation_data JSONB DEFAULT '{}',
  
  -- Impact tracking
  expected_impact TEXT,
  expected_revenue_impact DECIMAL,
  expected_timeframe TEXT,
  actual_impact JSONB, -- tracked after implementation
  actual_revenue_impact DECIMAL,
  
  -- Relationships to other discoveries
  related_discoveries UUID[], -- array of related discovery IDs
  prerequisite_discoveries UUID[], -- discoveries that must be implemented first
  
  -- Implementation tracking
  implementation_status TEXT DEFAULT 'pending' CHECK (implementation_status IN ('pending', 'in_progress', 'completed', 'skipped', 'failed')),
  implementation_data JSONB DEFAULT '{}',
  implementation_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. CROSS-AGENT INSIGHTS TABLE
-- ============================================================================
-- System-generated insights from combining multiple agent discoveries
CREATE TABLE cross_agent_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES business_profiles(id) ON DELETE CASCADE,
  intelligence_id UUID REFERENCES shared_business_intelligence(id) ON DELETE CASCADE,
  
  -- Insight classification
  insight_type TEXT NOT NULL CHECK (insight_type IN (
    'synergy', 'conflict', 'opportunity', 'warning', 'recommendation', 
    'pattern', 'optimization', 'validation'
  )),
  priority_level TEXT DEFAULT 'medium' CHECK (priority_level IN ('critical', 'high', 'medium', 'low')),
  urgency_level TEXT DEFAULT 'normal' CHECK (urgency_level IN ('immediate', 'urgent', 'normal', 'low')),
  
  -- Contributing sources
  contributing_agents TEXT[] NOT NULL, -- agents that contributed to this insight
  source_discoveries UUID[], -- specific discoveries that generated this insight
  data_sources TEXT[], -- onboarding, file_upload, chat, etc.
  
  -- Insight content
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  insight_data JSONB DEFAULT '{}',
  
  -- Recommendations and actions
  suggested_actions TEXT[],
  next_agent_recommendation TEXT,
  implementation_priority INTEGER DEFAULT 50 CHECK (implementation_priority BETWEEN 1 AND 100),
  
  -- Impact projections
  projected_impact TEXT,
  projected_revenue_impact DECIMAL,
  projected_timeframe TEXT,
  confidence_score INTEGER CHECK (confidence_score BETWEEN 0 AND 100),
  
  -- User interaction
  user_acknowledged BOOLEAN DEFAULT FALSE,
  user_feedback TEXT,
  user_rating INTEGER CHECK (user_rating BETWEEN 1 AND 5),
  action_taken BOOLEAN DEFAULT FALSE,
  action_data JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. AGENT HANDOFFS TABLE
-- ============================================================================
-- Tracks transitions between agents with context preservation
CREATE TABLE agent_handoffs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  intelligence_id UUID REFERENCES shared_business_intelligence(id) ON DELETE CASCADE,
  
  -- Handoff details
  from_agent TEXT, -- null for initial entry
  to_agent TEXT NOT NULL,
  handoff_reason TEXT NOT NULL,
  handoff_type TEXT DEFAULT 'recommendation' CHECK (handoff_type IN ('recommendation', 'user_choice', 'system_routing', 'completion')),
  
  -- Context transfer
  context_summary TEXT,
  key_discoveries UUID[], -- important discoveries to carry forward
  key_decisions TEXT[],
  open_questions TEXT[],
  suggested_focus TEXT,
  priority_items TEXT[],
  
  -- Handoff context data
  handoff_data JSONB DEFAULT '{}',
  previous_session_summary TEXT,
  continuation_prompt TEXT, -- suggested opening for receiving agent
  
  -- Quality metrics
  context_completeness INTEGER CHECK (context_completeness BETWEEN 0 AND 100),
  handoff_success BOOLEAN, -- did user continue with recommended agent?
  user_satisfaction INTEGER CHECK (user_satisfaction BETWEEN 1 AND 5),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 5. AGENT PERFORMANCE TABLE
-- ============================================================================
-- Tracks performance metrics for each agent
CREATE TABLE agent_performance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_type TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  intelligence_id UUID REFERENCES shared_business_intelligence(id) ON DELETE CASCADE,
  
  -- Session metrics
  session_duration INTEGER, -- seconds
  messages_exchanged INTEGER DEFAULT 0,
  discoveries_generated INTEGER DEFAULT 0,
  insights_provided INTEGER DEFAULT 0,
  
  -- Quality metrics
  user_satisfaction INTEGER CHECK (user_satisfaction BETWEEN 1 AND 5),
  discovery_accuracy INTEGER CHECK (discovery_accuracy BETWEEN 0 AND 100),
  recommendation_quality INTEGER CHECK (recommendation_quality BETWEEN 1 AND 5),
  context_relevance INTEGER CHECK (context_relevance BETWEEN 1 AND 5),
  
  -- Outcome metrics
  handoffs_successful INTEGER DEFAULT 0,
  implementations_driven INTEGER DEFAULT 0,
  revenue_impact_attributed DECIMAL DEFAULT 0,
  
  -- Performance data
  performance_data JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 6. CONVERSATION HISTORY TABLE
-- ============================================================================
-- Stores chat messages and responses for context and training
CREATE TABLE conversation_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  intelligence_id UUID REFERENCES shared_business_intelligence(id) ON DELETE CASCADE,
  agent_type TEXT NOT NULL,
  
  -- Message details
  message_type TEXT NOT NULL CHECK (message_type IN ('user', 'agent', 'system')),
  message_content TEXT NOT NULL,
  message_metadata JSONB DEFAULT '{}',
  
  -- Context at time of message
  context_snapshot JSONB DEFAULT '{}',
  discoveries_at_time UUID[],
  agent_state JSONB DEFAULT '{}',
  
  -- Response analysis (for agent messages)
  response_quality INTEGER CHECK (response_quality BETWEEN 1 AND 5),
  discoveries_generated UUID[],
  handoffs_triggered UUID[],
  
  -- Conversation flow
  conversation_turn INTEGER NOT NULL,
  parent_message_id UUID REFERENCES conversation_history(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- DATABASE FUNCTIONS
-- ============================================================================

-- Function to generate cross-agent insights automatically
CREATE OR REPLACE FUNCTION generate_cross_agent_insights(
  p_intelligence_id UUID
) RETURNS JSONB AS $$
DECLARE
  discoveries RECORD;
  insights JSONB := '[]';
  insight JSONB;
  constraint_agents TEXT[];
  revenue_potential DECIMAL := 0;
BEGIN
  -- Analyze discovery patterns across agents
  FOR discoveries IN
    SELECT 
      agent_type,
      array_agg(discovery_data) as agent_discoveries,
      array_agg(id) as discovery_ids,
      array_agg(expected_revenue_impact) as revenue_impacts
    FROM agent_discoveries
    WHERE intelligence_id = p_intelligence_id
      AND validation_status != 'rejected'
    GROUP BY agent_type
  LOOP
    -- Calculate revenue potential
    SELECT COALESCE(SUM(impact), 0) INTO revenue_potential
    FROM UNNEST(discoveries.revenue_impacts) AS impact
    WHERE impact IS NOT NULL;
    
    -- Generate synergy opportunities
    IF discoveries.agent_type = 'offer-analyzer' THEN
      -- Look for psychology optimization opportunities
      IF EXISTS(SELECT 1 FROM agent_discoveries WHERE intelligence_id = p_intelligence_id AND agent_type = 'psychology-optimizer') THEN
        insight := jsonb_build_object(
          'type', 'synergy',
          'title', 'Offer + Psychology Optimization Synergy',
          'description', 'Your new offer design can be enhanced with behavioral psychology principles for 25-40% conversion lift',
          'contributing_agents', ARRAY['offer-analyzer', 'psychology-optimizer'],
          'suggested_next_agent', 'implementation-planner',
          'projected_revenue_impact', revenue_potential * 1.3,
          'confidence', 85,
          'priority', 'high'
        );
        insights := insights || insight;
      END IF;
    END IF;
    
    -- Generate constraint-specific insights
    IF discoveries.agent_type = 'constraint-analyzer' THEN
      -- Extract constraint from discovery data
      SELECT DISTINCT jsonb_extract_path_text(discovery_data, 'constraint') INTO constraint_agents
      FROM agent_discoveries 
      WHERE intelligence_id = p_intelligence_id AND agent_type = 'constraint-analyzer'
      LIMIT 1;
      
      IF constraint_agents = 'sales' THEN
        insight := jsonb_build_object(
          'type', 'recommendation',
          'title', 'Sales Constraint Solution Path',
          'description', 'Your sales constraint can be solved through offer optimization + psychology principles',
          'contributing_agents', ARRAY['constraint-analyzer'],
          'suggested_actions', ARRAY[
            'Work with Offer Analyzer to create Grand Slam Offer',
            'Apply Psychology Optimizer for conversion tactics',
            'Use Financial Calculator to validate ROI'
          ],
          'next_agent_recommendation', 'offer-analyzer',
          'confidence', 90
        );
        insights := insights || insight;
      END IF;
    END IF;
    
  END LOOP;
  
  -- Insert generated insights
  INSERT INTO cross_agent_insights (
    intelligence_id, user_id, insight_type, title, description, 
    contributing_agents, insight_data, projected_revenue_impact, confidence_score
  )
  SELECT 
    p_intelligence_id,
    (SELECT user_id FROM shared_business_intelligence WHERE id = p_intelligence_id),
    (insight->>'type')::TEXT,
    insight->>'title',
    insight->>'description',
    ARRAY(SELECT jsonb_array_elements_text(insight->'contributing_agents')),
    insight,
    (insight->>'projected_revenue_impact')::DECIMAL,
    (insight->>'confidence')::INTEGER
  FROM jsonb_array_elements(insights) AS insight;
  
  RETURN insights;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate completion percentage
CREATE OR REPLACE FUNCTION calculate_completion_percentage(
  p_user_id UUID,
  p_intelligence_id UUID
) RETURNS INTEGER AS $$
DECLARE
  total_agents INTEGER := 8;
  consulted_agents INTEGER;
  discoveries_count INTEGER;
  implementations_count INTEGER;
  insights_count INTEGER;
  completion INTEGER;
BEGIN
  -- Count consulted agents
  SELECT array_length(agents_consulted, 1) INTO consulted_agents
  FROM shared_business_intelligence
  WHERE id = p_intelligence_id;
  
  -- Count discoveries
  SELECT COUNT(*) INTO discoveries_count
  FROM agent_discoveries
  WHERE intelligence_id = p_intelligence_id;
  
  -- Count implementations
  SELECT COUNT(*) INTO implementations_count
  FROM agent_discoveries
  WHERE intelligence_id = p_intelligence_id
    AND implementation_status = 'completed';
  
  -- Count insights acknowledged
  SELECT COUNT(*) INTO insights_count
  FROM cross_agent_insights
  WHERE intelligence_id = p_intelligence_id
    AND user_acknowledged = true;
  
  -- Calculate weighted completion (out of 100)
  completion := (
    (COALESCE(consulted_agents, 0) * 25 / total_agents) +           -- 25% for agent consultation
    (LEAST(COALESCE(discoveries_count, 0), 15) * 30 / 15) +         -- 30% for discoveries (max 15)
    (LEAST(COALESCE(implementations_count, 0), 8) * 25 / 8) +       -- 25% for implementations (max 8)
    (LEAST(COALESCE(insights_count, 0), 10) * 20 / 10)             -- 20% for insights (max 10)
  );
  
  -- Update the intelligence record
  UPDATE shared_business_intelligence 
  SET 
    completion_percentage = LEAST(completion, 100),
    total_insights_generated = discoveries_count,
    total_implementations = implementations_count,
    updated_at = NOW()
  WHERE id = p_intelligence_id;
  
  RETURN LEAST(completion, 100);
END;
$$ LANGUAGE plpgsql;

-- Function to get next agent recommendation
CREATE OR REPLACE FUNCTION get_next_agent_recommendation(
  p_intelligence_id UUID
) RETURNS JSONB AS $$
DECLARE
  intelligence RECORD;
  recommendation JSONB;
BEGIN
  -- Get current intelligence state
  SELECT 
    current_constraint,
    last_agent_visited,
    agents_consulted,
    sophistication_score,
    completion_percentage
  INTO intelligence
  FROM shared_business_intelligence
  WHERE id = p_intelligence_id;
  
  -- Logic for next agent recommendation
  CASE 
    -- First time user - start with constraint analysis
    WHEN intelligence.last_agent_visited IS NULL THEN
      recommendation := jsonb_build_object(
        'agent', 'constraint-analyzer',
        'reason', 'Start by identifying your primary business constraint',
        'urgency', 'high',
        'confidence', 95
      );
      
    -- After constraint analysis - route based on discovered constraint
    WHEN intelligence.last_agent_visited = 'constraint-analyzer' THEN
      CASE intelligence.current_constraint
        WHEN 'leads' THEN
          recommendation := jsonb_build_object(
            'agent', 'money-model-architect',
            'reason', 'Lead constraint detected - optimize your customer acquisition model',
            'urgency', 'high',
            'confidence', 90
          );
        WHEN 'sales' THEN
          recommendation := jsonb_build_object(
            'agent', 'offer-analyzer', 
            'reason', 'Sales constraint detected - create irresistible offers',
            'urgency', 'high',
            'confidence', 90
          );
        WHEN 'delivery' THEN
          recommendation := jsonb_build_object(
            'agent', 'implementation-planner',
            'reason', 'Delivery constraint detected - systematic execution needed',
            'urgency', 'high', 
            'confidence', 85
          );
        WHEN 'profit' THEN
          recommendation := jsonb_build_object(
            'agent', 'financial-calculator',
            'reason', 'Profit constraint detected - analyze your unit economics',
            'urgency', 'high',
            'confidence', 90
          );
        ELSE
          recommendation := jsonb_build_object(
            'agent', 'master-conductor',
            'reason', 'Get strategic guidance for unclear constraints',
            'urgency', 'medium',
            'confidence', 75
          );
      END CASE;
      
    -- After offer analysis - enhance with psychology
    WHEN intelligence.last_agent_visited = 'offer-analyzer' THEN
      recommendation := jsonb_build_object(
        'agent', 'psychology-optimizer',
        'reason', 'Enhance your new offer with conversion psychology',
        'urgency', 'high',
        'confidence', 85
      );
      
    -- After money model - validate with financial analysis
    WHEN intelligence.last_agent_visited = 'money-model-architect' THEN
      recommendation := jsonb_build_object(
        'agent', 'financial-calculator',
        'reason', 'Validate your revenue model with financial projections', 
        'urgency', 'high',
        'confidence', 80
      );
      
    -- High completion - focus on implementation
    WHEN intelligence.completion_percentage >= 60 THEN
      recommendation := jsonb_build_object(
        'agent', 'implementation-planner',
        'reason', 'You have enough insights - time to create an action plan',
        'urgency', 'high',
        'confidence', 85
      );
      
    -- Default to Master Conductor for strategic guidance
    ELSE
      recommendation := jsonb_build_object(
        'agent', 'master-conductor',
        'reason', 'Get holistic view and strategic next steps',
        'urgency', 'medium', 
        'confidence', 70
      );
  END CASE;
  
  -- Update the intelligence record
  UPDATE shared_business_intelligence
  SET 
    recommended_next_agent = recommendation->>'agent',
    updated_at = NOW()
  WHERE id = p_intelligence_id;
  
  RETURN recommendation;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE shared_business_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_discoveries ENABLE ROW LEVEL SECURITY; 
ALTER TABLE cross_agent_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_handoffs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Users can only access their own data
CREATE POLICY "Users can manage their own intelligence" ON shared_business_intelligence
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own discoveries" ON agent_discoveries  
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own insights" ON cross_agent_insights
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own handoffs" ON agent_handoffs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own performance" ON agent_performance
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own conversations" ON conversation_history
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Intelligence table indexes
CREATE INDEX idx_intelligence_user_id ON shared_business_intelligence(user_id);
CREATE INDEX idx_intelligence_constraint ON shared_business_intelligence(current_constraint);
CREATE INDEX idx_intelligence_stage ON shared_business_intelligence(business_stage);
CREATE INDEX idx_intelligence_updated_at ON shared_business_intelligence(updated_at DESC);

-- Discoveries table indexes  
CREATE INDEX idx_discoveries_intelligence_id ON agent_discoveries(intelligence_id);
CREATE INDEX idx_discoveries_agent_type ON agent_discoveries(agent_type);
CREATE INDEX idx_discoveries_user_id ON agent_discoveries(user_id);
CREATE INDEX idx_discoveries_status ON agent_discoveries(implementation_status);
CREATE INDEX idx_discoveries_created_at ON agent_discoveries(created_at DESC);

-- Insights table indexes
CREATE INDEX idx_insights_intelligence_id ON cross_agent_insights(intelligence_id);
CREATE INDEX idx_insights_priority ON cross_agent_insights(priority_level);
CREATE INDEX idx_insights_acknowledged ON cross_agent_insights(user_acknowledged);
CREATE INDEX idx_insights_created_at ON cross_agent_insights(created_at DESC);

-- Handoffs table indexes
CREATE INDEX idx_handoffs_intelligence_id ON agent_handoffs(intelligence_id);
CREATE INDEX idx_handoffs_from_agent ON agent_handoffs(from_agent);
CREATE INDEX idx_handoffs_to_agent ON agent_handoffs(to_agent);
CREATE INDEX idx_handoffs_created_at ON agent_handoffs(created_at DESC);

-- Conversation table indexes
CREATE INDEX idx_conversation_intelligence_id ON conversation_history(intelligence_id);
CREATE INDEX idx_conversation_agent_type ON conversation_history(agent_type);
CREATE INDEX idx_conversation_created_at ON conversation_history(created_at DESC);

-- Performance table indexes
CREATE INDEX idx_performance_agent_type ON agent_performance(agent_type);
CREATE INDEX idx_performance_created_at ON agent_performance(created_at DESC);

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ============================================================================

-- Update timestamps automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_intelligence_updated_at 
    BEFORE UPDATE ON shared_business_intelligence
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_discoveries_updated_at
    BEFORE UPDATE ON agent_discoveries  
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_insights_updated_at
    BEFORE UPDATE ON cross_agent_insights
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to generate cross-agent insights when discoveries are added
CREATE OR REPLACE FUNCTION trigger_cross_agent_insights()
RETURNS TRIGGER AS $$
BEGIN
  -- Generate insights when a new discovery is added
  PERFORM generate_cross_agent_insights(NEW.intelligence_id);
  
  -- Update completion percentage
  PERFORM calculate_completion_percentage(NEW.user_id, NEW.intelligence_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_insights_on_discovery
    AFTER INSERT ON agent_discoveries
    FOR EACH ROW EXECUTE FUNCTION trigger_cross_agent_insights();

-- ============================================================================
-- SAMPLE DATA FOR TESTING
-- ============================================================================

-- Insert sample intelligence record (requires auth user)
-- This would be created when user completes onboarding
/*
INSERT INTO shared_business_intelligence (
  user_id, 
  current_constraint, 
  constraint_confidence,
  business_stage, 
  sophistication_score,
  business_context
) VALUES (
  auth.uid(),
  'sales',
  85,
  'have_business',
  4,
  '{"monthly_revenue": "5000", "business_type": "coaching", "team_size": 2}'
);
*/

-- ============================================================================
-- USAGE EXAMPLES
-- ============================================================================

/*
-- Example: Create business intelligence record
SELECT * FROM shared_business_intelligence 
WHERE user_id = auth.uid() 
ORDER BY created_at DESC 
LIMIT 1;

-- Example: Get agent recommendations
SELECT get_next_agent_recommendation('your-intelligence-id-here');

-- Example: Calculate completion percentage  
SELECT calculate_completion_percentage(auth.uid(), 'your-intelligence-id-here');

-- Example: Generate cross-agent insights
SELECT generate_cross_agent_insights('your-intelligence-id-here');

-- Example: Get user's discovery summary
SELECT 
  agent_type,
  COUNT(*) as discovery_count,
  AVG(confidence_score) as avg_confidence,
  SUM(expected_revenue_impact) as total_revenue_potential
FROM agent_discoveries 
WHERE user_id = auth.uid()
  AND intelligence_id = 'your-intelligence-id-here'
GROUP BY agent_type;
*/