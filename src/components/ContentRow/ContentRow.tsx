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

import React, { useEffect, useRef, useState } from "react"
import { Container, ContentItem } from "../../types/disney.types"
import { apiService } from "../../services/api.service"
import {
  EmptyMessage,
  LoadingMessage,
  RowContainer,
  RowTitle,
  TilePlaceholder,
  TilesContainer,
} from "./ContentRow.styles"

interface ContentRowProps {
  container: Container
  rowIndex: number
  focusedCol?: number
  onItemsLoaded?: (rowIndex: number, items: ContentItem[]) => void
}

export const ContentRow: React.FC<ContentRowProps> = ({
  container,
  rowIndex,
  focusedCol = -1,
  onItemsLoaded,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isLoadingRefSet, setIsLoadingRefSet] = useState(false)
  const [refSetItems, setRefSetItems] = useState<ContentItem[]>([])
  const [refSetError, setRefSetError] = useState<string | null>(null)

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
   * Load ref set data when component mounts (for first 3 rows)
   * or when it comes into view
   *
   * In BrightScript:
   * sub init()
   *     if m.top.itemContent.refId <> invalid
   *         loadRefSetData(m.top.itemContent.refId)
   *     end if
   * end sub
   */
  useEffect(() => {
    const loadRefSet = async () => {
      if (!isRefSet || !set.refId || refSetItems.length > 0) return

      // Auto-load first 3 rows for better UX
      if (rowIndex > 2) {
        console.log(
          `[BrightScript] Row ${rowIndex}: Waiting for focus to load ref set`,
        )
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
          // The data can be in different formats
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
  }, [isRefSet, set.refId, rowIndex, refSetItems.length, onItemsLoaded])

  /**
   * Scroll to focused item
   *
   * In BrightScript:
   * sub onFocusPercentChange()
   *     if m.top.focusPercent > 0
   *         m.posterGrid.animateToItem = m.focusedIndex
   *     end if
   * end sub
   */
  useEffect(() => {
    if (focusedCol >= 0 && scrollContainerRef.current) {
      const tileWidth = 300 + 20 // width + margin
      const containerWidth = scrollContainerRef.current.offsetWidth
      const scrollLeft =
        focusedCol * tileWidth - containerWidth / 2 + tileWidth / 2

      scrollContainerRef.current.scrollTo({
        left: Math.max(0, scrollLeft),
        behavior: "smooth",
      })
    }
  }, [focusedCol])

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
      if (isRefSet && rowIndex > 2) {
        return <EmptyMessage>Navigate here to load content</EmptyMessage>
      }
      return <EmptyMessage>No content available</EmptyMessage>
    }

    // Render items
    return (
      <TilesContainer ref={scrollContainerRef}>
        {items.map((item, index) => {
          // Find image with 1.78 aspect ratio (16:9) as required
          let imageUrl = ""

          if (item.image) {
            // Check different image types in order of preference
            const imageTypes = [
              "tile",
              "hero_tile",
              "hero_collection",
              "background",
            ]

            for (const imageType of imageTypes) {
              const images = item.image[imageType as keyof typeof item.image]
              if (images && Array.isArray(images)) {
                // Find 1.78 aspect ratio image
                const image178 = images.find(
                  (img) => Math.abs((img.aspectRatio || 0) - 1.78) < 0.01,
                )

                if (image178) {
                  imageUrl = image178.url
                  break
                }

                // Fallback to first image if no 1.78 found
                if (!imageUrl && images[0]) {
                  imageUrl = images[0].url
                }
              }
            }
          }

          // Extract title
          const itemTitle =
            item.text?.title?.full?.series?.default?.content ||
            item.text?.title?.full?.program?.default?.content ||
            item.text?.title?.full?.collection?.default?.content ||
            item.text?.title?.full?.default?.content ||
            "Untitled"

          return (
            <TilePlaceholder
              key={item.contentId || index}
              isFocused={focusedCol === index}
              style={{
                backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
              }}
              title={itemTitle}
              data-content-id={item.contentId}
              data-row={rowIndex}
              data-col={index}
            >
              {!imageUrl && (
                <div
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#999",
                    fontSize: "14px",
                  }}
                >
                  {itemTitle}
                </div>
              )}
            </TilePlaceholder>
          )
        })}
      </TilesContainer>
    )
  }

  /**
   * Main render
   *
   * In BrightScript:
   * <Group>
   *     <Label id="rowTitle" text="Collection Title" />
   *     <PosterGrid id="posterGrid" />
   * </Group>
   */
  return (
    <RowContainer>
      <RowTitle>{title}</RowTitle>
      {renderContent()}
    </RowContainer>
  )
}
