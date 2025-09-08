'use client'

import Link from 'next/link'

export default function DashboardPage() {
  // Mock data for demonstration
  const businessMetrics = {
    cac: 250,
    thirtyDayGP: 520,
    ltv: 2400,
    paybackPeriod: 1.2,
    level: "Level 2 - Self-Funding Growth"
  }

  const recentAnalyses = [
    {
      id: 1,
      type: "Offer Analysis",
      business: "Coaching Business",
      date: "2024-01-15",
      status: "completed",
      insights: 3
    },
    {
      id: 2,
      type: "Money Model",
      business: "SaaS Product",
      date: "2024-01-14",
      status: "completed",
      insights: 5
    },
    {
      id: 3,
      type: "Financial Analysis",
      business: "E-commerce Store",
      date: "2024-01-13",
      status: "completed",
      insights: 4
    }
  ]

  const recommendations = [
    {
      id: 1,
      type: "High Priority",
      title: "Add Upsell Offer",
      description: "Create a $497 implementation intensive to capture revenue immediately after main sale",
      impact: "Could increase 30-day GP by 40%",
      status: "pending"
    },
    {
      id: 2,
      type: "Medium Priority", 
      title: "Implement Downsell",
      description: "Add a $97/month coaching access for people who don't buy the main offer",
      impact: "Could recover 15-25% of 'no' responses",
      status: "pending"
    },
    {
      id: 3,
      type: "Implementation",
      title: "Set Up Payment Plans",
      description: "Offer 3-pay option to reduce friction on main offer",
      impact: "Likely 20-30% conversion increase",
      status: "in_progress"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <Link href="/" className="text-purple-400 hover:text-purple-300 mb-2 inline-block">
              ← Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-white">Business Dashboard</h1>
            <p className="text-gray-300">Your Alex Hormozi AI analysis overview</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Current Status</div>
            <div className="text-lg font-semibold text-green-400">{businessMetrics.level}</div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <MetricCard
            title="CAC"
            value={`$${businessMetrics.cac}`}
            subtitle="Customer Acquisition Cost"
            trend="+12%"
            trendPositive={false}
          />
          <MetricCard
            title="30-Day GP"
            value={`$${businessMetrics.thirtyDayGP}`}
            subtitle="30-Day Gross Profit"
            trend="+24%"
            trendPositive={true}
          />
          <MetricCard
            title="LTV"
            value={`$${businessMetrics.ltv}`}
            subtitle="Lifetime Value"
            trend="+18%"
            trendPositive={true}
          />
          <MetricCard
            title="Payback"
            value={`${businessMetrics.paybackPeriod} mo`}
            subtitle="Payback Period"
            trend="-0.3 mo"
            trendPositive={true}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Recent Analyses */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-6">Recent Analyses</h2>
            <div className="space-y-4">
              {recentAnalyses.map((analysis) => (
                <div key={analysis.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full mr-3">
                          {analysis.type}
                        </span>
                        <span className="text-sm text-gray-400">{analysis.date}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-1">{analysis.business}</h3>
                      <p className="text-gray-400 text-sm">{analysis.insights} insights generated</p>
                    </div>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <ActionButton
                title="New Analysis"
                description="Analyze new business data"
                icon="🔍"
                href="/upload"
              />
              <ActionButton
                title="Chat with Alex AI"
                description="Ask questions about your business"
                icon="💬"
                href="/chat"
              />
              <ActionButton
                title="Export Report"
                description="Download PDF analysis"
                icon="📄"
                onClick={() => {}}
              />
              <ActionButton
                title="Team Collaboration"
                description="Share insights with team"
                icon="👥"
                onClick={() => {}}
              />
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">AI Recommendations</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec) => (
              <div key={rec.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    rec.type === 'High Priority' 
                      ? 'bg-red-500 text-white' 
                      : rec.type === 'Medium Priority'
                      ? 'bg-yellow-500 text-black'
                      : 'bg-blue-500 text-white'
                  }`}>
                    {rec.type}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    rec.status === 'pending'
                      ? 'bg-gray-500 text-white'
                      : 'bg-green-500 text-white'
                  }`}>
                    {rec.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{rec.title}</h3>
                <p className="text-gray-400 text-sm mb-3">{rec.description}</p>
                <p className="text-green-400 text-sm font-medium mb-4">{rec.impact}</p>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm">
                  Implement
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value, subtitle, trend, trendPositive }: {
  title: string
  value: string
  subtitle: string
  trend: string
  trendPositive: boolean
}) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <span className={`text-sm ${trendPositive ? 'text-green-400' : 'text-red-400'}`}>
          {trend}
        </span>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-gray-500">{subtitle}</div>
    </div>
  )
}

function ActionButton({ title, description, icon, href, onClick }: {
  title: string
  description: string
  icon: string
  href?: string
  onClick?: () => void
}) {
  const content = (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all cursor-pointer">
      <div className="flex items-center mb-2">
        <span className="text-2xl mr-3">{icon}</span>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return <button onClick={onClick}>{content}</button>
}