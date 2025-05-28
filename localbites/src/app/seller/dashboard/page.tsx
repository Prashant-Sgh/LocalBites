'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../../lib/supabaseClient'
import { useSessionUser } from '../../../context/UserSessionContext'
import SellerOrders from './SellerOrders'

type Product = {
  id: string
  name: string
  description: string
  category: string
  price: number
  discount_percentage: number
  image_url?: string
}

export default function SellerDashboard() {
  const { user, loading } = useSessionUser()
  const [tab, setTab] = useState<'add' | 'products' | 'orders'>('add')

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    discount: '',
    delivery_time: '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)

  const [products, setProducts] = useState<Product[]>([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!loading) {
      fetchProducts()
    }
  }, [loading])

  const fetchProducts = async () => {
    if (!user?.id) return

    const sellerId = user.id.toLowerCase()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', sellerId)

    if (!error && data) setProducts(data)
  }

  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0]
    if (file) setImageFile(file)
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setMessage('')

    const session = await supabase.auth.getSession()
    const sellerId = session.data.session?.user.id
    if (!sellerId) return

    let imageUrl = ''
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
      const { data, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, imageFile, {
          cacheControl: '3600',
          upsert: true,
        })

      if (!uploadError) {
        const { data: publicUrl } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName)
        imageUrl = publicUrl.publicUrl
      }
    }

    const { error } = await supabase.from('products').insert([
      {
        seller_id: sellerId.toLowerCase(),
        name: form.name,
        description: form.description,
        category: form.category,
        price: parseFloat(form.price),
        discount_percentage: parseFloat(form.discount),
        estimated_delivery_time: parseInt(form.delivery_time),
        image_url: imageUrl || null,
      },
    ])

    if (error) {
      setMessage(`❌ Error: ${error.message}`)
    } else {
      setMessage('✅ Product added!')
      setForm({ name: '', description: '', category: '', price: '', discount: '', delivery_time: '', })
      setImageFile(null)
      fetchProducts()
    }
  }

  return (
    <div className="min-h-screen flex text-black bg-white">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-100 p-6 shadow-md space-y-6">
        <h2 className="text-xl font-bold text-orange-600">Seller Dashboard</h2>
        <p className="text-sm mt-1 text-gray-700">
          {loading
            ? 'Loading...'
            : user?.restaurant_name
              ? `Welcome back, ${user.restaurant_name}`
              : 'You are not signed in'}
        </p>

        <nav className="space-y-3">
          <button onClick={() => setTab('add')} className="block w-full text-left p-2 rounded hover:bg-orange-100 hover:text-orange-600">➕ Manage Products</button>
          <button onClick={() => setTab('products')} className="block w-full text-left p-2 rounded hover:bg-orange-100 hover:text-orange-600">📋 My Products</button>
          <button onClick={() => setTab('orders')} className="block w-full text-left p-2 rounded hover:bg-orange-100 hover:text-orange-600">📦 My Orders</button>
          <button onClick={() => supabase.auth.signOut()} className="block w-full text-left p-2 rounded hover:bg-red-100 hover:text-red-600">🚪 Logout</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-orange-500 mb-6">
          {tab === 'add'
            ? 'Add Product'
            : tab === 'products'
              ? 'My Products'
              : 'My Orders'}
        </h1>

        {message && <p className="mb-4 text-sm text-orange-600">{message}</p>}

        {tab === 'add' && (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <input name="name" value={form.name} onChange={handleChange} type="text" placeholder="Product name" className="w-full placeholder:text-black p-2 border rounded border-gray-400" required />
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full placeholder:text-black p-2 border rounded border-gray-400" rows={3} />
            <input name="category" value={form.category} onChange={handleChange} type="text" placeholder="Category" className="w-full placeholder:text-black p-2 border rounded border-gray-400" />
            <input name="price" value={form.price} onChange={handleChange} type="number" step="0.01" placeholder="Price" className="w-full placeholder:text-black p-2 border rounded border-gray-400" required />
            <input name="discount" value={form.discount} onChange={handleChange} type="number" step="0.01" placeholder="Discount (%)" className="w-full placeholder:text-black p-2 border rounded border-gray-400" />
            <input
              name="delivery_time"
              value={form.delivery_time}
              onChange={handleChange}
              type="number"
              step="1"
              min="0"
              placeholder="Estimated Delivery Time (in mins)"
              className="w-full p-2 placeholder:text-black border rounded border-gray-400"
            />
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full border border-gray-300 p-2 rounded" />
            <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600">➕ Add Product</button>
          </form>
        )}

        {tab === 'products' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((product) => (
              <div key={product.id} className="border p-4 rounded shadow bg-gray-50 text-black space-y-2">
                <img src={product.image_url || '/default-food.png'} alt={product.name} className="w-full h-40 object-cover rounded" />
                <h3 className="text-lg font-semibold text-orange-600">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.description}</p>
                <p className="text-sm">Category: {product.category}</p>
                <p className="text-sm">Price: ₹{product.price}</p>
                <p className="text-sm text-green-700">Discount: {product.discount_percentage}%</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'orders' && user?.id && (
          <SellerOrders sellerId={user.id} />
        )}
      </main>
    </div>
  )
}
