import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient.js'
import { AuthContext } from './AuthContext.js'

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setIsAuthLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const value = {
    user,
    username: user?.user_metadata?.username ?? user?.email ?? '',
    isAuthenticated: Boolean(user),
    isAuthLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
