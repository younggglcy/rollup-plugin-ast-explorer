import type { FC } from 'react'

interface ListProps {
  keys: string[]
  activeId: string
  onClick: (id: string) => void
}

export const List: FC<ListProps> = (_props) => {
  // const {
  // keys,
  // activeId,
  // onClick,
  // } = props

  return (
    <div
      className="flex-1"
    >

    </div>
  )
}
