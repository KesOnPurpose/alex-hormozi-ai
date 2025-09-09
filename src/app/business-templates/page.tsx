'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TemplateSystem } from '@/components/templates/TemplateSystem';
import { TemplateDetails } from '@/components/templates/TemplateDetails';
import { ArrowLeft, Sparkles, Target, TrendingUp } from 'lucide-react';

interface Template {
  id: string;
  title: string;
  description: string;
  category: 'grand_slam_offer' | 'constraint_solving' | '4_prong_money' | 'cfa_optimization' | 'value_equation';
  businessType: 'service' | 'product' | 'saas' | 'ecommerce' | 'coaching' | 'agency' | 'franchise';
  revenueRange: '0-10k' | '10k-50k' | '50k-250k' | '250k-1m' | '1m+';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  framework: string;
  tags: string[];
  rating: number;
  usageCount: number;
  isFavorite: boolean;
  components: any[];
  outcomes: string[];
  requirements: string[];
}

export default function BusinessTemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showImplementationSuccess, setShowImplementationSuccess] = useState(false);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
  };

  const handleBackToTemplates = () => {
    setSelectedTemplate(null);
  };

  const handleImplementTemplate = (template: Template) => {
    console.log('Implementing template:', template.title);
    
    // Show success message
    setShowImplementationSuccess(true);
    setTimeout(() => {
      setShowImplementationSuccess(false);
      setSelectedTemplate(null);
    }, 3000);

    // TODO: Integrate with Progress Tracker to add template components as milestones/goals
    // TODO: Send template data to backend for progress tracking
    // TODO: Generate personalized action plan based on template
  };

  const handleAddToFavorites = (templateId: string) => {
    console.log('Adding to favorites:', templateId);
    // TODO: Update user favorites in backend
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Implementation Success Overlay */}
      {showImplementationSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-xl p-8 border border-green-400/30 text-center animate-pulse max-w-md mx-4">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold text-white mb-2">Template Implemented!</h2>
            <p className="text-green-300 mb-4">Your progress tracker has been updated with new milestones and goals</p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-300">
              <div className="flex items-center space-x-1">
                <Target className="h-4 w-4" />
                <span>Milestones Added</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4" />
                <span>Goals Created</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {!selectedTemplate ? (
          <>
            {/* Header */}
            <div className="mb-8">
              <Link 
                href="/" 
                className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
              
              <div className="text-center">
                <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
                  <Sparkles className="h-10 w-10 text-purple-400" />
                  <span>Business Templates</span>
                </h1>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                  Pre-built templates based on Alex Hormozi's proven frameworks. Choose a template that matches your business type and goals to get started immediately.
                </p>
              </div>
            </div>

            {/* Framework Benefits */}
            <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-xl p-6 border border-purple-400/20 mb-8">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">🎯 Why Use Templates?</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-purple-600/20 rounded-lg p-4 mb-3 w-fit mx-auto">
                    <Target className="h-6 w-6 text-purple-400" />
                  </div>
                  <h4 className="font-medium text-white mb-2">Proven Frameworks</h4>
                  <p className="text-sm text-gray-400">Based on Alex Hormozi's tested business strategies that have generated millions</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-600/20 rounded-lg p-4 mb-3 w-fit mx-auto">
                    <TrendingUp className="h-6 w-6 text-blue-400" />
                  </div>
                  <h4 className="font-medium text-white mb-2">Faster Implementation</h4>
                  <p className="text-sm text-gray-400">Skip the guesswork with pre-built action plans and milestone tracking</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-600/20 rounded-lg p-4 mb-3 w-fit mx-auto">
                    <Sparkles className="h-6 w-6 text-green-400" />
                  </div>
                  <h4 className="font-medium text-white mb-2">Personalized Results</h4>
                  <p className="text-sm text-gray-400">Templates adapt to your business stage, industry, and revenue goals</p>
                </div>
              </div>
            </div>

            {/* Template System */}
            <TemplateSystem 
              onTemplateSelect={handleTemplateSelect}
            />

            {/* Integration Notice */}
            <div className="mt-8 bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 text-center">
              <Sparkles className="h-8 w-8 text-purple-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Seamless Integration</h3>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Templates automatically integrate with your Progress Tracker, creating personalized milestones, goals, and metrics based on your selection. 
                Start implementing immediately with clear action steps and measurable outcomes.
              </p>
            </div>
          </>
        ) : (
          <TemplateDetails
            template={selectedTemplate}
            onBack={handleBackToTemplates}
            onImplementTemplate={handleImplementTemplate}
            onAddToFavorites={handleAddToFavorites}
          />
        )}
      </div>
    </div>
  );
}