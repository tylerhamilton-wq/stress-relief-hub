import { useState } from "react";

const GARDEN_SIZE = 6;
const ITEMS = ["🪨", "🌸", "🌿", "🍃", "🌺", "🦋", "💧", "🌙"];

const ZenGardenGame = () => {
  const [grid, setGrid] = useState<(string | null)[]>(
    () => Array(GARDEN_SIZE * GARDEN_SIZE).fill(null)
  );
  const [selectedItem, setSelectedItem] = useState(ITEMS[0]);
  const [raked, setRaked] = useState<Set<number>>(() => new Set());

  const handleCellClick = (i: number) => {
    if (grid[i]) {
      // Remove item
      setGrid((prev) => {
        const next = [...prev];
        next[i] = null;
        return next;
      });
    } else {
      // Place item or rake
      setGrid((prev) => {
        const next = [...prev];
        next[i] = selectedItem;
        return next;
      });
    }
  };

  const toggleRake = (i: number) => {
    setRaked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const clearGarden = () => {
    setGrid(Array(GARDEN_SIZE * GARDEN_SIZE).fill(null));
    setRaked(new Set());
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <h2 className="text-2xl font-bold text-foreground">Zen Garden</h2>
      <p className="text-sm text-muted-foreground">
        Click to place items. Right-click to rake sand. Create your peaceful space.
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        {ITEMS.map((item) => (
          <button
            key={item}
            onClick={() => setSelectedItem(item)}
            className={`flex h-10 w-10 items-center justify-center rounded-lg text-xl transition-all ${
              selectedItem === item
                ? "bg-primary/20 ring-2 ring-primary scale-110"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div
        className="grid gap-1 rounded-2xl border bg-amber-50/50 dark:bg-amber-950/20 p-3"
        style={{ gridTemplateColumns: `repeat(${GARDEN_SIZE}, 1fr)` }}
      >
        {grid.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleCellClick(i)}
            onContextMenu={(e) => {
              e.preventDefault();
              toggleRake(i);
            }}
            className={`flex h-10 w-10 items-center justify-center rounded-md text-lg transition-all hover:bg-amber-100/50 dark:hover:bg-amber-900/20 sm:h-12 sm:w-12 ${
              raked.has(i) && !cell
                ? "bg-amber-100/80 dark:bg-amber-900/30"
                : ""
            }`}
            style={
              raked.has(i) && !cell
                ? {
                    backgroundImage:
                      "repeating-linear-gradient(90deg, transparent, transparent 3px, hsl(var(--muted-foreground) / 0.15) 3px, hsl(var(--muted-foreground) / 0.15) 4px)",
                  }
                : {}
            }
          >
            {cell || ""}
          </button>
        ))}
      </div>

      <button
        onClick={clearGarden}
        className="rounded-lg bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        Clear Garden
      </button>
    </div>
  );
};

export default ZenGardenGame;
