import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function LoadingScreen() {
  // Animations
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const dotsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animation du logo (pulse)
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 0.8,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animation de rotation subtile
    Animated.loop(
      Animated.timing(logoRotate, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    // Animation des points de chargement
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotsOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(dotsOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const spin = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient colors={['#6366f1', '#8b5cf6', '#a855f7']} style={styles.container}>
      <View style={styles.content}>
        {/* Logo animé */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: logoScale }, { rotate: spin }],
            },
          ]}
        >
          <Text style={styles.logo}>🐾</Text>
        </Animated.View>

        {/* Nom de l'app */}
        <Text style={styles.title}>PetHealth</Text>
        <Text style={styles.subtitle}>Prenez soin de vos compagnons</Text>

        {/* Indicateur de chargement */}
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement</Text>
          <Animated.Text style={[styles.loadingDots, { opacity: dotsOpacity }]}>
            ...
          </Animated.Text>
        </View>

        {/* Barre de progression animée */}
        <View style={styles.progressBar}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                transform: [{ translateX: logoRotate.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-200, 200],
                }) }],
              },
            ]}
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    fontSize: 100,
    textAlign: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#e0e7ff',
    marginBottom: 50,
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  loadingDots: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  progressBar: {
    width: 200,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    width: 100,
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
});
