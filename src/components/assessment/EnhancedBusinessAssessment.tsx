'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target,
  Brain,
  Zap,
  BarChart,
  Building,
  Lightbulb,
  AlertCircle,
  Star,
  Clock,
  ChevronRight
} from 'lucide-react';

interface BusinessProfile {
  businessStage: 'complete_beginner' | 'have_business' | 'scaling_business' | 'experienced_operator';
  monthlyRevenue: string;
  primaryChallenge: string;
  businessType: string;
  industry: string;
  teamSize: string;
  currentOffers: string;
  marketingChannels: string[];
  knowsMetrics: boolean;
  hasSystemsProcesses: boolean;
  biggestPainPoint: string;
  desiredOutcome: string;
  timeframe: string;
  sophisticationScore: number;
  assessmentData: Record<string, any>;
}

interface AssessmentStep {
  id: string;
  title: string;
  question: string;
  description?: string;
  icon: React.ReactNode;
  category: 'foundation' | 'business' | 'constraints' | 'goals';
  options: Array<{
    value: string;
    label: string;
    description?: string;
    icon?: React.ReactNode;
    followUp?: boolean;
    skipToStep?: string;
  }>;
  type: 'single' | 'multiple' | 'text';
  required?: boolean;
  validation?: (value: string) => string | null;
}

interface EnhancedBusinessAssessmentProps {
  onComplete?: (profile: BusinessProfile) => void;
}

export function EnhancedBusinessAssessment({ onComplete }: EnhancedBusinessAssessmentProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [profile, setProfile] = useState<BusinessProfile>({
    businessStage: 'complete_beginner',
    monthlyRevenue: '',
    primaryChallenge: '',
    businessType: '',
    industry: '',
    teamSize: '',
    currentOffers: '',
    marketingChannels: [],
    knowsMetrics: false,
    hasSystemsProcesses: false,
    biggestPainPoint: '',
    desiredOutcome: '',
    timeframe: '',
    sophisticationScore: 0,
    assessmentData: {}
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [validationError, setValidationError] = useState<string>('');

  const generateSteps = (): AssessmentStep[] => {
    const baseSteps: AssessmentStep[] = [
      {
        id: 'business_stage',
        title: 'Business Foundation',
        question: "What's your current business situation?",
        description: "This helps us tailor the exact frameworks and depth of analysis you need.",
        icon: <Building className="w-6 h-6" />,
        category: 'foundation',
        type: 'single',
        required: true,
        options: [
          {
            value: 'complete_beginner',
            label: "💡 I have an idea but no business yet",
            description: "Ready to start from scratch with proven frameworks",
            icon: <Lightbulb className="w-5 h-5 text-yellow-400" />
          },
          {
            value: 'have_business',
            label: "🏢 I have a business making some money",
            description: "Looking to identify what's holding me back from growth",
            icon: <Building className="w-5 h-5 text-blue-400" />
          },
          {
            value: 'scaling_business',
            label: "📈 I'm scaling but hitting roadblocks",
            description: "Need to break through specific constraints and bottlenecks",
            icon: <TrendingUp className="w-5 h-5 text-green-400" />
          },
          {
            value: 'experienced_operator',
            label: "🎯 I'm experienced, want advanced insights",
            description: "Skip basics, focus on advanced optimization strategies",
            icon: <Target className="w-5 h-5 text-purple-400" />
          }
        ]
      }
    ];

    // Industry selection for all stages
    baseSteps.push({
      id: 'industry',
      title: 'Industry Context',
      question: "What industry or niche are you in?",
      description: "This helps us apply industry-specific Alex Hormozi strategies.",
      icon: <BarChart className="w-6 h-6" />,
      category: 'business',
      type: 'single',
      required: true,
      options: [
        { value: 'coaching_consulting', label: "🎓 Coaching & Consulting", description: "Service-based knowledge business" },
        { value: 'ecommerce', label: "🛒 E-commerce & Products", description: "Physical or digital product sales" },
        { value: 'saas_software', label: "💻 SaaS & Software", description: "Subscription-based technology" },
        { value: 'agency_services', label: "🎯 Agency & Services", description: "Marketing, creative, or professional services" },
        { value: 'local_business', label: "📍 Local/Brick & Mortar", description: "Physical location-based business" },
        { value: 'health_fitness', label: "💪 Health & Fitness", description: "Gym, nutrition, wellness business" },
        { value: 'real_estate', label: "🏠 Real Estate & Investment", description: "Property, investment, finance" },
        { value: 'other', label: "🔧 Other Industry", description: "Tell us more about your specific niche" }
      ]
    });

    // Revenue stage for existing businesses
    if (answers.business_stage !== 'complete_beginner') {
      baseSteps.push({
        id: 'monthly_revenue',
        title: 'Revenue Scale',
        question: "What's your approximate monthly revenue?",
        description: "This determines which growth strategies will work best for your stage.",
        icon: <DollarSign className="w-6 h-6" />,
        category: 'business',
        type: 'single',
        required: true,
        options: [
          { 
            value: '0-1k', 
            label: "$0 - $1,000", 
            description: "Early validation stage - focus on Product-Market Fit",
            icon: <span className="text-red-400">🚀</span>
          },
          { 
            value: '1k-10k', 
            label: "$1,000 - $10,000", 
            description: "Growth stage - optimize core constraints",
            icon: <span className="text-yellow-400">📈</span>
          },
          { 
            value: '10k-50k', 
            label: "$10,000 - $50,000", 
            description: "Scale stage - systematic revenue optimization",
            icon: <span className="text-blue-400">⚡</span>
          },
          { 
            value: '50k-250k', 
            label: "$50,000 - $250,000", 
            description: "Optimization stage - advanced scaling strategies",
            icon: <span className="text-green-400">🎯</span>
          },
          { 
            value: '250k+', 
            label: "$250,000+", 
            description: "Enterprise stage - sophisticated systems and processes",
            icon: <span className="text-purple-400">👑</span>
          }
        ]
      });

      baseSteps.push({
        id: 'team_size',
        title: 'Team Structure',
        question: "How many people work in your business?",
        description: "Understanding your team helps us recommend the right operational frameworks.",
        icon: <Users className="w-6 h-6" />,
        category: 'business',
        type: 'single',
        required: true,
        options: [
          { value: 'solo', label: "🧑‍💼 Just me (solopreneur)", description: "Focus on leverage and automation" },
          { value: '2-5', label: "👥 2-5 team members", description: "Small team optimization strategies" },
          { value: '6-15', label: "🏢 6-15 employees", description: "Systems and process implementation" },
          { value: '16-50', label: "🏭 16-50 employees", description: "Management and delegation frameworks" },
          { value: '50+', label: "🏗️ 50+ employees", description: "Enterprise scaling and culture systems" }
        ]
      });
    }

    // Constraint identification - the heart of Hormozi methodology
    baseSteps.push({
      id: 'primary_challenge',
      title: 'Constraint Analysis',
      question: "Based on Alex Hormozi's 4 Universal Constraints, what's your biggest bottleneck?",
      description: "We'll use this to prioritize your constraint analysis and recommendations.",
      icon: <AlertCircle className="w-6 h-6" />,
      category: 'constraints',
      type: 'single',
      required: true,
      options: [
        { 
          value: 'leads', 
          label: "🎯 Not enough leads/traffic", 
          description: "Lead generation is your primary constraint",
          icon: <Target className="w-5 h-5 text-red-400" />
        },
        { 
          value: 'conversion', 
          label: "💬 Can't convert leads to sales", 
          description: "Sales conversion is your primary constraint",
          icon: <TrendingUp className="w-5 h-5 text-orange-400" />
        },
        { 
          value: 'delivery', 
          label: "📦 Struggling with delivery/fulfillment", 
          description: "Delivery/product constraint is holding you back",
          icon: <CheckCircle className="w-5 h-5 text-blue-400" />
        },
        { 
          value: 'profit', 
          label: "💰 Making money but no profit", 
          description: "Profit optimization is your main issue",
          icon: <DollarSign className="w-5 h-5 text-green-400" />
        },
        { 
          value: 'unsure', 
          label: "🤔 Not sure what the real problem is", 
          description: "Need comprehensive constraint analysis",
          icon: <Brain className="w-5 h-5 text-purple-400" />
        }
      ]
    });

    // Goals and outcomes
    baseSteps.push({
      id: 'desired_outcome',
      title: 'Success Vision',
      question: "What's your primary business goal in the next 90 days?",
      description: "This helps us create a focused action plan with clear milestones.",
      icon: <Star className="w-6 h-6" />,
      category: 'goals',
      type: 'single',
      required: true,
      options: [
        { value: 'validate_idea', label: "✨ Validate my business idea", description: "Test Product-Market Fit" },
        { value: 'first_customers', label: "🎉 Get my first paying customers", description: "Prove value proposition" },
        { value: 'double_revenue', label: "📈 Double my monthly revenue", description: "Scale existing success" },
        { value: 'systemize', label: "⚙️ Systemize and automate operations", description: "Work on the business, not in it" },
        { value: 'expand_offers', label: "🚀 Launch new products/services", description: "Diversify revenue streams" },
        { value: 'optimize_profit', label: "💎 Maximize profit margins", description: "Improve unit economics" }
      ]
    });

    // Sophistication assessment for experienced users
    if (answers.business_stage === 'experienced_operator' || answers.business_stage === 'scaling_business') {
      baseSteps.push({
        id: 'metrics_knowledge',
        title: 'Business Intelligence',
        question: "How well do you know your key business metrics?",
        description: "CAC, LTV, conversion rates, profit margins, etc.",
        icon: <BarChart className="w-6 h-6" />,
        category: 'business',
        type: 'single',
        required: true,
        options: [
          { 
            value: 'expert', 
            label: "📊 I track everything religiously", 
            description: "Advanced analytics and optimization ready",
            icon: <BarChart className="w-5 h-5 text-green-400" />
          },
          { 
            value: 'intermediate', 
            label: "📈 I know the basics", 
            description: "Some tracking, room for improvement",
            icon: <TrendingUp className="w-5 h-5 text-yellow-400" />
          },
          { 
            value: 'beginner', 
            label: "🎯 I want to learn metrics", 
            description: "Metrics-focused analysis and training",
            icon: <Target className="w-5 h-5 text-orange-400" />
          },
          { 
            value: 'simple', 
            label: "🎨 I prefer simple strategies", 
            description: "Framework-focused, less numbers",
            icon: <Lightbulb className="w-5 h-5 text-blue-400" />
          }
        ]
      });
    }

    return baseSteps;
  };

  const steps = generateSteps();
  const currentStepData = steps[currentStep];
  const isLastStep = currentStep >= steps.length - 1;
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  const validateAnswer = (stepId: string, value: string | string[]): string | null => {
    const step = steps.find(s => s.id === stepId);
    if (!step) return null;

    if (step.required && (!value || (Array.isArray(value) && value.length === 0))) {
      return 'This question is required to provide accurate recommendations.';
    }

    if (step.validation) {
      return step.validation(Array.isArray(value) ? value.join(',') : value);
    }

    return null;
  };

  const handleAnswer = (stepId: string, value: string | string[]) => {
    // Validate the answer
    const error = validateAnswer(stepId, value);
    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError('');
    
    const newAnswers = { ...answers, [stepId]: value };
    setAnswers(newAnswers);
    setCompletedSteps(prev => new Set([...prev, currentStep]));

    // Update profile based on answers
    const newProfile = { ...profile, assessmentData: newAnswers };
    
    // Calculate sophistication score
    let sophisticationScore = 1;
    
    if (newAnswers.business_stage) {
      const stageScores = {
        'complete_beginner': 1,
        'have_business': 3,
        'scaling_business': 6,
        'experienced_operator': 9
      };
      sophisticationScore = stageScores[newAnswers.business_stage as keyof typeof stageScores] || 1;
    }

    if (newAnswers.monthly_revenue) {
      const revenueBoost = {
        '0-1k': 0,
        '1k-10k': 1,
        '10k-50k': 2,
        '50k-250k': 3,
        '250k+': 4
      };
      sophisticationScore += revenueBoost[newAnswers.monthly_revenue as keyof typeof revenueBoost] || 0;
    }

    if (newAnswers.metrics_knowledge === 'expert') sophisticationScore += 2;
    if (newAnswers.metrics_knowledge === 'intermediate') sophisticationScore += 1;

    newProfile.sophisticationScore = sophisticationScore;
    newProfile.businessStage = newAnswers.business_stage as any || 'complete_beginner';
    newProfile.industry = newAnswers.industry as string || '';
    newProfile.monthlyRevenue = newAnswers.monthly_revenue as string || '';
    newProfile.primaryChallenge = newAnswers.primary_challenge as string || '';
    newProfile.teamSize = newAnswers.team_size as string || '';
    newProfile.knowsMetrics = ['expert', 'intermediate'].includes(newAnswers.metrics_knowledge as string);
    newProfile.desiredOutcome = newAnswers.desired_outcome as string || '';

    setProfile(newProfile);

    // Handle completion or advance
    if (isLastStep) {
      handleComplete(newProfile);
    } else {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleComplete = (finalProfile: BusinessProfile) => {
    // Store profile for analysis
    localStorage.setItem('businessProfile', JSON.stringify(finalProfile));
    localStorage.setItem('assessmentAnswers', JSON.stringify(answers));
    localStorage.setItem('assessmentCompleted', new Date().toISOString());

    // Call completion callback
    if (onComplete) {
      onComplete(finalProfile);
    }

    // Route to assessment results with profile data
    const profileParam = encodeURIComponent(JSON.stringify(finalProfile));
    
    // Show completion animation before routing
    setIsAnimating(true);
    setTimeout(() => {
      router.push(`/assessment-results?profile=${profileParam}`);
    }, 1000);
  };

  const determineNextRoute = (profile: BusinessProfile): string => {
    // High sophistication users - direct to agents
    if (profile.sophisticationScore >= 8) {
      return '/agents';
    }

    // Medium sophistication with specific constraint - targeted agent
    if (profile.sophisticationScore >= 4) {
      const constraintRoutes = {
        'leads': '/agents/constraint-analyzer',
        'conversion': '/agents/offer-analyzer', 
        'delivery': '/agents/implementation-planner',
        'profit': '/agents/financial-calculator',
        'unsure': '/agents/constraint-analyzer'
      };
      return constraintRoutes[profile.primaryChallenge as keyof typeof constraintRoutes] || '/chat';
    }

    // Beginners - start with guided chat
    return '/chat';
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'foundation': return <Building className="w-4 h-4" />;
      case 'business': return <BarChart className="w-4 h-4" />;
      case 'constraints': return <AlertCircle className="w-4 h-4" />;
      case 'goals': return <Star className="w-4 h-4" />;
      default: return <ChevronRight className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'foundation': return 'text-blue-400';
      case 'business': return 'text-green-400';
      case 'constraints': return 'text-red-400';
      case 'goals': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Progress Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex justify-between items-center mb-4">
            <Link href="/" className="text-gray-400 hover:text-white text-sm flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Home
            </Link>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>~3 minutes remaining</span>
            </div>
          </div>

          {/* Progress Bar with Steps */}
          <div className="relative">
            <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
              <div 
                className="h-3 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 transition-all duration-700 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            
            {/* Step Indicators */}
            <div className="flex justify-between mt-3">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    index < currentStep 
                      ? 'bg-green-500 text-white' 
                      : index === currentStep 
                        ? 'bg-purple-500 text-white animate-pulse' 
                        : 'bg-gray-600 text-gray-400'
                  }`}>
                    {index < currentStep ? <CheckCircle className="w-4 h-4" /> : index + 1}
                  </div>
                  <div className={`text-xs mt-2 text-center max-w-16 ${getCategoryColor(step.category)}`}>
                    <div className="flex items-center justify-center mb-1">
                      {getCategoryIcon(step.category)}
                    </div>
                    <span className="leading-tight">{step.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center mt-4">
            <span className="text-gray-400 text-sm">
              Step {currentStep + 1} of {steps.length} • {Math.round(progressPercentage)}% Complete
            </span>
          </div>
        </div>

        {/* Question Card */}
        <div className={`max-w-4xl mx-auto transition-all duration-300 ${isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
            
            {/* Question Header */}
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${getCategoryColor(currentStepData?.category || 'foundation').replace('text', 'bg').replace('-400', '-500/20')}`}>
                {currentStepData?.icon}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {currentStepData?.question}
              </h1>
              
              {currentStepData?.description && (
                <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                  {currentStepData.description}
                </p>
              )}
            </div>

            {/* Validation Error */}
            {validationError && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                <div className="flex items-center text-red-400">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {validationError}
                </div>
              </div>
            )}

            {/* Options */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
              {currentStepData?.options.map((option, index) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(currentStepData.id, option.value)}
                  className="group relative p-6 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 hover:border-purple-400/50 transition-all duration-200 text-left transform hover:scale-[1.02]"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  <div className="flex items-start space-x-4">
                    {option.icon && (
                      <div className="flex-shrink-0 mt-1">
                        {option.icon}
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                        {option.label}
                      </div>
                      {option.description && (
                        <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                          {option.description}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-shrink-0 text-2xl text-gray-400 group-hover:text-purple-400 transition-all duration-200 group-hover:transform group-hover:translate-x-1">
                      <ArrowRight className="w-6 h-6" />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-8 border-t border-white/10">
              <button
                onClick={goToPreviousStep}
                disabled={currentStep === 0}
                className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                  currentStep === 0 
                    ? 'text-gray-500 cursor-not-allowed' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </button>

              {/* Skip Option for Advanced Users */}
              {profile.sophisticationScore >= 8 && (
                <button
                  onClick={() => router.push('/agents')}
                  className="text-purple-400 hover:text-purple-300 underline text-sm"
                >
                  I'm experienced - skip to agent selection
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <div className="flex items-center justify-center space-x-8 text-gray-400">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
              <span className="text-sm">3-minute assessment</span>
            </div>
            <div className="flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-400" />
              <span className="text-sm">AI-powered insights</span>
            </div>
            <div className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-400" />
              <span className="text-sm">Instant results</span>
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-4">
            Used by thousands of entrepreneurs to identify and solve their biggest business constraints
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}