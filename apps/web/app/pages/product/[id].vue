<script setup lang="ts">
const route = useRoute()
const { getProductById } = useProducts()
const { addToCart } = useCart()

const showMessage = inject<(msg: string) => void>('showMessage')

const productId = route.params.id as string
const product = ref<Awaited<ReturnType<typeof getProductById>> | null>(null)
const isLoading = ref(true)

const selectedSize = ref('')
const qty = ref(1)

onMounted(async () => {
  product.value = await getProductById(productId)
  if (product.value) {
    selectedSize.value = product.value.sizes?.[0] || ''
  }
  isLoading.value = false
})

function handleAddToCart() {
  if (!product.value) return
  addToCart(product.value, selectedSize.value, qty.value)
  showMessage?.(`已加入購物籃：${product.value.name} (${selectedSize.value})`)
  navigateTo('/menu')
}
</script>

<template>
  <div class="py-10 animate-fade-in">
    <NuxtLink to="/menu" class="flex items-center gap-2 text-gray-400 hover:text-[#1A2B88] transition-colors mb-10 font-bold uppercase tracking-widest text-xs">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      返回選單
    </NuxtLink>

    <div v-if="isLoading" class="grid md:grid-cols-2 gap-16">
      <div class="bg-gray-200 rounded-[40px] aspect-square animate-pulse"></div>
      <div class="space-y-8 py-4">
        <div class="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        <div class="h-12 bg-gray-200 rounded w-2/3 animate-pulse"></div>
        <div class="h-20 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>

    <div v-else-if="!product" class="text-center py-20">
      <p class="text-6xl mb-4">Sorry</p>
      <p class="text-gray-400">找不到此商品</p>
      <NuxtLink to="/menu" class="mt-4 inline-block text-[#1A2B88] font-bold">返回選單</NuxtLink>
    </div>

    <div v-else class="grid md:grid-cols-2 gap-16">
      <div class="bg-[#F9F6F2] rounded-[40px] aspect-square flex items-center justify-center text-[150px] shadow-inner relative overflow-hidden">
        <div class="absolute top-0 right-0 p-8">
          <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-yellow-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
        </div>
        {{ product.image }}
      </div>

      <div class="space-y-8 py-4">
        <div class="space-y-2">
          <div class="flex items-center gap-3">
            <span class="px-3 py-1 bg-[#F1E9FF] text-[#1A2B88] text-[10px] font-bold rounded-full uppercase tracking-tighter">Handmade</span>
            <span class="text-gray-400 text-xs">{{ product.category }}</span>
          </div>
          <h2 class="text-4xl font-serif font-bold text-[#1A2B88]">{{ product.name }}</h2>
          <div class="flex items-center gap-2 text-[#1A2B88]">
            <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span class="text-gray-400 text-xs ml-2">(42 評論)</span>
          </div>
        </div>

        <p class="text-gray-500 leading-relaxed text-sm">{{ product.description }}</p>
        <div class="text-3xl font-serif font-bold text-[#1A2B88]">NT$ {{ product.price }}</div>

        <div v-if="product.sizes?.length" class="space-y-4">
          <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest">選擇尺寸</h4>
          <div class="flex gap-3 flex-wrap">
            <button
              v-for="size in product.sizes"
              :key="size"
              @click="selectedSize = size"
              :class="[
                'px-6 py-2 rounded-full border-2 font-bold text-sm transition-all',
                selectedSize === size
                  ? 'border-[#1A2B88] bg-[#1A2B88] text-white'
                  : 'border-gray-100 bg-white text-gray-400 hover:border-gray-300'
              ]"
            >
              {{ size }}
            </button>
          </div>
        </div>

        <div class="space-y-4">
          <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest">購買數量</h4>
          <div class="flex items-center gap-6">
            <div class="flex items-center gap-4 bg-[#F9F6F2] px-4 py-2 rounded-full">
              <button @click="qty = Math.max(1, qty - 1)" class="text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/></svg>
              </button>
              <span class="font-bold text-lg w-6 text-center">{{ qty }}</span>
              <button @click="qty++" class="text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              </button>
            </div>
          </div>
        </div>

        <div class="pt-6 flex gap-4">
          <button
            @click="handleAddToCart"
            class="flex-1 bg-[#1A2B88] text-white py-5 rounded-full font-bold shadow-lg hover:bg-[#121E62] transition-all uppercase tracking-widest"
          >
            加入購物籃
          </button>
        </div>

        <div class="pt-10 grid grid-cols-3 gap-4 border-t border-gray-100">
          <div class="text-center space-y-1 pt-6">
            <div class="w-10 h-10 bg-[#F1E9FF] rounded-full mx-auto flex items-center justify-center text-[#1A2B88]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            </div>
            <p class="text-[10px] font-bold text-gray-500">成分詳解</p>
          </div>
          <div class="text-center space-y-1 pt-6">
            <div class="w-10 h-10 bg-[#FFF2E5] rounded-full mx-auto flex items-center justify-center text-orange-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
            </div>
            <p class="text-[10px] font-bold text-gray-500">低溫宅配</p>
          </div>
          <div class="text-center space-y-1 pt-6">
            <div class="w-10 h-10 bg-[#E5F7FF] rounded-full mx-auto flex items-center justify-center text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <p class="text-[10px] font-bold text-gray-500">品質保證</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
