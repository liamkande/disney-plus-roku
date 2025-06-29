/**
 * ContentRow Component - Horizontal scrolling row of content
 *
 * In BrightScript:
 * <component name="ContentRow" extends="Group">
 *     <interface>
 *         <field id="itemContent" type="node" onChange="onContentChange"/>
 *         <field id="rowIndex" type="integer"/>
 *         <field id="focusPercent" type="float" onChange="onFocusPercentChange"/>
 *     </interface>
 *     <script type="text/brightscript" uri="ContentRow.brs"/>
 * </component>
 */

import React, { useCallback, useEffect, useRef, useState } from "react"
import { Container, ContentItem } from "../../types/disney.types"
import { ContentTile } from "../ContentTile/ContentTile"
import { apiService } from "../../services/api.service"
import {
  EmptyMessage,
  LoadingMessage,
  RowContainer,
  RowTitle,
  TilesContainer,
} from "./ContentRow.styles"

interface ContentRowProps {
  container: Container
  rowIndex: number
  focusedCol?: number
  onItemsLoaded?: (rowIndex: number, items: ContentItem[]) => void
  onItemSelected?: (
    item: ContentItem,
    position: { row: number; col: number },
  ) => void
}

export const ContentRow: React.FC<ContentRowProps> = ({
  container,
  rowIndex,
  focusedCol = -1,
  onItemsLoaded,
  onItemSelected,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isLoadingRefSet, setIsLoadingRefSet] = useState(false)
  const [refSetItems, setRefSetItems] = useState<ContentItem[]>([])
  const [refSetError, setRefSetError] = useState<string | null>(null)
  const [isInView, setIsInView] = useState(false)

  const { set } = container

  // Extract title from the complex text structure
  const title =
    set.text?.title?.full?.set?.default?.content ||
    set.text?.title?.full?.collection?.default?.content ||
    set.text?.title?.full?.default?.content ||
    `Collection ${rowIndex + 1}`

  // Determine if this is a ref set that needs loading
  const isRefSet = set.type === "SetRef" && set.refId
  const items = isRefSet ? refSetItems : set.items || []

  /**
   * Set up intersection observer for lazy loading
   * Extra Credit: "Dynamically populate the ref sets as they come into view"
   *
   * In BrightScript:
   * sub onFocusPercentChange()
   *     if m.top.focusPercent > 0.5 and not m.contentLoaded
   *         loadRefSetData()
   *     end if
   * end sub
   */
  useEffect(() => {
    if (!isRefSet || refSetItems.length > 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
          }
        })
      },
      {
        rootMargin: "100px", // Load 100px before coming into view
        threshold: 0.1,
      },
    )

    const container = scrollContainerRef.current?.parentElement
    if (container) {
      observer.observe(container)
    }

    return () => {
      if (container) {
        observer.unobserve(container)
      }
    }
  }, [isRefSet, refSetItems.length])

  /**
   * Load ref set data when in view or for first 3 rows
   */
  useEffect(() => {
    const loadRefSet = async () => {
      if (!isRefSet || !set.refId || refSetItems.length > 0 || isLoadingRefSet)
        return

      // Load immediately for first 3 rows, or when in view for others
      const shouldLoad = rowIndex < 3 || isInView

      if (!shouldLoad) {
        console.log(`[BrightScript] Row ${rowIndex}: Waiting to come into view`)
        return
      }

      setIsLoadingRefSet(true)
      setRefSetError(null)

      try {
        console.log(
          `[BrightScript] Row ${rowIndex}: Loading ref set ${set.refId}`,
        )
        const refData = await apiService.getRefSetData(set.refId)

        // Extract items from the response (structure varies by set type)
        let items: ContentItem[] = []
        if (refData.data) {
          const dataKeys = Object.keys(refData.data)
          const setData = refData.data[dataKeys[0]]
          items = setData?.items || []
        }

        console.log(
          `[BrightScript] Row ${rowIndex}: Loaded ${items.length} items`,
        )
        setRefSetItems(items)

        // Notify parent
        if (onItemsLoaded) {
          onItemsLoaded(rowIndex, items)
        }
      } catch (error) {
        console.error(
          `[BrightScript] Row ${rowIndex}: Failed to load ref set`,
          error,
        )
        setRefSetError("Failed to load content")
      } finally {
        setIsLoadingRefSet(false)
      }
    }

    loadRefSet()
  }, [
    isRefSet,
    set.refId,
    rowIndex,
    refSetItems.length,
    isLoadingRefSet,
    isInView,
    onItemsLoaded,
  ])

  /**
   * Scroll to focused item with smooth animation
   *
   * In BrightScript:
   * sub onItemFocused()
   *     m.rowScroller.animateToItem = m.focusedIndex
   * end sub
   */
  useEffect(() => {
    if (focusedCol >= 0 && scrollContainerRef.current && items.length > 0) {
      const tileWidth = 300 + 20 // width + gap
      const containerWidth = scrollContainerRef.current.offsetWidth
      const scrollLeft =
        focusedCol * tileWidth - containerWidth / 2 + tileWidth / 2

      scrollContainerRef.current.scrollTo({
        left: Math.max(0, scrollLeft),
        behavior: "smooth",
      })
    }
  }, [focusedCol, items.length])

  /**
   * Handle tile selection
   */
  const handleTileSelect = useCallback(
    (item: ContentItem, position: { row: number; col: number }) => {
      console.log(
        `[BrightScript] Tile selected: ${item.text?.title?.full?.series?.default?.content || "Unknown"}`,
      )
      if (onItemSelected) {
        onItemSelected(item, { row: rowIndex, col: position.col })
      }
    },
    [rowIndex, onItemSelected],
  )

  /**
   * Render content based on state
   */
  const renderContent = () => {
    // Loading state for ref sets
    if (isLoadingRefSet) {
      return <LoadingMessage>Loading content...</LoadingMessage>
    }

    // Error state
    if (refSetError) {
      return <EmptyMessage>{refSetError}</EmptyMessage>
    }

    // Empty state
    if (items.length === 0) {
      if (isRefSet && !isInView && rowIndex > 2) {
        return <EmptyMessage>Scroll down to load content</EmptyMessage>
      }
      return <EmptyMessage>No content available</EmptyMessage>
    }

    // Render items with ContentTile components
    return (
      <TilesContainer ref={scrollContainerRef}>
        {items.map((item, index) => (
          <ContentTile
            key={item.contentId || `${rowIndex}-${index}`}
            item={item}
            isFocused={focusedCol === index}
            position={{ row: rowIndex, col: index }}
            onSelect={handleTileSelect}
          />
        ))}
      </TilesContainer>
    )
  }

  /**
   * Main render
   *
   * In BrightScript:
   * <Group>
   *     <Label id="rowTitle" text="Collection Title" />
   *     <PosterGrid id="posterGrid" itemComponentName="ContentTile" />
   * </Group>
   */
  return (
    <RowContainer>
      <RowTitle>{title}</RowTitle>
      {renderContent()}
    </RowContainer>
  )
}
