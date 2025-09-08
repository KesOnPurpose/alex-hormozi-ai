'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [processing, setProcessing] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files)
      setFiles(prev => [...prev, ...newFiles])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles(prev => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const analyzeFiles = async () => {
    setProcessing(true)
    // TODO: Process files with Alex AI
    setTimeout(() => {
      setProcessing(false)
      // Redirect to results or chat
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="text-purple-400 hover:text-purple-300 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-5xl font-bold text-white mb-6">
            Upload Your Business Data
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Upload transcripts, offers, business plans, or paste text for AI analysis
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Upload Zone */}
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
              dragActive 
                ? 'border-purple-400 bg-purple-400/10' 
                : 'border-gray-600 hover:border-purple-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Drag & Drop Files Here
            </h3>
            <p className="text-gray-400 mb-6">
              Or click to select files (PDF, TXT, DOCX, MD)
            </p>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileSelect}
              multiple
              accept=".pdf,.txt,.docx,.md"
            />
            <label
              htmlFor="file-upload"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg cursor-pointer transition-colors inline-block"
            >
              Select Files
            </label>
          </div>

          {/* Text Input */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-white mb-4">Or Paste Text Directly</h3>
            <textarea
              className="w-full h-40 p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:border-purple-400"
              placeholder="Paste your business description, offer details, or any text you want analyzed..."
            />
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-white mb-4">Selected Files</h3>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="bg-white/10 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">📄</span>
                      <div>
                        <div className="text-white font-medium">{file.name}</div>
                        <div className="text-gray-400 text-sm">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-400 hover:text-red-300 text-xl"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <QuickAction
              title="Analyze Offers"
              description="Get 4-prong framework analysis"
              icon="🎯"
              onClick={() => {}}
            />
            <QuickAction
              title="Build Money Model"
              description="Design sequential offers"
              icon="💰"
              onClick={() => {}}
            />
            <QuickAction
              title="Calculate Metrics"
              description="CAC, LTV, payback analysis"
              icon="📊"
              onClick={() => {}}
            />
          </div>

          {/* Analyze Button */}
          <div className="text-center mt-12">
            <button
              onClick={analyzeFiles}
              disabled={files.length === 0 || processing}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white text-xl px-12 py-4 rounded-lg transition-colors"
            >
              {processing ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Processing with Alex AI...
                </span>
              ) : (
                'Analyze with Alex AI Orchestra'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function QuickAction({ title, description, icon, onClick }: {
  title: string
  description: string
  icon: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all border border-white/20 text-left"
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h4 className="text-lg font-semibold text-white mb-2">{title}</h4>
      <p className="text-gray-400 text-sm">{description}</p>
    </button>
  )
}