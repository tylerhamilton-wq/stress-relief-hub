import { useState } from "react";

const PROMPTS = [
  "Draw how you're feeling right now",
  "Sketch your happy place",
  "Draw something that makes you smile",
  "Create a pattern that feels calming",
  "Draw your favorite weather",
  "Sketch a gift for someone you love",
  "Draw what peace looks like to you",
  "Create an abstract emotion",
];

const DoodlePromptGame = () => {
  const [prompt, setPrompt] = useState(PROMPTS[0]);
  const [grid, setGrid] = useState<(string | null)[]>(Array(256).fill(null));
  const [color, setColor] = useState("hsl(var(--primary))");
  const [isDrawing, setIsDrawing] = useState(false);

  const COLORS = [
    "hsl(var(--primary))",
    "hsl(152, 35%, 45%)",
    "hsl(28, 60%, 65%)",
    "hsl(200, 60%, 55%)",
    "hsl(340, 50%, 60%)",
    "hsl(45, 70%, 55%)",
    "hsl(0, 0%, 20%)",
  ];

  const newPrompt = () => {
    setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
    setGrid(Array(256).fill(null));
  };

  const paint = (i: number) => {
    setGrid((prev) => { const n = [...prev]; n[i] = color; return n; });
  };

  return (
    <div className="flex flex-col items-center gap-5 py-4">
      <h2 className="text-2xl font-bold text-foreground">Doodle Prompt</h2>
      <div className="rounded-xl bg-primary/10 px-5 py-3 text-center">
        <p className="text-sm font-medium text-foreground">✏️ {prompt}</p>
      </div>

      <div className="flex gap-2">
        {COLORS.map((c) => (
          <button key={c} onClick={() => setColor(c)}
            className={`h-7 w-7 rounded-full border-2 transition-all ${color === c ? "border-foreground scale-110" : "border-transparent"}`}
            style={{ backgroundColor: c }} />
        ))}
      </div>

      <div className="grid grid-cols-16 gap-0 rounded-xl border bg-card p-1"
        style={{ gridTemplateColumns: "repeat(16, 1fr)" }}
        onMouseLeave={() => setIsDrawing(false)}>
        {grid.map((cell, i) => (
          <button key={i}
            onMouseDown={() => { setIsDrawing(true); paint(i); }}
            onMouseEnter={() => isDrawing && paint(i)}
            onMouseUp={() => setIsDrawing(false)}
            onTouchStart={() => paint(i)}
            className="h-4 w-4 sm:h-5 sm:w-5 border border-border/10"
            style={{ backgroundColor: cell || "transparent" }} />
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={newPrompt} className="rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">New Prompt</button>
        <button onClick={() => setGrid(Array(256).fill(null))}
          className="rounded-lg bg-muted px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-primary hover:text-primary-foreground">Clear</button>
      </div>
    </div>
  );
};

export default DoodlePromptGame;
