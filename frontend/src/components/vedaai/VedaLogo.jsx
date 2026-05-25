import { Link } from 'react-router-dom';

export default function VedaLogo({ className = '', to, size = 'md' }) {
  const sizes = {
    sm: { box: 'w-8 h-8', text: 'text-base' },
    md: { box: 'w-9 h-9', text: 'text-lg' },
    lg: { box: 'w-10 h-10', text: 'text-xl' },
  };
  const s = sizes[size] || sizes.md;

  const content = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`${s.box} rounded-xl bg-primary flex items-center justify-center shrink-0`}>
        <span className="text-white font-bold text-sm leading-none">V</span>
      </div>
      <span className={`${s.text} font-bold text-primary tracking-tight`}>VedaAI</span>
    </div>
  );

  if (to) {
    return <Link to={to} className="inline-flex">{content}</Link>;
  }
  return content;
}
