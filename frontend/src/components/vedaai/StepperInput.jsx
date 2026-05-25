import { Minus, Plus } from 'lucide-react';

export default function StepperInput({ value, onChange, min = 1, max = 50 }) {
  const num = Number(value) || min;

  const dec = () => onChange(Math.max(min, num - 1));
  const inc = () => onChange(Math.min(max, num + 1));

  return (
    <div className="flex items-center gap-0 bg-surface-muted rounded-xl overflow-hidden border border-border">
      <button
        type="button"
        onClick={dec}
        className="w-10 h-10 flex items-center justify-center text-text-muted hover:bg-white transition-colors"
        aria-label="Decrease"
      >
        <Minus size={16} />
      </button>
      <span className="w-10 text-center text-sm font-semibold text-primary">{num}</span>
      <button
        type="button"
        onClick={inc}
        className="w-10 h-10 flex items-center justify-center text-text-muted hover:bg-white transition-colors"
        aria-label="Increase"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
