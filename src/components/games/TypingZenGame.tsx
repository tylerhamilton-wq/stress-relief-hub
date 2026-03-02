import { useState, useEffect } from "react";

const WORDS = [
  "peace", "calm", "gentle", "serene", "bliss",
  "grace", "harmony", "joy", "light", "bloom",
  "dream", "hope", "kind", "warm", "glow",
];

const TypingZenGame = () => {
  const [currentWord, setCurrentWord] = useState("");
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);

  const nextWord = () => setCurrentWord(WORDS[Math.floor(Math.random() * WORDS.length)]);

  const start = () => {
    setScore(0);
    setTimeLeft(30);
    setInput("");
    setIsPlaying(true);
    nextWord();
  };

  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) {
      if (timeLeft <= 0) setIsPlaying(false);
      return;
    }
    const t = setInterval(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearInterval(t);
  }, [isPlaying, timeLeft]);

  useEffect(() => {
    if (isPlaying && input.toLowerCase() === currentWord) {
      setScore((s) => s + 1);
      setInput("");
      nextWord();
    }
  }, [input, currentWord, isPlaying]);

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <h2 className="text-2xl font-bold text-foreground">Typing Zen</h2>
      <p className="text-sm text-muted-foreground">Type calming words as fast as you can.</p>

      <div className="flex gap-4">
        <span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">Score: {score}</span>
        {isPlaying && <span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">⏱ {timeLeft}s</span>}
      </div>

      {!isPlaying && timeLeft <= 0 && (
        <div className="rounded-xl bg-primary/10 px-6 py-3 text-center">
          <p className="font-semibold text-foreground">🎉 You typed {score} words!</p>
        </div>
      )}

      {isPlaying ? (
        <div className="flex flex-col items-center gap-4">
          <span className="text-3xl font-bold text-primary tracking-widest">{currentWord}</span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
            className="w-48 rounded-xl border border-border bg-background px-4 py-3 text-center text-lg text-foreground outline-none focus:border-primary"
          />
        </div>
      ) : (
        <button onClick={start} className="rounded-xl bg-primary px-8 py-3 font-medium text-primary-foreground hover:opacity-90">
          {timeLeft <= 0 ? "Play Again" : "Start"}
        </button>
      )}
    </div>
  );
};

export default TypingZenGame;
