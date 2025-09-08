import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-4xl mb-4">🎯</div>
          <h1 className="text-6xl font-bold text-white mb-6">
            Alex Hormozi AI
            <span className="text-purple-400"> Coaching Orchestra</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-4">
            Get Alex Hormozi-style business coaching with AI-powered analysis using insights from 
            <span className="text-purple-400 font-semibold"> 1,260+ business consultations</span> and the 
            4 Universal Business Constraints framework.
          </p>
          <div className="text-sm text-gray-400 italic mb-8">
            "After meeting with 1,260+ businesses in person, we codified everything." - Alex Hormozi
          </div>
          
          {/* Main CTA */}
          <div className="mb-8">
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all hover:scale-105 shadow-lg">
              🎯 Start Business Analysis
            </button>
            <p className="text-gray-300 mt-3 text-sm">
              Get personalized insights from Alex Hormozi's business methodology
            </p>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <ActionCard
            title="Constraint Analysis"
            description="Identify your primary business bottleneck using the 4 Universal Constraints"
            icon="🔍"
            href="/constraint-analyzer"
          />
          <ActionCard
            title="Money Model Architect"
            description="Design and optimize your revenue architecture for maximum profitability"
            icon="💰"
            href="/money-model-architect"
            featured={true}
          />
          <ActionCard
            title="Offer Optimizer"
            description="Transform your offers using the Grand Slam Offer framework"
            icon="💎"
            href="/offer-analyzer"
          />
        </div>

        {/* All 8 AI Agents */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Complete AI Coaching Orchestra
          </h2>
          <p className="text-gray-300 mb-8">8 Specialized Agents Working Together</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <FeatureCard
              title="Master Conductor"
              description="Routes queries to the right specialist agents"
              icon="🎭"
              isNew={true}
            />
            <FeatureCard
              title="Constraint Analyzer"
              description="4 Universal Constraints diagnostic"
              icon="🔍"
            />
            <FeatureCard
              title="Offer Analyzer"
              description="Grand Slam Offer framework"
              icon="💎"
            />
            <FeatureCard
              title="Financial Calculator"
              description="CFA analysis & unit economics"
              icon="📊"
            />
            <FeatureCard
              title="Money Model Architect"
              description="4-Prong revenue optimization"
              icon="💰"
            />
            <FeatureCard
              title="Psychology Optimizer"
              description="5 Upsell Moments & conversion"
              icon="🧠"
            />
            <FeatureCard
              title="Implementation Planner"
              description="Action plans & execution roadmaps"
              icon="✅"
            />
            <FeatureCard
              title="Coaching Methodology"
              description="Complete Alex Hormozi framework"
              icon="🎓"
            />
          </div>
        </div>

        {/* Core Principles */}
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-white mb-6">Alex's Core Principles</h3>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <PrincipleCard 
              quote="There are only 4 ways to grow a business - fix one at a time"
              principle="Constraint-Based Growth"
            />
            <PrincipleCard 
              quote="This is a speed game - identify fast, implement faster"
              principle="Speed & Execution"
            />
            <PrincipleCard 
              quote="Simple scales, fancy fails"
              principle="Simplicity First"
            />
            <PrincipleCard 
              quote="CFA is the holy grail of business models"
              principle="Cash Flow Positive Growth"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function ActionCard({ title, description, icon, href, featured = false }: {
  title: string
  description: string
  icon: string
  href: string
  featured?: boolean
}) {
  return (
    <Link href={href}>
      <div className={`backdrop-blur-lg rounded-xl p-8 hover:scale-105 transition-all cursor-pointer border ${
        featured 
          ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-400/50' 
          : 'bg-white/10 border-white/20 hover:bg-white/20'
      }`}>
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-300">{description}</p>
        {featured && (
          <div className="mt-4 text-purple-400 text-sm font-semibold">
            🚀 START HERE
          </div>
        )}
      </div>
    </Link>
  )
}

function FeatureCard({ title, description, icon, isNew = false }: {
  title: string
  description: string
  icon: string
  isNew?: boolean
}) {
  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6 border border-white/10 relative">
      {isNew && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
          NEW
        </div>
      )}
      <div className="text-3xl mb-3">{icon}</div>
      <h4 className="text-lg font-semibold text-white mb-2">{title}</h4>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  )
}

function PrincipleCard({ quote, principle }: {
  quote: string
  principle: string
}) {
  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6 border border-white/10">
      <div className="text-purple-400 font-semibold mb-2">{principle}</div>
      <div className="text-gray-300 italic">"{quote}"</div>
    </div>
  )
}