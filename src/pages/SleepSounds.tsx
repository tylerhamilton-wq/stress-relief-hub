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

  // Longer buffers to avoid obvious looping
  const makeNoiseBuffer = (duration: number) => {
    const buf = ctx.createBuffer(2, sampleRate * duration, sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      // Brown noise (integrated white noise) sounds more natural
      let last = 0;
      for (let i = 0; i < d.length; i++) {
        const white = Math.random() * 2 - 1;
        last = (last + 0.02 * white) / 1.02;
        d[i] = last * 3.5;
      }
    }
    return buf;
  };

  const makeWhiteNoise = (duration: number) => {
    const buf = ctx.createBuffer(2, sampleRate * duration, sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    return buf;
  };

  const makePinkNoise = (duration: number) => {
    const buf = ctx.createBuffer(2, sampleRate * duration, sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < d.length; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    }
    return buf;
  };

  if (type === "rain") {
    // Layer 1: High frequency rain patter (pink noise, heavily filtered)
    const src1 = ctx.createBufferSource();
    src1.buffer = makePinkNoise(12);
    src1.loop = true;
    const hp1 = ctx.createBiquadFilter();
    hp1.type = "highpass"; hp1.frequency.value = 4000; hp1.Q.value = 0.3;
    const bp1 = ctx.createBiquadFilter();
    bp1.type = "bandpass"; bp1.frequency.value = 7000; bp1.Q.value = 0.5;
    const g1 = ctx.createGain(); g1.gain.value = 0.6;
    src1.connect(hp1).connect(bp1).connect(g1).connect(masterGain);
    src1.start();
    sources.push(src1);

    // Layer 2: Mid-frequency rain body
    const src2 = ctx.createBufferSource();
    src2.buffer = makePinkNoise(15);
    src2.loop = true;
    const bp2 = ctx.createBiquadFilter();
    bp2.type = "bandpass"; bp2.frequency.value = 3000; bp2.Q.value = 0.4;
    const g2 = ctx.createGain(); g2.gain.value = 0.4;
    // Subtle volume modulation for variation
    const rainLfo = ctx.createOscillator(); rainLfo.type = "sine"; rainLfo.frequency.value = 0.15;
    const rainLfoG = ctx.createGain(); rainLfoG.gain.value = 0.1;
    rainLfo.connect(rainLfoG).connect(g2.gain);
    rainLfo.start(); oscillators.push(rainLfo);
    src2.connect(bp2).connect(g2).connect(masterGain);
    src2.start();
    sources.push(src2);

    // Layer 3: Low rumble of heavy rain
    const src3 = ctx.createBufferSource();
    src3.buffer = makeNoiseBuffer(12);
    src3.loop = true;
    const lp3 = ctx.createBiquadFilter();
    lp3.type = "lowpass"; lp3.frequency.value = 500; lp3.Q.value = 0.5;
    const g3 = ctx.createGain(); g3.gain.value = 0.25;
    src3.connect(lp3).connect(g3).connect(masterGain);
    src3.start();
    sources.push(src3);

  } else if (type === "ocean") {
    // Brown noise with very slow, deep filter sweeps for wave motion
    const src = ctx.createBufferSource();
    src.buffer = makeNoiseBuffer(20);
    src.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass"; lp.frequency.value = 400; lp.Q.value = 1.5;
    // Slow wave sweep on filter
    const lfo1 = ctx.createOscillator(); lfo1.type = "sine"; lfo1.frequency.value = 0.08;
    const lfo1G = ctx.createGain(); lfo1G.gain.value = 350;
    lfo1.connect(lfo1G).connect(lp.frequency);
    lfo1.start(); oscillators.push(lfo1);
    // Volume swell for waves crashing
    const volNode = ctx.createGain(); volNode.gain.value = 0.5;
    const volLfo = ctx.createOscillator(); volLfo.type = "sine"; volLfo.frequency.value = 0.08;
    const volLfoG = ctx.createGain(); volLfoG.gain.value = 0.45;
    volLfo.connect(volLfoG).connect(volNode.gain);
    volLfo.start(); oscillators.push(volLfo);
    src.connect(lp).connect(volNode).connect(masterGain);
    src.start(); sources.push(src);

    // Foam/wash layer (higher freq noise)
    const src2 = ctx.createBufferSource();
    src2.buffer = makePinkNoise(18);
    src2.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass"; bp.frequency.value = 2000; bp.Q.value = 0.3;
    const foamVol = ctx.createGain(); foamVol.gain.value = 0;
    const foamLfo = ctx.createOscillator(); foamLfo.type = "sine"; foamLfo.frequency.value = 0.08;
    // Phase offset by connecting same LFO differently - use separate
    const foamLfo2 = ctx.createOscillator(); foamLfo2.type = "sine"; foamLfo2.frequency.value = 0.08;
    const foamLfoG = ctx.createGain(); foamLfoG.gain.value = 0.15;
    foamLfo2.connect(foamLfoG).connect(foamVol.gain);
    foamLfo2.start(); oscillators.push(foamLfo2);
    src2.connect(bp).connect(foamVol).connect(masterGain);
    src2.start(); sources.push(src2);

  } else if (type === "forest") {
    // Gentle wind through leaves (pink noise, very soft)
    const src = ctx.createBufferSource();
    src.buffer = makePinkNoise(20);
    src.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass"; bp.frequency.value = 2500; bp.Q.value = 0.2;
    const gWind = ctx.createGain(); gWind.gain.value = 0.12;
    const windLfo = ctx.createOscillator(); windLfo.type = "sine"; windLfo.frequency.value = 0.06;
    const windLfoG = ctx.createGain(); windLfoG.gain.value = 0.06;
    windLfo.connect(windLfoG).connect(gWind.gain);
    windLfo.start(); oscillators.push(windLfo);
    src.connect(bp).connect(gWind).connect(masterGain);
    src.start(); sources.push(src);

    // Bird calls - sine oscillators with slow on/off envelope via LFO
    const birdFreqs = [1600, 2200, 2800, 3400];
    birdFreqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      // Vibrato
      const vib = ctx.createOscillator(); vib.type = "sine"; vib.frequency.value = 5 + i * 1.5;
      const vibG = ctx.createGain(); vibG.gain.value = freq * 0.02;
      vib.connect(vibG).connect(osc.frequency);
      vib.start(); oscillators.push(vib);
      // Amplitude: slow pulse so birds chirp intermittently
      const ampLfo = ctx.createOscillator(); ampLfo.type = "sine";
      ampLfo.frequency.value = 0.3 + i * 0.15;
      const ampG = ctx.createGain(); ampG.gain.value = 0.025;
      const birdGain = ctx.createGain(); birdGain.gain.value = 0.025;
      ampLfo.connect(ampG).connect(birdGain.gain);
      ampLfo.start(); oscillators.push(ampLfo);
      osc.connect(birdGain).connect(masterGain);
      osc.start(); oscillators.push(osc);
    });

  } else if (type === "wind") {
    // Brown noise with very slow, deep sweeping filter
    const src = ctx.createBufferSource();
    src.buffer = makeNoiseBuffer(25);
    src.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass"; lp.frequency.value = 300; lp.Q.value = 3;
    const lfo = ctx.createOscillator(); lfo.type = "sine"; lfo.frequency.value = 0.03;
    const lfoG = ctx.createGain(); lfoG.gain.value = 250;
    lfo.connect(lfoG).connect(lp.frequency);
    lfo.start(); oscillators.push(lfo);
    // Volume swell for gusts
    const gustGain = ctx.createGain(); gustGain.gain.value = 0.5;
    const gustLfo = ctx.createOscillator(); gustLfo.type = "sine"; gustLfo.frequency.value = 0.04;
    const gustLfoG = ctx.createGain(); gustLfoG.gain.value = 0.4;
    gustLfo.connect(gustLfoG).connect(gustGain.gain);
    gustLfo.start(); oscillators.push(gustLfo);
    src.connect(lp).connect(gustGain).connect(masterGain);
    src.start(); sources.push(src);

    // Higher whistle layer
    const src2 = ctx.createBufferSource();
    src2.buffer = makeWhiteNoise(20);
    src2.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass"; bp.frequency.value = 1200; bp.Q.value = 3;
    const whistleLfo = ctx.createOscillator(); whistleLfo.type = "sine"; whistleLfo.frequency.value = 0.05;
    const whistleLfoG = ctx.createGain(); whistleLfoG.gain.value = 500;
    whistleLfo.connect(whistleLfoG).connect(bp.frequency);
    whistleLfo.start(); oscillators.push(whistleLfo);
    const g2 = ctx.createGain(); g2.gain.value = 0.08;
    src2.connect(bp).connect(g2).connect(masterGain);
    src2.start(); sources.push(src2);

  } else if (type === "fireplace") {
    // Crackling: shaped noise buffer with random pops
    const crackleLen = sampleRate * 15;
    const buf = ctx.createBuffer(2, crackleLen, sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < crackleLen; i++) {
        const white = Math.random() * 2 - 1;
        // Random sharp crackle pops
        const pop = Math.random() > 0.995 ? (Math.random() * 4 + 1) : 0;
        // Gentle underlying crackle
        const gentle = Math.random() > 0.98 ? Math.random() * 0.8 : 0.05;
        d[i] = white * (pop + gentle) * 0.12;
      }
    }
    const src = ctx.createBufferSource();
    src.buffer = buf; src.loop = true;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass"; hp.frequency.value = 800;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass"; bp.frequency.value = 3000; bp.Q.value = 0.4;
    const g1 = ctx.createGain(); g1.gain.value = 0.7;
    src.connect(hp).connect(bp).connect(g1).connect(masterGain);
    src.start(); sources.push(src);

    // Warm low rumble/hum of fire
    const src2 = ctx.createBufferSource();
    src2.buffer = makeNoiseBuffer(15);
    src2.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass"; lp.frequency.value = 150; lp.Q.value = 0.5;
    const g2 = ctx.createGain(); g2.gain.value = 0.35;
    const fireLfo = ctx.createOscillator(); fireLfo.type = "sine"; fireLfo.frequency.value = 0.2;
    const fireLfoG = ctx.createGain(); fireLfoG.gain.value = 0.1;
    fireLfo.connect(fireLfoG).connect(g2.gain);
    fireLfo.start(); oscillators.push(fireLfo);
    src2.connect(lp).connect(g2).connect(masterGain);
    src2.start(); sources.push(src2);

  } else if (type === "night") {
    // Cricket chirps: rapid on-off sine tones at high frequency
    const cricketFreqs = [4000, 4600, 5200];
    cricketFreqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine"; osc.frequency.value = freq;
      // Square wave LFO for rhythmic chirping
      const chirpLfo = ctx.createOscillator();
      chirpLfo.type = "square"; chirpLfo.frequency.value = 12 + i * 4;
      const chirpG = ctx.createGain(); chirpG.gain.value = 0.03;
      // Slow envelope so crickets fade in/out
      const envLfo = ctx.createOscillator();
      envLfo.type = "sine"; envLfo.frequency.value = 0.2 + i * 0.1;
      const envG = ctx.createGain(); envG.gain.value = 0.03;
      const oscGain = ctx.createGain(); oscGain.gain.value = 0.03;
      chirpLfo.connect(chirpG).connect(oscGain.gain);
      envLfo.connect(envG).connect(oscGain.gain);
      osc.connect(oscGain).connect(masterGain);
      osc.start(); chirpLfo.start(); envLfo.start();
      oscillators.push(osc, chirpLfo, envLfo);
    });
    // Soft ambient night background
    const src = ctx.createBufferSource();
    src.buffer = makeNoiseBuffer(20);
    src.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass"; lp.frequency.value = 200; lp.Q.value = 0.3;
    const g = ctx.createGain(); g.gain.value = 0.15;
    src.connect(lp).connect(g).connect(masterGain);
    src.start(); sources.push(src);

  } else if (type === "thunder") {
    // Deep rolling thunder: brown noise with very low filter and slow dramatic swells
    const src = ctx.createBufferSource();
    src.buffer = makeNoiseBuffer(25);
    src.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass"; lp.frequency.value = 100; lp.Q.value = 1.5;
    const lfo = ctx.createOscillator(); lfo.type = "sine"; lfo.frequency.value = 0.02;
    const lfoG = ctx.createGain(); lfoG.gain.value = 80;
    lfo.connect(lfoG).connect(lp.frequency);
    lfo.start(); oscillators.push(lfo);
    // Dramatic volume swells for rumbling
    const rumbleGain = ctx.createGain(); rumbleGain.gain.value = 0.3;
    const rumbleLfo = ctx.createOscillator(); rumbleLfo.type = "sine"; rumbleLfo.frequency.value = 0.05;
    const rumbleLfoG = ctx.createGain(); rumbleLfoG.gain.value = 0.6;
    rumbleLfo.connect(rumbleLfoG).connect(rumbleGain.gain);
    rumbleLfo.start(); oscillators.push(rumbleLfo);
    src.connect(lp).connect(rumbleGain).connect(masterGain);
    src.start(); sources.push(src);

    // Rain layer underneath thunder
    const src2 = ctx.createBufferSource();
    src2.buffer = makePinkNoise(18);
    src2.loop = true;
    const hp2 = ctx.createBiquadFilter();
    hp2.type = "highpass"; hp2.frequency.value = 3000;
    const g2 = ctx.createGain(); g2.gain.value = 0.15;
    src2.connect(hp2).connect(g2).connect(masterGain);
    src2.start(); sources.push(src2);

  } else if (type === "stream") {
    // Babbling brook: pink noise with fast modulation for bubbling
    const src = ctx.createBufferSource();
    src.buffer = makePinkNoise(18);
    src.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass"; bp.frequency.value = 3500; bp.Q.value = 1.2;
    // Fast modulation for bubbling effect
    const bubbleLfo = ctx.createOscillator(); bubbleLfo.type = "sine"; bubbleLfo.frequency.value = 2.5;
    const bubbleG = ctx.createGain(); bubbleG.gain.value = 1500;
    bubbleLfo.connect(bubbleG).connect(bp.frequency);
    bubbleLfo.start(); oscillators.push(bubbleLfo);
    const g = ctx.createGain(); g.gain.value = 0.3;
    src.connect(bp).connect(g).connect(masterGain);
    src.start(); sources.push(src);

    // Steady water flow layer
    const src2 = ctx.createBufferSource();
    src2.buffer = makeNoiseBuffer(20);
    src2.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass"; lp.frequency.value = 600;
    const g2 = ctx.createGain(); g2.gain.value = 0.2;
    src2.connect(lp).connect(g2).connect(masterGain);
    src2.start(); sources.push(src2);

  } else if (type === "heartbeat") {
    // Low sine pulse with lub-dub rhythm
    const osc = ctx.createOscillator();
    osc.type = "sine"; osc.frequency.value = 50;
    const osc2 = ctx.createOscillator();
    osc2.type = "sine"; osc2.frequency.value = 35;
    const pulseGain = ctx.createGain(); pulseGain.gain.value = 0;
    const pulseGain2 = ctx.createGain(); pulseGain2.gain.value = 0;
    const now = ctx.currentTime;
    const beatLen = 0.85;
    for (let i = 0; i < 300; i++) {
      const t = now + i * beatLen;
      // Lub (stronger)
      pulseGain.gain.setValueAtTime(0, t);
      pulseGain.gain.linearRampToValueAtTime(0.9, t + 0.04);
      pulseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      // Dub (softer, slightly delayed)
      pulseGain2.gain.setValueAtTime(0.001, t + 0.22);
      pulseGain2.gain.linearRampToValueAtTime(0.5, t + 0.26);
      pulseGain2.gain.exponentialRampToValueAtTime(0.001, t + 0.42);
    }
    osc.connect(pulseGain).connect(masterGain);
    osc2.connect(pulseGain2).connect(masterGain);
    osc.start(); osc2.start();
    oscillators.push(osc, osc2);
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
