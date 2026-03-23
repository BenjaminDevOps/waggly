import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { BorderRadius, Spacing, FontSize } from '../theme/spacing';

interface Props {
  label: string;
  color?: string;
  small?: boolean;
}

export function StatusBadge({ label, color = Colors.success, small = false }: Props) {
  return (
    <View style={[styles.badge, { backgroundColor: color + '18' }, small && styles.small]}>
      <Text style={[styles.text, { color }, small && styles.smallText]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  small: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  text: {
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  smallText: {
    fontSize: FontSize.xs,
  },
});
