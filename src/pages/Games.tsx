import { useState } from "react";
import Layout from "@/components/Layout";
import { Gamepad2 } from "lucide-react";
import BreathingGame from "@/components/games/BreathingGame";
import MemoryGame from "@/components/games/MemoryGame";
import ColorTapGame from "@/components/games/ColorTapGame";
import WordScrambleGame from "@/components/games/WordScrambleGame";
import ReactionTimeGame from "@/components/games/ReactionTimeGame";
import PatternRepeatGame from "@/components/games/PatternRepeatGame";
import ZenGardenGame from "@/components/games/ZenGardenGame";
import GratitudeJarGame from "@/components/games/GratitudeJarGame";
import BubblePopGame from "@/components/games/BubblePopGame";
import MindfulColoringGame from "@/components/games/MindfulColoringGame";
import NumberZenGame from "@/components/games/NumberZenGame";
import AffirmationFlipGame from "@/components/games/AffirmationFlipGame";
import FocusFlowGame from "@/components/games/FocusFlowGame";
import EmojiSudokuGame from "@/components/games/EmojiSudokuGame";
import TypingZenGame from "@/components/games/TypingZenGame";
import MindMapGame from "@/components/games/MindMapGame";
import CalmCatcherGame from "@/components/games/CalmCatcherGame";
import DoodlePromptGame from "@/components/games/DoodlePromptGame";

const games = [
  { id: "breathing", title: "Breathing Exercise", emoji: "🌬️", description: "Follow the circle and calm your mind" },
  { id: "memory", title: "Memory Match", emoji: "🧠", description: "Flip cards and find matching pairs" },
  { id: "colortap", title: "Color Tap", emoji: "🎨", description: "Tap the correct color as fast as you can" },
  { id: "wordscramble", title: "Word Scramble", emoji: "🔤", description: "Unscramble calming words" },
  { id: "reaction", title: "Reaction Time", emoji: "⚡", description: "Test your reflexes and focus" },
  { id: "pattern", title: "Pattern Repeat", emoji: "🔁", description: "Remember and repeat the sequence" },
  { id: "zen", title: "Zen Garden", emoji: "🪨", description: "Create your own peaceful space" },
  { id: "gratitude", title: "Gratitude Jar", emoji: "🫙", description: "Collect things you're thankful for" },
  { id: "bubblepop", title: "Bubble Pop", emoji: "🫧", description: "Pop rising bubbles for stress relief" },
  { id: "coloring", title: "Mindful Coloring", emoji: "🖌️", description: "Paint a grid and let creativity flow" },
  { id: "numberzen", title: "Number Zen", emoji: "🔢", description: "Find numbers that add to the target" },
  { id: "affirmation", title: "Affirmation Cards", emoji: "💛", description: "Flip cards for positive affirmations" },
  { id: "focusflow", title: "Focus Flow", emoji: "🎯", description: "Keep the dot in the zone" },
  { id: "emojisudoku", title: "Emoji Sudoku", emoji: "🧩", description: "Place emojis with no row/column repeats" },
  { id: "typingzen", title: "Typing Zen", emoji: "⌨️", description: "Type calming words as fast as you can" },
  { id: "mindmap", title: "Mind Map", emoji: "🗺️", description: "Brainstorm words across categories" },
  { id: "calmcatcher", title: "Calm Catcher", emoji: "🧺", description: "Catch good items, dodge the bad" },
  { id: "doodle", title: "Doodle Prompt", emoji: "✏️", description: "Draw creative prompts on a pixel grid" },
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {games.map((game, i) => (
              <button
                key={game.id}
                onClick={() => setActiveGame(game.id)}
                className="group rounded-2xl border bg-card p-6 text-left shadow-card transition-all hover:-translate-y-1 hover:shadow-soft animate-slide-up"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
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
              {activeGame === "wordscramble" && <WordScrambleGame />}
              {activeGame === "reaction" && <ReactionTimeGame />}
              {activeGame === "pattern" && <PatternRepeatGame />}
              {activeGame === "zen" && <ZenGardenGame />}
              {activeGame === "gratitude" && <GratitudeJarGame />}
              {activeGame === "bubblepop" && <BubblePopGame />}
              {activeGame === "coloring" && <MindfulColoringGame />}
              {activeGame === "numberzen" && <NumberZenGame />}
              {activeGame === "affirmation" && <AffirmationFlipGame />}
              {activeGame === "focusflow" && <FocusFlowGame />}
              {activeGame === "emojisudoku" && <EmojiSudokuGame />}
              {activeGame === "typingzen" && <TypingZenGame />}
              {activeGame === "mindmap" && <MindMapGame />}
              {activeGame === "calmcatcher" && <CalmCatcherGame />}
              {activeGame === "doodle" && <DoodlePromptGame />}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Games;
