'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

interface UserProfile {
  name?: string
  email?: string
  businessStage?: string
  completionPercentage?: number
  lastActive?: string
}

export default function NavigationHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [notifications, setNotifications] = useState(2) // Mock notification count

  useEffect(() => {
    // Load user profile from localStorage for now
    const businessProfile = localStorage.getItem('businessProfile')
    const onboardingAnswers = localStorage.getItem('onboardingAnswers')
    
    if (businessProfile) {
      const profile = JSON.parse(businessProfile)
      setUserProfile({
        name: 'Business Owner', // Will be replaced with real auth
        email: 'user@example.com',
        businessStage: profile.businessStage || 'Getting Started',
        completionPercentage: 45, // Will be calculated from actual data
        lastActive: new Date().toLocaleDateString()
      })
    }
  }, [])

  // Don't show on homepage
  if (pathname === '/') return null

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase()
  }

  const getStageEmoji = (stage: string) => {
    switch (stage) {
      case 'complete_beginner': return '🌱'
      case 'have_business': return '🏢'
      case 'scaling_business': return '📈'
      case 'experienced_operator': return '🎯'
      default: return '🚀'
    }
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-400'
    if (percentage >= 50) return 'text-yellow-400'
    return 'text-blue-400'
  }

  return (
    <div className="bg-black/20 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="text-2xl">🎯</div>
              <span className="text-white font-bold text-lg">Alex Hormozi AI</span>
            </Link>
            
            {/* Page Context */}
            {pathname !== '/' && (
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-gray-400">/</span>
                <span className="text-gray-300 capitalize">
                  {pathname.includes('/agents/') ? 'Agent Workspace' :
                   pathname.includes('/agents') ? 'Agent Selection' :
                   pathname.includes('/profile') ? 'Profile' :
                   pathname.includes('/dashboard') ? 'Dashboard' :
                   pathname.includes('/analysis') ? 'Business Analysis' :
                   pathname.includes('/start') ? 'Onboarding' :
                   pathname.replace('/', '')}
                </span>
              </div>
            )}
          </div>

          {/* Right Side - User Controls */}
          <div className="flex items-center space-x-4">
            {/* Progress Indicator */}
            {userProfile && (
              <div className="hidden sm:flex items-center space-x-2">
                <div className="text-xs text-gray-400">Progress</div>
                <div className={`text-sm font-semibold ${getProgressColor(userProfile.completionPercentage || 0)}`}>
                  {userProfile.completionPercentage}%
                </div>
                <div className="w-16 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${userProfile.completionPercentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Notifications */}
            <Link href="/profile?tab=insights" className="relative p-2 hover:bg-white/10 rounded-lg transition-colors">
              <div className="text-xl">🔔</div>
              {notifications > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications}
                </div>
              )}
            </Link>

            {/* Quick Actions */}
            <div className="hidden md:flex items-center space-x-2">
              <Link 
                href="/agents" 
                className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-sm rounded-lg transition-colors"
              >
                Agents
              </Link>
              <Link 
                href="/money-model" 
                className="px-3 py-1.5 bg-green-600/20 hover:bg-green-600/30 text-green-300 text-sm rounded-lg transition-colors"
              >
                💰 Money Model
              </Link>
              <Link 
                href="/templates" 
                className="px-3 py-1.5 bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 text-sm rounded-lg transition-colors"
              >
                🎯 Templates
              </Link>
              <Link 
                href="/dashboard" 
                className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-sm rounded-lg transition-colors"
              >
                Dashboard
              </Link>
            </div>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {userProfile ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {getInitials(userProfile.name || 'U')}
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-white text-sm font-medium">{userProfile.name}</div>
                      <div className="text-gray-400 text-xs flex items-center">
                        {getStageEmoji(userProfile.businessStage || '')} {userProfile.businessStage}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm">
                    ?
                  </div>
                )}
                <div className="text-gray-400 text-xs">▼</div>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-800 rounded-xl shadow-2xl border border-white/10 py-2 z-50">
                  {userProfile && (
                    <>
                      <div className="px-4 py-3 border-b border-white/10">
                        <div className="text-white font-medium">{userProfile.name}</div>
                        <div className="text-gray-400 text-sm">{userProfile.email}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Last active: {userProfile.lastActive}
                        </div>
                      </div>
                      
                      <div className="py-2">
                        <Link 
                          href="/profile"
                          className="flex items-center px-4 py-2 text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <span className="mr-3">👤</span>
                          View Profile & Growth
                        </Link>
                        <Link 
                          href="/dashboard"
                          className="flex items-center px-4 py-2 text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <span className="mr-3">📊</span>
                          Business Dashboard
                        </Link>
                        <Link 
                          href="/profile?tab=history"
                          className="flex items-center px-4 py-2 text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <span className="mr-3">📜</span>
                          Agent History
                        </Link>
                        <Link 
                          href="/profile?tab=insights"
                          className="flex items-center px-4 py-2 text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <span className="mr-3">💡</span>
                          Insights & Recommendations
                          {notifications > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                              {notifications}
                            </span>
                          )}
                        </Link>
                      </div>
                      
                      <div className="border-t border-white/10 py-2">
                        <button 
                          className="flex items-center px-4 py-2 text-gray-400 hover:text-red-400 transition-colors w-full text-left"
                          onClick={() => {
                            // Clear localStorage and redirect
                            localStorage.clear()
                            router.push('/')
                            setShowProfileMenu(false)
                          }}
                        >
                          <span className="mr-3">🚪</span>
                          Start Over
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close */}
      {showProfileMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowProfileMenu(false)}
        />
      )}
    </div>
  )
}