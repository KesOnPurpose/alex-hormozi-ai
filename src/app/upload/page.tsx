'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DocumentAnalyzer, AnalysisResult } from '@/components/analysis/DocumentAnalyzer'
import { AnalysisResults } from '@/components/analysis/AnalysisResults'

export default function UploadPage() {
  const router = useRouter()
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [textInput, setTextInput] = useState('')
  const [processing, setProcessing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([])
  const [showResults, setShowResults] = useState(false)

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

  const handleAnalysisStart = () => {
    setProcessing(true)
  }

  const handleAnalysisComplete = (results: AnalysisResult[]) => {
    setAnalysisResults(results)
    setProcessing(false)
    setShowResults(true)
  }

  const handleViewAgent = (agentType: string) => {
    router.push(`/agents/${agentType}`)
  }

  const handleDownloadReport = () => {
    // Create and download PDF report
    const reportData = {
      timestamp: new Date().toISOString(),
      results: analysisResults
    }
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hormozi-analysis-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const resetAnalysis = () => {
    setShowResults(false)
    setAnalysisResults([])
    setFiles([])
    setTextInput('')
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

        <div className="max-w-6xl mx-auto">
          {showResults ? (
            <div className="space-y-6">
              {/* Results Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white">Analysis Results</h2>
                <button
                  onClick={resetAnalysis}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  New Analysis
                </button>
              </div>
              
              {/* Analysis Results */}
              <AnalysisResults
                results={analysisResults}
                onViewAgent={handleViewAgent}
                onDownloadReport={handleDownloadReport}
              />
            </div>
          ) : (
            <div className="space-y-8">
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
                  PDF, Excel, Word documents, business plans, financial statements
                </p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileSelect}
                  multiple
                  accept=".pdf,.txt,.docx,.md,.xlsx,.csv"
                />
                <label
                  htmlFor="file-upload"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg cursor-pointer transition-colors inline-block"
                >
                  Select Files
                </label>
              </div>

              {/* Text Input */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Or Paste Text Directly</h3>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="w-full h-40 p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:border-purple-400"
                  placeholder="Paste your business description, marketing copy, financial data, or any text you want analyzed using Alex Hormozi's frameworks..."
                />
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div>
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

              {/* Document Analyzer */}
              <DocumentAnalyzer
                files={files}
                textInput={textInput}
                onAnalysisStart={handleAnalysisStart}
                onAnalysisComplete={handleAnalysisComplete}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

