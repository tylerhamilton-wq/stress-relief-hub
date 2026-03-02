import { useState } from "react";

const PALETTE = [
  "hsl(var(--primary))",
  "hsl(152, 35%, 45%)",
  "hsl(28, 60%, 65%)",
  "hsl(200, 60%, 55%)",
  "hsl(270, 40%, 65%)",
  "hsl(340, 50%, 60%)",
  "hsl(45, 70%, 55%)",
  "hsl(180, 40%, 50%)",
];

const GRID = 8;

const MindfulColoringGame = () => {
  const [grid, setGrid] = useState<(string | null)[]>(
    Array(GRID * GRID).fill(null)
  );
  const [selectedColor, setSelectedColor] = useState(PALETTE[0]);
  const [isDrawing, setIsDrawing] = useState(false);

  const paint = (i: number) => {
    setGrid((prev) => {
      const next = [...prev];
      next[i] = selectedColor;
      return next;
    });
  };

  const clearGrid = () => setGrid(Array(GRID * GRID).fill(null));

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <h2 className="text-2xl font-bold text-foreground">Mindful Coloring</h2>
      <p className="text-sm text-muted-foreground">
        Pick a color and paint the grid. Let your creativity flow.
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        {PALETTE.map((color) => (
          <button
            key={color}
            onClick={() => setSelectedColor(color)}
            className={`h-8 w-8 rounded-full border-2 transition-all ${
              selectedColor === color
                ? "border-foreground scale-110"
                : "border-transparent hover:scale-105"
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <div
        className="grid gap-0.5 rounded-xl border bg-muted/30 p-2"
        style={{ gridTemplateColumns: `repeat(${GRID}, 1fr)` }}
        onMouseLeave={() => setIsDrawing(false)}
      >
        {grid.map((cell, i) => (
          <button
            key={i}
            onMouseDown={() => {
              setIsDrawing(true);
              paint(i);
            }}
            onMouseEnter={() => isDrawing && paint(i)}
            onMouseUp={() => setIsDrawing(false)}
            onTouchStart={() => paint(i)}
            className="h-7 w-7 rounded-sm border border-border/30 transition-colors sm:h-8 sm:w-8"
            style={{ backgroundColor: cell || "transparent" }}
          />
        ))}
      </div>

      <button
        onClick={clearGrid}
        className="rounded-lg bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        Clear Canvas
      </button>
    </div>
  );
};

export default MindfulColoringGame;
