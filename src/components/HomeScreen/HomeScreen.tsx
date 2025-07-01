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

import React, { useCallback, useEffect, useState } from "react"
import { LoadingIndicator } from "../LoadingIndicator/LoadingIndicator"
import { ContentRow } from "../ContentRow/ContentRow"
import { DetailModal } from "../DetailModal/DetailModal"
import { apiService } from "../../services/api.service"
import { Container, ContentItem, HomeData } from "../../types/disney.types"
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
  const [focusedPosition, setFocusedPosition] = useState({ row: 0, col: 0 })
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
   * Get currently focused item from position
   */
  const getCurrentlyFocusedItem = useCallback(() => {
    if (!homeData?.data?.StandardCollection?.containers) return null

    const containers = homeData.data.StandardCollection.containers
    const currentRow = containers[focusedPosition.row]

    if (!currentRow?.set?.items) return null

    return currentRow.set.items[focusedPosition.col] || null
  }, [homeData, focusedPosition])

  /**
   * Handle opening the detail modal
   *
   * In BrightScript:
   * sub showDetailModal()
   *     item = getCurrentlyFocusedItem()
   *     if item <> invalid
   *         m.detailModal = createObject("roSGNode", "DetailModal")
   *         m.detailModal.content = item
   *         m.detailModal.visible = true
   *     end if
   * end sub
   */
  const openDetailModal = useCallback(() => {
    const item = getCurrentlyFocusedItem()
    if (item) {
      setSelectedItem(item)
      setIsDetailModalOpen(true)
      console.log("[BrightScript] Opening detail modal for:", item.contentId)
    }
  }, [getCurrentlyFocusedItem])

  /**
   * Handle closing the detail modal
   */
  const closeDetailModal = useCallback(() => {
    setIsDetailModalOpen(false)
    console.log("[BrightScript] Closing detail modal")
  }, [])

  /**
   * Set up keyboard navigation
   * This is a simplified version - in production you'd use the navigation service
   *
   * In BrightScript:
   * function onKeyEvent(key as String, press as Boolean) as Boolean
   *     if press
   *         if key = "up" then handleUp()
   *         else if key = "down" then handleDown()
   *         ' etc...
   *     end if
   * end function
   */
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't handle navigation when modal is open
      if (isDetailModalOpen) return

      if (!homeData?.data?.StandardCollection?.containers) return

      const containers = homeData.data.StandardCollection.containers
      const currentRowMax = rowItemCounts[focusedPosition.row] || 0

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault()
          if (focusedPosition.row > 0) {
            setFocusedPosition((prev) => ({
              row: prev.row - 1,
              col: Math.min(prev.col, rowItemCounts[prev.row - 1] - 1 || 0),
            }))
          }
          break

        case "ArrowDown":
          e.preventDefault()
          if (focusedPosition.row < containers.length - 1) {
            setFocusedPosition((prev) => ({
              row: prev.row + 1,
              col: Math.min(prev.col, rowItemCounts[prev.row + 1] - 1 || 0),
            }))
          }
          break

        case "ArrowLeft":
          e.preventDefault()
          if (focusedPosition.col > 0) {
            setFocusedPosition((prev) => ({ ...prev, col: prev.col - 1 }))
          }
          break

        case "ArrowRight":
          e.preventDefault()
          if (focusedPosition.col < currentRowMax - 1) {
            setFocusedPosition((prev) => ({ ...prev, col: prev.col + 1 }))
          }
          break

        case "Enter":
        case " ":
          e.preventDefault()
          openDetailModal()
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [
    focusedPosition,
    rowItemCounts,
    homeData,
    isDetailModalOpen,
    openDetailModal,
  ])

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
                focusedPosition.row === index ? focusedPosition.col : -1
              }
              onItemsLoaded={handleItemsLoaded}
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
