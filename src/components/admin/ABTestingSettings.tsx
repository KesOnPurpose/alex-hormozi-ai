'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, BarChart3, Users, Target, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { abTestingService, ABTest, ABTestResult } from '@/services/abTesting';

export function ABTestingSettings() {
  const [tests, setTests] = useState<ABTest[]>([]);
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<ABTestResult | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = () => {
    setTests(abTestingService.getAllTests());
  };

  const handleStartTest = async (testId: string) => {
    abTestingService.startTest(testId);
    loadTests();
  };

  const handlePauseTest = async (testId: string) => {
    abTestingService.pauseTest(testId);
    loadTests();
  };

  const handleCompleteTest = async (testId: string) => {
    const result = abTestingService.completeTest(testId);
    setTestResults(result);
    loadTests();
  };

  const handleViewResults = (testId: string) => {
    const result = abTestingService.getTestResults(testId);
    setTestResults(result);
    setSelectedTest(testId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-400 bg-green-400/10';
      case 'paused': return 'text-yellow-400 bg-yellow-400/10';
      case 'completed': return 'text-blue-400 bg-blue-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Play className="w-4 h-4" />;
      case 'paused': return <Pause className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Square className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">A/B Testing Management</h2>
          <p className="text-gray-300">Create and manage optimization experiments</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Create New Test
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-bold text-white">{tests.length}</div>
              <div className="text-sm text-gray-400">Total Tests</div>
            </div>
            <BarChart3 className="w-6 h-6 text-purple-400" />
          </div>
        </div>
        
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-bold text-green-400">
                {tests.filter(t => t.status === 'running').length}
              </div>
              <div className="text-sm text-gray-400">Running</div>
            </div>
            <Play className="w-6 h-6 text-green-400" />
          </div>
        </div>
        
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-bold text-blue-400">
                {tests.filter(t => t.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-400">Completed</div>
            </div>
            <CheckCircle className="w-6 h-6 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-bold text-yellow-400">
                {tests.filter(t => t.status === 'draft').length}
              </div>
              <div className="text-sm text-gray-400">Draft</div>
            </div>
            <Square className="w-6 h-6 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Tests List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Recent Tests</h3>
        {tests.length === 0 ? (
          <div className="bg-white/5 rounded-xl p-8 border border-white/10 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No tests created yet</h3>
            <p className="text-gray-400 mb-4">Create your first A/B test to start optimizing</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
            >
              Create Test
            </button>
          </div>
        ) : (
          tests.map((test) => (
            <div key={test.id} className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold text-white">{test.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(test.status)}`}>
                      {getStatusIcon(test.status)}
                      <span>{test.status}</span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{test.description}</p>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">Variants</div>
                      <div className="text-white font-medium">{test.variants.length}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Traffic</div>
                      <div className="text-white font-medium">{test.trafficAllocation}%</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Target Metric</div>
                      <div className="text-white font-medium">{test.targetMetric}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {test.status === 'draft' && (
                    <button
                      onClick={() => handleStartTest(test.id)}
                      className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg"
                      title="Start Test"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  )}
                  
                  {test.status === 'running' && (
                    <>
                      <button
                        onClick={() => handlePauseTest(test.id)}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded-lg"
                        title="Pause Test"
                      >
                        <Pause className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleCompleteTest(test.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
                        title="Complete Test"
                      >
                        <Square className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  
                  <button
                    onClick={() => handleViewResults(test.id)}
                    className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg"
                    title="View Results"
                  >
                    <BarChart3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Variants Preview */}
              <div className="border-t border-white/10 pt-4">
                <div className="text-sm text-gray-400 mb-2">Variants Performance</div>
                <div className="grid grid-cols-2 gap-4">
                  {test.variants.slice(0, 4).map((variant, index) => (
                    <div key={variant.id} className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium text-white text-sm">{variant.name}</div>
                        <div className="text-xs text-gray-400">{variant.weight}%</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <div className="text-gray-400">Conversions</div>
                          <div className="text-green-400 font-medium">
                            {variant.metrics.conversionRate.toFixed(2)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-400">Impressions</div>
                          <div className="text-white">{variant.metrics.impressions.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}