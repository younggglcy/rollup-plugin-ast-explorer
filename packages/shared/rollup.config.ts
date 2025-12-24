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
  plugins: [
    dts(),
  ],
}

export default [mainConfig, dtsConfig]
