'use client'

import Link from 'next/link'  // Make sure this is at the top of the file
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useCart } from '../context/CartContext'

export default function BestSellers() {
  const [products, setProducts] = useState<any[]>([])
  const [sellers, setSellers] = useState<Record<string, string>>({})
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      const { data: productsData } = await supabase.from('products').select('*')
      setProducts(productsData || [])

      // Fetch seller restaurant names
      const sellerIds = [...new Set(productsData?.map((p: any) => p.seller_id))]
      const { data: sellerProfiles } = await supabase
        .from('profiles')
        .select('id, restaurant_name')
        .in('id', sellerIds)

      const sellerMap: Record<string, string> = {}
      sellerProfiles?.forEach((s: any) => {
        sellerMap[s.id] = s.restaurant_name
      })
      setSellers(sellerMap)
    }

    fetchProducts()
  }, [])

  return (
    <section className="bg-gradient-to-b from-[#fff8f0] to-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">
            Our best <span className="text-orange-500">Seller Dishes</span> 🔥🔥
          </h2>
          <p className="text-gray-600 mt-2 max-w-xl mx-auto">
            Our fresh garden salad is a light and refreshing option. It features a mix of crisp
            lettuce, juicy tomato all tossed in your choice of dressing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((product) => {
            const discountedPrice = product.price - (product.price * product.discount_percentage) / 100
            const sellerName = sellers[product.seller_id] || 'Restaurant name'

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
              >
                <Link href={`/product/${product.id}`} className="block hover:opacity-90 transition">
                  <img
                    src={product.image_url || '/default-food.png'}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                </Link>

                <div className="flex justify-between p-4 space-y-1">
                  <div>
                    <Link href={`/product/${product.id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 hover:underline">{product.name}</h3>
                    </Link>
                    <p className="text-sm font-bold text-gray-800">{sellerName}</p>
                    <p className="text-sm text-gray-500">
                      Estimated Delivery: {product.estimated_delivery_time ? `${product.estimated_delivery_time} min` : 'N/A'}
                    </p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => addToCart(product.id)}
                          className="bg-red-500 text-white text-xs px-4 py-1.5 rounded-full hover:bg-red-600"
                        >
                          Buy Now
                        </button>
                        <button
                          onClick={() => addToCart(product.id)}
                          className="border border-red-500 text-red-500 text-xs px-4 py-1.5 rounded-full hover:bg-red-500 hover:text-white"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-1">
                    <div className="text-black line-through font-semibold text-sm px-3 py-1 rounded-full">
                      ₹{product.price.toFixed(0)}
                    </div>
                    <div className="bg-green-100 text-green-700 font-semibold text-sm px-3 py-1 rounded-full">
                      ₹{discountedPrice.toFixed(0)}
                    </div>
                  </div>
                </div>
              </div>
            )
          }


          )}
        </div>
      </div>
    </section>
  )
}