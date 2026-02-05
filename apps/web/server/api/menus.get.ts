
export default defineEventHandler(async () => {
    const { supabase } = await import('../utils/supabase');

    const { data, error } = await supabase
        .from('menus')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: error.message,
        });
    }

    return data;
});
