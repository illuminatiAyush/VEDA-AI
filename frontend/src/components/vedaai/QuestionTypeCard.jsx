import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import StepperInput from './StepperInput';

const TYPE_OPTIONS = [
  { id: 'mcq', label: 'Multiple Choice Questions' },
  { id: 'short', label: 'Short Questions' },
  { id: 'long', label: 'Long Questions' },
];

export default function QuestionTypeCard({ item, index, usedTypes, onChange, onRemove, canRemove }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const label = TYPE_OPTIONS.find((t) => t.id === item.id)?.label || item.id;

  const changeType = (id) => {
    onChange(index, 'id', id);
    setOpen(false);
  };

  return (
    <div className="bg-white border border-border rounded-veda p-4 shadow-soft" ref={ref}>
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 font-semibold text-sm text-primary"
        >
          {label}
          <ChevronDown size={16} className={`text-text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-text-muted hover:text-danger p-1"
            aria-label="Remove question type"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {open && (
        <div className="mb-4 border border-border rounded-xl bg-white shadow-soft overflow-hidden">
          {TYPE_OPTIONS.filter((t) => t.id === item.id || !usedTypes.includes(t.id)).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => changeType(t.id)}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-surface-muted ${
                t.id === item.id ? 'bg-surface-muted font-semibold' : ''
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-text-muted mb-2">No. of Questions</p>
          <StepperInput
            value={item.count}
            onChange={(v) => onChange(index, 'count', v)}
            min={1}
            max={30}
          />
        </div>
        <div>
          <p className="text-xs text-text-muted mb-2">Marks</p>
          <StepperInput
            value={item.marks}
            onChange={(v) => onChange(index, 'marks', v)}
            min={1}
            max={20}
          />
        </div>
      </div>
    </div>
  );
}
