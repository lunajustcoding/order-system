<script setup lang="ts">
const { products, fetchProducts, isLoading } = useProducts()

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div class="space-y-16 animate-fade-in">
    <!-- Hero Section -->
    <section class="relative h-[500px] rounded-[40px] overflow-hidden flex items-center bg-[#E5EAF3]">
      <div class="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <div class="absolute top-10 right-20 text-[200px]">🍰</div>
        <div class="absolute bottom-10 left-10 text-[150px] rotate-12">🧁</div>
      </div>
      <div class="relative z-10 px-12 md:px-20 max-w-2xl space-y-6">
        <span class="text-[#1A2B88] font-bold tracking-[0.2em] text-xs uppercase bg-white/50 px-3 py-1 rounded-full">New Collection</span>
        <h2 class="text-5xl md:text-6xl font-serif font-bold text-[#1A2B88] leading-tight">手作溫度的<br/>法式甜點</h2>
        <p class="text-gray-600 leading-relaxed">我們堅持使用日本頂級麵粉與新鮮水果，為您打造味蕾上的小旅行。每一口都是極致享受。</p>
        <NuxtLink to="/menu" class="bg-[#1A2B88] text-white px-8 py-4 rounded-full font-bold shadow-lg flex items-center gap-2 hover:gap-4 transition-all uppercase tracking-widest text-sm w-fit">
          立即選購
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </NuxtLink>
      </div>
    </section>

    <!-- Featured Products -->
    <section>
      <div class="flex justify-between items-end mb-8">
        <div>
          <h3 class="text-2xl font-serif font-bold text-[#1A2B88]">推薦蛋糕</h3>
          <p class="text-gray-400 text-sm">最受歡迎的熱門選擇</p>
        </div>
        <NuxtLink to="/menu" class="text-[#1A2B88] text-sm font-bold border-b-2 border-[#1A2B88] pb-1">查看全部</NuxtLink>
      </div>

      <div v-if="isLoading" class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div v-for="i in 4" :key="i" class="animate-pulse">
          <div class="bg-gray-200 aspect-square rounded-[30px] mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <NuxtLink
          v-for="product in products.slice(0, 4)"
          :key="product.id"
          :to="`/product/${product.id}`"
          class="group cursor-pointer"
        >
          <div class="bg-[#F9F6F2] aspect-square rounded-[30px] flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-500 mb-4">
            {{ product.image }}
          </div>
          <h4 class="font-bold text-gray-800">{{ product.name }}</h4>
          <p class="text-[#1A2B88] font-bold">NT$ {{ product.price }}</p>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
