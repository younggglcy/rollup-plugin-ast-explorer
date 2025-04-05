import type { ModuleInfosMap } from '@/types'
import type { Router } from 'h3'
import type { BehaviorSubject } from 'rxjs'
import { readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { assetsPath } from '@/constants'
import { render } from '@/ssr/entry-server'
import { getAllSubPaths, mapToString } from '@/utils'
import {
  createEventStream,
  createRouter as createH3Router,
  defineEventHandler,
  defineLazyEventHandler,
  serveStatic,
} from 'h3'

export async function createRouter(options: {
  modulesSource: BehaviorSubject<ModuleInfosMap>
}) {
  const {
    modulesSource,
  } = options

  const router = createH3Router()

  // for ssr
  router.get(
    '/',
    defineEventHandler((event) => {
      const { pipe } = render({
        initialModulesInfo: modulesSource.getValue(),
      })
      return pipe(event.node.res)
    }),
  )

  // for serve static assets
  await registerAssetsRoutes(router)

  // for sse
  let modulesCache: string | null = null
  const modulesSubForCache = modulesSource
    .subscribe((modules) => {
      modulesCache = mapToString(modules)
    })

  router.get(
    '/stream',
    defineLazyEventHandler(() => {
      modulesSubForCache.unsubscribe()
      return defineEventHandler((event) => {
        const eventStream = createEventStream(event)

        const modulesSub = modulesSource
          .subscribe((modules) => {
            eventStream.push(mapToString(modules))
          })

        eventStream.onClosed(async () => {
          modulesSub.unsubscribe()
          await eventStream.close()
        })

        if (modulesCache) {
          eventStream.push(modulesCache)
          modulesCache = null
        }
        return eventStream.send()
      })
    }),
  )

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
          type: id.endsWith('.js')
            ? 'application/javascript'
            : id.endsWith('.css')
              ? 'text/css'
              : id.endsWith('.png')
                ? 'image/png'
                : 'application/octet-stream',
        }
      },
    })
  })

  const assetsPathes = await getAllSubPaths(assetsPath, {
    allowedExtensions: ['.js', '.css', '.png'],
    relative: true,
  })

  for (const path of assetsPathes) {
    router.get(`/${path}`, assetsHandler)
  }
}
