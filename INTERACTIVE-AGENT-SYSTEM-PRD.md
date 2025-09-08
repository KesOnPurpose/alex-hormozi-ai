# Interactive Agent Intelligence System - Product Requirements Document

## Executive Summary

Build an AI-powered business coaching platform featuring **8 specialized agents** with **persistent cross-agent intelligence**. Each agent provides deep expertise in specific business domains while sharing discoveries to create a comprehensive, personalized growth strategy based on Alex Hormozi's proven frameworks from 1,260+ business consultations.

### Key Innovation
Unlike traditional chatbots, this system creates **persistent business intelligence** where each agent builds upon discoveries from other agents, creating a cohesive, evolving understanding of the user's business that gets smarter with every interaction.

## Business Context

### Target Audience
- Real estate investors
- Entrepreneurs  
- Coaches
- Personal development seekers

### Core Problem Solved
**Manual user onboarding and fragmented business analysis** - Users currently get isolated advice without context from previous interactions or other business domains.

### Solution
**Unified Intelligence Hub** where 8 specialized AI agents collaborate to provide comprehensive business transformation, with each agent understanding and building upon insights from all other agents.

## Technical Architecture Overview

### Stack Requirements
- **Frontend**: React 18, Next.js 14+, TypeScript, Tailwind CSS, ShadCN UI
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Workflows**: N8n (8 specialized agent workflows)
- **AI**: OpenAI GPT-4 or Claude (configurable per agent)
- **Charts**: Recharts for business visualizations

### Core Architecture Pattern
```
User Request → Agent Workspace → N8n Workflow → AI with Cross-Agent Context → Discovery Storage → Intelligence Update → Response with Handoff Recommendations
```

## Database Schema Implementation

### 1. Shared Business Intelligence Table
```sql
CREATE TABLE shared_business_intelligence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  business_id UUID REFERENCES business_profiles(id) ON DELETE CASCADE,
  
  -- Current business state
  current_constraint TEXT CHECK (current_constraint IN ('leads', 'sales', 'delivery', 'profit', 'unknown')),
  business_stage TEXT CHECK (business_stage IN ('beginner', 'growth', 'scale', 'enterprise')),
  
  -- Agent discoveries (JSONB for flexible storage)
  discoveries JSONB DEFAULT '{}',
  context JSONB DEFAULT '{}',
  
  -- Agent interaction tracking
  agent_interactions JSONB DEFAULT '[]',
  last_agent_visited TEXT,
  agent_sequence TEXT[] DEFAULT '{}',
  
  -- Journey metrics
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage BETWEEN 0 AND 100),
  agents_consulted TEXT[] DEFAULT '{}',
  total_insights_generated INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. Agent Discoveries Table
```sql
CREATE TABLE agent_discoveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  business_id UUID REFERENCES business_profiles(id) ON DELETE CASCADE,
  intelligence_id UUID REFERENCES shared_business_intelligence(id) ON DELETE CASCADE,
  
  -- Discovery metadata
  agent_type TEXT NOT NULL CHECK (agent_type IN (
    'money-model-architect', 'offer-analyzer', 'financial-calculator',
    'constraint-analyzer', 'psychology-optimizer', 'implementation-planner',
    'coaching-methodology', 'master-conductor'
  )),
  discovery_type TEXT NOT NULL,
  discovery_category TEXT,
  
  -- Discovery content
  title TEXT NOT NULL,
  description TEXT,
  discovery_data JSONB NOT NULL DEFAULT '{}',
  
  -- Relationships and impact
  related_discoveries UUID[], -- Links to other agent discoveries
  confidence_score INTEGER CHECK (confidence_score BETWEEN 0 AND 100),
  implementation_status TEXT DEFAULT 'pending' CHECK (implementation_status IN ('pending', 'in_progress', 'completed', 'skipped')),
  
  -- Impact tracking
  expected_impact TEXT,
  actual_impact JSONB,
  revenue_impact DECIMAL,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. Cross-Agent Insights Table
```sql
CREATE TABLE cross_agent_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  business_id UUID REFERENCES business_profiles(id) ON DELETE CASCADE,
  intelligence_id UUID REFERENCES shared_business_intelligence(id) ON DELETE CASCADE,
  
  -- Insight metadata
  insight_type TEXT NOT NULL CHECK (insight_type IN (
    'synergy', 'conflict', 'opportunity', 'warning', 'recommendation', 'pattern'
  )),
  priority_level TEXT DEFAULT 'medium' CHECK (priority_level IN ('critical', 'high', 'medium', 'low')),
  
  -- Contributing agents
  contributing_agents TEXT[] NOT NULL,
  source_discoveries UUID[], -- References to agent_discoveries
  
  -- Insight content
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  insight_data JSONB DEFAULT '{}',
  
  -- Action items
  suggested_actions TEXT[],
  next_agent_recommendation TEXT,
  
  -- User interaction
  user_acknowledged BOOLEAN DEFAULT FALSE,
  action_taken BOOLEAN DEFAULT FALSE,
  user_feedback TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4. Agent Handoffs Table
```sql
CREATE TABLE agent_handoffs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  intelligence_id UUID REFERENCES shared_business_intelligence(id) ON DELETE CASCADE,
  
  -- Handoff details
  from_agent TEXT,
  to_agent TEXT NOT NULL,
  handoff_reason TEXT,
  
  -- Context transfer
  context_summary TEXT,
  key_decisions TEXT[],
  open_questions TEXT[],
  suggested_focus TEXT,
  
  -- Handoff quality metrics
  context_completeness INTEGER CHECK (context_completeness BETWEEN 0 AND 100),
  user_satisfaction INTEGER CHECK (user_satisfaction BETWEEN 1 AND 5),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 5. Required Database Functions

#### Generate Cross-Agent Insights Function
```sql
CREATE OR REPLACE FUNCTION generate_cross_agent_insights(
  p_intelligence_id UUID
)
RETURNS JSONB AS $$
DECLARE
  discoveries RECORD;
  insights JSONB := '[]';
  insight JSONB;
BEGIN
  -- Find patterns across different agent discoveries
  FOR discoveries IN
    SELECT 
      agent_type,
      array_agg(discovery_data) as agent_discoveries,
      array_agg(id) as discovery_ids
    FROM agent_discoveries
    WHERE intelligence_id = p_intelligence_id
    GROUP BY agent_type
  LOOP
    -- Example: Identify synergy opportunities
    IF discoveries.agent_type = 'offer-analyzer' THEN
      -- Look for psychology optimization opportunities
      SELECT jsonb_build_object(
        'type', 'opportunity',
        'title', 'Psychology Optimization Opportunity',
        'description', 'Your new offer could benefit from conversion psychology optimization',
        'suggested_next_agent', 'psychology-optimizer',
        'confidence', 85
      ) INTO insight;
      
      insights := insights || insight;
    END IF;
  END LOOP;
  
  RETURN insights;
END;
$$ LANGUAGE plpgsql;
```

#### Calculate Completion Percentage Function
```sql
CREATE OR REPLACE FUNCTION calculate_completion_percentage(
  p_user_id UUID,
  p_intelligence_id UUID
)
RETURNS INTEGER AS $$
DECLARE
  total_agents INTEGER := 8;
  consulted_agents INTEGER;
  discoveries_count INTEGER;
  implementations_count INTEGER;
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
  
  -- Calculate weighted completion
  completion := (
    (COALESCE(consulted_agents, 0) * 30 / total_agents) +
    (LEAST(discoveries_count, 20) * 40 / 20) +
    (LEAST(implementations_count, 10) * 30 / 10)
  );
  
  RETURN LEAST(completion, 100);
END;
$$ LANGUAGE plpgsql;
```

#### Get Next Agent Recommendation Function
```sql
CREATE OR REPLACE FUNCTION get_next_agent_recommendation(
  p_intelligence_id UUID
)
RETURNS JSONB AS $$
DECLARE
  last_agent TEXT;
  current_constraint TEXT;
  consulted_agents TEXT[];
  recommendation JSONB;
BEGIN
  -- Get current state
  SELECT 
    last_agent_visited,
    current_constraint,
    agents_consulted
  INTO last_agent, current_constraint, consulted_agents
  FROM shared_business_intelligence
  WHERE id = p_intelligence_id;
  
  -- Logic for next agent recommendation
  CASE 
    WHEN last_agent IS NULL THEN
      recommendation := jsonb_build_object(
        'agent', 'constraint-analyzer',
        'reason', 'Start by identifying your primary business constraint',
        'urgency', 'high'
      );
    WHEN last_agent = 'constraint-analyzer' AND current_constraint = 'sales' THEN
      recommendation := jsonb_build_object(
        'agent', 'offer-analyzer',
        'reason', 'Sales constraint detected - optimize your offers first',
        'urgency', 'high'
      );
    WHEN last_agent = 'offer-analyzer' THEN
      recommendation := jsonb_build_object(
        'agent', 'psychology-optimizer',
        'reason', 'Build on your new offer with conversion psychology',
        'urgency', 'high'
      );
    ELSE
      recommendation := jsonb_build_object(
        'agent', 'master-conductor',
        'reason', 'Get holistic view and next steps',
        'urgency', 'medium'
      );
  END CASE;
  
  RETURN recommendation;
END;
$$ LANGUAGE plpgsql;
```

## Service Layer Implementation

### SharedIntelligenceService Class

Create `/src/services/sharedIntelligence.ts`:

```typescript
import { supabase } from '@/lib/supabase/client'
import type {
  AgentType,
  SharedBusinessIntelligence,
  AgentDiscovery,
  CrossAgentInsight,
  AgentHandoff
} from '@/lib/supabase/types'

export interface BusinessContext {
  currentConstraint?: 'leads' | 'sales' | 'delivery' | 'profit' | 'unknown'
  businessStage?: 'beginner' | 'growth' | 'scale' | 'enterprise'
  businessModel?: string
  revenue?: number
  team_size?: number
  [key: string]: any
}

export interface AgentDiscoveryData {
  agentType: AgentType
  discoveryType: string
  discoveryCategory?: string
  title: string
  description?: string
  discoveryData: Record<string, any>
  confidenceScore?: number
  expectedImpact?: string
  revenueImpact?: number
}

export class SharedIntelligenceService {
  // Initialize or get existing intelligence record
  static async getOrCreateIntelligence(userId: string, businessId?: string): Promise<SharedBusinessIntelligence>
  
  // Update business context
  static async updateBusinessContext(intelligenceId: string, context: BusinessContext): Promise<void>
  
  // Record agent visit
  static async recordAgentVisit(intelligenceId: string, agentType: AgentType): Promise<void>
  
  // Add agent discovery
  static async addDiscovery(userId: string, intelligenceId: string, discovery: AgentDiscoveryData, businessId?: string): Promise<AgentDiscovery>
  
  // Get discoveries for specific agent
  static async getAgentDiscoveries(intelligenceId: string, agentType?: AgentType): Promise<AgentDiscovery[]>
  
  // Get all discoveries for cross-agent context
  static async getAllDiscoveries(intelligenceId: string): Promise<{ [agentType: string]: AgentDiscovery[] }>
  
  // Generate cross-agent insights
  static async generateCrossAgentInsights(intelligenceId: string): Promise<void>
  
  // Get next agent recommendation
  static async getNextAgentRecommendation(intelligenceId: string): Promise<{ agent: AgentType; reason: string; urgency: string } | null>
  
  // Create agent handoff
  static async createHandoff(userId: string, intelligenceId: string, fromAgent: AgentType | null, toAgent: AgentType, handoffData: any): Promise<AgentHandoff>
  
  // Get completion percentage
  static async getCompletionPercentage(intelligenceId: string): Promise<number>
  
  // Get intelligence summary for agent context
  static async getIntelligenceSummary(intelligenceId: string): Promise<{
    intelligence: SharedBusinessIntelligence
    discoveries: { [agentType: string]: AgentDiscovery[] }
    recentInsights: CrossAgentInsight[]
    completionPercentage: number
  }>
}
```

## Frontend Component Implementation

### 1. AgentSelectionHub Component

Create `/src/components/agents/AgentSelectionHub.tsx`:

**Key Features:**
- Visual grid of all 8 agents with status indicators
- Progress tracking across agent consultations
- Smart next-agent recommendations
- Discovery count per agent
- Business overview with current constraint
- Completion percentage visualization

**Agent Configurations:**
```typescript
const AGENT_CONFIGS: AgentConfig[] = [
  {
    id: 'constraint-analyzer',
    title: 'Constraint Analyzer',
    description: 'Identify your biggest business bottleneck and unlock explosive growth',
    icon: AlertTriangle,
    color: 'bg-red-500',
    capabilities: ['Bottleneck Detection', 'Growth Diagnostics', 'Resource Analysis'],
    whenToUse: 'Start here to identify what\'s really holding your business back',
    expectedOutcome: 'Clear identification of your #1 constraint and immediate action plan'
  },
  // ... 7 more agent configurations
]
```

**Status Logic:**
- **Not Started**: Gray badge, no discoveries
- **Visited**: Blue badge, agent consulted but no discoveries
- **In Progress**: Yellow badge, has discoveries but none completed
- **Completed**: Green badge, has completed implementations

### 2. AgentWorkspace Component

Create `/src/components/agents/AgentWorkspace.tsx`:

**Key Features:**
- Collapsible sidebar with cross-agent context
- Real-time chat interface
- Discovery tracking and display
- Agent capability visualization
- Handoff recommendation display

**Sidebar Sections:**
1. **My Discoveries**: Current agent's findings
2. **Cross-Agent Insights**: Relevant discoveries from other agents  
3. **Recent Insights**: System-generated cross-agent insights

**Chat Interface:**
- User message input with multi-line support
- Agent responses with typing indicators
- Discovery extraction and storage
- Context-aware AI responses

### 3. Routing Implementation

Create `/src/app/agents/page.tsx`:
```typescript
'use client'
import { AgentSelectionHub } from '@/components/agents/AgentSelectionHub'

export default function AgentsPage() {
  return <AgentSelectionHub />
}
```

Create `/src/app/agents/[agentType]/page.tsx`:
```typescript
'use client'
import { useParams, useSearchParams } from 'next/navigation'
import { AgentWorkspace } from '@/components/agents/AgentWorkspace'

export default function AgentPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  
  const agentType = params.agentType as AgentType
  const intelligenceId = searchParams.get('intelligence')
  
  const agentConfig = AGENT_CONFIGS[agentType]
  
  return (
    <AgentWorkspace
      agentType={agentType}
      agentConfig={agentConfig}
      intelligenceId={intelligenceId}
    >
      {/* Agent-specific content components */}
    </AgentWorkspace>
  )
}
```

## N8n Workflow Architecture

### Base Workflow Structure (8 workflows required)

Each agent needs its own N8n workflow with this pattern:

#### 1. Webhook Trigger
- **URL**: `/webhook/agents/{agentType}`
- **Method**: POST
- **Headers**: Authorization, Content-Type
- **Body**: `{ userId, intelligenceId, message, context }`

#### 2. Context Retrieval Node
**SQL Query to get cross-agent context:**
```sql
SELECT 
  sbi.*,
  COALESCE(json_agg(ad.*) FILTER (WHERE ad.id IS NOT NULL), '[]') as discoveries,
  COALESCE(json_agg(cai.*) FILTER (WHERE cai.id IS NOT NULL), '[]') as insights
FROM shared_business_intelligence sbi
LEFT JOIN agent_discoveries ad ON sbi.id = ad.intelligence_id
LEFT JOIN cross_agent_insights cai ON sbi.id = cai.intelligence_id AND cai.user_acknowledged = false
WHERE sbi.id = {{ $json.intelligenceId }}
GROUP BY sbi.id
```

#### 3. Cross-Agent Context Formatter
Transform database context into prompt format:
```javascript
// Format discoveries from other agents
const otherAgentContext = items[0].discoveries
  .filter(d => d.agent_type !== '{{ $json.agentType }}')
  .map(d => `${d.agent_type}: ${d.title} - ${d.description}`)
  .join('\n')

const crossAgentPrompt = `
CROSS-AGENT CONTEXT:
${otherAgentContext}

BUSINESS STATE:
- Constraint: ${items[0].current_constraint}
- Stage: ${items[0].business_stage}
- Agents Consulted: ${items[0].agents_consulted?.join(', ')}

RECENT INSIGHTS:
${items[0].insights.map(i => `- ${i.title}: ${i.description}`).join('\n')}
`

return { crossAgentPrompt }
```

#### 4. AI Processing Node (OpenAI/Claude)
**System Prompt Construction:**
```javascript
const systemPrompt = `${agentPromptFromFile}

${crossAgentPrompt}

CURRENT USER MESSAGE: "${userMessage}"

Respond with analysis and include JSON discovery data in this format:
{
  "discoveries": [
    {
      "type": "constraint_identification",
      "category": "business_analysis", 
      "title": "Primary Constraint Identified",
      "description": "Brief description",
      "data": { "constraint": "sales", "severity": "high", "evidence": [...] },
      "confidence": 95,
      "impact": "This will unlock 30% growth",
      "revenue_impact": 50000
    }
  ],
  "handoff_recommendations": [
    {
      "to_agent": "money-model-architect",
      "reason": "Need revenue architecture for sales constraint",
      "priority": "high"
    }
  ]
}
`
```

#### 5. Response Parser Node
Extract and validate JSON discoveries:
```javascript
const response = items[0].response
const jsonMatch = response.match(/\{[\s\S]*\}/)

if (jsonMatch) {
  try {
    const parsed = JSON.parse(jsonMatch[0])
    return {
      response: response.replace(jsonMatch[0], '').trim(),
      discoveries: parsed.discoveries || [],
      handoffs: parsed.handoff_recommendations || []
    }
  } catch (error) {
    return { response, discoveries: [], handoffs: [] }
  }
}
return { response, discoveries: [], handoffs: [] }
```

#### 6. Discovery Storage Node
Store discoveries to Supabase:
```sql
INSERT INTO agent_discoveries (
  user_id, intelligence_id, agent_type, discovery_type, 
  discovery_category, title, description, discovery_data,
  confidence_score, expected_impact, revenue_impact
) VALUES (
  '{{ $json.userId }}',
  '{{ $json.intelligenceId }}', 
  '{{ $json.agentType }}',
  '{{ $json.discovery.type }}',
  '{{ $json.discovery.category }}',
  '{{ $json.discovery.title }}',
  '{{ $json.discovery.description }}',
  '{{ $json.discovery.data }}',
  {{ $json.discovery.confidence }},
  '{{ $json.discovery.impact }}',
  {{ $json.discovery.revenue_impact }}
)
```

#### 7. Intelligence Update Node
Update shared intelligence metrics:
```sql
UPDATE shared_business_intelligence 
SET 
  last_agent_visited = '{{ $json.agentType }}',
  agent_sequence = array_append(agent_sequence, '{{ $json.agentType }}'),
  agents_consulted = CASE 
    WHEN '{{ $json.agentType }}' = ANY(agents_consulted) THEN agents_consulted
    ELSE array_append(agents_consulted, '{{ $json.agentType }}')
  END,
  total_insights_generated = total_insights_generated + {{ $json.discoveries.length }},
  updated_at = NOW()
WHERE id = '{{ $json.intelligenceId }}'
```

#### 8. Response Formatter
Return formatted response:
```javascript
return {
  message: items[0].response,
  discoveries: items[0].discoveries,
  handoff_recommendations: items[0].handoffs,
  agent_type: "{{ $json.agentType }}",
  timestamp: new Date().toISOString()
}
```

### Agent-Specific Workflow Variations

#### Constraint Analyzer Workflow
- **Special Logic**: Updates `current_constraint` in shared intelligence
- **Handoff Logic**: Always recommends constraint-specific next agent
- **Discovery Types**: `constraint_identification`, `bottleneck_analysis`

#### Money Model Architect Workflow  
- **Special Logic**: Creates/updates money model components
- **Handoff Logic**: Recommends Offer Analyzer or Psychology Optimizer
- **Discovery Types**: `revenue_architecture`, `pricing_strategy`

#### Financial Calculator Workflow
- **Special Logic**: Performs calculations and stores metrics
- **Handoff Logic**: Validates previous agent recommendations
- **Discovery Types**: `financial_projection`, `roi_analysis`

### Webhook Endpoint Configuration

Each workflow needs these endpoints:
- `POST /webhook/agents/constraint-analyzer`
- `POST /webhook/agents/money-model-architect`
- `POST /webhook/agents/offer-analyzer`
- `POST /webhook/agents/financial-calculator`
- `POST /webhook/agents/psychology-optimizer`
- `POST /webhook/agents/implementation-planner`
- `POST /webhook/agents/coaching-methodology`
- `POST /webhook/agents/master-conductor`

### Environment Variables Required
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
OPENAI_API_KEY=your_openai_key
N8N_WEBHOOK_BASE_URL=your_n8n_url
```

## Agent System Prompts Integration

### Cross-Agent Intelligence Section (Add to all prompts)

Each agent prompt needs this integration section added after the main description:

```markdown
## CROSS-AGENT INTELLIGENCE INTEGRATION

You are part of an interconnected intelligence system where agents share discoveries and build upon each other's insights. Before providing recommendations, ALWAYS consider prior agent discoveries and build upon their findings.

### Integration with Other Agents:

**From Constraint Analyzer**: Use their identified primary constraint to focus your analysis on solving that specific bottleneck.

**From Money Model Architect**: Build upon their revenue architecture design rather than conflicting with it.

**From Offer Analyzer**: Reference their validated offers and value propositions.

**From Financial Calculator**: Incorporate their ROI projections and unit economics into your recommendations.

**From Psychology Optimizer**: Apply their behavioral insights to enhance your recommendations.

**From Implementation Planner**: Consider their execution timelines when making suggestions.

**From Coaching Methodology**: Integrate their systematic approaches into your frameworks.

**From Master Conductor**: Reference their strategic priorities to ensure alignment.

### Cross-Agent Discovery Integration:
When relevant discoveries exist from other agents, reference them directly:
- "Building on the [specific constraint/insight] discovered by [Agent Name]..."
- "Your [specific discovery] from the [Agent Type] analysis suggests we should focus on..."
- "Given the [specific finding] identified earlier, this indicates..."

### Handoff Protocol:
When handing off to other agents, provide:
- **Context**: What analysis you completed and key findings
- **Specific Items**: Concrete discoveries that need further analysis  
- **Priority**: Which items should be addressed first
- **Integration Points**: How your findings connect to their expertise
```

### Response Format Addition (Add to all prompts)

```markdown
## RESPONSE FORMAT

Before starting analysis, ALWAYS check for prior agent discoveries and integrate their findings. Reference specific discoveries when building your recommendations.

Add this section to your JSON response:

```json
{
  "crossAgentContext": {
    "priorDiscoveries": [
      {
        "agentType": "[agent-name]",
        "discovery": "[specific discovery]", 
        "impact": "[how it affects your analysis]"
      }
    ],
    "integrationPoints": [
      "[How you're building on previous agent work]",
      "[Specific connections to other agent findings]"
    ],
    "handoffRecommendations": [
      {
        "toAgent": "[recommended-next-agent]",
        "context": "[why this handoff makes sense]",
        "specificItems": ["[item 1]", "[item 2]"]
      }
    ]
  }
}
```

## User Journey Flow

### 1. Initial Entry
- User lands on `/agents` (Agent Selection Hub)
- System creates or retrieves `shared_business_intelligence` record
- Shows 8 agents with current status and progress

### 2. Agent Selection
- User clicks on recommended agent (or any agent)
- Route: `/agents/constraint-analyzer?intelligence={id}`
- AgentWorkspace loads with sidebar context

### 3. Agent Interaction
- User asks business question
- Frontend sends to N8n webhook with context
- Agent processes with cross-agent awareness
- Response includes discoveries and handoff recommendations

### 4. Discovery Storage
- Agent discoveries saved to database
- Cross-agent insights generated automatically
- Progress percentages updated
- Next agent recommendations calculated

### 5. Agent Handoff
- System recommends next agent based on discoveries
- User can continue journey or return to hub
- All context persists across agent interactions

### 6. Complete Strategy
- After consulting multiple agents, user has comprehensive strategy
- Master Conductor synthesizes all insights
- Implementation roadmap created with priorities

## Technical Implementation Checklist

### Database Setup
- [ ] Run `002_agent_intelligence_system.sql` migration
- [ ] Configure RLS policies for all tables
- [ ] Test database functions (completion %, recommendations)
- [ ] Set up proper indexes for performance

### Service Layer  
- [ ] Implement `SharedIntelligenceService` class
- [ ] Create TypeScript interfaces for all data types
- [ ] Add error handling and validation
- [ ] Implement caching for performance

### Frontend Components
- [ ] Build `AgentSelectionHub` with progress tracking
- [ ] Create `AgentWorkspace` with chat interface
- [ ] Implement agent status logic and visual indicators
- [ ] Add cross-agent discovery sidebar
- [ ] Create routing for `/agents/[agentType]`

### N8n Workflows
- [ ] Create 8 agent-specific workflows
- [ ] Configure webhook endpoints for each agent
- [ ] Implement cross-agent context retrieval
- [ ] Add discovery parsing and storage
- [ ] Configure AI API integration (OpenAI/Claude)
- [ ] Test error handling and fallbacks

### Agent Prompts
- [ ] Add cross-agent intelligence section to all 8 prompts
- [ ] Update JSON response format requirements
- [ ] Configure handoff protocol specifications
- [ ] Test prompt integration with workflows

### Integration Testing
- [ ] Test end-to-end user journey
- [ ] Verify cross-agent context sharing
- [ ] Validate discovery persistence
- [ ] Test handoff recommendations
- [ ] Verify progress tracking accuracy

### Performance Optimization
- [ ] Implement database query optimization
- [ ] Add caching for frequent operations
- [ ] Configure CDN for static assets
- [ ] Optimize N8n workflow performance

### Security & Authentication
- [ ] Implement proper RLS policies
- [ ] Secure N8n webhook endpoints
- [ ] Add rate limiting to prevent abuse
- [ ] Implement proper error logging

## Success Criteria & Validation

### Core Functionality
1. **Agent Interaction**: Users can click any agent and have meaningful conversations
2. **Cross-Agent Intelligence**: Each agent references and builds upon discoveries from other agents
3. **Discovery Persistence**: All insights are saved and accessible across sessions
4. **Progress Tracking**: Visual indicators show completion status across all agents
5. **Smart Recommendations**: System suggests next agent based on current discoveries

### Business Outcomes
1. **Comprehensive Strategy**: Users develop complete business strategy across all 8 domains
2. **Personalized Insights**: Each agent provides recommendations tailored to user's specific context
3. **Actionable Roadmap**: Implementation Planner creates executable timeline based on all discoveries
4. **Measurable Impact**: Financial Calculator provides ROI projections for all recommendations

### Technical Performance
1. **Response Time**: Agent responses < 10 seconds
2. **Discovery Accuracy**: Cross-agent context correctly retrieved > 95% of time
3. **System Reliability**: < 1% error rate across all agent interactions
4. **Data Consistency**: Intelligence persistence works across all user sessions

## Delivery Timeline

### Week 1: Foundation
- Database schema implementation
- Core service layer development
- Basic component structure

### Week 2: Agent Workflows  
- N8n workflow creation (8 workflows)
- AI integration and testing
- Discovery storage implementation

### Week 3: Frontend Integration
- AgentSelectionHub completion
- AgentWorkspace implementation  
- Cross-agent context display

### Week 4: Testing & Optimization
- End-to-end testing
- Performance optimization
- Bug fixes and refinements

### Week 5: Deployment & Validation
- Production deployment
- User journey validation
- Success criteria verification

## Post-Launch Optimization

### Analytics Tracking
- Agent usage patterns
- Discovery quality scoring
- User journey completion rates
- Cross-agent handoff success rates

### AI Model Optimization
- Agent response quality monitoring
- Discovery extraction accuracy
- Cross-agent context relevance
- Handoff recommendation precision

### User Experience Enhancement
- Interface optimization based on usage
- Agent-specific visualization improvements
- Performance optimization
- Mobile responsiveness enhancements

---

**This PRD provides complete specifications for implementing the Interactive Agent Intelligence System. The developer should have all technical details needed to build a fully operational system where 8 specialized AI agents collaborate to provide comprehensive business transformation guidance.**