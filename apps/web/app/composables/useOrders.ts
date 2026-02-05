import type { Order } from './useSupabase'

export function useOrders() {
  const orders = ref<Order[]>([])
  const isLoading = ref(false)

  async function fetchOrders(userId?: string) {
    isLoading.value = true

    try {
      const data = await $fetch<Order[]>('/api/orders')
      if (userId) {
        orders.value = data.filter(o => o.user_id === userId) || []
      } else {
        orders.value = data || []
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      orders.value = []
    }

    isLoading.value = false
  }

  async function updateOrderStatus(orderId: string, status: Order['status']) {
    try {
      await $fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        body: { status }
      })

      const order = orders.value.find(o => o.id === orderId)
      if (order) {
        order.status = status
      }
    } catch (error) {
      console.error('Error updating order:', error)
      throw error
    }
  }

  return {
    orders,
    isLoading,
    fetchOrders,
    updateOrderStatus
  }
}
