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

import React, { useEffect, useState } from "react"
import { LoadingIndicator } from "../LoadingIndicator/LoadingIndicator"
import { apiService } from "../../services/api.service"
import { Container, HomeData } from "../../types/disney.types"
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

        // Log what we received for debugging
        if (data?.data?.StandardCollection?.containers) {
          const containerCount = data.data.StandardCollection.containers.length
          console.log(`[BrightScript] Loaded ${containerCount} content rows`)

          // Log each container type
          data.data.StandardCollection.containers.forEach(
            (container, index) => {
              const setType = container.set.type
              const itemCount = container.set.items?.length || 0
              const refId = container.set.refId
              console.log(
                `[BrightScript] Row ${index}: ${setType}${refId ? ` (refId: ${refId})` : ""} - ${itemCount} items`,
              )
            },
          )
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
   * Render loading state
   *
   * In BrightScript:
   * if m.isLoading
   *     m.loadingIndicator.visible = true
   *     m.contentContainer.visible = false
   * end if
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
   *
   * In BrightScript:
   * if m.error <> invalid
   *     m.errorLabel.text = m.error
   *     m.errorLabel.visible = true
   *     m.contentContainer.visible = false
   * end if
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
          {/* Temporarily render container titles to verify data */}
          {containers.map((container: Container, index: number) => {
            const title =
              container.set.text?.title?.full?.set?.default?.content ||
              container.set.text?.title?.full?.collection?.default?.content ||
              container.set.text?.title?.full?.default?.content ||
              `Row ${index + 1}`

            const itemCount = container.set.items?.length || 0
            const isRefSet = container.set.type === "SetRef"
            const refId = container.set.refId

            return (
              <div
                key={container.set.setId || index}
                style={{ marginBottom: "20px" }}
              >
                <h2
                  style={{
                    color: "white",
                    fontSize: "24px",
                    margin: "0 90px 10px",
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  }}
                >
                  {title}
                </h2>
                <div
                  style={{
                    color: "#999",
                    fontSize: "14px",
                    margin: "0 90px",
                  }}
                >
                  {isRefSet ? (
                    <span>
                      Reference Set (ID: {refId}) - Will load on focus
                    </span>
                  ) : (
                    <span>{itemCount} items available</span>
                  )}
                </div>
                {/* Placeholder for content row */}
                <div
                  style={{
                    height: "169px",
                    margin: "10px 90px",
                    backgroundColor: "#2a2d3a",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#666",
                  }}
                >
                  ContentRow Component Coming Next
                </div>
              </div>
            )
          })}
        </ContentGrid>
      </ContentContainer>
    </HomeScreenContainer>
  )
}
