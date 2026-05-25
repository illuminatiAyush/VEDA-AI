import { Link } from 'react-router-dom';
import { Sparkles, Plus, FileText } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function ToolkitPage() {
  return (
    <div className="bg-white rounded-veda-xl min-h-[calc(100vh-8rem)] shadow-soft p-6 sm:p-8 max-w-3xl">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles size={22} className="text-primary" />
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">AI Teacher&apos;s Toolkit</h1>
      </div>
      <p className="text-sm text-text-muted mb-8">
        Upload your syllabus or document and generate customized question papers for your classes.
      </p>

      <div className="bg-frame rounded-veda-xl p-6 sm:p-8 text-white mb-8">
        <p className="text-sm sm:text-base leading-relaxed mb-6">
          Certainly! Here are customized <strong>Question Paper</strong> for your CBSE classes on your NCERT chapters.
          Start by creating a new assignment with your source material.
        </p>
        <Button to="/teacher/create-test" variant="white" size="md">
          <Plus size={18} className="mr-2" />
          Create New
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button to="/teacher/create-test" variant="primary" size="lg">
          <Plus size={18} className="mr-2" />
          Create Assignment
        </Button>
        <Button to="/teacher/dashboard" variant="outline" size="lg">
          <FileText size={18} className="mr-2" />
          View Assignments
        </Button>
      </div>
    </div>
  );
}
