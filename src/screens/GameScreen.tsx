import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { HUD } from '../components/HUD';
import { INITIAL_GAME_STATE, GameState } from '../types/game';
import { Colors } from '../constants/colors';
import { Dimensions } from '../constants/dimensions';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cardRepository, highScoreRepository } from '../sqlite';
import { CardModel } from '../sqlite/types';
import { SwipeableCard } from '../components/SwipeableCard';
import { useSharedValue } from 'react-native-reanimated';

export const GameScreen = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const swipeX = useSharedValue(0);
  const [currentCard, setCurrentCard] = useState<CardModel | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState('');
  const [bestScore, setBestScore] = useState(0);

  const fetchNextCard = async (seenIds = gameState.seenCardIds) => {
    try {
      const card = await cardRepository.getRandomCard(seenIds);
      if (!card) {
        triggerGameOver('You survived all scenarios! You are a legendary CEO.', gameState.weeksSurvived);
        return;
      }
      setCurrentCard(card);
    } catch (e) {
      console.error('Failed to fetch card', e);
    }
  };

  useEffect(() => {
    fetchNextCard();
  }, []);

  const handleDecision = (isYes: boolean) => {
    if (!currentCard || isGameOver) return;

    setGameState(prevState => {
      const newCash = prevState.cash + (isYes ? currentCard.effect_cash_yes : currentCard.effect_cash_no);
      const newMorale = prevState.morale + (isYes ? currentCard.effect_morale_yes : currentCard.effect_morale_no);
      const newProduct = prevState.product + (isYes ? currentCard.effect_product_yes : currentCard.effect_product_no);
      const newPr = prevState.pr + (isYes ? currentCard.effect_pr_yes : currentCard.effect_pr_no);

      const clampedCash = Math.max(0, Math.min(100, newCash));
      const clampedMorale = Math.max(0, Math.min(100, newMorale));
      const clampedProduct = Math.max(0, Math.min(100, newProduct));
      const clampedPr = Math.max(0, Math.min(100, newPr));

      const newState = {
        ...prevState,
        cash: clampedCash,
        morale: clampedMorale,
        product: clampedProduct,
        pr: clampedPr,
        weeksSurvived: prevState.weeksSurvived + 1,
        seenCardIds: [...prevState.seenCardIds, currentCard.id],
      };

      if (clampedCash <= 0) triggerGameOver('You ran out of cash! The company is bankrupt.', newState.weeksSurvived);
      else if (clampedMorale <= 0) triggerGameOver('Team morale hit rock bottom. Everyone quit!', newState.weeksSurvived);
      else if (clampedProduct <= 0) triggerGameOver('The product is completely broken. Users left.', newState.weeksSurvived);
      else if (clampedPr <= 0) triggerGameOver('Public PR is a disaster. You were cancelled!', newState.weeksSurvived);
      else {
        fetchNextCard(newState.seenCardIds);
      }

      return newState;
    });
  };

  const triggerGameOver = async (reason: string, finalScore: number) => {
    setGameOverReason(reason);
    setIsGameOver(true);
    
    try {
      await highScoreRepository.saveScore(finalScore);
      const best = await highScoreRepository.getBestScore();
      setBestScore(best);
    } catch (e) {
      console.error('Failed to save or fetch high score', e);
    }
  };

  const restartGame = () => {
    setGameState(INITIAL_GAME_STATE);
    setIsGameOver(false);
    setGameOverReason('');
    swipeX.value = 0;
    fetchNextCard(INITIAL_GAME_STATE.seenCardIds);
  };

  const handleFundraise = () => {
    if (gameState.hasUsedFundraise) return;
    setGameState(prev => {
      const newCash = Math.min(100, prev.cash + 40);
      const newPr = Math.max(0, prev.pr - 15);
      
      const newState = { ...prev, cash: newCash, pr: newPr, hasUsedFundraise: true };
      
      if (newPr <= 0) {
        triggerGameOver('Public PR is a disaster. You were cancelled after the controversial fundraising!', prev.weeksSurvived);
      }
      return newState;
    });
  };

  if (isGameOver) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'top', 'bottom']}>
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverTitle}>YOU'RE FIRED!</Text>
          <Text style={styles.gameOverReason}>{gameOverReason}</Text>
          <Text style={styles.gameOverScore}>You survived {gameState.weeksSurvived} weeks.</Text>
          {bestScore > 0 && (
            <Text style={styles.bestScoreText}>BEST RECORD: {bestScore} WEEKS</Text>
          )}
          <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
            <Text style={styles.restartButtonText}>START NEW COMPANY</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <HUD gameState={gameState} swipeX={swipeX} currentCard={currentCard} />
      
      <View style={styles.gameArea}>
        {currentCard ? (
          <SwipeableCard 
            key={gameState.weeksSurvived} 
            card={currentCard} 
            onSwipe={handleDecision} 
            translateX={swipeX}
          />
        ) : (
          <Text style={{ color: Colors.textMuted }}>Loading next scenario...</Text>
        )}
      </View>
      
      <View style={styles.footer}>
        <View style={styles.powerupContainer}>
          <TouchableOpacity 
            style={[styles.powerupButton, gameState.hasUsedFundraise && styles.powerupDisabled]} 
            onPress={handleFundraise}
            disabled={gameState.hasUsedFundraise}
          >
            <Text style={styles.powerupText}>
              {gameState.hasUsedFundraise ? 'FUNDRAISED' : '🚀 FUNDRAISE (+💰, -📰)'}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.weeksLabel}>WEEKS SURVIVED</Text>
        <Text style={styles.weeksValue}>{gameState.weeksSurvived}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Dimensions.spacing.lg,
  },
  footer: {
    padding: Dimensions.spacing.xl,
    alignItems: 'center',
    paddingBottom: Dimensions.spacing.xxl,
  },
  powerupContainer: {
    marginBottom: Dimensions.spacing.xl,
  },
  powerupButton: {
    backgroundColor: Colors.surface,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.cash,
  },
  powerupDisabled: {
    opacity: 0.5,
    borderColor: Colors.border,
  },
  powerupText: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: 12,
  },
  weeksLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: Dimensions.spacing.xs,
  },
  weeksValue: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.text,
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  gameOverTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: Colors.pr,
    marginBottom: 16,
  },
  gameOverReason: {
    fontSize: 18,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 32,
  },
  gameOverScore: {
    fontSize: 24,
    color: Colors.cash,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bestScoreText: {
    fontSize: 14,
    color: Colors.textMuted,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 40,
  },
  restartButton: {
    backgroundColor: Colors.product,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 100,
  },
  restartButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
});
