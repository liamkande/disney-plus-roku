/**
 * ContentTile Component - Individual content poster with focus scaling
 * Updated to handle actual Disney+ API image structure
 */

import React, { useCallback, useMemo, useState } from "react"
import { ContentItem, FocusPosition } from "../../types/disney.types"
import { getTileImage } from "../../utils/imageHelpers"
import {
  FocusRing,
  PlaceholderContainer,
  ShimmerEffect,
  TileContainer,
  TileGradient,
  TileMetadata,
  TilePoster,
  TileRating,
  TileShadow,
  TileTitle,
} from "./ContentTile.styles"

interface ContentTileProps {
  item: ContentItem
  isFocused: boolean
  position: FocusPosition
  onSelect?: (item: ContentItem, position: FocusPosition) => void
  "data-row"?: number
  "data-col"?: number
}

export const ContentTile: React.FC<ContentTileProps> = ({
  item,
  isFocused,
  position,
  onSelect,
  "data-row": dataRow,
  "data-col": dataCol,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  /**
   * Extract title from complex structure
   */
  const title = useMemo(() => {
    const titleObj = item.text?.title?.full

    if (titleObj?.series?.default?.content) {
      return titleObj.series.default.content
    }
    if (titleObj?.program?.default?.content) {
      return titleObj.program.default.content
    }
    if (titleObj?.collection?.default?.content) {
      return titleObj.collection.default.content
    }
    if (titleObj?.default?.content) {
      return titleObj.default.content
    }

    return "Untitled"
  }, [item.text])

  /**
   * Extract optimal image URL (1.78 aspect ratio)
   * Updated to handle the actual Disney+ API structure
   *
   * The structure is: image.tile["1.78"].series.default.url
   */
  const imageUrl = useMemo(() => {
    const url = getTileImage(item)
    if (url) {
      console.log(`[BrightScript] Found image for ${title}: ${url}`)
    } else {
      console.warn(`[BrightScript] No image found for ${title}`)
    }
    return url
  }, [item, title])

  /**
   * Get content rating if available
   */
  const rating = useMemo(() => {
    return item.ratings?.[0]?.value || null
  }, [item.ratings])

  /**
   * Get content type for metadata
   */
  const contentType = useMemo(() => {
    if (item.programType) {
      return (
        item.programType.charAt(0).toUpperCase() + item.programType.slice(1)
      )
    }
    if (item.type) {
      return item.type.charAt(0).toUpperCase() + item.type.slice(1)
    }
    return ""
  }, [item.programType, item.type])

  /**
   * Handle image load events
   */
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true)
    console.log(`[BrightScript] Image loaded for: ${title}`)
  }, [title])

  const handleImageError = useCallback(() => {
    setImageError(true)
    console.error(`[BrightScript] Failed to load image for: ${title}`)
  }, [title])

  /**
   * Handle tile selection
   *
   * BrightScript equivalent:
   * sub onItemSelected()
   *     m.top.getScene().callFunc("showDetailModal", m.itemContent)
   * end sub
   */
  const handleClick = useCallback(() => {
    if (onSelect) {
      onSelect(item, position)
    }
  }, [item, position, onSelect])

  /**
   * Handle keyboard selection
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        handleClick()
      }
    },
    [handleClick],
  )

  /**
   * Render placeholder while loading or on error
   */
  if (!imageUrl || imageError) {
    return (
      <TileContainer
        isFocused={isFocused}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
        role="button"
        aria-label={title}
        data-row={dataRow}
        data-col={dataCol}
      >
        <PlaceholderContainer>
          <ShimmerEffect />
          <div
            style={{
              position: "relative",
              zIndex: 1,
              padding: "20px",
              textAlign: "center",
            }}
          >
            {title}
          </div>
        </PlaceholderContainer>
        {isFocused && <FocusRing />}
      </TileContainer>
    )
  }

  /**
   * Main render
   *
   * BrightScript equivalent:
   * <Group>
   *     <Rectangle id="tileShadow" />
   *     <Poster id="poster" />
   *     <Rectangle id="gradient" />
   *     <Label id="titleLabel" />
   * </Group>
   */
  return (
    <TileContainer
      isFocused={isFocused}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      role="button"
      aria-label={title}
      data-content-id={item.contentId}
      data-row={dataRow}
      data-col={dataCol}
    >
      {/* Shadow for depth (Disney magic) */}
      <TileShadow isFocused={isFocused} />

      {/* Main poster image */}
      <TilePoster
        src={imageUrl}
        alt={title}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
        isLoaded={imageLoaded}
      />

      {/* Show shimmer until image loads */}
      {!imageLoaded && (
        <PlaceholderContainer style={{ position: "absolute", top: 0, left: 0 }}>
          <ShimmerEffect />
        </PlaceholderContainer>
      )}

      {/* Gradient overlay for text visibility */}
      <TileGradient isFocused={isFocused} />

      {/* Content metadata shown on focus */}
      {isFocused && (
        <TileMetadata>
          {rating && <TileRating>{rating}</TileRating>}
          {contentType && <span>{contentType}</span>}
        </TileMetadata>
      )}

      {/* Title shown on focus */}
      <TileTitle isFocused={isFocused}>{title}</TileTitle>

      {/* Focus ring for accessibility */}
      {isFocused && <FocusRing />}
    </TileContainer>
  )
}
