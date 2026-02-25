import { useState, useEffect, useCallback } from "react";

const COLORS = [
  { name: "Sage", hsl: "hsl(152, 35%, 45%)" },
  { name: "Coral", hsl: "hsl(28, 60%, 65%)" },
  { name: "Sky", hsl: "hsl(200, 60%, 55%)" },
  { name: "Lavender", hsl: "hsl(270, 40%, 65%)" },
];

const ColorTapGame = () => {
  const [targetColor, setTargetColor] = useState(0);
  const [options, setOptions] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const newRound = useCallback(() => {
    const target = Math.floor(Math.random() * COLORS.length);
    setTargetColor(target);
    const shuffled = [...Array(COLORS.length).keys()].sort(() => Math.random() - 0.5);
    setOptions(shuffled);
  }, []);

  const startGame = () => {
    setScore(0);
    setTimeLeft(15);
    setIsPlaying(true);
    newRound();
  };

  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) {
      if (timeLeft <= 0) {
        setIsPlaying(false);
        setHighScore((h) => Math.max(h, score));
      }
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, score]);

  const handleTap = (colorIndex: number) => {
    if (!isPlaying) return;
    if (colorIndex === targetColor) {
      setScore((s) => s + 1);
      newRound();
    } else {
      setScore((s) => Math.max(0, s - 1));
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <h2 className="text-2xl font-bold text-foreground">Color Tap</h2>

      {!isPlaying && timeLeft <= 0 && (
        <div className="rounded-xl gradient-warm px-6 py-3 text-center text-primary-foreground">
          <p className="font-semibold">Time's up! Score: {score}</p>
          {score === highScore && score > 0 && <p className="text-sm">🏆 New high score!</p>}
        </div>
      )}

      {isPlaying ? (
        <>
          <div className="flex items-center gap-4">
            <span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
              Score: {score}
            </span>
            <span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
              ⏱ {timeLeft}s
            </span>
          </div>

          <div className="text-center">
            <p className="mb-3 text-sm text-muted-foreground">Tap the color:</p>
            <span className="text-xl font-bold text-foreground">{COLORS[targetColor].name}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {options.map((colorIndex) => (
              <button
                key={colorIndex}
                onClick={() => handleTap(colorIndex)}
                className="h-24 w-24 rounded-2xl border-2 border-transparent transition-all hover:scale-105 hover:border-foreground/20 active:scale-95 sm:h-28 sm:w-28"
                style={{ backgroundColor: COLORS[colorIndex].hsl }}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-4">
          {highScore > 0 && (
            <p className="text-sm text-muted-foreground">
              Best: <span className="font-semibold text-primary">{highScore}</span>
            </p>
          )}
          <button
            onClick={startGame}
            className="rounded-xl gradient-calm px-8 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            {timeLeft <= 0 ? "Play Again" : "Start Game"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ColorTapGame;
