import type { RollupOptions } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import { dts } from 'rollup-plugin-dts'

const mainConfig: RollupOptions = {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: true,
  },
  external: [
    '@rollup-plugin-ast-explorer/shared',
    '@rollup/pluginutils',
    'debug',
    'detect-port',
    'h3',
    'picocolors',
    'ws',
    'node:http',
    'node:path',
    'node:process',
  ],
  plugins: [
    typescript(),
  ],
}

const dtsConfig: RollupOptions = {
  input: 'src/index.ts',
  output: {
    dir: 'dist/types',
    format: 'esm',
  },
  external: [
    '@rollup-plugin-ast-explorer/shared',
  ],
  plugins: [
    dts(),
  ],
}

export default [mainConfig, dtsConfig]
