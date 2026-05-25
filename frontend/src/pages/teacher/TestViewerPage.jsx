import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { apiService } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Download, Calendar, XCircle, Clock } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { localInputToISO, isoToLocalInput } from '../../lib/timezone';

const DIFFICULTY_TAG = {
  easy: 'Easy',
  medium: 'Moderate',
  hard: 'Challenging',
};

function QuestionPaperDocument({ test, questions }) {
  const shortAnswers = questions.filter((q) => q.type === 'short' || q.type === 'long');
  const mcqs = questions.filter((q) => q.type === 'mcq');
  const sectionQuestions = shortAnswers.length > 0 ? shortAnswers : mcqs.length > 0 ? mcqs : questions;
  const marksEach = test.total_marks && sectionQuestions.length
    ? Math.max(1, Math.floor(test.total_marks / sectionQuestions.length))
    : 2;

  return (
    <div id="veda-question-paper" className="bg-white rounded-veda-xl p-4 sm:p-10 shadow-soft text-primary text-sm leading-relaxed max-w-3xl mx-auto print:shadow-none">
      <div className="text-center mb-6">
        <h2 className="text-lg sm:text-xl font-bold">Delhi Public School, Sector-4, Bokaro</h2>
        <p className="mt-2 font-medium">Subject: {test.title?.split(' ')[0] || 'Science'}</p>
        <p className="font-medium">Class: 5th</p>
      </div>

      <div className="flex justify-between text-xs sm:text-sm text-text-muted mb-4 border-b border-border pb-4">
        <span>Time Allowed: {test.duration_minutes || 45} minutes</span>
        <span>Maximum Marks: {test.total_marks || sectionQuestions.length * marksEach}</span>
      </div>

      <p className="text-center text-xs text-text-muted mb-6 italic">
        All questions are compulsory unless stated otherwise.
      </p>

      <div className="space-y-2 mb-6 text-sm">
        <p>Name: __________</p>
        <p>Roll Number: __________</p>
        <p>Class: 5th Section: __________</p>
      </div>

      <h3 className="text-center font-bold text-base mb-4">Section A</h3>
      <p className="font-bold mb-1">
        {shortAnswers.length > 0 ? 'Short Answer Questions' : 'Multiple Choice Questions'}
      </p>
      <p className="italic text-text-muted text-xs mb-6">
        *Attempt all questions. Each question carries {marksEach} marks*
      </p>

      <ol className="space-y-4 list-none pl-0">
        {sectionQuestions.map((q, idx) => (
          <li key={idx} className="text-sm">
            <span className="font-medium">{idx + 1}. </span>
            <span className="text-text-muted">[{DIFFICULTY_TAG[q.difficulty] || DIFFICULTY_TAG[test.difficulty] || 'Moderate'}] </span>
            {q.question}
            <span className="text-text-muted"> [{marksEach} Marks]</span>
            {q.type === 'mcq' && q.options?.length > 0 && (
              <ul className="mt-2 ml-6 space-y-1 list-disc text-text-muted">
                {q.options.map((opt, oi) => (
                  <li key={oi}>{String.fromCharCode(65 + oi)}. {opt}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>

      <p className="font-bold mt-8 mb-6">End of Question Paper</p>

      <div className="border-t border-border pt-6">
        <p className="font-bold mb-4">Answer Key:</p>
        <ol className="space-y-3 list-decimal pl-5 text-sm text-text-muted">
          {sectionQuestions.map((q, idx) => (
            <li key={idx} className="leading-relaxed">
              {q.answer || (q.type === 'mcq' ? `Correct option: ${q.answer}` : 'Refer to model answer.')}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default function TestViewerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const firstName =
    user?.name?.split(' ')[0] ||
    user?.email?.split('@')[0]?.replace(/[._]/g, ' ') ||
    'Teacher';
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    duration_minutes: 30,
    start_time: '',
    end_time: '',
  });

  const loadTest = async () => {
    try {
      const data = await apiService.getTestById(id);
      setTest(data);
      if (data.duration_minutes) {
        setScheduleData({
          duration_minutes: data.duration_minutes,
          start_time: isoToLocalInput(data.start_time),
          end_time: isoToLocalInput(data.end_time),
        });
      }
    } catch (err) {
      console.error('Error loading test:', err);
      toast.error(err.message || 'Failed to load test data');
      setError(err.message || 'Test not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTest();
  }, [id]);

  const handleSchedule = async () => {
    setScheduling(true);
    try {
      await apiService.updateTest(id, {
        duration_minutes: scheduleData.duration_minutes,
        start_time: localInputToISO(scheduleData.start_time),
        end_time: localInputToISO(scheduleData.end_time),
        status: 'scheduled',
      });
      toast.success('Test deployed and scheduled successfully.');
      setIsScheduling(false);
      loadTest();
    } catch (err) {
      toast.error(err.message || 'Failed to schedule deployment');
    } finally {
      setScheduling(false);
    }
  };

  const handlePrint = () => {
    toast.info('Opening print dialog — choose "Save as PDF" to download.');
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-border border-t-primary rounded-full animate-spin mb-4" />
        <p className="text-sm text-text-muted">Loading assignment...</p>
      </div>
    );
  }

  if (error || !test) {
    return (
      <Card p="xl" className="max-w-md mx-auto mt-12 text-center">
        <h2 className="text-xl font-bold mb-2">Assignment Not Found</h2>
        <p className="text-text-muted text-sm mb-6">{error || 'This assignment is unavailable.'}</p>
        <Button to="/teacher/dashboard" variant="primary">Back to Assignments</Button>
      </Card>
    );
  }

  const questions = test.questions || [];
  const introText = `Certainly, ${firstName}! Here are customized Question Paper for your CBSE Grade 8 Science classes on the NCERT chapters:`;

  return (
    <div className="w-full max-w-5xl mx-auto pb-12">
      {/* Dark frame — Figma AI toolkit / paper view */}
      <div className="bg-frame rounded-veda-xl p-3 sm:p-8 text-white print:bg-white print:text-primary">
        <p className="text-sm sm:text-base leading-relaxed mb-6 max-w-3xl print:hidden">
          {introText.split('Question Paper').map((part, i, arr) =>
            i < arr.length - 1 ? (
              <span key={i}>{part}<strong>Question Paper</strong></span>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </p>
        <div className="flex flex-wrap gap-3 mb-8 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-primary rounded-full text-sm font-semibold hover:bg-surface-muted transition-colors"
          >
            <Download size={18} />
            Download as PDF
          </button>
          <Link
            to="/teacher/create-test"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/40 text-white rounded-full text-sm font-semibold hover:bg-white/10 lg:hidden"
          >
            + Create New
          </Link>
          <Button onClick={() => setIsScheduling(true)} variant="white" size="md">
            <Calendar size={16} className="mr-2" />
            Schedule
          </Button>
        </div>

        <QuestionPaperDocument test={test} questions={questions} />
      </div>

      {/* Scheduling Modal — unchanged logic */}
      <AnimatePresence>
        {isScheduling && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsScheduling(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg"
            >
              <Card p="xl" className="overflow-hidden border border-border shadow-card">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-primary mb-1">Schedule Assessment</h2>
                    <p className="text-text-muted text-sm">Set dates and duration for this assignment.</p>
                  </div>
                  <button type="button" onClick={() => setIsScheduling(false)} className="p-2 hover:bg-surface-muted rounded-lg">
                    <XCircle size={24} className="text-text-muted" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-text-muted mb-2">Duration (Minutes)</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                      <input
                        type="number"
                        value={scheduleData.duration_minutes}
                        onChange={(e) => setScheduleData({ ...scheduleData, duration_minutes: e.target.value })}
                        className="w-full bg-surface-muted border border-border rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-brand/20 text-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-text-muted mb-2">Start Date & Time</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                        <input
                          type="datetime-local"
                          value={scheduleData.start_time}
                          onChange={(e) => setScheduleData({ ...scheduleData, start_time: e.target.value })}
                          className="w-full bg-surface-muted border border-border rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-brand/20 text-sm cursor-pointer"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-muted mb-2">End Date & Time</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                        <input
                          type="datetime-local"
                          value={scheduleData.end_time}
                          onChange={(e) => setScheduleData({ ...scheduleData, end_time: e.target.value })}
                          className="w-full bg-surface-muted border border-border rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-brand/20 text-sm cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex gap-4">
                  <Button onClick={() => setIsScheduling(false)} variant="outline" className="flex-1">Cancel</Button>
                  <Button onClick={handleSchedule} disabled={scheduling} variant="primary" className="flex-1">
                    {scheduling ? 'Scheduling...' : 'Schedule'}
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
