import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import type { RollupOptions } from 'rollup'
import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import { dts } from 'rollup-plugin-dts'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import alias from '@rollup/plugin-alias'
import json from '@rollup/plugin-json'
import { copy } from 'fs-extra'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig((_command) => {
  const pkgJsonPath = resolve(__dirname, 'package.json')

  const { version } = JSON.parse(readFileSync(pkgJsonPath, 'utf-8')) as { version: string }

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
  ]

  const mainConfig: RollupOptions = {
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
      moduleSideEffects: false,
    },
    plugins: [
      ...shared,
      nodeResolve(),
      replace({
        include: ['./src/index.ts', './src/node/server/index.ts'],
        values: {
          __ROLLUP_PLUGIN_AST_EXPLORER_VERSION__: JSON.stringify(version),
        },
        preventAssignment: true,
      }),
    ],
  }

  const mainDtsConfig: RollupOptions = {
    input: 'src/index.ts',
    output: {
      dir: 'dist/types',
      format: 'esm',
    },
    strictDeprecations: true,
    plugins: [
      dts(),
    ],
  }

  const stylesPath = resolve(__dirname, 'src/node/ssr/styles')
  const publicPath = resolve(__dirname, 'public')

  const assetsConfig: RollupOptions = {
    input: [
      'src/client/bootstrap.tsx',
    ],
    output: {
      dir: 'dist/assets',
      format: 'esm',
    },
    strictDeprecations: true,
    treeshake: {
      moduleSideEffects: false,
    },
    plugins: [
      ...shared,
      nodeResolve({
        browser: true,
      }),
      replace({
        preventAssignment: true,
        values: {
          'process.env.NODE_ENV': JSON.stringify('production'),
          // for reduce bundle size manually
          'typeof window': JSON.stringify('object'),
          'typeof document': JSON.stringify('object'),
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
      {
        name: 'copy-public-to-assets',
        buildStart() {
          this.addWatchFile(publicPath)
        },
        buildEnd() {
          return copy(publicPath, 'dist/assets')
        },
      },
    ],
  }

  return [mainConfig, mainDtsConfig, assetsConfig]
})
