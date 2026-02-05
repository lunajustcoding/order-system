
export default defineEventHandler(async (event) => {
    const { supabase } = await import('../../utils/supabase');
    const id = event.context.params?.id;
    if (!id) {
        throw createError({
            statusCode: 422,
            statusMessage: '缺少餐點id'
        });
    }

    const body = await readBody(event);
    
    const { is_active } = body;

    if (typeof is_active !== 'boolean') {
        throw createError({
            statusCode: 400,
            statusMessage: 'is_active 參數類型不正確'
        });
    }

    const { data, error } = await supabase
        .from('menus')
        .update({ is_active })
        .eq('id', id)
        .select()
        .single()

    if (error) throw createError({ statusCode: 400, statusMessage: '未知錯誤' })

    return { ok: true, data }
}) 