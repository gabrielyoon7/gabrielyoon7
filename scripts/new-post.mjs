#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const directory = fileURLToPath(new URL('../src/content/blog/', import.meta.url));
const title = process.argv.slice(2).join(' ').trim() || '새 글 제목';
const now = new Date();
const date = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
const slug = process.argv.length > 2
  ? title.normalize('NFC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '')
  : 'new-post';
// Limit filename length, and prefix with a date to avoid Windows reserved names.
const basename = `${date}-${Array.from(slug || 'new-post').slice(0, 60).join('').replace(/-+$/, '')}`;
const content = `---
title: ${JSON.stringify(title)}
description: "글을 소개하는 짧은 설명을 작성하세요."
pubDate: ${date}
tags: []
draft: true
---

## 들어가며

이 글에서 다룰 내용을 소개하세요.

## 본문

내용을 작성하세요.

## 정리

핵심 내용과 배운 점을 정리하세요.
`;

try {
  await mkdir(directory, { recursive: true });
  for (let number = 1; ; number++) {
    const filename = `${basename}${number === 1 ? '' : `-${number}`}.mdx`;
    const target = path.join(directory, filename);
    try {
      await writeFile(target, content, { encoding: 'utf8', flag: 'wx' });
      console.log(`새 글 생성: ${target}\n작성 후 draft: false로 변경하면 공개됩니다.`);
      break;
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }
  }
} catch (error) {
  console.error(`새 글을 생성하지 못했습니다: ${error.message}`);
  process.exitCode = 1;
}
