import { useEffect, useState } from 'react'
import { isNodeEnv } from '@/constants'
import type { ModuleInfosMap } from '@/types'
import { stringToMap } from '@/utils'

export function useEventSource(url: string, initail: ModuleInfosMap | null = null) {
  const [data, setData] = useState<ModuleInfosMap | null>(initail)

  useEffect(() => {
    const eventSource = isNodeEnv ? null : new EventSource(url)
    if (!eventSource) {
      return
    }

    eventSource.onmessage = (event) => {
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
