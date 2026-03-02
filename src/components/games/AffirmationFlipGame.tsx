import { useState } from "react";

const AFFIRMATIONS = [
  "You are enough, just as you are.",
  "This moment is temporary. You will get through it.",
  "Your feelings are valid.",
  "You deserve rest and peace.",
  "It's okay to take things one step at a time.",
  "You are stronger than you think.",
  "Progress, not perfection.",
  "Breathe. You're doing great.",
  "You bring value to the world.",
  "It's okay to ask for help.",
  "You are worthy of love and kindness.",
  "Small steps still move you forward.",
  "Your best is always good enough.",
  "Tomorrow is a fresh start.",
  "You matter more than you know.",
];

const AffirmationFlipGame = () => {
  const [current, setCurrent] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [collected, setCollected] = useState<string[]>([]);

  const flipCard = () => setIsFlipped(true);

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % AFFIRMATIONS.length);
    }, 200);
  };

  const collect = () => {
    const affirmation = AFFIRMATIONS[current];
    if (!collected.includes(affirmation)) {
      setCollected((prev) => [...prev, affirmation]);
    }
    nextCard();
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <h2 className="text-2xl font-bold text-foreground">Affirmation Cards</h2>
      <p className="text-sm text-muted-foreground">
        Flip a card to reveal a positive affirmation. Collect your favorites.
      </p>

      <div
        onClick={() => !isFlipped && flipCard()}
        className={`flex h-44 w-72 cursor-pointer items-center justify-center rounded-2xl border-2 p-6 text-center transition-all duration-300 ${
          isFlipped
            ? "border-primary bg-primary/5"
            : "border-border bg-card hover:border-primary/50 hover:-translate-y-1"
        }`}
      >
        {isFlipped ? (
          <p className="text-lg font-medium text-foreground animate-fade-in">
            💛 {AFFIRMATIONS[current]}
          </p>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-4xl">🌟</span>
            <span className="text-sm font-medium">Tap to reveal</span>
          </div>
        )}
      </div>

      {isFlipped && (
        <div className="flex gap-3 animate-fade-in">
          <button
            onClick={collect}
            className="rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            💝 Collect & Next
          </button>
          <button
            onClick={nextCard}
            className="rounded-lg bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Skip →
          </button>
        </div>
      )}

      {collected.length > 0 && (
        <div className="w-full max-w-sm space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Collected ({collected.length}):
          </p>
          <div className="flex flex-wrap gap-2">
            {collected.map((a, i) => (
              <span
                key={i}
                className="inline-block rounded-lg bg-primary/10 px-3 py-1.5 text-xs text-foreground"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AffirmationFlipGame;
