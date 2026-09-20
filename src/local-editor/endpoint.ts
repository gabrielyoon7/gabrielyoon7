import type { APIRoute } from 'astro';
import { fileURLToPath } from 'node:url';
import { createStore } from './store.mjs';
import { handleEditorRequest } from './request.mjs';

export const prerender = false;
const store = createStore(fileURLToPath(new URL('../content/blog/', import.meta.url)));

export const ALL: APIRoute = (context) => {
  if (!import.meta.env.DEV) return new Response(null, { status: 404 });
  return handleEditorRequest(context.request, context.clientAddress, store);
};
