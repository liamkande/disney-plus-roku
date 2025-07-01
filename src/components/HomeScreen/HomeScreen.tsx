/**
 * HomeScreen Component - Main container for the Disney+ experience
 *
 * In BrightScript, this would be defined as:
 *
 * <component name="HomeScreen" extends="Scene">
 *     <interface>
 *         <field id="focusedContent" type="node" alwaysNotify="true"/>
 *     </interface>
 *     <script type="text/brightscript" uri="HomeScreen.brs"/>
 * </component>
 */

import React, { useCallback, useEffect, useMemo, useState } from "react"
import { LoadingIndicator } from "../LoadingIndicator/LoadingIndicator"
import { ContentRow } from "../ContentRow/ContentRow"
import { DetailModal } from "../DetailModal/DetailModal"
import { apiService } from "../../services/api.service"
import { Container, ContentItem, HomeData } from "../../types/disney.types"
import { FocusPosition, useRokuNavigation } from "../../hooks/useRokuNavigation"
import {
  BackgroundGradient,
  ContentContainer,
  ContentGrid,
  ErrorMessage,
  HomeScreenContainer,
  LoadingContainer,
} from "./HomeScreen.styles"

export const HomeScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [homeData, setHomeData] = useState<HomeData | null>(null)
  const [rowItemCounts, setRowItemCounts] = useState<number[]>([])
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  /**
   * Load home content on mount
   *
   * In BrightScript:
   * sub init()
   *     m.loadingIndicator = m.top.findNode("loadingIndicator")
   *     m.contentContainer = m.top.findNode("contentContainer")
   *     m.errorLabel = m.top.findNode("errorLabel")
   *     loadHomeContent()
   * end sub
   *
   * sub loadHomeContent()
   *     m.homeTask = CreateObject("roSGNode", "HomeLoaderTask")
   *     m.homeTask.observeField("content", "onContentLoaded")
   *     m.homeTask.observeField("error", "onError")
   *     m.homeTask.control = "run"
   * end sub
   */
  useEffect(() => {
    const loadHomeContent = async () => {
      try {
        console.log("[BrightScript] HomeScreen init - loading content...")

        // Reset error state
        setError(null)
        setIsLoading(true)

        // Fetch home data from API
        const data = await apiService.getHomeData()

        console.log("[BrightScript] Content loaded successfully")
        setHomeData(data)

        // Initialize row item counts
        if (data?.data?.StandardCollection?.containers) {
          const counts = data.data.StandardCollection.containers.map(
            (container) => container.set.items?.length || 0,
          )
          setRowItemCounts(counts)
        }
      } catch (err) {
        console.error("[BrightScript] Failed to load home content:", err)
        setError(
          "Unable to load content. Please check your connection and try again.",
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadHomeContent()
  }, [])

  /**
   * Handle when ref set items are loaded
   * Updates the item count for navigation
   *
   * In BrightScript:
   * sub onRefSetLoaded(event as Object)
   *     data = event.getData()
   *     m.rowItemCounts[data.rowIndex] = data.items.count()
   * end sub
   */
  const handleItemsLoaded = useCallback(
    (rowIndex: number, items: ContentItem[]) => {
      setRowItemCounts((prev) => {
        const newCounts = [...prev]
        newCounts[rowIndex] = items.length
        return newCounts
      })
    },
    [],
  )

  /**
   * Prepare navigation configuration
   */
  const rowCount = useMemo(() => {
    return homeData?.data?.StandardCollection?.containers?.length || 0
  }, [homeData])

  /**
   * Initialize Roku-style navigation
   */
  const navigation = useRokuNavigation({
    rows: rowCount,
    cols: rowItemCounts,
    onSelect: (position) => {
      // For keyboard navigation, click the element
      const element = document.querySelector(
        `[data-row="${position.row}"][data-col="${position.col}"]`,
      ) as HTMLElement

      if (element) {
        console.log(
          `[BrightScript] Keyboard selection at row ${position.row}, col ${position.col}`,
        )
        element.click()
      }
    },
    onFocusChange: (position: FocusPosition): void => {
      console.log(
        `[BrightScript] Focus changed to row: ${position.row}, col: ${position.col}`,
      )
    },
    enabled: !isDetailModalOpen && !isLoading && !error,
    wrap: false,
    initialPosition: { row: 0, col: 0 },
  })

  /**
   * Handle item selection - show detail modal
   * Extra Credit: "Allow interaction or selection of a tile"
   *
   * In BrightScript:
   * sub onItemSelected(event as Object)
   *     item = event.getData()
   *     m.detailModal.content = item
   *     m.detailModal.visible = true
   *     m.detailModal.setFocus(true)
   * end sub
   */
  const handleItemSelected = useCallback(
    (item: ContentItem, position: { row: number; col: number }) => {
      console.log("[BrightScript] Item selected:", {
        title:
          item.text?.title?.full?.series?.default?.content ||
          item.text?.title?.full?.program?.default?.content ||
          "Unknown",
        position,
        contentId: item.contentId,
      })

      setSelectedItem(item)
      setIsDetailModalOpen(true)

      // Update navigation focus to match
      navigation.setFocus(position)
    },
    [navigation],
  )

  /**
   * Handle closing the detail modal
   */
  const closeDetailModal = useCallback(() => {
    setIsDetailModalOpen(false)
    console.log("[BrightScript] Closing detail modal")
  }, [])

  /**
   * Render loading state
   */
  if (isLoading) {
    return (
      <HomeScreenContainer>
        <LoadingContainer>
          <LoadingIndicator />
        </LoadingContainer>
      </HomeScreenContainer>
    )
  }

  /**
   * Render error state
   */
  if (error) {
    return (
      <HomeScreenContainer>
        <ErrorMessage>{error}</ErrorMessage>
      </HomeScreenContainer>
    )
  }

  /**
   * Render empty state
   */
  if (!homeData?.data?.StandardCollection?.containers?.length) {
    return (
      <HomeScreenContainer>
        <ErrorMessage>No content available</ErrorMessage>
      </HomeScreenContainer>
    )
  }

  /**
   * Extract containers for easier access
   */
  const containers = homeData.data.StandardCollection.containers

  /**
   * Main render with content
   *
   * In BrightScript:
   * <Rectangle width="1920" height="1080" color="0x1a1d29FF">
   *     <MarkupGrid id="contentGrid" itemComponentName="ContentRow" />
   *     <DetailModal id="detailModal" visible="false" />
   * </Rectangle>
   */
  return (
    <HomeScreenContainer>
      {/* Disney+ style gradient at top */}
      <BackgroundGradient />

      <ContentContainer className="loaded">
        <ContentGrid>
          {containers.map((container: Container, index: number) => (
            <ContentRow
              key={container.set.setId || `row-${index}`}
              container={container}
              rowIndex={index}
              focusedCol={
                navigation.focusPosition.row === index
                  ? navigation.focusPosition.col
                  : -1
              }
              onItemsLoaded={handleItemsLoaded}
              onItemSelected={handleItemSelected}
            />
          ))}
        </ContentGrid>
      </ContentContainer>

      {/* Detail Modal */}
      <DetailModal
        item={selectedItem}
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
      />
    </HomeScreenContainer>
  )
}
