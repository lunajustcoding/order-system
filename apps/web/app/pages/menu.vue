<script setup lang="ts">
const { products, fetchProducts, isLoading } = useProducts()

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div class="space-y-12 animate-fade-in">
    <div class="text-center space-y-2">
      <h2 class="text-4xl font-serif font-bold text-[#1A2B88]">蛋糕系列</h2>
      <div class="w-12 h-1 bg-[#1A2B88] mx-auto"></div>
    </div>

    <div v-if="isLoading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      <div v-for="i in 4" :key="i" class="bg-white rounded-[32px] p-6 animate-pulse">
        <div class="bg-gray-200 w-full aspect-square rounded-[24px] mb-6"></div>
        <div class="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div class="h-5 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div class="h-5 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      <NuxtLink
        v-for="product in products"
        :key="product.id"
        :to="`/product/${product.id}`"
        class="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all cursor-pointer group"
      >
        <div class="bg-[#F9F6F2] w-full aspect-square rounded-[24px] flex items-center justify-center text-6xl mb-6">
          {{ product.image }}
        </div>
        <div class="space-y-1">
          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ product.category }}</span>
          <h3 class="font-bold text-gray-800 text-lg group-hover:text-[#1A2B88] transition-colors">{{ product.name }}</h3>
          <div class="flex justify-between items-center pt-2">
            <p class="text-[#1A2B88] font-bold text-lg font-serif">NT$ {{ product.price }}</p>
            <span class="w-10 h-10 bg-[#1A2B88] text-white rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            </span>
          </div>
        </div>
      </NuxtLink>
    </div>

    <div v-if="!isLoading && products.length === 0" class="text-center py-20 text-gray-400">
      <p class="te  xt-6xl mb-4">🍰</p>
      <p>目前沒有商品</p>
    </div>
  </div>
</template>
