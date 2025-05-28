'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'customer' | 'seller'>('customer')
  const [isLogin, setIsLogin] = useState(true)
  const [message, setMessage] = useState<string | null>(null)
  const [restaurantName, setRestaurantName] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        setMessage(error.message)
        return
      }

      await new Promise((resolve) => setTimeout(resolve, 500))
      const { data: sessionData } = await supabase.auth.getSession()
      const userId = sessionData.session?.user.id

      if (!userId) {
        setMessage('Login succeeded but no session found. Try refreshing.')
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()

      if (profileError || !profile) {
        setMessage('Could not fetch user role.')
        return
      }

      setMessage(`Welcome back, ${profile.role}! Redirecting...`)

      if (profile.role === 'customer') {
        router.push('/user/dashboard')
      } else if (profile.role === 'seller') {
        router.push('/seller/dashboard')
      } else {
        router.push('/')
      }
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password })

      if (error) {
        setMessage(error.message)
        return
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))
      const { data: sessionData } = await supabase.auth.getSession()
      const userId = sessionData.session?.user.id

      if (userId) {
        const { error: profileError } = await supabase.from('profiles').insert([
          {
            id: userId,
            role,
            restaurant_name: restaurantName,
          },
        ])

        if (profileError) {
          setMessage('Sign-up succeeded, but failed to create profile: ' + profileError.message)
        } else {
          setMessage('Success! Redirecting...')
          router.push('/customer')
        }
      } else {
        setMessage('Sign-up succeeded, but no user session found. Please log in manually.')
      }
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96 space-y-4">
        <h1 className="text-xl font-bold text-center text-gray-800">
          {isLogin ? 'Login' : 'Sign Up'}
        </h1>

        {message && (
          <div className="text-sm text-center text-red-600 bg-red-100 p-2 rounded">
            {message}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full placeholder:text-black text-black p-2 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full placeholder:text-black text-black p-2 border rounded"
          required
        />

        {!isLogin && (
          <>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'customer' | 'seller')}
              className="w-full text-black p-2 border rounded"
            >
              <option value="customer">Customer</option>
              <option value="seller">Seller</option>
            </select>

            <input
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              placeholder="Restaurant Name"
              className="w-full placeholder:text-black p-2 border rounded"
            />
          </>
        )}

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">
          {isLogin ? 'Login' : 'Sign Up'}
        </button>

        <p
          className="text-sm text-center text-blue-700 cursor-pointer hover:underline"
          onClick={() => {
            setIsLogin(!isLogin)
            setMessage(null)
          }}
        >
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
        </p>
      </form>
    </div>
  )
}
