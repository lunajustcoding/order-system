export default defineEventHandler(async (event) => {
  const { supabase } = await import('../../utils/supabase')
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'profile id 為必填',
    })
  }

  const { name, role } = body
  const updateData: Record<string, string> = {}

  if (name !== undefined) updateData.name = name
  if (role !== undefined) updateData.role = role

  const { data, error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', id)
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
