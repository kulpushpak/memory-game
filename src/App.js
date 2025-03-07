import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import Card from './components/Card';

function App() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [timer, setTimer] = useState(0);
  const [topScore, setTopScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  // Images for the cards
  const cardImages = [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'
  ];

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    let interval;
    if (gameStarted) {
      interval = setInterval(() => {
        setTimer(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted]);

  const initializeGame = () => {

    const topScore = localStorage.getItem('topScore');
    setTopScore(topScore);

    // Create pairs of cards and shuffle them
    const duplicatedCards = [...cardImages, ...cardImages];
    const shuffledCards = duplicatedCards
      .sort(() => Math.random() - 0.5)
      .map((image, index) => ({
        id: index,
        image: image,
        isFlipped: false
      }));

    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setTimer(0);
    setGameStarted(false);
    setGameOver(false);
  };

  const handleCardClick = (clickedCardId) => {

    // Start the game if it's not started
    if (!gameStarted) {
      setGameStarted(true);
    }

    // Find the clicked card
    const clickedCard = cards.find(card => card.id === clickedCardId);

    // Prevent clicking if card is already flipped or matched
    if (
      flippedCards.length === 2 ||
      flippedCards.includes(clickedCardId) ||
      matchedPairs.includes(clickedCard.image)
    ) {
      return;
    }

    // Add clicked card to flipped cards
    const newFlippedCards = [...flippedCards, clickedCardId];
    setFlippedCards(newFlippedCards);

    // Check for match if two cards are flipped
    if (newFlippedCards.length === 2) {
      const firstCard = cards.find(card => card.id === newFlippedCards[0]);
      const secondCard = cards.find(card => card.id === newFlippedCards[1]);

      if (firstCard.image === secondCard.image) {
        // Match found
        setMatchedPairs([...matchedPairs, firstCard.image]);
        setFlippedCards([]);
        if (matchedPairs.length === cardImages.length - 1) {
          setGameStarted(false);
          setTimeout(() => {
            setGameOver(true);
            setLocalTopScore();
          }, 500);
          return;
        }
      } else {
        // No match - flip cards back after delay
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const setLocalTopScore = () => {
    if (timer < topScore || topScore === 0) {
      localStorage.setItem('topScore', timer);
      setTopScore(timer);
    }
  }
  return (
    <div className="App">
      <h1 className='game-text'>Find The Pair</h1>
      <div className="game-info">
        <div className="timer game-text">Time: {formatTime(timer)}</div>
        <div className="timer top-time game-text">Top: {formatTime(topScore)}</div>
        <button onClick={initializeGame}>New Game</button>
      </div>
      <div className="game-board">
        {cards.map(card => (
          <Card
            key={card.id}
            id={card.id}
            image={card.image}
            isFlipped={flippedCards.includes(card.id) || matchedPairs.includes(card.image)}
            onClick={handleCardClick}
          />
        ))}
      </div>
      {gameOver && (
        <div className="modal">
          <div className="modal-content">
            <h2>Congratulations!</h2>
            <p>You completed the game in {formatTime(timer)}</p>
            <button onClick={initializeGame}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 