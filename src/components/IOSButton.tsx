import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { Colors, Gradients } from '../theme/colors';
import { Radius, Spacing, Font, Weight, Shadow } from '../theme/spacing';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  size?: 'default' | 'large';
}

export function IOSButton({
  label,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
  style,
  size = 'default',
}: Props) {
  const handlePress = () => {
    ReactNativeHapticFeedback.trigger('impactMedium');
    onPress();
  };

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={0.85}
        style={[style, (disabled || loading) && { opacity: 0.6 }]}
      >
        <LinearGradient
          colors={[...Gradients.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.btn, size === 'large' && styles.btnLarge, Shadow.glow(Colors.primary)]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              {icon}
              <Text style={[styles.btnText, size === 'large' && styles.btnTextLarge, icon ? { marginLeft: Spacing.sm } : undefined]}>
                {label}
              </Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const variantStyles = {
    secondary: { bg: Colors.surfaceSecondary, text: Colors.ink },
    ghost: { bg: 'transparent', text: Colors.primary },
    danger: { bg: Colors.errorPale, text: Colors.error },
  };
  const v = variantStyles[variant];

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.btn,
        size === 'large' && styles.btnLarge,
        { backgroundColor: v.bg },
        variant === 'ghost' && styles.ghost,
        (disabled || loading) && { opacity: 0.6 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.text} />
      ) : (
        <>
          {icon}
          <Text style={[styles.btnText, size === 'large' && styles.btnTextLarge, { color: v.text }, icon ? { marginLeft: Spacing.sm } : undefined]}>
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxl,
    borderRadius: Radius.md,
  },
  btnLarge: {
    paddingVertical: Spacing.xl,
    borderRadius: Radius.lg,
  },
  ghost: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  btnText: {
    color: Colors.inkInverse,
    fontSize: Font.bodyLarge,
    fontWeight: Weight.semibold,
  },
  btnTextLarge: {
    fontSize: Font.title3,
    fontWeight: Weight.bold,
  },
});
