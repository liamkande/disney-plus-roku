/**
 * Type definitions for Disney+ content
 * In BrightScript, these would be associative arrays (AA) and roArray
 *
 * BrightScript equivalent:
 * ' Content item structure
 * contentItem = {
 *     contentId: "12345"
 *     title: "The Mandalorian"
 *     image: [{...}]
 *     type: "series"
 * }
 */

// Image asset with different aspect ratios and resolutions
export interface ImageAsset {
  aspectRatio: number // 1.78 for 16:9, 1.33 for 4:3, etc.
  url: string
  width: number
  height: number
  masterUrl?: string
  masterWidth?: number
  masterHeight?: number
}

// Text content structure from API
export interface TextContent {
  title: {
    full: {
      series?: {
        default: {
          content: string
          language: string
        }
      }
      program?: {
        default: {
          content: string
          language: string
        }
      }
      collection?: {
        default: {
          content: string
          language: string
        }
      }
      set?: {
        default: {
          content: string
          language: string
        }
      }
      default?: {
        content: string
        language: string
      }
    }
  }
}

// Individual content item (movie, series, etc.)
export interface ContentItem {
  contentId: string
  contentType: string
  programType?: string
  image: {
    tile?: ImageAsset[]
    hero_tile?: ImageAsset[]
    title_treatment?: ImageAsset[]
    title_treatment_layer?: ImageAsset[]
    background?: ImageAsset[]
    background_details?: ImageAsset[]
    hero_collection?: ImageAsset[]
  }
  text: TextContent
  type: string
  ratings?: Array<{
    value: string
    system: string
    description?: string
  }>
  releases?: Array<{
    releaseDate: string
    releaseType: string
    territory: string
  }>
  family?: {
    encodedFamilyId: string
  }
  typedGenres?: Array<{
    name: string
    type: string
  }>
  currentAvailability?: {
    region: string
    kidsMode: boolean
  }
}

// Content set (row of content)
export interface ContentSet {
  setId: string
  setType?: string
  contentClass?: string
  text: TextContent
  type: "SetRef" | "CuratedSet" | "PersonalizedCuratedSet"
  refId?: string // For SetRef type - needs lazy loading
  refIdType?: string
  items?: ContentItem[] // For CuratedSet type - already loaded
  meta?: {
    hits: number
    offset: number
    page_size: number
  }
}

// Container wraps a content set
export interface Container {
  set: ContentSet
  style?: {
    collectionGroupId?: string
    collectionId?: string
  }
  type: string
}

// Home page data structure
export interface HomeData {
  data: {
    StandardCollection: {
      collectionGroupId: string
      collectionId: string
      containers: Container[]
      meta?: {
        hits: number
        offset: number
      }
      type: string
    }
  }
}

// Ref set data structure (for lazy-loaded sets)
export interface RefSetData {
  data: {
    CuratedSet?: {
      setId: string
      items: ContentItem[]
      meta?: {
        hits: number
        offset: number
      }
      type: string
    }
    TrendingSet?: {
      setId: string
      items: ContentItem[]
    }
    PersonalizedCuratedSet?: {
      setId: string
      items: ContentItem[]
    }
    // Add other possible set types as we discover them
    [key: string]: any
  }
}

// Navigation types
export interface FocusPosition {
  row: number
  col: number
}

// Cache types
export interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number // Time to live in milliseconds
}

// Component props types
export interface RowProps {
  container: Container
  rowIndex: number
  focusedCol: number
  isFocused: (row: number, col: number) => boolean
  refSetData?: {
    loading: boolean
    items: ContentItem[]
    error?: string
  }
}

export interface TileProps {
  item: ContentItem
  isFocused: boolean
  position: FocusPosition
}

// API Error types
export interface ApiError {
  code: string
  message: string
  details?: any
}

// Device capabilities (for optimization)
export interface DeviceCapabilities {
  supportsHD: boolean
  supports4K: boolean
  memoryLevel: "low" | "medium" | "high"
  graphicsLevel: "basic" | "standard" | "advanced"
}

// Type guards to check data types
export const isContentItem = (item: any): item is ContentItem => {
  return item && item.contentId && item.image && item.text
}

export const isSetRef = (set: ContentSet): boolean => {
  return set.type === "SetRef" && !!set.refId
}

export const isCuratedSet = (set: ContentSet): boolean => {
  return set.type === "CuratedSet" && !!set.items
}

// Helper type for extracting image URLs
export type ImageType = keyof ContentItem["image"]

/**
 * In BrightScript, type checking would be done manually:
 *
 * function isValidContentItem(item as Object) as Boolean
 *     if item = invalid then return false
 *     if item.contentId = invalid then return false
 *     if item.image = invalid then return false
 *     if item.text = invalid then return false
 *     return true
 * end function
 */
