import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import { nodeExternals } from 'rollup-plugin-node-externals'
import { dts } from 'rollup-plugin-dts'
import commonjs from '@rollup/plugin-commonjs'

/**
 * @type {import('rollup').RollupOptions}
 */
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
    commonjs(),
    nodeExternals({
      devDeps: true,
    }),
    typescript(),
  ],
})

/**
 * @type {import('rollup').RollupOptions}
 */
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
