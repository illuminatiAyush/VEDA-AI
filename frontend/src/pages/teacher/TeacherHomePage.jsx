import { Link } from 'react-router-dom';
import { FileText, Users, Sparkles, Plus, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useLayout } from '../../context/LayoutContext';

export default function TeacherHomePage() {
  const { assignmentCount } = useLayout();

  return (
    <div className="bg-white rounded-veda-xl min-h-[calc(100vh-8rem)] shadow-soft p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2 h-2 rounded-full bg-success shrink-0" />
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">Home</h1>
      </div>
      <p className="text-sm text-text-muted ml-4 mb-8">
        Welcome back. Manage assessments and AI tools from here.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {[
          { title: 'Assignments', desc: `${assignmentCount} assignment${assignmentCount === 1 ? '' : 's'}`, to: '/teacher/dashboard', icon: FileText },
          { title: "AI Teacher's Toolkit", desc: 'Generate question papers with AI', to: '/teacher/toolkit', icon: Sparkles },
        ].map((card) => (
          <Link
            key={card.title}
            to={card.to}
            className="p-6 border border-border rounded-veda-xl hover:shadow-card transition-shadow bg-background group"
          >
            <card.icon size={28} className="text-primary mb-4" />
            <h2 className="font-bold text-primary mb-1">{card.title}</h2>
            <p className="text-sm text-text-muted mb-4">{card.desc}</p>
            <span className="text-sm font-semibold text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              Open <ArrowRight size={14} />
            </span>
          </Link>
        ))}
      </div>

      <Button to="/teacher/create-test" variant="primary" size="lg">
        <Plus size={18} className="mr-2" />
        Create Assignment
      </Button>
    </div>
  );
}
