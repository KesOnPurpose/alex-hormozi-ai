-- Alex Hormozi AI Coaching Orchestra - Supabase Database Schema
-- Manual schema setup since Supabase MCP is not working

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles Table
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    business_name TEXT,
    industry TEXT,
    business_stage TEXT CHECK (business_stage IN ('startup', 'growth', 'scale', 'mature')),
    current_revenue DECIMAL(15,2),
    customer_count INTEGER,
    cac DECIMAL(10,2), -- Customer Acquisition Cost
    ltv DECIMAL(10,2), -- Lifetime Value
    gross_margin DECIMAL(5,2), -- Gross Margin Percentage
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coaching Sessions Table
CREATE TABLE coaching_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    session_type TEXT CHECK (session_type IN ('diagnostic', 'strategic', 'implementation')),
    business_context JSONB,
    analysis_results JSONB, -- Store the complete AgentAnalysis array
    synthesis TEXT,
    action_items JSONB, -- Array of ActionItem objects
    next_steps TEXT[],
    frameworks TEXT[],
    confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
    session_duration INTEGER, -- in seconds
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Business Assessments Table
CREATE TABLE business_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    assessment_type TEXT NOT NULL, -- 'offer', 'financial', 'money-model', 'psychology', 'implementation'
    assessment_data JSONB NOT NULL, -- Store specific assessment results
    score INTEGER CHECK (score >= 0 AND score <= 100),
    recommendations TEXT[],
    priority TEXT CHECK (priority IN ('critical', 'high', 'medium', 'low')),
    status TEXT CHECK (status IN ('pending', 'in_progress', 'completed')) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Action Items Tracking Table
CREATE TABLE action_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    session_id UUID REFERENCES coaching_sessions(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT CHECK (priority IN ('critical', 'high', 'medium', 'low')) DEFAULT 'medium',
    timeline TEXT,
    frameworks TEXT[],
    mcp_support TEXT,
    status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
    due_date TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Framework Knowledge Base Table
CREATE TABLE framework_knowledge (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    framework_name TEXT NOT NULL UNIQUE,
    description TEXT,
    key_concepts JSONB, -- Array of key concepts
    diagnostic_questions TEXT[],
    implementation_steps TEXT[],
    success_metrics TEXT[],
    related_frameworks TEXT[],
    source_material TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Business Metrics Tracking Table
CREATE TABLE business_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    cac DECIMAL(10,2),
    ltv DECIMAL(10,2),
    gross_margin DECIMAL(5,2),
    thirty_day_gp DECIMAL(10,2), -- 30-day gross profit per customer
    cfa_ratio DECIMAL(5,2), -- Client Financed Acquisition ratio
    advertising_level INTEGER CHECK (advertising_level >= 0 AND advertising_level <= 3),
    payback_period DECIMAL(5,2), -- in months
    growth_rate DECIMAL(5,2), -- monthly growth percentage
    revenue DECIMAL(15,2),
    customer_count INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MCP Integration Logs Table
CREATE TABLE mcp_integration_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES coaching_sessions(id) ON DELETE CASCADE,
    mcp_type TEXT NOT NULL, -- 'exa_search', 'n8n', 'playwright', 'context7', 'ide'
    request_data JSONB,
    response_data JSONB,
    execution_time INTEGER, -- in milliseconds
    success BOOLEAN DEFAULT FALSE,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coaching Templates Table
CREATE TABLE coaching_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_name TEXT NOT NULL UNIQUE,
    template_type TEXT NOT NULL, -- 'diagnostic', 'strategic', 'implementation'
    industry TEXT,
    business_stage TEXT,
    question_sequence JSONB, -- Ordered array of questions
    analysis_prompts JSONB, -- Prompts for each agent
    expected_frameworks TEXT[],
    success_criteria TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Progress Tracking Table
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    framework_name TEXT NOT NULL,
    progress_score INTEGER CHECK (progress_score >= 0 AND progress_score <= 100) DEFAULT 0,
    milestones_completed INTEGER DEFAULT 0,
    total_milestones INTEGER,
    current_focus TEXT,
    blockers TEXT[],
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, framework_name)
);

-- Indexes for performance
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_coaching_sessions_user_id ON coaching_sessions(user_id);
CREATE INDEX idx_coaching_sessions_created_at ON coaching_sessions(created_at DESC);
CREATE INDEX idx_business_assessments_user_id ON business_assessments(user_id);
CREATE INDEX idx_action_items_user_id ON action_items(user_id);
CREATE INDEX idx_action_items_status ON action_items(status);
CREATE INDEX idx_business_metrics_user_id_date ON business_metrics(user_id, metric_date DESC);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);

-- Row Level Security (RLS) Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid()::text = id::text);

-- Policies for coaching_sessions
CREATE POLICY "Users can view own sessions" ON coaching_sessions FOR SELECT USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE user_profiles.id = coaching_sessions.user_id AND auth.uid()::text = user_profiles.id::text
));
CREATE POLICY "Users can insert own sessions" ON coaching_sessions FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM user_profiles WHERE user_profiles.id = coaching_sessions.user_id AND auth.uid()::text = user_profiles.id::text
));

-- Policies for business_assessments
CREATE POLICY "Users can view own assessments" ON business_assessments FOR SELECT USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE user_profiles.id = business_assessments.user_id AND auth.uid()::text = user_profiles.id::text
));
CREATE POLICY "Users can insert own assessments" ON business_assessments FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM user_profiles WHERE user_profiles.id = business_assessments.user_id AND auth.uid()::text = user_profiles.id::text
));

-- Policies for action_items
CREATE POLICY "Users can manage own action items" ON action_items FOR ALL USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE user_profiles.id = action_items.user_id AND auth.uid()::text = user_profiles.id::text
));

-- Policies for business_metrics
CREATE POLICY "Users can manage own metrics" ON business_metrics FOR ALL USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE user_profiles.id = business_metrics.user_id AND auth.uid()::text = user_profiles.id::text
));

-- Policies for user_progress
CREATE POLICY "Users can manage own progress" ON user_progress FOR ALL USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE user_profiles.id = user_progress.user_id AND auth.uid()::text = user_profiles.id::text
));

-- Framework Knowledge Base is publicly readable but not writable by users
CREATE POLICY "Framework knowledge is readable" ON framework_knowledge FOR SELECT USING (true);
CREATE POLICY "Coaching templates are readable" ON coaching_templates FOR SELECT USING (true);

-- Functions for common operations
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at timestamps
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coaching_sessions_updated_at BEFORE UPDATE ON coaching_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_assessments_updated_at BEFORE UPDATE ON business_assessments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_action_items_updated_at BEFORE UPDATE ON action_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_framework_knowledge_updated_at BEFORE UPDATE ON framework_knowledge FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coaching_templates_updated_at BEFORE UPDATE ON coaching_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial framework knowledge
INSERT INTO framework_knowledge (framework_name, description, key_concepts, diagnostic_questions, implementation_steps, success_metrics, related_frameworks, source_material) VALUES
(
    'Client Financed Acquisition',
    'Process where gross profit generated from a single client within the first 30 days is greater than the cost of acquiring that customer',
    '["30-day gross profit", "Customer acquisition cost", "Cash flow optimization", "Self-funded growth"]'::jsonb,
    ARRAY[
        'What is your current customer acquisition cost?',
        'How much gross profit do you make per customer in the first 30 days?',
        'What payment terms do you currently offer?',
        'Do you have any immediate upsells after the initial purchase?'
    ],
    ARRAY[
        'Calculate current 30-day gross profit per customer',
        'Identify immediate upsell opportunities',
        'Test front-loaded payment terms',
        'Optimize initial offer for higher margins',
        'Monitor CFA ratio weekly'
    ],
    ARRAY[
        '30-day GP > CAC achieved',
        'Positive cash flow from day one',
        'Ability to scale advertising without capital constraints',
        'Self-funding growth rate'
    ],
    ARRAY['Grand Slam Offer', '4-Prong Money Model', '3 Levels of Advertising'],
    '100 Million Dollar Money Models - Alex Hormozi'
),
(
    'Grand Slam Offer',
    'An offer so good that people feel stupid saying no, based on the Value Equation framework',
    '["Value equation", "Dream outcome", "Perceived likelihood", "Time delay", "Effort and sacrifice"]'::jsonb,
    ARRAY[
        'What specific outcome does your offer promise?',
        'How certain are customers that your solution will work?',
        'How long does it take to see results?',
        'How much effort does the customer have to put in?',
        'What makes your offer different from competitors?'
    ],
    ARRAY[
        'Define the dream outcome clearly',
        'Add proof elements to increase perceived likelihood',
        'Reduce time delay through quick wins',
        'Minimize customer effort and sacrifice',
        'Test offer variations for maximum impact'
    ],
    ARRAY[
        'Conversion rate improvement',
        'Ability to charge premium pricing',
        'Reduced price sensitivity',
        'Word-of-mouth referrals'
    ],
    ARRAY['Value Equation', 'Client Financed Acquisition', 'Psychology Optimization'],
    '100 Million Dollar Offers - Alex Hormozi'
),
(
    '4-Prong Money Model',
    'Four types of offers: Attraction (liquidate CAC), Upsell (maximize profit), Downsell (maximize conversion), Continuity (stabilize cash)',
    '["Attraction offers", "Upsell offers", "Downsell offers", "Continuity offers", "Sequential monetization"]'::jsonb,
    ARRAY[
        'What happens after someone buys your main offer?',
        'Do you have multiple price points for different budgets?',
        'What ongoing relationship do you have with customers?',
        'How do you maximize the value of each customer interaction?'
    ],
    ARRAY[
        'Design attraction offer to break even on CAC',
        'Create immediate upsell opportunities',
        'Develop downsell options for price-sensitive customers',
        'Build continuity revenue streams',
        'Map complete customer journey'
    ],
    ARRAY[
        'Multiple revenue streams per customer',
        'Increased average order value',
        'Predictable recurring revenue',
        'Improved customer lifetime value'
    ],
    ARRAY['Client Financed Acquisition', '5 Upsell Moments', 'Sequential Offers'],
    '100 Million Dollar Money Models - Alex Hormozi'
),
(
    '5 Upsell Moments',
    'Optimal timing for upsells: Immediately, Next step (24-72hrs), After big win, Halfway point, Last chance',
    '["Timing optimization", "Buying psychology", "Upsell sequences", "Customer journey", "Point of greatest deprivation"]'::jsonb,
    ARRAY[
        'When do you currently try to upsell customers?',
        'What is your current upsell conversion rate?',
        'Do you track customer milestone achievements?',
        'How do you handle customers who decline upsells?'
    ],
    ARRAY[
        'Map customer journey and identify key moments',
        'Create upsell offers for each of the 5 moments',
        'Test timing variations for maximum conversion',
        'Train team on psychology of each moment',
        'Track conversion rates by timing'
    ],
    ARRAY[
        'Increased upsell conversion rates',
        'Higher customer lifetime value',
        'Better timing of offers',
        'Reduced sales resistance'
    ],
    ARRAY['4-Prong Money Model', 'Psychology Optimization', 'Point of Greatest Deprivation'],
    '100 Million Dollar Money Models - Alex Hormozi'
),
(
    '3 Levels of Advertising',
    'Level 1: LTV > CAC, Level 2: 30-day GP > CAC, Level 3: 30-day GP > 2x CAC',
    '["Advertising levels", "Cash flow optimization", "Growth constraints", "Scalability"]'::jsonb,
    ARRAY[
        'What level are you currently operating at?',
        'What constrains your ability to spend more on advertising?',
        'How long does it take to break even on a new customer?',
        'What would change if you could advertise without cash flow concerns?'
    ],
    ARRAY[
        'Calculate current advertising level',
        'Identify path to next level',
        'Focus on constraints limiting advancement',
        'Test strategies for level advancement',
        'Monitor metrics weekly'
    ],
    ARRAY[
        'Advancement to higher advertising levels',
        'Reduced growth constraints',
        'Ability to outspend competitors',
        'Unlimited scale potential'
    ],
    ARRAY['Client Financed Acquisition', 'Financial Calculator', 'Business Metrics'],
    '100 Million Dollar Money Models - Alex Hormozi'
);

-- Sample coaching templates
INSERT INTO coaching_templates (template_name, template_type, industry, business_stage, question_sequence, analysis_prompts, expected_frameworks, success_criteria) VALUES
(
    'CFA Achievement Assessment',
    'diagnostic',
    NULL,
    NULL,
    '[
        "What is your current customer acquisition cost (CAC)?",
        "How much revenue does each customer generate in their first 30 days?",
        "What is your gross profit margin on that revenue?",
        "Do you have any immediate upsells or additional purchases in the first month?",
        "What payment terms do you currently offer (upfront vs. monthly)?"
    ]'::jsonb,
    '{
        "financial": "Focus on CFA calculation and payback analysis",
        "offer": "Analyze pricing power and value equation for 30-day optimization",
        "money-model": "Evaluate immediate monetization opportunities"
    }'::jsonb,
    ARRAY['Client Financed Acquisition', 'Financial Calculator', '3 Levels of Advertising'],
    ARRAY[
        'Clear understanding of current CFA status',
        'Specific action plan to achieve or improve CFA ratio',
        'Timeline for implementation with measurable milestones'
    ]
),
(
    'Grand Slam Offer Development',
    'strategic',
    NULL,
    'startup',
    '[
        "What is the dream outcome your customers want to achieve?",
        "What makes customers doubt whether your solution will work?",
        "How long does it take for customers to see meaningful results?",
        "What effort or sacrifice do customers have to make?",
        "How is your offer different from what competitors provide?",
        "What would make your offer so compelling that people feel stupid saying no?"
    ]'::jsonb,
    '{
        "offer": "Complete Value Equation analysis and Grand Slam Offer development",
        "psychology": "Evaluate customer psychology and buying behavior",
        "financial": "Assess pricing power and margin potential"
    }'::jsonb,
    ARRAY['Grand Slam Offer', 'Value Equation', 'Psychology Optimization'],
    ARRAY[
        'Clear value equation with scores for each component',
        'Specific improvements to increase offer attractiveness',
        'Testing plan for offer optimization'
    ]
);