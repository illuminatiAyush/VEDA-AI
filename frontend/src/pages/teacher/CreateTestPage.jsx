import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  UploadCloud,
  Calendar,
  Plus,
  File as FileIcon,
  BrainCircuit,
} from 'lucide-react';
import { apiService } from '../../lib/api';
import { toast } from 'sonner';
import Button from '../../components/ui/Button';
import QuestionTypeCard from '../../components/vedaai/QuestionTypeCard';
import { parseDDMMYYYYToISO } from '../../lib/timezone';
import { useLayout } from '../../context/LayoutContext';

const QUESTION_TYPE_LABELS = {
  mcq: 'Multiple Choice Questions',
  short: 'Short Questions',
  long: 'Long Questions',
};

export default function CreateTestPage() {
  const navigate = useNavigate();
  const { refreshAssignmentCount } = useLayout();
  const fileInputRef = useRef(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [questionTypes, setQuestionTypes] = useState([
    { id: 'mcq', count: 4, marks: 4 },
    { id: 'short', count: 4, marks: 4 },
  ]);
  const [difficulty, setDifficulty] = useState('medium');

  const totalQuestions = questionTypes.reduce((s, t) => s + Number(t.count), 0);
  const totalMarks = questionTypes.reduce((s, t) => s + Number(t.marks) * Number(t.count), 0);
  const usedTypes = questionTypes.map((t) => t.id);

  const validateFile = (f) => f?.type === 'application/pdf' || f?.type?.startsWith('image/');

  const setFileValidated = (f) => {
    if (validateFile(f)) {
      setFile(f);
      setError('');
      return true;
    }
    setError('Please upload a PDF or image (JPEG, PNG).');
    toast.error('Please upload a PDF or image (JPEG, PNG).');
    return false;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) {
      setFileValidated(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files?.length) {
      setFileValidated(e.target.files[0]);
    }
  };

  const updateType = (index, field, value) => {
    setQuestionTypes((prev) => prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)));
  };

  const removeType = (index) => {
    setQuestionTypes((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  const addQuestionType = () => {
    const next = ['mcq', 'short', 'long'].find((id) => !usedTypes.includes(id)) || 'mcq';
    setQuestionTypes((prev) => [...prev, { id: next, count: 4, marks: 4 }]);
  };



  const goToStep2 = () => {
    if (!file) {
      toast.error('Please upload a document to continue.');
      setError('Please upload a document to continue.');
      return;
    }
    if (file.type !== 'application/pdf') {
      toast.error('AI generation requires a PDF. Please upload a PDF file.');
      setError('AI generation requires a PDF. Please upload a PDF file.');
      return;
    }
    if (totalQuestions < 1) {
      toast.error('Add at least one question.');
      return;
    }
    setError('');
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenerate = async () => {
    const toastId = toast.loading('Generating assignment via AI...');
    setLoading(true);
    setError('');

    const endTime = parseDDMMYYYYToISO(dueDate);

    try {
      const response = await apiService.generateTest(file, difficulty, totalQuestions);
      const jobId = response.jobId;
      let finalQuestions = null;

      while (!finalQuestions) {
        await new Promise((r) => setTimeout(r, 2000));
        const statusRes = await apiService.getGenerationStatus(jobId);

        if (statusRes.status === 'completed') {
          finalQuestions = statusRes.data.questions;
        } else if (statusRes.status === 'failed') {
          throw new Error(statusRes.error || 'Background AI generation failed');
        } else {
          toast.loading(`Processing... ${statusRes.progress || 0}%`, { id: toastId });
        }
      }

      const questions = finalQuestions.map((q) => {
        const preferred = questionTypes[0]?.id || 'mcq';
        return { ...q, type: q.type || preferred };
      });

      const test = await apiService.createTest({
        title: file.name.replace(/\.[^.]+$/, '') || 'Assignment',
        difficulty,
        duration_minutes: 30,
        total_marks: totalMarks || questions.length,
        content: { questions },
        is_ai_generated: true,
        status: 'draft',
      });

      if (endTime && test?.id) {
        try {
          await apiService.updateTest(test.id, { end_time: endTime });
        } catch {
          /* non-fatal */
        }
      }

      await refreshAssignmentCount();
      toast.success('Assignment generated successfully.', { id: toastId });
      navigate(`/teacher/test/${test.id || test._id}`);
    } catch (err) {
      const msg = err.message || 'Generation failed. Please try again.';
      toast.error(msg, { id: toastId });
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full pb-8">
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="w-16 h-16 border-2 border-border border-t-primary rounded-full animate-spin mb-6" />
            <BrainCircuit className="text-primary mb-4 mx-auto" size={32} />
            <h2 className="text-xl font-bold text-primary mb-2">Generating your assignment...</h2>
            <p className="text-sm text-text-muted max-w-sm">
              Our AI is analyzing your document to construct questions.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-4 mb-4">
        <button
          type="button"
          onClick={() => (step === 1 ? navigate(-1) : setStep(1))}
          className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center shadow-soft shrink-0"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="flex-1 text-center lg:text-left text-lg lg:text-xl font-bold text-primary">
          Create Assignment
        </h1>
      </div>

      <div className="h-1.5 rounded-full bg-surface-muted mb-6 overflow-hidden flex gap-1">
        <div className={`h-full flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-primary' : 'bg-border'}`} />
        <div className={`h-full flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-border'}`} />
      </div>

      {step === 1 ? (
        <div>
          <div className="bg-surface-muted rounded-veda-xl p-4 sm:p-6">
            <div className="bg-white rounded-veda-xl p-6 sm:p-8 shadow-soft">
              <h2 className="text-lg font-bold text-primary mb-1">Assignment Details</h2>
              <p className="text-sm text-text-muted mb-6">Basic information about your assignment</p>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-veda p-8 text-center transition-colors ${
                  isDragging ? 'border-primary bg-surface-muted' : 'border-border bg-surface-muted/50'
                }`}
              >
                {file ? (
                  <div className="space-y-4">
                    <div className="w-14 h-14 bg-white rounded-xl border border-border flex items-center justify-center mx-auto shadow-soft">
                      <FileIcon size={28} className="text-primary" />
                    </div>
                    <p className="font-semibold text-primary truncate">{file.name}</p>
                    <Button type="button" variant="white" size="sm" onClick={() => setFile(null)}>
                      Remove
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="w-14 h-14 bg-white rounded-xl border border-border flex items-center justify-center mx-auto mb-4 shadow-soft">
                      <UploadCloud size={28} className="text-text-muted" />
                    </div>
                    <p className="font-semibold text-primary mb-1">Choose a file or drag & drop it here</p>
                    <p className="text-xs text-text-subtle mb-4">PDF files, up to 20MB</p>
                    <Button type="button" variant="white" size="md" onClick={() => fileInputRef.current?.click()}>
                      Browse Files
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept=".pdf,image/jpeg,image/png"
                      onChange={handleFileSelect}
                    />
                  </>
                )}
              </div>
              <p className="text-xs text-text-subtle text-center mt-3 mb-6">
                Upload images of your preferred document/ image
              </p>

              <label className="block text-sm font-bold text-primary mb-2">Due Date</label>
              <div className="relative mb-6">
                <input
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  placeholder="DD-MM-YYYY"
                  className="w-full bg-surface-muted border border-border rounded-xl py-3 px-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
                <Calendar size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              </div>

              <p className="text-sm font-bold text-primary mb-3">Question Type</p>
              <div className="space-y-4 mb-4">
                {questionTypes.map((qt, index) => (
                  <QuestionTypeCard
                    key={`${qt.id}-${index}`}
                    item={qt}
                    index={index}
                    usedTypes={usedTypes.filter((_, i) => i !== index)}
                    onChange={updateType}
                    onRemove={removeType}
                    canRemove={questionTypes.length > 1}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={addQuestionType}
                className="flex items-center gap-2 text-sm font-bold text-primary mb-8"
              >
                <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                  <Plus size={18} />
                </span>
                Add Question Type
              </button>

              <div className="text-right text-sm font-semibold text-primary space-y-1 border-t border-border pt-4">
                <p>Total Questions : {totalQuestions}</p>
                <p>Total Marks : {totalMarks}</p>
              </div>
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-danger text-center">{error}</p>}

          <div className="flex gap-3 mt-6">
            <Button type="button" variant="white" size="lg" className="flex-1" onClick={() => navigate('/teacher/dashboard')}>
              <ArrowLeft size={18} className="mr-2" />
              Previous
            </Button>
            <Button type="button" variant="primary" size="lg" className="flex-1" onClick={goToStep2} disabled={!file}>
              Next
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="bg-surface-muted rounded-veda-xl p-4 sm:p-6">
            <div className="bg-white rounded-veda-xl p-6 sm:p-8 shadow-soft">
              <h2 className="text-lg font-bold text-primary mb-1">Review & Generate</h2>
              <p className="text-sm text-text-muted mb-6">Confirm details before AI generates your assignment.</p>

              <dl className="space-y-4 text-sm mb-6">
                <div className="flex justify-between border-b border-border pb-3">
                  <dt className="text-text-muted">Document</dt>
                  <dd className="font-semibold text-primary truncate max-w-[60%]">{file?.name}</dd>
                </div>
                <div className="flex justify-between border-b border-border pb-3">
                  <dt className="text-text-muted">Due Date</dt>
                  <dd className="font-semibold text-primary">{dueDate || '—'}</dd>
                </div>
                <div className="flex justify-between border-b border-border pb-3">
                  <dt className="text-text-muted">Difficulty</dt>
                  <dd className="font-semibold text-primary capitalize">
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="bg-surface-muted border border-border rounded-lg px-3 py-1.5 text-sm capitalize"
                    >
                      <option value="easy">easy</option>
                      <option value="medium">medium</option>
                      <option value="hard">hard</option>
                    </select>
                  </dd>
                </div>
                {questionTypes.map((qt) => (
                  <div key={qt.id} className="flex justify-between text-text-muted">
                    <span>{QUESTION_TYPE_LABELS[qt.id]}</span>
                    <span className="text-primary font-medium">
                      {qt.count} × {qt.marks} marks
                    </span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-primary pt-2">
                  <span>Total</span>
                  <span>
                    {totalQuestions} questions · {totalMarks} marks
                  </span>
                </div>
              </dl>


            </div>
          </div>

          {error && <p className="mt-4 text-sm text-danger text-center">{error}</p>}

          <div className="flex gap-3 mt-6">
            <Button type="button" variant="white" size="lg" className="flex-1" onClick={() => setStep(1)} disabled={loading}>
              <ArrowLeft size={18} className="mr-2" />
              Previous
            </Button>
            <Button type="button" variant="primary" size="lg" className="flex-1" onClick={handleGenerate} disabled={loading}>
              Generate Assignment
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
