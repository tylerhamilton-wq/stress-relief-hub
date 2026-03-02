import { useState, useEffect, useCallback } from "react";

interface Bubble {
  id: string;
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
}

const BUBBLE_COLORS = [
  "bg-primary/30",
  "bg-accent/40",
  "bg-secondary/50",
  "bg-muted-foreground/20",
  "bg-primary/20",
];

const BubblePopGame = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);

  const spawnBubble = useCallback(() => {
    const bubble: Bubble = {
      id: crypto.randomUUID(),
      x: 10 + Math.random() * 80,
      y: 100 + Math.random() * 10,
      size: 36 + Math.random() * 32,
      speed: 0.4 + Math.random() * 0.8,
      color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)],
    };
    setBubbles((prev) => [...prev.slice(-20), bubble]);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(spawnBubble, 600);
    return () => clearInterval(interval);
  }, [isPlaying, spawnBubble]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setBubbles((prev) =>
        prev
          .map((b) => ({ ...b, y: b.y - b.speed }))
          .filter((b) => b.y > -10)
      );
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) {
      if (timeLeft <= 0) setIsPlaying(false);
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const popBubble = (id: string) => {
    setBubbles((prev) => prev.filter((b) => b.id !== id));
    setScore((s) => s + 1);
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(20);
    setBubbles([]);
    setIsPlaying(true);
  };

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <h2 className="text-2xl font-bold text-foreground">Bubble Pop</h2>
      <p className="text-sm text-muted-foreground">Pop as many bubbles as you can!</p>

      <div className="flex gap-4">
        <span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
          Score: {score}
        </span>
        {isPlaying && (
          <span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
            ⏱ {timeLeft}s
          </span>
        )}
      </div>

      {!isPlaying && timeLeft <= 0 && (
        <div className="rounded-xl bg-primary/10 px-6 py-3 text-center">
          <p className="font-semibold text-foreground">🎉 You popped {score} bubbles!</p>
        </div>
      )}

      {isPlaying ? (
        <div className="relative h-72 w-full max-w-sm overflow-hidden rounded-2xl border bg-card">
          {bubbles.map((bubble) => (
            <button
              key={bubble.id}
              onClick={() => popBubble(bubble.id)}
              className={`absolute rounded-full ${bubble.color} transition-transform hover:scale-110 active:scale-90`}
              style={{
                left: `${bubble.x}%`,
                top: `${bubble.y}%`,
                width: bubble.size,
                height: bubble.size,
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>
      ) : (
        <button
          onClick={startGame}
          className="rounded-xl bg-primary px-8 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          {timeLeft <= 0 ? "Play Again" : "Start Game"}
        </button>
      )}
    </div>
  );
};

export default BubblePopGame;
