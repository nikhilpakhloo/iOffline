import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { userRepository } from '../sqlite/repositories/UserRepository';

export const WelcomeScreen = () => {
  const [name, setName] = useState('');
  const navigation = useNavigation<any>();

  const handleStart = async () => {
    if (name.trim().length === 0) return;
    try {
      await userRepository.create(name.trim());
      navigation.replace('Game');
    } catch (e) {
      console.error('Failed to create user', e);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Animated.View entering={FadeInDown.duration(800).delay(200)} style={styles.content}>
        <Text style={styles.promptText}>Enter your name, boss.</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.prefixText}>I am CEO</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Name..."
            placeholderTextColor="#555"
            value={name}
            onChangeText={setName}
            autoFocus
            maxLength={20}
            returnKeyType="done"
            onSubmitEditing={handleStart}
          />
        </View>

        {name.trim().length > 0 && (
          <Animated.View entering={FadeInUp.duration(400)}>
            <TouchableOpacity style={styles.button} onPress={handleStart}>
              <Text style={styles.buttonText}>START COMPANY</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0c',
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
  },
  promptText: {
    fontSize: 18,
    color: '#8e8e93',
    fontWeight: '500',
    marginBottom: 40,
    letterSpacing: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#333',
    paddingBottom: 8,
    marginBottom: 60,
  },
  prefixText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginRight: 12,
  },
  textInput: {
    fontSize: 28,
    fontWeight: '800',
    color: '#00e5ff',
    minWidth: 150,
  },
  button: {
    backgroundColor: '#00e5ff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    shadowColor: '#00e5ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: '#0a0a0c',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
