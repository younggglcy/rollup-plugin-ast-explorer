import { readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { defineEventHandler, serveStatic } from 'h3'
import { logger } from '@/logger'

export function assetsHandler(assetsPath: string) {
  return defineEventHandler((event) => {
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
          type: getAssetType(id),
        }
      },
    })
  })
}

function getAssetType(id: string) {
  const suffix = id.split('.').pop() ?? ''
  switch (suffix) {
    case 'js':
      return 'application/javascript'
    case 'css':
      return 'text/css'
    case 'png':
      return 'image/png'
    default:
      logger(`unknown asset type for ${id}, fallback to application/octet-stream`)
      return 'application/octet-stream'
  }
}
