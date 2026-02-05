export default defineEventHandler(async (event) => {
  const { supabase } = await import('../utils/supabase')
  const body = await readBody(event)

  const { name, price, category, description, image, sizes } = body

  if (!name || !price) {
    throw createError({
      statusCode: 400,
      statusMessage: '名稱和價格為必填',
    })
  }

  const { data, error } = await supabase
    .from('menus')
    .insert({
      name,
      price,
      category: category || '其他',
      description: description || null,
      image: image || '🍰',
      sizes: sizes || [],
      is_active: true,
    })
    .select()
    .single()

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  return data
})
