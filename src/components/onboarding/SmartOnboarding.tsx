'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { UserProfile, BusinessProfile, BusinessLevel } from '@/lib/supabase/types';
import { useAuth } from '@/hooks/useAuth';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
}

interface SmartOnboardingProps {
  onComplete: (profile: UserProfile, business: BusinessProfile) => void;
}

export default function SmartOnboarding({ onComplete }: SmartOnboardingProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [detectedLevel, setDetectedLevel] = useState<BusinessLevel>('beginner');
  const [sophisticationScore, setSophisticationScore] = useState(0);
  const [formData, setFormData] = useState({
    // User profile data
    fullName: '',
    businessExperience: '',
    
    // Business profile data
    businessName: '',
    industry: '',
    businessType: '',
    description: '',
    monthlyRevenue: 0,
    customerCount: 0,
    primaryGoal: '',
    biggestChallenge: '',
    
    // Metrics (for level detection)
    cac: 0,
    ltv: 0,
    churnRate: 0,
    grossMargin: 0,
    
    // Sophistication indicators
    usesBusinessTerms: false,
    hasSystemicApproach: false,
    understandsMetrics: false,
    hasScalingExperience: false,
  });

  // Smart level detection based on responses
  useEffect(() => {
    const detectSophisticationLevel = () => {
      let score = 0;
      
      // Revenue-based scoring (40% weight)
      if (formData.monthlyRevenue > 1000000) score += 40;
      else if (formData.monthlyRevenue > 100000) score += 30;
      else if (formData.monthlyRevenue > 10000) score += 20;
      else if (formData.monthlyRevenue > 1000) score += 10;
      
      // Metrics knowledge (30% weight)
      if (formData.cac > 0 && formData.ltv > 0) score += 15;
      if (formData.churnRate > 0) score += 5;
      if (formData.grossMargin > 0) score += 10;
      
      // Language sophistication (30% weight)
      if (formData.usesBusinessTerms) score += 10;
      if (formData.hasSystemicApproach) score += 10;
      if (formData.hasScalingExperience) score += 10;
      
      setSophisticationScore(score);
      
      // Determine level based on score
      if (score >= 75) setDetectedLevel('enterprise');
      else if (score >= 50) setDetectedLevel('scale');
      else if (score >= 25) setDetectedLevel('growth');
      else setDetectedLevel('beginner');
    };
    
    detectSophisticationLevel();
  }, [formData]);

  // Analyze text for business sophistication
  const analyzeText = (text: string) => {
    const businessTerms = [
      'cac', 'ltv', 'conversion', 'funnel', 'optimization', 'constraint', 
      'scale', 'systematic', 'framework', 'roi', 'kpi', 'metrics'
    ];
    
    const systemicWords = [
      'process', 'system', 'framework', 'methodology', 'systematic',
      'optimization', 'scale', 'implement', 'strategy'
    ];
    
    const scalingWords = [
      'team', 'hire', 'delegate', 'automate', 'scale', 'growth',
      'expansion', 'operations', 'management'
    ];
    
    const lowerText = text.toLowerCase();
    
    const usesTerms = businessTerms.some(term => lowerText.includes(term));
    const isSystemic = systemicWords.some(word => lowerText.includes(word));
    const hasScaling = scalingWords.some(word => lowerText.includes(word));
    
    setFormData(prev => ({
      ...prev,
      usesBusinessTerms: prev.usesBusinessTerms || usesTerms,
      hasSystemicApproach: prev.hasSystemicApproach || isSystemic,
      hasScalingExperience: prev.hasScalingExperience || hasScaling
    }));
  };

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Alex Hormozi AI',
      description: 'Let\'s get to know you and your business',
      component: <WelcomeStep />
    },
    {
      id: 'personal',
      title: 'About You',
      description: 'Tell us about your background',
      component: (
        <PersonalStep 
          formData={formData} 
          setFormData={setFormData} 
          onTextChange={analyzeText}
        />
      )
    },
    {
      id: 'business',
      title: 'Your Business',
      description: 'Help us understand your business',
      component: (
        <BusinessStep 
          formData={formData} 
          setFormData={setFormData} 
          onTextChange={analyzeText}
          detectedLevel={detectedLevel}
        />
      )
    },
    {
      id: 'metrics',
      title: 'Business Metrics',
      description: 'Share your key metrics (if known)',
      component: (
        <MetricsStep 
          formData={formData} 
          setFormData={setFormData}
          detectedLevel={detectedLevel}
        />
      )
    },
    {
      id: 'confirmation',
      title: 'Almost Ready!',
      description: 'Confirm your profile and business setup',
      component: (
        <ConfirmationStep 
          formData={formData}
          detectedLevel={detectedLevel}
          sophisticationScore={sophisticationScore}
        />
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) return;

    try {
      // Create user profile
      const { data: userProfile, error: userError } = await supabase
        .from('user_profiles')
        .insert({
          id: user.id,
          email: user.email!,
          full_name: formData.fullName,
          business_level: detectedLevel,
          detected_sophistication: {
            score: sophisticationScore,
            indicators: {
              usesBusinessTerms: formData.usesBusinessTerms,
              hasSystemicApproach: formData.hasSystemicApproach,
              understandsMetrics: formData.understandsMetrics,
              hasScalingExperience: formData.hasScalingExperience
            },
            detectedAt: new Date().toISOString()
          },
          onboarding_completed: true
        })
        .select()
        .single();

      if (userError) throw userError;

      // Create business profile
      const { data: businessProfile, error: businessError } = await supabase
        .from('business_profiles')
        .insert({
          user_id: user.id,
          business_name: formData.businessName,
          industry: formData.industry,
          business_type: formData.businessType,
          description: formData.description,
          stage: detectedLevel === 'beginner' ? 'startup' : 
                detectedLevel === 'growth' ? 'growth' :
                detectedLevel === 'scale' ? 'scale' : 'mature',
          monthly_revenue: formData.monthlyRevenue,
          customer_count: formData.customerCount,
          cac: formData.cac,
          ltv: formData.ltv,
          churn_rate: formData.churnRate,
          gross_margin: formData.grossMargin,
          ai_context: {
            primaryGoal: formData.primaryGoal,
            biggestChallenge: formData.biggestChallenge,
            onboardingInsights: {
              detectedLevel,
              sophisticationScore,
              keyIndicators: [
                formData.usesBusinessTerms && 'Uses business terminology',
                formData.hasSystemicApproach && 'Systematic thinking',
                formData.hasScalingExperience && 'Scaling experience'
              ].filter(Boolean)
            }
          }
        })
        .select()
        .single();

      if (businessError) throw businessError;

      onComplete(userProfile, businessProfile);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">Setup Your Profile</h1>
            <div className="text-sm text-gray-300">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Step */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-gray-300">
              {steps[currentStep].description}
            </p>
          </div>

          {steps[currentStep].component}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              Previous
            </button>
            
            <div className="flex items-center space-x-4">
              {detectedLevel !== 'beginner' && (
                <div className="text-sm text-purple-300 bg-purple-900/30 px-3 py-1 rounded-full">
                  Detected: {detectedLevel.charAt(0).toUpperCase() + detectedLevel.slice(1)}
                </div>
              )}
              
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
              </button>
            </div>
          </div>
        </div>

        {/* Level Detection Preview */}
        {sophisticationScore > 0 && (
          <div className="mt-6 bg-blue-900/20 rounded-lg p-4 border border-blue-400/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-300">
                  Business Level: {detectedLevel.charAt(0).toUpperCase() + detectedLevel.slice(1)}
                </h3>
                <p className="text-blue-200 text-sm">
                  Alex will adapt his coaching style to match your business sophistication
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-300">
                  {sophisticationScore}/100
                </div>
                <div className="text-xs text-blue-400">Sophistication Score</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Step Components
function WelcomeStep() {
  return (
    <div className="text-center py-8">
      <div className="text-6xl mb-6">🎯</div>
      <h3 className="text-2xl font-bold text-white mb-4">
        Ready to Transform Your Business?
      </h3>
      <p className="text-gray-300 text-lg mb-6">
        I&apos;m Alex Hormozi AI, and I&apos;ll help you identify and solve your biggest business constraints 
        using proven frameworks from over 1,260 business consultations.
      </p>
      <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/30">
        <h4 className="text-lg font-semibold text-purple-300 mb-3">
          What Makes This Different:
        </h4>
        <ul className="text-gray-300 space-y-2 text-left">
          <li>• I adapt my coaching style to your business level</li>
          <li>• I remember every conversation and track your progress</li>
          <li>• I use real frameworks that have generated billions in value</li>
          <li>• I focus on your primary constraint first - no overwhelm</li>
        </ul>
      </div>
    </div>
  );
}

function PersonalStep({ formData, setFormData, onTextChange }: any) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Your Full Name
        </label>
        <input
          type="text"
          value={formData.fullName}
          onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
          className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300"
          placeholder="What should I call you?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Tell Me About Your Business Experience
        </label>
        <textarea
          value={formData.businessExperience}
          onChange={(e) => {
            const value = e.target.value;
            setFormData(prev => ({ ...prev, businessExperience: value }));
            onTextChange(value);
          }}
          rows={4}
          className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300"
          placeholder="Are you just starting out, or have you built businesses before? What's your background?"
        />
      </div>
    </div>
  );
}

function BusinessStep({ formData, setFormData, onTextChange, detectedLevel }: any) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Business Name
          </label>
          <input
            type="text"
            value={formData.businessName}
            onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
            className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300"
            placeholder="Your business name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Industry
          </label>
          <select
            value={formData.industry}
            onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
            className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white"
          >
            <option value="">Select Industry</option>
            <option value="coaching">Coaching</option>
            <option value="consulting">Consulting</option>
            <option value="saas">SaaS</option>
            <option value="ecommerce">E-commerce</option>
            <option value="agency">Agency</option>
            <option value="professional-services">Professional Services</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Describe Your Business
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => {
            const value = e.target.value;
            setFormData(prev => ({ ...prev, description: value }));
            onTextChange(value);
          }}
          rows={3}
          className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300"
          placeholder="What do you do? Who do you serve? How do you help them?"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Monthly Revenue
          </label>
          <select
            value={formData.monthlyRevenue}
            onChange={(e) => setFormData(prev => ({ ...prev, monthlyRevenue: Number(e.target.value) }))}
            className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white"
          >
            <option value={0}>Select Range</option>
            <option value={500}>$0 - $1K</option>
            <option value={2500}>$1K - $5K</option>
            <option value={7500}>$5K - $10K</option>
            <option value={25000}>$10K - $50K</option>
            <option value={75000}>$50K - $100K</option>
            <option value={250000}>$100K - $500K</option>
            <option value={750000}>$500K - $1M</option>
            <option value={2500000}>$1M+</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Customer Count
          </label>
          <input
            type="number"
            value={formData.customerCount}
            onChange={(e) => setFormData(prev => ({ ...prev, customerCount: Number(e.target.value) }))}
            className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300"
            placeholder="Approximate number of customers"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          What's Your Biggest Challenge Right Now?
        </label>
        <textarea
          value={formData.biggestChallenge}
          onChange={(e) => {
            const value = e.target.value;
            setFormData(prev => ({ ...prev, biggestChallenge: value }));
            onTextChange(value);
          }}
          rows={3}
          className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300"
          placeholder="What's holding your business back? What keeps you up at night?"
        />
      </div>
    </div>
  );
}

function MetricsStep({ formData, setFormData, detectedLevel }: any) {
  const isAdvanced = detectedLevel === 'scale' || detectedLevel === 'enterprise';
  
  return (
    <div className="space-y-6">
      {!isAdvanced && (
        <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-400/30">
          <h4 className="text-lg font-semibold text-blue-300 mb-2">
            Don't Worry If You Don't Know These
          </h4>
          <p className="text-blue-200 text-sm">
            I'll help you understand and calculate these metrics. Just fill in what you know.
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            CAC - Customer Acquisition Cost
            {!isAdvanced && (
              <span className="text-gray-400 text-sm block">
                How much do you spend to get one customer?
              </span>
            )}
          </label>
          <input
            type="number"
            value={formData.cac}
            onChange={(e) => setFormData(prev => ({ ...prev, cac: Number(e.target.value) }))}
            className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300"
            placeholder={isAdvanced ? "CAC in dollars" : "Leave blank if unknown"}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            LTV - Lifetime Value
            {!isAdvanced && (
              <span className="text-gray-400 text-sm block">
                How much does a customer pay you over their lifetime?
              </span>
            )}
          </label>
          <input
            type="number"
            value={formData.ltv}
            onChange={(e) => setFormData(prev => ({ ...prev, ltv: Number(e.target.value) }))}
            className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300"
            placeholder={isAdvanced ? "LTV in dollars" : "Leave blank if unknown"}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Churn Rate (Monthly %)
            {!isAdvanced && (
              <span className="text-gray-400 text-sm block">
                What % of customers stop buying each month?
              </span>
            )}
          </label>
          <input
            type="number"
            step="0.01"
            max="1"
            value={formData.churnRate}
            onChange={(e) => setFormData(prev => ({ ...prev, churnRate: Number(e.target.value) }))}
            className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300"
            placeholder={isAdvanced ? "0.05 = 5%" : "0.10 = 10%"}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Gross Margin (%)
            {!isAdvanced && (
              <span className="text-gray-400 text-sm block">
                What % of revenue is profit before fixed costs?
              </span>
            )}
          </label>
          <input
            type="number"
            step="0.01"
            max="1"
            value={formData.grossMargin}
            onChange={(e) => setFormData(prev => ({ ...prev, grossMargin: Number(e.target.value) }))}
            className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300"
            placeholder={isAdvanced ? "0.80 = 80%" : "0.70 = 70%"}
          />
        </div>
      </div>

      {isAdvanced && (
        <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-400/30">
          <h4 className="text-lg font-semibold text-purple-300 mb-2">
            Advanced Metrics Detected
          </h4>
          <p className="text-purple-200 text-sm">
            I can see you understand business metrics. I'll provide advanced analysis and strategic recommendations.
          </p>
        </div>
      )}
    </div>
  );
}

function ConfirmationStep({ formData, detectedLevel, sophisticationScore }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-green-900/20 rounded-lg p-6 border border-green-400/30">
        <h4 className="text-xl font-semibold text-green-300 mb-4">
          Profile Complete! Here's What I Know About You:
        </h4>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h5 className="text-lg font-medium text-white mb-2">Business Level</h5>
            <div className="text-2xl font-bold text-green-400 mb-2">
              {detectedLevel.charAt(0).toUpperCase() + detectedLevel.slice(1)}
            </div>
            <p className="text-green-200 text-sm">
              Sophistication Score: {sophisticationScore}/100
            </p>
          </div>
          
          <div>
            <h5 className="text-lg font-medium text-white mb-2">Business</h5>
            <p className="text-gray-300">{formData.businessName}</p>
            <p className="text-gray-400 text-sm">{formData.industry}</p>
            <p className="text-gray-400 text-sm">
              ${formData.monthlyRevenue?.toLocaleString()}/month
            </p>
          </div>
        </div>
      </div>

      <div className="bg-purple-900/20 rounded-lg p-6 border border-purple-400/30">
        <h4 className="text-lg font-semibold text-purple-300 mb-3">
          How I'll Help You:
        </h4>
        <ul className="space-y-2 text-gray-300">
          {detectedLevel === 'beginner' && (
            <>
              <li>• I'll explain business terms clearly with examples</li>
              <li>• I'll provide step-by-step guidance for each recommendation</li>
              <li>• I'll focus on foundational concepts before advanced strategies</li>
              <li>• I'll track your learning progress as we work together</li>
            </>
          )}
          {detectedLevel === 'growth' && (
            <>
              <li>• I'll provide systematic optimization frameworks</li>
              <li>• I'll focus on proven tactics for scaling your business</li>
              <li>• I'll help you build better systems and processes</li>
              <li>• I'll track your implementation and results</li>
            </>
          )}
          {detectedLevel === 'scale' && (
            <>
              <li>• I'll provide sophisticated business strategies</li>
              <li>• I'll help optimize complex operational challenges</li>
              <li>• I'll focus on advanced frameworks and systems</li>
              <li>• I'll provide competitive intelligence and market insights</li>
            </>
          )}
          {detectedLevel === 'enterprise' && (
            <>
              <li>• I'll provide strategic-level analysis and recommendations</li>
              <li>• I'll focus on market creation and competitive positioning</li>
              <li>• I'll help with advanced financial engineering strategies</li>
              <li>• I'll provide board-level strategic guidance</li>
            </>
          )}
        </ul>
      </div>

      <div className="text-center py-4">
        <p className="text-gray-300 italic">
          "This is a speed game. The faster you can identify and solve your constraint, the faster you grow. 
          Perfect one at a time - don't try to fix everything at once."
        </p>
        <p className="text-purple-400 mt-2">- Alex Hormozi</p>
      </div>
    </div>
  );
}