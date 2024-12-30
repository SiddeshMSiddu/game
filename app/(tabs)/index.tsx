import React, { useState, useEffect } from 'react';
import { ViewStyle } from 'react-native';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Easing,
  FlatList,
} from 'react-native';

// Define custom card type
type MemoryCard = {
  id: string;
  symbol: string;
  isRevealed: boolean;
};

const symbolsList = ['X', 'Y', 'Z', 'W', 'V', 'U', 'T', 'H'];

export default function MemoryGame() {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [revealedCards, setRevealedCards] = useState<string[]>([]);
  const [completedCards, setCompletedCards] = useState<string[]>([]);
  const [scores, setScores] = useState<number[]>([0, 0]);
  const [activePlayer, setActivePlayer] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const shuffledSymbols = shuffle([...symbolsList, ...symbolsList, ...symbolsList, ...symbolsList]);
    const newCards = shuffledSymbols.map((symbol, index) => ({ id: index.toString(), symbol, isRevealed: false }));
    setCards(newCards);
    resetGameState();
  };

  const shuffle = (array: any[]) => array.sort(() => Math.random() - 0.5);

  const resetGameState = () => {
    setRevealedCards([]);
    setCompletedCards([]);
    setScores([0, 0]);
    setActivePlayer(0);
    setIsGameOver(false);
  };

  const handleCardFlip = (cardId: string) => {
    if (revealedCards.length < 2 && !revealedCards.includes(cardId) && !completedCards.includes(cardId)) {
      const updatedRevealedCards = [...revealedCards, cardId];
      setRevealedCards(updatedRevealedCards);

      if (updatedRevealedCards.length === 2) {
        const [firstCard, secondCard] = updatedRevealedCards.map((id) => cards.find((card) => card.id === id)!);

        if (firstCard.symbol === secondCard.symbol) {
          setCompletedCards((prevCompleted) => [...prevCompleted, ...updatedRevealedCards]);
          setScores((prevScores) => {
            const updatedScores = [...prevScores];
            updatedScores[activePlayer] += 1;
            return updatedScores;
          });
        }

        setTimeout(() => {
          setRevealedCards([]);
          setActivePlayer((prev) => (prev === 0 ? 1 : 0));

          if (completedCards.length + 2 === cards.length) {
            setIsGameOver(true);
          }
        }, 1000);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Flip Card Match Game</Text>
      <View style={styles.scoreBoard}>
        <Text style={styles.score}>Player 1: {scores[0]}</Text>
        <Text style={styles.score}>Player 2: {scores[1]}</Text>
        <Text style={styles.turn}>Current Player: {activePlayer + 1}</Text>
      </View>

      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        numColumns={4}
        renderItem={({ item }) => (
          <MemoryCardComponent
            card={item}
            isFlipped={revealedCards.includes(item.id) || completedCards.includes(item.id)}
            isMatched={completedCards.includes(item.id)}
            onFlip={() => handleCardFlip(item.id)}
          />
        )}
        contentContainerStyle={styles.cardGrid}
      />

      {isGameOver && (
        <View style={styles.gameOverMessage}>
          <Text style={styles.gameOverText}>
            Game Over! {scores[0] === scores[1] ? 'It\'s a tie!' : `Player ${scores[0] > scores[1] ? 1 : 2} wins!`}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={startNewGame}>
            <Text style={styles.retryButtonText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const MemoryCardComponent = ({
  card,
  isFlipped,
  isMatched,
  onFlip,
}: {
  card: MemoryCard;
  isFlipped: boolean;
  isMatched: boolean;
  onFlip: () => void;
}) => {
  const flipAnimation = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(flipAnimation, {
      toValue: isFlipped ? 1 : 0,
      duration: 600,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [isFlipped]);

  const frontRotation = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backRotation = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontStyle = {
    transform: [{ rotateY: frontRotation }],
  };

  const backStyle = {
    transform: [{ rotateY: backRotation }],
  };

  return (
    <TouchableOpacity style={styles.card} onPress={!isMatched ? onFlip : null} activeOpacity={0.8}>
      <Animated.View style={[styles.cardFace, styles.backSide, backStyle]}>
        <Text style={styles.cardSymbol}>{card.symbol}</Text>
      </Animated.View>
      <Animated.View style={[styles.cardFace, styles.frontSide, frontStyle]}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?ixlib=rb-1.2.1&w=1000&q=80' }}
          style={styles.cardImage}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#abcdf7',
    alignItems: 'center',
    paddingVertical: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scoreBoard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  score: {
    fontSize: 18,
  },
  turn: {
    fontSize: 18,
  },
  cardGrid: {
    width: '90%',
    justifyContent: 'center',
  },
  card: {
    width: '22%',
    aspectRatio: 1,
    margin: 5,
    perspective: 1000, 
    borderWidth: 2,
    borderRadius: 8,
    borderColor: 'red',
  } as unknown as ViewStyle,
  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    borderRadius: 8,
    borderWidth: 1,
  },
  backSide: {
    backgroundColor: '#3399FF',
  },
  frontSide: {
    backgroundColor: '#fff',
  },
  cardSymbol: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  gameOverMessage: {
    marginTop: 20,
    alignItems: 'center',
  },
  gameOverText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  retryButton: {
    padding: 12,
    backgroundColor: '#4b0082',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
