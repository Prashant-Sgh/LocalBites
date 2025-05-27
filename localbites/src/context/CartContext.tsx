// src/context/CartContext.tsx
'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type CartItem = {
  product_id: string
  quantity: number
}

type CartContextType = {
  cart: CartItem[]
  addToCart: (productId: string) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('cart')
    if (stored) setCart(JSON.parse(stored))
    setInitialized(true) // only set this after loading from localStorage
  }, [])

  useEffect(() => {
    if (initialized) {
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  }, [cart, initialized])


  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('cart')
      setCart(stored ? JSON.parse(stored) : [])
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])



  const addToCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product_id === productId)
      if (existing) {
        return prev.map((item) =>
          item.product_id === productId ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { product_id: productId, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product_id !== productId))
  }

  // const clearCart = () => {
  //   setCart([])
  //   localStorage.removeItem('cart')
  // }

  const clearCart = () => {
    localStorage.removeItem('cart')     // Remove saved cart
    setCart([])                         // Clear memory cart

    // 🧠 Force reload fresh cart from localStorage for all components
    window.dispatchEvent(new Event('storage'))
  }



  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}


export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}