import { astExplorer } from 'rollup-plugin-ast-explorer'

export default {
  input: 'src/main.js',
  output: {
    dir: 'dist',
    format: 'esm',
  },
  plugins: [
    astExplorer({
      port: 4178,
      keepCode: true,
    }),
  ],
}
