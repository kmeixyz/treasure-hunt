'use client';

import { useState } from 'react';

const WHAT_OPTIONS = [
  { value: 'clicking randomly',              label: 'clicking randomly' },
  { value: 'going left to right',            label: 'going left to right' },
  { value: 'picking the middle door',        label: 'picking the middle door' },
  { value: 'skipping every other door',      label: 'skipping every other door' },
  { value: 'following the ghost\'s clues',   label: "following the ghost's clues" },
  { value: '__custom__',                     label: 'Something else…' },
];

const WHY_OPTIONS = [
  { value: 'I wanted to test my luck',               label: 'I wanted to test my luck' },
  { value: 'I wanted to eliminate half the doors',   label: 'I wanted to eliminate half the doors' },
  { value: 'I was following the ghost\'s clue',      label: "I was following the ghost's clue" },
  { value: 'it seemed like a good idea',             label: 'it seemed like a good idea' },
  { value: 'I remembered what worked before',        label: 'I remembered what worked before' },
];

const EVAL_OPTIONS = [
  { value: 'really well',          label: 'really well' },
  { value: 'okay',                  label: 'okay' },
  { value: 'terribly',             label: 'terribly' },
];

function Blank({ id, value, options, onChange, placeholder }) {
  return (
    <select
      id={id}
      className={'sb__blank' + (value ? ' sb__blank--filled' : '')}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={placeholder}
    >
      <option value="" disabled>{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export default function StrategyBuilder({ levelId, levelName, onSave }) {
  const [what, setWhat] = useState('');
  const [customWhat, setCustomWhat] = useState('');
  const [why, setWhy] = useState('');
  const [evaluation, setEvaluation] = useState('');
  const [saved, setSaved] = useState(false);

  const whatValue = what === '__custom__' ? (customWhat.trim() || '') : what;
  const canSave = whatValue && why && evaluation && !saved;

  function handleSave() {
    if (!canSave) return;
    const entry = {
      levelId,
      levelName,
      text: `I tried ${whatValue}. I did this because ${why}. I think this strategy worked ${evaluation}.`,
    };
    onSave(entry);
    setSaved(true);
  }

  return (
    <div className="sb">
      <div className="sb__title">📝 My Strategy Log</div>

      <div className="sb__sentence">
        <span className="sb__prose">I tried to find the treasure by </span>
        <Blank
          id="sb-what"
          value={what}
          options={WHAT_OPTIONS}
          onChange={setWhat}
          placeholder="choose…"
        />
        <span className="sb__prose">.</span>
      </div>

      {what === '__custom__' && (
        <div className="sb__custom-row">
          <label className="sb__custom-label" htmlFor="sb-custom">Tell us what you did:</label>
          <input
            id="sb-custom"
            className="sb__custom-input"
            type="text"
            maxLength={80}
            placeholder="describe your strategy…"
            value={customWhat}
            onChange={(e) => setCustomWhat(e.target.value)}
            autoFocus
          />
        </div>
      )}

      <div className="sb__sentence">
        <span className="sb__prose">I did this because </span>
        <Blank
          id="sb-why"
          value={why}
          options={WHY_OPTIONS}
          onChange={setWhy}
          placeholder="choose…"
        />
        <span className="sb__prose">.</span>
      </div>

      <div className="sb__sentence">
        <span className="sb__prose">I think this strategy worked </span>
        <Blank
          id="sb-eval"
          value={evaluation}
          options={EVAL_OPTIONS}
          onChange={setEvaluation}
          placeholder="choose…"
        />
        <span className="sb__prose">.</span>
      </div>

      {saved ? (
        <div className="sb__saved">✓ Saved to your journal!</div>
      ) : (
        <button
          className="btn btn--ghost sb__save-btn"
          onClick={handleSave}
          disabled={!canSave}
        >
          💾 Save to Journal
        </button>
      )}
    </div>
  );
}
