import type { RollupOptions } from 'rollup'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'rollup'
import { dts } from 'rollup-plugin-dts'
import { nodeExternals } from 'rollup-plugin-node-externals'

export default defineConfig(() => {
  const mainConfig: RollupOptions = {
    input: 'src/index.ts',
    output: {
      dir: 'dist',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      nodeExternals({
        include: [
          /@rollup\/(\S)*/,
          /rollup-plugin-(\S)*/,
        ],
      }),
      json(),
      commonjs(),
      typescript(),
      nodeResolve(),
    ],
  }

  const mainDtsConfig: RollupOptions = {
    input: 'src/index.ts',
    output: {
      dir: 'dist/types',
      format: 'esm',
    },
    plugins: [
      dts(),
    ],
  }

  return [mainConfig, mainDtsConfig]
})
