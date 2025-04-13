import type { ModuleInfosMap } from '@/types'
import type { BehaviorSubject } from 'rxjs'
import { mapToString } from '@/utils'
import { createEventStream, defineEventHandler, defineLazyEventHandler } from 'h3'

export function streamSSEHandler(moduleInfos: BehaviorSubject<ModuleInfosMap>) {
  let modulesCache: string | null = null
  const modulesSubForCache = moduleInfos
    .subscribe((modules) => {
      modulesCache = mapToString(modules)
    })

  return defineLazyEventHandler(() => {
    modulesSubForCache.unsubscribe()
    return defineEventHandler((event) => {
      const eventStream = createEventStream(event)

      const modulesSub = moduleInfos
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
  })
}
