import type { FC } from 'react'
import { memo } from 'react'

export interface AstNodeValueProps {
  value: unknown
}

export const AstNodeValue: FC<AstNodeValueProps> = memo(({ value }) => {
  if (value === null) {
    return <span className="text-red-600 dark:text-red-400">null</span>
  }

  if (value === undefined) {
    return <span className="text-red-600 dark:text-red-400">undefined</span>
  }

  if (typeof value === 'string') {
    // Truncate long strings
    const displayValue = value.length > 50 ? `${value.slice(0, 50)}...` : value
    return (
      <span className="text-green-600 dark:text-green-400" title={value}>
        &quot;
        {displayValue}
        &quot;
      </span>
    )
  }

  if (typeof value === 'number') {
    return <span className="text-blue-600 dark:text-blue-400">{value}</span>
  }

  if (typeof value === 'boolean') {
    return (
      <span className="text-red-600 dark:text-red-400">
        {value ? 'true' : 'false'}
      </span>
    )
  }

  if (typeof value === 'function') {
    return <span className="text-neutral-500 italic">[function]</span>
  }

  if (Array.isArray(value)) {
    return (
      <span className="text-neutral-500">
        Array(
        {value.length}
        )
      </span>
    )
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>
    if ('type' in obj && typeof obj.type === 'string') {
      return null // Will be rendered as node type badge
    }
    return <span className="text-neutral-500">{'{...}'}</span>
  }

  return <span className="text-neutral-500">{String(value)}</span>
})

AstNodeValue.displayName = 'AstNodeValue'
