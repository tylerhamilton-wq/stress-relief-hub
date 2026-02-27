import { useState, useRef, useCallback } from "react";

type GameState = "idle" | "waiting" | "ready" | "result";

const ReactionTimeGame = () => {
  const [state, setState] = useState<GameState>("idle");
  const [reactionTime, setReactionTime] = useState(0);
  const [best, setBest] = useState<number | null>(null);
  const [times, setTimes] = useState<number[]>([]);
  const timerRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  const startGame = useCallback(() => {
    setState("waiting");
    const delay = 1500 + Math.random() * 3500;
    timerRef.current = window.setTimeout(() => {
      startRef.current = Date.now();
      setState("ready");
    }, delay);
  }, []);

  const handleClick = () => {
    if (state === "waiting") {
      clearTimeout(timerRef.current);
      setState("idle");
      return;
    }
    if (state === "ready") {
      const time = Date.now() - startRef.current;
      setReactionTime(time);
      setTimes((prev) => [...prev, time]);
      setBest((prev) => (prev === null ? time : Math.min(prev, time)));
      setState("result");
    }
    if (state === "result" || state === "idle") {
      startGame();
    }
  };

  const avg = times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : null;

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <h2 className="text-2xl font-bold text-foreground">Reaction Time</h2>

      {best !== null && (
        <div className="flex gap-4">
          <span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
            Best: {best}ms
          </span>
          {avg !== null && (
            <span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
              Avg: {avg}ms
            </span>
          )}
        </div>
      )}

      <button
        onClick={handleClick}
        className={`flex h-48 w-full max-w-sm items-center justify-center rounded-2xl text-lg font-semibold transition-all ${
          state === "waiting"
            ? "bg-destructive/20 text-destructive"
            : state === "ready"
            ? "bg-primary/20 text-primary animate-scale-in"
            : state === "result"
            ? "bg-card border border-border text-foreground"
            : "gradient-calm text-primary-foreground"
        }`}
      >
        {state === "idle" && "Click to Start"}
        {state === "waiting" && "Wait for green..."}
        {state === "ready" && "TAP NOW!"}
        {state === "result" && (
          <div className="text-center">
            <p className="text-3xl font-bold">{reactionTime}ms</p>
            <p className="mt-2 text-sm text-muted-foreground">Click to try again</p>
          </div>
        )}
      </button>

      {state === "waiting" && (
        <p className="text-xs text-muted-foreground">
          Clicked too early? It resets automatically.
        </p>
      )}
    </div>
  );
};

export default ReactionTimeGame;
