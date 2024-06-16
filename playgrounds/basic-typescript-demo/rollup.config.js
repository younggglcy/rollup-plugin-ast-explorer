import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'rollup'
import { astExplorer } from 'rollup-plugin-ast-explorer'

/**
 * @type {import('rollup').RollupOptions}
 */
export default defineConfig({
  input: 'src/index.ts',
  output: {
    dir: 'dist',
  },
  plugins: [
    typescript(),
    astExplorer(),
  ],
})
