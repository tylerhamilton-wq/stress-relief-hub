import { useState, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import { Headphones, Play, Pause } from "lucide-react";

interface Sound {
  label: string;
  emoji: string;
  frequency: number; // used to generate unique tones
}

const SOUNDS: Sound[] = [
  { label: "Rain", emoji: "🌧️", frequency: 200 },
  { label: "Ocean", emoji: "🌊", frequency: 150 },
  { label: "Forest", emoji: "🌲", frequency: 300 },
  { label: "Wind", emoji: "💨", frequency: 120 },
  { label: "Fireplace", emoji: "🔥", frequency: 180 },
  { label: "Night", emoji: "🌙", frequency: 100 },
];

const createNoise = (ctx: AudioContext, frequency: number, gain: number): { source: AudioBufferSourceNode; gainNode: GainNode } => {
  const sampleRate = ctx.sampleRate;
  const duration = 4;
  const bufferSize = sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
  const data = buffer.getChannelData(0);

  // Generate colored noise based on frequency param
  let b0 = 0, b1 = 0, b2 = 0;
  const factor = frequency / 300;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179 * factor;
    b1 = 0.99332 * b1 + white * 0.0750759 * factor;
    b2 = 0.96900 * b2 + white * 0.1538520 * factor;
    data[i] = (b0 + b1 + b2 + white * 0.5362) * 0.11;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const gainNode = ctx.createGain();
  gainNode.gain.value = gain;

  source.connect(gainNode);
  gainNode.connect(ctx.destination);

  return { source, gainNode };
};

const SleepSounds = () => {
  const [volumes, setVolumes] = useState<Record<string, number>>({});
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<Record<string, { source: AudioBufferSourceNode; gainNode: GainNode }>>({});

  const activeCount = Object.values(volumes).filter((v) => v > 0).length;

  const togglePlay = () => {
    if (playing) {
      // Stop all
      Object.values(nodesRef.current).forEach(({ source }) => { try { source.stop(); } catch {} });
      nodesRef.current = {};
      ctxRef.current?.close();
      ctxRef.current = null;
      setPlaying(false);
    } else {
      if (activeCount === 0) return;
      const ctx = new AudioContext();
      ctxRef.current = ctx;
      SOUNDS.forEach((s) => {
        const vol = volumes[s.label] || 0;
        if (vol > 0) {
          const node = createNoise(ctx, s.frequency, vol / 100);
          node.source.start();
          nodesRef.current[s.label] = node;
        }
      });
      setPlaying(true);
    }
  };

  // Update gain in real-time
  const setVolume = (label: string, value: number) => {
    setVolumes((prev) => ({ ...prev, [label]: value }));
    const node = nodesRef.current[label];
    if (node) {
      node.gainNode.gain.value = value / 100;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(nodesRef.current).forEach(({ source }) => { try { source.stop(); } catch {} });
      ctxRef.current?.close();
    };
  }, []);

  return (
    <Layout>
      <div className="animate-fade-in space-y-8">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-foreground flex items-center gap-2">
            <Headphones className="h-8 w-8 text-primary" /> Sleep Sounds
          </h1>
          <p className="text-muted-foreground">
            Mix ambient sounds together to create your perfect relaxation atmosphere.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {SOUNDS.map((s) => {
            const vol = volumes[s.label] || 0;
            return (
              <div
                key={s.label}
                className="rounded-2xl border bg-card p-5 shadow-card space-y-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{s.emoji}</span>
                  <span className="font-semibold text-foreground">{s.label}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{vol}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={vol}
                  onChange={(e) => setVolume(s.label, Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <button
            onClick={togglePlay}
            disabled={!playing && activeCount === 0}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-medium text-primary-foreground transition-transform hover:scale-105 disabled:opacity-40"
          >
            {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            {playing ? "Stop" : "Play Mix"}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default SleepSounds;
