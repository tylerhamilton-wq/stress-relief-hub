import { useState } from "react";

const CATEGORIES = ["Animals 🐾", "Foods 🍎", "Nature 🌿", "Colors 🎨", "Feelings 💭"];

const MindMapGame = () => {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [words, setWords] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(CATEGORIES.map((c) => [c, []]))
  );
  const [input, setInput] = useState("");

  const addWord = () => {
    if (!input.trim()) return;
    setWords((prev) => ({
      ...prev,
      [category]: [...prev[category], input.trim()],
    }));
    setInput("");
  };

  const total = Object.values(words).reduce((a, b) => a + b.length, 0);

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <h2 className="text-2xl font-bold text-foreground">Mind Map</h2>
      <p className="text-sm text-muted-foreground">Pick a category and brainstorm as many words as you can.</p>

      <div className="flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
              category === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >{cat} ({words[cat].length})</button>
        ))}
      </div>

      <div className="flex w-full max-w-sm gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addWord()}
          placeholder={`Add a word for ${category}...`}
          className="flex-1 rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
        />
        <button onClick={addWord} disabled={!input.trim()}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50">Add</button>
      </div>

      {words[category].length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 max-w-sm">
          {words[category].map((w, i) => (
            <span key={i} className="inline-block rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-foreground">{w}</span>
          ))}
        </div>
      )}

      <span className="text-xs text-muted-foreground">{total} total words across all categories</span>
    </div>
  );
};

export default MindMapGame;
