import { EditorError } from './store.mjs';

/** JSON responses for every API outcome, including invalid requests. */
export async function handleEditorRequest(request, clientAddress, store) {
  const json = (value, status = 200) => new Response(JSON.stringify(value), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
  try {
    const url = new URL(request.url);
    if (!['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) ||
        !['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(clientAddress)) {
      throw new EditorError(403, '로컬에서만 사용할 수 있습니다.');
    }
    const origin = request.headers.get('origin');
    if (origin && origin !== url.origin) throw new EditorError(403, '허용되지 않은 요청입니다.');
    if (request.method === 'GET') {
      return json(url.searchParams.has('id') ? await store.get(url.searchParams.get('id')) : await store.list());
    }
    if (!['POST', 'PUT'].includes(request.method)) throw new EditorError(405, '지원하지 않는 요청입니다.');
    if (!request.headers.get('content-type')?.startsWith('application/json')) throw new EditorError(415, 'JSON 요청만 지원합니다.');
    const reader = request.body?.getReader();
    const chunks = [];
    let size = 0;
    if (reader) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          size += value.byteLength;
          if (size > 2_000_000) {
            await reader.cancel();
            throw new EditorError(413, '글은 2MB 이하로 저장해 주세요.');
          }
          chunks.push(value);
        }
      } finally { reader.releaseLock(); }
    }
    let input;
    try { input = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
    catch { throw new EditorError(400, '잘못된 JSON 요청입니다.'); }
    if (!input || typeof input !== 'object') throw new EditorError(400, '잘못된 요청입니다.');
    return json(request.method === 'POST' ? await store.create(input.title) : await store.save(input.id, input));
  } catch (error) {
    const status = error.status || (error.code === 'ENOENT' ? 404 : 500);
    return json({ error: error.status ? error.message : status === 404 ? '파일을 찾을 수 없습니다.' : '파일 처리에 실패했습니다.' }, status);
  }
}
