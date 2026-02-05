export default defineEventHandler(async (event) => {
  const { supabase } = await import('../utils/supabase')

  const query = getQuery(event)
  const userId = query.userId as string

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID 為必填',
    })
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.log('Profile not found for user:', userId)
    return null
  }

  return data
})
