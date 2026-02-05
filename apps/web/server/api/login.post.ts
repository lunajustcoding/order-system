export default defineEventHandler(async (event) => {
  const { supabase } = await import('../utils/supabase')
  const { account, password } = await readBody(event);
  if (!account || !password ) {
    throw createError({ statusCode: 422, statusMessage: '缺少帳號密碼' })
  }
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw createError({
      statusCode: 401,
      statusMessage: '未登入',
    })
  }

  return { ok: true }
})
