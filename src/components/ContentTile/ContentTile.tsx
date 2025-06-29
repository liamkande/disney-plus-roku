/**
 * ContentTile Component - Individual content poster with focus scaling
 *
 * In BrightScript:
 * <component name="ContentTile" extends="Group">
 *     <interface>
 *         <field id="itemContent" type="node" onChange="onContentChange"/>
 *         <field id="focusPercent" type="float" onChange="onFocusChange"/>
 *     </interface>
 *     <script type="text/brightscript" uri="ContentTile.brs"/>
 * </component>
 */

import React, { useCallback, useMemo, useState } from "react"
import { ContentItem, FocusPosition } from "../../types/disney.types"
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
}

export const ContentTile: React.FC<ContentTileProps> = ({
  item,
  isFocused,
  position,
  onSelect,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  /**
   * Extract optimal image URL (1.78 aspect ratio)
   *
   * BrightScript equivalent:
   * function getOptimalImage(images as Object) as String
   *     for each imageType in ["tile", "hero_tile", "hero_collection"]
   *         if images[imageType] <> invalid
   *             for each image in images[imageType]
   *                 if Abs(image.aspectRatio - 1.78) < 0.01
   *                     return image.url
   *                 end if
   *             end for
   *         end if
   *     end for
   *     return ""
   * end function
   */
  const imageUrl = useMemo(() => {
    if (!item.image) return ""

    // Priority order for image types
    const imageTypes: (keyof typeof item.image)[] = [
      "tile",
      "hero_tile",
      "hero_collection",
      "background",
      "background_details",
    ]

    for (const imageType of imageTypes) {
      const images = item.image[imageType]
      if (images && Array.isArray(images)) {
        // Find 1.78 aspect ratio image (16:9) as required
        const targetImage = images.find(
          (img) => img.aspectRatio && Math.abs(img.aspectRatio - 1.78) < 0.01,
        )

        if (targetImage?.url) {
          return targetImage.url
        }
      }
    }

    // Fallback: try to find any 16:9 image
    for (const imageType of imageTypes) {
      const images = item.image[imageType]
      if (images?.[0]?.url) {
        return images[0].url
      }
    }

    return ""
  }, [item.image])

  /**
   * Extract title from complex structure
   *
   * BrightScript equivalent:
   * function getTitle(text as Object) as String
   *     if text?.title?.full?.series?.default?.content <> invalid
   *         return text.title.full.series.default.content
   *     else if text?.title?.full?.program?.default?.content <> invalid
   *         return text.title.full.program.default.content
   *     ' ... etc
   *     end if
   *     return "Untitled"
   * end function
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
