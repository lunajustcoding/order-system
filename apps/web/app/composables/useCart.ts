import type { Menu } from './useSupabase'

export interface CartItem {
  cartId: string
  menuId: string
  name: string
  price: number
  image: string | null
  size: string
  qty: number
}

const cart = ref<CartItem[]>([])
const isCartOpen = ref(false)

export function useCart() {
  function addToCart(product: Menu, size: string, qty: number) {
    const cartId = `${product.id}-${size}`
    const existing = cart.value.find(item => item.cartId === cartId)

    if (existing) {
      existing.qty += qty
    } else {
      cart.value.push({
        cartId,
        menuId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size,
        qty
      })
    }
  }

  function updateQty(cartId: string, delta: number) {
    const item = cart.value.find(i => i.cartId === cartId)
    if (item) {
      item.qty += delta
      if (item.qty <= 0) {
        cart.value = cart.value.filter(i => i.cartId !== cartId)
      }
    }
  }

  function clearCart() {
    cart.value = []
  }

  function toggleCart() {
    isCartOpen.value = !isCartOpen.value
  }

  function closeCart() {
    isCartOpen.value = false
  }

  const totalPrice = computed(() => {
    return cart.value.reduce((sum, item) => sum + (item.price * item.qty), 0)
  })

  async function checkout(userId: string, userName: string) {
    if (cart.value.length === 0) return null

    try {
      const order = await $fetch('/api/orders', {
        method: 'POST',
        body: {
          user_id: userId,
          user_name: userName,
          total: totalPrice.value,
          items: cart.value.map(item => ({
            menu_id: item.menuId,
            menu_name: item.name,
            menu_image: item.image,
            price: item.price,
            size: item.size,
            quantity: item.qty
          }))
        }
      })

      clearCart()
      return order
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  }

  return {
    cart,
    isCartOpen,
    addToCart,
    updateQty,
    clearCart,
    toggleCart,
    closeCart,
    totalPrice,
    checkout
  }
}
