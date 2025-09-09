'use client'

import React from 'react';
import { EnhancedBusinessAssessment } from '@/components/assessment/EnhancedBusinessAssessment';

export default function StartPage() {
  const handleAssessmentComplete = (profile: any) => {
    console.log('Assessment completed with profile:', profile);
  };

  return <EnhancedBusinessAssessment onComplete={handleAssessmentComplete} />;
}