<script setup lang="ts">
const route = useRoute()
const { cart, isCartOpen, toggleCart, closeCart, updateQty, totalPrice, clearCart, checkout } = useCart()
const { user, profile, isLoggedIn, isAdmin, init: initAuth } = useAuth()

const message = ref<string | null>(null)
const isLoading = ref(false)

onMounted(() => {
  initAuth()
})

function showMessage(msg: string) {
  message.value = msg
  setTimeout(() => { message.value = null }, 3000)
}

async function handleCheckout() {
  if (!isLoggedIn.value || !user.value) {
    navigateTo('/account')
    closeCart()
    showMessage('請先登入會員唷！')
    return
  }

  isLoading.value = true
  try {
    await checkout(user.value.id, profile.value?.name || user.value.email || '顧客')
    showMessage('訂單已送出')
    closeCart()
    navigateTo('/account')
  } catch (e) {
    showMessage('訂單送出失敗，請重試')
  } finally {
    isLoading.value = false
  }
}

provide('showMessage', showMessage)
</script>

<template>
  <div class="min-h-screen bg-[#FDFCFB] text-[#2D2D2D] font-sans pt-20 pb-10">
    <!-- Navbar -->
    <nav class="fixed top-0 left-0 right-0 bg-[#F9F6F2] border-b border-gray-200 flex justify-between items-center px-6 py-4 z-50">
      <div class="flex items-center gap-6">
        <NuxtLink to="/" class="text-xl font-serif font-bold text-[#1A2B88] tracking-tight">PetiteMomo</NuxtLink>
        <div class="hidden md:flex gap-6 text-xs font-bold text-gray-500 uppercase tracking-widest">
          <NuxtLink to="/" :class="route.path === '/' ? 'text-[#1A2B88]' : ''">首頁</NuxtLink>
          <NuxtLink to="/menu" :class="route.path === '/menu' || route.path.startsWith('/product') ? 'text-[#1A2B88]' : ''">蛋糕系列</NuxtLink>
          <NuxtLink to="/account" :class="route.path === '/account' ? 'text-[#1A2B88]' : ''">會員中心</NuxtLink>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <NuxtLink to="/account" class="text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </NuxtLink>
        <button @click="toggleCart" class="relative text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          <span v-if="cart.length > 0" class="absolute -top-1 -right-1 bg-[#1A2B88] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{{ cart.length }}</span>
        </button>
        <NuxtLink v-if="isAdmin" to="/admin/menus" class="text-[#1A2B88]">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
        </NuxtLink>
      </div>
    </nav>

    <!-- Message Toast -->
    <Transition name="fade">
      <div v-if="message" class="fixed top-24 left-1/2 -translate-x-1/2 bg-[#1A2B88] text-white px-6 py-2 rounded-full shadow-lg z-[100] text-sm font-medium">
        {{ message }}
      </div>
    </Transition>

    <!-- Cart Sidebar -->
    <Transition name="slide">
      <div v-if="isCartOpen" class="fixed inset-0 z-[60] flex justify-end">
        <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="closeCart" />
        <div class="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col p-8 animate-slide-in-right">
          <div class="flex justify-between items-center mb-8">
            <h2 class="text-2xl font-serif font-bold text-[#1A2B88]">購物籃</h2>
            <button @click="closeCart">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <div class="flex-1 overflow-y-auto space-y-6">
            <div v-if="cart.length === 0" class="text-center py-20 text-gray-400 font-serif italic">您的籃子空空的</div>
            <div v-for="item in cart" :key="item.cartId" class="flex gap-4 border-b border-gray-50 pb-4">
              <div class="w-16 h-16 bg-[#F9F6F2] rounded-xl flex items-center justify-center text-3xl">{{ item.image }}</div>
              <div class="flex-1">
                <h4 class="font-bold text-sm">{{ item.name }}</h4>
                <p class="text-xs text-gray-400 mb-2">{{ item.size }}</p>
                <div class="flex justify-between items-center">
                  <div class="flex items-center gap-2 border rounded-lg px-2 py-1">
                    <button @click="updateQty(item.cartId, -1)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/></svg>
                    </button>
                    <span class="text-xs font-bold w-4 text-center">{{ item.qty }}</span>
                    <button @click="updateQty(item.cartId, 1)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    </button>
                  </div>
                  <span class="text-sm font-bold text-[#1A2B88]">NT$ {{ item.price * item.qty }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="cart.length > 0" class="pt-8">
            <div class="flex justify-between items-center mb-6">
              <span class="text-gray-400 font-bold uppercase tracking-widest text-xs">Total</span>
              <span class="text-2xl font-serif font-bold text-[#1A2B88]">NT$ {{ totalPrice }}</span>
            </div>
            <button @click="handleCheckout" :disabled="isLoading" class="w-full bg-[#1A2B88] text-white py-4 rounded-full font-bold tracking-widest hover:bg-[#121E62] transition-colors disabled:opacity-50">
              {{ isLoading ? '處理中...' : '立即結帳' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <main class="max-w-6xl mx-auto px-6 py-8">
      <NuxtPage />
    </main>

    <!-- Mobile Nav -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-3 z-50 md:hidden">
      <NuxtLink to="/" class="flex flex-col items-center text-xs" :class="route.path === '/' ? 'text-[#1A2B88]' : 'text-gray-400'">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <span>首頁</span>
      </NuxtLink>
      <NuxtLink to="/menu" class="flex flex-col items-center text-xs" :class="route.path === '/menu' ? 'text-[#1A2B88]' : 'text-gray-400'">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" x2="18" y1="17" y2="17"/></svg>
        <span>蛋糕</span>
      </NuxtLink>
      <button @click="toggleCart" class="flex flex-col items-center text-xs text-gray-400 relative">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        <span>購物籃</span>
        <span v-if="cart.length > 0" class="absolute -top-1 right-2 bg-[#1A2B88] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{{ cart.length }}</span>
      </button>
      <NuxtLink to="/account" class="flex flex-col items-center text-xs" :class="route.path === '/account' ? 'text-[#1A2B88]' : 'text-gray-400'">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span>會員</span>
      </NuxtLink>
    </nav>
  </div>
</template>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.slide-enter-active, .slide-leave-active {
  transition: opacity 0.3s ease;
}
.slide-enter-from, .slide-leave-to {
  opacity: 0;
}
</style>
