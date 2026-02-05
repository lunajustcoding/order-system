export default defineEventHandler(async (event) => {
  const { supabase } = await import('../utils/supabase')
  const body = await readBody(event)

  const { user_id, user_name, total, items } = body

  if (!user_id || !items || items.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: '缺少必要欄位',
    })
  }

  // 新建訂單
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id,
      user_name,
      total,
      status: 'pending'
    })
    .select()
    .single()

  if (orderError) {
    throw createError({
      statusCode: 500,
      statusMessage: orderError.message,
    })
  }

  const orderItems = items.map((item: any) => ({
    order_id: order.id,
    menu_id: item.menu_id,
    menu_name: item.menu_name,
    menu_image: item.menu_image,
    price: item.price,
    size: item.size,
    quantity: item.quantity
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) {
    await supabase.from('orders').delete().eq('id', order.id)
    throw createError({
      statusCode: 500,
      statusMessage: itemsError.message,
    })
  }

  return order
})
