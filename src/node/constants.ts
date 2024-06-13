import { dirname as dir } from 'node:path'
import { fileURLToPath } from 'node:url'

export const PORT = 7777
export const HOST = 'localhost'
// shared because we bundle everything
// all in one under dist/cjs and dist/esm
export const dirname = dir(fileURLToPath(import.meta.url))
