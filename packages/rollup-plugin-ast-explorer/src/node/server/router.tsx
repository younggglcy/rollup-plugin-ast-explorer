import { createRouter, defineEventHandler } from 'h3'
import { renderToPipeableStream } from 'react-dom/server'
import { App } from '../ssr/App'

export const router = createRouter()

router.get(
  '/',
  defineEventHandler((event) => {
    const { pipe } = renderToPipeableStream(
      <App />,
    )
    return pipe(event.node.res)
  }),
)
