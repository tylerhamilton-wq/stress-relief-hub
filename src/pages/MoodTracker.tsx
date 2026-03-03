import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { BarChart3, Trash2 } from "lucide-react";

interface MoodEntry {
  id: string;
  mood: string;
  label: string;
  note: string;
  date: string;
}

const MOODS = [
  { emoji: "😄", label: "Great" },
  { emoji: "🙂", label: "Good" },
  { emoji: "😐", label: "Okay" },
  { emoji: "😟", label: "Low" },
  { emoji: "😢", label: "Rough" },
];

const STORAGE_KEY = "mood-tracker-entries";

const MoodTracker = () => {
  const [entries, setEntries] = useState<MoodEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
    catch { return []; }
  });
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const addEntry = () => {
    if (selectedMood === null) return;
    const m = MOODS[selectedMood];
    const entry: MoodEntry = {
      id: Date.now().toString(),
      mood: m.emoji,
      label: m.label,
      note,
      date: new Date().toLocaleString(),
    };
    setEntries((prev) => [entry, ...prev]);
    setSelectedMood(null);
    setNote("");
  };

  const deleteEntry = (id: string) => setEntries((prev) => prev.filter((e) => e.id !== id));

  // Simple streak: count of consecutive days with entries
  const streak = (() => {
    const days = new Set(entries.map((e) => new Date(e.date).toDateString()));
    let count = 0;
    const d = new Date();
    while (days.has(d.toDateString())) { count++; d.setDate(d.getDate() - 1); }
    return count;
  })();

  return (
    <Layout>
      <div className="animate-fade-in space-y-8">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" /> Mood Tracker
          </h1>
          <p className="text-muted-foreground">
            Log how you're feeling each day and spot patterns over time.
          </p>
        </div>

        {/* Streak */}
        {streak > 0 && (
          <div className="rounded-2xl bg-primary/10 p-4 text-center">
            <p className="text-sm font-medium text-primary">
              🔥 {streak}-day logging streak! Keep it up!
            </p>
          </div>
        )}

        {/* Log Mood */}
        <div className="rounded-2xl border bg-card p-6 shadow-card space-y-4">
          <h2 className="font-semibold text-foreground">How are you feeling right now?</h2>
          <div className="flex justify-center gap-3">
            {MOODS.map((m, i) => (
              <button
                key={m.label}
                onClick={() => setSelectedMood(i)}
                className={`flex flex-col items-center gap-1 rounded-xl p-3 transition-all ${
                  selectedMood === i
                    ? "bg-primary/15 ring-2 ring-primary scale-110"
                    : "hover:bg-muted"
                }`}
              >
                <span className="text-3xl">{m.emoji}</span>
                <span className="text-xs text-muted-foreground">{m.label}</span>
              </button>
            ))}
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note (optional)..."
            className="w-full rounded-xl border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            rows={2}
          />
          <button
            onClick={addEntry}
            disabled={selectedMood === null}
            className="w-full rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground transition-colors disabled:opacity-40"
          >
            Log Mood
          </button>
        </div>

        {/* History */}
        {entries.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-semibold text-foreground">Recent Moods</h2>
            {entries.slice(0, 20).map((e) => (
              <div
                key={e.id}
                className="flex items-start gap-3 rounded-xl border bg-card p-4 shadow-card"
              >
                <span className="text-2xl">{e.mood}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{e.label}</p>
                  {e.note && <p className="text-sm text-muted-foreground truncate">{e.note}</p>}
                  <p className="text-xs text-muted-foreground mt-1">{e.date}</p>
                </div>
                <button onClick={() => deleteEntry(e.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MoodTracker;
