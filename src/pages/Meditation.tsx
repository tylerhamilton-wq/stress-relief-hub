import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Play, Pause, RotateCcw, ChevronRight, ArrowLeft, Timer } from "lucide-react";

interface MeditationStep {
  instruction: string;
  duration: number; // seconds
}

interface MeditationType {
  name: string;
  emoji: string;
  description: string;
  color: string;
  steps: MeditationStep[];
}

const meditations: MeditationType[] = [
  {
    name: "Body Scan",
    emoji: "🧘",
    description: "Gradually bring awareness to each part of your body, releasing tension as you go.",
    color: "gradient-calm",
    steps: [
      { instruction: "Close your eyes and take three deep breaths.", duration: 15 },
      { instruction: "Bring your attention to the top of your head. Notice any sensations.", duration: 20 },
      { instruction: "Slowly move your awareness down to your forehead and eyes. Relax them.", duration: 20 },
      { instruction: "Notice your jaw and mouth. Let go of any tension.", duration: 15 },
      { instruction: "Bring awareness to your neck and shoulders. Let them soften.", duration: 20 },
      { instruction: "Feel your arms and hands. Notice any tingling or warmth.", duration: 20 },
      { instruction: "Move your attention to your chest. Feel it rise and fall.", duration: 20 },
      { instruction: "Bring awareness to your stomach. Let it be soft and relaxed.", duration: 15 },
      { instruction: "Notice your hips, legs, and feet. Feel them grounded.", duration: 20 },
      { instruction: "Take a moment to feel your whole body at once. Breathe deeply.", duration: 20 },
    ],
  },
  {
    name: "Loving-Kindness",
    emoji: "💛",
    description: "Cultivate feelings of warmth and goodwill toward yourself and others.",
    color: "gradient-warm",
    steps: [
      { instruction: "Sit comfortably and close your eyes. Take a few calming breaths.", duration: 15 },
      { instruction: 'Think of yourself. Silently say: "May I be happy. May I be healthy."', duration: 25 },
      { instruction: 'Continue: "May I be safe. May I live with ease."', duration: 25 },
      { instruction: "Now think of someone you love. Send them the same wishes.", duration: 25 },
      { instruction: "Think of a neutral person — someone you neither like nor dislike. Send them kindness.", duration: 25 },
      { instruction: "Think of someone difficult. Try to send them compassion too.", duration: 25 },
      { instruction: 'Expand to all beings: "May all beings be happy and free from suffering."', duration: 25 },
      { instruction: "Rest in the feeling of warmth and openness you've created.", duration: 20 },
    ],
  },
  {
    name: "Focused Breathing",
    emoji: "🌬️",
    description: "Anchor your mind by paying close attention to each breath.",
    color: "gradient-calm",
    steps: [
      { instruction: "Find a comfortable position. Close your eyes gently.", duration: 10 },
      { instruction: "Breathe in slowly through your nose for 4 counts.", duration: 15 },
      { instruction: "Hold your breath gently for 4 counts.", duration: 15 },
      { instruction: "Exhale slowly through your mouth for 6 counts.", duration: 15 },
      { instruction: "Repeat this cycle. Focus only on the sensation of breathing.", duration: 30 },
      { instruction: "If your mind wanders, gently bring it back to your breath.", duration: 30 },
      { instruction: "Notice how your body feels with each exhale — more relaxed, more grounded.", duration: 25 },
      { instruction: "Take one final deep breath and slowly open your eyes.", duration: 15 },
    ],
  },
  {
    name: "Visualization",
    emoji: "🏔️",
    description: "Use your imagination to visit a peaceful, calming place in your mind.",
    color: "gradient-warm",
    steps: [
      { instruction: "Close your eyes and take three slow, deep breaths.", duration: 15 },
      { instruction: "Imagine a peaceful place — a beach, forest, or mountain meadow.", duration: 20 },
      { instruction: "Look around in your mind. What do you see? Notice the colors and shapes.", duration: 25 },
      { instruction: "What sounds do you hear? Waves, birdsong, wind through the trees?", duration: 25 },
      { instruction: "Feel the temperature on your skin. Is it warm sunlight or cool breeze?", duration: 20 },
      { instruction: "Notice any scents — fresh air, flowers, salt water.", duration: 20 },
      { instruction: "Find a comfortable spot in this place and sit down. Feel safe and at peace.", duration: 25 },
      { instruction: "Take a deep breath in your peaceful place, then slowly return to the room.", duration: 15 },
    ],
  },
  {
    name: "Mindful Listening",
    emoji: "🎧",
    description: "Tune into the sounds around you with full, non-judgmental attention.",
    color: "gradient-calm",
    steps: [
      { instruction: "Sit quietly and close your eyes. Take a few deep breaths.", duration: 15 },
      { instruction: "Begin to notice all the sounds around you — near and far.", duration: 25 },
      { instruction: "Pick one sound and focus on it completely. What qualities does it have?", duration: 25 },
      { instruction: "Now let that sound go and notice a different one.", duration: 25 },
      { instruction: "Try to hear sounds you usually ignore — the hum of a room, distant traffic.", duration: 25 },
      { instruction: "Listen without labeling the sounds as good or bad. Just notice them.", duration: 25 },
      { instruction: "Expand your awareness to hear all sounds at once, like an orchestra.", duration: 20 },
      { instruction: "Gently bring your attention back to your breath. Open your eyes.", duration: 15 },
    ],
  },
  {
    name: "Gratitude Meditation",
    emoji: "🙏",
    description: "Reflect on things you're grateful for to shift your mindset toward positivity.",
    color: "gradient-warm",
    steps: [
      { instruction: "Sit comfortably and close your eyes. Breathe naturally.", duration: 15 },
      { instruction: "Think of one small thing you're grateful for today. Hold it in your mind.", duration: 25 },
      { instruction: "Feel the warmth of gratitude in your chest. Let it grow.", duration: 20 },
      { instruction: "Think of a person you're grateful for. Picture their face.", duration: 25 },
      { instruction: "Silently thank them for what they bring to your life.", duration: 20 },
      { instruction: "Think of something about yourself you appreciate. A skill, a quality.", duration: 25 },
      { instruction: "Let all three gratitudes fill your awareness at once.", duration: 20 },
      { instruction: "Carry this feeling of gratitude with you. Slowly open your eyes.", duration: 15 },
    ],
  },
];

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

const Meditation = () => {
  const [active, setActive] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const current = active !== null ? meditations[active] : null;

  useEffect(() => {
    if (!playing || !current) return;
    if (timeLeft <= 0) {
      if (step < current.steps.length - 1) {
        setStep((s) => s + 1);
        setTimeLeft(current.steps[step + 1].duration);
      } else {
        setPlaying(false);
      }
      return;
    }
    const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [playing, timeLeft, step, current]);

  const startMeditation = (index: number) => {
    setActive(index);
    setStep(0);
    setPlaying(false);
    setTimeLeft(meditations[index].steps[0].duration);
  };

  const handlePlay = () => {
    if (!current) return;
    if (!playing && timeLeft === 0) {
      setTimeLeft(current.steps[step].duration);
    }
    setPlaying(!playing);
  };

  const handleReset = () => {
    if (!current) return;
    setStep(0);
    setPlaying(false);
    setTimeLeft(current.steps[0].duration);
  };

  const totalDuration = (m: MeditationType) =>
    m.steps.reduce((sum, s) => sum + s.duration, 0);

  if (current && active !== null) {
    const progress = ((step + 1) / current.steps.length) * 100;
    const isFinished = !playing && step === current.steps.length - 1 && timeLeft === 0;

    return (
      <Layout>
        <div className="animate-fade-in space-y-6">
          <button
            onClick={() => { setActive(null); setPlaying(false); }}
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to meditations
          </button>

          <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-card">
            <div className="mb-6 flex items-center gap-3">
              <span className="text-4xl">{current.emoji}</span>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{current.name}</h1>
                <p className="text-sm text-muted-foreground">{current.description}</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Current step */}
            <div className="mb-6 rounded-xl bg-muted/50 p-6 text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                Step {step + 1} of {current.steps.length}
              </p>
              <p className="text-lg font-medium text-foreground leading-relaxed">
                {current.steps[step].instruction}
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 text-2xl font-bold text-primary">
                <Timer className="h-5 w-5" />
                {formatTime(timeLeft)}
              </div>
            </div>

            {isFinished && (
              <div className="mb-6 rounded-xl bg-primary/10 p-4 text-center">
                <p className="text-lg font-semibold text-primary">✨ Session complete! Well done.</p>
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleReset}
                className="rounded-xl border bg-card px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <RotateCcw className="inline h-4 w-4 mr-1" /> Reset
              </button>
              <button
                onClick={handlePlay}
                disabled={isFinished}
                className="rounded-xl gradient-calm px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {playing ? <><Pause className="inline h-4 w-4 mr-1" /> Pause</> : <><Play className="inline h-4 w-4 mr-1" /> {timeLeft === 0 && step === 0 ? "Start" : "Resume"}</>}
              </button>
              {!isFinished && (
                <button
                  onClick={() => {
                    if (step < current.steps.length - 1) {
                      const next = step + 1;
                      setStep(next);
                      setTimeLeft(current.steps[next].duration);
                    }
                  }}
                  disabled={step >= current.steps.length - 1}
                  className="rounded-xl border bg-card px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50"
                >
                  Skip <ChevronRight className="inline h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="animate-fade-in space-y-8">
        <div className="text-center">
          <h1 className="mb-2 text-3xl font-bold text-foreground">🧘 Guided Meditations</h1>
          <p className="text-muted-foreground">Choose a meditation style and follow along step by step.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {meditations.map((m, i) => (
            <button
              key={m.name}
              onClick={() => startMeditation(i)}
              className="group rounded-2xl border bg-card p-5 text-left shadow-card transition-all hover:-translate-y-1 hover:shadow-soft"
            >
              <div className={`mb-3 inline-flex rounded-xl ${m.color} p-3`}>
                <span className="text-2xl">{m.emoji}</span>
              </div>
              <h2 className="mb-1 text-lg font-semibold text-foreground">{m.name}</h2>
              <p className="mb-3 text-sm text-muted-foreground">{m.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {m.steps.length} steps · {formatTime(totalDuration(m))}
                </span>
                <span className="text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Begin →
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Meditation;
