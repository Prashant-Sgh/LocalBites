// src/app/customer/ProductCard.tsx
'use client'
import { useCart } from '../../context/CartContext'

const DEFAULT_IMAGE = 'https://your-project-id.supabase.co/storage/v1/object/public/product-images/default-food.png'

export default function ProductCard({ product }: { product: any }) {
  const { addToCart } = useCart()

  return (
    <div className="border rounded-lg p-4 bg-gray-50 shadow hover:shadow-md transition">
      <img
        src={product.image_url || DEFAULT_IMAGE}
        alt={product.name}
        className="w-full h-40 object-cover rounded mb-3"
      />
      <h2 className="text-lg font-semibold text-orange-600">{product.name}</h2>
      <p className="text-sm text-gray-600">{product.description}</p>
      <p className="text-sm">Category: {product.category}</p>
      <p className="text-sm font-medium">Price: ₹{product.price}</p>
      <p className="text-sm text-green-700">Discount: {product.discount_percentage}%</p>

      <button
        onClick={() => addToCart(product.id)}
        className="mt-3 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
      >
        ➕ Add to Cart
      </button>
    </div>
  )
}