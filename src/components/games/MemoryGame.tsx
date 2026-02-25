import { useState, useEffect } from "react";

const emojis = ["🌸", "🌿", "🦋", "🌊", "🌙", "☀️", "🍃", "🌺"];

const shuffle = (arr: string[]) => [...arr].sort(() => Math.random() - 0.5);

const MemoryGame = () => {
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const initGame = () => {
    setCards(shuffle([...emojis, ...emojis]));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    if (flipped.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = flipped;
      if (cards[a] === cards[b]) {
        setMatched((prev) => [...prev, a, b]);
        setFlipped([]);
      } else {
        const timer = setTimeout(() => setFlipped([]), 800);
        return () => clearTimeout(timer);
      }
    }
  }, [flipped, cards]);

  const handleClick = (i: number) => {
    if (flipped.length >= 2 || flipped.includes(i) || matched.includes(i)) return;
    setFlipped((prev) => [...prev, i]);
  };

  const isWon = matched.length === cards.length && cards.length > 0;

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold text-foreground">Memory Match</h2>
        <span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
          Moves: {moves}
        </span>
      </div>

      {isWon && (
        <div className="rounded-xl gradient-calm px-6 py-3 text-center text-primary-foreground">
          <p className="font-semibold">🎉 You won in {moves} moves!</p>
        </div>
      )}

      <div className="grid grid-cols-4 gap-3">
        {cards.map((emoji, i) => {
          const isFlipped = flipped.includes(i) || matched.includes(i);
          return (
            <button
              key={i}
              onClick={() => handleClick(i)}
              className={`flex h-16 w-16 items-center justify-center rounded-xl text-2xl transition-all duration-300 sm:h-20 sm:w-20 ${
                isFlipped
                  ? "bg-card border-2 border-primary scale-105"
                  : "bg-primary/10 border-2 border-transparent hover:border-primary/30 hover:bg-primary/20"
              } ${matched.includes(i) ? "opacity-60" : ""}`}
            >
              {isFlipped ? emoji : "?"}
            </button>
          );
        })}
      </div>

      <button
        onClick={initGame}
        className="rounded-lg bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        New Game
      </button>
    </div>
  );
};

export default MemoryGame;
