import { useState, useEffect, useCallback, useRef } from "react";

const TILE_COLORS = [
  "bg-primary/60",
  "bg-accent/60",
  "bg-destructive/30",
  "bg-secondary",
];

const PatternRepeatGame = () => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSeq, setPlayerSeq] = useState<number[]>([]);
  const [isShowingPattern, setIsShowingPattern] = useState(false);
  const [activeTile, setActiveTile] = useState<number | null>(null);
  const [level, setLevel] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const timeoutRef = useRef<number[]>([]);

  const clearTimeouts = () => {
    timeoutRef.current.forEach(clearTimeout);
    timeoutRef.current = [];
  };

  const showPattern = useCallback((seq: number[]) => {
    setIsShowingPattern(true);
    setActiveTile(null);
    clearTimeouts();
    seq.forEach((tile, i) => {
      const t1 = window.setTimeout(() => setActiveTile(tile), i * 600);
      const t2 = window.setTimeout(() => setActiveTile(null), i * 600 + 400);
      timeoutRef.current.push(t1, t2);
    });
    const t3 = window.setTimeout(() => setIsShowingPattern(false), seq.length * 600);
    timeoutRef.current.push(t3);
  }, []);

  const startGame = () => {
    clearTimeouts();
    setGameOver(false);
    setLevel(1);
    setPlayerSeq([]);
    const first = [Math.floor(Math.random() * 4)];
    setSequence(first);
    setTimeout(() => showPattern(first), 500);
  };

  const handleTileClick = (tile: number) => {
    if (isShowingPattern || gameOver) return;
    const newPlayerSeq = [...playerSeq, tile];
    setPlayerSeq(newPlayerSeq);
    setActiveTile(tile);
    setTimeout(() => setActiveTile(null), 200);

    const idx = newPlayerSeq.length - 1;
    if (newPlayerSeq[idx] !== sequence[idx]) {
      setGameOver(true);
      setHighScore((h) => Math.max(h, level));
      return;
    }

    if (newPlayerSeq.length === sequence.length) {
      const nextLevel = level + 1;
      setLevel(nextLevel);
      setPlayerSeq([]);
      const next = [...sequence, Math.floor(Math.random() * 4)];
      setSequence(next);
      setTimeout(() => showPattern(next), 800);
    }
  };

  useEffect(() => () => clearTimeouts(), []);

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <h2 className="text-2xl font-bold text-foreground">Pattern Repeat</h2>

      <div className="flex gap-4">
        <span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
          Level: {level}
        </span>
        {highScore > 0 && (
          <span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
            Best: {highScore}
          </span>
        )}
      </div>

      {isShowingPattern && (
        <p className="text-sm font-medium text-primary animate-pulse">Watch the pattern...</p>
      )}

      {gameOver && (
        <div className="rounded-xl gradient-warm px-6 py-3 text-center text-primary-foreground">
          <p className="font-semibold">Game Over! Reached level {level}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {[0, 1, 2, 3].map((tile) => (
          <button
            key={tile}
            onClick={() => handleTileClick(tile)}
            disabled={isShowingPattern}
            className={`h-24 w-24 rounded-2xl border-2 transition-all duration-200 sm:h-28 sm:w-28 ${
              TILE_COLORS[tile]
            } ${
              activeTile === tile
                ? "scale-110 border-foreground/40 brightness-125"
                : "border-transparent hover:scale-105"
            } ${isShowingPattern ? "cursor-wait" : ""}`}
          />
        ))}
      </div>

      {(level === 0 || gameOver) && (
        <button
          onClick={startGame}
          className="rounded-xl gradient-calm px-8 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          {gameOver ? "Try Again" : "Start Game"}
        </button>
      )}
    </div>
  );
};

export default PatternRepeatGame;
