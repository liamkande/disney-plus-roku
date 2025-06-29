/**
 * Styles for ContentTile with focus animations
 *
 * BrightScript animations would be defined as:
 * <Animation id="focusAnimation" duration="0.2" easeFunction="outQuad">
 *     <Vector2DFieldInterpolator key="[0.0, 1.0]" keyValue="[[1.0, 1.0], [1.15, 1.15]]" />
 * </Animation>
 */

import styled, { css, keyframes } from "styled-components"

interface FocusableProps {
  isFocused: boolean
}

interface ImageProps {
  isLoaded?: boolean
}

const scaleIn = keyframes`
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.15);
  }
`

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const shimmer = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`

const glow = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.6);
  }
  100% {
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
  }
`

export const TileContainer = styled.div<FocusableProps>`
  position: relative;
  width: 300px;
  height: 169px;
  cursor: pointer;
  transition: all 0.2s ease-out;
  transform-origin: center center;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
  background-color: #2a2d3a;

  /* Focus scaling - requirement: "The focused tile must be scaled up" */
  ${(props) =>
    props.isFocused &&
    css`
      transform: scale(1.15);
      z-index: 10;
      animation: ${scaleIn} 0.2s ease-out;
    `}

  /* Remove default button styles */
  border: none;
  padding: 0;

  &:focus {
    outline: none;
  }

  /* Hover effect for mouse users */
  @media (hover: hover) {
    &:hover {
      transform: scale(1.05);
    }

    ${(props) =>
      props.isFocused &&
      css`
        &:hover {
          transform: scale(1.15);
        }
      `}
  }

  /* In BrightScript:
   * <Group id="tileGroup">
   *   <Poster width="300" height="169" />
   * </Group>
   */
`

export const TilePoster = styled.img<ImageProps>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  opacity: ${(props) => (props.isLoaded ? 1 : 0)};
  transition: opacity 0.3s ease-in;

  /* In BrightScript:
   * <Poster
   *   id="poster"
   *   width="300"
   *   height="169"
   *   loadDisplayMode="scaleToFit"
   *   failedBitmapUri="pkg:/images/placeholder.png"
   * />
   */
`

export const TileShadow = styled.div<FocusableProps>`
  position: absolute;
  top: 5px;
  left: 5px;
  right: -5px;
  bottom: -5px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  opacity: ${(props) => (props.isFocused ? 0.6 : 0)};
  transition: opacity 0.2s ease-out;
  z-index: -1;
  filter: blur(10px);

  /* Disney magic - enhanced shadow on focus */
  ${(props) =>
    props.isFocused &&
    css`
      background: linear-gradient(
        135deg,
        rgba(91, 44, 111, 0.4) 0%,
        rgba(40, 116, 166, 0.4) 50%,
        rgba(231, 76, 60, 0.4) 100%
      );
    `}/* In BrightScript:
   * <Rectangle
   *   id="tileShadow"
   *   width="300"
   *   height="169"
   *   color="0x00000066"
   *   translation="[5, 5]"
   *   opacity="0.0"
   * />
   */
`

export const TileGradient = styled.div<FocusableProps>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 0, 0, 0.8) 100%
  );
  opacity: ${(props) => (props.isFocused ? 1 : 0)};
  transition: opacity 0.2s ease-out;

  /* In BrightScript:
   * <Rectangle
   *   id="gradient"
   *   width="300"
   *   height="80"
   *   translation="[0, 89]"
   *   opacity="0.0">
   *   <Rectangle
   *     width="300"
   *     height="80"
   *     color="0x000000CC"
   *   />
   * </Rectangle>
   */
`

export const TileTitle = styled.div<FocusableProps>`
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  opacity: ${(props) => (props.isFocused ? 1 : 0)};
  transform: translateY(${(props) => (props.isFocused ? 0 : 10)}px);
  transition: all 0.2s ease-out;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.3;

  ${(props) =>
    props.isFocused &&
    css`
      animation: ${fadeIn} 0.3s ease-out 0.1s both;
    `}/* In BrightScript:
   * <Label
   *   id="titleLabel"
   *   width="280"
   *   height="60"
   *   translation="[10, 100]"
   *   font="font:SmallBoldSystemFont"
   *   color="0xFFFFFFFF"
   *   wrap="true"
   *   maxLines="2"
   *   visible="false"
   * />
   */
`

export const FocusRing = styled.div`
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border: 4px solid white;
  border-radius: 8px;
  pointer-events: none;
  animation:
    ${fadeIn} 0.2s ease-out,
    ${glow} 2s ease-in-out infinite;

  /* Extra credit: Visual aesthetics - Disney magic glow */
  box-shadow:
    0 0 20px rgba(255, 255, 255, 0.5),
    inset 0 0 20px rgba(255, 255, 255, 0.1);

  /* In BrightScript: drawFocusFeedback would handle this */
`

export const TileMetadata = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
  align-items: center;
  z-index: 2;
  animation: ${fadeIn} 0.3s ease-out 0.2s both;

  span {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.8);
    font-family:
      -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background: rgba(0, 0, 0, 0.6);
    padding: 2px 8px;
    border-radius: 4px;
    backdrop-filter: blur(10px);
  }
`

export const TileRating = styled.span`
  color: #ffc61a !important;
  font-weight: 600;
  border: 1px solid #ffc61a;

  /* Disney+ rating style */
`

export const PlaceholderContainer = styled.div`
  width: 100%;
  height: 100%;
  background: #2a2d3a;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 14px;
  position: relative;
  overflow: hidden;
`

export const ShimmerEffect = styled.div`
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
  animation: ${shimmer} 1.5s infinite;

  /* Loading shimmer effect while images load */
`

export const TileOverlay = styled.div<FocusableProps>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  opacity: ${(props) => (props.isFocused ? 0 : 0.3)};
  transition: opacity 0.2s ease-out;
  pointer-events: none;

  /* Darkens unfocused tiles slightly for better focus visibility */
`
