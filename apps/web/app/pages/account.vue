<script setup lang="ts">
const { user, profile, isLoggedIn, signIn, signUp, signOut, isLoading: authLoading } = useAuth()
const { orders, fetchOrders, isLoading: ordersLoading } = useOrders()

const showMessage = inject<(msg: string) => void>('showMessage')

const authMode = ref<'login' | 'register'>('login')
const authForm = ref({ email: '', password: '', name: '' })
const isSubmitting = ref(false)

watch(isLoggedIn, (val) => {
  if (val && user.value) {
    fetchOrders(user.value.id)
  }
}, { immediate: true })

async function handleAuth() {
  isSubmitting.value = true
  try {
    if (authMode.value === 'register') {
      await signUp(authForm.value.email, authForm.value.password, authForm.value.name)
      showMessage?.('註冊成功！請確認您的電子郵件')
    } else {
      await signIn(authForm.value.email, authForm.value.password)
      showMessage?.('歡迎光臨！')
    }
    authForm.value = { email: '', password: '', name: '' }
  } catch (e: any) {
    showMessage?.(e.message || '驗證失敗')
  } finally {
    isSubmitting.value = false
  }
}

async function handleLogout() {
  await signOut()
  showMessage?.('已登出')
}

function toggleAuthMode() {
  authMode.value = authMode.value === 'login' ? 'register' : 'login'
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('zh-TW')
}

function getStatusText(status: string) {
  const statusMap: Record<string, string> = {
    pending: '等待確認',
    cooking: '製作中',
    ready: '等待取餐',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}
</script>

<template>
  <div class="max-w-2xl mx-auto py-10 animate-fade-in">
    <!-- Loading -->
    <div v-if="authLoading" class="text-center py-20">
      <div class="w-8 h-8 border-4 border-[#1A2B88] border-t-transparent rounded-full animate-spin mx-auto"></div>
    </div>

    <!-- Login Form -->
    <div v-else-if="!isLoggedIn" class="bg-white p-12 rounded-[40px] shadow-xl border border-gray-50">
      <h2 class="text-3xl font-serif font-bold text-[#1A2B88] text-center mb-8 uppercase tracking-widest">
        {{ authMode === 'login' ? 'Login' : 'Register' }}
      </h2>
      <form @submit.prevent="handleAuth" class="space-y-6">
        <div v-if="authMode === 'register'">
          <input
            v-model="authForm.name"
            type="text"
            placeholder="稱呼"
            class="w-full bg-[#F9F6F2] border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#1A2B88]"
            required
          />
        </div>
        <input
          v-model="authForm.email"
          type="email"
          placeholder="Email"
          class="w-full bg-[#F9F6F2] border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#1A2B88]"
          required
        />
        <input
          v-model="authForm.password"
          type="password"
          placeholder="Password"
          class="w-full bg-[#F9F6F2] border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#1A2B88]"
          required
          minlength="6"
        />
        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full bg-[#1A2B88] text-white py-5 rounded-full font-bold uppercase tracking-widest shadow-lg transition-all active:scale-95 disabled:opacity-50"
        >
          {{ isSubmitting ? '處理中...' : (authMode === 'login' ? '登入' : '註冊') }}
        </button>
      </form>
      <button
        @click="toggleAuthMode"
        class="w-full mt-6 text-xs text-gray-400 font-bold uppercase tracking-widest hover:text-[#1A2B88]"
      >
        {{ authMode === 'login' ? '還沒有帳號嗎？' : '已經有帳號了？' }}
      </button>
    </div>

    <!-- Orders List -->
    <div v-else class="space-y-8">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h2 class="text-3xl font-serif font-bold text-[#1A2B88] uppercase tracking-widest">My Orders</h2>
          <p class="text-gray-400 text-sm mt-1">{{ profile?.name || user?.email }}</p>
        </div>
        <button
          @click="handleLogout"
          class="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-2 font-bold text-xs uppercase"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
          登出
        </button>
      </div>

      <div v-if="ordersLoading" class="space-y-4">
        <div v-for="i in 2" :key="i" class="bg-white p-8 rounded-[32px] animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>

      <div v-else-if="orders.length === 0" class="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200 text-gray-400 italic">
        尚未有訂單紀錄
      </div>

      <div
        v-else
        v-for="order in orders"
        :key="order.id"
        class="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50"
      >
        <div class="flex justify-between mb-4 text-xs font-bold text-gray-400 uppercase tracking-tighter">
          <span>訂單編號 #{{ order.id.slice(-6) }}</span>
          <span class="text-[#1A2B88]">{{ formatDate(order.created_at) }}</span>
        </div>
        <div class="space-y-2 mb-6">
          <div v-for="item in order.items" :key="item.id" class="flex justify-between text-sm">
            <span>
              <span class="mr-2">{{ item.menu_image }}</span>
              {{ item.menu_name }}
              <span v-if="item.size" class="text-gray-400">({{ item.size }})</span>
              x {{ item.quantity }}
            </span>
            <span class="font-serif">NT$ {{ item.price * item.quantity }}</span>
          </div>
        </div>
        <div class="flex justify-between items-center pt-4 border-t border-dashed">
          <span :class="[
            'text-xs font-bold px-3 py-1 rounded-full uppercase',
            order.status === 'completed' ? 'bg-green-50 text-green-600' :
            order.status === 'cancelled' ? 'bg-red-50 text-red-600' :
            'bg-blue-50 text-[#1A2B88]'
          ]">
            {{ getStatusText(order.status) }}
          </span>
          <span class="text-xl font-serif font-bold text-[#1A2B88]">Total NT$ {{ order.total }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
