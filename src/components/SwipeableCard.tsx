import React from 'react';
import { StyleSheet, Text, Vibration } from 'react-native';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  SharedValue,
} from 'react-native-reanimated';
import { runOnJS } from 'react-native-worklets';
import { Colors } from '../constants/colors';
import { Dimensions } from '../constants/dimensions';
import { CardModel } from '../sqlite/types';

const SWIPE_THRESHOLD = 120;
const SCREEN_WIDTH = Dimensions.window.width;

interface SwipeableCardProps {
  card: CardModel;
  onSwipe: (isYes: boolean) => void;
  translateX: SharedValue<number>;
}

export const SwipeableCard: React.FC<SwipeableCardProps> = ({ card, onSwipe, translateX }) => {
  const translateY = useSharedValue(0);

  const triggerVibration = (pattern: number | number[]) => {
    Vibration.vibrate(pattern);
  };

  const pan = usePanGesture({
    onUpdate: (event) => {
      'worklet';
      translateX.value += event.changeX;
      translateY.value += event.changeY;
    },
    onFinalize: (event) => {
      'worklet';
      // Determine if swipe crossed the threshold
      if (translateX.value > SWIPE_THRESHOLD) {
        // Swipe Right (YES)
        translateX.value = withSpring(SCREEN_WIDTH * 1.5);
        runOnJS(triggerVibration)([0, 30, 20, 30]);
        runOnJS(onSwipe)(true);
      } else if (translateX.value < -SWIPE_THRESHOLD) {
        // Swipe Left (NO)
        translateX.value = withSpring(-SCREEN_WIDTH * 1.5);
        runOnJS(triggerVibration)([0, 30, 20, 30]);
        runOnJS(onSwipe)(false);
      } else {
        // Snap back to center
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        runOnJS(triggerVibration)(10);
      }
    }
  });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-15, 0, 15],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  const nopeStampStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, -SWIPE_THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const yesStampStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.card, animatedStyle]}>

        {/* NOPE Stamp */}
        <Animated.View style={[styles.stampContainer, styles.stampNope, nopeStampStyle]}>
          <Text style={[styles.stampText, { color: Colors.pr }]}>NOPE</Text>
        </Animated.View>

        {/* YES Stamp */}
        <Animated.View style={[styles.stampContainer, styles.stampYes, yesStampStyle]}>
          <Text style={[styles.stampText, { color: Colors.cash }]}>YES</Text>
        </Animated.View>

        <Text style={styles.title}>{card.character_name.toUpperCase()}</Text>
        <Text style={styles.description}>{card.description}</Text>

      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 360,
    aspectRatio: 3 / 4,
    backgroundColor: Colors.surface,
    borderRadius: Dimensions.borderRadius.xl * 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
    padding: Dimensions.spacing.lg,
    position: 'absolute', // Allows stacking if we do decks later, and clean placement
  },
  title: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.product,
    letterSpacing: 2,
    marginBottom: Dimensions.spacing.xl,
    textAlign: 'center',
  },
  description: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Dimensions.spacing.xl,
    textAlign: 'center',
    lineHeight: 32,
  },
  stampContainer: {
    position: 'absolute',
    top: 40,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 4,
    borderRadius: 8,
    transform: [{ rotate: '-15deg' }],
  },
  stampNope: {
    right: 30,
    borderColor: Colors.pr,
    transform: [{ rotate: '15deg' }],
  },
  stampYes: {
    left: 30,
    borderColor: Colors.cash,
    transform: [{ rotate: '-15deg' }],
  },
  stampText: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 2,
  },
});
