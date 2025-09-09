'use client';

import React, { useState } from 'react';

interface ActionItem {
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  timeline: string;
  frameworks?: string[];
}

interface ActionItemCardProps {
  actionItem: ActionItem;
  index: number;
}

export function ActionItemCard({ actionItem, index }: ActionItemCardProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'critical':
        return {
          bg: 'bg-red-500/20',
          border: 'border-red-400/50',
          text: 'text-red-300',
          badge: 'bg-red-500',
          icon: '🔥'
        };
      case 'high':
        return {
          bg: 'bg-orange-500/20',
          border: 'border-orange-400/50',
          text: 'text-orange-300',
          badge: 'bg-orange-500',
          icon: '⚡'
        };
      case 'medium':
        return {
          bg: 'bg-yellow-500/20',
          border: 'border-yellow-400/50',
          text: 'text-yellow-300',
          badge: 'bg-yellow-500',
          icon: '⭐'
        };
      default:
        return {
          bg: 'bg-green-500/20',
          border: 'border-green-400/50',
          text: 'text-green-300',
          badge: 'bg-green-500',
          icon: '✅'
        };
    }
  };

  const config = getPriorityConfig(actionItem.priority);

  return (
    <div className={`relative p-4 rounded-xl border ${config.bg} ${config.border} transition-all duration-200 hover:shadow-lg ${isCompleted ? 'opacity-75' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsCompleted(!isCompleted)}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              isCompleted 
                ? 'bg-green-500 border-green-500' 
                : `border-gray-400 hover:border-purple-400`
            }`}
          >
            {isCompleted && <span className="text-white text-sm">✓</span>}
          </button>
          
          <div className="flex items-center space-x-2">
            <span className="text-lg">{config.icon}</span>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.badge} text-white uppercase tracking-wide`}>
              {actionItem.priority}
            </span>
            <span className="text-sm text-gray-400">#{index + 1}</span>
          </div>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <span className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
      </div>

      {/* Title */}
      <h3 className={`font-semibold mb-2 ${config.text} ${isCompleted ? 'line-through' : ''}`}>
        {actionItem.title}
      </h3>

      {/* Timeline */}
      <div className="flex items-center space-x-4 mb-3">
        <div className="flex items-center space-x-1">
          <span className="text-gray-400">⏱️</span>
          <span className="text-sm text-gray-300">{actionItem.timeline}</span>
        </div>
      </div>

      {/* Frameworks badges */}
      {actionItem.frameworks && actionItem.frameworks.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {actionItem.frameworks.map((framework, idx) => (
            <span
              key={idx}
              className="px-2 py-1 text-xs bg-purple-600/30 text-purple-300 rounded-full border border-purple-400/30"
            >
              {framework}
            </span>
          ))}
        </div>
      )}

      {/* Expandable Description */}
      <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <div className="pt-3 border-t border-gray-600/30">
          <p className="text-gray-200 text-sm leading-relaxed">
            {actionItem.description}
          </p>
          
          {/* Action buttons */}
          <div className="flex space-x-2 mt-3">
            <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg transition-colors">
              Add to Calendar
            </button>
            <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded-lg transition-colors">
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      {isCompleted && (
        <div className="absolute top-2 right-2">
          <span className="text-green-400 text-lg">✓</span>
        </div>
      )}
    </div>
  );
}

interface ActionItemsListProps {
  actionItems: ActionItem[];
}

export function ActionItemsList({ actionItems }: ActionItemsListProps) {
  if (!actionItems || actionItems.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h4 className="text-lg font-semibold text-purple-300 mb-3 flex items-center">
        🎯 Priority Actions
      </h4>
      {actionItems.map((item, index) => (
        <ActionItemCard key={index} actionItem={item} index={index} />
      ))}
    </div>
  );
}