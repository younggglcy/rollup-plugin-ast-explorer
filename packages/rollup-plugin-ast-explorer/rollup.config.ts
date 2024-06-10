import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import { nodeExternals } from 'rollup-plugin-node-externals'
import { dts } from 'rollup-plugin-dts'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import alias from '@rollup/plugin-alias'

const __dirname = dirname(fileURLToPath(import.meta.url))

const pkgJsonPath = resolve(__dirname, 'package.json')

const { version } = JSON.parse(readFileSync(pkgJsonPath, 'utf-8')) as { version: string }

const mainConfig = defineConfig({
  input: 'src/index.ts',
  output: [
    {
      // using dir here will cause an error (plugin typescript) RollupError:
      // [plugin typescript] @rollup/plugin-typescript: Path of Typescript compiler option 'outDir' must be located inside Rollup 'dir' option.
      // FYI: https://github.com/rollup/plugins/issues/1230#issuecomment-1324735742

      // dir: 'dist/cjs',
      file: 'dist/cjs/index.js',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    {
      // dir: 'dist/esm',
      file: 'dist/esm/index.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  strictDeprecations: true,
  treeshake: {
    tryCatchDeoptimization: false,
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    nodeExternals({
      deps: false,
    }),
    typescript(),
    replace({
      include: ['./src/index.ts', './src/node/server/index.ts'],
      values: {
        __ROLLUP_PLUGIN_AST_EXPLORER_VERSION__: JSON.stringify(version),
      },
      preventAssignment: true,
    }),
    alias({
      entries: [
        {
          find: /@\/(.*)/,
          replacement: `${__dirname}/src/$1`,
        },
      ],
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

export default defineConfig([mainConfig, dtsConfig])
