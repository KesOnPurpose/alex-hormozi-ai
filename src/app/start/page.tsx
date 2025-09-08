'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface BusinessProfile {
  businessStage: 'complete_beginner' | 'have_business' | 'scaling_business' | 'experienced_operator'
  monthlyRevenue: string
  primaryChallenge: string
  businessType: string
  knowsMetrics: boolean
  sophisticationScore: number
}

interface OnboardingStep {
  id: string
  question: string
  description?: string
  options: Array<{
    value: string
    label: string
    description?: string
    followUp?: boolean
  }>
  type: 'single' | 'multiple'
}

export default function StartPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [profile, setProfile] = useState<BusinessProfile>({
    businessStage: 'complete_beginner',
    monthlyRevenue: '',
    primaryChallenge: '',
    businessType: '',
    knowsMetrics: false,
    sophisticationScore: 0
  })
  const [answers, setAnswers] = useState<Record<string, string>>({})

  // Dynamic step generation based on previous answers
  const generateSteps = (): OnboardingStep[] => {
    const baseSteps: OnboardingStep[] = [
      {
        id: 'business_stage',
        question: "What's your current business situation?",
        description: "This helps us tailor the exact frameworks you need",
        type: 'single',
        options: [
          {
            value: 'complete_beginner',
            label: "💡 I have an idea but no business yet",
            description: "Ready to start from scratch with proven frameworks"
          },
          {
            value: 'have_business',
            label: "🏢 I have a business making some money",
            description: "Looking to identify what's holding me back"
          },
          {
            value: 'scaling_business',
            label: "📈 I'm scaling but hit roadblocks",
            description: "Need to break through specific constraints"
          },
          {
            value: 'experienced_operator',
            label: "🎯 I'm experienced, want specific insights",
            description: "Skip basics, focus on advanced optimization"
          }
        ]
      }
    ]

    // Add conditional steps based on business stage
    if (answers.business_stage === 'have_business' || answers.business_stage === 'scaling_business') {
      baseSteps.push({
        id: 'monthly_revenue',
        question: "What's your approximate monthly revenue?",
        description: "This helps us understand your business scale",
        type: 'single',
        options: [
          { value: '0-1k', label: "$0 - $1,000", description: "Early stage, focus on fundamentals" },
          { value: '1k-10k', label: "$1,000 - $10,000", description: "Growth stage, optimize constraints" },
          { value: '10k-50k', label: "$10,000 - $50,000", description: "Scale stage, systematic growth" },
          { value: '50k+', label: "$50,000+", description: "Optimization stage, advanced strategies" }
        ]
      })

      baseSteps.push({
        id: 'primary_challenge',
        question: "What's your biggest challenge right now?",
        description: "We'll prioritize solving this first",
        type: 'single',
        options: [
          { value: 'leads', label: "🎯 Not enough leads", description: "Lead generation constraint" },
          { value: 'sales', label: "💬 Can't convert leads to sales", description: "Sales conversion constraint" },
          { value: 'delivery', label: "📦 Struggling with delivery/fulfillment", description: "Delivery constraint" },
          { value: 'profit', label: "💰 Making money but no profit", description: "Profit optimization constraint" },
          { value: 'unsure', label: "🤔 Not sure what's the real problem", description: "Need constraint analysis" }
        ]
      })
    }

    if (answers.business_stage === 'experienced_operator') {
      baseSteps.push({
        id: 'metrics_knowledge',
        question: "Do you know your key business metrics?",
        description: "CAC, LTV, conversion rates, etc.",
        type: 'single',
        options: [
          { value: 'yes_detailed', label: "✅ Yes, I track everything", description: "Advanced analysis ready" },
          { value: 'yes_basic', label: "📊 Yes, but basic tracking", description: "Intermediate optimization" },
          { value: 'no_but_interested', label: "🎯 No, but I want to learn", description: "Metrics-focused approach" },
          { value: 'no_prefer_simple', label: "🎨 No, prefer simple strategies", description: "Framework-focused approach" }
        ]
      })
    }

    return baseSteps
  }

  const steps = generateSteps()
  const isLastStep = currentStep >= steps.length - 1

  const handleAnswer = (stepId: string, value: string) => {
    const newAnswers = { ...answers, [stepId]: value }
    setAnswers(newAnswers)

    // Update profile based on answers
    const newProfile = { ...profile }
    
    if (stepId === 'business_stage') {
      newProfile.businessStage = value as any
      newProfile.sophisticationScore = getSophisticationScore(value)
    }
    
    if (stepId === 'monthly_revenue') {
      newProfile.monthlyRevenue = value
    }
    
    if (stepId === 'primary_challenge') {
      newProfile.primaryChallenge = value
    }

    if (stepId === 'metrics_knowledge') {
      newProfile.knowsMetrics = value === 'yes_detailed' || value === 'yes_basic'
    }

    setProfile(newProfile)

    // Auto-advance or finish
    if (isLastStep) {
      handleComplete(newProfile)
    } else {
      setTimeout(() => setCurrentStep(currentStep + 1), 500)
    }
  }

  const getSophisticationScore = (businessStage: string): number => {
    const scores = {
      'complete_beginner': 1,
      'have_business': 3,
      'scaling_business': 6,
      'experienced_operator': 9
    }
    return scores[businessStage as keyof typeof scores] || 1
  }

  const handleComplete = (finalProfile: BusinessProfile) => {
    // Store profile in localStorage for now (later will be database)
    localStorage.setItem('businessProfile', JSON.stringify(finalProfile))
    localStorage.setItem('onboardingAnswers', JSON.stringify(answers))

    // Route based on sophistication and answers
    const route = determineNextRoute(finalProfile)
    router.push(route)
  }

  const determineNextRoute = (profile: BusinessProfile): string => {
    // High sophistication users - direct to agent selection
    if (profile.sophisticationScore >= 6) {
      return '/agents'
    }

    // Medium sophistication - start with constraint analysis
    if (profile.sophisticationScore >= 3) {
      return '/agents/constraint-analyzer'
    }

    // Beginners - guided analysis
    return '/analysis'
  }

  const currentStepData = steps[currentStep]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex justify-between items-center mb-4">
            <Link href="/" className="text-gray-400 hover:text-white text-sm">
              ← Back to Home
            </Link>
            <span className="text-gray-400 text-sm">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <div className="bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {currentStepData?.question}
            </h1>
            
            {currentStepData?.description && (
              <p className="text-lg text-gray-300 mb-8">
                {currentStepData.description}
              </p>
            )}

            {/* Options */}
            <div className="space-y-4">
              {currentStepData?.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(currentStepData.id, option.value)}
                  className="w-full text-left p-6 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 hover:border-purple-400/50 transition-all group"
                >
                  <div className="flex items-start">
                    <div className="flex-1">
                      <div className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300">
                        {option.label}
                      </div>
                      {option.description && (
                        <div className="text-sm text-gray-400 group-hover:text-gray-300">
                          {option.description}
                        </div>
                      )}
                    </div>
                    <div className="text-2xl text-gray-400 group-hover:text-purple-400 transition-colors ml-4">
                      →
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Skip for Experts */}
            {profile.sophisticationScore >= 6 && (
              <div className="mt-8 pt-8 border-t border-white/10">
                <button
                  onClick={() => router.push('/agents')}
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  I'm experienced - take me directly to the agent selection
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Trust Signals */}
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <p className="text-gray-400 text-sm">
            Used by thousands of entrepreneurs to identify and solve their biggest business constraints
          </p>
        </div>
      </div>
    </div>
  )
}