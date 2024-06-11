import { resolve } from 'node:path'
import { createRouter, defineEventHandler } from 'h3'
import { renderToPipeableStream } from 'react-dom/server'
import { App } from '../ssr/App'
import { dirname } from '../constants'

export const router = createRouter()

router.get(
  '/',
  defineEventHandler((event) => {
    const { pipe } = renderToPipeableStream(
      <App />,
      {
        bootstrapScripts: [resolve(dirname, 'bootstrap.js')],
      },
    )
    return pipe(event.node.res)
  }),
)
