// src/app/cart/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { useCart } from '../../context/CartContext'
import { supabase } from '../../../lib/supabaseClient'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [role, setRole] = useState('')
  const [userId, setUserId] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchDetails = async () => {
      const session = await supabase.auth.getSession()
      const uid = session.data.session?.user.id
      setUserId(uid || '')

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', uid)
        .single()
      setRole(profile?.role || '')

      const ids = cart.map((c) => c.product_id)
      if (ids.length === 0) return setItems([])

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .in('id', ids)

      if (!error && data) {
        const enriched = data.map((product) => {
          const found = cart.find((c) => c.product_id === product.id)
          return { ...product, quantity: found?.quantity || 1 }
        })
        setItems(enriched)
      }
      setLoading(false)
    }

    fetchDetails()
  }, [cart])

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const handleCheckout = async () => {
    if (role !== 'customer') {
      const hasOwnProducts = items.some((item) => item.seller_id === userId)
      if (hasOwnProducts) {
        alert("One or more products in your cart belong to your restaurant. You cannot place an order from your own restaurant.")
        return
      } else {
        alert("Only customers can place orders.")
        return
      }
    }

    if (!phone || !address) {
      alert('Please provide phone number and delivery address.')
      return
    }

    const grouped = items.reduce((acc: any, item) => {
      if (!acc[item.seller_id]) acc[item.seller_id] = []
      acc[item.seller_id].push(item)
      return acc
    }, {})

    for (const sellerId in grouped) {
      const groupItems = grouped[sellerId]
      const orderTotal = groupItems.reduce(
        (sum: number, i: any) => sum + i.price * i.quantity,
        0
      )

      const products = groupItems.map((i: any) => ({
        product_id: i.id,
        quantity: i.quantity,
      }))

      await supabase.from('orders').insert([
        {
          customer_id: userId,
          seller_id: sellerId,
          total: orderTotal,
          status: 'pending',
          products,
          customer_phone: phone,
          delivery_address: address,
        },
      ])
    }

    clearCart()
    router.push('/order/confirmation')
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold text-orange-600 mb-6">Shopping Cart</h1>
      {loading ? (
        <p>Loading cart...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 border-b pb-4">
              <img
                src={item.image_url || '/default-food.png'}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-sm text-gray-600">₹{item.price} × {item.quantity}</p>
                <p className="text-sm font-medium text-orange-600">
                  Total: ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-white hover:bg-red-500 border border-red-500 rounded px-3 py-1"
              >
                ✖
              </button>
            </div>
          ))}

          <div className="text-right text-xl font-bold text-gray-800">
            Subtotal: ₹{subtotal.toFixed(2)}
          </div>

          {role === 'customer' && (
            <div className="space-y-4 mt-4">
              <input
                type="number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                className="w-full p-2 border border-gray-400 rounded text-gray-800 placeholder-gray-500"
              />
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Delivery Address"
                className="w-full p-2 border border-gray-400 rounded text-gray-800 placeholder-gray-500"
              />
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Link
              href="/customer"
              className="bg-orange-100 text-orange-600 px-4 py-2 rounded hover:bg-orange-200"
            >
              ← Continue Shopping
            </Link>
            <button
              onClick={handleCheckout}
              className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}