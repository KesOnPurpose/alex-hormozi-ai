'use client'

import { useState } from 'react'
import { X, DollarSign, Users, TrendingUp, Clock, Layers, Tag } from 'lucide-react'
import { OfferNode, OfferType } from '@/types/money-model'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface OfferDetailSidebarProps {
  offer: OfferNode | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (updates: Partial<OfferNode>) => void
}

export default function OfferDetailSidebar({
  offer,
  isOpen,
  onClose,
  onUpdate
}: OfferDetailSidebarProps) {
  const [formData, setFormData] = useState<Partial<OfferNode>>(offer || {})

  if (!isOpen || !offer) return null

  const handleSave = () => {
    onUpdate(formData)
    onClose()
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleMetricChange = (field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        [field]: value
      }
    }))
  }

  const offerTypeOptions: { value: OfferType; label: string; color: string }[] = [
    { value: 'attraction', label: 'Attraction Offer', color: 'bg-blue-500' },
    { value: 'core', label: 'Core Offer', color: 'bg-purple-500' },
    { value: 'upsell', label: 'Upsell Offer', color: 'bg-green-500' },
    { value: 'downsell', label: 'Downsell Offer', color: 'bg-yellow-500' },
    { value: 'continuity', label: 'Continuity Offer', color: 'bg-red-500' },
  ]

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'planned', label: 'Planned' },
    { value: 'paused', label: 'Paused' },
    { value: 'archived', label: 'Archived' }
  ]

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-96 bg-slate-800 border-l border-white/10 z-50 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">
                {offer.type === 'attraction' && '🎯'}
                {offer.type === 'core' && '💎'}
                {offer.type === 'upsell' && '📈'}
                {offer.type === 'downsell' && '🔄'}
                {offer.type === 'continuity' && '🔁'}
              </div>
              <h2 className="text-xl font-bold text-white">Edit Offer</h2>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Basic Information */}
          <Card className="mb-6 bg-slate-700/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Layers className="w-4 h-4" />
                <span>Basic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white">Offer Name</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="bg-slate-600 border-white/10 text-white"
                  placeholder="Enter offer name"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-white">Description</Label>
                <textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full p-2 rounded-md bg-slate-600 border border-white/10 text-white text-sm resize-none"
                  rows={3}
                  placeholder="Describe your offer..."
                />
              </div>

              <div>
                <Label htmlFor="type" className="text-white">Offer Type</Label>
                <select
                  id="type"
                  value={formData.type || offer.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full p-2 rounded-md bg-slate-600 border border-white/10 text-white text-sm"
                >
                  {offerTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="status" className="text-white">Status</Label>
                <select
                  id="status"
                  value={formData.status || offer.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full p-2 rounded-md bg-slate-600 border border-white/10 text-white text-sm"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="mb-6 bg-slate-700/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <DollarSign className="w-4 h-4" />
                <span>Pricing & Revenue</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price" className="text-white">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    className="bg-slate-600 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="costToDeliver" className="text-white">Cost to Deliver ($)</Label>
                  <Input
                    id="costToDeliver"
                    type="number"
                    value={formData.metrics?.costToDeliver || ''}
                    onChange={(e) => handleMetricChange('costToDeliver', parseFloat(e.target.value) || 0)}
                    className="bg-slate-600 border-white/10 text-white"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="profitMargin" className="text-white">Profit Margin (%)</Label>
                  <Input
                    id="profitMargin"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.metrics?.profitMargin || ''}
                    onChange={(e) => handleMetricChange('profitMargin', parseFloat(e.target.value) || 0)}
                    className="bg-slate-600 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="lifetimeValue" className="text-white">LTV ($)</Label>
                  <Input
                    id="lifetimeValue"
                    type="number"
                    value={formData.metrics?.lifetimeValue || ''}
                    onChange={(e) => handleMetricChange('lifetimeValue', parseFloat(e.target.value) || 0)}
                    className="bg-slate-600 border-white/10 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="mb-6 bg-slate-700/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Performance Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="conversionRate" className="text-white">Conversion Rate (%)</Label>
                  <Input
                    id="conversionRate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.metrics?.conversionRate || ''}
                    onChange={(e) => handleMetricChange('conversionRate', parseFloat(e.target.value) || 0)}
                    className="bg-slate-600 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="customersPerMonth" className="text-white">Customers/Month</Label>
                  <Input
                    id="customersPerMonth"
                    type="number"
                    value={formData.metrics?.customersPerMonth || ''}
                    onChange={(e) => handleMetricChange('customersPerMonth', parseInt(e.target.value) || 0)}
                    className="bg-slate-600 border-white/10 text-white"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="trafficVolume" className="text-white">Traffic Volume</Label>
                  <Input
                    id="trafficVolume"
                    type="number"
                    value={formData.metrics?.trafficVolume || ''}
                    onChange={(e) => handleMetricChange('trafficVolume', parseInt(e.target.value) || 0)}
                    className="bg-slate-600 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="customerAcquisitionCost" className="text-white">CAC ($)</Label>
                  <Input
                    id="customerAcquisitionCost"
                    type="number"
                    value={formData.metrics?.customerAcquisitionCost || ''}
                    onChange={(e) => handleMetricChange('customerAcquisitionCost', parseFloat(e.target.value) || 0)}
                    className="bg-slate-600 border-white/10 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Intelligence */}
          <Card className="mb-6 bg-slate-700/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Business Intelligence</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="marketDemand" className="text-white text-xs">Market Demand (1-10)</Label>
                  <Input
                    id="marketDemand"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.metrics?.marketDemand || ''}
                    onChange={(e) => handleMetricChange('marketDemand', parseInt(e.target.value) || 5)}
                    className="bg-slate-600 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="competitiveAdvantage" className="text-white text-xs">Competitive Edge (1-10)</Label>
                  <Input
                    id="competitiveAdvantage"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.metrics?.competitiveAdvantage || ''}
                    onChange={(e) => handleMetricChange('competitiveAdvantage', parseInt(e.target.value) || 5)}
                    className="bg-slate-600 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="implementationComplexity" className="text-white text-xs">Implementation (1-10)</Label>
                  <Input
                    id="implementationComplexity"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.metrics?.implementationComplexity || ''}
                    onChange={(e) => handleMetricChange('implementationComplexity', parseInt(e.target.value) || 5)}
                    className="bg-slate-600 border-white/10 text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="deliveryTimeframe" className="text-white">Delivery Timeframe</Label>
                <select
                  id="deliveryTimeframe"
                  value={formData.metrics?.deliveryTimeframe || 'immediate'}
                  onChange={(e) => handleMetricChange('deliveryTimeframe', e.target.value)}
                  className="w-full p-2 rounded-md bg-slate-600 border border-white/10 text-white text-sm"
                >
                  <option value="immediate">Immediate</option>
                  <option value="1-7 days">1-7 days</option>
                  <option value="1-4 weeks">1-4 weeks</option>
                  <option value="1-3 months">1-3 months</option>
                  <option value="3+ months">3+ months</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="mb-8 bg-slate-700/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Tag className="w-4 h-4" />
                <span>Tags</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Add tags (comma separated)"
                value={formData.tags?.join(', ') || ''}
                onChange={(e) => handleInputChange('tags', e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag))}
                className="bg-slate-600 border-white/10 text-white"
              />
              <p className="text-xs text-gray-400 mt-2">
                Use tags to categorize and organize your offers
              </p>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex space-x-3 pb-6">
            <Button
              onClick={handleSave}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              Save Changes
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="bg-transparent border-white/10 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}