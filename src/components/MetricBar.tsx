import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { Dimensions } from '../constants/dimensions';

interface MetricBarProps {
  label: string;
  icon: string;
  value: number; // 0 to 100
  color: string;
}

export const MetricBar: React.FC<MetricBarProps> = ({
  label,
  icon,
  value,
  color
}) => {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.label}>{label.toUpperCase()}</Text>
      </View>
      <View style={styles.barBackground}>
        <View
          style={[
            styles.barFill,
            {
              width: `${clampedValue}%`,
              backgroundColor: color,
              shadowColor: color,
              elevation: 3
            }
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: Dimensions.spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  icon: {
    fontSize: 14,
    marginRight: 4,
  },
  label: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  barBackground: {
    height: 6,
    backgroundColor: Colors.surfaceHighlight,
    borderRadius: Dimensions.borderRadius.round,
    overflow: 'hidden', // hides overflow but we might lose glow inside. That's fine.
  },
  barFill: {
    height: '100%',
    borderRadius: Dimensions.borderRadius.round,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
});
