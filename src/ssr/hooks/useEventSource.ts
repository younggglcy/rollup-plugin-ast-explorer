import { useEffect, useState } from 'react'
import type { ModuleInfosMap } from '@/types'
import { stringToMap } from '@/utils'

export function useEventSource(url: string, initail: ModuleInfosMap | null = null) {
  const [data, setData] = useState<ModuleInfosMap | null>(initail)

  useEffect(() => {
    const eventSource = typeof window === 'undefined' ? null : new EventSource(url)
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
