import { readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import type { Router } from 'h3'
import { createRouter as createH3Router, defineEventHandler, serveStatic } from 'h3'
import { assetsPath } from '../constants'
import { generatePipeableStream } from '../ssr/main'
import { getAllSubPaths } from '../utils'

export async function createRouter() {
  const router = createH3Router()

  // for ssr
  router.get(
    '/',
    defineEventHandler((event) => {
      return generatePipeableStream()(event.node.res)
    }),
  )

  // for serve static assets
  await registerAssetsRoutes(router)

  return router
}

async function registerAssetsRoutes(router: Router) {
  const assetsHandler = defineEventHandler((event) => {
    return serveStatic(event, {
      getContents: (id) => {
        return readFile(join(assetsPath, id))
      },
      getMeta: async (id) => {
        const stats = await stat(join(assetsPath, id)).catch(() => null)

        if (!stats || !stats.isFile()) {
          return
        }

        return {
          size: stats.size,
          mtime: stats.mtimeMs,
        }
      },
    })
  })

  const assetsPathes = await getAllSubPaths(assetsPath, {
    allowedExtensions: ['.js', '.css'],
    relative: true,
  })

  for (const path of assetsPathes) {
    router.get(`/${path}`, assetsHandler)
  }
}
