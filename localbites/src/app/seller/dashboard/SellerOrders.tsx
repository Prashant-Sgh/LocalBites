'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../../lib/supabaseClient'

export default function SellerOrders({ sellerId }: { sellerId: string }) {
  const [orders, setOrders] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false })

      if (!orderError && orderData) {
        setOrders(orderData)
      }
    }

    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('id, name')
      if (!error && data) setProducts(data)
    }

    if (sellerId) {
      fetchOrders()
      fetchProducts()
    }
  }, [sellerId])

  const getProductName = (id: string) =>
    products.find((p) => p.id === id)?.name || id

  const markAsDelivered = async (orderId: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: 'delivered' })
      .eq('id', orderId)

    if (!error) {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: 'delivered' } : order
        )
      )
    } else {
      alert('Failed to update order status.')
    }
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div
          key={order.id}
          className={`p-4 rounded shadow ${
            order.status === 'pending' ? 'bg-yellow-100' : 'bg-green-100'
          }`}
        >
          <div className="font-bold text-gray-700 mb-1">
            Status: {order.status.toUpperCase()}
          </div>
          <div className="text-sm text-gray-800">
            Total: ₹{order.total}
          </div>
          <div className="text-sm text-gray-600 mb-2">
            Placed on: {new Date(order.created_at).toLocaleString()}
          </div>

          <div className="text-sm mb-2">
            <span className="font-medium">Items:</span>
            <ul className="list-disc ml-5">
              {order.products?.map((p: any) => (
                <li key={p.product_id}>
                  {getProductName(p.product_id)} × {p.quantity}
                </li>
              ))}
            </ul>
          </div>

          <div className="text-sm text-gray-700 mt-2">
            <p><strong>📞 Phone:</strong> {order.customer_phone || 'N/A'}</p>
            <p><strong>🏠 Address:</strong> {order.delivery_address || 'N/A'}</p>
          </div>

          {order.status === 'pending' && (
            <button
              onClick={() => markAsDelivered(order.id)}
              className="mt-4 bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
            >
              Mark as Delivered
            </button>
          )}
        </div>
      ))}
    </div>
  )
}