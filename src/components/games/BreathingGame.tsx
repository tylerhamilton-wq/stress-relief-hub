import { useState, useEffect } from "react";

const phases = [
  { label: "Breathe In", duration: 4000 },
  { label: "Hold", duration: 7000 },
  { label: "Breathe Out", duration: 8000 },
];

const BreathingGame = () => {
  const [phase, setPhase] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    const timer = setTimeout(() => {
      const next = (phase + 1) % phases.length;
      setPhase(next);
      if (next === 0) setCycles((c) => c + 1);
    }, phases[phase].duration);
    return () => clearTimeout(timer);
  }, [phase, isActive]);

  const currentPhase = phases[phase];
  const scale = phase === 0 ? "scale-[1.3]" : phase === 1 ? "scale-[1.3]" : "scale-100";

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <h2 className="text-2xl font-bold text-foreground">4-7-8 Breathing</h2>

      <div className="relative flex h-56 w-56 items-center justify-center">
        <div
          className={`absolute inset-0 rounded-full gradient-calm opacity-20 transition-transform ${
            isActive ? "duration-[4000ms]" : ""
          } ease-in-out ${isActive ? scale : "scale-100"}`}
        />
        <div
          className={`absolute inset-4 rounded-full gradient-calm opacity-40 transition-transform ${
            isActive ? "duration-[4000ms]" : ""
          } ease-in-out ${isActive ? scale : "scale-100"}`}
        />
        <div
          className={`relative flex h-32 w-32 items-center justify-center rounded-full gradient-calm transition-transform ${
            isActive ? "duration-[4000ms]" : ""
          } ease-in-out ${isActive ? scale : "scale-100"}`}
        >
          <span className="text-center text-sm font-semibold text-primary-foreground">
            {isActive ? currentPhase.label : "Ready?"}
          </span>
        </div>
      </div>

      {isActive && (
        <p className="text-sm text-muted-foreground">
          Cycles completed: <span className="font-semibold text-primary">{cycles}</span>
        </p>
      )}

      <button
        onClick={() => {
          setIsActive(!isActive);
          setPhase(0);
          setCycles(0);
        }}
        className="rounded-xl gradient-calm px-8 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        {isActive ? "Stop" : "Start Breathing"}
      </button>
    </div>
  );
};

export default BreathingGame;
