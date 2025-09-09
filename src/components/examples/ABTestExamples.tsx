'use client';

import React from 'react';
import { useABTest, ABTestWrapper } from '@/hooks/useABTest';
import { abTestingService } from '@/services/abTesting';

// Example 1: Button Color Testing
export function CTAButtonTest({ userId }: { userId: string }) {
  const { variant, trackConversion } = useABTest('cta-button-color-test', userId);

  const handleClick = () => {
    trackConversion({ action: 'cta_click', page: 'homepage' });
    // Handle actual conversion logic
    console.log('CTA clicked!');
  };

  const getButtonStyle = () => {
    switch (variant) {
      case 'variant_red':
        return 'bg-red-600 hover:bg-red-700';
      case 'variant_green':
        return 'bg-green-600 hover:bg-green-700';
      case 'variant_purple':
        return 'bg-purple-600 hover:bg-purple-700';
      default:
        return 'bg-blue-600 hover:bg-blue-700'; // Control
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`${getButtonStyle()} text-white px-8 py-3 rounded-lg font-semibold transition-colors`}
    >
      Start Your Analysis
    </button>
  );
}

// Example 2: Pricing Display Testing
export function PricingDisplayTest({ userId }: { userId: string }) {
  const variants = {
    'variant_monthly': (
      <div className="bg-white/10 rounded-lg p-6">
        <div className="text-3xl font-bold text-white mb-2">$97/month</div>
        <div className="text-gray-400">Monthly subscription</div>
        <div className="text-sm text-green-400 mt-1">Cancel anytime</div>
      </div>
    ),
    'variant_annual': (
      <div className="bg-white/10 rounded-lg p-6">
        <div className="text-3xl font-bold text-white mb-2">$497/year</div>
        <div className="text-gray-400">Annual subscription</div>
        <div className="text-sm text-green-400 mt-1">Save $667 per year!</div>
      </div>
    ),
    'variant_lifetime': (
      <div className="bg-white/10 rounded-lg p-6 border-2 border-purple-400">
        <div className="text-xs bg-purple-500 text-white px-2 py-1 rounded-full mb-2 inline-block">
          LIMITED TIME
        </div>
        <div className="text-3xl font-bold text-white mb-2">$1,497</div>
        <div className="text-gray-400">Lifetime access</div>
        <div className="text-sm text-green-400 mt-1">Never pay again!</div>
      </div>
    )
  };

  return (
    <ABTestWrapper
      testId="pricing-display-test"
      userId={userId}
      variants={variants}
      fallback={
        <div className="bg-white/10 rounded-lg p-6">
          <div className="text-3xl font-bold text-white mb-2">$97/month</div>
          <div className="text-gray-400">Monthly subscription</div>
        </div>
      }
    >
      {/* Control version */}
      <div className="bg-white/10 rounded-lg p-6">
        <div className="text-3xl font-bold text-white mb-2">$97/month</div>
        <div className="text-gray-400">Monthly subscription</div>
      </div>
    </ABTestWrapper>
  );
}

// Example 3: Headline Testing
export function HeadlineTest({ userId }: { userId: string }) {
  const { variant } = useABTest('homepage-headline-test', userId);

  const getHeadline = () => {
    switch (variant) {
      case 'variant_problem_focused':
        return "Tired of Struggling to Scale Your Business?";
      case 'variant_solution_focused':
        return "Get the Exact Framework Alex Hormozi Uses to Scale";
      case 'variant_urgency_focused':
        return "Limited Time: Unlock Alex Hormozi's $100M Framework";
      case 'variant_social_proof':
        return "Join 50,000+ Entrepreneurs Using Alex Hormozi's Methods";
      default:
        return "Scale Your Business Like Alex Hormozi"; // Control
    }
  };

  const getSubheadline = () => {
    switch (variant) {
      case 'variant_problem_focused':
        return "Stop wasting time on strategies that don't work. Get the proven system that scales.";
      case 'variant_solution_focused':
        return "The step-by-step system that built multiple 8-figure companies.";
      case 'variant_urgency_focused':
        return "This exclusive training expires in 72 hours. Don't miss out.";
      case 'variant_social_proof':
        return "See why thousands of entrepreneurs trust this proven framework.";
      default:
        return "Learn the exact strategies used to build $100M+ businesses.";
    }
  };

  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
        {getHeadline()}
      </h1>
      <p className="text-xl text-gray-300 max-w-3xl mx-auto">
        {getSubheadline()}
      </p>
    </div>
  );
}

// Example 4: Form Field Testing
export function FormFieldTest({ userId }: { userId: string }) {
  const { variant, trackConversion } = useABTest('form-fields-test', userId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackConversion({ action: 'form_submit', variant });
  };

  const isMinimalForm = variant === 'variant_minimal';

  return (
    <form onSubmit={handleSubmit} className="bg-white/10 rounded-xl p-6 space-y-4">
      <div>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400"
          required
        />
      </div>
      
      {!isMinimalForm && (
        <>
          <div>
            <input
              type="text"
              placeholder="Your name"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400"
              required
            />
          </div>
          
          <div>
            <input
              type="tel"
              placeholder="Phone number"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400"
            />
          </div>
          
          <div>
            <select className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white">
              <option value="">Business type</option>
              <option value="coaching">Coaching</option>
              <option value="ecommerce">E-commerce</option>
              <option value="saas">SaaS</option>
              <option value="other">Other</option>
            </select>
          </div>
        </>
      )}
      
      <button
        type="submit"
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-colors"
      >
        {isMinimalForm ? 'Get Instant Access' : 'Start Your Analysis'}
      </button>
    </form>
  );
}

// Example 5: Social Proof Testing
export function SocialProofTest({ userId }: { userId: string }) {
  const { variant } = useABTest('social-proof-test', userId);

  const getSocialProof = () => {
    switch (variant) {
      case 'variant_testimonial':
        return (
          <div className="bg-white/10 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <img 
                src="/api/placeholder/60/60" 
                alt="Customer" 
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="text-white italic mb-2">
                  "This framework helped me scale from $50K to $500K in just 8 months!"
                </p>
                <div className="text-sm text-gray-400">— Sarah Johnson, Business Owner</div>
              </div>
            </div>
          </div>
        );
      
      case 'variant_numbers':
        return (
          <div className="bg-white/10 rounded-lg p-6 text-center">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold text-purple-400">50K+</div>
                <div className="text-sm text-gray-400">Students</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">$1.2B+</div>
                <div className="text-sm text-gray-400">Revenue Generated</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">4.9/5</div>
                <div className="text-sm text-gray-400">Average Rating</div>
              </div>
            </div>
          </div>
        );
      
      case 'variant_logos':
        return (
          <div className="bg-white/10 rounded-lg p-6">
            <div className="text-center mb-4">
              <div className="text-sm text-gray-400 mb-3">Featured In</div>
              <div className="flex items-center justify-center space-x-8 opacity-60">
                <div className="text-white font-bold">Forbes</div>
                <div className="text-white font-bold">Entrepreneur</div>
                <div className="text-white font-bold">Inc.</div>
                <div className="text-white font-bold">TechCrunch</div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-white/10 rounded-lg p-6 text-center">
            <div className="text-lg font-semibold text-white mb-2">
              Join thousands of successful entrepreneurs
            </div>
            <div className="text-gray-400">
              Trusted by business owners worldwide
            </div>
          </div>
        );
    }
  };

  return getSocialProof();
}

// Demo page to show all tests
export function ABTestDemo() {
  const userId = 'demo_user_123'; // In real app, get from auth context

  React.useEffect(() => {
    // Create some sample tests for demo
    const sampleTests = [
      {
        name: 'CTA Button Color Test',
        description: 'Testing different button colors for conversion optimization',
        targetMetric: 'click_through_rate',
        trafficAllocation: 100,
        confidence: 95,
        status: 'running' as const,
        variants: [
          {
            id: 'control',
            name: 'Control (Blue)',
            description: 'Original blue button',
            weight: 25,
            config: { color: 'blue' },
            metrics: { impressions: 1250, conversions: 89, conversionRate: 7.12, revenue: 4450 }
          },
          {
            id: 'variant_red',
            name: 'Red Button',
            description: 'Red button variant',
            weight: 25,
            config: { color: 'red' },
            metrics: { impressions: 1198, conversions: 102, conversionRate: 8.51, revenue: 5100 }
          },
          {
            id: 'variant_green',
            name: 'Green Button',
            description: 'Green button variant',
            weight: 25,
            config: { color: 'green' },
            metrics: { impressions: 1301, conversions: 95, conversionRate: 7.30, revenue: 4750 }
          },
          {
            id: 'variant_purple',
            name: 'Purple Button',
            description: 'Purple button variant',
            weight: 25,
            config: { color: 'purple' },
            metrics: { impressions: 1156, conversions: 78, conversionRate: 6.75, revenue: 3900 }
          }
        ]
      },
      {
        name: 'Homepage Headline Test',
        description: 'Testing different headline approaches for engagement',
        targetMetric: 'bounce_rate',
        trafficAllocation: 80,
        confidence: 95,
        status: 'running' as const,
        variants: [
          {
            id: 'control',
            name: 'Control',
            description: 'Original headline',
            weight: 20,
            config: { type: 'control' },
            metrics: { impressions: 2100, conversions: 315, conversionRate: 15.0, revenue: 15750 }
          },
          {
            id: 'variant_problem_focused',
            name: 'Problem Focused',
            description: 'Focus on pain points',
            weight: 20,
            config: { type: 'problem' },
            metrics: { impressions: 2045, conversions: 347, conversionRate: 16.97, revenue: 17350 }
          },
          {
            id: 'variant_solution_focused',
            name: 'Solution Focused',
            description: 'Focus on the solution',
            weight: 20,
            config: { type: 'solution' },
            metrics: { impressions: 1987, conversions: 298, conversionRate: 15.0, revenue: 14900 }
          },
          {
            id: 'variant_urgency_focused',
            name: 'Urgency Focused',
            description: 'Create urgency',
            weight: 20,
            config: { type: 'urgency' },
            metrics: { impressions: 2134, conversions: 384, conversionRate: 18.0, revenue: 19200 }
          },
          {
            id: 'variant_social_proof',
            name: 'Social Proof',
            description: 'Emphasize social proof',
            weight: 20,
            config: { type: 'social' },
            metrics: { impressions: 2078, conversions: 332, conversionRate: 15.97, revenue: 16600 }
          }
        ]
      }
    ];

    // Only create if tests don't already exist
    const existingTests = abTestingService.getAllTests();
    if (existingTests.length === 0) {
      sampleTests.forEach(test => {
        abTestingService.createTest(test);
      });
      
      // Start the tests
      abTestingService.getAllTests().forEach(test => {
        if (test.status === 'running') {
          abTestingService.startTest(test.id);
        }
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">A/B Testing Examples</h1>
          <p className="text-gray-300">Interactive examples showing different A/B test implementations</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Headline Test */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-6">Headline Test</h2>
            <HeadlineTest userId={userId} />
          </div>

          {/* CTA Button Test */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-6">CTA Button Test</h2>
            <div className="text-center">
              <CTAButtonTest userId={userId} />
            </div>
          </div>

          {/* Pricing Display Test */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-6">Pricing Display Test</h2>
            <PricingDisplayTest userId={userId} />
          </div>

          {/* Form Field Test */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-6">Form Fields Test</h2>
            <FormFieldTest userId={userId} />
          </div>
        </div>

        {/* Social Proof Test */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Social Proof Test</h2>
          <SocialProofTest userId={userId} />
        </div>

        <div className="text-center text-gray-400">
          <p>Refresh the page to see different variants. Check the A/B Testing Dashboard to see results.</p>
        </div>
      </div>
    </div>
  );
}