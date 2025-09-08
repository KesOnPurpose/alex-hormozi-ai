'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Message {
  id: string
  type: 'user' | 'agent'
  content: string
  timestamp: Date
  discoveries?: any[]
  suggestions?: any[]
}

interface AgentConfig {
  id: string
  title: string
  description: string
  icon: string
  color: string
  systemPrompt: string
  welcomeMessage: string
  capabilities: string[]
  sampleQuestions: string[]
}

export default function AgentWorkspacePage() {
  const params = useParams()
  const router = useRouter()
  const agentType = params.agentType as string

  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [businessProfile, setBusinessProfile] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const agentConfigs: Record<string, AgentConfig> = {
    'constraint-analyzer': {
      id: 'constraint-analyzer',
      title: 'Constraint Analyzer',
      description: 'Identify your biggest business bottleneck using the 4 Universal Constraints',
      icon: '🔍',
      color: 'from-red-500 to-orange-500',
      systemPrompt: 'You are the Constraint Analyzer, specializing in identifying business bottlenecks using Alex Hormozi\'s 4 Universal Constraints framework.',
      welcomeMessage: 'Hi! I\'m your Constraint Analyzer. I\'ll help identify what\'s really holding your business back using Alex Hormozi\'s proven framework. The 4 constraints are: Leads, Sales, Delivery, and Profit. Let\'s figure out which one is your biggest bottleneck.',
      capabilities: ['Bottleneck Detection', '4 Universal Constraints Analysis', 'Growth Diagnostics'],
      sampleQuestions: [
        'What\'s holding my business back?',
        'How do I identify my primary constraint?',
        'Walk me through the 4 Universal Constraints',
        'Analyze my business bottlenecks'
      ]
    },
    'money-model-architect': {
      id: 'money-model-architect',
      title: 'Money Model Architect',
      description: 'Design and optimize your revenue architecture using the 4-Prong approach',
      icon: '💰',
      color: 'from-yellow-500 to-orange-500',
      systemPrompt: 'You are the Money Model Architect, specializing in revenue optimization using Alex Hormozi\'s 4-Prong framework.',
      welcomeMessage: 'Welcome! I\'m your Money Model Architect. I\'ll help you design and optimize your revenue architecture using Alex\'s 4-Prong approach: Get more customers, increase purchase frequency, increase transaction size, and decrease costs.',
      capabilities: ['Revenue Architecture', '4-Prong Framework', 'Pricing Strategy'],
      sampleQuestions: [
        'How can I increase my revenue?',
        'What\'s the 4-Prong money model?',
        'Help me optimize my pricing',
        'Design a revenue strategy for my business'
      ]
    },
    'offer-analyzer': {
      id: 'offer-analyzer',
      title: 'Offer Analyzer',
      description: 'Transform your offers using the Grand Slam Offer framework',
      icon: '💎',
      color: 'from-blue-500 to-cyan-500',
      systemPrompt: 'You are the Offer Analyzer, specializing in creating irresistible offers using Alex Hormozi\'s Grand Slam Offer framework.',
      welcomeMessage: 'Hey there! I\'m your Offer Analyzer. I\'ll help you create Grand Slam Offers that are so good people feel stupid saying no. We\'ll work on your value proposition, pricing, guarantees, and more.',
      capabilities: ['Grand Slam Offers', 'Value Proposition Design', 'Conversion Optimization'],
      sampleQuestions: [
        'How do I create a Grand Slam Offer?',
        'Why aren\'t people buying my offers?',
        'Help me improve my value proposition',
        'What makes an offer irresistible?'
      ]
    },
    'financial-calculator': {
      id: 'financial-calculator',
      title: 'Financial Calculator',
      description: 'CFA analysis, unit economics, and financial projections',
      icon: '📊',
      color: 'from-green-500 to-teal-500',
      systemPrompt: 'You are the Financial Calculator, specializing in CFA analysis, unit economics, and financial modeling using Alex Hormozi\'s frameworks.',
      welcomeMessage: 'Hello! I\'m your Financial Calculator. I\'ll help you understand your unit economics, perform CFA analysis, and create financial projections. Let\'s make sure your numbers actually work.',
      capabilities: ['Unit Economics', 'CFA Analysis', 'Financial Modeling'],
      sampleQuestions: [
        'Calculate my unit economics',
        'What is CFA analysis?',
        'Are my business metrics healthy?',
        'Project my financial growth'
      ]
    },
    'psychology-optimizer': {
      id: 'psychology-optimizer',
      title: 'Psychology Optimizer',
      description: '5 Upsell Moments and conversion psychology optimization',
      icon: '🧠',
      color: 'from-indigo-500 to-purple-500',
      systemPrompt: 'You are the Psychology Optimizer, specializing in behavioral psychology and Alex Hormozi\'s 5 Upsell Moments to maximize conversions.',
      welcomeMessage: 'Hi! I\'m your Psychology Optimizer. I\'ll help you understand customer psychology and optimize your conversion rates using behavioral principles and Alex\'s 5 Upsell Moments.',
      capabilities: ['Behavioral Psychology', 'Conversion Optimization', '5 Upsell Moments'],
      sampleQuestions: [
        'How can I increase my conversion rates?',
        'What are the 5 Upsell Moments?',
        'Why aren\'t customers buying?',
        'Optimize my sales psychology'
      ]
    },
    'implementation-planner': {
      id: 'implementation-planner',
      title: 'Implementation Planner',
      description: 'Action plans, execution roadmaps, and systematic implementation',
      icon: '✅',
      color: 'from-emerald-500 to-green-500',
      systemPrompt: 'You are the Implementation Planner, specializing in creating actionable roadmaps and systematic execution plans.',
      welcomeMessage: 'Welcome! I\'m your Implementation Planner. I\'ll help you turn insights into action with detailed roadmaps, timelines, and systematic execution plans. Let\'s get stuff done.',
      capabilities: ['Action Planning', 'Implementation Strategy', 'Timeline Creation'],
      sampleQuestions: [
        'Create an action plan for my business',
        'How do I implement these strategies?',
        'Build me a growth roadmap',
        'What should I focus on first?'
      ]
    },
    'coaching-methodology': {
      id: 'coaching-methodology',
      title: 'Coaching Methodology',
      description: 'Complete Alex Hormozi frameworks and systematic approaches',
      icon: '🎓',
      color: 'from-violet-500 to-indigo-500',
      systemPrompt: 'You are the Coaching Methodology expert, providing comprehensive business coaching using all of Alex Hormozi\'s integrated frameworks.',
      welcomeMessage: 'Hello! I\'m your Coaching Methodology expert. I provide comprehensive business coaching using Alex\'s complete framework suite. Let\'s transform your business systematically.',
      capabilities: ['Holistic Coaching', 'Framework Integration', 'Strategic Guidance'],
      sampleQuestions: [
        'Give me comprehensive business coaching',
        'How do all the frameworks work together?',
        'Coach me through business growth',
        'What\'s Alex\'s complete methodology?'
      ]
    },
    'master-conductor': {
      id: 'master-conductor',
      title: 'Master Conductor',
      description: 'Strategic orchestration and agent routing for optimal business transformation',
      icon: '🎭',
      color: 'from-purple-500 to-pink-500',
      systemPrompt: 'You are the Master Conductor, orchestrating the optimal sequence of specialist agents and providing strategic direction.',
      welcomeMessage: 'Greetings! I\'m your Master Conductor. I analyze your business holistically and guide you to the right specialist agents in the optimal sequence. Think of me as your strategic advisor.',
      capabilities: ['Strategic Planning', 'Agent Orchestration', 'Holistic Analysis'],
      sampleQuestions: [
        'What should I focus on first?',
        'Which agent should I work with?',
        'Create a transformation roadmap',
        'Analyze my business holistically'
      ]
    }
  }

  const currentAgent = agentConfigs[agentType]

  useEffect(() => {
    // Load business profile
    const savedProfile = localStorage.getItem('businessProfile')
    if (savedProfile) {
      setBusinessProfile(JSON.parse(savedProfile))
    }

    // Initialize with welcome message
    if (currentAgent) {
      setMessages([
        {
          id: '1',
          type: 'agent',
          content: currentAgent.welcomeMessage,
          timestamp: new Date()
        }
      ])
    }
  }, [agentType])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate AI response (in production, this would call your API)
    setTimeout(() => {
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: generateMockResponse(inputMessage, currentAgent),
        timestamp: new Date(),
        discoveries: generateMockDiscoveries(inputMessage),
        suggestions: generateMockSuggestions(currentAgent.id)
      }

      setMessages(prev => [...prev, agentResponse])
      setIsTyping(false)
    }, 2000)
  }

  const generateMockResponse = (input: string, agent: AgentConfig): string => {
    const responses = {
      'constraint-analyzer': `Great question! Based on your input about "${input}", let me analyze this through the lens of the 4 Universal Constraints. 

Every business has exactly 4 ways it can grow: 
1️⃣ Get more leads (Lead generation)
2️⃣ Convert more leads to sales (Sales conversion) 
3️⃣ Deliver better/faster (Delivery optimization)
4️⃣ Make more profit per customer (Profit optimization)

From what you're telling me, it sounds like your primary constraint might be in the sales conversion area. Here's why...`,

      'money-model-architect': `Excellent! Let's design your money model using Alex's 4-Prong approach. For your situation with "${input}", here's how we can optimize your revenue architecture:

🎯 **4-Prong Revenue Optimization:**
1. **Get More Customers**: Increase lead flow and conversion
2. **Increase Purchase Frequency**: Get customers to buy more often  
3. **Increase Transaction Size**: Bigger purchases per transaction
4. **Decrease Costs**: Optimize your cost structure

Based on your input, I recommend focusing on prongs 2 and 3 first...`,

      'offer-analyzer': `Perfect! Let's create a Grand Slam Offer for your situation. When you mentioned "${input}", it tells me we need to focus on making your offer so good people feel stupid saying no.

🏆 **Grand Slam Offer Framework:**
- **Problem/Dream**: What pain are you solving?
- **Value**: What's the perceived value vs price?
- **Scarcity**: Why should they act now?
- **Urgency**: Time-sensitive reasons to buy
- **Guarantee**: Risk reversal that makes it no-brainer

Let me help you optimize each component...`,

      default: `Thanks for your question about "${input}". As your ${agent.title}, I'm here to help you with ${agent.capabilities.join(', ')}. Let me break this down for you using Alex Hormozi's proven frameworks...`
    }

    return responses[agent.id as keyof typeof responses] || responses.default
  }

  const generateMockDiscoveries = (input: string) => {
    return [
      {
        type: 'insight',
        title: 'Primary Constraint Identified',
        description: 'Sales conversion appears to be the main bottleneck',
        confidence: 85
      },
      {
        type: 'opportunity',
        title: 'Revenue Optimization Potential',
        description: '$2,400/month additional revenue possible',
        confidence: 78
      }
    ]
  }

  const generateMockSuggestions = (agentId: string) => {
    const suggestions = {
      'constraint-analyzer': [
        { agent: 'offer-analyzer', reason: 'Optimize offers to improve sales conversion' },
        { agent: 'psychology-optimizer', reason: 'Apply behavioral psychology to increase conversions' }
      ],
      'money-model-architect': [
        { agent: 'financial-calculator', reason: 'Validate the financial projections' },
        { agent: 'implementation-planner', reason: 'Create execution roadmap' }
      ],
      default: [
        { agent: 'master-conductor', reason: 'Get strategic direction for next steps' }
      ]
    }

    return suggestions[agentId as keyof typeof suggestions] || suggestions.default
  }

  if (!currentAgent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Agent Not Found</h1>
          <Link href="/agents" className="text-purple-400 hover:text-purple-300 underline">
            ← Back to Agent Selection
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-white/5 backdrop-blur-lg border-r border-white/10`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Agent Context</h2>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-400 hover:text-white"
              >
                ←
              </button>
            </div>

            {businessProfile && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-white mb-2">Your Profile</h3>
                <div className="text-xs text-gray-400 space-y-1">
                  <div>Stage: {businessProfile.businessStage}</div>
                  <div>Revenue: {businessProfile.monthlyRevenue}</div>
                  <div>Challenge: {businessProfile.primaryChallenge}</div>
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-white mb-2">Capabilities</h3>
              <div className="space-y-1">
                {currentAgent.capabilities.map((cap, index) => (
                  <div key={index} className="text-xs text-gray-400">• {cap}</div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-2">Sample Questions</h3>
              <div className="space-y-2">
                {currentAgent.sampleQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(question)}
                    className="w-full text-left text-xs text-purple-400 hover:text-purple-300 p-2 rounded bg-white/5 hover:bg-white/10 transition-all"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white/5 backdrop-blur-lg border-b border-white/10 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {!sidebarOpen && (
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="text-gray-400 hover:text-white mr-4"
                  >
                    →
                  </button>
                )}
                <div className="text-3xl mr-4">{currentAgent.icon}</div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{currentAgent.title}</h1>
                  <p className="text-gray-300">{currentAgent.description}</p>
                </div>
              </div>
              <Link href="/agents" className="text-gray-400 hover:text-white text-sm">
                ← All Agents
              </Link>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3xl p-4 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 text-gray-200'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  
                  {message.discoveries && message.discoveries.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <div className="text-sm font-semibold mb-2">💡 Key Insights</div>
                      {message.discoveries.map((discovery, index) => (
                        <div key={index} className="text-xs bg-white/10 rounded p-2 mb-2">
                          <div className="font-semibold">{discovery.title}</div>
                          <div className="opacity-80">{discovery.description}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <div className="text-sm font-semibold mb-2">🎯 Recommended Next</div>
                      {message.suggestions.map((suggestion, index) => (
                        <Link key={index} href={`/agents/${suggestion.agent}`}>
                          <div className="text-xs bg-purple-600/30 hover:bg-purple-600/50 rounded p-2 mb-2 cursor-pointer transition-all">
                            <div className="font-semibold capitalize">{suggestion.agent.replace('-', ' ')}</div>
                            <div className="opacity-80">{suggestion.reason}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-gray-200 p-4 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm">Agent is analyzing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="bg-white/5 backdrop-blur-lg border-t border-white/10 p-6">
            <div className="flex space-x-4">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={`Ask ${currentAgent.title} anything...`}
                className="flex-1 p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}