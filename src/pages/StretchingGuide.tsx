import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Activity, Play, RotateCcw, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const stretches = [
  {
    name: "Neck Roll",
    emoji: "🧘",
    duration: 15,
    steps: [
      "Sit up tall and relax your shoulders.",
      "Slowly drop your chin to your chest.",
      "Roll your head gently to the right, ear toward shoulder.",
      "Continue rolling back, then to the left.",
      "Complete 3 slow circles in each direction.",
    ],
  },
  {
    name: "Shoulder Shrug & Release",
    emoji: "💆",
    duration: 10,
    steps: [
      "Inhale deeply and raise both shoulders up to your ears.",
      "Hold them tight for 3 seconds — feel the tension.",
      "Exhale and let your shoulders drop completely.",
      "Feel the tension melt away as you release.",
      "Repeat 3 more times, slower each time.",
    ],
  },
  {
    name: "Seated Spinal Twist",
    emoji: "🔄",
    duration: 20,
    steps: [
      "Sit tall in your chair with feet flat on the floor.",
      "Place your right hand on your left knee.",
      "Gently twist your upper body to the left.",
      "Look over your left shoulder and hold for 10 seconds.",
      "Breathe deeply, then slowly return and switch sides.",
    ],
  },
  {
    name: "Wrist & Finger Stretch",
    emoji: "🖐️",
    duration: 15,
    steps: [
      "Extend your right arm forward, palm facing up.",
      "With your left hand, gently pull your fingers down.",
      "Hold for 10 seconds — feel the stretch in your forearm.",
      "Now flip your palm down and pull fingers toward you.",
      "Switch hands and repeat. Great for typing fatigue!",
    ],
  },
  {
    name: "Standing Forward Fold",
    emoji: "🙆",
    duration: 20,
    steps: [
      "Stand up and place your feet hip-width apart.",
      "Take a deep breath in and raise your arms overhead.",
      "Exhale slowly and fold forward from your hips.",
      "Let your head and arms hang heavy — don't force it.",
      "Hold for 15 seconds, breathing deeply. Slowly roll back up.",
    ],
  },
  {
    name: "Chest Opener",
    emoji: "🌅",
    duration: 15,
    steps: [
      "Stand or sit tall. Clasp your hands behind your back.",
      "Straighten your arms and gently lift them away from you.",
      "Open your chest wide and squeeze your shoulder blades.",
      "Look up slightly and take 3 deep breaths.",
      "Release slowly. Feel the openness in your chest and shoulders.",
    ],
  },
];

const StretchingGuide = () => {
  const [activeStretch, setActiveStretch] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(0);

  const stretch = activeStretch !== null ? stretches[activeStretch] : null;

  // Auto-advance steps
  useEffect(() => {
    if (!isPlaying || !stretch) return;
    const stepDuration = (stretch.duration / stretch.steps.length) * 1000;
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= stretch.steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, stepDuration);
    return () => clearInterval(interval);
  }, [isPlaying, stretch]);

  // Timer countdown
  useEffect(() => {
    if (!isPlaying || !stretch) return;
    setTimer(stretch.duration);
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, stretch]);

  const startStretch = (index: number) => {
    setActiveStretch(index);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handlePlay = () => {
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    if (stretch) setTimer(stretch.duration);
  };

  return (
    <Layout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-foreground flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" /> Stretching Guide
          </h1>
          <p className="text-muted-foreground">
            Follow along with guided stretches to release tension and reduce stress.
          </p>
        </div>

        {activeStretch === null ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stretches.map((s, i) => (
              <button
                key={s.name}
                onClick={() => startStretch(i)}
                className="group rounded-2xl border bg-card p-5 text-left shadow-card transition-all hover:-translate-y-1 hover:shadow-soft animate-slide-up"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
              >
                <span className="mb-2 block text-3xl">{s.emoji}</span>
                <h3 className="mb-1 font-semibold text-foreground">{s.name}</h3>
                <p className="text-xs text-muted-foreground">{s.duration} seconds • {s.steps.length} steps</p>
              </button>
            ))}
          </div>
        ) : stretch ? (
          <div className="space-y-6">
            <button
              onClick={() => { setActiveStretch(null); setIsPlaying(false); }}
              className="rounded-lg bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              ← Back to Stretches
            </button>

            <div className="rounded-2xl border bg-card p-6 shadow-card sm:p-8">
              {/* Header */}
              <div className="mb-8 text-center">
                <span className="mb-2 block text-5xl">{stretch.emoji}</span>
                <h2 className="text-2xl font-bold text-foreground">{stretch.name}</h2>
                {isPlaying && (
                  <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse-soft" />
                    {timer}s remaining
                  </div>
                )}
              </div>

              {/* Steps */}
              <div className="mx-auto max-w-lg space-y-3">
                {stretch.steps.map((step, i) => {
                  const isActive = i === currentStep;
                  const isPast = i < currentStep;
                  const isFuture = i > currentStep;

                  return (
                    <div
                      key={i}
                      className={cn(
                        "flex items-start gap-4 rounded-xl border-2 p-4 transition-all duration-500",
                        isActive && "border-primary bg-primary/5 scale-[1.02] shadow-soft",
                        isPast && "border-primary/30 bg-primary/5 opacity-60",
                        isFuture && "border-transparent bg-muted/50 opacity-40"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors",
                          isActive && "gradient-calm text-primary-foreground",
                          isPast && "bg-primary/20 text-primary",
                          isFuture && "bg-muted text-muted-foreground"
                        )}
                      >
                        {isPast ? "✓" : i + 1}
                      </div>
                      <p
                        className={cn(
                          "pt-1 text-sm leading-relaxed transition-colors duration-500",
                          isActive && "text-foreground font-medium",
                          isPast && "text-muted-foreground",
                          isFuture && "text-muted-foreground"
                        )}
                      >
                        {step}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Controls */}
              <div className="mt-8 flex items-center justify-center gap-3">
                {!isPlaying ? (
                  <button
                    onClick={handlePlay}
                    className="flex items-center gap-2 rounded-xl gradient-calm px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    <Play className="h-4 w-4" />
                    {currentStep > 0 ? "Restart" : "Begin Stretch"}
                  </button>
                ) : (
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 rounded-xl bg-muted px-6 py-3 font-medium text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    <RotateCcw className="h-4 w-4" /> Reset
                  </button>
                )}
                {!isPlaying && activeStretch < stretches.length - 1 && currentStep >= stretch.steps.length - 1 && (
                  <button
                    onClick={() => startStretch(activeStretch + 1)}
                    className="flex items-center gap-2 rounded-xl gradient-warm px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Next Stretch <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Layout>
  );
};

export default StretchingGuide;
