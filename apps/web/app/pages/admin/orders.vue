<script setup lang="ts">
import type { Order } from '~/composables/useSupabase'

const { isAdmin, isLoading: authLoading } = useAuth()
const { orders, fetchOrders, updateOrderStatus, isLoading } = useOrders()

const showMessage = inject<(msg: string) => void>('showMessage')

const statusFilter = ref<string>('all')

const filteredOrders = computed(() => {
  if (statusFilter.value === 'all') return orders.value
  return orders.value.filter(o => o.status === statusFilter.value)
})

async function changeStatus(orderId: string, status: Order['status']) {
  try {
    await updateOrderStatus(orderId, status)
    showMessage?.('狀態已更新')
  } catch (e) {
    showMessage?.('更新失敗')
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('zh-TW')
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

function getStatusColor(status: string) {
  const colorMap: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-600',
    cooking: 'bg-blue-50 text-blue-600',
    ready: 'bg-purple-50 text-purple-600',
    completed: 'bg-green-50 text-green-600',
    cancelled: 'bg-red-50 text-red-600'
  }
  return colorMap[status] || 'bg-gray-50 text-gray-600'
}

onMounted(() => {
  fetchOrders() 
})

// 非admin
watch([isAdmin, authLoading], ([admin, loading]) => {
  if (!loading && !admin) {
    navigateTo('/')
  }
})
</script>

<template>
  <div class="space-y-8 animate-fade-in">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-serif font-bold text-[#1A2B88]">訂單管理</h1>
        <p class="text-gray-400 text-sm">管理所有訂單</p>
      </div>
      <div class="flex gap-4">
        <NuxtLink to="/admin/menus" class="px-4 py-2 border border-gray-200 text-gray-600 rounded-full text-sm font-bold hover:border-[#1A2B88] hover:text-[#1A2B88] transition-colors">
          商品管理
        </NuxtLink>
        <NuxtLink to="/admin/profiles" class="px-4 py-2 border border-gray-200 text-gray-600 rounded-full text-sm font-bold hover:border-[#1A2B88] hover:text-[#1A2B88] transition-colors">
          用戶管理
        </NuxtLink>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex gap-2 flex-wrap">
      <button
        v-for="status in ['all', 'pending', 'cooking', 'ready', 'completed', 'cancelled']"
        :key="status"
        @click="statusFilter = status"
        :class="[
          'px-4 py-2 rounded-full text-sm font-bold transition-colors',
          statusFilter === status ? 'bg-[#1A2B88] text-white' : 'bg-white text-gray-400 border'
        ]"
      >
        {{ status === 'all' ? '全部' : getStatusText(status) }}
      </button>
    </div>

    <!-- Orders List -->
    <div v-if="isLoading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="bg-white p-6 rounded-[24px] animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="order in filteredOrders"
        :key="order.id"
        class="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <div class="flex items-center gap-3">
              <h3 class="font-bold text-gray-800">訂單 #{{ order.id.slice(-6) }}</h3>
              <span :class="['px-3 py-1 rounded-full text-xs font-bold', getStatusColor(order.status)]">
                {{ getStatusText(order.status) }}
              </span>
            </div>
            <p class="text-sm text-gray-400 mt-1">{{ order.user_name }} · {{ formatDate(order.created_at) }}</p>
          </div>
          <span class="text-xl font-serif font-bold text-[#1A2B88]">NT$ {{ order.total }}</span>
        </div>

        <div class="space-y-2 mb-4 py-4 border-y border-gray-50">
          <div v-for="item in order.items" :key="item.id" class="flex justify-between text-sm">
            <span>
              <span class="mr-2">{{ item.menu_image }}</span>
              {{ item.menu_name }}
              <span v-if="item.size" class="text-gray-400">({{ item.size }})</span>
              x {{ item.quantity }}
            </span>
            <span class="text-gray-600">NT$ {{ item.price * item.quantity }}</span>
          </div>
        </div>

        <div class="flex gap-2 flex-wrap">
          <button
            v-if="order.status === 'pending'"
            @click="changeStatus(order.id, 'cooking')"
            class="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-bold hover:bg-blue-100"
          >
            開始製作
          </button>
          <button
            v-if="order.status === 'cooking'"
            @click="changeStatus(order.id, 'ready')"
            class="px-4 py-2 bg-purple-50 text-purple-600 rounded-full text-xs font-bold hover:bg-purple-100"
          >
            完成製作
          </button>
          <button
            v-if="order.status === 'ready'"
            @click="changeStatus(order.id, 'completed')"
            class="px-4 py-2 bg-green-50 text-green-600 rounded-full text-xs font-bold hover:bg-green-100"
          >
            已取餐
          </button>
          <button
            v-if="order.status !== 'completed' && order.status !== 'cancelled'"
            @click="changeStatus(order.id, 'cancelled')"
            class="px-4 py-2 bg-red-50 text-red-600 rounded-full text-xs font-bold hover:bg-red-100"
          >
            取消訂單
          </button>
        </div>
      </div>
    </div>

    <div v-if="!isLoading && filteredOrders.length === 0" class="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200 text-gray-400">
      <p class="text-4xl mb-4">📋</p>
      <p>沒有符合條件的訂單</p>
    </div>
  </div>
</template>
