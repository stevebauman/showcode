export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    console.error('[client-error]', JSON.stringify(body, null, 2));

    return { ok: true };
});
