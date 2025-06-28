/**
 * Styles for ContentRow
 *
 * BrightScript equivalent:
 * <Label font="font:MediumBoldSystemFont" color="0xFFFFFFFF" />
 * <PosterGrid translation="[90, 60]" itemSpacing="[20, 0]" />
 */

import styled from "styled-components"

interface TileProps {
  isFocused?: boolean
}

export const RowContainer = styled.div`
  margin-bottom: 40px;

  /* In BrightScript: translation="[0, 40]" for spacing between rows */
`

export const RowTitle = styled.h2`
  color: #ffffff;
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 20px 90px;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* In BrightScript: 
   * <Label 
   *   id="rowTitle"
   *   font="font:MediumBoldSystemFont"
   *   color="0xFFFFFFFF"
   *   translation="[90, 0]"
   * />
   */
`

export const TilesContainer = styled.div`
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0 90px;
  scroll-behavior: smooth;
  gap: 20px;

  /* Hide scrollbar for TV experience */
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  /* Prevent vertical scroll bounce */
  overscroll-behavior-x: contain;
  overscroll-behavior-y: none;

  /* In BrightScript:
   * <PosterGrid
   *   id="posterGrid"
   *   translation="[90, 60]"
   *   itemSize="[300, 169]"
   *   itemSpacing="[20, 0]"
   *   numRows="1"
   *   horizFocusAnimationStyle="fixedFocusWrap"
   *   drawFocusFeedback="false"
   * />
   */
`

export const LoadingMessage = styled.div`
  color: #999999;
  font-size: 16px;
  padding: 50px 90px;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* In BrightScript:
   * <BusySpinner
   *   id="loadingSpinner"
   *   translation="[960, 100]"
   *   visible="true"
   * />
   */
`

export const EmptyMessage = styled.div`
  color: #666666;
  font-size: 16px;
  padding: 50px 90px;
  font-style: italic;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* In BrightScript:
   * <Label
   *   text="No content available"
   *   font="font:SmallSystemFont"
   *   color="0x666666FF"
   * />
   */
`

export const TilePlaceholder = styled.div<TileProps>`
  min-width: 300px;
  width: 300px;
  height: 169px;
  background-color: #2a2d3a;
  border-radius: 4px;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease-out;
  transform-origin: center center;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  flex-shrink: 0;
  overflow: hidden;

  /* Focus state - requirement: "The focused tile must be scaled up" */
  ${(props) =>
    props.isFocused &&
    `
    transform: scale(1.15);
    z-index: 10;
    box-shadow: 0 0 0 4px white, 0 10px 30px rgba(0, 0, 0, 0.5);
  `}

  /* Hover state for mouse users */
  &:hover {
    transform: scale(1.05);
  }

  /* Show title on hover/focus */
  &::after {
    content: attr(title);
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(0, 0, 0, 0.9) 100%
    );
    color: white;
    font-size: 14px;
    font-weight: 500;
    font-family:
      -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    opacity: ${(props) => (props.isFocused ? 1 : 0)};
    transition: opacity 0.2s ease-out;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  /* Loading shimmer effect */
  @keyframes shimmer {
    0% {
      background-position: -300px 0;
    }
    100% {
      background-position: 300px 0;
    }
  }

  &:not([style*="backgroundImage"]) {
    background: linear-gradient(90deg, #2a2d3a 0%, #3a3d4a 50%, #2a2d3a 100%);
    background-size: 300px 169px;
    animation: shimmer 1.5s infinite;
  }

  /* In BrightScript:
   * <Poster
   *   id="poster"
   *   width="300"
   *   height="169"
   *   loadDisplayMode="scaleToFit"
   *   scale="[1.15, 1.15]"
   * />
   */
`

export const TileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`

export const TileTitle = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 0, 0, 0.9) 100%
  );
  color: white;
  font-size: 14px;
  font-weight: 500;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

export const TileLoadingState = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 14px;
`
