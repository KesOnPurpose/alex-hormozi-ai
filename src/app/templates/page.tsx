'use client'

import { useRouter } from 'next/navigation'
import { MoneyModelTemplate } from '@/types/money-model'
import TemplateLibrary from '@/components/money-model/TemplateLibrary'

export default function TemplatesPage() {
  const router = useRouter()

  const handleTemplateSelect = (template: MoneyModelTemplate) => {
    // Store selected template in localStorage for the money model builder to pick up
    localStorage.setItem('selectedTemplate', JSON.stringify(template))
    
    // Navigate to money model builder with template parameter
    router.push(`/money-model?template=${template.id}`)
  }

  return (
    <TemplateLibrary 
      onTemplateSelect={handleTemplateSelect}
      isModal={false}
    />
  )
}