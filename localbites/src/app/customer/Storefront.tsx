'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import ProductCard from './ProductCard'
import Hero from '../../components/Hero'
import Features from '../../components/Features'
import WhyChooseUs from '../../components/WhyChooseUs'
import BestSellers from '../../components/BestSellers'

export default function Storefront() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*')
      if (!error && data) setProducts(data)
      setLoading(false)
    }

    fetchProducts()
  }, [])

  return (

    <>

      <Hero />

      <Features />
      <WhyChooseUs />
         <BestSellers />
      {/* <div className="min-h-screen bg-white p-6">
        <h1 className="text-2xl font-bold text-orange-600 mb-6">Explore Dishes</h1>
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div> */}
    </>
  )
}