import { useState, useEffect, useCallback } from "react";

const CalmCatcherGame = () => {
  const [basketX, setBasketX] = useState(50);
  const [items, setItems] = useState<{ id: string; x: number; y: number; emoji: string; good: boolean }[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isPlaying, setIsPlaying] = useState(false);

  const GOOD = ["🌸", "⭐", "💎", "🌈", "🍀"];
  const BAD = ["💣", "🌩️", "🔥"];

  const spawnItem = useCallback(() => {
    const isGood = Math.random() > 0.3;
    const pool = isGood ? GOOD : BAD;
    setItems((prev) => [...prev.slice(-15), {
      id: crypto.randomUUID(),
      x: 5 + Math.random() * 90,
      y: 0,
      emoji: pool[Math.floor(Math.random() * pool.length)],
      good: isGood,
    }]);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const i = setInterval(spawnItem, 700);
    return () => clearInterval(i);
  }, [isPlaying, spawnItem]);

  useEffect(() => {
    if (!isPlaying) return;
    const i = setInterval(() => {
      setItems((prev) => {
        const next = prev.map((item) => ({ ...item, y: item.y + 2 }));
        const caught = next.filter((item) => item.y >= 90 && Math.abs(item.x - basketX) < 12);
        caught.forEach((item) => {
          setScore((s) => item.good ? s + 1 : Math.max(0, s - 2));
        });
        return next.filter((item) => item.y < 100 && !caught.includes(item));
      });
    }, 60);
    return () => clearInterval(i);
  }, [isPlaying, basketX]);

  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) {
      if (timeLeft <= 0) setIsPlaying(false);
      return;
    }
    const t = setInterval(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearInterval(t);
  }, [isPlaying, timeLeft]);

  useEffect(() => {
    if (!isPlaying) return;
    const handler = (e: MouseEvent | TouchEvent) => {
      const container = document.getElementById("catcher-area");
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const pct = ((clientX - rect.left) / rect.width) * 100;
      setBasketX(Math.max(5, Math.min(95, pct)));
    };
    window.addEventListener("mousemove", handler);
    window.addEventListener("touchmove", handler as any);
    return () => { window.removeEventListener("mousemove", handler); window.removeEventListener("touchmove", handler as any); };
  }, [isPlaying]);

  const start = () => { setScore(0); setTimeLeft(20); setItems([]); setIsPlaying(true); };

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <h2 className="text-2xl font-bold text-foreground">Calm Catcher</h2>
      <p className="text-sm text-muted-foreground">Move to catch good items 🌸, avoid bad ones 💣</p>

      <div className="flex gap-4">
        <span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">Score: {score}</span>
        {isPlaying && <span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">⏱ {timeLeft}s</span>}
      </div>

      {!isPlaying && timeLeft <= 0 && (
        <div className="rounded-xl bg-primary/10 px-6 py-3"><p className="font-semibold text-foreground">🎉 Score: {score}</p></div>
      )}

      {isPlaying ? (
        <div id="catcher-area" className="relative h-64 w-full max-w-sm overflow-hidden rounded-2xl border bg-card cursor-none">
          {items.map((item) => (
            <span key={item.id} className="absolute text-xl" style={{ left: `${item.x}%`, top: `${item.y}%`, transform: "translate(-50%, -50%)" }}>{item.emoji}</span>
          ))}
          <div className="absolute bottom-2 text-2xl" style={{ left: `${basketX}%`, transform: "translateX(-50%)" }}>🧺</div>
        </div>
      ) : (
        <button onClick={start} className="rounded-xl bg-primary px-8 py-3 font-medium text-primary-foreground hover:opacity-90">
          {timeLeft <= 0 ? "Play Again" : "Start"}
        </button>
      )}
    </div>
  );
};

export default CalmCatcherGame;
