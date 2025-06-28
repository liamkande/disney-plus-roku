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
import {
  ContentContainer,
  HomeScreenContainer,
  LoadingContainer,
} from "./HomeScreen.styles"

export const HomeScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)

  /**
   * Simulate initial load
   *
   * In BrightScript:
   * sub init()
   *     m.loadingLabel = m.top.findNode("loadingLabel")
   *     m.contentContainer = m.top.findNode("contentContainer")
   *     loadHomeContent()
   * end sub
   */
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <HomeScreenContainer>
      {isLoading ? (
        <LoadingContainer>
          <LoadingIndicator />
        </LoadingContainer>
      ) : (
        <ContentContainer className="loaded">
          <h1 style={{ color: "white", padding: "50px" }}>
            Disney+ Content Will Load Here
          </h1>
        </ContentContainer>
      )}
    </HomeScreenContainer>
  )
}
