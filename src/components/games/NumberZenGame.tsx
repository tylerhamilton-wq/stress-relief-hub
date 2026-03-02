import { useState, useEffect } from "react";

const generateTarget = () => Math.floor(Math.random() * 50) + 10;

const generateNumbers = (target: number) => {
  const nums: number[] = [];
  // Ensure at least one valid combo exists
  const a = Math.floor(Math.random() * (target - 1)) + 1;
  nums.push(a, target - a);
  while (nums.length < 9) {
    nums.push(Math.floor(Math.random() * 30) + 1);
  }
  return nums.sort(() => Math.random() - 0.5);
};

const NumberZenGame = () => {
  const [target, setTarget] = useState(generateTarget);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    setNumbers(generateNumbers(target));
    setSelected([]);
    setFeedback("");
  }, [target]);

  const toggleSelect = (i: number) => {
    setSelected((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
    setFeedback("");
  };

  const checkSum = () => {
    const sum = selected.reduce((acc, i) => acc + numbers[i], 0);
    if (sum === target) {
      setScore((s) => s + 1);
      setFeedback("✨ Perfect!");
      setTimeout(() => setTarget(generateTarget()), 800);
    } else {
      setFeedback(`Sum is ${sum}, need ${target}`);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <h2 className="text-2xl font-bold text-foreground">Number Zen</h2>
      <p className="text-sm text-muted-foreground">
        Select numbers that add up to the target.
      </p>

      <div className="flex items-center gap-4">
        <span className="rounded-full bg-primary/10 px-4 py-2 text-lg font-bold text-primary">
          Target: {target}
        </span>
        <span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
          Score: {score}
        </span>
      </div>

      {feedback && (
        <p className={`text-sm font-medium ${feedback.includes("Perfect") ? "text-primary" : "text-muted-foreground"}`}>
          {feedback}
        </p>
      )}

      <div className="grid grid-cols-3 gap-3">
        {numbers.map((num, i) => (
          <button
            key={i}
            onClick={() => toggleSelect(i)}
            className={`flex h-14 w-14 items-center justify-center rounded-xl text-lg font-semibold transition-all sm:h-16 sm:w-16 ${
              selected.includes(i)
                ? "bg-primary text-primary-foreground scale-105"
                : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            {num}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={checkSum}
          disabled={selected.length === 0}
          className="rounded-xl bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          Check
        </button>
        <button
          onClick={() => {
            setSelected([]);
            setFeedback("");
          }}
          className="rounded-lg bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default NumberZenGame;
