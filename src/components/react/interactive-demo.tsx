import { useState } from 'react';

export default function InteractiveDemo() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('React');
  const [step, setStep] = useState(1);

  return (
    <div className="interactive-demo">
      <h4>Interactive Demo — useState in action</h4>

      <div className="demo-controls">
        <label htmlFor="demo-name">
          Name:
          <input
            id="demo-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label="Name input"
          />
        </label>

        <label htmlFor="demo-step">
          Step:
          <input
            id="demo-step"
            type="number"
            min={1}
            max={10}
            value={step}
            onChange={(e) => setStep(Number(e.target.value) || 1)}
            aria-label="Counter step"
          />
        </label>

        <button
          type="button"
          className="demo-btn demo-btn-primary"
          onClick={() => setCount((c) => c + step)}
          aria-label={`Increase count by ${step}`}
        >
          +{step}
        </button>

        <button
          type="button"
          className="demo-btn"
          onClick={() => setCount((c) => c - step)}
          aria-label={`Decrease count by ${step}`}
        >
          −{step}
        </button>

        <button type="button" className="demo-btn" onClick={() => setCount(0)} aria-label="Reset count">
          Reset
        </button>
      </div>

      <div className="demo-output" aria-live="polite">
        Hello, {name || 'World'}! Count: {count}
      </div>

      <p className="demo-state">
        State: count={count}, name=&quot;{name}&quot;, step={step}
      </p>
    </div>
  );
}
