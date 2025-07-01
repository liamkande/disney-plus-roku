/**
 * Styles for DetailModal with Disney magic animations
 * Extra Credit: "Incorporate transitions and/or visual aesthetics"
 *
 * In BrightScript:
 * <Animation id="modalAnimation" duration="0.3" easeFunction="outBack">
 *     <FloatFieldInterpolator key="[0.0, 1.0]" keyValue="[0.0, 1.0]" />
 * </Animation>
 */

import styled, { keyframes } from "styled-components"

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const slideUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`

const scaleIn = keyframes`
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
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

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.3s ease-out;

  &.closing {
    animation: ${fadeIn} 0.3s ease-out reverse;
  }

  /* In BrightScript:
   * <Group id="modalGroup" opacity="0">
   *   <Animation id="fadeAnimation" duration="0.3">
   *     <FloatFieldInterpolator fieldToInterp="opacity" key="[0,1]" keyValue="[0,1]" />
   *   </Animation>
   * </Group>
   */
`

export const Backdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  cursor: pointer;

  /* Disney magic: subtle animated gradient */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at center,
      transparent 0%,
      rgba(91, 44, 111, 0.1) 50%,
      rgba(40, 116, 166, 0.1) 100%
    );
    opacity: 0.5;
  }
`

export const ModalContainer = styled.div`
  position: relative;
  width: 90%;
  max-width: 1200px;
  max-height: 90vh;
  background: #1a1d29;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
  animation: ${slideUp} 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

  &.closing {
    animation: ${slideUp} 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) reverse;
  }

  /* Disney magic: glow effect */
  &::before {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(
      45deg,
      #5b2c6f,
      #2874a6,
      #148f77,
      #e74c3c,
      #f39c12
    );
    border-radius: 12px;
    opacity: 0.3;
    z-index: -1;
    filter: blur(10px);
    animation: glow 3s ease-in-out infinite;
  }

  @keyframes glow {
    0%,
    100% {
      opacity: 0.3;
    }
    50% {
      opacity: 0.5;
    }
  }
`

export const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 20px;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
    transform: scale(1.1);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.5);
  }
`

export const HeroImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 500px;
  overflow: hidden;
  background: #2a2d3a;
`

export const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease-in;

  &.loaded {
    opacity: 1;
  }
`

export const HeroGradient = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(26, 29, 41, 0.8) 50%,
    #1a1d29 100%
  );
  pointer-events: none;
`

export const ModalContent = styled.div`
  padding: 0 40px 40px;
  margin-top: -80px;
  position: relative;
  z-index: 1;
`

export const ContentInfo = styled.div`
  animation: ${scaleIn} 0.5s ease-out 0.2s both;
`

export const Title = styled.h1`
  font-size: 48px;
  font-weight: 700;
  color: white;
  margin: 0 0 20px 0;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);

  /* In BrightScript:
   * <Label
   *   id="titleLabel"
   *   font="font:HugeSystemFont"
   *   color="0xFFFFFFFF"
   * />
   */
`

export const MetadataContainer = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
`

export const MetadataItem = styled.span`
  color: #999;
  font-size: 16px;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  &:not(:last-child)::after {
    content: "•";
    margin-left: 20px;
    color: #666;
  }
`

export const Rating = styled.span`
  color: #ffc61a;
  font-weight: 600;
  font-size: 16px;
  padding: 4px 12px;
  border: 2px solid #ffc61a;
  border-radius: 4px;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`

export const Description = styled.p`
  color: #ccc;
  font-size: 18px;
  line-height: 1.6;
  margin: 0 0 30px 0;
  max-width: 800px;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`

export const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 30px;
`

const BaseButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 30px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  .icon {
    font-size: 20px;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.5);
  }

  &:hover {
    transform: scale(1.05);
  }
`

export const PlayButton = styled(BaseButton)`
  background: white;
  color: #1a1d29;

  &:hover {
    background: #f0f0f0;
  }
`

export const AddButton = styled(BaseButton)`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
  }
`

export const LoadingState = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  background: rgba(26, 29, 41, 0.85);
  z-index: 10;
`

export const LoadingShimmer = styled.div`
  width: 300px;
  height: 24px;
  border-radius: 12px;
  background: linear-gradient(90deg, #444 25%, #666 37%, #444 63%);
  background-size: 400% 100%;
  animation: ${shimmer} 1.5s linear infinite;
`

export const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #113366, #2a4580, #113366);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  /* Disney magic: subtle pulsing effect */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at center,
      rgba(0, 140, 255, 0.3) 0%,
      transparent 70%
    );
    opacity: 0.5;
    animation: pulse 3s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.3;
    }
    50% {
      opacity: 0.7;
    }
  }

  span {
    color: rgba(255, 255, 255, 0.7);
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    padding: 20px;
    z-index: 1;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
    max-width: 80%;
    font-family:
      -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }

  /* Disney logo watermark effect */
  &::after {
    content: "";
    position: absolute;
    width: 100px;
    height: 100px;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="rgba(255,255,255,0.1)" d="M65.8,41.8c-2.5,0-4.5,2-4.5,4.5s2,4.5,4.5,4.5s4.5-2,4.5-4.5S68.3,41.8,65.8,41.8z M50,25c-13.8,0-25,11.2-25,25s11.2,25,25,25s25-11.2,25-25S63.8,25,50,25z M50,70c-11,0-20-9-20-20s9-20,20-20s20,9,20,20S61,70,50,70z M34.2,41.8c-2.5,0-4.5,2-4.5,4.5s2,4.5,4.5,4.5s4.5-2,4.5-4.5S36.7,41.8,34.2,41.8z M50,54.5c-4.1,0-7.8-2.3-9.6-6h19.2C57.8,52.2,54.1,54.5,50,54.5z"/></svg>');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    opacity: 0.1;
    z-index: 0;
  }
`
