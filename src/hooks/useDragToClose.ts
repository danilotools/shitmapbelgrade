/**
 * Bottom-sheet drag-to-dismiss gesture.
 *
 * Returns a shared Animated.Value for translateY and the pan handlers you
 * spread onto the sheet's top area (the drag handle). While the sheet is
 * visible the value lives at 0; finger-following drag moves it downward, and
 * on release we either dismiss (if the drag crossed a distance/velocity
 * threshold) or spring it back to rest.
 *
 * The gesture deliberately ignores upward drags and small downward jitters so
 * it doesn't fight with inner scroll views or accidental taps.
 */
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, PanResponder } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface Options {
  /** Pixels of downward drag before we consider it a dismiss. */
  dismissDistance?: number;
  /** Downward velocity (px/ms) that triggers a flick-dismiss. */
  dismissVelocity?: number;
}

export function useDragToClose(
  visible: boolean,
  onClose: () => void,
  { dismissDistance = 120, dismissVelocity = 0.6 }: Options = {},
) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  // Always close through the latest callback, even if the caller passes a
  // fresh function on every render. PanResponder is memoised once and would
  // otherwise keep calling a stale onClose.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Spring the sheet up on open.
  useEffect(() => {
    if (visible) {
      translateY.setValue(SCREEN_HEIGHT);
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 22,
        mass: 0.9,
        stiffness: 220,
      }).start();
    }
  }, [visible, translateY]);

  const panResponder = useRef(
    PanResponder.create({
      // Claim the gesture only for meaningful downward drags. Both bubble
      // and capture phases are wired — capture lets us hijack a downward
      // drag that starts on a child touchable (a tap moves <6px so buttons
      // still fire, but as soon as the finger crosses the threshold
      // downward the sheet takes over and the button is cancelled).
      onMoveShouldSetPanResponder: (_, gs) =>
        gs.dy > 6 && Math.abs(gs.dy) > Math.abs(gs.dx),
      onMoveShouldSetPanResponderCapture: (_, gs) =>
        gs.dy > 6 && Math.abs(gs.dy) > Math.abs(gs.dx),
      onPanResponderMove: (_, gs) => {
        if (gs.dy > 0) translateY.setValue(gs.dy);
      },
      onPanResponderRelease: (_, gs) => {
        const shouldDismiss =
          gs.dy > dismissDistance || gs.vy > dismissVelocity;

        if (shouldDismiss) {
          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 200,
            useNativeDriver: true,
          }).start(() => onCloseRef.current());
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            damping: 22,
            stiffness: 220,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 22,
          stiffness: 220,
        }).start();
      },
    }),
  ).current;

  return { translateY, panHandlers: panResponder.panHandlers };
}
