<script setup lang="ts">
import type { Profile } from '~/composables/useSupabase'

const { isAdmin, isLoading: authLoading } = useAuth()

const profiles = ref<Profile[]>([])
const loading = ref(true)

const showMessage = inject<(msg: string) => void>('showMessage')

async function fetchProfiles() {
  loading.value = true
  try {
    profiles.value = await $fetch<Profile[]>('/api/profiles')
  } catch (error) {
    console.error('Error fetching profiles:', error)
    profiles.value = []
  }
  loading.value = false
}

async function updateRole(profile: Profile, newRole: 'user' | 'admin') {
  try {
    await $fetch(`/api/profiles/${profile.id}`, {
      method: 'PATCH',
      body: { role: newRole }
    })
    showMessage?.(`已將 ${profile.name} 設為 ${newRole === 'admin' ? '管理員' : '一般用戶'}`)
    profile.role = newRole
  } catch (error) {
    showMessage?.('更新失敗')
    console.error(error)
  }
}

async function updateName(profile: Profile, newName: string) {
  if (!newName.trim()) return

  try {
    await $fetch(`/api/profiles/${profile.id}`, {
      method: 'PATCH',
      body: { name: newName }
    })
    showMessage?.('名稱已更新')
    profile.name = newName
  } catch (error) {
    showMessage?.('更新失敗')
  }
}

async function deleteProfile(profile: Profile) {
  if (!confirm(`確定要刪除 ${profile.name} 嗎？這將同時刪除該用戶的所有資料。`)) return

  try {
    await $fetch(`/api/profiles/${profile.id}`, {
      method: 'DELETE'
    })
    showMessage?.('已刪除')
    profiles.value = profiles.value.filter(p => p.id !== profile.id)
  } catch (error) {
    showMessage?.('刪除失敗')
    console.error(error)
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('zh-TW')
}

onMounted(() => {
  fetchProfiles()
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
        <h1 class="text-3xl font-serif font-bold text-[#1A2B88]">用戶管理</h1>
        <p class="text-gray-400 text-sm">管理所有用戶權限</p>
      </div>
      <div class="flex gap-4">
        <NuxtLink to="/admin/menus" class="px-4 py-2 border border-gray-200 text-gray-600 rounded-full text-sm font-bold hover:border-[#1A2B88] hover:text-[#1A2B88] transition-colors">
          商品管理
        </NuxtLink>
        <NuxtLink to="/admin/orders" class="px-4 py-2 border border-gray-200 text-gray-600 rounded-full text-sm font-bold hover:border-[#1A2B88] hover:text-[#1A2B88] transition-colors">
          訂單管理
        </NuxtLink>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <p class="text-3xl font-serif font-bold text-[#1A2B88]">{{ profiles.length }}</p>
        <p class="text-gray-400 text-sm">總用戶數</p>
      </div>
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <p class="text-3xl font-serif font-bold text-green-500">{{ profiles.filter(p => p.role === 'admin').length }}</p>
        <p class="text-gray-400 text-sm">管理員</p>
      </div>
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <p class="text-3xl font-serif font-bold text-blue-500">{{ profiles.filter(p => p.role === 'user').length }}</p>
        <p class="text-gray-400 text-sm">一般用戶</p>
      </div>
    </div>

    <!-- Profiles List -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="bg-white p-6 rounded-[24px] animate-pulse">
        <div class="flex gap-4">
          <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div class="flex-1">
            <div class="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="profile in profiles"
        :key="profile.id"
        class="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100"
      >
        <div class="flex flex-col md:flex-row md:items-center gap-4">
          <!-- Avatar & Info -->
          <div class="flex items-center gap-4 flex-1">
            <div :class="[
              'w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg',
              profile.role === 'admin' ? 'bg-[#1A2B88]' : 'bg-gray-400'
            ]">
              {{ profile.name?.charAt(0)?.toUpperCase() || '?' }}
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <input
                  :value="profile.name"
                  @blur="(e) => updateName(profile, (e.target as HTMLInputElement).value)"
                  @keyup.enter="(e) => (e.target as HTMLInputElement).blur()"
                  class="font-bold text-gray-800 bg-transparent border-b border-transparent hover:border-gray-200 focus:border-[#1A2B88] outline-none px-1 -ml-1"
                />
                <span :class="[
                  'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase',
                  profile.role === 'admin' ? 'bg-[#1A2B88] text-white' : 'bg-gray-100 text-gray-500'
                ]">
                  {{ profile.role }}
                </span>
              </div>
              <p class="text-sm text-gray-400">{{ profile.email }}</p>
              <p class="text-xs text-gray-300 mt-1">加入於 {{ formatDate(profile.created_at) }}</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2 ml-16 md:ml-0">
            <button
              v-if="profile.role === 'user'"
              @click="updateRole(profile, 'admin')"
              class="px-4 py-2 bg-[#1A2B88] text-white rounded-full text-xs font-bold hover:bg-[#121E62] transition-colors"
            >
              設為管理員
            </button>
            <button
              v-else
              @click="updateRole(profile, 'user')"
              class="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-xs font-bold hover:bg-gray-200 transition-colors"
            >
              取消管理員
            </button>
            <button
              @click="deleteProfile(profile)"
              class="px-4 py-2 bg-red-50 text-red-500 rounded-full text-xs font-bold hover:bg-red-100 transition-colors"
            >
              刪除
            </button>
          </div>
        </div>

        <!-- User ID (for debugging) -->
        <div class="mt-4 pt-4 border-t border-gray-50">
          <p class="text-[10px] text-gray-300 font-mono">ID: {{ profile.id }}</p>
        </div>
      </div>
    </div>

    <div v-if="!loading && profiles.length === 0" class="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200 text-gray-400">
      <p class="text-4xl mb-4">👤</p>
      <p>還沒有用戶</p>
    </div>
  </div>
</template>
