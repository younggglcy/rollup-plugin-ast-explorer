import type { Dispatch, FC, PropsWithChildren } from 'react'
import type { AstExplorerAction, AstExplorerState, FilterOptions } from '@/ssr/types/ast'
import { createContext, useContext, useMemo, useReducer } from 'react'

const defaultFilterOptions: FilterOptions = {
  hideMethods: true,
  hideEmptyKeys: false,
  hideLocationData: false,
  hideTypeKeys: false,
}

const initialState: AstExplorerState = {
  selectedModuleId: null,
  selectedNode: null,
  hoveredNode: null,
  viewMode: 'tree',
  filterOptions: defaultFilterOptions,
  expandedPaths: new Set<string>(['Program']),
}

function astExplorerReducer(
  state: AstExplorerState,
  action: AstExplorerAction,
): AstExplorerState {
  switch (action.type) {
    case 'SELECT_MODULE':
      return {
        ...state,
        selectedModuleId: action.moduleId,
        selectedNode: null,
        hoveredNode: null,
        expandedPaths: new Set<string>(['Program']),
      }

    case 'SELECT_NODE':
      return {
        ...state,
        selectedNode: action.node,
      }

    case 'HOVER_NODE':
      return {
        ...state,
        hoveredNode: action.node,
      }

    case 'SET_VIEW_MODE':
      return {
        ...state,
        viewMode: action.mode,
      }

    case 'TOGGLE_FILTER':
      return {
        ...state,
        filterOptions: {
          ...state.filterOptions,
          [action.filter]: !state.filterOptions[action.filter],
        },
      }

    case 'TOGGLE_EXPAND': {
      const newExpanded = new Set(state.expandedPaths)
      if (newExpanded.has(action.path)) {
        newExpanded.delete(action.path)
      }
      else {
        newExpanded.add(action.path)
      }
      return {
        ...state,
        expandedPaths: newExpanded,
      }
    }

    case 'EXPAND_TO_PATH': {
      const newExpanded = new Set(state.expandedPaths)
      const parts = action.path.split('.')
      let currentPath = ''
      for (const part of parts) {
        currentPath = currentPath ? `${currentPath}.${part}` : part
        newExpanded.add(currentPath)
      }
      return {
        ...state,
        expandedPaths: newExpanded,
      }
    }

    case 'COLLAPSE_ALL':
      return {
        ...state,
        expandedPaths: new Set<string>(['Program']),
      }

    case 'EXPAND_ALL':
      return {
        ...state,
        expandedPaths: new Set(action.paths),
      }

    default:
      return state
  }
}

interface AstExplorerContextValue {
  state: AstExplorerState
  dispatch: Dispatch<AstExplorerAction>
}

const AstExplorerContext = createContext<AstExplorerContextValue | null>(null)

export const AstExplorerProvider: FC<PropsWithChildren<{ initialModuleId?: string }>> = ({
  children,
  initialModuleId,
}) => {
  const [state, dispatch] = useReducer(astExplorerReducer, {
    ...initialState,
    selectedModuleId: initialModuleId ?? null,
  })

  const value = useMemo(() => ({ state, dispatch }), [state])

  return (
    <AstExplorerContext.Provider value={value}>
      {children}
    </AstExplorerContext.Provider>
  )
}

export function useAstExplorer(): AstExplorerContextValue {
  const context = useContext(AstExplorerContext)
  if (!context) {
    throw new Error('useAstExplorer must be used within AstExplorerProvider')
  }
  return context
}

export { AstExplorerContext }
