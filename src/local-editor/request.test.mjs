import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createStore } from './store.mjs';
import { handleEditorRequest } from './request.mjs';
import integration from './integration.mjs';

test('editor page and API are registered together only for dev', () => {
  for (const command of ['dev', 'build', 'preview', 'sync']) {
    const routes = [];
    integration().hooks['astro:config:setup']({ command, config: { root: new URL('file:///tmp/blog/') }, injectRoute: route => routes.push(route), updateConfig() {} });
    assert.deepEqual(routes.map(r => r.pattern), command === 'dev' ? ['/editor/', '/__local-editor/posts/'] : []);
  }
});

test('API returns JSON for list, create, save, invalid data and forbidden requests', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'editor-api-'));
  const store = createStore(directory);
  const url = 'http://localhost:4321/gabrielyoon7/__local-editor/posts/';
  const call = (method = 'GET', body, headers = {}) => handleEditorRequest(new Request(url, {
    method, headers: { 'content-type': 'application/json', ...headers }, body: body === undefined ? undefined : JSON.stringify(body),
  }), '127.0.0.1', store);
  try {
    const list = await call();
    assert.match(list.headers.get('content-type'), /application\/json/);
    assert.deepEqual(await list.json(), []);
    const created = await call('POST', { title: '한글 API 테스트' });
    assert.equal(created.status, 200);
    const post = await created.json();
    const saved = await call('PUT', { ...post, body: '계속 작성합니다.' });
    assert.equal(saved.status, 200);
    assert.equal((await store.get(post.id)).body, '계속 작성합니다.');
    assert.equal((await call('PUT', post)).status, 409);
    for (const [response, expected] of [
      [await call('POST', null), 400],
      [await call('POST', {}, {origin: 'https://elsewhere.example'}), 403],
      [await call('POST', {}, {'content-type': 'text/plain'}), 415],
      [await call('DELETE'), 405],
      [await handleEditorRequest(new Request(url), '192.168.1.2', store), 403],
    ]) {
      assert.equal(response.status, expected);
      assert.match(response.headers.get('content-type'), /application\/json/);
      assert.equal(typeof (await response.json()).error, 'string');
    }
  } finally { await rm(directory, { recursive: true, force: true }); }
});
