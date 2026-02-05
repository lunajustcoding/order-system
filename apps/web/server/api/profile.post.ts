export default defineEventHandler(async (event) => {
  const { supabase } = await import('../utils/supabase')
  const body = await readBody(event)

  const { id, email, name } = body

  if (!id || !email) {
    throw createError({
      statusCode: 400,
      statusMessage: '缺少必要欄位',
    })
  }

  const isAdmin = email.includes('admin')
  const profileName = name || email.split('@')[0]

  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id,
      email,
      name: profileName,
      role: isAdmin ? 'admin' : 'user'
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating profile:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  return data
})
