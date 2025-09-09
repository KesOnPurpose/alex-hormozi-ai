'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Target, 
  BarChart3, 
  Zap,
  CheckCircle2,
  AlertCircle,
  Download,
  Eye,
  Brain,
  Calculator
} from 'lucide-react';

export interface AnalysisResult {
  documentType: 'financial' | 'marketing' | 'business_plan' | 'transcript' | 'unknown';
  confidence: number;
  extractedData: Record<string, any>;
  hormoziAnalysis: {
    constraints: string[];
    recommendations: string[];
    frameworks: string[];
    actionItems: string[];
  };
  metrics: {
    revenue?: number;
    cac?: number;
    ltv?: number;
    margins?: number;
    growthRate?: number;
  };
  insights: {
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    framework: string;
  }[];
}

interface DocumentAnalyzerProps {
  files: File[];
  textInput: string;
  onAnalysisComplete: (results: AnalysisResult[]) => void;
  onAnalysisStart: () => void;
}

export function DocumentAnalyzer({ files, textInput, onAnalysisComplete, onAnalysisStart }: DocumentAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('');
  const [progress, setProgress] = useState(0);

  const analyzeDocuments = async () => {
    setIsAnalyzing(true);
    onAnalysisStart();
    
    try {
      // Step 1: Document Processing
      setAnalysisStep('Processing documents...');
      setProgress(20);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 2: Content Extraction
      setAnalysisStep('Extracting business data...');
      setProgress(40);
      const extractedContent = await extractDocumentContent();
      
      // Step 3: Framework Application
      setAnalysisStep('Applying Hormozi frameworks...');
      setProgress(60);
      const frameworkAnalysis = await applyHormoziFrameworks(extractedContent);
      
      // Step 4: Insight Generation
      setAnalysisStep('Generating actionable insights...');
      setProgress(80);
      const insights = await generateInsights(frameworkAnalysis);
      
      // Step 5: Complete Analysis
      setAnalysisStep('Finalizing analysis...');
      setProgress(100);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const results: AnalysisResult[] = [
        {
          documentType: determineDocumentType(),
          confidence: 0.92,
          extractedData: extractedContent,
          hormoziAnalysis: frameworkAnalysis,
          metrics: {
            revenue: 45000,
            cac: 150,
            ltv: 2400,
            margins: 0.68,
            growthRate: 0.15
          },
          insights
        }
      ];
      
      onAnalysisComplete(results);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
      setProgress(0);
      setAnalysisStep('');
    }
  };

  const extractDocumentContent = async () => {
    // Simulate document processing with realistic data
    return {
      businessName: "Premium Coaching Solutions",
      industry: "Coaching & Consulting",
      monthlyRevenue: "$45,000",
      customerCount: 85,
      avgOrderValue: "$529",
      conversionRate: "12%",
      marketingChannels: ["Facebook Ads", "Email Marketing", "Referrals"],
      mainOffers: ["1-on-1 Coaching", "Group Program", "Digital Course"],
      painPoints: ["Lead quality inconsistent", "Price objections", "Fulfillment bottlenecks"]
    };
  };

  const applyHormoziFrameworks = async (content: any) => {
    return {
      constraints: [
        "Lead Generation: Inconsistent lead quality affecting conversion rates",
        "Sales Conversion: Price objections indicate value perception issues", 
        "Fulfillment: Manual processes creating delivery bottlenecks"
      ],
      recommendations: [
        "Implement Grand Slam Offer framework to eliminate price objections",
        "Build 4-Prong Money Model with upsells and continuity",
        "Apply Client Financed Acquisition to improve unit economics",
        "Systematize delivery with repeatable processes"
      ],
      frameworks: [
        "Grand Slam Offer",
        "4-Prong Money Model", 
        "Client Financed Acquisition",
        "Value Equation"
      ],
      actionItems: [
        "Create irresistible offer with 10x value-to-price ratio",
        "Design upsell sequence for existing customers",
        "Implement referral program with financial incentives",
        "Build standard operating procedures for coaching delivery"
      ]
    };
  };

  const generateInsights = async (analysis: any) => {
    return [
      {
        title: "Value Perception Crisis",
        description: "Price objections indicate your offer isn't positioned as a no-brainer. Apply Hormozi's Value Equation: increase dream outcome and likelihood of success while reducing time delay and effort.",
        priority: 'high' as const,
        framework: "Value Equation"
      },
      {
        title: "Untapped Revenue Potential",
        description: "85 customers paying $529 average = significant upsell opportunity. Implement 4-Prong Money Model to 2-3x revenue from existing customer base.",
        priority: 'high' as const,
        framework: "4-Prong Money Model"
      },
      {
        title: "Fulfillment Bottleneck",
        description: "Manual delivery processes limit scalability. Systematize with templates, frameworks, and delegation systems.",
        priority: 'medium' as const,
        framework: "Systems & Processes"
      }
    ];
  };

  const determineDocumentType = (): AnalysisResult['documentType'] => {
    if (files.some(f => f.name.includes('financial') || f.name.includes('revenue'))) return 'financial';
    if (files.some(f => f.name.includes('marketing') || f.name.includes('copy'))) return 'marketing';
    if (textInput.toLowerCase().includes('business plan') || textInput.toLowerCase().includes('strategy')) return 'business_plan';
    return 'unknown';
  };

  return (
    <div className="space-y-6">
      {/* Analysis Trigger */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-600 rounded-lg p-2">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Alex Hormozi AI Analysis</h3>
              <p className="text-gray-400 text-sm">Advanced document processing with proven frameworks</p>
            </div>
          </div>
          <button
            onClick={analyzeDocuments}
            disabled={isAnalyzing || (files.length === 0 && !textInput.trim())}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                <span>Start Analysis</span>
              </>
            )}
          </button>
        </div>

        {/* Progress Indicator */}
        {isAnalyzing && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">{analysisStep}</span>
              <span className="text-purple-400">{progress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Analysis Capabilities Preview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnalysisCapability
          icon={<Target className="h-5 w-5" />}
          title="Constraint Analysis"
          description="Identify bottlenecks using 4 Universal Constraints framework"
        />
        <AnalysisCapability
          icon={<DollarSign className="h-5 w-5" />}
          title="Money Model Design"
          description="Build 4-prong revenue optimization system"
        />
        <AnalysisCapability
          icon={<TrendingUp className="h-5 w-5" />}
          title="Metrics Extraction"
          description="Calculate CAC, LTV, and profitability ratios"
        />
        <AnalysisCapability
          icon={<FileText className="h-5 w-5" />}
          title="Offer Analysis"
          description="Apply Grand Slam Offer framework to your positioning"
        />
        <AnalysisCapability
          icon={<BarChart3 className="h-5 w-5" />}
          title="Value Equation"
          description="Optimize dream outcome, likelihood, time, and effort"
        />
        <AnalysisCapability
          icon={<Calculator className="h-5 w-5" />}
          title="Unit Economics"
          description="CFA and payback period optimization"
        />
      </div>

      {/* Framework Application Preview */}
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl p-6 border border-purple-400/30">
        <div className="flex items-center space-x-3 mb-4">
          <CheckCircle2 className="h-6 w-6 text-purple-400" />
          <h4 className="text-lg font-semibold text-white">Proven Framework Application</h4>
        </div>
        <p className="text-gray-300 mb-4">
          Your documents will be analyzed through the lens of Alex Hormozi's battle-tested frameworks, 
          refined through 1,260+ business consultations.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <FrameworkBadge name="Grand Slam Offer" />
          <FrameworkBadge name="4-Prong Money Model" />
          <FrameworkBadge name="Client Financed Acquisition" />
          <FrameworkBadge name="Value Equation" />
        </div>
      </div>
    </div>
  );
}

function AnalysisCapability({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
      <div className="flex items-center space-x-3 mb-2">
        <div className="text-purple-400">{icon}</div>
        <h5 className="font-medium text-white">{title}</h5>
      </div>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}

function FrameworkBadge({ name }: { name: string }) {
  return (
    <div className="bg-white/10 rounded-full px-3 py-1 text-xs text-purple-300 border border-purple-400/30">
      {name}
    </div>
  );
}