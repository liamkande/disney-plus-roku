/**
 * LoadingIndicator Component
 * Extra Credit: "Add some Disney magic"
 *
 * In BrightScript:
 * <component name="LoadingIndicator" extends="Group">
 *     <children>
 *         <BusySpinner
 *             id="spinner"
 *             translation="[960, 540]"
 *             spinInterval="3"
 *         />
 *         <Label
 *             id="loadingText"
 *             text="Loading magical content..."
 *             translation="[960, 620]"
 *             horizAlign="center"
 *         />
 *     </children>
 * </component>
 */

import React from "react"
import styled, { keyframes } from "styled-components"

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const pulse = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  position: relative;

  /* Disney magic: Multi-layered spinner with brand colors */
  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 3px solid transparent;
  }

  /* Outer ring - Disney+ blue gradient */
  &::before {
    border-top-color: #0063e5;
    border-right-color: #0483ee;
    animation: ${spin} 1.5s linear infinite;
  }

  /* Inner ring - Disney+ secondary colors */
  &::after {
    border-bottom-color: #ffc61a;
    border-left-color: #ff6b6b;
    width: 80%;
    height: 80%;
    top: 10%;
    left: 10%;
    animation: ${spin} 1.5s linear infinite reverse;
  }

  /* In BrightScript:
   * <BusySpinner
   *     uri="pkg:/images/spinner.png"
   *     spinInterval="3"
   * />
   */
`

const LoadingText = styled.div`
  color: white;
  font-size: 18px;
  font-weight: 500;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  animation: ${pulse} 1.5s ease-in-out infinite;

  /* Disney sparkle effect */
  &::after {
    content: "✨";
    margin-left: 8px;
    display: inline-block;
    animation: ${spin} 2s linear infinite;
  }

  /* In BrightScript:
   * <Label
   *     font="font:MediumSystemFont"
   *     color="0xFFFFFFFF"
   * />
   */
`

interface LoadingIndicatorProps {
  text?: string
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  text = "Loading magical content",
}) => {
  return (
    <Container>
      <Spinner />
      <LoadingText>{text}</LoadingText>
    </Container>
  )
}
