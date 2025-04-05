import type { RollupOptions } from 'rollup'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import alias from '@rollup/plugin-alias'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import typescript from '@rollup/plugin-typescript'
import autoprefixer from 'autoprefixer'
import { defineConfig } from 'rollup'
import copy from 'rollup-plugin-copy'
import { dts } from 'rollup-plugin-dts'
import postcss from 'rollup-plugin-postcss'
import tailwindcss from 'tailwindcss'

const dirname = fileURLToPath(new URL('.', import.meta.url))
const pkgJsonPath = resolve(dirname, 'package.json')
const { version } = JSON.parse(readFileSync(pkgJsonPath, 'utf-8')) as { version: string }

export default defineConfig((command) => {
  const isProduction = !command.w

  const mainConfig: RollupOptions = {
    input: 'src/index.ts',
    output: [
      {
        dir: 'dist',
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
      alias({
        entries: [
          {
            find: /@\/(.*)/,
            replacement: `${dirname}/src/$1`,
          },
        ],
      }),
      commonjs(),
      typescript(),
      nodeResolve(),
      replace({
        values: {
          '__ROLLUP_PLUGIN_AST_EXPLORER_VERSION__': JSON.stringify(version),
          'process.env.NODE_ENV': isProduction ? JSON.stringify('production') : JSON.stringify('development'),
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

  const assetsConfig: RollupOptions = {
    input: [
      './src/ssr/entry-client.tsx',
      './src/ssr/main.css',
    ],
    output: {
      dir: 'dist/assets',
      format: 'esm',
      entryFileNames(chunkInfo) {
        return chunkInfo.name === 'main' ? 'main.css.js' : '[name].js'
      },
    },
    strictDeprecations: true,
    treeshake: {
      moduleSideEffects: false,
    },
    plugins: [
      alias({
        entries: [
          {
            find: /@\/(.*)/,
            replacement: `${dirname}/src/$1`,
          },
        ],
      }),
      typescript(),
      nodeResolve({
        browser: true,
      }),
      commonjs(),
      replace({
        preventAssignment: true,
        values: {
          'process.env.NODE_ENV': isProduction ? JSON.stringify('production') : JSON.stringify('development'),
          // for reduce bundle size manually
          'typeof window': JSON.stringify('object'),
          'typeof document': JSON.stringify('object'),
        },
      }),
      copy({
        targets: [
          {
            src: [
              './public/*',
            ],
            dest: 'dist/assets',
          },
        ],
      }),
      postcss({
        plugins: [
          tailwindcss(),
          autoprefixer(),
        ],
        extensions: ['.css'],
        minimize: isProduction,
        config: false,
      }),
    ],
  }

  return [mainConfig, mainDtsConfig, assetsConfig]
})
