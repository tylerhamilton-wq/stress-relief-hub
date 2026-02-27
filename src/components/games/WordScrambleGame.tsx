import { useState, useCallback } from "react";

const WORDS = [
  { word: "PEACEFUL", hint: "Calm and tranquil" },
  { word: "BREATHE", hint: "In and out slowly" },
  { word: "HARMONY", hint: "Balance and agreement" },
  { word: "SERENE", hint: "Untroubled and calm" },
  { word: "MINDFUL", hint: "Present and aware" },
  { word: "GRATITUDE", hint: "Feeling of thankfulness" },
  { word: "BALANCE", hint: "Equilibrium in life" },
  { word: "WELLNESS", hint: "State of good health" },
  { word: "COURAGE", hint: "Bravery in tough times" },
  { word: "PATIENCE", hint: "Waiting without frustration" },
];

const scramble = (word: string) =>
  word.split("").sort(() => Math.random() - 0.5).join("");

const WordScrambleGame = () => {
  const [index, setIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [scrambled, setScrambled] = useState(() => scramble(WORDS[0].word));

  const nextWord = useCallback(() => {
    const next = (index + 1) % WORDS.length;
    setIndex(next);
    setScrambled(scramble(WORDS[next].word));
    setGuess("");
    setShowHint(false);
    setFeedback(null);
  }, [index]);

  const checkGuess = () => {
    if (guess.toUpperCase().trim() === WORDS[index].word) {
      setScore((s) => s + 1);
      setFeedback("correct");
      setTimeout(nextWord, 1000);
    } else {
      setFeedback("wrong");
      setTimeout(() => setFeedback(null), 800);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <h2 className="text-2xl font-bold text-foreground">Word Scramble</h2>
      <span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
        Score: {score}
      </span>

      <div className="flex gap-2">
        {scrambled.split("").map((letter, i) => (
          <span
            key={i}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-lg font-bold text-primary"
          >
            {letter}
          </span>
        ))}
      </div>

      {showHint && (
        <p className="text-sm text-muted-foreground italic">
          💡 {WORDS[index].hint}
        </p>
      )}

      <div className="flex gap-2">
        <input
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && checkGuess()}
          placeholder="Your guess..."
          className={`rounded-xl border bg-card px-4 py-2 text-center text-foreground outline-none transition-colors focus:border-primary ${
            feedback === "correct"
              ? "border-green-400 bg-green-50"
              : feedback === "wrong"
              ? "border-destructive bg-destructive/5"
              : "border-border"
          }`}
        />
        <button
          onClick={checkGuess}
          className="rounded-xl gradient-calm px-6 py-2 font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Check
        </button>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setShowHint(true)}
          className="rounded-lg bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          Show Hint
        </button>
        <button
          onClick={nextWord}
          className="rounded-lg bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          Skip →
        </button>
      </div>
    </div>
  );
};

export default WordScrambleGame;
