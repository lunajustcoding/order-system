import type { Menu } from './useSupabase'

const products = ref<Menu[]>([])
const isLoading = ref(false)

export function useProducts() {
  async function fetchProducts() {
    isLoading.value = true

    try {
      const data = await $fetch<Menu[]>('/api/menus')
      products.value = data.filter(p => p.is_active) || []
    } catch (error) {
      console.error('Error fetching products:', error)
      products.value = []
    }

    isLoading.value = false
  }

  function getProduct(id: string) {
    return products.value.find(p => p.id === id)
  }

  async function getProductById(id: string) {
    const cached = getProduct(id)
    if (cached) return cached

    try {
      const data = await $fetch<Menu[]>('/api/menus')
      const product = data.find(p => p.id === id)
      return product || null
    } catch (error) {
      console.error('Error fetching product:', error)
      return null
    }
  }

  return {
    products,
    isLoading,
    fetchProducts,
    getProduct,
    getProductById
  }
}
