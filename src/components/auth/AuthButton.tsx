'use client'

import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignIn = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) {
      console.error('Error signing in:', error)
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <button 
        disabled 
        className="bg-gray-600 text-white px-4 py-2 rounded-lg opacity-50 cursor-not-allowed"
      >
        Loading...
      </button>
    )
  }

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-gray-300">
          Welcome, {user.user_metadata?.name || user.email}
        </span>
        <button
          onClick={handleSignOut}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleSignIn}
      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg transition-all hover:scale-105 shadow-lg"
    >
      Sign In with Google
    </button>
  )
}