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
 *     <children>
 *         <Rectangle width="1920" height="1080" color="0x1a1d29FF" />
 *         <Label text="Disney+ Clone" />
 *     </children>
 * </component>
 */

import React from "react"

export const HomeScreen: React.FC = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#1a1d29",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Disney+ Clone - HomeScreen Component</h1>
    </div>
  )
}
