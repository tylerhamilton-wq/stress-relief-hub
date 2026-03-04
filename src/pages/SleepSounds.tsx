import { useState, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import { Headphones, Play, Pause } from "lucide-react";

interface Sound {
  label: string;
  emoji: string;
  type: string;
}

const SOUNDS: Sound[] = [
  { label: "Rain", emoji: "🌧️", type: "rain" },
  { label: "Ocean", emoji: "🌊", type: "ocean" },
  { label: "Forest", emoji: "🌲", type: "forest" },
  { label: "Wind", emoji: "💨", type: "wind" },
  { label: "Fireplace", emoji: "🔥", type: "fireplace" },
  { label: "Night Crickets", emoji: "🌙", type: "night" },
  { label: "Thunder", emoji: "⛈️", type: "thunder" },
  { label: "Stream", emoji: "🏞️", type: "stream" },
  { label: "Heartbeat", emoji: "💓", type: "heartbeat" },
];

interface SoundNodes {
  sources: AudioBufferSourceNode[];
  oscillators: OscillatorNode[];
  gainNode: GainNode;
}

const createSound = (ctx: AudioContext, type: string, gain: number): SoundNodes => {
  const masterGain = ctx.createGain();
  masterGain.gain.value = gain;
  masterGain.connect(ctx.destination);

  const sources: AudioBufferSourceNode[] = [];
  const oscillators: OscillatorNode[] = [];
  const sampleRate = ctx.sampleRate;

  const makeNoiseBuffer = (duration: number, channels = 1) => {
    const buf = ctx.createBuffer(channels, sampleRate * duration, sampleRate);
    for (let c = 0; c < channels; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    return buf;
  };

  if (type === "rain") {
    // Bandpass-filtered noise to simulate rain patter
    const buf = makeNoiseBuffer(4);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 8000;
    bp.Q.value = 0.4;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 2000;
    hp.Q.value = 0.5;
    src.connect(bp).connect(hp).connect(masterGain);
    src.start();
    sources.push(src);

    // Secondary lower layer for heavy rain body
    const src2 = ctx.createBufferSource();
    src2.buffer = makeNoiseBuffer(4);
    src2.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 1000;
    const g2 = ctx.createGain();
    g2.gain.value = 0.3;
    src2.connect(lp).connect(g2).connect(masterGain);
    src2.start();
    sources.push(src2);
  } else if (type === "ocean") {
    // Slowly modulated noise for waves
    const buf = makeNoiseBuffer(6);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 600;
    lp.Q.value = 1;
    // LFO to modulate filter for wave motion
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.12;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 400;
    lfo.connect(lfoGain).connect(lp.frequency);
    lfo.start();
    oscillators.push(lfo);
    // Volume LFO for wave swell
    const volLfo = ctx.createOscillator();
    volLfo.type = "sine";
    volLfo.frequency.value = 0.1;
    const volLfoGain = ctx.createGain();
    volLfoGain.gain.value = 0.3;
    const baseGain = ctx.createGain();
    baseGain.gain.value = 0.7;
    volLfo.connect(volLfoGain).connect(baseGain.gain);
    volLfo.start();
    oscillators.push(volLfo);
    src.connect(lp).connect(baseGain).connect(masterGain);
    src.start();
    sources.push(src);
  } else if (type === "forest") {
    // Gentle rustling (soft filtered noise)
    const src = ctx.createBufferSource();
    src.buffer = makeNoiseBuffer(4);
    src.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 3000;
    bp.Q.value = 0.3;
    const g = ctx.createGain();
    g.gain.value = 0.15;
    src.connect(bp).connect(g).connect(masterGain);
    src.start();
    sources.push(src);
    // Bird-like tones using sine oscillators
    [1800, 2400, 3200].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const tremolo = ctx.createOscillator();
      tremolo.type = "sine";
      tremolo.frequency.value = 3 + i * 2;
      const tremoloGain = ctx.createGain();
      tremoloGain.gain.value = 0.015;
      const oscGain = ctx.createGain();
      oscGain.gain.value = 0;
      tremolo.connect(tremoloGain).connect(oscGain.gain);
      osc.connect(oscGain).connect(masterGain);
      osc.start();
      tremolo.start();
      oscillators.push(osc, tremolo);
    });
  } else if (type === "wind") {
    // Slowly sweeping filtered noise
    const src = ctx.createBufferSource();
    src.buffer = makeNoiseBuffer(6);
    src.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 400;
    lp.Q.value = 2;
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.05;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 300;
    lfo.connect(lfoGain).connect(lp.frequency);
    lfo.start();
    oscillators.push(lfo);
    src.connect(lp).connect(masterGain);
    src.start();
    sources.push(src);
  } else if (type === "fireplace") {
    // Crackling: filtered noise with random amplitude modulation
    const buf = ctx.createBuffer(1, sampleRate * 4, sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) {
      const white = Math.random() * 2 - 1;
      // Random crackle bursts
      const crackle = Math.random() > 0.97 ? (Math.random() * 3) : 0.1;
      d[i] = white * crackle * 0.15;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 2000;
    bp.Q.value = 0.5;
    src.connect(bp).connect(masterGain);
    src.start();
    sources.push(src);
    // Low rumble
    const src2 = ctx.createBufferSource();
    src2.buffer = makeNoiseBuffer(4);
    src2.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 200;
    const g2 = ctx.createGain();
    g2.gain.value = 0.2;
    src2.connect(lp).connect(g2).connect(masterGain);
    src2.start();
    sources.push(src2);
  } else if (type === "night") {
    // Cricket chirps: fast oscillating tones
    [4200, 4800, 5100].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const chirpLfo = ctx.createOscillator();
      chirpLfo.type = "square";
      chirpLfo.frequency.value = 15 + i * 5;
      const chirpGain = ctx.createGain();
      chirpGain.gain.value = 0.02;
      const oscGain = ctx.createGain();
      oscGain.gain.value = 0;
      chirpLfo.connect(chirpGain).connect(oscGain.gain);
      osc.connect(oscGain).connect(masterGain);
      osc.start();
      chirpLfo.start();
      oscillators.push(osc, chirpLfo);
    });
    // Soft background noise
    const src = ctx.createBufferSource();
    src.buffer = makeNoiseBuffer(4);
    src.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 300;
    const g = ctx.createGain();
    g.gain.value = 0.08;
    src.connect(lp).connect(g).connect(masterGain);
    src.start();
    sources.push(src);
  } else if (type === "thunder") {
    // Deep rumbling noise with slow modulation
    const src = ctx.createBufferSource();
    src.buffer = makeNoiseBuffer(6);
    src.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 150;
    lp.Q.value = 1;
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.03;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 100;
    lfo.connect(lfoGain).connect(lp.frequency);
    lfo.start();
    oscillators.push(lfo);
    // Volume swell for rumble effect
    const volLfo = ctx.createOscillator();
    volLfo.type = "sine";
    volLfo.frequency.value = 0.07;
    const volGain = ctx.createGain();
    volGain.gain.value = 0.5;
    const baseG = ctx.createGain();
    baseG.gain.value = 0.5;
    volLfo.connect(volGain).connect(baseG.gain);
    volLfo.start();
    oscillators.push(volLfo);
    src.connect(lp).connect(baseG).connect(masterGain);
    src.start();
    sources.push(src);
  } else if (type === "stream") {
    // Babbling brook: high-pass noise with quick modulation
    const src = ctx.createBufferSource();
    src.buffer = makeNoiseBuffer(4);
    src.loop = true;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 3000;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 5000;
    bp.Q.value = 0.8;
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.8;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 2000;
    lfo.connect(lfoGain).connect(bp.frequency);
    lfo.start();
    oscillators.push(lfo);
    const g = ctx.createGain();
    g.gain.value = 0.4;
    src.connect(hp).connect(bp).connect(g).connect(masterGain);
    src.start();
    sources.push(src);
    // Lower water flow
    const src2 = ctx.createBufferSource();
    src2.buffer = makeNoiseBuffer(4);
    src2.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 800;
    const g2 = ctx.createGain();
    g2.gain.value = 0.15;
    src2.connect(lp).connect(g2).connect(masterGain);
    src2.start();
    sources.push(src2);
  } else if (type === "heartbeat") {
    // Low frequency pulse
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 55;
    const pulseGain = ctx.createGain();
    pulseGain.gain.value = 0;
    // Create heartbeat rhythm: lub-dub pattern
    const now = ctx.currentTime;
    const beatLen = 0.85;
    for (let i = 0; i < 200; i++) {
      const t = now + i * beatLen;
      // Lub
      pulseGain.gain.setValueAtTime(0, t);
      pulseGain.gain.linearRampToValueAtTime(0.8, t + 0.06);
      pulseGain.gain.linearRampToValueAtTime(0, t + 0.15);
      // Dub
      pulseGain.gain.setValueAtTime(0, t + 0.2);
      pulseGain.gain.linearRampToValueAtTime(0.5, t + 0.26);
      pulseGain.gain.linearRampToValueAtTime(0, t + 0.38);
    }
    osc.connect(pulseGain).connect(masterGain);
    osc.start();
    oscillators.push(osc);
  }

  return { sources, oscillators, gainNode: masterGain };
};

const SleepSounds = () => {
  const [volumes, setVolumes] = useState<Record<string, number>>({});
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<Record<string, SoundNodes>>({});

  const activeCount = Object.values(volumes).filter((v) => v > 0).length;

  const stopAll = () => {
    Object.values(nodesRef.current).forEach(({ sources, oscillators }) => {
      sources.forEach((s) => { try { s.stop(); } catch {} });
      oscillators.forEach((o) => { try { o.stop(); } catch {} });
    });
    nodesRef.current = {};
    ctxRef.current?.close();
    ctxRef.current = null;
  };

  const togglePlay = () => {
    if (playing) {
      stopAll();
      setPlaying(false);
    } else {
      if (activeCount === 0) return;
      const ctx = new AudioContext();
      ctxRef.current = ctx;
      SOUNDS.forEach((s) => {
        const vol = volumes[s.label] || 0;
        if (vol > 0) {
          const node = createSound(ctx, s.type, vol / 100);
          nodesRef.current[s.label] = node;
        }
      });
      setPlaying(true);
    }
  };

  const setVolume = (label: string, value: number) => {
    setVolumes((prev) => ({ ...prev, [label]: value }));
    const node = nodesRef.current[label];
    if (node) {
      node.gainNode.gain.value = value / 100;
    }
  };

  useEffect(() => {
    return () => { stopAll(); };
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
