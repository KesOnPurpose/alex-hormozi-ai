'use client'

import { useState } from 'react'
import { Connection } from '@/types/money-model'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ConnectionEditModalProps {
  connection: Connection
  isOpen: boolean
  onClose: () => void
  onSave: (updatedConnection: Connection) => void
  onDelete: () => void
  fromOfferName: string
  toOfferName: string
}

export default function ConnectionEditModal({
  connection,
  isOpen,
  onClose,
  onSave,
  onDelete,
  fromOfferName,
  toOfferName
}: ConnectionEditModalProps) {
  const [formData, setFormData] = useState<Connection>({...connection})

  if (!isOpen) return null

  const handleSave = () => {
    onSave(formData)
    onClose()
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this connection?')) {
      onDelete()
      onClose()
    }
  }

  const triggerOptions = [
    { value: 'purchase', label: 'After Purchase' },
    { value: 'result achieved', label: 'Result Achieved' },
    { value: 'time elapsed', label: 'Time Elapsed' },
    { value: 'manual', label: 'Manual Follow-up' }
  ]

  const timeOptions = [
    { value: 'immediate', label: 'Immediate' },
    { value: '1 day', label: '1 Day' },
    { value: '1 week', label: '1 Week' },
    { value: '2 weeks', label: '2 Weeks' },
    { value: '1 month', label: '1 Month' },
    { value: '3 months', label: '3 Months' }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <span>🔗</span>
            <span>Edit Connection</span>
          </CardTitle>
          <p className="text-gray-400 text-sm">
            {fromOfferName} → {toOfferName}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Conversion Rate */}
          <div className="space-y-2">
            <Label htmlFor="conversionRate" className="text-white">
              Conversion Rate (%)
            </Label>
            <Input
              id="conversionRate"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={formData.conversionRate}
              onChange={(e) => setFormData({
                ...formData,
                conversionRate: parseFloat(e.target.value) || 0
              })}
              className="bg-slate-700 border-white/10 text-white"
              placeholder="25.0"
            />
            <p className="text-xs text-gray-400">
              What percentage of customers move to the next offer?
            </p>
          </div>

          {/* Trigger */}
          <div className="space-y-2">
            <Label htmlFor="trigger" className="text-white">
              Connection Trigger
            </Label>
            <select
              id="trigger"
              value={formData.trigger}
              onChange={(e) => setFormData({
                ...formData,
                trigger: e.target.value
              })}
              className="w-full p-2 rounded-md bg-slate-700 border border-white/10 text-white text-sm"
            >
              {triggerOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Time Between */}
          <div className="space-y-2">
            <Label htmlFor="timeBetween" className="text-white">
              Average Time Between
            </Label>
            <select
              id="timeBetween"
              value={formData.averageTimeBetween}
              onChange={(e) => setFormData({
                ...formData,
                averageTimeBetween: e.target.value
              })}
              className="w-full p-2 rounded-md bg-slate-700 border border-white/10 text-white text-sm"
            >
              {timeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Visual Preview */}
          <div className="bg-slate-700/50 rounded-lg p-3 border border-white/5">
            <p className="text-xs text-gray-400 mb-2">Preview:</p>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-blue-400">{fromOfferName}</span>
              <div className="flex-1 flex items-center">
                <div className="h-0.5 bg-gradient-to-r from-blue-400 to-green-400 flex-1"></div>
                <div className="mx-2 text-xs bg-slate-800 px-2 py-1 rounded text-white">
                  {formData.conversionRate}%
                </div>
                <div className="h-0 w-0 border-l-4 border-l-green-400 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
              </div>
              <span className="text-green-400">{toOfferName}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {formData.trigger} • {formData.averageTimeBetween}
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-2 pt-4">
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
            <Button
              onClick={handleDelete}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}