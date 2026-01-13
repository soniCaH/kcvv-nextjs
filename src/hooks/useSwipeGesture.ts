import { useRef, TouchEvent as ReactTouchEvent } from "react";

/**
 * useSwipeGesture Hook
 *
 * Detects horizontal swipe gestures on touch devices.
 * Useful for implementing swipe-to-navigate between views.
 *
 * Features:
 * - Configurable swipe threshold (default: 50px)
 * - Horizontal swipe detection only
 * - Prevents accidental triggers during vertical scrolling
 * - Callback on swipe left/right
 *
 * @param onSwipeLeft - Callback when user swipes left (→)
 * @param onSwipeRight - Callback when user swipes right (←)
 * @param threshold - Minimum horizontal distance (px) to trigger swipe
 * @returns Object with touch event handlers to attach to an element
 */
export function useSwipeGesture(
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  threshold = 50,
) {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);

  const handleTouchStart = (e: ReactTouchEvent<HTMLElement>) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchEndX.current = null;
    touchEndY.current = null;
  };

  const handleTouchMove = (e: ReactTouchEvent<HTMLElement>) => {
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (
      touchStartX.current === null ||
      touchEndX.current === null ||
      touchStartY.current === null ||
      touchEndY.current === null
    ) {
      return;
    }

    const deltaX = touchEndX.current - touchStartX.current;
    const deltaY = touchEndY.current - touchStartY.current;

    // Only trigger if horizontal movement is significantly larger than vertical
    // This prevents triggering during vertical scrolling
    if (Math.abs(deltaX) > Math.abs(deltaY) * 2) {
      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          // Swiped right (→)
          onSwipeRight?.();
        } else {
          // Swiped left (←)
          onSwipeLeft?.();
        }
      }
    }

    // Reset
    touchStartX.current = null;
    touchStartY.current = null;
    touchEndX.current = null;
    touchEndY.current = null;
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
}
