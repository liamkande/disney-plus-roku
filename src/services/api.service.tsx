/**
 * API Service - Handles all network requests
 *
 * In BrightScript, this would be implemented using roUrlTransfer:
 *
 * function makeRequest(url as String) as Object
 *     request = CreateObject("roUrlTransfer")
 *     request.SetUrl(url)
 *     request.SetCertificatesFile("common:/certs/ca-bundle.crt")
 *     port = CreateObject("roMessagePort")
 *     request.SetMessagePort(port)
 *
 *     if request.AsyncGetToString()
 *         msg = wait(10000, port) ' 10 second timeout
 *         if type(msg) = "roUrlEvent" and msg.GetResponseCode() = 200
 *             return ParseJson(msg.GetString())
 *         end if
 *     end if
 *     return invalid
 * end function
 */

import axios, { AxiosError, AxiosInstance } from "axios"
import { ApiError, HomeData, RefSetData } from "../types/disney.types"

export class ApiService {
  private readonly client: AxiosInstance
  private readonly BASE_URL = "https://cd-static.bamgrid.com/dp-117731241344"

  // In-memory cache for this instance
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> =
    new Map()

  constructor() {
    /**
     * In BrightScript, we'd create a global instance:
     * m.apiClient = CreateObject("roUrlTransfer")
     * m.apiClient.SetCertificatesFile("common:/certs/ca-bundle.crt")
     * m.apiClient.EnableEncodings(true)
     */
    this.client = axios.create({
      baseURL: this.BASE_URL,
      timeout: 10000, // 10 seconds - same as BrightScript wait(10000, port)
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        console.log(`[BrightScript] Response received: ${response.config.url}`)
        return response
      },
      (error: AxiosError) => {
        console.error("[BrightScript] API Error:", error.message)

        // In BrightScript: request.RetainBodyOnError(true)
        const apiError: ApiError = {
          code: error.code || "UNKNOWN_ERROR",
          message: error.message,
          details: error.response?.data,
        }

        return Promise.reject(apiError)
      },
    )
  }

  /**
   * Fetch home page data
   *
   * BrightScript equivalent:
   * function getHomeData() as Object
   *     url = m.apiBase + "/home.json"
   *
   *     ' Check cache first
   *     cachedData = m.cache.get("home_data")
   *     if cachedData <> invalid then return cachedData
   *
   *     ' Make request
   *     request = CreateObject("roUrlTransfer")
   *     request.SetUrl(url)
   *
   *     ' For Disney+ we might need auth headers
   *     ' request.AddHeader("Authorization", "Bearer " + m.authToken)
   *
   *     data = makeRequest(url)
   *     if data <> invalid
   *         m.cache.set("home_data", data, 300) ' 5 min cache
   *     end if
   *     return data
   * end function
   */
  async getHomeData(): Promise<HomeData> {
    const cacheKey = "home_data"

    // Check cache first
    const cached = this.checkCache<HomeData>(cacheKey)
    if (cached) {
      return cached
    }

    try {
      console.log("[BrightScript] Fetching home data...")
      const response = await this.client.get<HomeData>("/home.json")

      // Validate response structure
      if (!response.data?.data?.StandardCollection) {
        throw new Error("Invalid home data structure")
      }

      // Cache for 5 minutes
      this.setCache(cacheKey, response.data, 300000)

      console.log(
        `[BrightScript] Home data loaded: ${response.data.data.StandardCollection.containers.length} containers`,
      )

      return response.data
    } catch (error) {
      console.error("[BrightScript] Failed to fetch home data:", error)

      // In BrightScript: return invalid
      throw new Error("Failed to fetch home data")
    }
  }

  /**
   * Fetch ref set data (lazy loaded)
   *
   * BrightScript equivalent:
   * function getRefSetData(refId as String) as Object
   *     if refId = invalid or refId = "" then return invalid
   *
   *     url = m.apiBase + "/sets/" + refId + ".json"
   *     cacheKey = "refset_" + refId
   *
   *     ' Check cache
   *     cachedData = m.cache.get(cacheKey)
   *     if cachedData <> invalid then return cachedData
   *
   *     ' Make request
   *     data = makeRequest(url)
   *     if data <> invalid
   *         m.cache.set(cacheKey, data, 300) ' 5 min cache
   *     end if
   *     return data
   * end function
   */
  async getRefSetData(refId: string): Promise<RefSetData> {
    if (!refId) {
      throw new Error("Invalid refId")
    }

    const cacheKey = `refset_${refId}`

    // Check cache
    const cached = this.checkCache<RefSetData>(cacheKey)
    if (cached) {
      return cached
    }

    try {
      console.log(`[BrightScript] Fetching ref set: ${refId}`)
      const response = await this.client.get<RefSetData>(`/sets/${refId}.json`)

      // The response structure can vary, so we need to handle different types
      if (!response.data?.data) {
        throw new Error("Invalid ref set data structure")
      }

      // Cache for 5 minutes
      this.setCache(cacheKey, response.data, 300000)

      // Log what type of set we got
      const setType = Object.keys(response.data.data)[0]
      const itemCount = response.data.data[setType]?.items?.length || 0
      console.log(
        `[BrightScript] Ref set loaded: ${setType} with ${itemCount} items`,
      )

      return response.data
    } catch (error) {
      console.error(`[BrightScript] Failed to load ref set ${refId}:`, error)
      throw error
    }
  }

  /**
   * Batch load multiple ref sets (optimization for smooth scrolling)
   * In BrightScript, this would be done with multiple async tasks:
   *
   * sub loadMultipleRefSets(refIds as Object)
   *     for each refId in refIds
   *         task = CreateObject("roSGNode", "RefSetLoaderTask")
   *         task.refId = refId
   *         task.observeField("content", "onRefSetLoaded")
   *         task.control = "run"
   *     end for
   * end sub
   */
  async batchLoadRefSets(refIds: string[]): Promise<Map<string, RefSetData>> {
    const results = new Map<string, RefSetData>()

    // Filter out already cached items
    const uncachedIds = refIds.filter((id) => !this.checkCache(`refset_${id}`))

    if (uncachedIds.length === 0) {
      // All items are cached
      refIds.forEach((id) => {
        const cached = this.checkCache<RefSetData>(`refset_${id}`)
        if (cached) results.set(id, cached)
      })
      return results
    }

    // Load uncached items in parallel
    const promises = uncachedIds.map(async (refId) => {
      try {
        const data = await this.getRefSetData(refId)
        results.set(refId, data)
      } catch (error) {
        console.error(`Failed to load ref set ${refId} in batch`)
        // Don't throw - allow other requests to complete
      }
    })

    await Promise.all(promises)

    // Add cached items to results
    refIds.forEach((id) => {
      if (!results.has(id)) {
        const cached = this.checkCache<RefSetData>(`refset_${id}`)
        if (cached) results.set(id, cached)
      }
    })

    return results
  }

  /**
   * Clear cache (useful for testing or refresh)
   * In BrightScript: m.cache.Clear()
   */
  clearCache(): void {
    this.cache.clear()
    console.log("[Cache] Cleared all entries")
  }

  /**
   * Get cache statistics (for debugging)
   * In BrightScript: would be logged to debug console
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    }
  }

  /**
   * Simple cache check
   * In BrightScript:
   * function checkCache(key as String) as Object
   *     if m.cache[key] <> invalid
   *         if CreateObject("roDateTime").AsSeconds() - m.cache[key].time < m.cache[key].ttl
   *             return m.cache[key].data
   *         end if
   *     end if
   *     return invalid
   * end function
   */
  private checkCache<T>(key: string): T | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    const now = Date.now()
    const age = now - cached.timestamp

    if (age < cached.ttl) {
      console.log(`[Cache] Hit for key: ${key}`)
      return cached.data
    }

    // Cache expired
    this.cache.delete(key)
    return null
  }

  /**
   * Set cache
   * In BrightScript: m.cache.AddReplace(key, {data: data, time: timestamp, ttl: ttl})
   */
  private setCache(key: string, data: any, ttlMs: number = 300000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    })
    console.log(`[Cache] Set key: ${key}, TTL: ${ttlMs}ms`)
  }
}

// Export singleton instance
export const apiService = new ApiService()
