import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, GraduationCap, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import VedaLogo from '../components/vedaai/VedaLogo';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError('');
    setLoading(true);

    let result;

    if (isLogin) {
      result = await login(email, password);
    } else {
      result = await signup(email, password);
    }

    if (!result.success) {
      setError(result.error || 'Authentication failed. Please try again.');
      setLoading(false);
      return;
    }

    setLoading(false);

    navigate('/teacher/home', { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-background text-text transition-colors duration-300">
      {/* Left Column - Hero Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-surface border-r border-border p-16 flex-col justify-between relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-brand/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-zinc-900/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute inset-0  opacity-20 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="mb-12">
            <VedaLogo size="lg" />
          </div>

          <div className="space-y-6 max-w-lg">
            <h1 className="text-4xl font-bold leading-[1.15] tracking-tight text-primary">
              Sign in to manage assignments and AI grading.
            </h1>
            <p className="text-lg text-text-muted leading-relaxed">
              Create assignments, collect student submissions, and let AI assist with grading.
            </p>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-md">
          <Card p="md" className="bg-background/80 backdrop-blur-sm border-border hover:border-brand/40 transition-colors">
            <div className="w-10 h-10 bg-brand/10 text-brand border border-brand/20 rounded-lg flex items-center justify-center mb-4">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-display font-bold">Secure Protocol</h3>
            <p className="text-sm text-text-muted mt-1 font-sans">Enterprise-grade security active.</p>
          </Card>
          <Card p="md" className="bg-background/80 backdrop-blur-sm border-border hover:border-zinc-900/40 transition-colors">
            <div className="w-10 h-10 bg-zinc-900/10 text-zinc-900 border border-zinc-900/20 rounded-lg flex items-center justify-center mb-4">
              <GraduationCap size={20} />
            </div>
            <h3 className="font-display font-bold">Dual Interfaces</h3>
            <p className="text-sm text-text-muted mt-1 font-sans">Instructor and Candidate modes.</p>
          </Card>
        </div>
      </div>

      {/* Right Column - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 relative bg-background">
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="text-center lg:text-left mb-10">
            <div className="lg:hidden mb-6 flex justify-center">
              <VedaLogo />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-primary">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-text-muted mt-2 text-sm">
              {isLogin ? 'Enter your credentials to continue.' : 'Join as a teacher or student.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 rounded-md bg-danger/10 border border-danger/20 text-danger text-sm flex items-center gap-3 overflow-hidden"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-danger shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-5">
              <Input 
                label="Email Address"
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@school.edu"
                size="lg"
              />

              <Input 
                label="Password"
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                size="lg"
              />


            </div>

            <Button 
              type="submit" 
              variant="primary"
              loading={loading}
              className="w-full py-4 text-base shadow-soft"
            >
              {isLogin ? 'Sign in' : 'Create account'}
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </form>

          {isLogin && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-border"></div>
                <span className="mx-4 text-xs font-semibold text-text-muted tracking-wider uppercase">Demo Sandbox</span>
                <div className="flex-grow border-t border-border"></div>
              </div>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={async () => {
                    if (loading) return;
                    setLoading(true);
                    setError('');
                    const res = await login('teacher@veda.ai', '123456');
                    if (res.success) {
                      navigate('/teacher/home', { replace: true });
                    } else {
                      setError(res.error || 'Demo login failed');
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary font-display font-bold text-sm transition-all flex items-center justify-center gap-2 group hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ShieldCheck size={16} className="text-primary group-hover:animate-pulse" />
                  Teacher Demo
                </button>
              </div>
            </div>
          )}

          <div className="pt-8 mt-8 border-t border-border text-center">
            <p className="text-text-muted font-medium font-sans text-sm">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-brand font-semibold hover:underline underline-offset-4"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
