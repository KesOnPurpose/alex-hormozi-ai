'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, BarChart3, Users, Target, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { abTestingService, ABTest, ABTestResult } from '@/services/abTesting';

export function ABTestingDashboard() {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">A/B Testing Dashboard</h1>
            <p className="text-gray-300">Manage and analyze your experiments</p>
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
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{tests.length}</div>
                <div className="text-sm text-gray-400">Total Tests</div>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {tests.filter(t => t.status === 'running').length}
                </div>
                <div className="text-sm text-gray-400">Running</div>
              </div>
              <Play className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  {tests.filter(t => t.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-400">Completed</div>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-400">
                  {tests.filter(t => t.status === 'draft').length}
                </div>
                <div className="text-sm text-gray-400">Draft</div>
              </div>
              <Square className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Tests List */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-white mb-6">All Tests</h2>
            <div className="space-y-4">
              {tests.length === 0 ? (
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 text-center">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No tests created yet</h3>
                  <p className="text-gray-400 mb-4">Create your first A/B test to start experimenting</p>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                  >
                    Create Test
                  </button>
                </div>
              ) : (
                tests.map((test) => (
                  <div key={test.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{test.name}</h3>
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
                      <div className="text-sm text-gray-400 mb-2">Variants</div>
                      <div className="grid grid-cols-2 gap-4">
                        {test.variants.map((variant, index) => (
                          <div key={variant.id} className="bg-white/5 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <div className="font-medium text-white text-sm">{variant.name}</div>
                              <div className="text-xs text-gray-400">{variant.weight}%</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <div className="text-gray-400">Impressions</div>
                                <div className="text-white">{variant.metrics.impressions.toLocaleString()}</div>
                              </div>
                              <div>
                                <div className="text-gray-400">Conversions</div>
                                <div className="text-white">{variant.metrics.conversions.toLocaleString()}</div>
                              </div>
                            </div>
                            <div className="mt-1">
                              <div className="text-gray-400 text-xs">Conversion Rate</div>
                              <div className="text-green-400 font-medium">
                                {variant.metrics.conversionRate.toFixed(2)}%
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

          {/* Results Panel */}
          <div>
            {testResults && selectedTest ? (
              <TestResults results={testResults} />
            ) : (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">Test Results</h3>
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Select a test to view detailed results</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Create Test Form Modal */}
        {showCreateForm && (
          <CreateTestForm 
            onClose={() => setShowCreateForm(false)}
            onSave={() => {
              setShowCreateForm(false);
              loadTests();
            }}
          />
        )}
      </div>
    </div>
  );
}

function TestResults({ results }: { results: ABTestResult }) {
  const winner = results.results.find(v => v.id === results.winningVariant);
  
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <Target className="w-5 h-5 mr-2 text-purple-400" />
        Test Results
      </h3>
      
      {/* Winner Banner */}
      {winner && (
        <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="font-medium text-green-300">Winner Identified!</span>
          </div>
          <div className="text-white font-medium">{winner.name}</div>
          <div className="text-sm text-gray-300">{results.confidence.toFixed(1)}% confidence</div>
        </div>
      )}
      
      {/* Variants Performance */}
      <div className="space-y-4 mb-6">
        <div className="text-sm font-medium text-gray-400">Variant Performance</div>
        {results.results.map((variant, index) => (
          <div key={variant.id} className={`bg-white/5 rounded-lg p-4 border ${variant.id === results.winningVariant ? 'border-green-400/30' : 'border-white/10'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="font-medium text-white">{variant.name}</div>
              {variant.id === results.winningVariant && (
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">WINNER</span>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-400">Impressions</div>
                <div className="text-white font-medium">{variant.metrics.impressions.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-gray-400">Conversions</div>
                <div className="text-white font-medium">{variant.metrics.conversions.toLocaleString()}</div>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="text-gray-400 text-sm">Conversion Rate</div>
              <div className="text-2xl font-bold text-green-400">{variant.metrics.conversionRate.toFixed(2)}%</div>
            </div>
            
            {variant.metrics.revenue && (
              <div className="mt-2">
                <div className="text-gray-400 text-sm">Revenue</div>
                <div className="text-lg font-semibold text-purple-400">${variant.metrics.revenue.toLocaleString()}</div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Recommendations */}
      <div>
        <div className="text-sm font-medium text-gray-400 mb-3">Recommendations</div>
        <div className="space-y-2">
          {results.recommendations.map((rec, index) => (
            <div key={index} className="text-sm text-gray-300 bg-white/5 rounded-lg p-3">
              {rec}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CreateTestForm({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetMetric: 'conversion_rate',
    trafficAllocation: 100,
    variants: [
      { name: 'Control', description: 'Original version', weight: 50, config: {} },
      { name: 'Variant A', description: 'Test version', weight: 50, config: {} }
    ]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const test = {
      name: formData.name,
      description: formData.description,
      targetMetric: formData.targetMetric,
      trafficAllocation: formData.trafficAllocation,
      confidence: 95,
      status: 'draft' as const,
      variants: formData.variants.map((v, index) => ({
        id: `variant_${Date.now()}_${index}`,
        name: v.name,
        description: v.description,
        weight: v.weight,
        config: v.config,
        metrics: {
          impressions: 0,
          conversions: 0,
          conversionRate: 0,
          revenue: 0
        }
      }))
    };
    
    abTestingService.createTest(test);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-white/20 rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-6">Create New A/B Test</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Test Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400"
              placeholder="e.g., Homepage CTA Button Color"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400"
              rows={3}
              placeholder="Brief description of what you're testing"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Target Metric</label>
              <select
                value={formData.targetMetric}
                onChange={(e) => setFormData({...formData, targetMetric: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
              >
                <option value="conversion_rate">Conversion Rate</option>
                <option value="click_through_rate">Click-Through Rate</option>
                <option value="bounce_rate">Bounce Rate</option>
                <option value="time_on_page">Time on Page</option>
                <option value="revenue">Revenue</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Traffic Allocation (%)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.trafficAllocation}
                onChange={(e) => setFormData({...formData, trafficAllocation: parseInt(e.target.value)})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Variants</label>
            <div className="space-y-4">
              {formData.variants.map((variant, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <input
                      type="text"
                      value={variant.name}
                      onChange={(e) => {
                        const newVariants = [...formData.variants];
                        newVariants[index] = {...variant, name: e.target.value};
                        setFormData({...formData, variants: newVariants});
                      }}
                      className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-400"
                      placeholder="Variant name"
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={variant.weight}
                      onChange={(e) => {
                        const newVariants = [...formData.variants];
                        newVariants[index] = {...variant, weight: parseInt(e.target.value)};
                        setFormData({...formData, variants: newVariants});
                      }}
                      className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                      placeholder="Weight %"
                    />
                  </div>
                  <textarea
                    value={variant.description}
                    onChange={(e) => {
                      const newVariants = [...formData.variants];
                      newVariants[index] = {...variant, description: e.target.value};
                      setFormData({...formData, variants: newVariants});
                    }}
                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-400"
                    rows={2}
                    placeholder="Variant description"
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Create Test
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}