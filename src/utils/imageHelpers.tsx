/**
 * Image extraction utilities for Disney+ API structure
 *
 * In BrightScript:
 * function getImageFromItem(item as Object, preferredRatio = "1.78" as String) as String
 *     if item = invalid or item.image = invalid then return ""
 *     ' Implementation
 * end function
 */

export const getImageUrl = (
  imageData: any,
  preferredAspectRatio: string = "1.78",
  preferredWidth: number = 500,
): string => {
  if (!imageData) return ""

  const imageTypes = [
    "tile",
    "hero_tile",
    "hero_collection",
    "background",
    "background_details",
  ]
  const aspectRatios = [preferredAspectRatio, "2.29", "1.78", "1.33", "0.75"]
  const contentTypes = ["series", "program", "collection", "default"]

  for (const imageType of imageTypes) {
    const imageCategory = imageData[imageType]

    if (imageCategory && typeof imageCategory === "object") {
      for (const ratio of aspectRatios) {
        const ratioData = imageCategory[ratio]
        if (ratioData) {
          for (const contentType of contentTypes) {
            const content = ratioData[contentType]
            if (content?.default?.url) {
              // Update width in URL if needed
              let url = content.default.url
              if (preferredWidth && url.includes("width=")) {
                url = url.replace(/width=\d+/, `width=${preferredWidth}`)
              }
              return url
            }
          }
        }
      }
    }
  }

  return ""
}

export const getTileImage = (item: any): string => {
  // Add null check here
  if (!item || !item.image) return ""
  return getImageUrl(item.image, "1.78", 500)
}

export const getHeroImage = (item: any): string => {
  // Add null check here
  if (!item || !item.image) return ""
  return getImageUrl(item.image, "2.29", 1920)
}
