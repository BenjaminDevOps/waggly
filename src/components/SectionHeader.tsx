import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { FontSize, Spacing } from '../theme/spacing';

interface Props {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, actionLabel, onAction }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {actionLabel && onAction && (
        <TouchableOpacity onPress={onAction}>
          <Text style={styles.action}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text,
  },
  action: {
    fontSize: FontSize.md,
    color: Colors.primary,
    fontWeight: '600',
  },
});
