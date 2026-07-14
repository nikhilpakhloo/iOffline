import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MetricBar } from './MetricBar';
import { GameState } from '../types/game';
import { Colors } from '../constants/colors';
import { Dimensions } from '../constants/dimensions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HUDProps {
  gameState: GameState;
}

export const HUD: React.FC<HUDProps> = ({ gameState }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <MetricBar
        label="Cash"
        icon="💰"
        value={gameState.cash}
        color={Colors.cash}
      />
      <MetricBar
        label="Morale"
        icon="👨‍💻"
        value={gameState.morale}
        color={Colors.morale}
      />
      <MetricBar
        label="Product"
        icon="🚀"
        value={gameState.product}
        color={Colors.product}
      />
      <MetricBar
        label="PR"
        icon="📰"
        value={gameState.pr}
        color={Colors.pr}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Dimensions.spacing.md,
    paddingVertical: Dimensions.spacing.lg,
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: Dimensions.borderRadius.xl,
    borderBottomRightRadius: Dimensions.borderRadius.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
});
