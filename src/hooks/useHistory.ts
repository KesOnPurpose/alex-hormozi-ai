import { useState, useCallback, useRef } from 'react'

interface HistoryState<T> {
  past: T[]
  present: T
  future: T[]
}

export function useHistory<T>(initialState: T, maxHistorySize: number = 50) {
  const [state, setState] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: []
  })

  const isUndoing = useRef(false)
  const isRedoing = useRef(false)

  const canUndo = state.past.length > 0
  const canRedo = state.future.length > 0

  const undo = useCallback(() => {
    if (!canUndo) return

    isUndoing.current = true
    setState(currentState => {
      const previous = currentState.past[currentState.past.length - 1]
      const newPast = currentState.past.slice(0, currentState.past.length - 1)
      
      return {
        past: newPast,
        present: previous,
        future: [currentState.present, ...currentState.future]
      }
    })
    setTimeout(() => {
      isUndoing.current = false
    }, 0)
  }, [canUndo])

  const redo = useCallback(() => {
    if (!canRedo) return

    isRedoing.current = true
    setState(currentState => {
      const next = currentState.future[0]
      const newFuture = currentState.future.slice(1)
      
      return {
        past: [...currentState.past, currentState.present],
        present: next,
        future: newFuture
      }
    })
    setTimeout(() => {
      isRedoing.current = false
    }, 0)
  }, [canRedo])

  const pushToHistory = useCallback((newPresent: T) => {
    if (isUndoing.current || isRedoing.current) {
      return
    }

    setState(currentState => {
      // Don't add to history if the state hasn't actually changed
      if (JSON.stringify(currentState.present) === JSON.stringify(newPresent)) {
        return currentState
      }

      const newPast = [...currentState.past, currentState.present]
      
      // Limit history size
      if (newPast.length > maxHistorySize) {
        newPast.shift()
      }

      return {
        past: newPast,
        present: newPresent,
        future: [] // Clear future when new action is performed
      }
    })
  }, [maxHistorySize])

  const reset = useCallback((newState: T) => {
    setState({
      past: [],
      present: newState,
      future: []
    })
  }, [])

  return {
    state: state.present,
    undo,
    redo,
    canUndo,
    canRedo,
    pushToHistory,
    reset
  }
}