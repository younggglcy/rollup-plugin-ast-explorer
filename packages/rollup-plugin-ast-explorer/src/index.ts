import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'rollup'

const pkgJson = JSON.parse(readFileSync(resolve(fileURLToPath(import.meta.url), '../package.json'), 'utf-8'))

const { version } = pkgJson

export function astExplorer(): Plugin {
  return {
    name: 'rollup-plugin-ast-explorer',
    version,
  }
}
