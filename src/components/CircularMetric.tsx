import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularMetricProps {
  value: number;
  color: string;
  icon: string;
}

const RADIUS = 24;
const STROKE_WIDTH = 6;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const CircularMetric: React.FC<CircularMetricProps> = ({ value, color, icon }) => {
  const animatedValue = useSharedValue(value);

  useEffect(() => {
    animatedValue.value = withSpring(value, { damping: 15, stiffness: 90 });
  }, [value, animatedValue]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = CIRCUMFERENCE - (CIRCUMFERENCE * Math.max(0, Math.min(100, animatedValue.value))) / 100;
    return {
      strokeDashoffset,
    };
  });

  return (
    <View style={styles.container}>
      <View style={[styles.svgContainer, { shadowColor: color }]}>
        <Svg width={(RADIUS + STROKE_WIDTH) * 2} height={(RADIUS + STROKE_WIDTH) * 2} viewBox={`0 0 ${(RADIUS + STROKE_WIDTH) * 2} ${(RADIUS + STROKE_WIDTH) * 2}`}>
          {/* Background Circle */}
          <Circle
            cx={RADIUS + STROKE_WIDTH}
            cy={RADIUS + STROKE_WIDTH}
            r={RADIUS}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={STROKE_WIDTH}
            fill="rgba(0,0,0,0.5)"
          />
          {/* Foreground Progress Circle */}
          <AnimatedCircle
            cx={RADIUS + STROKE_WIDTH}
            cy={RADIUS + STROKE_WIDTH}
            r={RADIUS}
            stroke={color}
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeDasharray={CIRCUMFERENCE}
            animatedProps={animatedProps}
            strokeLinecap="round"
            rotation="-90"
            originX={RADIUS + STROKE_WIDTH}
            originY={RADIUS + STROKE_WIDTH}
          />
        </Svg>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
    borderRadius: 50,
  },
  iconContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 18,
  },
});
