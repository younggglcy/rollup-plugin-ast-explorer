import { renderToPipeableStream } from 'react-dom/server'
import type { AppProps } from './App'
import { App } from './App'

export function generatePipeableStream(options: {
  props: AppProps
}) {
  const {
    props: {
      assetsMap,
    },
  } = options

  return renderToPipeableStream(
    <App
      assetsMap={assetsMap}
    />,
    {
      bootstrapScriptContent: `
        window.assetsMap = ${JSON.stringify(assetsMap)};
      `,
      bootstrapModules: [
        assetsMap['/dist/assets/bootstrap.js'],
      ],
    },
  ).pipe
}
