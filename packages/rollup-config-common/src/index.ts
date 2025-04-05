import type { RollupOptions } from 'rollup'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import { astExplorer } from 'rollup-plugin-ast-explorer'
import { nodeExternals } from 'rollup-plugin-node-externals'

export function createCommonPlaygroundsRollupConfig(): RollupOptions {
  return {
    input: './src/index.ts',
    output: {
      dir: 'dist',
    },
    plugins: [
      nodeExternals({
        include: [
          /@rollup\/(\S)*/,
          /rollup-plugin-(\S)*/,
        ],
      }),
      commonjs(),
      typescript(),
      astExplorer(),
    ],
  } satisfies RollupOptions
}
