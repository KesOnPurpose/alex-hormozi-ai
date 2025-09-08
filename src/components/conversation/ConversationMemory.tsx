import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Conversation, BusinessProfile } from '@/lib/supabase/types'
import { supabase } from '@/lib/supabase/client'
import { getCachedAIResponse, cacheAIResponse } from '@/services/aiResponseCache'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Clock,
  Archive,
  Lightbulb,
  Target,
  TrendingUp
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  agent_type?: string
  insights?: any[]
  recommendations?: any[]
}

interface ConversationMemoryProps {
  businessProfile?: BusinessProfile
  workspace?: string
  onInsightsGenerated?: (insights: any[]) => void
}

export function ConversationMemory({ 
  businessProfile, 
  workspace = 'general',
  onInsightsGenerated 
}: ConversationMemoryProps) {
  const { user, userProfile } = useAuth()
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<Conversation[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load conversation history on mount
  useEffect(() => {
    if (user) {
      loadConversationHistory()
      createOrLoadConversation()
    }
  }, [user, businessProfile, workspace])

  const loadConversationHistory = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_archived', false)
        .order('last_message_at', { ascending: false })
        .limit(10)

      if (!error && data) {
        setConversationHistory(data)
      }
    } catch (error) {
      console.error('Error loading conversation history:', error)
    }
  }

  const createOrLoadConversation = async () => {
    if (!user) return

    try {
      // Try to load existing active conversation for this workspace
      const { data: existingConversation, error: loadError } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .eq('business_id', businessProfile?.id || null)
        .eq('workspace', workspace)
        .eq('is_archived', false)
        .order('last_message_at', { ascending: false })
        .limit(1)
        .single()

      if (existingConversation && !loadError) {
        setConversation(existingConversation)
        setMessages(existingConversation.messages as Message[] || [])
        return
      }

      // Create new conversation
      const newConversation = {
        user_id: user.id,
        business_id: businessProfile?.id || null,
        session_title: `${workspace.charAt(0).toUpperCase() + workspace.slice(1)} Session`,
        session_type: 'general',
        workspace,
        messages: [],
        message_count: 0,
        conversation_context: {
          user_level: userProfile?.business_level || 'beginner',
          business_context: businessProfile ? {
            name: businessProfile.business_name,
            revenue: businessProfile.monthly_revenue,
            constraint: businessProfile.primary_constraint,
            industry: businessProfile.industry
          } : null,
          workspace
        },
        agent_memory: {},
        learned_preferences: userProfile?.preferences || {},
        insights_generated: [],
        action_items: [],
        recommendations: [],
        frameworks_applied: []
      }

      const { data, error } = await supabase
        .from('conversations')
        .insert(newConversation)
        .select()
        .single()

      if (!error && data) {
        setConversation(data)
        setMessages([])
      }
    } catch (error) {
      console.error('Error creating/loading conversation:', error)
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || !conversation || !user) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString()
    }

    // Optimistically add user message
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Here you would integrate with your AI agents
      // For now, we'll simulate an AI response based on the workspace and user level
      const aiResponse = await generateAIResponse(userMessage, conversation)
      
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: aiResponse.content,
        timestamp: new Date().toISOString(),
        agent_type: aiResponse.agent_type,
        insights: aiResponse.insights,
        recommendations: aiResponse.recommendations
      }

      const updatedMessages = [...messages, userMessage, assistantMessage]
      setMessages(updatedMessages)

      // Update conversation in database
      await updateConversation(updatedMessages, aiResponse)

      // Trigger insights callback if provided
      if (aiResponse.insights?.length > 0 && onInsightsGenerated) {
        onInsightsGenerated(aiResponse.insights)
      }

    } catch (error) {
      console.error('Error sending message:', error)
      // Add error message
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const generateAIResponse = async (userMessage: Message, conv: Conversation) => {
    const userLevel = userProfile?.business_level || 'beginner'
    const businessContext = conv.conversation_context?.business_context
    const constraintType = businessProfile?.primary_constraint
    
    // Check cache first
    const cachedResponse = await getCachedAIResponse({
      query: userMessage.content,
      userLevel,
      constraintType,
      businessContext,
      agentType: workspace
    })

    if (cachedResponse) {
      console.log('Cache hit! Using cached response.')
      return cachedResponse
    }

    console.log('Cache miss. Generating new response.')
    
    let content = ''
    let agent_type = 'general'
    let insights: any[] = []
    let recommendations: any[] = []

    // Simulate agent selection based on message content and workspace
    if (userMessage.content.toLowerCase().includes('cac') || 
        userMessage.content.toLowerCase().includes('ltv') ||
        workspace === 'financial') {
      agent_type = 'financial-calculator'
      
      if (userLevel === 'beginner') {
        content = "I can help you understand Customer Acquisition Cost (CAC) and Lifetime Value (LTV). CAC is how much you spend to get one new customer, and LTV is how much a customer pays you over their entire relationship with your business.\n\nTo calculate your CAC: Total marketing spend ÷ New customers acquired = CAC\n\nWould you like me to help you calculate these metrics for your business?"
      } else {
        content = "Let's dive into your unit economics. Based on your business profile, I can help you optimize your CAC/LTV ratio and work toward Client Financed Acquisition (CFA).\n\nWhat specific financial metrics would you like to analyze or improve?"
      }

      insights = [{
        type: 'financial_education',
        level: userLevel,
        concepts_covered: ['CAC', 'LTV'],
        timestamp: new Date().toISOString()
      }]

    } else if (userMessage.content.toLowerCase().includes('offer') || 
               workspace === 'offers') {
      agent_type = 'offer-analyzer'
      
      if (userLevel === 'beginner') {
        content = "Great! Let's talk about your offer. An offer is what you're selling and how you present it to customers. Alex Hormozi's 'Grand Slam Offer' framework focuses on making your offer so good that customers feel stupid saying no.\n\nThe framework has 4 parts:\n1. Dream Outcome (what they want)\n2. Perceived Likelihood (they believe you can deliver)\n3. Time Delay (how fast they get results) \n4. Effort & Sacrifice (what they have to do)\n\nWhat product or service are you currently offering?"
      } else {
        content = "Let's optimize your offer using the Grand Slam Offer framework. I can help you increase perceived value, reduce friction, and implement strategic pricing.\n\nWhat aspect of your current offer would you like to improve?"
      }

      recommendations = [{
        type: 'offer_optimization',
        priority: 'high',
        framework: 'Grand Slam Offer',
        next_steps: userLevel === 'beginner' ? 
          ['Define your core offer', 'Identify your target customer'] :
          ['Audit current offer performance', 'Test value stack variations']
      }]

    } else if (userMessage.content.toLowerCase().includes('constraint') ||
               userMessage.content.toLowerCase().includes('bottleneck')) {
      agent_type = 'constraint-analyzer'
      
      content = `Based on your business profile, your primary constraint appears to be ${businessContext?.constraint || 'unknown'}. \n\nThe 4 Universal Constraints are:\n- **Leads**: Not enough potential customers\n- **Sales**: Can't convert leads to customers\n- **Delivery**: Can't fulfill or deliver properly\n- **Profit**: Not making enough money per customer\n\n${userLevel === 'beginner' ? 
        'Understanding your constraint is the first step to growing your business. Once you fix your biggest bottleneck, you\'ll see significant growth.' :
        'Let\'s dive deeper into constraint analysis and create a systematic approach to resolve your primary bottleneck.'
      }`

      insights = [{
        type: 'constraint_identification',
        primary_constraint: businessContext?.constraint,
        confidence: 85,
        next_constraint_prediction: 'sales',
        timestamp: new Date().toISOString()
      }]

    } else {
      // General conversation
      content = `I'm here to help you grow your business using Alex Hormozi's proven frameworks. ${userLevel === 'beginner' ? 
        'I\'ll explain concepts in simple terms and help you understand the fundamentals.' :
        'I can provide advanced strategies and dive deep into implementation details.'
      }\n\nWhat specific challenge are you facing in your business right now?`
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    const response = {
      content,
      agent_type,
      insights,
      recommendations
    }

    // Cache the response for future use
    await cacheAIResponse({
      query: userMessage.content,
      userLevel,
      constraintType,
      businessContext,
      agentType: workspace,
      response,
      responseTokens: Math.floor(content.length / 4), // Rough token estimate
      expirationHours: 24 // Cache for 24 hours
    })

    return response
  }

  const updateConversation = async (updatedMessages: Message[], aiResponse: any) => {
    if (!conversation) return

    try {
      const updates = {
        messages: updatedMessages,
        message_count: updatedMessages.length,
        last_message_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Add insights and recommendations if they exist
      if (aiResponse.insights?.length > 0) {
        updates.insights_generated = [
          ...(conversation.insights_generated as any[] || []),
          ...aiResponse.insights
        ]
      }

      if (aiResponse.recommendations?.length > 0) {
        updates.recommendations = [
          ...(conversation.recommendations as any[] || []),
          ...aiResponse.recommendations
        ]
      }

      const { data, error } = await supabase
        .from('conversations')
        .update(updates)
        .eq('id', conversation.id)
        .select()
        .single()

      if (!error && data) {
        setConversation(data)
      }
    } catch (error) {
      console.error('Error updating conversation:', error)
    }
  }

  const archiveConversation = async (conversationId: string) => {
    try {
      await supabase
        .from('conversations')
        .update({ is_archived: true, updated_at: new Date().toISOString() })
        .eq('id', conversationId)

      // Reload conversation history
      loadConversationHistory()
      
      // If this is the current conversation, create a new one
      if (conversation?.id === conversationId) {
        createOrLoadConversation()
      }
    } catch (error) {
      console.error('Error archiving conversation:', error)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="flex h-[600px] bg-white border rounded-lg overflow-hidden">
      {/* Conversation History Sidebar */}
      <div className="w-80 border-r bg-gray-50">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-900">Recent Conversations</h3>
          <p className="text-sm text-gray-600">
            {workspace.charAt(0).toUpperCase() + workspace.slice(1)} workspace
          </p>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {conversationHistory.map((conv) => (
              <Card 
                key={conv.id} 
                className={`cursor-pointer transition-colors hover:bg-white ${
                  conversation?.id === conv.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => {
                  setConversation(conv)
                  setMessages(conv.messages as Message[] || [])
                }}
              >
                <CardContent className="p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm truncate">
                      {conv.session_title || 'Untitled Session'}
                    </h4>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        archiveConversation(conv.id)
                      }}
                    >
                      <Archive className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-600 mb-2">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(conv.last_message_at).toLocaleDateString()}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {conv.message_count} messages
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {conv.workspace}
                    </Badge>
                  </div>
                  
                  {conv.frameworks_applied && conv.frameworks_applied.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {conv.frameworks_applied.slice(0, 2).map((framework, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {framework}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Conversation Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b bg-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-semibold text-gray-900">
                {conversation?.session_title || 'New Conversation'}
              </h2>
              <p className="text-sm text-gray-600">
                {businessProfile?.business_name || 'General Discussion'} • {workspace}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                {userProfile?.business_level || 'beginner'} level
              </Badge>
              <Badge variant="outline">
                <MessageCircle className="w-3 h-3 mr-1" />
                {messages.length} messages
              </Badge>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-center mb-1">
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 mr-2" />
                    ) : (
                      <Bot className="w-4 h-4 mr-2" />
                    )}
                    <span className="text-xs opacity-75">
                      {formatTimestamp(message.timestamp)}
                    </span>
                    {message.agent_type && (
                      <Badge 
                        variant="secondary" 
                        className="ml-2 text-xs"
                      >
                        {message.agent_type}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="whitespace-pre-wrap">
                    {message.content}
                  </div>

                  {/* Show insights */}
                  {message.insights && message.insights.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-300">
                      <div className="flex items-center text-xs mb-1">
                        <Lightbulb className="w-3 h-3 mr-1" />
                        Insights Generated
                      </div>
                      {message.insights.map((insight, idx) => (
                        <Badge key={idx} variant="outline" className="mr-1 text-xs">
                          {insight.type}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Show recommendations */}
                  {message.recommendations && message.recommendations.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-300">
                      <div className="flex items-center text-xs mb-1">
                        <Target className="w-3 h-3 mr-1" />
                        Recommendations
                      </div>
                      {message.recommendations.map((rec, idx) => (
                        <Badge key={idx} variant="outline" className="mr-1 text-xs">
                          {rec.type}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                  <div className="flex items-center">
                    <Bot className="w-4 h-4 mr-2" />
                    <div className="animate-pulse">Thinking...</div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t bg-white">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about your business, metrics, strategies..."
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              disabled={isLoading}
            />
            <Button 
              onClick={sendMessage} 
              disabled={!inputMessage.trim() || isLoading}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}