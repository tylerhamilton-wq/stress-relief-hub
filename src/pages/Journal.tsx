import { useState } from "react";
import Layout from "@/components/Layout";
import { BookOpen, Plus, Trash2 } from "lucide-react";

interface JournalEntry {
  id: string;
  text: string;
  date: string;
  mood: string;
}

const MOODS = ["😊", "😌", "😔", "😤", "😰", "🥰", "😴", "💪"];

const Journal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem("journal-entries");
    return saved ? JSON.parse(saved) : [];
  });
  const [draft, setDraft] = useState("");
  const [selectedMood, setSelectedMood] = useState(MOODS[0]);

  const save = (updated: JournalEntry[]) => {
    setEntries(updated);
    localStorage.setItem("journal-entries", JSON.stringify(updated));
  };

  const addEntry = () => {
    if (!draft.trim()) return;
    const entry: JournalEntry = {
      id: crypto.randomUUID(),
      text: draft.trim(),
      date: new Date().toLocaleString(),
      mood: selectedMood,
    };
    save([entry, ...entries]);
    setDraft("");
  };

  const deleteEntry = (id: string) => {
    save(entries.filter((e) => e.id !== id));
  };

  return (
    <Layout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" /> My Journal
          </h1>
          <p className="text-muted-foreground">
            Write down your thoughts, feelings, and reflections. Your entries are saved locally.
          </p>
        </div>

        {/* New Entry */}
        <div className="rounded-2xl border bg-card p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">How are you feeling?</span>
            <div className="flex gap-1">
              {MOODS.map((mood) => (
                <button
                  key={mood}
                  onClick={() => setSelectedMood(mood)}
                  className={`rounded-lg px-2 py-1 text-xl transition-all ${
                    selectedMood === mood
                      ? "bg-primary/15 scale-110 ring-2 ring-primary"
                      : "hover:bg-muted"
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="What's on your mind today?"
            rows={4}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary resize-none"
          />
          <button
            onClick={addEntry}
            disabled={!draft.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> Save Entry
          </button>
        </div>

        {/* Entries */}
        {entries.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            Your journal is empty. Start writing! ✍️
          </p>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="group rounded-2xl border bg-card p-5 shadow-card transition-all hover:shadow-soft"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{entry.mood}</span>
                      <span className="text-xs text-muted-foreground">{entry.date}</span>
                    </div>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{entry.text}</p>
                  </div>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="rounded-lg p-2 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Journal;
