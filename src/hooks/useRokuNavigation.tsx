/**
 * Custom hook for Roku-style navigation
 *
 * In BrightScript, this logic would be in the component's init() and event handlers:
 *
 * sub init()
 *     m.top.observeField("focusedChild", "onFocusChange")
 *     m.contentGrid.observeField("itemFocused", "onItemFocused")
 *     m.contentGrid.observeField("itemSelected", "onItemSelected")
 * end sub
 *
 * function onKeyEvent(key as String, press as Boolean) as Boolean
 *     if press
 *         handled = false
 *         if key = "up" then handled = moveUp()
 *         else if key = "down" then handled = moveDown()
 *         else if key = "left" then handled = moveLeft()
 *         else if key = "right" then handled = moveRight()
 *         else if key = "OK" then handled = selectItem()
 *         else if key = "back" then handled = handleBack()
 *         return handled
 *     end if
 *     return false
 * end function
 */

import { useCallback, useEffect, useRef, useState } from "react"

export interface FocusPosition {
  row: number
  col: number
}

export interface NavigationConfig {
  rows: number
  cols: number[] | number // Array of cols per row, or single number for uniform grid
  onSelect?: (position: FocusPosition) => void
  onBack?: () => void
  onFocusChange?: (position: FocusPosition) => void
  enabled?: boolean
  wrap?: boolean // Whether to wrap around at edges
  initialPosition?: FocusPosition
}

export const useRokuNavigation = ({
  rows,
  cols,
  onSelect,
  onBack,
  onFocusChange,
  enabled = true,
  wrap = false,
  initialPosition = { row: 0, col: 0 },
}: NavigationConfig) => {
  const [focusPosition, setFocusPosition] =
    useState<FocusPosition>(initialPosition)
  const lastPositionRef = useRef<FocusPosition>(initialPosition)

  /**
   * Get max columns for a specific row
   */
  const getMaxCols = useCallback(
    (row: number): number => {
      if (Array.isArray(cols)) {
        return cols[row] || 0
      }
      return cols
    },
    [cols],
  )

  /**
   * Validate and update position
   */
  const updatePosition = useCallback(
    (newPosition: FocusPosition) => {
      // Validate bounds
      const validRow = Math.max(0, Math.min(rows - 1, newPosition.row))
      const maxCol = getMaxCols(validRow) - 1
      const validCol = Math.max(0, Math.min(maxCol, newPosition.col))

      const validPosition = { row: validRow, col: validCol }

      // Only update if position changed
      if (
        validPosition.row !== focusPosition.row ||
        validPosition.col !== focusPosition.col
      ) {
        console.log(
          `[BrightScript] Focus moved to row: ${validPosition.row}, col: ${validPosition.col}`,
        )
        setFocusPosition(validPosition)
        lastPositionRef.current = validPosition

        if (onFocusChange) {
          onFocusChange(validPosition)
        }
      }
    },
    [focusPosition, rows, getMaxCols, onFocusChange],
  )

  /**
   * Navigation methods
   *
   * In BrightScript:
   * function moveUp() as Boolean
   *     if m.focusRow > 0
   *         m.focusRow--
   *         m.focusCol = clamp(m.focusCol, 0, getRowItems(m.focusRow) - 1)
   *         return true
   *     else if m.wrap
   *         m.focusRow = m.maxRows - 1
   *         return true
   *     end if
   *     return false
   * end function
   */
  const navigate = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      if (!enabled) return

      const currentMaxCol = getMaxCols(focusPosition.row)

      switch (direction) {
        case "up":
          if (focusPosition.row > 0) {
            const newRow = focusPosition.row - 1
            const newMaxCol = getMaxCols(newRow)
            updatePosition({
              row: newRow,
              col: Math.min(focusPosition.col, newMaxCol - 1),
            })
          } else if (wrap) {
            const newRow = rows - 1
            const newMaxCol = getMaxCols(newRow)
            updatePosition({
              row: newRow,
              col: Math.min(focusPosition.col, newMaxCol - 1),
            })
          }
          break

        case "down":
          if (focusPosition.row < rows - 1) {
            const newRow = focusPosition.row + 1
            const newMaxCol = getMaxCols(newRow)
            updatePosition({
              row: newRow,
              col: Math.min(focusPosition.col, newMaxCol - 1),
            })
          } else if (wrap) {
            updatePosition({
              row: 0,
              col: Math.min(focusPosition.col, getMaxCols(0) - 1),
            })
          }
          break

        case "left":
          if (focusPosition.col > 0) {
            updatePosition({
              ...focusPosition,
              col: focusPosition.col - 1,
            })
          } else if (wrap && focusPosition.row > 0) {
            // Move to end of previous row
            const newRow = focusPosition.row - 1
            const newMaxCol = getMaxCols(newRow)
            updatePosition({
              row: newRow,
              col: newMaxCol - 1,
            })
          }
          break

        case "right":
          if (focusPosition.col < currentMaxCol - 1) {
            updatePosition({
              ...focusPosition,
              col: focusPosition.col + 1,
            })
          } else if (wrap && focusPosition.row < rows - 1) {
            // Move to beginning of next row
            updatePosition({
              row: focusPosition.row + 1,
              col: 0,
            })
          }
          break
      }
    },
    [enabled, focusPosition, rows, wrap, getMaxCols, updatePosition],
  )

  /**
   * Handle selection
   */
  const select = useCallback(() => {
    if (!enabled) return

    console.log(
      `[BrightScript] Item selected at row: ${focusPosition.row}, col: ${focusPosition.col}`,
    )
    if (onSelect) {
      onSelect(focusPosition)
    }
  }, [enabled, focusPosition, onSelect])

  /**
   * Handle back action
   */
  const back = useCallback(() => {
    if (!enabled) return

    console.log("[BrightScript] Back button pressed")
    if (onBack) {
      onBack()
    }
  }, [enabled, onBack])

  /**
   * Set up keyboard listeners
   *
   * In BrightScript, this would be handled by onKeyEvent
   */
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      let handled = true

      switch (e.key) {
        case "ArrowUp":
          navigate("up")
          break
        case "ArrowDown":
          navigate("down")
          break
        case "ArrowLeft":
          navigate("left")
          break
        case "ArrowRight":
          navigate("right")
          break
        case "Enter":
        case " ":
          select()
          break
        case "Escape":
        case "Backspace":
          back()
          break
        default:
          handled = false
      }

      if (handled) {
        e.preventDefault()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [enabled, navigate, select, back])

  /**
   * Manual control methods
   */
  const setFocus = useCallback(
    (position: FocusPosition) => {
      updatePosition(position)
    },
    [updatePosition],
  )

  const moveFocus = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      navigate(direction)
    },
    [navigate],
  )

  /**
   * Check if a specific position is focused
   */
  const isFocused = useCallback(
    (row: number, col: number): boolean => {
      return focusPosition.row === row && focusPosition.col === col
    },
    [focusPosition],
  )

  return {
    focusPosition,
    isFocused,
    setFocus,
    moveFocus,
    select,
    back,
    navigate,
    // Expose internal state for debugging
    debug: {
      enabled,
      rows,
      cols: Array.isArray(cols) ? cols : Array(rows).fill(cols),
      lastPosition: lastPositionRef.current,
    },
  }
}
