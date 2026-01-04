import type { ServerContext } from '@/types'
import {
  createRouter as createH3Router,
} from 'h3'
import { assetsPath } from '@/constants'
import { getAllSubPaths } from '@/utils'
import { assetsHandler } from './handlers/assets-handler'
import { ssrHandler } from './handlers/ssr-handler'
import { streamSSEHandler } from './handlers/stream-sse-handler'

export async function createRouter(options: {
  context: ServerContext
}) {
  const {
    context: {
      moduleInfos,
    },
  } = options

  const router = createH3Router()

  // for ssr
  router.get(
    '/',
    ssrHandler(),
  )

  // for serve static assets
  const assetsPathes = await getAllSubPaths(assetsPath, {
    allowedExtensions: ['.js', '.css', '.png'],
    relative: true,
  })

  for (const path of assetsPathes) {
    router.get(`/${path}`, assetsHandler(assetsPath))
  }

  // for sse
  router.get(
    '/stream',
    streamSSEHandler(moduleInfos),
  )

  return router
}
