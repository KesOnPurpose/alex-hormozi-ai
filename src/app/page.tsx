import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Steve Jobs Style - Single Focus */}
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-8">🎯</div>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Transform Your Business
            <span className="text-purple-400 block mt-2"> Like Alex Hormozi</span>
          </h1>
          
          <p className="text-2xl text-gray-200 mb-6 max-w-3xl mx-auto leading-relaxed">
            Get the exact frameworks that scaled 1,260+ businesses. 
            <span className="text-purple-300"> One simple analysis.</span>
          </p>

          <div className="text-lg text-gray-400 italic mb-12 max-w-2xl mx-auto">
            &quot;After meeting with 1,260+ businesses in person, we codified everything into a system that works every time.&quot; - Alex Hormozi
          </div>
          
          {/* Single Powerful CTA */}
          <div className="mb-16">
            <Link href="/start">
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-6 px-12 rounded-2xl text-2xl transition-all hover:scale-105 shadow-2xl">
                Start Your Business Transformation
                <span className="block text-lg mt-1 opacity-90">Takes 3 minutes • Get instant insights</span>
              </button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="flex justify-center items-center space-x-8 mb-16 text-gray-400">
            <div className="flex items-center">
              <div className="text-2xl mr-2">⚡</div>
              <span>Instant Analysis</span>
            </div>
            <div className="flex items-center">
              <div className="text-2xl mr-2">🎯</div>
              <span>Proven Frameworks</span>
            </div>
            <div className="flex items-center">
              <div className="text-2xl mr-2">📈</div>
              <span>Real Growth</span>
            </div>
          </div>
        </div>

        {/* Expert Access - Minimized but Available */}
        <div className="max-w-2xl mx-auto text-center">
          <details className="group">
            <summary className="cursor-pointer text-gray-400 hover:text-white transition-colors mb-6">
              <span className="text-sm">Already know your constraint? </span>
              <span className="text-purple-400 underline">Skip to specific frameworks</span>
            </summary>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <ActionCard
                title="Constraint Analysis"
                description="Identify your bottleneck"
                icon="🔍"
                href="/agents/constraint-analyzer"
                compact={true}
              />
              <ActionCard
                title="Money Model"
                description="Revenue architecture"
                icon="💰"
                href="/agents/money-model-architect"
                compact={true}
              />
              <ActionCard
                title="Offer Optimizer"
                description="Grand Slam Offers"
                icon="💎"
                href="/agents/offer-analyzer"
                compact={true}
              />
              <ActionCard
                title="All 8 Agents"
                description="Direct access"
                icon="🎭"
                href="/agents"
                compact={true}
              />
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}

function ActionCard({ title, description, icon, href, featured = false, compact = false }: {
  title: string
  description: string
  icon: string
  href: string
  featured?: boolean
  compact?: boolean
}) {
  const cardClass = compact 
    ? "backdrop-blur-lg rounded-lg p-4 hover:scale-105 transition-all cursor-pointer border bg-white/5 border-white/10 hover:bg-white/10"
    : `backdrop-blur-lg rounded-xl p-8 hover:scale-105 transition-all cursor-pointer border ${
        featured 
          ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-400/50' 
          : 'bg-white/10 border-white/20 hover:bg-white/20'
      }`
  
  return (
    <Link href={href}>
      <div className={cardClass}>
        <div className={compact ? "text-2xl mb-2" : "text-4xl mb-4"}>{icon}</div>
        <h3 className={compact ? "text-sm font-bold text-white mb-1" : "text-xl font-bold text-white mb-2"}>{title}</h3>
        <p className={compact ? "text-xs text-gray-400" : "text-gray-300"}>{description}</p>
        {featured && !compact && (
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
      <div className="text-gray-300 italic">&quot;{quote}&quot;</div>
    </div>
  )
}