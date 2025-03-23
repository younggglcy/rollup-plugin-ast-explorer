import { isNodeEnv } from '@/constants'
import { logger as debugLogger } from '@/logger'

// eslint-disable-next-line no-console
const logger = isNodeEnv ? debugLogger : console.log

function serializeValue(value: unknown) {
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  return value
}

function deserializeValue(serializedValue: string) {
  try {
    return JSON.parse(serializedValue)
  }
  catch (error) {
    logger(`Error deserializeValue ${serializeValue} to JSON string:`, error)
    return serializedValue
  }
}

export function mapToString(map: Map<string, unknown>) {
  const entries = []
  for (const [key, value] of map.entries()) {
    entries.push([key, serializeValue(value)])
  }
  return JSON.stringify(entries)
}

export function stringToMap<T extends Map<string, unknown>>(jsonString: string): T {
  if (!jsonString) {
    return new Map() as T
  }
  try {
    const entries = JSON.parse(jsonString)
    const resultMap = new Map() as T
    for (const [key, serializedValue] of entries) {
      resultMap.set(key, deserializeValue(serializedValue))
    }
    return resultMap
  }
  catch (error) {
    logger('Error parsing JSON string:', error)
    return new Map() as T
  }
}
