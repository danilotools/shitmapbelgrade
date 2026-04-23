/**
 * Bottom-sheet drag-to-dismiss gesture — powered by react-native-gesture-handler.
 *
 * We tried PanResponder first; on Android it silently refused to capture the
 * gesture inside a <Modal> (the RN JS responder system doesn't cross the
 * native Modal boundary reliably). RNGH works natively and handles Modals
 * cleanly, so long as the draggable subtree is wrapped in a
 * GestureHandlerRootView inside the Modal.
 *
 * Usage:
 *   const { translateY, Gesture, RootView } = useDragToClose(visible, onClose);
 *   <Modal><RootView><Gesture><Animated.View style={{ transform:[{ translateY }]}}>
 *     ...sheet contents...
 *   </Animated.View></Gesture></RootView></Modal>
 */
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet } from 'react-native';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  State,
} from 'react-native-gesture-handler';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface Options {
  dismissDistance?: number;
  dismissVelocity?: number;
}

export function useDragToClose(
  visible: boolean,
  onClose: () => void,
  { dismissDistance = 120, dismissVelocity = 600 }: Options = {},
) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

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

  // Drive translateY directly from the gesture's translationY (clamped to
  // non-negative values — upward drags don't move the sheet).
  const onGestureEvent = (e: PanGestureHandlerGestureEvent) => {
    const dy = e.nativeEvent.translationY;
    translateY.setValue(dy > 0 ? dy : 0);
  };

  const onHandlerStateChange = (e: PanGestureHandlerGestureEvent) => {
    if (e.nativeEvent.state === State.END) {
      const dy = e.nativeEvent.translationY;
      const vy = e.nativeEvent.velocityY;
      const dismiss = dy > dismissDistance || vy > dismissVelocity;

      if (dismiss) {
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
    }
  };

  /** Wrap the sheet subtree inside the Modal with this root view. */
  const RootView: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <GestureHandlerRootView style={styles.flex}>{children}</GestureHandlerRootView>
  );

  /**
   * Wrap the draggable region with this. Activates only on a downward
   * drag (activeOffsetY = [-15, 10]) so child taps / horizontal scrolls
   * aren't stolen.
   */
  const Gesture: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
      activeOffsetY={[-15, 10]}
      failOffsetX={[-20, 20]}
    >
      {children as React.ReactElement}
    </PanGestureHandler>
  );

  return { translateY, Gesture, RootView };
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
