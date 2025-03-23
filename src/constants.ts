import { dirname as dir, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const PORT = 7777
export const HOST = 'localhost'
export const isNodeEnv = typeof window === 'undefined'
export const dirname = isNodeEnv ? dir(fileURLToPath(import.meta.url)) : ''
export const assetsPath = isNodeEnv ? resolve(dirname, '..', 'assets') : ''
export const MODULES_STOREAGE_KEY = 'rollup-plugin-ast-explorer:modules'
