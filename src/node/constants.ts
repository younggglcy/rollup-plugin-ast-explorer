import { dirname as dir, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const PORT = 7777
export const HOST = 'localhost'
// shared because we bundle everything
// all in one under dist/cjs and dist/esm
export const dirname = dir(fileURLToPath(import.meta.url))
export const assetsPath = resolve(dirname, '..', 'assets')

// technically assetsMap is not needed
// we just use its key for IDE intellisense
export const assetsMap = {
  '/dist/assets/styles/app.css': '/styles/app.css',
  '/dist/assets/bootstrap.js': '/bootstrap.js',
  '/dist/assets/favicon.png': '/favicon.png',
} as const
