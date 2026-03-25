import React from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { Radius, Spacing } from '../theme/spacing';

interface Props {
  colors: readonly [string, string, ...string[]];
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

export function GradientCard({ colors, children, style, onPress }: Props) {
  const content = (
    <LinearGradient
      colors={[...colors]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[{ borderRadius: Radius.xl, padding: Spacing.xxl }, style]}
    >
      {children}
    </LinearGradient>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={() => {
          ReactNativeHapticFeedback.trigger('impactLight');
          onPress();
        }}
        activeOpacity={0.85}
      >
        {content}
      </TouchableOpacity>
    );
  }
  return content;
}
