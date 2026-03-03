import { useState } from "react";
import Layout from "@/components/Layout";
import { Sun, RefreshCw } from "lucide-react";

const categories: { label: string; affirmations: string[] }[] = [
  {
    label: "💪 Confidence",
    affirmations: [
      "I am capable of achieving great things.",
      "I believe in my skills and abilities.",
      "I am worthy of success and happiness.",
      "I trust myself to make the right decisions.",
      "Every challenge is an opportunity to grow.",
      "I radiate confidence and positivity.",
    ],
  },
  {
    label: "📚 Academic",
    affirmations: [
      "I am an eager and dedicated learner.",
      "I understand and retain information easily.",
      "My hard work will pay off.",
      "I am prepared and ready for my exams.",
      "I enjoy the process of learning new things.",
      "Every study session brings me closer to my goals.",
    ],
  },
  {
    label: "🧘 Calm",
    affirmations: [
      "I release all tension from my body and mind.",
      "I am at peace with this moment.",
      "I choose calm over worry.",
      "My breath anchors me to the present.",
      "I let go of what I cannot control.",
      "Stillness and peace flow through me.",
    ],
  },
  {
    label: "❤️ Self-Love",
    affirmations: [
      "I am enough, just as I am.",
      "I deserve kindness, especially from myself.",
      "I honor my needs and set healthy boundaries.",
      "I forgive myself and learn from my mistakes.",
      "I am proud of how far I've come.",
      "I treat myself with compassion and patience.",
    ],
  },
];

const Affirmations = () => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [index, setIndex] = useState(0);

  const cat = categories[selectedCategory];
  const affirmation = cat.affirmations[index % cat.affirmations.length];

  const next = () => setIndex((i) => i + 1);

  return (
    <Layout>
      <div className="animate-fade-in space-y-8">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-foreground flex items-center gap-2">
            <Sun className="h-8 w-8 text-primary" /> Positive Affirmations
          </h1>
          <p className="text-muted-foreground">
            Start your day with encouraging words. Pick a category and let positivity flow.
          </p>
        </div>

        {/* Category Picker */}
        <div className="flex flex-wrap gap-2">
          {categories.map((c, i) => (
            <button
              key={c.label}
              onClick={() => { setSelectedCategory(i); setIndex(0); }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === i
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Affirmation Card */}
        <div className="flex flex-col items-center gap-6 rounded-2xl border bg-card p-10 shadow-card text-center">
          <p className="text-2xl font-semibold leading-relaxed text-foreground sm:text-3xl">
            "{affirmation}"
          </p>
          <button
            onClick={next}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-105"
          >
            <RefreshCw className="h-4 w-4" /> Next Affirmation
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Affirmations;
