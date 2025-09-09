'use client';

import React from 'react';

export default function ABTestDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">A/B Testing Examples</h1>
          <p className="text-gray-300">Interactive examples coming soon - A/B Testing framework is ready!</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-6">Simple Button Test</h2>
            <div className="text-center">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                Start Your Analysis
              </button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-6">Pricing Display</h2>
            <div className="bg-white/10 rounded-lg p-6">
              <div className="text-3xl font-bold text-white mb-2">$97/month</div>
              <div className="text-gray-400">Monthly subscription</div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 text-center">
          <h2 className="text-xl font-semibold text-white mb-4">Framework Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4">
              <div className="text-green-400 font-semibold mb-2">✅ A/B Testing Service</div>
              <div className="text-sm text-gray-300">Core engine with statistical analysis</div>
            </div>
            <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4">
              <div className="text-green-400 font-semibold mb-2">✅ Admin Dashboard</div>
              <div className="text-sm text-gray-300">Test management and results</div>
            </div>
            <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4">
              <div className="text-green-400 font-semibold mb-2">✅ Developer Hooks</div>
              <div className="text-sm text-gray-300">Easy integration with useABTest</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}