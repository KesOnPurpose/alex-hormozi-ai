'use client'

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { AssessmentResults } from '@/components/assessment/AssessmentResults';

export default function AssessmentResultsPage() {
  const searchParams = useSearchParams();
  
  // Get profile data from URL params or redirect back if missing
  const profileData = searchParams.get('profile');
  
  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Assessment Results Not Found</h1>
          <p className="text-gray-300 mb-6">Please complete the assessment to see your results.</p>
          <a 
            href="/start" 
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Take Assessment
          </a>
        </div>
      </div>
    );
  }

  try {
    const profile = JSON.parse(decodeURIComponent(profileData));
    return <AssessmentResults profile={profile} />;
  } catch (error) {
    console.error('Error parsing profile data:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Error Loading Results</h1>
          <p className="text-gray-300 mb-6">There was an issue loading your assessment results.</p>
          <a 
            href="/start" 
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Retake Assessment
          </a>
        </div>
      </div>
    );
  }
}