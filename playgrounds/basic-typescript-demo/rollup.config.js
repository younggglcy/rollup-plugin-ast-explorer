import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import { astExplorer } from 'rollup-plugin-ast-explorer'

/**
 * @type {import('rollup').RollupOptions}
 */
export default defineConfig({
  input: [
    'src/index.ts',
    'src/math.ts',
  ],
  output: {
    dir: 'dist',
  },
  plugins: [
    typescript(),
    astExplorer(),
  ],
})
