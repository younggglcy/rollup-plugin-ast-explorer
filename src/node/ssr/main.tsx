import { renderToPipeableStream } from 'react-dom/server'
import { App } from './App'

export const assetsMap = {
  '/dist/assets/styles/app.css': '/styles/app.css',
  '/dist/assets/bootstrap.js': '/bootstrap.js',
} as const

export function generatePipeableStream() {
  return renderToPipeableStream(
    <App assetsMap={assetsMap} />,
    {
      bootstrapScriptContent: `window.assetsMap = ${JSON.stringify(assetsMap)};`,
      bootstrapScripts: [
        assetsMap['/dist/assets/bootstrap.js'],
      ],
    },
  ).pipe
}
