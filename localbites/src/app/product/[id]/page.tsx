// src/app/product/[id]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../../lib/supabaseClient'
import { useCart } from '../../../context/CartContext'
import Link from 'next/link'

export default function ProductDetailPage() {
    const { id } = useParams()
    const [product, setProduct] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const { addToCart } = useCart()

    useEffect(() => {
        const fetchProduct = async () => {
            // 1. Fetch product by ID
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single()

            if (error || !data) {
                setProduct(null)
                setLoading(false)
                return
            }

            // 2. Fetch seller's restaurant name using seller_id
            const { data: seller, error: sellerError } = await supabase
                .from('profiles')
                .select('restaurant_name')
                .eq('id', data.seller_id)
                .single()

            const enrichedProduct = {
                ...data,
                restaurant_name: seller?.restaurant_name || 'Unknown Restaurant',
            }

            setProduct(enrichedProduct)
            setLoading(false)
        }

        if (id) fetchProduct()
    }, [id])

    if (loading) return <p className="p-8 text-amber-200">Loading...</p>
    if (!product) return <p className="p-8 text-red-600">Product not found.</p>

    const discountedPrice = (
        product.price -
        (product.price * product.discount_percentage) / 100
    ).toFixed(2)

    return (
        <div className="min-h-screen p-8 bg-white text-black max-w-4xl mx-auto">
            <Link href="/customer" className="text-orange-600 hover:underline">
                ← Back to Products
            </Link>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-10">
                <img
                    src={product.image_url || '/default-food.png'}
                    alt={product.name}
                    className="w-full h-96 object-cover rounded"
                />

                <div className="space-y-4">
                    <h1 className="text-3xl font-bold text-orange-600">{product.name}</h1>
                    <p className="text-gray-700">{product.description}</p>
                    <p className="text-sm text-gray-600">Category: {product.category}</p>

                    <div className="text-lg space-y-1">
                        <p>
                            <span className="line-through text-gray-500">₹{product.price}</span>{' '}
                            <span className="text-green-600 font-semibold">₹{discountedPrice}</span>
                        </p>
                        <p className="text-sm text-gray-700">
                            Estimated Delivery: {product.estimated_delivery_time || '30 mins'}
                        </p>
                        <p className="text-sm text-gray-700">
                            From: {product.restaurant_name}
                        </p>
                    </div>

                    <button
                        onClick={() => addToCart(product.id)}
                        className="mt-4 bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    )
}
