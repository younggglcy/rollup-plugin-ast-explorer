import type { FC } from 'react'
import type { FilterOptions } from '@/ssr/types/ast'
import { ChevronsDownUp, ChevronsUpDown } from 'lucide-react'

import { Button } from '@/ssr/components/ui/button'
import { Toggle } from '@/ssr/components/ui/toggle'
import { ToggleGroup, ToggleGroupItem } from '@/ssr/components/ui/toggle-group'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/ssr/components/ui/tooltip'

export interface AstToolbarProps {
  viewMode: 'tree' | 'json'
  filterOptions: FilterOptions
  onViewModeChange: (mode: 'tree' | 'json') => void
  onFilterChange: (filter: keyof FilterOptions) => void
  onCollapseAll: () => void
  onExpandAll: () => void
}

export const AstToolbar: FC<AstToolbarProps> = ({
  viewMode,
  filterOptions,
  onViewModeChange,
  onFilterChange,
  onCollapseAll,
  onExpandAll,
}) => {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
        {/* View mode toggle */}
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={value => value && onViewModeChange(value as 'tree' | 'json')}
          size="sm"
        >
          <ToggleGroupItem value="tree" aria-label="Tree view">
            Tree
          </ToggleGroupItem>
          <ToggleGroupItem value="json" aria-label="JSON view">
            JSON
          </ToggleGroupItem>
        </ToggleGroup>

        {/* Filter options (only show in tree view) */}
        {viewMode === 'tree' && (
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  pressed={filterOptions.hideLocationData}
                  onPressedChange={() => onFilterChange('hideLocationData')}
                  aria-label="Hide location data"
                >
                  loc
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Hide location data (loc, start, end)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  pressed={filterOptions.hideEmptyKeys}
                  onPressedChange={() => onFilterChange('hideEmptyKeys')}
                  aria-label="Hide empty keys"
                >
                  empty
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Hide empty keys (null, undefined, [])</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  pressed={filterOptions.hideTypeKeys}
                  onPressedChange={() => onFilterChange('hideTypeKeys')}
                  aria-label="Hide type keys"
                >
                  type
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Hide type keys</TooltipContent>
            </Tooltip>

            <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-700 mx-1" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={onCollapseAll}
                  aria-label="Collapse all"
                >
                  <ChevronsDownUp className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Collapse all</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={onExpandAll}
                  aria-label="Expand all"
                >
                  <ChevronsUpDown className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Expand all</TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
