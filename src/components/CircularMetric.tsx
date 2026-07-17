import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue, withSpring, SharedValue, useAnimatedStyle, interpolate } from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularMetricProps {
  value: number;
  color: string;
  icon: string;
  label: string;
  swipeX?: SharedValue<number>;
  effectYes?: number;
  effectNo?: number;
}

const RADIUS = 24;
const STROKE_WIDTH = 6;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const CircularMetric: React.FC<CircularMetricProps> = ({ value, color, icon, label, swipeX, effectYes, effectNo }) => {
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

  const dotStyle = useAnimatedStyle(() => {
    if (!swipeX) return { opacity: 0, transform: [{ scale: 0 }] };
    
    let opacity = 0;
    let dotColor = color;
    
    if (swipeX.value > 20 && effectYes !== undefined && effectYes !== 0) {
      opacity = interpolate(swipeX.value, [20, 80], [0, 1], 'clamp');
      dotColor = effectYes > 0 ? '#4ADE80' : '#F87171'; // Green or Red
    } else if (swipeX.value < -20 && effectNo !== undefined && effectNo !== 0) {
      opacity = interpolate(swipeX.value, [-20, -80], [0, 1], 'clamp');
      dotColor = effectNo > 0 ? '#4ADE80' : '#F87171';
    }

    return {
      opacity,
      backgroundColor: dotColor,
      transform: [{ scale: opacity }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.indicatorDot, dotStyle]} />
      <View style={[styles.svgContainer, { shadowColor: color }]}>
        <Svg
          width={(RADIUS + STROKE_WIDTH) * 2}
          height={(RADIUS + STROKE_WIDTH) * 2}
          viewBox={`0 0 ${(RADIUS + STROKE_WIDTH) * 2} ${(RADIUS + STROKE_WIDTH) * 2}`}
          style={{ transform: [{ rotate: '-90deg' }] }}
        >
          {/* Background Circle */}
          <Circle
            cx={RADIUS + STROKE_WIDTH}
            cy={RADIUS + STROKE_WIDTH}
            r={RADIUS}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={STROKE_WIDTH}
            fill="rgba(0,0,0,0.5)"
          />
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
          />
        </Svg>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
      </View>
      <Text style={[styles.percentageText, { color }]}>{Math.round(value)}%</Text>
      <Text style={styles.labelText}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 6,
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
  percentageText: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: 'bold',
  },
  labelText: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
  },
});
