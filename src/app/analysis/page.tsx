'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface AnalysisStep {
  id: string
  title: string
  description: string
  icon: string
  completed: boolean
}

interface FileUploadArea {
  id: string
  title: string
  description: string
  acceptedTypes: string[]
  optional?: boolean
  uploaded: boolean
}

export default function AnalysisPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [businessProfile, setBusinessProfile] = useState<any>(null)
  const [analysisData, setAnalysisData] = useState<any>({})
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    // Load business profile from onboarding
    const savedProfile = localStorage.getItem('businessProfile')
    if (savedProfile) {
      setBusinessProfile(JSON.parse(savedProfile))
    }
  }, [])

  const analysisSteps: AnalysisStep[] = [
    {
      id: 'business_overview',
      title: 'Business Overview',
      description: 'Tell us about your business basics',
      icon: '🏢',
      completed: false
    },
    {
      id: 'upload_data',
      title: 'Upload Business Data',
      description: 'Share your financial and operational data',
      icon: '📊',
      completed: false
    },
    {
      id: 'constraint_analysis',
      title: 'Instant Constraint Analysis',
      description: 'Get your biggest bottleneck identified',
      icon: '🎯',
      completed: false
    },
    {
      id: 'action_plan',
      title: 'Your Action Plan',
      description: 'Get specific next steps to grow',
      icon: '📈',
      completed: false
    }
  ]

  const uploadAreas: FileUploadArea[] = [
    {
      id: 'financials',
      title: 'Financial Statements',
      description: 'P&L, Balance Sheet, or any revenue/expense data',
      acceptedTypes: ['.pdf', '.xlsx', '.csv', '.jpg', '.png'],
      uploaded: false
    },
    {
      id: 'marketing',
      title: 'Marketing Data',
      description: 'Ad account screenshots, conversion data, funnel metrics',
      acceptedTypes: ['.pdf', '.xlsx', '.jpg', '.png', '.csv'],
      optional: true,
      uploaded: false
    },
    {
      id: 'operations',
      title: 'Operational Data',
      description: 'Customer data, delivery metrics, team info',
      acceptedTypes: ['.pdf', '.xlsx', '.csv', '.txt'],
      optional: true,
      uploaded: false
    }
  ]

  const handleFileUpload = (areaId: string, files: FileList | null) => {
    if (!files || files.length === 0) return

    // Simulate file processing
    setAnalysisData(prev => ({
      ...prev,
      [areaId]: {
        files: Array.from(files).map(f => f.name),
        uploadedAt: new Date().toISOString()
      }
    }))
  }

  const startAnalysis = async () => {
    setIsAnalyzing(true)
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const mockAnalysis = {
      primaryConstraint: businessProfile?.primaryChallenge || 'sales',
      constraintConfidence: 85,
      quickWins: [
        'Optimize your offer messaging for 15-20% conversion lift',
        'Implement follow-up sequence for lost prospects',
        'Add social proof to reduce purchase friction'
      ],
      metrics: {
        estimatedRevenueLift: '$2,400/month',
        implementationTime: '2-3 weeks',
        confidenceScore: 8.5
      }
    }
    
    setAnalysisData(prev => ({ ...prev, analysis: mockAnalysis }))
    setIsAnalyzing(false)
    setCurrentStep(3) // Move to results
  }

  const handleContinueToAgent = (agentType: string) => {
    // Store analysis data for agent context
    localStorage.setItem('analysisResults', JSON.stringify(analysisData))
    router.push(`/agents/${agentType}`)
  }

  if (currentStep === 0) {
    // Step 1: Business Overview
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <Link href="/start" className="text-gray-400 hover:text-white text-sm mb-4 inline-block">
                ← Back to Questions
              </Link>
              <h1 className="text-4xl font-bold text-white mb-4">
                Let&apos;s Analyze Your Business 🎯
              </h1>
              <p className="text-lg text-gray-300">
                We&apos;ll identify your biggest constraint and create an action plan in under 5 minutes
              </p>
            </div>

            {/* Business Overview Form */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">Quick Business Overview</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Business Name</label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400"
                    placeholder="Your business name"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">What do you sell?</label>
                  <textarea
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 h-24"
                    placeholder="Briefly describe your product or service..."
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Target Customer</label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400"
                    placeholder="Who buys from you?"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-purple-400 hover:text-purple-300"
                >
                  Skip - I&apos;ll share this later
                </button>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-all"
                >
                  Continue to Data Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 1) {
    // Step 2: File Upload
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">
                Share Your Business Data 📊
              </h1>
              <p className="text-lg text-gray-300 mb-2">
                Upload any documents to get more accurate insights
              </p>
              <p className="text-sm text-gray-400">
                Don&apos;t have files ready? No problem - we&apos;ll work with what you provide
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {uploadAreas.map((area) => (
                <div key={area.id} className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {area.title}
                    {area.optional && <span className="text-xs text-gray-400 ml-2">(Optional)</span>}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">{area.description}</p>
                  
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center hover:border-purple-400/50 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept={area.acceptedTypes.join(',')}
                      onChange={(e) => handleFileUpload(area.id, e.target.files)}
                      className="hidden"
                      id={area.id}
                    />
                    <label htmlFor={area.id} className="cursor-pointer">
                      <div className="text-3xl mb-2">📁</div>
                      <div className="text-sm text-gray-300">
                        Click to upload or drag files here
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {area.acceptedTypes.join(', ')}
                      </div>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Options */}
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 text-center">
              <h3 className="text-xl font-bold text-white mb-4">Ready for Your Analysis?</h3>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={startAnalysis}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all"
                >
                  🎯 Analyze My Business Now
                </button>
              </div>
              <p className="text-sm text-gray-400 mt-3">
                Analysis takes 30-60 seconds • Get instant constraint identification
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 2 || isAnalyzing) {
    // Step 3: Analysis in Progress
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-12 border border-white/10">
            <div className="animate-spin text-6xl mb-6">🎯</div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Analyzing Your Business...
            </h1>
            <p className="text-lg text-gray-300 mb-6">
              Alex Hormozi&apos;s AI is identifying your primary constraint using insights from 1,260+ business consultations
            </p>
            <div className="bg-gray-700 rounded-full h-2 mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full animate-pulse" style={{ width: '75%' }} />
            </div>
            <p className="text-sm text-gray-400">
              Analyzing patterns • Identifying bottlenecks • Generating solutions
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Step 4: Results
  const analysis = analysisData.analysis
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🎯</div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Your Business Analysis Results
            </h1>
            <p className="text-lg text-gray-300">
              We found your primary constraint and created an action plan
            </p>
          </div>

          {/* Primary Constraint */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 mb-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Your Primary Constraint: <span className="text-purple-400 capitalize">{analysis?.primaryConstraint}</span>
              </h2>
              <p className="text-gray-300">
                Confidence Score: <span className="text-green-400 font-semibold">{analysis?.constraintConfidence}%</span>
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">💰</div>
                <div className="text-lg font-semibold text-white">{analysis?.metrics.estimatedRevenueLift}</div>
                <div className="text-sm text-gray-400">Potential Monthly Lift</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">⏰</div>
                <div className="text-lg font-semibold text-white">{analysis?.metrics.implementationTime}</div>
                <div className="text-sm text-gray-400">Implementation Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-lg font-semibold text-white">{analysis?.metrics.confidenceScore}/10</div>
                <div className="text-sm text-gray-400">Action Plan Score</div>
              </div>
            </div>
          </div>

          {/* Quick Wins */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">🚀 Your 3 Quick Wins</h3>
            <div className="space-y-3">
              {analysis?.quickWins.map((win: string, index: number) => (
                <div key={index} className="flex items-start p-4 rounded-lg bg-white/5">
                  <span className="text-purple-400 font-bold mr-3">{index + 1}.</span>
                  <span className="text-gray-300">{win}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">🎯 Recommended Next Steps</h3>
            <p className="text-gray-300 mb-6">
              Work with our AI agents to solve your constraint systematically
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => handleContinueToAgent('constraint-analyzer')}
                className="p-6 rounded-xl border border-purple-400/50 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 transition-all"
              >
                <div className="text-2xl mb-2">🔍</div>
                <div className="font-semibold text-white">Deep Constraint Analysis</div>
                <div className="text-sm text-gray-400 mt-1">Get detailed breakdown and solutions</div>
              </button>

              <button
                onClick={() => handleContinueToAgent('offer-analyzer')}
                className="p-6 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 transition-all"
              >
                <div className="text-2xl mb-2">💎</div>
                <div className="font-semibold text-white">Optimize Your Offer</div>
                <div className="text-sm text-gray-400 mt-1">Transform offers with Grand Slam framework</div>
              </button>
            </div>

            <div className="mt-6 text-center">
              <Link href="/agents" className="text-purple-400 hover:text-purple-300 underline">
                Or choose from all 8 specialist agents →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}