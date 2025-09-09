'use client';

import React, { useState } from 'react';
import { Brain, Target, Clock, TrendingUp, CheckCircle, AlertCircle, ChevronDown, ChevronUp, Eye, Lightbulb, Zap } from 'lucide-react';

interface ReasoningStep {
  step: string;
  description: string;
  confidence: number;
  data: any;
  reasoning: string;
}

interface AgentSelection {
  agent: string;
  reason: string;
  confidence: number;
  expectedFrameworks: string[];
  estimatedTime: number;
  prerequisites: string[];
}

interface QueryAnalysis {
  intent: string;
  complexity: 'simple' | 'medium' | 'complex' | 'strategic';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  businessContext: string[];
  frameworks: string[];
  confidence: number;
}

interface AgentReasoningDisplayProps {
  queryAnalysis: QueryAnalysis;
  primaryAgent: AgentSelection;
  secondaryAgents: AgentSelection[];
  collaborativeMode: boolean;
  executionPlan: string[];
  reasoning: string;
  className?: string;
}

export function AgentReasoningDisplay({
  queryAnalysis,
  primaryAgent,
  secondaryAgents,
  collaborativeMode,
  executionPlan,
  reasoning,
  className = ''
}: AgentReasoningDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);

  const getAgentDisplayName = (agentName: string) => {
    return agentName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'complex': return 'text-orange-400';
      case 'strategic': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'text-blue-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-400';
    if (confidence >= 0.7) return 'text-yellow-400';
    if (confidence >= 0.5) return 'text-orange-400';
    return 'text-red-400';
  };

  const reasoningSteps: ReasoningStep[] = [
    {
      step: 'Query Analysis',
      description: 'Analyzed query intent, complexity, and context',
      confidence: queryAnalysis.confidence,
      data: queryAnalysis,
      reasoning: `Detected ${queryAnalysis.intent} intent with ${queryAnalysis.complexity} complexity and ${queryAnalysis.urgency} urgency`
    },
    {
      step: 'Agent Scoring',
      description: 'Evaluated all agents against query requirements',
      confidence: primaryAgent.confidence,
      data: { primary: primaryAgent, secondary: secondaryAgents },
      reasoning: `Selected ${getAgentDisplayName(primaryAgent.agent)} with ${Math.round(primaryAgent.confidence * 100)}% confidence`
    },
    {
      step: 'Collaboration Decision',
      description: 'Determined if collaborative approach is needed',
      confidence: collaborativeMode ? 0.85 : 0.75,
      data: { collaborativeMode, secondaryCount: secondaryAgents.length },
      reasoning: collaborativeMode 
        ? `Enabled collaboration with ${secondaryAgents.length} supporting agents for comprehensive analysis`
        : 'Single agent approach sufficient for this query complexity'
    },
    {
      step: 'Execution Planning',
      description: 'Created step-by-step execution strategy',
      confidence: 0.88,
      data: { plan: executionPlan },
      reasoning: `Generated ${executionPlan.length}-step execution plan optimized for ${queryAnalysis.complexity} complexity`
    }
  ];

  return (
    <div className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-purple-600/20">
            <Brain className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Agent Reasoning</h3>
            <p className="text-sm text-gray-400">Transparent AI decision-making process</p>
          </div>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-white">{isExpanded ? 'Hide' : 'Show'} Details</span>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-purple-400" /> : <ChevronDown className="w-4 h-4 text-purple-400" />}
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Target className="w-3 h-3 text-blue-400" />
            <span className="text-xs font-medium text-gray-400">INTENT</span>
          </div>
          <div className="text-sm font-semibold text-white capitalize">{queryAnalysis.intent}</div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <TrendingUp className="w-3 h-3 text-orange-400" />
            <span className="text-xs font-medium text-gray-400">COMPLEXITY</span>
          </div>
          <div className={`text-sm font-semibold capitalize ${getComplexityColor(queryAnalysis.complexity)}`}>
            {queryAnalysis.complexity}
          </div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Clock className="w-3 h-3 text-yellow-400" />
            <span className="text-xs font-medium text-gray-400">URGENCY</span>
          </div>
          <div className={`text-sm font-semibold capitalize ${getUrgencyColor(queryAnalysis.urgency)}`}>
            {queryAnalysis.urgency}
          </div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <CheckCircle className="w-3 h-3 text-green-400" />
            <span className="text-xs font-medium text-gray-400">CONFIDENCE</span>
          </div>
          <div className={`text-sm font-semibold ${getConfidenceColor(queryAnalysis.confidence)}`}>
            {Math.round(queryAnalysis.confidence * 100)}%
          </div>
        </div>
      </div>

      {/* Primary Agent Selection */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-white mb-3 flex items-center">
          <Zap className="w-4 h-4 mr-2 text-purple-400" />
          Selected Agent
        </h4>
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="font-medium text-white text-lg">{getAgentDisplayName(primaryAgent.agent)}</div>
              <div className="text-sm text-gray-400">{primaryAgent.reason}</div>
            </div>
            <div className="text-right">
              <div className={`text-lg font-bold ${getConfidenceColor(primaryAgent.confidence)}`}>
                {Math.round(primaryAgent.confidence * 100)}%
              </div>
              <div className="text-xs text-gray-400">confidence</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Estimated Time:</span>
              <span className="text-white ml-2">{primaryAgent.estimatedTime.toFixed(1)}s</span>
            </div>
            <div>
              <span className="text-gray-400">Mode:</span>
              <span className="text-white ml-2">{collaborativeMode ? 'Collaborative' : 'Solo'}</span>
            </div>
          </div>
          
          {primaryAgent.expectedFrameworks.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="text-xs text-gray-400 mb-2">Expected Frameworks</div>
              <div className="flex flex-wrap gap-1">
                {primaryAgent.expectedFrameworks.map((framework, index) => (
                  <span key={index} className="text-xs bg-purple-600/20 text-purple-300 px-2 py-1 rounded-full">
                    {framework}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Collaborative Agents */}
      {collaborativeMode && secondaryAgents.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-white mb-3 flex items-center">
            <Brain className="w-4 h-4 mr-2 text-blue-400" />
            Collaborative Agents ({secondaryAgents.length})
          </h4>
          <div className="space-y-2">
            {secondaryAgents.map((agent, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-white text-sm">{getAgentDisplayName(agent.agent)}</div>
                    <div className="text-xs text-gray-400">{agent.reason}</div>
                  </div>
                  <div className={`text-sm font-semibold ${getConfidenceColor(agent.confidence)}`}>
                    {Math.round(agent.confidence * 100)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Reasoning Steps (Expandable) */}
      {isExpanded && (
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-white flex items-center">
            <Lightbulb className="w-4 h-4 mr-2 text-yellow-400" />
            Reasoning Process
          </h4>
          
          {reasoningSteps.map((step, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-4">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setSelectedStep(selectedStep === step.step ? null : step.step)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-white">{step.step}</div>
                    <div className="text-xs text-gray-400">{step.description}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className={`text-sm font-semibold ${getConfidenceColor(step.confidence)}`}>
                    {Math.round(step.confidence * 100)}%
                  </div>
                  {selectedStep === step.step ? 
                    <ChevronUp className="w-4 h-4 text-gray-400" /> : 
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  }
                </div>
              </div>
              
              {selectedStep === step.step && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="text-sm text-gray-300 mb-3">{step.reasoning}</div>
                  <div className="bg-black/20 rounded-lg p-3">
                    <pre className="text-xs text-gray-400 overflow-x-auto">
                      {JSON.stringify(step.data, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* Execution Plan */}
          <div className="bg-white/5 rounded-lg p-4">
            <h5 className="font-medium text-white mb-3 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
              Execution Plan
            </h5>
            <div className="space-y-2">
              {executionPlan.map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-600/20 text-green-400 text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <div className="text-sm text-gray-300">{step}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Overall Reasoning Summary */}
          <div className="bg-purple-600/10 border border-purple-600/30 rounded-lg p-4">
            <h5 className="font-medium text-purple-300 mb-2 flex items-center">
              <Brain className="w-4 h-4 mr-2" />
              Decision Summary
            </h5>
            <div className="text-sm text-gray-300">{reasoning}</div>
          </div>
        </div>
      )}
    </div>
  );
}