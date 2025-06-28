/**
 * Styled components for HomeScreen
 *
 * In BrightScript, these styles would be defined as XML attributes:
 * <Rectangle width="1920" height="1080" color="0x1a1d29FF" />
 */

import styled from "styled-components"

export const HomeScreenContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #1a1d29;
  position: relative;
  overflow: hidden;
`

export const BackgroundGradient = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 300px;
  background: linear-gradient(
    to bottom,
    rgba(26, 29, 41, 0.8) 0%,
    rgba(26, 29, 41, 0) 100%
  );
  pointer-events: none;
  z-index: 1;

  /* Bottom border like Disney+ */
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background-color: #3d4451;
  }

  /* In BrightScript:
   * <Rectangle
   *   width="1920"
   *   height="300"
   *   color="0x1a1d29CC"
   *   opacity="0.8">
   *   <Rectangle
   *     width="1920"
   *     height="1"
   *     color="0x3d4451FF"
   *     translation="[0, 299]"/>
   * </Rectangle>
   */
`

export const LoadingContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  z-index: 10;

  /* In BrightScript:
   * <Label 
   *   translation="[960, 540]" 
   *   horizAlign="center" 
   *   vertAlign="center"
   * />
   */
`

export const ContentContainer = styled.div`
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.3s ease-in;

  &.loaded {
    opacity: 1;
  }

  /* In BrightScript: Would use visible field and animations */
`

export const ContentGrid = styled.div`
  padding: 100px 0 50px 0;
  overflow-y: auto;
  height: 100%;
  position: relative;
  z-index: 2;

  /* Hide scrollbar for TV experience */
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  /* In BrightScript:
   * <MarkupGrid
   *   id="contentGrid"
   *   translation="[90, 100]"
   *   itemComponentName="ContentRow"
   *   numColumns="1"
   *   itemSize="[1740, 250]"
   *   itemSpacing="[0, 40]"
   *   vertFocusAnimationStyle="floatingFocus"
   *   drawFocusFeedback="false"
   * />
   */
`

export const ErrorMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ffffff;
  font-size: 24px;
  text-align: center;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  max-width: 800px;
  line-height: 1.5;
  z-index: 10;

  /* In BrightScript:
   * <Label
   *   id="errorLabel"
   *   width="800"
   *   height="100"
   *   font="font:MediumBoldSystemFont"
   *   horizAlign="center"
   *   vertAlign="center"
   *   translation="[560, 490]"
   *   wrap="true"
   * />
   */
`

export const LoadingText = styled.h1`
  font-size: 32px;
  font-weight: 600;
  margin: 0;
  color: #ffffff;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* In BrightScript:
   * <Label
   *   text="Loading magical content..."
   *   font="font:LargeBoldSystemFont"
   *   color="0xFFFFFFFF"
   * />
   */
`
