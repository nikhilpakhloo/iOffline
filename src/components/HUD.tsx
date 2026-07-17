import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CircularMetric } from './CircularMetric';
import { GameState } from '../types/game';
import { Colors } from '../constants/colors';
import { Dimensions } from '../constants/dimensions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, SharedValue } from 'react-native-reanimated';
import { CardModel } from '../sqlite/types';

interface HUDProps {
  gameState: GameState;
  swipeX?: SharedValue<number>;
  currentCard?: CardModel | null;
}

export const HUD: React.FC<HUDProps> = ({ gameState, swipeX, currentCard }) => {
  const insets = useSafeAreaInsets();

  return (
    <Animated.View entering={FadeInDown.duration(800)} style={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}>
      <View style={styles.metricWrapper}>
        <CircularMetric icon="💰" value={gameState.cash} color={Colors.cash} label="Cash" swipeX={swipeX} effectYes={currentCard?.effect_cash_yes} effectNo={currentCard?.effect_cash_no} />
      </View>
      <View style={styles.metricWrapper}>
        <CircularMetric icon="👨‍💻" value={gameState.morale} color={Colors.morale} label="Morale" swipeX={swipeX} effectYes={currentCard?.effect_morale_yes} effectNo={currentCard?.effect_morale_no} />
      </View>
      <View style={styles.metricWrapper}>
        <CircularMetric icon="🚀" value={gameState.product} color={Colors.product} label="Product" swipeX={swipeX} effectYes={currentCard?.effect_product_yes} effectNo={currentCard?.effect_product_no} />
      </View>
      <View style={styles.metricWrapper}>
        <CircularMetric icon="📰" value={gameState.pr} color={Colors.pr} label="PR" swipeX={swipeX} effectYes={currentCard?.effect_pr_yes} effectNo={currentCard?.effect_pr_no} />
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
