'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

type UserProfile = {
  id: string
  role: string
  restaurant_name?: string
}

type SessionContextType = {
  user: UserProfile | null
  loading: boolean
}

const UserSessionContext = createContext<SessionContextType>({
  user: null,
  loading: true,
})

export const UserSessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getProfile = async () => {
      setLoading(true)
      const { data: sessionData } = await supabase.auth.getSession()
      const userId = sessionData.session?.user.id

      if (!userId) {
        setUser(null)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id, role, restaurant_name')
        .eq('id', userId)
        .single()

      if (data && !error) {
        setUser(data)
      } else {
        setUser(null)
      }

      setLoading(false)
    }

    getProfile()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        getProfile()
      } else {
        setUser(null)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return (
    <UserSessionContext.Provider value={{ user, loading }}>
      {children}
    </UserSessionContext.Provider>
  )
}

export const useSessionUser = () => useContext(UserSessionContext)
