import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BorderRadius, Spacing } from '../theme/spacing';

interface Props {
  colors: readonly [string, string, ...string[]];
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

export function GradientCard({ colors, children, style, onPress }: Props) {
  const content = (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, style]}
    >
      {children}
    </LinearGradient>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress} activeOpacity={0.8}>{content}</TouchableOpacity>;
  }
  return content;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
  },
});
