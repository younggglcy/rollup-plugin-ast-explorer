import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import { dts } from 'rollup-plugin-dts'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import alias from '@rollup/plugin-alias'
import json from '@rollup/plugin-json'

const __dirname = dirname(fileURLToPath(import.meta.url))

const pkgJsonPath = resolve(__dirname, 'package.json')

const { version } = JSON.parse(readFileSync(pkgJsonPath, 'utf-8')) as { version: string }

const stylesPath = resolve(__dirname, 'src/node/ssr/styles')

const shared = [
  json(),
  commonjs(),
  alias({
    entries: [
      {
        find: /@\/(.*)/,
        replacement: `${__dirname}/src/$1`,
      },
    ],
  }),
  typescript(),
  nodeResolve(),
]

const mainConfig = defineConfig({
  input: 'src/index.ts',
  output: [
    {
      dir: 'dist/cjs',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    {
      dir: 'dist/esm',
      format: 'esm',
      sourcemap: true,
    },
  ],
  strictDeprecations: true,
  treeshake: {
    tryCatchDeoptimization: false,
  },
  plugins: [
    ...shared,
    replace({
      include: ['./src/index.ts', './src/node/server/index.ts'],
      values: {
        __ROLLUP_PLUGIN_AST_EXPLORER_VERSION__: JSON.stringify(version),
      },
      preventAssignment: true,
    }),
  ],
})

const dtsConfig = defineConfig({
  input: 'src/index.ts',
  output: {
    dir: 'dist/types',
    format: 'esm',
  },
  plugins: [
    dts(),
  ],
})

const assetsConfig = defineConfig({
  input: [
    'src/client/bootstrap.tsx',
  ],
  output: {
    dir: 'dist/assets',
    format: 'esm',
  },
  plugins: [
    ...shared,
    replace({
      preventAssignment: true,
      values: {
        'process.env.NODE_ENV': JSON.stringify('production'),
      },
    }),
    {
      name: 'copy-and-watch-css',
      buildStart() {
        this.addWatchFile(stylesPath)
      },
      async generateBundle() {
        const dir = await readdir(stylesPath)
        Promise.all(dir.map(file => this.emitFile({
          type: 'asset',
          fileName: `styles/${file}`,
          source: readFileSync(resolve(stylesPath, file)),
        })))
      },
    },
  ],
})

export default defineConfig([mainConfig, dtsConfig, assetsConfig])
