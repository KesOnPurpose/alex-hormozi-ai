'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { MainConductor, CoachingSession, CoachingResponse, BusinessContext } from '@/lib/agents/main-conductor';
import { MessageRenderer } from '@/components/chat/MessageRenderer';
import { ActionItemsList } from '@/components/chat/ActionItemCard';
import { IntelligentAgentRouter, QueryAnalysis, RoutingDecision } from '@/lib/agents/IntelligentAgentRouter';
import { AgentMemorySystem, ConversationTurn } from '@/lib/agents/AgentMemory';
import { AgentCollaborationViz } from '@/components/agents/AgentCollaborationViz';
import { AgentReasoningDisplay } from '@/components/agents/AgentReasoningDisplay';
import { AgentAnalytics } from '@/components/agents/AgentAnalytics';
import { Brain, Settings, BarChart, Eye, EyeOff } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  analysis?: CoachingResponse;
  agent?: string;
  constraint?: {
    primary: string;
    evidence: string;
    nextConstraint: string;
  };
  routingDecision?: RoutingDecision;
  queryAnalysis?: QueryAnalysis;
  executionTime?: number;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [businessContext, setBusinessContext] = useState<BusinessContext>({
    businessStage: 'startup'
  });
  const [sessionType, setSessionType] = useState<'diagnostic' | 'strategic' | 'implementation'>('diagnostic');
  const [showContextForm, setShowContextForm] = useState(true);
  
  // Agent Intelligence State
  const [showAgentDetails, setShowAgentDetails] = useState(false);
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [activeCollaboration, setActiveCollaboration] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conductor = useRef<MainConductor>(new MainConductor());
  const router = useRef<IntelligentAgentRouter>(new IntelligentAgentRouter());
  const memory = useRef<AgentMemorySystem>(new AgentMemorySystem());
  const sessionId = useRef<string>(Date.now().toString());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const startTime = Date.now();
    const query = input.trim();
    setCurrentQuery(query);

    const userMessage: Message = {
      id: Date.now().toString(),
      content: query,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Show collaboration visualization for complex queries
    const quickAnalysis = router.current.analyzeQuery(query, businessContext);
    if (quickAnalysis.complexity === 'complex' || quickAnalysis.complexity === 'strategic') {
      setActiveCollaboration(true);
      setShowCollaboration(true);
    }

    try {
      // Get routing decision
      const routingDecision = router.current.routeQuery(query, businessContext, sessionType);
      
      // Get contextual recommendations from memory
      const contextualRecs = memory.current.getContextualRecommendations(
        sessionId.current, 
        query, 
        'demo-user'
      );

      const session: CoachingSession = {
        userId: 'demo-user',
        businessContext,
        query: query,
        sessionType
      };

      // Enhanced agent routing based on query content
      let targetAgent = 'master-conductor';
      
      // Implementation Planner triggers
      if (query.toLowerCase().includes('implementation plan') || 
          query.toLowerCase().includes('90-day') || 
          query.toLowerCase().includes('roadmap') ||
          query.toLowerCase().includes('step-by-step') ||
          query.toLowerCase().includes('timeline')) {
        targetAgent = 'implementation-planner';
      }
      // Constraint Analyzer triggers  
      else if (query.toLowerCase().includes('constraint') || 
               query.toLowerCase().includes('bottleneck') ||
               query.toLowerCase().includes('limiting') ||
               query.toLowerCase().includes('stuck') ||
               query.toLowerCase().includes('plateau')) {
        targetAgent = 'constraint-analyzer';
      }
      // Offer Analyzer triggers
      else if (query.toLowerCase().includes('offer') ||
               query.toLowerCase().includes('grand slam') ||
               query.toLowerCase().includes('value equation') ||
               query.toLowerCase().includes('conversion') && query.toLowerCase().includes('rate')) {
        targetAgent = 'offer-analyzer';
      }
      // Financial Calculator triggers
      else if (query.toLowerCase().includes('cac') ||
               query.toLowerCase().includes('ltv') ||
               query.toLowerCase().includes('client financed') ||
               query.toLowerCase().includes('advertising level') ||
               query.toLowerCase().includes('roi')) {
        targetAgent = 'financial-calculator';
      }
      // Money Model Architect triggers
      else if (query.toLowerCase().includes('money model') ||
               query.toLowerCase().includes('4-prong') ||
               query.toLowerCase().includes('revenue stream') ||
               query.toLowerCase().includes('upsell') && query.toLowerCase().includes('downsell')) {
        targetAgent = 'money-model-architect';
      }
      // Psychology Optimizer triggers
      else if (query.toLowerCase().includes('psychology') ||
               query.toLowerCase().includes('upsell moment') ||
               query.toLowerCase().includes('completion rate') ||
               query.toLowerCase().includes('objection')) {
        targetAgent = 'psychology-optimizer';
      }
      // Coaching Methodology triggers
      else if (query.toLowerCase().includes('coach') ||
               query.toLowerCase().includes('systematic') ||
               query.toLowerCase().includes('framework') ||
               query.toLowerCase().includes('methodology')) {
        targetAgent = 'coaching-methodology';
      }
      
      const apiResponse = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...session,
          agent: targetAgent
        })
      });
      
      const response = await apiResponse.json();
      const executionTime = Date.now() - startTime;
      
      // Extract constraint analysis from agent responses
      const constraintAnalysis = response.analysis?.find(a => a.agentType === 'constraint-analyzer');
      const coachingAnalysis = response.analysis?.find(a => a.agentType === 'coaching-methodology');
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.synthesis,
        sender: 'ai',
        timestamp: new Date(),
        analysis: response,
        agent: routingDecision.primary.agent,
        routingDecision,
        queryAnalysis: quickAnalysis,
        executionTime,
        constraint: constraintAnalysis ? {
          primary: constraintAnalysis.metrics?.primaryConstraint || 'Unknown',
          evidence: constraintAnalysis.findings?.[1] || 'Not provided',
          nextConstraint: constraintAnalysis.metrics?.expectedOutcomes || constraintAnalysis.findings?.[3] || 'Unknown'
        } : undefined
      };

      setMessages(prev => [...prev, aiMessage]);

      // Add to memory system
      const conversationTurn: ConversationTurn = {
        id: aiMessage.id,
        timestamp: aiMessage.timestamp,
        userQuery: query,
        agentResponse: response.synthesis,
        selectedAgent: routingDecision.primary.agent,
        queryAnalysis: quickAnalysis,
        success: true, // Assume success for now, could be enhanced with feedback
        executionTime,
        insights: response.analysis?.flatMap(a => a.findings || []) || [],
        followUpSuggestions: response.nextSteps || []
      };

      memory.current.addConversationTurn(sessionId.current, conversationTurn, 'demo-user');

      // Update agent performance
      router.current.updateAgentPerformance(
        routingDecision.primary.agent, 
        routingDecision.primary.confidence, 
        true
      );

    } catch (error) {
      console.error('Error getting response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setActiveCollaboration(false);
    }
  };

  const handleContextUpdate = () => {
    setShowContextForm(false);
    const welcomeMessage: Message = {
      id: 'welcome',
      content: `Welcome to Alex Hormozi AI Coaching! Based on your business context, I'm ready to help you optimize your ${businessContext.businessStage} business using proven frameworks. What would you like to analyze or improve today?`,
      sender: 'ai',
      timestamp: new Date(),
      agent: 'Main Conductor'
    };
    setMessages([welcomeMessage]);
  };

  if (showContextForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
            <h1 className="text-3xl font-bold text-white mb-6 text-center">
              Business Context Setup
            </h1>
            <p className="text-gray-300 mb-8 text-center">
              Help me understand your business so I can provide the most relevant coaching using Alex Hormozi's frameworks.
            </p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Business Stage
                </label>
                <select
                  value={businessContext.businessStage}
                  onChange={(e) => setBusinessContext(prev => ({ ...prev, businessStage: e.target.value as any }))}
                  className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300"
                >
                  <option value="startup">Startup (0-$100k revenue)</option>
                  <option value="growth">Growth ($100k-$1M revenue)</option>
                  <option value="scale">Scale ($1M-$10M revenue)</option>
                  <option value="mature">Mature ($10M+ revenue)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Industry (Optional)
                </label>
                <input
                  type="text"
                  value={businessContext.industry || ''}
                  onChange={(e) => setBusinessContext(prev => ({ ...prev, industry: e.target.value }))}
                  placeholder="e.g., Coaching, SaaS, E-commerce"
                  className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Monthly Revenue ($)
                  </label>
                  <input
                    type="number"
                    value={businessContext.currentRevenue || ''}
                    onChange={(e) => setBusinessContext(prev => ({ ...prev, currentRevenue: Number(e.target.value) }))}
                    placeholder="e.g., 50000"
                    className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Customer Count
                  </label>
                  <input
                    type="number"
                    value={businessContext.customerCount || ''}
                    onChange={(e) => setBusinessContext(prev => ({ ...prev, customerCount: Number(e.target.value) }))}
                    placeholder="e.g., 100"
                    className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    CAC ($)
                  </label>
                  <input
                    type="number"
                    value={businessContext.cac || ''}
                    onChange={(e) => setBusinessContext(prev => ({ ...prev, cac: Number(e.target.value) }))}
                    placeholder="Customer acquisition cost"
                    className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    LTV ($)
                  </label>
                  <input
                    type="number"
                    value={businessContext.ltv || ''}
                    onChange={(e) => setBusinessContext(prev => ({ ...prev, ltv: Number(e.target.value) }))}
                    placeholder="Lifetime value"
                    className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Gross Margin (%)
                  </label>
                  <input
                    type="number"
                    value={businessContext.grossMargin || ''}
                    onChange={(e) => setBusinessContext(prev => ({ ...prev, grossMargin: Number(e.target.value) }))}
                    placeholder="e.g., 80"
                    className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Session Type
                </label>
                <select
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value as any)}
                  className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white"
                >
                  <option value="diagnostic">Diagnostic - Identify Issues</option>
                  <option value="strategic">Strategic - Comprehensive Analysis</option>
                  <option value="implementation">Implementation - Action Planning</option>
                </select>
              </div>

              <button
                onClick={handleContextUpdate}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Start Coaching Session
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/20 bg-black/20 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-purple-400 hover:text-purple-300 mr-6">
                ← Back
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">Alex Hormozi AI Coach</h1>
                <p className="text-gray-300 text-sm">
                  {sessionType.charAt(0).toUpperCase() + sessionType.slice(1)} Session • {businessContext.businessStage} Stage
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Agent Intelligence Controls */}
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-2">
                <button
                  onClick={() => setShowAgentDetails(!showAgentDetails)}
                  className={`p-2 rounded-lg transition-all ${showAgentDetails ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/20'}`}
                  title="Toggle Agent Reasoning"
                >
                  {showAgentDetails ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                
                <button
                  onClick={() => setShowCollaboration(!showCollaboration)}
                  className={`p-2 rounded-lg transition-all ${showCollaboration ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/20'}`}
                  title="Toggle Collaboration View"
                >
                  <Brain className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  className={`p-2 rounded-lg transition-all ${showAnalytics ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/20'}`}
                  title="Toggle Analytics"
                >
                  <BarChart className="w-4 h-4" />
                </button>
              </div>
              
              <button
                onClick={() => setShowContextForm(true)}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all"
              >
                Update Context
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Intelligence Panels */}
      {(showCollaboration || showAgentDetails || showAnalytics) && (
        <div className="border-b border-white/10 bg-black/10 backdrop-blur-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="max-w-4xl mx-auto space-y-4">
              
              {/* Collaboration Visualization */}
              {showCollaboration && (
                <AgentCollaborationViz
                  query={currentQuery}
                  isActive={activeCollaboration}
                  onAnalysisComplete={(results) => {
                    console.log('Collaboration analysis complete:', results);
                  }}
                />
              )}
              
              {/* Agent Reasoning */}
              {showAgentDetails && messages.length > 0 && (
                (() => {
                  const lastAiMessage = messages.slice().reverse().find(m => m.sender === 'ai' && m.routingDecision && m.queryAnalysis);
                  return lastAiMessage && lastAiMessage.routingDecision && lastAiMessage.queryAnalysis ? (
                    <AgentReasoningDisplay
                      queryAnalysis={lastAiMessage.queryAnalysis}
                      primaryAgent={lastAiMessage.routingDecision.primary}
                      secondaryAgents={lastAiMessage.routingDecision.secondary}
                      collaborativeMode={lastAiMessage.routingDecision.collaborativeMode}
                      executionPlan={lastAiMessage.routingDecision.executionPlan}
                      reasoning={lastAiMessage.routingDecision.reasoning}
                    />
                  ) : (
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
                      <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                      <p className="text-white font-medium mb-2">Agent Intelligence Ready</p>
                      <p className="text-gray-400 text-sm">Send a message to see detailed agent reasoning and decision-making process.</p>
                    </div>
                  );
                })()
              )}
              
              {/* Agent Analytics */}
              {showAnalytics && (
                <AgentAnalytics isLive={true} />
              )}
              
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="container mx-auto px-4 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6 py-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-3xl p-6 rounded-xl ${
                    message.sender === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 backdrop-blur-lg border border-white/20 text-white'
                  }`}
                >
                  {message.agent && message.sender === 'ai' && (
                    <div className="text-xs text-purple-400 font-semibold mb-2 uppercase tracking-wide">
                      {message.agent}
                    </div>
                  )}
                  
                  <MessageRenderer 
                    content={message.content} 
                    sender={message.sender}
                  />
                  
                  {/* Constraint Analysis Display */}
                  {message.constraint && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-lg border border-red-400/30">
                      <h4 className="text-lg font-semibold text-red-300 mb-2 flex items-center">
                        🎯 Primary Business Constraint
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-300 uppercase tracking-wide mb-1">Current Bottleneck</div>
                          <div className="text-white font-medium capitalize">{message.constraint.primary}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-300 uppercase tracking-wide mb-1">Next Constraint</div>
                          <div className="text-white font-medium capitalize">{message.constraint.nextConstraint}</div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="text-sm text-gray-300 uppercase tracking-wide mb-1">Evidence</div>
                        <div className="text-gray-200 text-sm">{message.constraint.evidence}</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Analysis Results */}
                  {message.analysis && (
                    <div className="mt-6 space-y-4">
                      {/* Action Items */}
                      {message.analysis.actionItems.length > 0 && (
                        <ActionItemsList 
                          actionItems={message.analysis.actionItems.slice(0, 5).map(item => ({
                            title: item.title,
                            description: item.description || 'Implementation details will be provided.',
                            priority: item.priority,
                            timeline: item.timeline,
                            frameworks: item.frameworks || []
                          }))}
                        />
                      )}

                      {/* Next Steps */}
                      {message.analysis.nextSteps.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-green-300 mb-3">✅ Next Steps</h4>
                          <ol className="list-decimal list-inside space-y-1 text-sm">
                            {message.analysis.nextSteps.map((step, index) => (
                              <li key={index} className="text-gray-200">{step}</li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {/* Frameworks */}
                      {message.analysis.frameworks.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-blue-300 mb-3">📚 Applied Frameworks</h4>
                          <div className="flex flex-wrap gap-2">
                            {message.analysis.frameworks.map((framework, index) => (
                              <span key={index} className="bg-blue-500/20 text-blue-200 px-3 py-1 rounded-full text-sm">
                                {framework}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Agent Insights */}
                      {message.analysis.analysis && message.analysis.analysis.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-indigo-300 mb-3">🤖 Agent Insights</h4>
                          <div className="space-y-3">
                            {message.analysis.analysis.map((agent, index) => (
                              <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-500/20 text-indigo-300 font-medium">
                                    {agent.agentType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                  </span>
                                  <span className="text-xs text-gray-400">Confidence: {Math.round(agent.confidence * 100)}%</span>
                                </div>
                                <div className="text-sm text-gray-300 space-y-1">
                                  {agent.findings?.slice(0, 2).map((finding, fIndex) => (
                                    <div key={fIndex} className="flex items-start gap-2">
                                      <span className="text-indigo-400 mt-1">•</span>
                                      <span>{finding}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="text-xs text-gray-400 mt-3">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-xl max-w-md">
                  <div className="flex items-start space-x-3">
                    <div className="animate-spin h-5 w-5 border-2 border-purple-400 border-t-transparent rounded-full mt-1 flex-shrink-0"></div>
                    <div className="space-y-2">
                      <div className="text-white font-medium">
                        {(() => {
                          const query = currentQuery.toLowerCase();
                          if (query.includes('implementation') || query.includes('90-day') || query.includes('roadmap')) {
                            return '📋 Implementation Planner working...';
                          } else if (query.includes('constraint') || query.includes('stuck') || query.includes('plateau')) {
                            return '🎯 Constraint Analyzer investigating...';
                          } else if (query.includes('offer') || query.includes('grand slam')) {
                            return '💎 Offer Analyzer optimizing...';
                          } else if (query.includes('cac') || query.includes('ltv') || query.includes('client financed')) {
                            return '📊 Financial Calculator computing...';
                          } else if (query.includes('money model') || query.includes('4-prong')) {
                            return '🏗️ Money Model Architect designing...';
                          } else if (query.includes('psychology') || query.includes('upsell moment')) {
                            return '🧠 Psychology Optimizer analyzing...';
                          } else if (query.includes('coach') || query.includes('systematic')) {
                            return '🎓 Coaching Methodology applying...';
                          } else {
                            return '🎯 Master Conductor orchestrating...';
                          }
                        })()}
                      </div>
                      <div className="text-gray-300 text-sm space-y-1">
                        <div>• Analyzing business context</div>
                        <div>• Applying Alex Hormozi frameworks</div>
                        <div>• Generating strategic recommendations</div>
                        <div className="text-xs text-gray-400 mt-2">
                          This may take 30-40 seconds for comprehensive analysis
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/20 backdrop-blur-lg border-t border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about your offers, money models, CFA, or any business challenge..."
                className="flex-1 p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none"
              >
                Send
              </button>
            </div>
            
            {/* Quick Questions */}
            <div className="mt-3">
              <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Quick Start Questions</div>
              <div className="flex flex-wrap gap-2">
              {[
                "What's my biggest business constraint right now?",
                "How can I achieve Client Financed Acquisition?",
                "Analyze my current offers using the Grand Slam framework",
                "What's my 4-prong money model optimization potential?",
                "When should I upsell my customers for best results?"
              ].map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInput(question)}
                  className="bg-white/10 hover:bg-white/20 text-gray-300 px-3 py-1 rounded-full text-sm transition-all"
                >
                  {question}
                </button>
              ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickPrompt({ text, onClick }: {
  text: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white/10 hover:bg-white/20 text-white text-sm px-3 py-1 rounded-full border border-white/20 transition-colors"
    >
      {text}
    </button>
  )
}