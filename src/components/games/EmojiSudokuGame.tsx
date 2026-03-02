import { useState } from "react";

const EMOJI_PAIRS = ["🌸", "🌊", "🌙", "🦋", "🌿", "☀️"];

const EmojiSudokuGame = () => {
  const [grid, setGrid] = useState<(string | null)[]>(Array(36).fill(null));
  const [selected, setSelected] = useState(EMOJI_PAIRS[0]);
  const [message, setMessage] = useState("");

  const place = (i: number) => {
    setGrid((prev) => {
      const next = [...prev];
      next[i] = next[i] === selected ? null : selected;
      return next;
    });
    setMessage("");
  };

  const checkRow = (row: number) => {
    const cells = grid.slice(row * 6, row * 6 + 6).filter(Boolean);
    return new Set(cells).size === cells.length;
  };

  const checkCol = (col: number) => {
    const cells = Array.from({ length: 6 }, (_, r) => grid[r * 6 + col]).filter(Boolean);
    return new Set(cells).size === cells.length;
  };

  const validate = () => {
    const filled = grid.filter(Boolean).length;
    if (filled < 36) { setMessage("Fill all cells first!"); return; }
    for (let i = 0; i < 6; i++) {
      if (!checkRow(i) || !checkCol(i)) { setMessage("Some rows/columns have duplicates!"); return; }
    }
    setMessage("🎉 Perfect! No duplicates!");
  };

  return (
    <div className="flex flex-col items-center gap-5 py-4">
      <h2 className="text-2xl font-bold text-foreground">Emoji Sudoku</h2>
      <p className="text-sm text-muted-foreground">Place emojis so each row & column has no repeats.</p>

      <div className="flex gap-2">
        {EMOJI_PAIRS.map((e) => (
          <button key={e} onClick={() => setSelected(e)}
            className={`rounded-lg px-2 py-1 text-xl transition-all ${selected === e ? "bg-primary/15 scale-110 ring-2 ring-primary" : "hover:bg-muted"}`}
          >{e}</button>
        ))}
      </div>

      <div className="grid grid-cols-6 gap-1 rounded-xl border bg-muted/30 p-2">
        {grid.map((cell, i) => (
          <button key={i} onClick={() => place(i)}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-border/30 text-lg transition-all hover:bg-muted sm:h-12 sm:w-12"
          >{cell || ""}</button>
        ))}
      </div>

      {message && <p className="text-sm font-medium text-foreground">{message}</p>}

      <div className="flex gap-3">
        <button onClick={validate} className="rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">Check</button>
        <button onClick={() => { setGrid(Array(36).fill(null)); setMessage(""); }}
          className="rounded-lg bg-muted px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-primary hover:text-primary-foreground">Clear</button>
      </div>
    </div>
  );
};

export default EmojiSudokuGame;
