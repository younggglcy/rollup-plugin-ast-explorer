import { createRouter, defineEventHandler } from 'h3'
import { pipe } from '../ssr/main'

export const router = createRouter()

router.get(
  '/',
  defineEventHandler((event) => {
    return pipe(event.node.res)
  }),
)
