'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface AgentConfig {
  id: string
  title: string
  description: string
  longDescription: string
  icon: string
  color: string
  expertise: string[]
  whenToUse: string
  expectedOutcome: string
  estimatedTime: string
  sophisticationLevel: 'beginner' | 'intermediate' | 'advanced' | 'all'
  status?: 'not_started' | 'visited' | 'in_progress' | 'completed'
}

export default function AgentsPage() {
  const router = useRouter()
  const [businessProfile, setBusinessProfile] = useState<any>(null)
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const savedProfile = localStorage.getItem('businessProfile')
    if (savedProfile) {
      setBusinessProfile(JSON.parse(savedProfile))
    }
  }, [])

  const agentConfigs: AgentConfig[] = [
    {
      id: 'master-conductor',
      title: 'Master Conductor',
      description: 'Routes you to the right specialist and orchestrates your business transformation',
      longDescription: 'The Master Conductor analyzes your business holistically and routes you to the most impactful agents in the optimal sequence. Think of it as your strategic advisor.',
      icon: '🎭',
      color: 'from-purple-500 to-pink-500',
      expertise: ['Strategic Planning', 'Agent Routing', 'Holistic Analysis'],
      whenToUse: 'When you need strategic direction or want optimal agent sequencing',
      expectedOutcome: 'Complete transformation roadmap with prioritized action items',
      estimatedTime: '10-15 minutes',
      sophisticationLevel: 'all',
      status: 'not_started'
    },
    {
      id: 'constraint-analyzer',
      title: 'Constraint Analyzer',
      description: 'Identify your biggest business bottleneck using the 4 Universal Constraints',
      longDescription: 'Uses Alex Hormozi\'s proven framework to diagnose whether your constraint is in Leads, Sales, Delivery, or Profit. Essential for focused growth.',
      icon: '🔍',
      color: 'from-red-500 to-orange-500',
      expertise: ['Bottleneck Detection', 'Growth Diagnostics', 'Resource Analysis'],
      whenToUse: 'Start here if you\'re unsure what\'s holding your business back',
      expectedOutcome: 'Clear identification of your #1 constraint with action plan',
      estimatedTime: '5-10 minutes',
      sophisticationLevel: 'all',
      status: 'not_started'
    },
    {
      id: 'offer-analyzer',
      title: 'Offer Analyzer',
      description: 'Transform your offers using the Grand Slam Offer framework',
      longDescription: 'Analyzes and optimizes your value proposition using Alex\'s Grand Slam Offer methodology. Focuses on creating irresistible offers.',
      icon: '💎',
      color: 'from-blue-500 to-cyan-500',
      expertise: ['Value Proposition', 'Offer Construction', 'Pricing Strategy'],
      whenToUse: 'When your constraint is in sales conversion or offer optimization',
      expectedOutcome: 'Irresistible offer design with improved conversion rates',
      estimatedTime: '15-20 minutes',
      sophisticationLevel: 'beginner',
      status: 'not_started'
    },
    {
      id: 'financial-calculator',
      title: 'Financial Calculator',
      description: 'CFA analysis, unit economics, and revenue projections',
      longDescription: 'Performs Customer Fund Acquisition analysis, calculates unit economics, and provides detailed financial projections using Alex\'s frameworks.',
      icon: '📊',
      color: 'from-green-500 to-teal-500',
      expertise: ['Unit Economics', 'CFA Analysis', 'Financial Modeling'],
      whenToUse: 'When you need data-driven insights or financial validation',
      expectedOutcome: 'Complete financial analysis with growth projections',
      estimatedTime: '20-25 minutes',
      sophisticationLevel: 'intermediate',
      status: 'not_started'
    },
    {
      id: 'money-model-architect',
      title: 'Money Model Architect',
      description: '4-Prong revenue optimization and business model design',
      longDescription: 'Designs and optimizes your revenue architecture using Alex\'s 4-Prong approach: increase customers, increase purchase frequency, increase ticket price, decrease costs.',
      icon: '💰',
      color: 'from-yellow-500 to-orange-500',
      expertise: ['Revenue Architecture', '4-Prong Framework', 'Business Model'],
      whenToUse: 'When optimizing revenue streams or designing business models',
      expectedOutcome: 'Optimized revenue architecture with specific improvement tactics',
      estimatedTime: '15-25 minutes',
      sophisticationLevel: 'intermediate',
      status: 'not_started'
    },
    {
      id: 'psychology-optimizer',
      title: 'Psychology Optimizer',
      description: '5 Upsell Moments and conversion psychology optimization',
      longDescription: 'Applies behavioral psychology and Alex\'s 5 Upsell Moments to maximize customer value and conversion rates throughout your funnel.',
      icon: '🧠',
      color: 'from-indigo-500 to-purple-500',
      expertise: ['Behavioral Psychology', 'Conversion Optimization', 'Upsell Strategy'],
      whenToUse: 'When optimizing conversion rates or customer lifetime value',
      expectedOutcome: 'Psychology-driven conversion optimization with upsell strategy',
      estimatedTime: '15-20 minutes',
      sophisticationLevel: 'advanced',
      status: 'not_started'
    },
    {
      id: 'implementation-planner',
      title: 'Implementation Planner',
      description: 'Action plans, execution roadmaps, and systematic implementation',
      longDescription: 'Creates detailed implementation roadmaps based on insights from other agents. Focuses on execution, timelines, and systematic rollout.',
      icon: '✅',
      color: 'from-emerald-500 to-green-500',
      expertise: ['Project Management', 'Implementation Strategy', 'Timeline Planning'],
      whenToUse: 'After analysis phases to create executable action plans',
      expectedOutcome: 'Detailed implementation roadmap with timelines and milestones',
      estimatedTime: '10-15 minutes',
      sophisticationLevel: 'all',
      status: 'not_started'
    },
    {
      id: 'coaching-methodology',
      title: 'Coaching Methodology',
      description: 'Complete Alex Hormozi frameworks and systematic approaches',
      longDescription: 'Comprehensive coaching using all of Alex\'s methodologies. Best for holistic business transformation and advanced strategy.',
      icon: '🎓',
      color: 'from-violet-500 to-indigo-500',
      expertise: ['Holistic Coaching', 'Framework Integration', 'Strategic Guidance'],
      whenToUse: 'For comprehensive business coaching and framework mastery',
      expectedOutcome: 'Complete business transformation using integrated frameworks',
      estimatedTime: '25-30 minutes',
      sophisticationLevel: 'advanced',
      status: 'not_started'
    }
  ]

  const getRecommendedAgents = () => {
    if (!businessProfile) return agentConfigs.slice(0, 3)

    const { sophisticationScore, primaryChallenge } = businessProfile
    
    let recommended = [...agentConfigs]
    
    // Filter by sophistication if beginner
    if (sophisticationScore <= 3) {
      recommended = recommended.filter(agent => 
        agent.sophisticationLevel === 'beginner' || agent.sophisticationLevel === 'all'
      )
    }

    // Prioritize based on challenge
    if (primaryChallenge) {
      const challengeMapping: Record<string, string[]> = {
        'leads': ['constraint-analyzer', 'money-model-architect'],
        'sales': ['offer-analyzer', 'psychology-optimizer'],
        'delivery': ['implementation-planner', 'coaching-methodology'],
        'profit': ['financial-calculator', 'money-model-architect'],
        'unsure': ['constraint-analyzer', 'master-conductor']
      }

      const priorityAgents = challengeMapping[primaryChallenge] || []
      recommended.sort((a, b) => {
        const aIndex = priorityAgents.indexOf(a.id)
        const bIndex = priorityAgents.indexOf(b.id)
        if (aIndex === -1 && bIndex === -1) return 0
        if (aIndex === -1) return 1
        if (bIndex === -1) return -1
        return aIndex - bIndex
      })
    }

    return recommended
  }

  const handleAgentSelect = (agentId: string) => {
    // Store selected agent context
    localStorage.setItem('selectedAgent', agentId)
    router.push(`/agents/${agentId}`)
  }

  const recommendedAgents = getRecommendedAgents()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-8">
          <Link href="/" className="text-gray-400 hover:text-white text-sm mb-4 inline-block">
            ← Back to Home
          </Link>
          <div className="text-5xl mb-4">🎭</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            AI Coaching Orchestra
          </h1>
          <p className="text-lg text-gray-300 mb-6">
            8 specialized agents trained on Alex Hormozi's frameworks from 1,260+ business consultations
          </p>

          {businessProfile && (
            <div className="bg-white/5 backdrop-blur-lg rounded-lg p-4 border border-white/10 mb-6">
              <p className="text-purple-300">
                Welcome back! Based on your profile, we recommend starting with {' '}
                <span className="font-semibold">{recommendedAgents[0]?.title}</span>
              </p>
            </div>
          )}
        </div>

        {/* Quick Start Recommendations */}
        {businessProfile && (
          <div className="max-w-6xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              🎯 Recommended for You
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {recommendedAgents.slice(0, 3).map((agent) => (
                <div
                  key={agent.id}
                  className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-purple-400/50 transition-all cursor-pointer group"
                  onClick={() => handleAgentSelect(agent.id)}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">{agent.icon}</div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300">
                      {agent.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">{agent.description}</p>
                    <div className="text-xs text-purple-400">
                      {agent.estimatedTime} • {agent.sophisticationLevel}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Agents Grid */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            🏢 All Specialist Agents
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {agentConfigs.map((agent) => (
              <div
                key={agent.id}
                className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:scale-105 hover:border-purple-400/50 transition-all cursor-pointer group"
                onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
              >
                <div className="text-center">
                  <div className="text-3xl mb-3">{agent.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300">
                    {agent.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">{agent.description}</p>
                  
                  <div className="text-xs text-purple-400 mb-3">
                    {agent.estimatedTime}
                  </div>

                  {selectedAgent === agent.id && (
                    <div className="mt-4 text-left">
                      <p className="text-xs text-gray-300 mb-3">{agent.longDescription}</p>
                      <div className="mb-3">
                        <div className="text-xs font-semibold text-white mb-1">Expertise:</div>
                        <div className="text-xs text-gray-400">
                          {agent.expertise.join(' • ')}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAgentSelect(agent.id)
                        }}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all"
                      >
                        Start Session
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="max-w-4xl mx-auto mt-12 text-center">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-2">
              Not sure where to start?
            </h3>
            <p className="text-gray-300 mb-4">
              Let the Master Conductor analyze your business and route you to the optimal agent sequence
            </p>
            <button
              onClick={() => handleAgentSelect('master-conductor')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-lg transition-all"
            >
              🎭 Start with Master Conductor
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}