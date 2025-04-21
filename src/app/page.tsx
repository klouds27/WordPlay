"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

// Word list in Spanish
const WORDS = ["SALUD", "MUNDO", "AZUL", "PERRO", "GRATO"];

function getRandomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase();
}

export default function Home() {
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [word, setWord] = useState(() => getRandomWord());
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameOver) return;

      const key = event.key.toUpperCase();

      if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
        setCurrentGuess((prev) => prev + key);
      } else if (key === "BACKSPACE") {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (key === "ENTER" && currentGuess.length === WORD_LENGTH) {
        handleGuess();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentGuess, gameOver]);

  const handleGuess = () => {
    if (guesses.length < MAX_GUESSES) {
      if (!WORDS.map(word => word.toUpperCase()).includes(currentGuess)) {
        setMessage("Not in word list");
        return;
      }

      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);
      setMessage("");
      setCurrentGuess("");

      if (currentGuess === word) {
        setGameOver(true);
        setGameWon(true);
        setMessage("¡Felicidades! ¡Has ganado!");
      } else if (newGuesses.length === MAX_GUESSES) {
        setGameOver(true);
        setMessage(`¡Has perdido! La palabra era ${word}`);
      }
    }
  };

  const getFeedback = (guess: string, index: number): "correct" | "present" | "absent" => {
    if (guess[index] === word[index]) {
      return "correct";
    } else if (word.includes(guess[index])) {
      return "present";
    } else {
      return "absent";
    }
  };

  const cellStyle = "w-12 h-12 border-2 border-secondary flex items-center justify-center uppercase font-bold rounded shadow-md";

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 bg-wordplay-bg">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 shadow-lg rounded-lg px-6 py-2 bg-white">
        WordPlay
      </h1>

      <div className="grid gap-2 mb-4">
        {Array(MAX_GUESSES)
          .fill("")
          .map((_, i) => (
            <div key={i} className="flex gap-2">
              {Array(WORD_LENGTH)
                .fill("")
                .map((__, j) => {
                  const letter = guesses[i]?.[j] || (i === guesses.length ? currentGuess[j] : "");
                  let feedbackClass = "bg-secondary"; // Default style

                  if (guesses[i]) {
                    const feedback = getFeedback(guesses[i], j);
                    feedbackClass = feedback;
                  }

                  return (
                    <div
                      key={j}
                      className={`${cellStyle} ${feedbackClass}`}
                    >
                      {letter}
                    </div>
                  );
                })}
            </div>
          ))}
      </div>

      {message && (
        <div className="text-xl mt-4 p-4 bg-white rounded-md shadow-md text-center">
          {message}
          {gameOver && (
            <Button className="ml-2" onClick={() => {
                setGuesses([]);
                setCurrentGuess("");
                setWord(getRandomWord());
                setGameOver(false);
                setGameWon(false);
                setMessage("");
              }}>Play Again</Button>
          )}
        </div>
      )}
    </main>
  );
}

