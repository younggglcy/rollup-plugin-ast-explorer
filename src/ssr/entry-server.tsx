import { renderToPipeableStream } from 'react-dom/server'
import { App } from './App'

export function render() {
  return renderToPipeableStream(
    <App />,
    {
      bootstrapModules: [
        '/main.js',
        '/entry-client.js',
      ],
    },
  )
}
