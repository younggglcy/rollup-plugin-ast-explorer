import { dirname as dir, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const PORT = 7777
export const HOST = 'localhost'
// shared because we bundle everything
// all in one under dist/cjs and dist/esm
export const dirname = typeof window === 'undefined' ? dir(fileURLToPath(import.meta.url)) : ''
export const assetsPath = typeof window === 'undefined' ? resolve(dirname, '..', 'assets') : ''
