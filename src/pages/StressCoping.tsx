import Layout from "@/components/Layout";
import { Heart, Brain, Moon, Users, Dumbbell, Music, BookOpen, Leaf, Coffee, Smile } from "lucide-react";

const tips = [
  {
    icon: Brain,
    title: "Practice Deep Breathing",
    description: "Try the 4-7-8 technique: inhale for 4 seconds, hold for 7, exhale for 8. This activates your body's relaxation response.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Dumbbell,
    title: "Move Your Body",
    description: "Even a 10-minute walk can boost endorphins and clear your mind. Regular exercise is one of the most effective stress relievers.",
    color: "bg-accent/20 text-accent-foreground",
  },
  {
    icon: Moon,
    title: "Prioritize Sleep",
    description: "Aim for 7-9 hours. Create a bedtime routine: no screens 30 min before bed, keep your room cool and dark.",
    color: "bg-secondary text-secondary-foreground",
  },
  {
    icon: Users,
    title: "Talk to Someone",
    description: "Don't bottle it up. Reach out to friends, family, or your campus counseling center. Connection is a powerful stress buffer.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: BookOpen,
    title: "Break Tasks into Chunks",
    description: "Large assignments feel overwhelming. Break them into small, manageable steps and tackle them one at a time.",
    color: "bg-accent/20 text-accent-foreground",
  },
  {
    icon: Music,
    title: "Listen to Calming Music",
    description: "Create a playlist of nature sounds, lo-fi beats, or classical music. Music can lower cortisol and ease anxiety.",
    color: "bg-secondary text-secondary-foreground",
  },
  {
    icon: Leaf,
    title: "Spend Time in Nature",
    description: "Even sitting near a window with sunlight helps. Nature exposure reduces stress hormones and improves mood.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Coffee,
    title: "Limit Caffeine",
    description: "Too much coffee can increase anxiety and disrupt sleep. Try switching to herbal tea in the afternoon.",
    color: "bg-accent/20 text-accent-foreground",
  },
  {
    icon: Smile,
    title: "Practice Gratitude",
    description: "Write down 3 things you're grateful for each day. This simple habit can shift your mindset from stress to appreciation.",
    color: "bg-secondary text-secondary-foreground",
  },
  {
    icon: Heart,
    title: "Be Kind to Yourself",
    description: "You're doing your best. Replace self-criticism with self-compassion. Treat yourself like you'd treat a good friend.",
    color: "bg-primary/10 text-primary",
  },
];

const StressCoping = () => {
  return (
    <Layout>
      <div className="animate-fade-in space-y-8">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-foreground flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" /> Coping with Stress
          </h1>
          <p className="text-muted-foreground">
            Evidence-based strategies to help you manage stress and thrive as a student.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {tips.map((tip, i) => (
            <div
              key={tip.title}
              className="group rounded-2xl border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-soft animate-slide-up"
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
            >
              <div className="flex gap-4">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tip.color}`}>
                  <tip.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-foreground">{tip.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{tip.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl gradient-hero p-6 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            💚 Remember: It's okay to not be okay. If you're struggling, reach out to your campus counseling services.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default StressCoping;
