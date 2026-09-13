#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const cwd = fileURLToPath(new URL('..', import.meta.url));
function git(...args) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || `git ${args[0]} failed`);
  }
  return result.stdout.trim();
}

try {
  const args = process.argv.slice(2);
  if (args.some(arg => !['--push', '--help'].includes(arg))) {
    throw new Error('Usage: npm run history:reset -- [--push]');
  }
  if (args.includes('--help')) {
    console.log('Usage: npm run history:reset -- [--push]\nKeep only the current branch HEAD snapshot. Requires a clean working tree.\n--push also rewrites the same branch on origin using force-with-lease.');
    process.exit(0);
  }
  const branch = git('symbolic-ref', '--quiet', '--short', 'HEAD');
  if (git('status', '--porcelain', '--untracked-files=all')) {
    throw new Error('Commit or stash all changes (including untracked files) first.');
  }
  for (const state of ['MERGE_HEAD', 'CHERRY_PICK_HEAD', 'REVERT_HEAD', 'REBASE_HEAD']) {
    const result = spawnSync('git', ['rev-parse', '--verify', '--quiet', state], { cwd });
    if (result.status === 0) throw new Error('Finish the ongoing Git operation first.');
  }
  const oldHead = git('rev-parse', 'HEAD');
  const ref = `refs/heads/${branch}`;
  let remoteHead;
  if (args.includes('--push')) {
    // Fetch first so remote changes cannot silently be discarded.
    git('fetch', '--no-tags', 'origin', ref);
    remoteHead = git('rev-parse', 'FETCH_HEAD');
    if (git('merge-base', remoteHead, oldHead) !== remoteHead) {
      throw new Error('origin has history missing locally. Integrate it before resetting history.');
    }
  }
  const tree = git('rev-parse', 'HEAD^{tree}');
  const message = git('log', '-1', '--format=%B');
  // No -p argument: the new commit is a root commit with the identical tree.
  const newHead = git('commit-tree', tree, '-m', message || 'Latest snapshot');
  git('update-ref', '-m', 'reset-history: keep latest snapshot', ref, newHead, oldHead);
  console.log(`Reset ${branch} to one commit: ${newHead}\nPrevious HEAD: ${oldHead}`);
  if (args.includes('--push')) {
    git('push', `--force-with-lease=${ref}:${remoteHead}`, 'origin', `${newHead}:${ref}`);
    console.log(`Updated origin/${branch}.`);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
