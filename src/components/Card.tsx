import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { BorderRadius, Spacing } from '../theme/spacing';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

export function Card({ children, style, onPress }: Props) {
  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={[styles.card, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
});
