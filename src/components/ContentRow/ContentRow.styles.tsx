/**
 * Styles for ContentRow
 *
 * BrightScript equivalent:
 * <Label font="font:MediumBoldSystemFont" color="0xFFFFFFFF" />
 * <PosterGrid translation="[90, 60]" itemSpacing="[20, 0]" />
 */

import styled from "styled-components"

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
  position: relative;
  justify-content: flex-start;

  /* Hide scrollbar for TV experience */
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  /* Prevent vertical scroll bounce */
  overscroll-behavior-x: contain;
  overscroll-behavior-y: none;

  /* Add padding at the end for better scrolling */
  &::after {
    content: "";
    min-width: 90px;
    height: 1px;
  }

  /* In BrightScript:
   * <PosterGrid
   *   id="posterGrid"
   *   translation="[90, 60]"
   *   itemSize="[300, 169]"
   *   itemSpacing="[20, 0]"
   *   numRows="1"
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
  text-align: center;
  height: 169px;
  display: flex;
  align-items: center;
  justify-content: flex-start;

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
  height: 169px;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  /* In BrightScript:
 * <Label
 *   text="No content available"
 *   font="font:SmallSystemFont"
 *   color="0x666666FF"
 * />
 */
`

export const RowLoadingContainer = styled.div`
  display: flex;
  gap: 20px;
  padding: 0 90px;
  overflow: hidden;
`

export const TileLoadingSkeleton = styled.div`
  min-width: 300px;
  width: 300px;
  height: 169px;
  background-color: #2a2d3a;
  border-radius: 4px;
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.1) 50%,
      transparent 100%
    );
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`
