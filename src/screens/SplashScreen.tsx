import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { initDB } from '../sqlite';
import { useNavigation } from '@react-navigation/native';
import { userRepository } from '../sqlite/repositories/UserRepository';

export const SplashScreen = () => {
  const navigation = useNavigation<any>();

  useEffect(() => {
    const setup = async () => {
      try {
        await initDB();
        const users = await userRepository.findAll();
        // Wait a little bit so the user can see the splash screen
        setTimeout(() => {
          if (users.length > 0) {
            navigation.replace('Game');
          } else {
            navigation.replace('Welcome');
          }
        }, 2000);
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };
    setup();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Animated.Text entering={FadeIn.duration(1000)} exiting={FadeOut} style={styles.title}>
        CEO Survival
      </Animated.Text>
      <Animated.Text entering={FadeIn.delay(500).duration(1000)} style={styles.subtitle}>
        The Startup Simulator
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 2,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#8e8e93',
    fontWeight: '500',
    letterSpacing: 1,
  },
});
