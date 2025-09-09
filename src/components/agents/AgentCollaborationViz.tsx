'use client';

import React, { useState, useEffect } from 'react';
import { Brain, Users, Target, DollarSign, TrendingUp, CheckCircle, Clock, Zap, AlertTriangle, ArrowRight } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  role: string;
  icon: React.ReactNode;
  status: 'idle' | 'thinking' | 'analyzing' | 'collaborating' | 'complete' | 'error';
  confidence: number;
  progress: number;
  specialization: string[];
  currentTask?: string;
  insights?: string[];
  connectionStrength?: number;
}

interface AgentCollaborationVizProps {
  query?: string;
  isActive?: boolean;
  className?: string;
  onAnalysisComplete?: (results: any) => void;
}

export function AgentCollaborationViz({ 
  query = "", 
  isActive = false, 
  className = "",
  onAnalysisComplete 
}: AgentCollaborationVizProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [currentPhase, setCurrentPhase] = useState<'routing' | 'analysis' | 'collaboration' | 'synthesis' | 'complete'>('routing');
  const [collaborationLinks, setCollaborationLinks] = useState<Array<{from: string, to: string, strength: number}>>([]);
  const [overallProgress, setOverallProgress] = useState(0);

  // Initialize agents
  useEffect(() => {
    const initialAgents: Agent[] = [
      {
        id: 'constraint-analyzer',
        name: 'Constraint Analyzer',
        role: 'Primary Diagnostician',
        icon: <Target className="w-5 h-5" />,
        status: 'idle',
        confidence: 0.92,
        progress: 0,
        specialization: ['Bottleneck Identification', 'Growth Analysis', 'System Diagnostics'],
        currentTask: 'Identifying primary business constraints'
      },
      {
        id: 'offer-analyzer',
        name: 'Offer Optimizer',
        role: 'Value Proposition Expert',
        icon: <DollarSign className="w-5 h-5" />,
        status: 'idle',
        confidence: 0.88,
        progress: 0,
        specialization: ['Grand Slam Offers', 'Value Engineering', 'Market Positioning']
      },
      {
        id: 'money-model-architect',
        name: 'Revenue Architect',
        role: 'Monetization Specialist',
        icon: <TrendingUp className="w-5 h-5" />,
        status: 'idle',
        confidence: 0.86,
        progress: 0,
        specialization: ['4-Prong Models', 'Revenue Streams', 'Upsell Strategy']
      },
      {
        id: 'coaching-methodology',
        name: 'Strategic Coach',
        role: 'Integration Specialist',
        icon: <Brain className="w-5 h-5" />,
        status: 'idle',
        confidence: 0.90,
        progress: 0,
        specialization: ['Hormozi Frameworks', 'Strategic Planning', 'Implementation']
      }
    ];

    setAgents(initialAgents);
  }, []);

  // Simulate agent collaboration when active
  useEffect(() => {
    if (!isActive || !query) return;

    let phaseTimer: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout;

    const runCollaboration = async () => {
      // Phase 1: Routing (0.5s)
      setCurrentPhase('routing');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Phase 2: Initial Analysis (3s)
      setCurrentPhase('analysis');
      setAgents(prev => prev.map(agent => ({
        ...agent,
        status: agent.id === 'constraint-analyzer' ? 'analyzing' : 'thinking'
      })));

      // Simulate progress
      let progress = 0;
      progressTimer = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        setOverallProgress(progress);
        
        setAgents(prev => prev.map(agent => ({
          ...agent,
          progress: Math.min(progress + (Math.random() * 20 - 10), 100),
          currentTask: progress > 30 ? `Analyzing ${query.substring(0, 30)}...` : agent.currentTask
        })));

        if (progress >= 100) {
          clearInterval(progressTimer);
          setCurrentPhase('collaboration');
        }
      }, 200);

      await new Promise(resolve => setTimeout(resolve, 3000));

      // Phase 3: Collaboration (2s)
      setCurrentPhase('collaboration');
      setAgents(prev => prev.map(agent => ({
        ...agent,
        status: 'collaborating'
      })));

      // Create collaboration links
      setCollaborationLinks([
        { from: 'constraint-analyzer', to: 'offer-analyzer', strength: 0.85 },
        { from: 'constraint-analyzer', to: 'money-model-architect', strength: 0.78 },
        { from: 'offer-analyzer', to: 'money-model-architect', strength: 0.92 },
        { from: 'coaching-methodology', to: 'constraint-analyzer', strength: 0.88 }
      ]);

      await new Promise(resolve => setTimeout(resolve, 2000));

      // Phase 4: Synthesis (1s)
      setCurrentPhase('synthesis');
      setAgents(prev => prev.map(agent => ({
        ...agent,
        status: 'complete',
        progress: 100,
        insights: [
          `${agent.specialization[0]} analysis complete`,
          `Confidence: ${Math.round(agent.confidence * 100)}%`,
          'Ready for synthesis'
        ]
      })));

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Phase 5: Complete
      setCurrentPhase('complete');
      setOverallProgress(100);

      if (onAnalysisComplete) {
        onAnalysisComplete({
          phase: 'complete',
          agents: agents.map(a => ({ id: a.id, confidence: a.confidence })),
          collaborationStrength: 0.89
        });
      }
    };

    runCollaboration();

    return () => {
      if (phaseTimer) clearTimeout(phaseTimer);
      if (progressTimer) clearInterval(progressTimer);
    };
  }, [isActive, query]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'thinking': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'analyzing': return <Zap className="w-4 h-4 text-blue-400 animate-pulse" />;
      case 'collaborating': return <Users className="w-4 h-4 text-purple-400" />;
      case 'complete': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'thinking': return 'border-yellow-400/50 bg-yellow-400/10';
      case 'analyzing': return 'border-blue-400/50 bg-blue-400/10';
      case 'collaborating': return 'border-purple-400/50 bg-purple-400/10';
      case 'complete': return 'border-green-400/50 bg-green-400/10';
      case 'error': return 'border-red-400/50 bg-red-400/10';
      default: return 'border-gray-400/50 bg-gray-400/10';
    }
  };

  const getPhaseDescription = () => {
    switch (currentPhase) {
      case 'routing': return 'Intelligent query analysis and agent selection...';
      case 'analysis': return 'Primary agent analyzing your business challenge...';
      case 'collaboration': return 'Agents collaborating and cross-validating insights...';
      case 'synthesis': return 'Synthesizing findings into actionable recommendations...';
      case 'complete': return 'Analysis complete! Comprehensive insights generated.';
      default: return 'Initializing Alex Hormozi AI agents...';
    }
  };

  return (
    <div className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-400" />
            Agent Intelligence Network
          </h3>
          <p className="text-sm text-gray-400">{getPhaseDescription()}</p>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{overallProgress.toFixed(0)}%</div>
          <div className="text-sm text-gray-400">Complete</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className={`relative p-4 rounded-lg border transition-all duration-300 ${getStatusColor(agent.status)}`}
          >
            {/* Agent Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${getStatusColor(agent.status)}`}>
                  {agent.icon}
                </div>
                <div>
                  <div className="font-medium text-white text-sm">{agent.name}</div>
                  <div className="text-xs text-gray-400">{agent.role}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                {getStatusIcon(agent.status)}
              </div>
            </div>

            {/* Progress */}
            {agent.progress > 0 && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">Progress</span>
                  <span className="text-xs font-medium text-white">{agent.progress.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full transition-all duration-300 ${
                      agent.status === 'complete' ? 'bg-green-400' : 
                      agent.status === 'analyzing' ? 'bg-blue-400' : 'bg-purple-400'
                    }`}
                    style={{ width: `${agent.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Current Task */}
            {agent.currentTask && agent.status !== 'idle' && (
              <div className="mb-3">
                <div className="text-xs text-gray-400 mb-1">Current Task</div>
                <div className="text-xs text-gray-200">{agent.currentTask}</div>
              </div>
            )}

            {/* Specialization */}
            <div className="mb-3">
              <div className="text-xs text-gray-400 mb-1">Specialization</div>
              <div className="flex flex-wrap gap-1">
                {agent.specialization.slice(0, 2).map((spec, index) => (
                  <span key={index} className="text-xs bg-purple-600/20 text-purple-300 px-2 py-1 rounded-full">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Confidence */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div className="text-xs text-gray-400">Confidence</div>
              <div className="text-sm font-medium text-white">{Math.round(agent.confidence * 100)}%</div>
            </div>

            {/* Insights (when complete) */}
            {agent.insights && agent.status === 'complete' && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="text-xs text-gray-400 mb-2">Key Insights</div>
                <ul className="space-y-1">
                  {agent.insights.slice(0, 2).map((insight, index) => (
                    <li key={index} className="text-xs text-gray-200 flex items-start">
                      <span className="text-green-400 mr-1">•</span>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Collaboration Links Visualization */}
      {currentPhase === 'collaboration' && collaborationLinks.length > 0 && (
        <div className="mb-6 p-4 bg-white/5 rounded-lg">
          <h4 className="text-sm font-medium text-white mb-3 flex items-center">
            <Users className="w-4 h-4 mr-2 text-purple-400" />
            Active Collaborations
          </h4>
          <div className="space-y-2">
            {collaborationLinks.map((link, index) => {
              const fromAgent = agents.find(a => a.id === link.from);
              const toAgent = agents.find(a => a.id === link.to);
              return (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-300">{fromAgent?.name}</span>
                    <ArrowRight className="w-3 h-3 text-purple-400" />
                    <span className="text-gray-300">{toAgent?.name}</span>
                  </div>
                  <div className="text-xs text-purple-400">
                    {Math.round(link.strength * 100)}% synergy
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Phase Indicator */}
      <div className="flex items-center justify-center space-x-4 pt-4 border-t border-white/10">
        {['routing', 'analysis', 'collaboration', 'synthesis', 'complete'].map((phase, index) => (
          <div key={phase} className="flex items-center">
            <div className={`w-3 h-3 rounded-full transition-all ${
              currentPhase === phase ? 'bg-purple-400' :
              ['routing', 'analysis', 'collaboration', 'synthesis', 'complete'].indexOf(currentPhase) > index ? 
              'bg-green-400' : 'bg-gray-600'
            }`} />
            {index < 4 && <div className="w-8 h-0.5 bg-gray-600 mx-2" />}
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-2">
        <span className="text-xs text-gray-400 capitalize">
          {currentPhase === 'complete' ? 'Analysis Complete' : `${currentPhase} Phase`}
        </span>
      </div>
    </div>
  );
}