import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Radius, Spacing, Font, Weight } from '../theme/spacing';

interface Props {
  label: string;
  color: string;
  small?: boolean;
}

export function StatusBadge({ label, color, small = false }: Props) {
  return (
    <View style={[styles.badge, { backgroundColor: color + '18' }, small && styles.small]}>
      <Text style={[styles.text, { color }, small && styles.smallText]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 1,
    borderRadius: Radius.pill,
  },
  small: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 3,
  },
  text: {
    fontSize: Font.sm,
    fontWeight: Weight.bold,
  },
  smallText: {
    fontSize: Font.xs,
  },
});
