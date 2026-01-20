import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CountdownTimerProps {
  expiryTime?: Date;
  onExpire?: () => void;
}

export function CountdownTimer({ expiryTime, onExpire }: CountdownTimerProps) {
  // Si pas de date fournie, créer une date 24h dans le futur
  const getDefaultExpiry = () => {
    const now = new Date();
    return new Date(now.getTime() + 24 * 60 * 60 * 1000);
  };

  const [timeLeft, setTimeLeft] = useState(() => {
    const expiry = expiryTime || getDefaultExpiry();
    return Math.max(0, expiry.getTime() - new Date().getTime());
  });

  useEffect(() => {
    const expiry = expiryTime || getDefaultExpiry();

    const interval = setInterval(() => {
      const remaining = Math.max(0, expiry.getTime() - new Date().getTime());
      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryTime, onExpire]);

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="time" size={20} color="#ef4444" />
      </View>
      <Text style={styles.label}>Offre limitée :</Text>
      <View style={styles.timeContainer}>
        <View style={styles.timeBlock}>
          <Text style={styles.timeNumber}>{formatNumber(hours)}</Text>
          <Text style={styles.timeLabel}>h</Text>
        </View>
        <Text style={styles.separator}>:</Text>
        <View style={styles.timeBlock}>
          <Text style={styles.timeNumber}>{formatNumber(minutes)}</Text>
          <Text style={styles.timeLabel}>m</Text>
        </View>
        <Text style={styles.separator}>:</Text>
        <View style={styles.timeBlock}>
          <Text style={styles.timeNumber}>{formatNumber(seconds)}</Text>
          <Text style={styles.timeLabel}>s</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  iconContainer: {
    marginRight: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#991b1b',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeBlock: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: '#dc2626',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 42,
    justifyContent: 'center',
  },
  timeNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  timeLabel: {
    fontSize: 10,
    color: '#fecaca',
    marginLeft: 2,
  },
  separator: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc2626',
  },
});
