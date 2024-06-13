import { resolve } from 'node:path'
import { renderToPipeableStream } from 'react-dom/server'
import { dirname } from '../constants'
import { App } from './App'

const { pipe } = renderToPipeableStream(
  <App />,
  {
    bootstrapScripts: [resolve(dirname, 'bootstrap.js')],
  },
)

export { pipe }
