import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CircularMetric } from './CircularMetric';
import { GameState } from '../types/game';
import { Colors } from '../constants/colors';
import { Dimensions } from '../constants/dimensions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface HUDProps {
  gameState: GameState;
}

export const HUD: React.FC<HUDProps> = ({ gameState }) => {
  const insets = useSafeAreaInsets();

  return (
    <Animated.View entering={FadeInDown.duration(800)} style={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}>
      <View style={styles.metricWrapper}>
        <CircularMetric icon="💰" value={gameState.cash} color={Colors.cash} />
      </View>
      <View style={styles.metricWrapper}>
        <CircularMetric icon="👨‍💻" value={gameState.morale} color={Colors.morale} />
      </View>
      <View style={styles.metricWrapper}>
        <CircularMetric icon="🚀" value={gameState.product} color={Colors.product} />
      </View>
      <View style={styles.metricWrapper}>
        <CircularMetric icon="📰" value={gameState.pr} color={Colors.pr} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: Dimensions.spacing.sm,
    paddingBottom: Dimensions.spacing.md,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  metricWrapper: {
    alignItems: 'center',
  }
});
