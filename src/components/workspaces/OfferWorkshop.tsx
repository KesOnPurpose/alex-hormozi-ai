import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { BusinessProfile } from '@/lib/supabase/types'
import { ConversationMemory } from '@/components/conversation/ConversationMemory'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Target, 
  Zap, 
  DollarSign, 
  Clock, 
  Users, 
  Star,
  Lightbulb,
  CheckCircle,
  TrendingUp,
  Award,
  Calculator
} from 'lucide-react'

interface OfferWorkshopProps {
  businessProfile: BusinessProfile
}

interface OfferComponents {
  dreamOutcome: string
  perceivedLikelihood: string
  timeDelay: string
  effortSacrifice: string
}

interface ValueStack {
  name: string
  value: number
  type: 'core' | 'bonus' | 'guarantee'
  description: string
}

export function OfferWorkshop({ businessProfile }: OfferWorkshopProps) {
  const { userProfile } = useAuth()
  const [offerComponents, setOfferComponents] = useState<OfferComponents>({
    dreamOutcome: '',
    perceivedLikelihood: '',
    timeDelay: '',
    effortSacrifice: ''
  })

  const [valueStack, setValueStack] = useState<ValueStack[]>([
    { name: 'Core Product/Service', value: 0, type: 'core', description: '' }
  ])

  const [currentPrice, setCurrentPrice] = useState<number>(0)
  const [proposedPrice, setProposedPrice] = useState<number>(0)
  const [offerScore, setOfferScore] = useState<number>(0)

  const businessLevel = userProfile?.business_level || 'beginner'
  const isAdvanced = ['scale', 'enterprise'].includes(businessLevel)

  // Calculate offer score based on components
  useEffect(() => {
    let score = 0
    
    // Dream Outcome (0-25 points)
    if (offerComponents.dreamOutcome.length > 50) score += 25
    else if (offerComponents.dreamOutcome.length > 20) score += 15
    else if (offerComponents.dreamOutcome.length > 0) score += 5

    // Perceived Likelihood (0-25 points)  
    if (offerComponents.perceivedLikelihood.length > 50) score += 25
    else if (offerComponents.perceivedLikelihood.length > 20) score += 15
    else if (offerComponents.perceivedLikelihood.length > 0) score += 5

    // Time Delay (0-25 points)
    if (offerComponents.timeDelay.length > 30) score += 25
    else if (offerComponents.timeDelay.length > 10) score += 15
    else if (offerComponents.timeDelay.length > 0) score += 5

    // Effort & Sacrifice (0-25 points)
    if (offerComponents.effortSacrifice.length > 30) score += 25
    else if (offerComponents.effortSacrifice.length > 10) score += 15
    else if (offerComponents.effortSacrifice.length > 0) score += 5

    setOfferScore(score)
  }, [offerComponents])

  const addValueStackItem = () => {
    setValueStack([...valueStack, { 
      name: '', 
      value: 0, 
      type: 'bonus', 
      description: '' 
    }])
  }

  const updateValueStackItem = (index: number, field: keyof ValueStack, value: any) => {
    const updated = [...valueStack]
    updated[index] = { ...updated[index], [field]: value }
    setValueStack(updated)
  }

  const removeValueStackItem = (index: number) => {
    setValueStack(valueStack.filter((_, i) => i !== index))
  }

  const totalValueStackWorth = valueStack.reduce((sum, item) => sum + item.value, 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getOfferGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', color: 'text-green-600', description: 'Grand Slam Offer!' }
    if (score >= 80) return { grade: 'A', color: 'text-green-500', description: 'Excellent Offer' }
    if (score >= 70) return { grade: 'B', color: 'text-blue-500', description: 'Good Offer' }
    if (score >= 60) return { grade: 'C', color: 'text-yellow-500', description: 'Average Offer' }
    return { grade: 'D', color: 'text-red-500', description: 'Needs Work' }
  }

  const offerGrade = getOfferGrade(offerScore)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🎯 Grand Slam Offer Workshop
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Create an offer so good, people feel stupid saying no
        </p>
        
        {businessLevel === 'beginner' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5" />
              <div className="text-left">
                <h3 className="font-semibold text-blue-900">What is a Grand Slam Offer?</h3>
                <p className="text-blue-800 text-sm mt-1">
                  Alex Hormozi's framework for creating irresistible offers. It's about making your offer so valuable 
                  and removing so much risk that customers would feel foolish not to buy.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Offer Score */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Award className="w-6 h-6" />
              <span>Offer Score</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className={`text-4xl font-bold ${offerGrade.color} mb-2`}>
              {offerGrade.grade}
            </div>
            <div className="text-lg font-semibold text-gray-700 mb-3">
              {offerGrade.description}
            </div>
            <Progress value={offerScore} className="w-full mb-2" />
            <div className="text-sm text-gray-600">
              {offerScore}/100 points
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Workshop */}
      <Tabs defaultValue="value-equation" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="value-equation">Value Equation</TabsTrigger>
          <TabsTrigger value="value-stack">Value Stack</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="ai-coach">AI Coach</TabsTrigger>
        </TabsList>

        <TabsContent value="value-equation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Alex's Value Equation</span>
              </CardTitle>
              <CardDescription>
                {businessLevel === 'beginner' ? 
                  'The formula for creating irresistible offers that customers can\'t refuse' :
                  'Optimize each component of the value equation for maximum impact'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {businessLevel === 'beginner' && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold mb-2">The Formula:</h4>
                  <div className="text-center text-lg">
                    <strong>Value = (Dream Outcome × Perceived Likelihood) ÷ (Time Delay × Effort & Sacrifice)</strong>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    To increase value: Increase what they want and their belief you can deliver it, 
                    while decreasing how long it takes and how much work they have to do.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Dream Outcome */}
                <Card className="border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-700">
                      <Star className="w-4 h-4 mr-2" />
                      Dream Outcome ↑
                    </CardTitle>
                    <CardDescription>
                      {businessLevel === 'beginner' ? 
                        'What amazing result will your customer get?' :
                        'Define the ultimate transformation or result'
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder={businessLevel === 'beginner' ? 
                        "e.g., 'Lose 30 pounds and feel confident in any outfit'" :
                        "Describe the specific, measurable outcome your customer desires most..."
                      }
                      value={offerComponents.dreamOutcome}
                      onChange={(e) => setOfferComponents({
                        ...offerComponents,
                        dreamOutcome: e.target.value
                      })}
                      className="min-h-[100px]"
                    />
                    {businessLevel === 'beginner' && (
                      <div className="mt-2 text-xs text-gray-600">
                        💡 Tip: Be specific! "Make money" is vague. "Earn $10,000/month" is better.
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Perceived Likelihood */}
                <Card className="border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-blue-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Perceived Likelihood ↑
                    </CardTitle>
                    <CardDescription>
                      {businessLevel === 'beginner' ? 
                        'Why should they believe you can deliver this result?' :
                        'Build credibility and reduce perceived risk'
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder={businessLevel === 'beginner' ? 
                        "e.g., 'I've helped 500+ clients lose weight with proven system'" :
                        "List your credentials, testimonials, guarantees, case studies..."
                      }
                      value={offerComponents.perceivedLikelihood}
                      onChange={(e) => setOfferComponents({
                        ...offerComponents,
                        perceivedLikelihood: e.target.value
                      })}
                      className="min-h-[100px]"
                    />
                    {businessLevel === 'beginner' && (
                      <div className="mt-2 text-xs text-gray-600">
                        💡 Tip: Include numbers, testimonials, and guarantees to build trust.
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Time Delay */}
                <Card className="border-orange-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-orange-700">
                      <Clock className="w-4 h-4 mr-2" />
                      Time Delay ↓
                    </CardTitle>
                    <CardDescription>
                      {businessLevel === 'beginner' ? 
                        'How can you make results happen faster?' :
                        'Strategies to accelerate time to value'
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder={businessLevel === 'beginner' ? 
                        "e.g., 'See results in first 7 days with our quick-start program'" :
                        "Detail how you'll minimize time to first result and final outcome..."
                      }
                      value={offerComponents.timeDelay}
                      onChange={(e) => setOfferComponents({
                        ...offerComponents,
                        timeDelay: e.target.value
                      })}
                      className="min-h-[100px]"
                    />
                    {businessLevel === 'beginner' && (
                      <div className="mt-2 text-xs text-gray-600">
                        💡 Tip: Even if full results take time, give them something valuable immediately.
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Effort & Sacrifice */}
                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-red-700">
                      <Zap className="w-4 h-4 mr-2" />
                      Effort & Sacrifice ↓
                    </CardTitle>
                    <CardDescription>
                      {businessLevel === 'beginner' ? 
                        'How can you make this easier for them?' :
                        'Remove friction and make it effortless'
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder={businessLevel === 'beginner' ? 
                        "e.g., 'Done-for-you meal plans, no cooking or planning required'" :
                        "Explain how you'll eliminate obstacles, provide tools, do the work for them..."
                      }
                      value={offerComponents.effortSacrifice}
                      onChange={(e) => setOfferComponents({
                        ...offerComponents,
                        effortSacrifice: e.target.value
                      })}
                      className="min-h-[100px]"
                    />
                    {businessLevel === 'beginner' && (
                      <div className="mt-2 text-xs text-gray-600">
                        💡 Tip: What part of the work can you do FOR them instead of having them do it?
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="value-stack" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Value Stack Builder</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Total Stack Value</div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(totalValueStackWorth)}
                  </div>
                </div>
              </CardTitle>
              <CardDescription>
                {businessLevel === 'beginner' ? 
                  'List everything you\'re giving them and assign dollar values to show incredible value' :
                  'Build a compelling value stack that justifies your premium pricing'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {valueStack.map((item, index) => (
                <Card key={index} className="border-dashed">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-sm font-medium">Item Name</label>
                        <Input
                          placeholder="e.g., Training Course"
                          value={item.name}
                          onChange={(e) => updateValueStackItem(index, 'name', e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Value</label>
                        <Input
                          type="number"
                          placeholder="999"
                          value={item.value || ''}
                          onChange={(e) => updateValueStackItem(index, 'value', Number(e.target.value))}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Type</label>
                        <select
                          value={item.type}
                          onChange={(e) => updateValueStackItem(index, 'type', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="core">Core Product</option>
                          <option value="bonus">Bonus</option>
                          <option value="guarantee">Guarantee</option>
                        </select>
                      </div>

                      <div className="flex items-end">
                        {index > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeValueStackItem(index)}
                            className="text-red-600"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        placeholder="What exactly does this include and why is it valuable?"
                        value={item.description}
                        onChange={(e) => updateValueStackItem(index, 'description', e.target.value)}
                        rows={2}
                      />
                    </div>

                    <Badge variant={
                      item.type === 'core' ? 'default' :
                      item.type === 'bonus' ? 'secondary' :
                      'outline'
                    } className="mt-2">
                      {item.type} • {formatCurrency(item.value)}
                    </Badge>
                  </CardContent>
                </Card>
              ))}

              <Button onClick={addValueStackItem} variant="dashed" className="w-full">
                + Add Value Stack Item
              </Button>

              {businessLevel === 'beginner' && totalValueStackWorth > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">💡 Value Stack Tip:</h4>
                  <p className="text-green-800 text-sm">
                    Your total value stack is worth {formatCurrency(totalValueStackWorth)}. 
                    Now you can price your offer at a fraction of this total value and it will feel like an incredible deal!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="w-5 h-5" />
                  <span>Pricing Strategy</span>
                </CardTitle>
                <CardDescription>
                  Set the perfect price point for your Grand Slam Offer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Current Price</label>
                  <Input
                    type="number"
                    placeholder="997"
                    value={currentPrice || ''}
                    onChange={(e) => setCurrentPrice(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Proposed New Price</label>
                  <Input
                    type="number"
                    placeholder="1997"
                    value={proposedPrice || ''}
                    onChange={(e) => setProposedPrice(Number(e.target.value))}
                  />
                </div>

                {currentPrice > 0 && proposedPrice > 0 && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Price Change Analysis</h4>
                    <div className="space-y-1 text-sm">
                      <div>Price Increase: {formatCurrency(proposedPrice - currentPrice)}</div>
                      <div>Percentage Increase: {(((proposedPrice - currentPrice) / currentPrice) * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                )}

                {totalValueStackWorth > 0 && proposedPrice > 0 && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Value-to-Price Ratio</h4>
                    <div className="space-y-1 text-sm">
                      <div>Total Value: {formatCurrency(totalValueStackWorth)}</div>
                      <div>Your Price: {formatCurrency(proposedPrice)}</div>
                      <div className="font-semibold">
                        Value Multiple: {(totalValueStackWorth / proposedPrice).toFixed(1)}x
                      </div>
                      {(totalValueStackWorth / proposedPrice) >= 10 && (
                        <div className="text-green-700 font-medium">
                          🎯 Excellent! 10x+ value ratio creates irresistible offers
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing Psychology</CardTitle>
                <CardDescription>
                  {businessLevel === 'beginner' ? 
                    'Simple pricing strategies that work' :
                    'Advanced pricing optimization techniques'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                    <h4 className="font-medium text-blue-900">Anchoring Strategy</h4>
                    <p className="text-sm text-blue-800">
                      Show the high value stack first, then reveal your lower price
                    </p>
                  </div>

                  <div className="p-3 border-l-4 border-green-500 bg-green-50">
                    <h4 className="font-medium text-green-900">Payment Options</h4>
                    <p className="text-sm text-green-800">
                      Offer both one-time and payment plans to maximize accessibility
                    </p>
                  </div>

                  <div className="p-3 border-l-4 border-purple-500 bg-purple-50">
                    <h4 className="font-medium text-purple-900">Scarcity & Urgency</h4>
                    <p className="text-sm text-purple-800">
                      Limited time bonuses or quantity create urgency
                    </p>
                  </div>

                  {isAdvanced && (
                    <div className="p-3 border-l-4 border-orange-500 bg-orange-50">
                      <h4 className="font-medium text-orange-900">Price Testing</h4>
                      <p className="text-sm text-orange-800">
                        A/B test different price points to optimize revenue
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai-coach">
          <ConversationMemory 
            businessProfile={businessProfile}
            workspace="offers"
            onInsightsGenerated={(insights) => {
              console.log('Offer insights generated:', insights)
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}