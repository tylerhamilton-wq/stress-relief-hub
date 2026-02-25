import { useState } from "react";
import Layout from "@/components/Layout";
import { Gamepad2 } from "lucide-react";
import BreathingGame from "@/components/games/BreathingGame";
import MemoryGame from "@/components/games/MemoryGame";
import ColorTapGame from "@/components/games/ColorTapGame";

const games = [
  { id: "breathing", title: "Breathing Exercise", emoji: "🌬️", description: "Follow the circle and calm your mind" },
  { id: "memory", title: "Memory Match", emoji: "🧠", description: "Flip cards and find matching pairs" },
  { id: "colortap", title: "Color Tap", emoji: "🎨", description: "Tap the correct color as fast as you can" },
];

const Games = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  return (
    <Layout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-foreground flex items-center gap-2">
            <Gamepad2 className="h-8 w-8 text-primary" /> Stress Relief Games
          </h1>
          <p className="text-muted-foreground">
            Take a mindful break with these calming mini-games.
          </p>
        </div>

        {!activeGame ? (
          <div className="grid gap-4 sm:grid-cols-3">
            {games.map((game, i) => (
              <button
                key={game.id}
                onClick={() => setActiveGame(game.id)}
                className="group rounded-2xl border bg-card p-6 text-left shadow-card transition-all hover:-translate-y-1 hover:shadow-soft animate-slide-up"
                style={{ animationDelay: `${i * 100}ms`, animationFillMode: "both" }}
              >
                <span className="mb-3 block text-4xl">{game.emoji}</span>
                <h3 className="mb-1 font-semibold text-foreground">{game.title}</h3>
                <p className="text-sm text-muted-foreground">{game.description}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => setActiveGame(null)}
              className="rounded-lg bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              ← Back to Games
            </button>
            <div className="rounded-2xl border bg-card p-6 shadow-card">
              {activeGame === "breathing" && <BreathingGame />}
              {activeGame === "memory" && <MemoryGame />}
              {activeGame === "colortap" && <ColorTapGame />}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Games;
