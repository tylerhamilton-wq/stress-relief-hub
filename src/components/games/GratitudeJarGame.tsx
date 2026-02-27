import { useState } from "react";

const COLORS = [
  "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300",
  "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
  "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
  "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
  "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
  "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
];

interface Note {
  id: string;
  text: string;
  color: string;
  rotation: number;
}

const GratitudeJarGame = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState("");
  const [randomNote, setRandomNote] = useState<Note | null>(null);

  const addNote = () => {
    if (!input.trim()) return;
    const note: Note = {
      id: crypto.randomUUID(),
      text: input.trim(),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 10 - 5,
    };
    setNotes((prev) => [...prev, note]);
    setInput("");
  };

  const pickRandom = () => {
    if (notes.length === 0) return;
    setRandomNote(notes[Math.floor(Math.random() * notes.length)]);
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <h2 className="text-2xl font-bold text-foreground">Gratitude Jar</h2>
      <p className="text-sm text-muted-foreground">
        Write things you're grateful for. Pick one when you need a boost.
      </p>

      <div className="flex w-full max-w-sm gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addNote()}
          placeholder="I'm grateful for..."
          className="flex-1 rounded-xl border border-border bg-card px-4 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
        />
        <button
          onClick={addNote}
          disabled={!input.trim()}
          className="rounded-xl gradient-calm px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          Add
        </button>
      </div>

      {randomNote && (
        <div
          className={`rounded-xl px-6 py-4 text-center text-sm font-medium shadow-card animate-scale-in ${randomNote.color}`}
          style={{ transform: `rotate(${randomNote.rotation}deg)` }}
        >
          ✨ {randomNote.text}
        </div>
      )}

      {notes.length > 0 && (
        <button
          onClick={pickRandom}
          className="rounded-xl gradient-warm px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          🎲 Pick a Random Note
        </button>
      )}

      <div className="relative min-h-[120px] w-full max-w-sm">
        <div className="flex flex-wrap justify-center gap-2">
          {notes.map((note) => (
            <span
              key={note.id}
              className={`inline-block rounded-lg px-3 py-1.5 text-xs font-medium shadow-sm ${note.color}`}
              style={{ transform: `rotate(${note.rotation}deg)` }}
            >
              {note.text}
            </span>
          ))}
        </div>
        {notes.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            Your jar is empty. Add something you're grateful for! 🫙
          </p>
        )}
      </div>

      <span className="text-xs text-muted-foreground">
        {notes.length} note{notes.length !== 1 ? "s" : ""} in your jar
      </span>
    </div>
  );
};

export default GratitudeJarGame;
