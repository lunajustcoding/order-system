<script setup lang="ts">
import type { Menu } from '~/composables/useSupabase'

const { isAdmin, isLoading: authLoading } = useAuth()

const menus = ref<Menu[]>([])
const loading = ref(true)

const showMessage = inject<(msg: string) => void>('showMessage')

// fake
const showForm = ref(false)
const formData = ref({
  name: '',
  price: 0,
  category: '戚風系列',
  description: '',
  image: '🍰',
  sizes: ['6吋']
})

const categories = ['戚風系列', '慕斯系列', '塔類', '生乳捲', '其他']
const emojiOptions = ['🍰', '🎂', '🧁', '🍓', '🍫', '🍋', '🍵', '🍪', '🥧', '🍩']

async function getMenus() {
  const res = await fetch('/api/menus')
  menus.value = await res.json()
}

async function addMenu() {
  if (!formData.value.name || !formData.value.price) {
    showMessage?.('請填寫完整資訊')
    return
  }

  try {
    await fetch('/api/menus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.value.name,
        price: formData.value.price,
        category: formData.value.category,
        description: formData.value.description,
        image: formData.value.image,
        sizes: formData.value.sizes
      })
    })
    showMessage?.('新增成功')
    resetForm()
    getMenus()
  } catch (e) {
    showMessage?.('新增失敗')
  }
}

async function toggleActive(menu: Menu) {
  try {
    await fetch(`/api/menus/${menu.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !menu.is_active })
    })
    showMessage?.(menu.is_active ? '已下架' : '已上架')
    await getMenus()
  } catch (e) {
    showMessage?.('更新失敗')
  }
}

function resetForm() {
  formData.value = {
    name: '',
    price: 0,
    category: '戚風系列',
    description: '',
    image: '🍰',
    sizes: ['6吋']
  }
  showForm.value = false
}

function addSize(size: string) {
  if (!formData.value.sizes.includes(size)) {
    formData.value.sizes.push(size)
  }
}

function removeSize(size: string) {
  formData.value.sizes = formData.value.sizes.filter(s => s !== size)
}

onMounted(async () => {
  await getMenus()
  loading.value = false
})

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
        <h1 class="text-3xl font-serif font-bold text-[#1A2B88]">商品管理</h1>
        <p class="text-gray-400 text-sm">管理蛋糕商品</p>
      </div>
      <div class="flex gap-4">
        <NuxtLink to="/admin/orders" class="px-4 py-2 border border-gray-200 text-gray-600 rounded-full text-sm font-bold hover:border-[#1A2B88] hover:text-[#1A2B88] transition-colors">
          訂單管理
        </NuxtLink>
        <NuxtLink to="/admin/profiles" class="px-4 py-2 border border-gray-200 text-gray-600 rounded-full text-sm font-bold hover:border-[#1A2B88] hover:text-[#1A2B88] transition-colors">
          用戶管理
        </NuxtLink>
        <button @click="showForm = !showForm" class="px-6 py-2 bg-[#1A2B88] text-white rounded-full text-sm font-bold">
          {{ showForm ? '取消' : '+ 新增商品' }}
        </button>
      </div>
    </div>

    <!-- Add Form -->
    <Transition name="fade">
      <div v-if="showForm" class="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
        <h2 class="text-xl font-bold text-[#1A2B88] mb-6">新增商品</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div>
              <label class="text-xs font-bold text-gray-400 uppercase tracking-widest">商品名稱</label>
              <input v-model="formData.name" type="text" class="w-full mt-2 bg-[#F9F6F2] rounded-xl px-4 py-3 outline-none" placeholder="草莓奶油戚風">
            </div>
            <div>
              <label class="text-xs font-bold text-gray-400 uppercase tracking-widest">價格</label>
              <input v-model="formData.price" type="number" class="w-full mt-2 bg-[#F9F6F2] rounded-xl px-4 py-3 outline-none" placeholder="680">
            </div>
            <div>
              <label class="text-xs font-bold text-gray-400 uppercase tracking-widest">分類</label>
              <select v-model="formData.category" class="w-full mt-2 bg-[#F9F6F2] rounded-xl px-4 py-3 outline-none">
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
          </div>
          <div class="space-y-4">
            <div>
              <label class="text-xs font-bold text-gray-400 uppercase tracking-widest">圖示</label>
              <div class="flex gap-2 mt-2 flex-wrap">
                <button
                  v-for="emoji in emojiOptions"
                  :key="emoji"
                  @click="formData.image = emoji"
                  :class="['w-10 h-10 rounded-lg flex items-center justify-center text-xl', formData.image === emoji ? 'bg-[#1A2B88] text-white' : 'bg-[#F9F6F2]']"
                >
                  {{ emoji }}
                </button>
              </div>
            </div>
            <div>
              <label class="text-xs font-bold text-gray-400 uppercase tracking-widest">尺寸選項</label>
              <div class="flex gap-2 mt-2 flex-wrap">
                <span v-for="size in formData.sizes" :key="size" class="px-3 py-1 bg-[#1A2B88] text-white rounded-full text-sm flex items-center gap-1">
                  {{ size }}
                  <button @click="removeSize(size)" class="ml-1">&times;</button>
                </span>
                <button @click="addSize('4吋')" class="px-3 py-1 border border-dashed rounded-full text-sm text-gray-400">+ 4吋</button>
                <button @click="addSize('6吋')" class="px-3 py-1 border border-dashed rounded-full text-sm text-gray-400">+ 6吋</button>
                <button @click="addSize('8吋')" class="px-3 py-1 border border-dashed rounded-full text-sm text-gray-400">+ 8吋</button>
              </div>
            </div>
            <div>
              <label class="text-xs font-bold text-gray-400 uppercase tracking-widest">描述</label>
              <textarea v-model="formData.description" class="w-full mt-2 bg-[#F9F6F2] rounded-xl px-4 py-3 outline-none resize-none" rows="3" placeholder="商品描述..."></textarea>
            </div>
          </div>
        </div>
        <div class="mt-6 flex justify-end gap-4">
          <button @click="resetForm" class="px-6 py-2 text-gray-400 font-bold">取消</button>
          <button @click="addMenu" class="px-6 py-2 bg-[#1A2B88] text-white rounded-full font-bold">新增商品</button>
        </div>
      </div>
    </Transition>

    <!-- Product List -->
    <div v-if="loading" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 3" :key="i" class="bg-white p-6 rounded-[24px] animate-pulse">
        <div class="flex gap-4">
          <div class="w-16 h-16 bg-gray-200 rounded-xl"></div>
          <div class="flex-1">
            <div class="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="menu in menus"
        :key="menu.id"
        :class="['bg-white p-6 rounded-[24px] shadow-sm border transition-all', menu.is_active ? 'border-gray-100' : 'border-red-100 opacity-60']"
      >
        <div class="flex gap-4">
          <div class="w-16 h-16 bg-[#F9F6F2] rounded-xl flex items-center justify-center text-3xl">
            {{ menu.image }}
          </div>
          <div class="flex-1">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-bold text-gray-800">{{ menu.name }}</h3>
                <p class="text-xs text-gray-400">{{ menu.category }}</p>
              </div>
              <span class="text-[#1A2B88] font-bold font-serif">NT$ {{ menu.price }}</span>
            </div>
            <div class="flex gap-2 mt-3">
              <span v-for="size in menu.sizes" :key="size" class="px-2 py-0.5 bg-[#F9F6F2] rounded text-xs text-gray-500">
                {{ size }}
              </span>
            </div>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
          <span :class="['text-xs font-bold', menu.is_active ? 'text-green-500' : 'text-red-400']">
            {{ menu.is_active ? '上架中' : '已下架' }}
          </span>
          <button
            @click="toggleActive(menu)"
            :class="['px-4 py-1 rounded-full text-xs font-bold transition-colors', menu.is_active ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-green-50 text-green-500 hover:bg-green-100']"
          >
            {{ menu.is_active ? '下架' : '上架' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="!loading && menus.length === 0" class="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200 text-gray-400">
      <p class="text-4xl mb-4">🍰</p>
      <p>還沒有商品，點擊上方新增</p>
    </div>
  </div>
</template>
