/**
 * DetailModal Component - Shows content details on selection
 * Extra Credit: "Allow interaction or selection of a tile"
 *
 * In BrightScript:
 * <component name="DetailModal" extends="Group">
 *     <interface>
 *         <field id="content" type="node" onChange="onContentChange"/>
 *         <field id="visible" type="boolean" value="false"/>
 *     </interface>
 *     <script type="text/brightscript" uri="DetailModal.brs"/>
 * </component>
 */

import React, { useCallback, useEffect, useMemo, useState } from "react"
import { ContentItem } from "../../types/disney.types"
import {
  AddButton,
  Backdrop,
  ButtonContainer,
  CloseButton,
  ContentInfo,
  Description,
  HeroGradient,
  HeroImage,
  HeroImageContainer,
  ImagePlaceholder,
  LoadingShimmer,
  LoadingState,
  MetadataContainer,
  MetadataItem,
  ModalContainer,
  ModalContent,
  ModalOverlay,
  PlayButton,
  Rating,
  Title,
} from "./DetailModal.styles"

interface DetailModalProps {
  item: ContentItem | null
  isOpen: boolean
  onClose: () => void
}

export const DetailModal: React.FC<DetailModalProps> = ({
  item,
  isOpen,
  onClose,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  /**
   * Handle keyboard events for closing
   *
   * In BrightScript:
   * function onKeyEvent(key as String, press as Boolean) as Boolean
   *     if press and (key = "back" or key = "escape")
   *         closeModal()
   *         return true
   *     end if
   *     return false
   * end function
   */
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Backspace") {
        e.preventDefault()
        handleClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isOpen])

  /**
   * Reset image loaded state when item changes
   */
  useEffect(() => {
    setImageLoaded(false)
    setImageError(false)
  }, [item])

  /**
   * Handle close with animation
   *
   * In BrightScript:
   * sub closeModal()
   *     m.closeAnimation.control = "start"
   *     m.closeAnimation.observeField("state", "onCloseAnimationComplete")
   * end sub
   */
  const handleClose = useCallback(() => {
    setIsClosing(true)
    // Wait for animation to complete
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 300)
  }, [onClose])

  /**
   * Extract hero image (prefer wider aspect ratios for hero)
   */
  const heroImageUrl = useMemo(() => {
    if (!item?.image) return ""

    // Priority order for hero images
    const imageTypes: (keyof typeof item.image)[] = [
      "hero_collection",
      "hero_tile",
      "background",
      "background_details",
      "tile",
    ]

    for (const imageType of imageTypes) {
      const images = item.image[imageType]
      if (images && Array.isArray(images)) {
        // For hero, prefer wider images (aspect ratio > 1.78)
        const wideImage = images.find(
          (img) => img.aspectRatio && img.aspectRatio >= 1.78,
        )

        if (wideImage?.url) {
          return wideImage.url
        }

        // Fallback to any available image
        if (images[0]?.url) {
          return images[0].url
        }
      }
    }

    return ""
  }, [item?.image])

  /**
   * Extract content details
   */
  const contentDetails = useMemo(() => {
    if (!item) return null

    const titleObj = item.text?.title?.full
    const title =
      titleObj?.series?.default?.content ||
      titleObj?.program?.default?.content ||
      titleObj?.collection?.default?.content ||
      titleObj?.default?.content ||
      "Untitled"

    const rating = item.ratings?.[0]?.value || null
    const releaseYear = item.releases?.[0]?.releaseDate
      ? new Date(item.releases[0].releaseDate).getFullYear()
      : null

    const genres = item.typedGenres?.map((g) => g.name).join(", ") || null
    const contentType = item.programType || item.type || ""

    return {
      title,
      rating,
      releaseYear,
      genres,
      contentType: contentType.charAt(0).toUpperCase() + contentType.slice(1),
      contentId: item.contentId,
    }
  }, [item])

  // Don't render if not open
  if (!isOpen || !item || !contentDetails) {
    return null
  }

  /**
   * Main render
   *
   * In BrightScript:
   * <Group id="modalGroup" opacity="0">
   *     <Rectangle id="backdrop" width="1920" height="1080" color="0x000000DD" />
   *     <Group id="modalContent" translation="[0, 1080]">
   *         <Poster id="heroPoster" />
   *         <Label id="titleLabel" />
   *         <ButtonGroup id="buttons" />
   *     </Group>
   * </Group>
   */
  return (
    <ModalOverlay className={isClosing ? "closing" : ""}>
      {/* Background overlay */}
      <Backdrop onClick={handleClose} />

      {/* Modal content */}
      <ModalContainer className={isClosing ? "closing" : ""}>
        <CloseButton onClick={handleClose} aria-label="Close modal">
          ✕
        </CloseButton>

        {/* Hero image section */}
        <HeroImageContainer>
          {heroImageUrl && !imageError ? (
            <>
              <HeroImage
                src={heroImageUrl}
                alt={contentDetails.title || "Content details"}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                className={imageLoaded ? "loaded" : ""}
              />
              {!imageLoaded && (
                <LoadingState>
                  <LoadingShimmer />
                </LoadingState>
              )}
            </>
          ) : (
            <ImagePlaceholder>
              <span>{contentDetails.title}</span>
            </ImagePlaceholder>
          )}
          <HeroGradient />
        </HeroImageContainer>

        {/* Content information */}
        <ModalContent>
          <ContentInfo>
            <Title>{contentDetails.title}</Title>

            <MetadataContainer>
              {contentDetails.rating && (
                <Rating>{contentDetails.rating}</Rating>
              )}
              {contentDetails.releaseYear && (
                <MetadataItem>{contentDetails.releaseYear}</MetadataItem>
              )}
              {contentDetails.contentType && (
                <MetadataItem>{contentDetails.contentType}</MetadataItem>
              )}
              {contentDetails.genres && (
                <MetadataItem>{contentDetails.genres}</MetadataItem>
              )}
            </MetadataContainer>

            <Description>
              {/* In a real app, this would come from the API */}
              Experience the magic of {contentDetails.title}.
              {contentDetails.contentType === "Series" &&
                " Stream all episodes now on Disney+."}
              {contentDetails.contentType === "Movie" &&
                " Watch this incredible journey on Disney+."}
            </Description>

            <ButtonContainer>
              <PlayButton
                onClick={() =>
                  console.log(
                    "[BrightScript] Play content:",
                    contentDetails.contentId,
                  )
                }
              >
                <span className="icon">▶</span>
                <span>Play</span>
              </PlayButton>

              <AddButton
                onClick={() =>
                  console.log(
                    "[BrightScript] Add to watchlist:",
                    contentDetails.contentId,
                  )
                }
              >
                <span className="icon">+</span>
                <span>Add to List</span>
              </AddButton>
            </ButtonContainer>
          </ContentInfo>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  )
}

export default React.memo(DetailModal)
