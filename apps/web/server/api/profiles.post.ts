
export default defineEventHandler(async (event) => {
    const { supabase } = await import('../utils/supabase');
    try {
        const { name, role } = await readBody(event);
        if (!name || !role) {
            throw createError({ statusCode: 422, statusMessage: '名字/角色為必填' })
        }
        const { data, error } = await supabase
            .from('profiles')
            .insert([{ name, role }])
            .select()
            .single();
        if (error) throw createError({ statusCode: 400, statusMessage: error.message });
        return { ok: true, data };
    } catch (error) {
        if (error instanceof Error) {
            throw createError({
                statusCode: 400,
                statusMessage: error.message,
            });
        }
        throw createError({ statusCode: 400, statusMessage: 'unKnown error' });
    }
});

// export default defineEventHandler(async (event) => {
//   const { supabase } = await import('../utils/supabase')
//   const body = await readBody(event)

//   const { name } = body

//   const {
//     data: { user },
//     error: authError,
//   } = await supabase.auth.getUser()

//   if (authError || !user) {
//     throw createError({
//       statusCode: 401,
//       statusMessage: '未登入',
//     })
//   }

//   const { error } = await supabase.from('profiles').insert({
//     id: user.id,              
//     email: user.email,        
//     name,
//     role: 'user',
//   })

//   if (error) {
//     throw createError({
//       statusCode: 400,
//       statusMessage: error.message,
//     })
//   }

//   return { ok: true }
// })
