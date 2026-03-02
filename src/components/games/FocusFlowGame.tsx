import { useState, useEffect, useRef } from "react";

const FocusFlowGame = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(50);
  const [targetZone, setTargetZone] = useState({ start: 35, end: 65 });
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [direction, setDirection] = useState(1);
  const animRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const startGame = () => {
    setScore(0);
    setTimeLeft(15);
    setPosition(50);
    setIsPlaying(true);
    setTargetZone({ start: 30 + Math.random() * 20, end: 50 + Math.random() * 20 });
  };

  // Move the marker
  useEffect(() => {
    if (!isPlaying) return;
    const speed = 30; // pixels per second
    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      setPosition((prev) => {
        let next = prev + direction * speed * delta;
        if (next >= 95) { setDirection(-1); next = 95; }
        if (next <= 5) { setDirection(1); next = 5; }
        return next;
      });

      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animRef.current);
      lastTimeRef.current = 0;
    };
  }, [isPlaying, direction]);

  // Score ticking
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      if (position >= targetZone.start && position <= targetZone.end) {
        setScore((s) => s + 1);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [isPlaying, position, targetZone]);

  // Timer
  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) {
      if (timeLeft <= 0) setIsPlaying(false);
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const tap = () => {
    if (!isPlaying) return;
    setDirection((d) => d * -1);
  };

  const inZone = position >= targetZone.start && position <= targetZone.end;

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <h2 className="text-2xl font-bold text-foreground">Focus Flow</h2>
      <p className="text-sm text-muted-foreground">
        Tap to change direction. Keep the dot in the green zone.
      </p>

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
          <p className="font-semibold text-foreground">🎯 Final Score: {score}</p>
        </div>
      )}

      {isPlaying ? (
        <button
          onClick={tap}
          className="relative h-16 w-full max-w-sm overflow-hidden rounded-2xl border bg-card"
        >
          {/* Target zone */}
          <div
            className="absolute top-0 h-full bg-primary/15 rounded-lg"
            style={{
              left: `${targetZone.start}%`,
              width: `${targetZone.end - targetZone.start}%`,
            }}
          />
          {/* Marker */}
          <div
            className={`absolute top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors ${
              inZone ? "bg-primary shadow-lg" : "bg-muted-foreground"
            }`}
            style={{ left: `${position}%` }}
          />
        </button>
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

export default FocusFlowGame;
