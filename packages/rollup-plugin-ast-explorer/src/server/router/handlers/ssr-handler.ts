import type { ModuleInfosMap } from '@/types'
import type { BehaviorSubject } from 'rxjs'
import { render } from '@/ssr/entry-server'
import { defineEventHandler } from 'h3'

export function ssrHandler(moduleInfos: BehaviorSubject<ModuleInfosMap>) {
  return defineEventHandler((event) => {
    const { pipe } = render({
      initialModulesInfo: moduleInfos.getValue(),
    })
    return pipe(event.node.res)
  })
}
