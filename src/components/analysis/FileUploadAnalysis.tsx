import React, { useState, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { BusinessProfile } from '@/lib/supabase/types'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Upload, 
  File, 
  FileText, 
  FileSpreadsheet,
  Image,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Lightbulb,
  BarChart3,
  PieChart,
  Download,
  X
} from 'lucide-react'

interface FileUploadAnalysisProps {
  businessProfile: BusinessProfile
}

interface UploadedFile {
  id: string
  file_name: string
  document_type: string
  file_size: number
  processing_status: 'uploaded' | 'processing' | 'completed' | 'failed'
  processed_data: any
  ai_analysis: any
  insights_generated: any[]
  created_at: string
}

interface AnalysisInsight {
  category: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  actionable: boolean
  metric_impact?: string
  alex_framework?: string
}

export function FileUploadAnalysis({ businessProfile }: FileUploadAnalysisProps) {
  const { user, userProfile } = useAuth()
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null)

  const businessLevel = userProfile?.business_level || 'beginner'

  // Load uploaded files on mount
  React.useEffect(() => {
    loadUploadedFiles()
  }, [])

  const loadUploadedFiles = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('user_documents')
        .select('*')
        .eq('user_id', user.id)
        .eq('business_id', businessProfile.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setUploadedFiles(data)
      }
    } catch (error) {
      console.error('Error loading uploaded files:', error)
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFileUpload(files)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFileUpload(files)
  }

  const handleFileUpload = async (files: File[]) => {
    if (!user) return

    setLoading(true)

    for (const file of files) {
      try {
        // Validate file type and size
        const validTypes = ['application/pdf', 'text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/png', 'image/jpeg', 'application/json']
        if (!validTypes.includes(file.type)) {
          alert(`File type not supported: ${file.type}`)
          continue
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          alert(`File too large: ${file.name}`)
          continue
        }

        // Upload file to Supabase Storage
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}/${businessProfile.id}/${Date.now()}.${fileExt}`
        
        setUploadProgress({ ...uploadProgress, [file.name]: 0 })

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('user-documents')
          .upload(fileName, file)

        if (uploadError) {
          console.error('Upload error:', uploadError)
          continue
        }

        setUploadProgress({ ...uploadProgress, [file.name]: 50 })

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('user-documents')
          .getPublicUrl(fileName)

        // Determine document type based on file name and type
        const documentType = determineDocumentType(file.name, file.type)

        // Save document record to database
        const documentData = {
          user_id: user.id,
          business_id: businessProfile.id,
          document_type: documentType,
          file_name: file.name,
          file_url: urlData.publicUrl,
          file_size: file.size,
          mime_type: file.type,
          processing_status: 'processing',
          raw_extracted_data: {},
          processed_data: {},
          ai_analysis: {}
        }

        const { data: docRecord, error: dbError } = await supabase
          .from('user_documents')
          .insert(documentData)
          .select()
          .single()

        if (dbError) {
          console.error('Database error:', dbError)
          continue
        }

        setUploadProgress({ ...uploadProgress, [file.name]: 75 })

        // Process the document (simulate AI analysis)
        await processDocument(docRecord, file)

        setUploadProgress({ ...uploadProgress, [file.name]: 100 })

        // Refresh file list
        await loadUploadedFiles()

      } catch (error) {
        console.error('Error uploading file:', error)
      }
    }

    setLoading(false)
    setUploadProgress({})
  }

  const determineDocumentType = (fileName: string, mimeType: string): string => {
    const name = fileName.toLowerCase()
    
    if (name.includes('financial') || name.includes('p&l') || name.includes('profit') || name.includes('loss')) {
      return 'financial_statement'
    }
    if (name.includes('sales') || name.includes('revenue') || name.includes('customer')) {
      return 'sales_report'
    }
    if (name.includes('marketing') || name.includes('ads') || name.includes('campaign')) {
      return 'marketing_data'
    }
    if (name.includes('analytics') || name.includes('metrics') || name.includes('kpi')) {
      return 'analytics_report'
    }
    if (mimeType.includes('image')) {
      return 'screenshot'
    }
    
    return 'business_document'
  }

  const processDocument = async (docRecord: any, file: File) => {
    try {
      // Simulate document processing and AI analysis
      // In a real implementation, this would:
      // 1. Extract text/data from the document
      // 2. Send to AI for analysis
      // 3. Generate insights based on Alex Hormozi frameworks

      let processedData = {}
      let aiAnalysis = {}
      let insights: AnalysisInsight[] = []

      // Simulate processing based on document type
      if (docRecord.document_type === 'financial_statement') {
        processedData = {
          total_revenue: Math.floor(Math.random() * 100000) + 10000,
          total_expenses: Math.floor(Math.random() * 80000) + 5000,
          profit_margin: Math.random() * 0.4 + 0.1,
          key_categories: ['revenue', 'cogs', 'marketing', 'operations']
        }

        aiAnalysis = {
          constraint_analysis: 'Based on your financials, profit appears to be your primary constraint',
          recommendations: [
            'Implement pricing optimization strategies',
            'Reduce COGS through operational efficiency',
            'Focus on higher-margin services'
          ],
          alex_frameworks_applicable: ['Grand Slam Offer', 'CFA Achievement']
        }

        insights = [
          {
            category: 'Financial Health',
            title: 'Profit Margin Analysis',
            description: `Your current profit margin of ${(processedData.profit_margin * 100).toFixed(1)}% suggests room for improvement through pricing optimization.`,
            priority: 'high',
            actionable: true,
            metric_impact: 'Could increase profits by 20-40%',
            alex_framework: 'Grand Slam Offer'
          },
          {
            category: 'Constraint Identification',
            title: 'Primary Constraint: Profit',
            description: 'Your business appears to be constrained by profitability rather than lead generation or sales conversion.',
            priority: 'high',
            actionable: true,
            alex_framework: '4 Universal Constraints'
          }
        ]
      } else if (docRecord.document_type === 'sales_report') {
        processedData = {
          total_leads: Math.floor(Math.random() * 1000) + 100,
          conversions: Math.floor(Math.random() * 100) + 10,
          conversion_rate: Math.random() * 0.2 + 0.05,
          average_deal_size: Math.floor(Math.random() * 5000) + 500
        }

        insights = [
          {
            category: 'Sales Performance',
            title: 'Conversion Rate Optimization',
            description: `Your ${(processedData.conversion_rate * 100).toFixed(1)}% conversion rate has significant improvement potential.`,
            priority: 'high',
            actionable: true,
            metric_impact: 'Could double revenue with better conversion',
            alex_framework: 'Grand Slam Offer'
          }
        ]
      }

      // Update document with processed data
      const { error: updateError } = await supabase
        .from('user_documents')
        .update({
          processing_status: 'completed',
          processed_data: processedData,
          ai_analysis: aiAnalysis,
          insights_generated: insights,
          processed_at: new Date().toISOString()
        })
        .eq('id', docRecord.id)

      if (updateError) {
        console.error('Error updating document:', updateError)
      }

    } catch (error) {
      console.error('Error processing document:', error)
      
      // Mark as failed
      await supabase
        .from('user_documents')
        .update({
          processing_status: 'failed',
          processing_error: error.message
        })
        .eq('id', docRecord.id)
    }
  }

  const deleteDocument = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from('user_documents')
        .delete()
        .eq('id', documentId)

      if (!error) {
        setUploadedFiles(uploadedFiles.filter(f => f.id !== documentId))
        if (selectedFile?.id === documentId) {
          setSelectedFile(null)
        }
      }
    } catch (error) {
      console.error('Error deleting document:', error)
    }
  }

  const getFileIcon = (documentType: string, mimeType?: string) => {
    if (mimeType?.includes('image')) return <Image className="w-5 h-5" />
    if (documentType === 'financial_statement') return <DollarSign className="w-5 h-5" />
    if (documentType === 'sales_report') return <TrendingUp className="w-5 h-5" />
    if (documentType === 'marketing_data') return <Users className="w-5 h-5" />
    if (mimeType?.includes('spreadsheet') || mimeType?.includes('csv')) return <FileSpreadsheet className="w-5 h-5" />
    return <FileText className="w-5 h-5" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600'
      case 'processing': return 'text-yellow-600'
      case 'failed': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'processing': return <Clock className="w-4 h-4" />
      case 'failed': return <AlertTriangle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📊 Business Document Analysis
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Upload your business documents and get AI-powered insights using Alex Hormozi's frameworks
        </p>

        {businessLevel === 'beginner' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5" />
              <div className="text-left">
                <h3 className="font-semibold text-blue-900">What can you upload?</h3>
                <p className="text-blue-800 text-sm mt-1">
                  Financial statements, sales reports, marketing data, analytics screenshots - 
                  anything that shows your business performance. Alex AI will analyze it and give you actionable insights.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload & Analyze</TabsTrigger>
          <TabsTrigger value="documents">My Documents</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          {/* File Upload Area */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>Upload Business Documents</span>
              </CardTitle>
              <CardDescription>
                Supported formats: PDF, Excel, CSV, Images (PNG, JPG). Max size: 10MB per file.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Drop files here or click to browse
                </h3>
                <p className="text-gray-600 mb-4">
                  Upload your financial statements, sales reports, or any business documents
                </p>
                
                <input
                  type="file"
                  multiple
                  accept=".pdf,.csv,.xlsx,.xls,.png,.jpg,.jpeg,.json"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <Button asChild>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    Select Files
                  </label>
                </Button>
              </div>

              {/* Upload Progress */}
              {Object.keys(uploadProgress).length > 0 && (
                <div className="mt-4 space-y-2">
                  {Object.entries(uploadProgress).map(([fileName, progress]) => (
                    <div key={fileName} className="flex items-center space-x-2">
                      <File className="w-4 h-4 text-gray-500" />
                      <span className="text-sm flex-1">{fileName}</span>
                      <Progress value={progress} className="w-32" />
                      <span className="text-xs text-gray-500">{progress}%</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Document Type Guide */}
          <Card>
            <CardHeader>
              <CardTitle>Document Analysis Guide</CardTitle>
              <CardDescription>
                What insights you'll get from different document types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold">Financial Statements</h4>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Profit margin analysis</li>
                    <li>• Constraint identification</li>
                    <li>• Cost optimization opportunities</li>
                    <li>• CFA potential assessment</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold">Sales Reports</h4>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Conversion rate optimization</li>
                    <li>• Deal size improvement</li>
                    <li>• Sales process insights</li>
                    <li>• Upsell opportunities</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold">Marketing Data</h4>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• CAC optimization</li>
                    <li>• Channel performance</li>
                    <li>• Lead quality analysis</li>
                    <li>• Campaign efficiency</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <BarChart3 className="w-5 h-5 text-orange-600" />
                    <h4 className="font-semibold">Analytics Screenshots</h4>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Performance trends</li>
                    <li>• Growth opportunities</li>
                    <li>• Optimization recommendations</li>
                    <li>• Benchmark comparisons</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Documents</CardTitle>
              <CardDescription>
                Manage your uploaded business documents and view analysis status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {uploadedFiles.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <File className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No documents uploaded yet. Start by uploading your business documents above.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className={`flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer ${
                        selectedFile?.id === file.id ? 'border-blue-500 bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedFile(file)}
                    >
                      <div className="flex items-center space-x-3">
                        {getFileIcon(file.document_type)}
                        <div>
                          <h4 className="font-medium">{file.file_name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{formatFileSize(file.file_size)}</span>
                            <Badge variant="outline">{file.document_type.replace('_', ' ')}</Badge>
                            <div className={`flex items-center space-x-1 ${getStatusColor(file.processing_status)}`}>
                              {getStatusIcon(file.processing_status)}
                              <span>{file.processing_status}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {file.processing_status === 'completed' && file.insights_generated?.length > 0 && (
                          <Badge variant="default">
                            {file.insights_generated.length} insights
                          </Badge>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteDocument(file.id)
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Selected File Details */}
          {selectedFile && selectedFile.processing_status === 'completed' && (
            <Card>
              <CardHeader>
                <CardTitle>Analysis Results: {selectedFile.file_name}</CardTitle>
                <CardDescription>
                  AI-powered insights from your document analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Processed Data Summary */}
                {selectedFile.processed_data && Object.keys(selectedFile.processed_data).length > 0 && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Extracted Data Summary</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      {Object.entries(selectedFile.processed_data).map(([key, value]) => (
                        <div key={key}>
                          <div className="text-gray-600">{key.replace('_', ' ')}</div>
                          <div className="font-semibold">
                            {typeof value === 'number' && key.includes('revenue') || key.includes('expenses') ? 
                              `$${value.toLocaleString()}` : 
                              typeof value === 'number' && (key.includes('rate') || key.includes('margin')) ?
                              `${(value * 100).toFixed(1)}%` :
                              String(value)
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Analysis */}
                {selectedFile.ai_analysis && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2 text-blue-900">AI Analysis</h4>
                    <div className="space-y-2 text-sm">
                      {selectedFile.ai_analysis.constraint_analysis && (
                        <p><strong>Constraint Analysis:</strong> {selectedFile.ai_analysis.constraint_analysis}</p>
                      )}
                      {selectedFile.ai_analysis.recommendations && (
                        <div>
                          <strong>Recommendations:</strong>
                          <ul className="list-disc list-inside ml-4 mt-1">
                            {selectedFile.ai_analysis.recommendations.map((rec: string, idx: number) => (
                              <li key={idx}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5" />
                <span>AI-Generated Insights</span>
              </CardTitle>
              <CardDescription>
                Actionable business insights from your uploaded documents using Alex Hormozi's frameworks
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                const allInsights = uploadedFiles
                  .filter(f => f.processing_status === 'completed' && f.insights_generated)
                  .flatMap(f => f.insights_generated || [])
                  .sort((a, b) => {
                    const priority = { high: 3, medium: 2, low: 1 }
                    return priority[b.priority] - priority[a.priority]
                  })

                if (allInsights.length === 0) {
                  return (
                    <div className="text-center py-8 text-gray-500">
                      <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Upload and analyze documents to see AI-generated insights here.</p>
                    </div>
                  )
                }

                return (
                  <div className="space-y-4">
                    {allInsights.map((insight: AnalysisInsight, index: number) => (
                      <Card key={index} className="border-l-4 border-l-blue-500">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <Badge variant={
                                  insight.priority === 'high' ? 'destructive' :
                                  insight.priority === 'medium' ? 'default' :
                                  'secondary'
                                }>
                                  {insight.priority} priority
                                </Badge>
                                <Badge variant="outline">{insight.category}</Badge>
                                {insight.alex_framework && (
                                  <Badge variant="outline" className="bg-blue-50">
                                    {insight.alex_framework}
                                  </Badge>
                                )}
                              </div>
                              <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                              <p className="text-gray-600 mt-1">{insight.description}</p>
                              
                              {insight.metric_impact && (
                                <div className="mt-2 p-2 bg-green-50 rounded text-sm">
                                  <strong className="text-green-800">Potential Impact:</strong> {insight.metric_impact}
                                </div>
                              )}
                            </div>
                            
                            {insight.actionable && (
                              <Button size="sm" variant="outline">
                                <Target className="w-4 h-4 mr-1" />
                                Take Action
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}