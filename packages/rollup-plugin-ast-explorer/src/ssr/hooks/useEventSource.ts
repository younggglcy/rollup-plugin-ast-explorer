import type { ModuleInfosMap } from '@/types'
import { isNodeEnv } from '@/constants'
import { stringToMap } from '@/utils'
import { useEffect, useState } from 'react'

export function useEventSource(url: string, initail: ModuleInfosMap | null = null) {
  const [data, setData] = useState<ModuleInfosMap | null>(initail)

  useEffect(() => {
    const eventSource = isNodeEnv ? null : new EventSource(url)
    if (!eventSource) {
      return
    }

    eventSource.onmessage = (event) => {
      if (event.data === '[]') {
        return
      }
      setData(stringToMap<ModuleInfosMap>(event.data))
    }

    return () => {
      eventSource.close()
    }
  }, [url])

  return {
    data,
  }
}
