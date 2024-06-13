import { join, resolve } from 'node:path'
import { readFile, stat } from 'node:fs/promises'
import { createRouter, defineEventHandler, serveStatic } from 'h3'
import { generatePipeableStream } from '../ssr/main'
import { dirname } from '../constants'

export const router = createRouter()
const assetsPath = resolve(dirname, '..', 'assets')

router.get(
  '/',
  defineEventHandler((event) => {
    return generatePipeableStream()(event.node.res)
  }),
)

router.get(
  '/**',
  defineEventHandler((event) => {
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
  }),
)
