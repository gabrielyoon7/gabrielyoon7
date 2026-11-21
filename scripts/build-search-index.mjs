#!/usr/bin/env node
// 빌드 결과(dist)에서 글 본문(data-pagefind-body)만 골라 Pagefind 검색 색인을 만듭니다.
// 공개된 글이 하나도 없으면 Pagefind가 모든 페이지를 색인하므로, 그때는 건너뜁니다.
import { readdir, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));

async function hasPostBody(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (await hasPostBody(file)) return true;
    } else if (entry.name.endsWith('.html') && (await readFile(file, 'utf8')).includes('data-pagefind-body')) {
      return true;
    }
  }
  return false;
}

if (!(await hasPostBody(dist))) {
  console.log('[search] 공개된 글이 없어 검색 색인을 건너뜁니다.');
} else {
  const result = spawnSync('pagefind', ['--site', dist], { stdio: 'inherit', shell: process.platform === 'win32' });
  process.exitCode = result.status ?? 1;
}
