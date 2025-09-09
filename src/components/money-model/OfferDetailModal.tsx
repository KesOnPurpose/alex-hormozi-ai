'use client'

import { OfferEducation } from '@/types/money-model'

interface OfferDetailModalProps {
  offerEducation: OfferEducation
  offerName: string
  offerPrice: number
  onClose: () => void
  isOpen: boolean
}

export default function OfferDetailModal({ 
  offerEducation, 
  offerName, 
  offerPrice, 
  onClose, 
  isOpen 
}: OfferDetailModalProps) {
  if (!isOpen) return null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getFrameworkColor = (type: string) => {
    const colors = {
      'attraction-offer': 'from-blue-500 to-cyan-500',
      'core-offer': 'from-purple-500 to-pink-500',
      'upsell-stack': 'from-green-500 to-emerald-500',
      'continuity-program': 'from-red-500 to-orange-500',
      'win-back-guarantee': 'from-yellow-500 to-orange-500',
      'downsell-recovery': 'from-indigo-500 to-purple-500'
    }
    return colors[type as keyof typeof colors] || 'from-gray-500 to-slate-500'
  }

  const getFrameworkIcon = (type: string) => {
    const icons = {
      'attraction-offer': '🎯',
      'core-offer': '💎',
      'upsell-stack': '📈',
      'continuity-program': '🔁',
      'win-back-guarantee': '🛡️',
      'downsell-recovery': '🔄'
    }
    return icons[type as keyof typeof icons] || '💰'
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl max-w-4xl max-h-[90vh] overflow-hidden border border-white/10 w-full">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
              <span className="text-3xl">{getFrameworkIcon(offerEducation.framework.type)}</span>
              <span>{offerName}</span>
              <span className="text-green-400 text-xl">{formatCurrency(offerPrice)}</span>
            </h2>
            <div className={`inline-block bg-gradient-to-r ${getFrameworkColor(offerEducation.framework.type)} text-white px-3 py-1 rounded-full text-sm font-medium mt-2`}>
              {offerEducation.framework.name}
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="p-6 space-y-8">
            
            {/* Framework Overview */}
            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <span>📚</span>
                <span>Alex's Framework: {offerEducation.framework.name}</span>
              </h3>
              <div className="bg-white/5 rounded-xl p-6 space-y-4">
                <p className="text-gray-300 leading-relaxed">{offerEducation.framework.description}</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-green-400 font-semibold mb-3">✅ Key Principles</h4>
                    <ul className="space-y-2">
                      {offerEducation.framework.keyPrinciples.map((principle, index) => (
                        <li key={index} className="text-gray-300 text-sm flex items-start space-x-2">
                          <span className="text-green-400 mt-1">•</span>
                          <span>{principle}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-red-400 font-semibold mb-3">❌ Common Mistakes</h4>
                    <ul className="space-y-2">
                      {offerEducation.framework.commonMistakes.map((mistake, index) => (
                        <li key={index} className="text-gray-300 text-sm flex items-start space-x-2">
                          <span className="text-red-400 mt-1">•</span>
                          <span>{mistake}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Real Implementation */}
            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <span>🔍</span>
                <span>What This Actually Is</span>
              </h3>
              <div className="bg-purple-600/10 rounded-xl p-6 border border-purple-500/20 space-y-4">
                <p className="text-white font-medium text-lg leading-relaxed">
                  {offerEducation.realImplementation.whatItActuallyIs}
                </p>
                
                <div>
                  <h4 className="text-purple-400 font-semibold mb-3">Why This Works</h4>
                  <ul className="space-y-2">
                    {offerEducation.realImplementation.whyItWorks.map((reason, index) => (
                      <li key={index} className="text-gray-300 text-sm flex items-start space-x-2">
                        <span className="text-purple-400 mt-1">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-blue-400 font-semibold mb-3">🧠 Psychology Behind It</h4>
                  <p className="text-gray-300 text-sm italic leading-relaxed">
                    "{offerEducation.realImplementation.psychologyBehind}"
                  </p>
                </div>
              </div>
            </section>

            {/* Key Numbers */}
            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <span>📊</span>
                <span>Real Numbers & Metrics</span>
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {offerEducation.realImplementation.keyNumbers.map((number, index) => (
                  <div key={index} className="bg-green-600/10 rounded-xl p-4 border border-green-500/20">
                    <div className="text-green-400 text-2xl font-bold">{number.value}</div>
                    <div className="text-white font-medium text-sm">{number.metric}</div>
                    <div className="text-gray-400 text-xs mt-1">{number.context}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Alex's Masterclass Notes */}
            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <span>🎓</span>
                <span>Alex's Masterclass Notes</span>
              </h3>
              <div className="bg-gradient-to-r from-orange-600/10 to-red-600/10 rounded-xl p-6 border border-orange-500/20 space-y-4">
                
                {offerEducation.masterclassNotes.alexQuote && (
                  <div className="bg-white/10 rounded-lg p-4 border-l-4 border-orange-500">
                    <div className="text-orange-400 font-semibold text-sm mb-2">Alex Hormozi Quote:</div>
                    <blockquote className="text-white italic text-lg">
                      "{offerEducation.masterclassNotes.alexQuote}"
                    </blockquote>
                  </div>
                )}
                
                <div>
                  <h4 className="text-orange-400 font-semibold mb-3">Core Lesson</h4>
                  <p className="text-gray-300 leading-relaxed">{offerEducation.masterclassNotes.coreLesson}</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-green-400 font-semibold mb-3">💡 Implementation Tips</h4>
                    <ul className="space-y-2">
                      {offerEducation.masterclassNotes.implementationTips.map((tip, index) => (
                        <li key={index} className="text-gray-300 text-sm flex items-start space-x-2">
                          <span className="text-green-400 mt-1">✓</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-yellow-400 font-semibold mb-3">⚠️ Warning Signs</h4>
                    <ul className="space-y-2">
                      {offerEducation.masterclassNotes.warningsSigns.map((warning, index) => (
                        <li key={index} className="text-gray-300 text-sm flex items-start space-x-2">
                          <span className="text-yellow-400 mt-1">⚠</span>
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Flow Strategy */}
            {offerEducation.flowStrategy && (
              <section>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                  <span>🔄</span>
                  <span>Flow Strategy & Conversions</span>
                </h3>
                <div className="bg-blue-600/10 rounded-xl p-6 border border-blue-500/20 space-y-4">
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-blue-400 font-semibold mb-3">← How They Get Here</h4>
                      <p className="text-gray-300 text-sm">{offerEducation.flowStrategy.fromPrevious}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-blue-400 font-semibold mb-3">How They Move Forward →</h4>
                      <p className="text-gray-300 text-sm">{offerEducation.flowStrategy.toNext}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-purple-400 font-semibold mb-3">🎯 Conversion Tactics</h4>
                    <ul className="space-y-2">
                      {offerEducation.flowStrategy.conversionTactics.map((tactic, index) => (
                        <li key={index} className="text-gray-300 text-sm flex items-start space-x-2">
                          <span className="text-purple-400 mt-1">→</span>
                          <span>{tactic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-cyan-400 font-semibold mb-2">⏰ Timing Notes</h4>
                    <p className="text-gray-300 text-sm">{offerEducation.flowStrategy.timingNotes}</p>
                  </div>
                </div>
              </section>
            )}

            {/* Common Variations */}
            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <span>🔀</span>
                <span>Common Variations</span>
              </h3>
              <div className="bg-gray-600/10 rounded-xl p-6 border border-gray-500/20">
                <ul className="grid md:grid-cols-2 gap-3">
                  {offerEducation.realImplementation.commonVariations.map((variation, index) => (
                    <li key={index} className="text-gray-300 text-sm flex items-start space-x-2">
                      <span className="text-gray-400 mt-1">•</span>
                      <span>{variation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

          </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-slate-800/50">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">This breakdown is based on Alex Hormozi's proven frameworks and real business implementations.</p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all"
            >
              Got It!
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}