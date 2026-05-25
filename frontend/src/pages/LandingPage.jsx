import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Zap, ShieldCheck, GraduationCap, ArrowRight,
  CheckCircle2, FileText, Sparkles,
  BarChart3, ChevronRight, ChevronDown,
  Menu, X, Mail,
  Twitter, Linkedin, Instagram
} from 'lucide-react';
import Container from '../components/ui/Container';
import VedaLogo from '../components/vedaai/VedaLogo';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

function CountUp({ end, suffix = '', prefix = '', duration = 1.5 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const startTime = Date.now();
        const animate = () => {
          const elapsed = (Date.now() - startTime) / (duration * 1000);
          const progress = Math.min(elapsed, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(eased * end));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

const STATS = [
  { num: 2, prefix: '<', suffix: 's', label: 'Generation Time' },
  { num: 50, suffix: '+', label: 'Questions/Test' },
  { num: 3, suffix: '', label: 'Question Types' },
  { num: 0, text: 'AI', label: 'Powered Engine' },
];

const FEATURES = [
  { icon: Zap, title: 'AI Question Generation', desc: 'Upload a PDF and let AI generate structured question papers with MCQs, short answers, and long answers — categorized by difficulty.', tag: 'CORE', span: 'md:col-span-5' },
  { icon: FileText, title: 'PDF Upload & Parsing', desc: 'Upload any document as a PDF. Our backend extracts and chunks text using RAG foundations, with OCR fallback for scanned documents.', tag: 'UPLOAD', span: 'md:col-span-7' },
  { icon: ShieldCheck, title: 'Structured Output', desc: 'View generated question papers in a clean, exam-style format with sections, difficulty tags, marks, and answer keys. Download as PDF.', tag: 'OUTPUT', span: 'md:col-span-7' },
  { icon: BarChart3, title: 'Background Processing', desc: 'AI generation runs as background jobs via a queue system. Real-time progress updates keep you informed while questions are being created.', tag: 'SYSTEM', span: 'md:col-span-5' },
];

const TESTIMONIALS = [
  { quote: "I created an entire question paper from a 40-page PDF in under 10 seconds. VedaAI is a game changer.", author: "Dr. Amit Desai", role: "Professor, Computer Science" },
  { quote: "The structured output with sections and difficulty tags looks exactly like a real exam paper. My students couldn't tell the difference.", author: "Prof. Neha Sharma", role: "Head of Examinations" },
  { quote: "Upload, configure, generate. Three steps and my weekly quiz is ready. This saves me hours every week.", author: "Rajiv V.", role: "High School Teacher" },
];

const FAQS = [
  { q: "What document formats are supported?", a: "VedaAI accepts PDF files. Our parser extracts text from digital PDFs, and for scanned documents, we use Gemini's multimodal OCR to read the content visually." },
  { q: "What types of questions can it generate?", a: "VedaAI generates Multiple Choice Questions (MCQs with 4 options), Short Answer Questions, and Long Answer Questions. You can configure the count and marks for each type." },
  { q: "How does the AI generation work?", a: "Your PDF is uploaded to our Fastify backend, text is extracted and chunked (RAG foundation), then sent to Groq or Gemini LLMs with structured prompts. Questions are validated with Zod schemas before being returned." },
  { q: "Can I download the generated question paper?", a: "Yes! The output page renders a structured exam-style document with student info fields, sections, difficulty tags, and an answer key. You can download it as a PDF directly from the browser." },
];

function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border-b border-border ${open ? 'bg-surface-muted' : ''}`}>
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 px-4 text-left group">
        <div className="flex gap-4 items-center">
          <span className="text-text-subtle font-mono text-xs">0{index + 1}</span>
          <span className={`text-base font-medium transition-colors ${open ? 'text-primary' : 'text-text-muted group-hover:text-primary'}`}>{q}</span>
        </div>
        <ChevronDown size={16} className={`text-text-subtle transition-transform ${open ? 'rotate-180 text-primary' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
            <p className="pb-5 px-4 pl-14 text-text-muted text-sm leading-relaxed max-w-2xl">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TestimonialSlider() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((p) => (p + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="max-w-3xl mx-auto text-center">
      <p className="text-xs font-semibold text-text-subtle uppercase tracking-widest mb-8">What educators say</p>
      <div className="min-h-[140px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div key={idx} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.5 }}>
            <h3 className="text-2xl md:text-3xl font-semibold text-primary mb-6 leading-snug">&ldquo;{TESTIMONIALS[idx].quote}&rdquo;</h3>
            <p className="font-semibold text-primary">{TESTIMONIALS[idx].author}</p>
            <p className="text-sm text-text-muted mt-0.5">{TESTIMONIALS[idx].role}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex justify-center gap-2 mt-8">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIdx(i)}
            className={`h-2 rounded-full transition-all ${i === idx ? 'bg-primary w-6' : 'bg-border w-2'}`}
            aria-label={`Testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-background text-primary overflow-x-hidden">
      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-lg border-b border-border">
        <Container className="h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <VedaLogo to="/" size="sm" />
            <span className="hidden sm:block text-[9px] font-medium text-text-subtle border border-border rounded-full px-2 py-0.5">v2.0</span>
          </div>

          <div className="hidden lg:flex items-center gap-7 text-[13px] font-medium text-text-muted">
            {['Features', 'How it Works', 'FAQ'].map((t) => (
              <a key={t} href={`#${t.toLowerCase().replace(/ /g, '-')}`} className="hover:text-primary transition-colors">
                {t}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <Link to="/login" className="hidden sm:block text-[13px] font-medium text-text-muted hover:text-primary transition-colors">
              Sign In
            </Link>
            <Link
              to="/login"
              className="hidden sm:flex items-center gap-1.5 px-5 py-2 bg-primary text-white rounded-full text-[13px] font-semibold hover:bg-primary-hover transition-colors"
            >
              Get Started <ArrowRight size={14} />
            </Link>
            <button type="button" onClick={() => setMobileMenu(!mobileMenu)} className="lg:hidden p-2 text-text-muted" aria-label="Menu">
              {mobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </Container>

        <AnimatePresence>
          {mobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-b border-border shadow-soft"
            >
              <div className="p-5 space-y-3">
                {['Features', 'How it Works', 'FAQ'].map((t) => (
                  <a key={t} href={`#${t.toLowerCase().replace(/ /g, '-')}`} onClick={() => setMobileMenu(false)} className="block text-sm font-medium text-text-muted">
                    {t}
                  </a>
                ))}
                <div className="pt-3 border-t border-border flex gap-2">
                  <Link to="/login" className="flex-1 text-center py-2.5 text-sm font-medium text-primary border border-border rounded-full">
                    Sign In
                  </Link>
                  <Link to="/login" className="flex-1 text-center py-2.5 text-sm font-semibold text-white bg-primary rounded-full">
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center pt-14">
        <Container className="relative z-10 py-20">
          <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col items-center text-center max-w-5xl mx-auto">
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-text-muted text-xs font-semibold mb-8 border border-border shadow-soft"
            >
              <Sparkles size={14} className="text-primary" />
              AI Assessment Creator
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight mb-6 text-primary">
              Create AI-powered
              <br className="hidden sm:block" />
              question papers instantly.
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg md:text-xl text-text-muted leading-relaxed mb-10 max-w-2xl">
              Upload a PDF, configure question types, and let AI generate structured assessments with sections, difficulty levels, and answer keys — all in seconds.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                to="/login"
                className="group flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-semibold text-base hover:bg-primary-hover transition-all shadow-soft"
              >
                Start for Free
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-2 px-8 py-4 border-2 border-primary bg-white rounded-full font-semibold text-base text-primary hover:bg-surface-muted transition-all"
              >
                Watch Demo
              </Link>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-veda-xl overflow-hidden border border-border w-full max-w-2xl shadow-soft"
            >
              {STATS.map((s) => (
                <div key={s.label} className="bg-white px-6 py-5 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary">
                    {s.text ? s.text : <CountUp end={s.num} prefix={s.prefix || ''} suffix={s.suffix || ''} />}
                  </div>
                  <div className="text-[11px] font-medium text-text-muted mt-1 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* STORY */}
      <section className="py-24 bg-white border-y border-border">
        <Container>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="max-w-3xl mx-auto text-center mb-16">
              <p className="text-xs font-semibold text-text-subtle uppercase tracking-[0.2em] mb-4">How It Works</p>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">From PDF to Question Paper</h2>
              <p className="text-lg text-text-muted leading-relaxed">
                Three simple steps to generate a complete, structured assessment.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { num: '01', title: 'Upload Your Document', desc: 'Upload any PDF — textbooks, notes, or study material. Our backend extracts text and chunks it intelligently. Scanned PDFs are handled via multimodal OCR automatically.' },
                { num: '02', title: 'Configure & Generate', desc: 'Choose question types (MCQ, short, long), set difficulty, and specify the number of questions. AI processes your content through a background job queue and generates structured questions.' },
                { num: '03', title: 'View & Download', desc: 'See your question paper rendered in a clean, exam-style format with student info fields, sections, difficulty tags, marks, and an answer key. Download as PDF with one click.' },
              ].map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="relative p-8 rounded-veda-xl border border-border bg-background group hover:shadow-card transition-all"
                >
                  <span className="text-5xl font-bold text-border absolute top-4 right-6">{step.num}</span>
                  <h3 className="text-xl font-bold text-primary mb-3">{step.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>

            <div className="max-w-2xl mx-auto text-center mt-16">
              <p className="text-xl md:text-2xl text-text-muted leading-relaxed">
                &ldquo;Built for educators who want to spend less time creating tests and more time teaching.&rdquo;
              </p>
              <p className="mt-6 text-sm font-semibold text-text-subtle">— The VedaAI Team</p>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 bg-background">
        <Container>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <motion.div variants={fadeUp} className="mb-14 text-center">
              <p className="text-xs font-semibold text-text-subtle uppercase tracking-[0.2em] mb-3">Powerful Features</p>
              <h2 className="text-4xl md:text-5xl font-bold text-primary">Everything you need</h2>
            </motion.div>

            <div className="grid md:grid-cols-12 gap-4">
              {FEATURES.map((f) => (
                <motion.div
                  key={f.title}
                  variants={fadeUp}
                  className={`group ${f.span} bg-white border border-border rounded-veda-xl p-6 hover:shadow-card transition-all`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-surface-muted border border-border flex items-center justify-center text-primary">
                      <f.icon size={20} />
                    </div>
                    <span className="text-[10px] font-semibold text-text-muted bg-surface-muted border border-border px-2 py-1 rounded-full">
                      {f.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-primary">{f.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* WHO */}
      <section id="how-it-works" className="py-20 bg-white border-y border-border">
        <Container>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.p variants={fadeUp} className="text-xs font-semibold text-text-subtle uppercase tracking-widest mb-2">
                Built for Everyone
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-primary mb-10">
                Who uses VedaAI?
              </motion.h2>

              <div className="space-y-8">
                {[
                  { icon: ShieldCheck, label: 'INSTRUCTOR', title: 'For Teachers', items: ['AI-generated question banks', 'One-click test deployment', 'Real-time class analytics'], cta: 'Instructor Mode' },
                  { icon: GraduationCap, label: 'STUDENT', title: 'For Students', items: ['Take tests on any device', 'Instant AI feedback', 'Track your progress'], cta: 'Student Portal' },
                ].map((t) => (
                  <motion.div key={t.title} variants={fadeUp} className="pl-6 border-l-2 border-primary">
                    <span className="text-[10px] font-semibold text-text-subtle uppercase tracking-wider">{t.label}</span>
                    <h3 className="text-xl font-semibold mt-1 mb-3 flex items-center gap-2 text-primary">
                      <t.icon size={20} /> {t.title}
                    </h3>
                    <ul className="space-y-2 mb-4">
                      {t.items.map((item) => (
                        <li key={item} className="flex items-center gap-2.5 text-text-muted text-sm">
                          <CheckCircle2 size={14} className="text-primary shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Link to="/login" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline underline-offset-4">
                      {t.cta} <ChevronRight size={14} />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div variants={fadeUp} className="hidden lg:block">
              <div className="bg-background border border-border rounded-veda-xl p-8 shadow-soft">
                <div className="bg-white rounded-veda border border-border p-5 shadow-soft mb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-surface-muted rounded-lg flex items-center justify-center border border-border">
                      <Zap size={16} className="text-primary" />
                    </div>
                    <div>
                      <div className="h-3 w-28 bg-border rounded" />
                      <div className="h-2 w-40 bg-surface-muted rounded mt-1.5" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { v: '14', l: 'Tests' },
                      { v: '312', l: 'Students' },
                      { v: '87%', l: 'Avg' },
                    ].map((s, i) => (
                      <div key={i} className="bg-surface-muted border border-border rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-primary">{s.v}</div>
                        <div className="text-[10px] font-medium text-text-muted">{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-veda border border-border p-4 shadow-soft">
                  {[1, 2].map((i) => (
                    <div key={i} className={`flex items-center gap-3 py-3 ${i < 2 ? 'border-b border-border' : ''}`}>
                      <div className="w-9 h-9 bg-surface-muted rounded-lg flex items-center justify-center border border-border text-text-muted">
                        <FileText size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="h-2.5 w-24 bg-border rounded mb-1.5" />
                        <div className="h-2 w-16 bg-surface-muted rounded" />
                      </div>
                      <div className="text-xs font-semibold text-text-muted">View →</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-background">
        <Container>
          <TestimonialSlider />
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-veda-xl bg-primary p-12 md:p-16 text-center overflow-hidden"
          >
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Ready to create?</h2>
              <p className="text-white/70 max-w-lg mx-auto mb-8 text-base">
                Generate your first AI question paper in under 60 seconds. Upload a PDF and go.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-10 py-4 bg-white text-primary rounded-full font-bold text-base hover:bg-surface-muted transition-colors shadow-soft"
              >
                Start Free <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-background">
        <Container>
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
                <p className="text-xs font-semibold text-text-subtle uppercase tracking-widest mb-2">FAQ</p>
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Common questions</h2>
                <p className="text-text-muted text-sm leading-relaxed mb-8 max-w-sm">
                  Everything you need to know about VedaAI&apos;s platform.
                </p>
                <div className="flex items-center gap-4 p-4 rounded-veda bg-white border border-border shadow-soft">
                  <div className="w-10 h-10 rounded-lg bg-surface-muted border border-border flex items-center justify-center text-primary">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-text-muted">Need help?</p>
                    <a href="mailto:support@vedaai.app" className="text-sm font-semibold text-primary hover:underline">
                      support@vedaai.app
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="lg:col-span-7">
              <div className="bg-white rounded-veda-xl border border-border overflow-hidden shadow-soft">
                {FAQS.map((faq, i) => (
                  <FAQItem key={i} index={i} q={faq.q} a={faq.a} />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FOOTER */}
      <footer className="pt-16 pb-8 bg-primary text-white">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">V</span>
                </div>
                <span className="font-bold">VedaAI</span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed max-w-xs">
                AI-powered assessment creator for modern educators. Upload, generate, download.
              </p>
              <div className="flex gap-3 mt-4">
                {[Twitter, Linkedin, Instagram, Mail].map((Icon, i) => (
                  <a key={i} href="#" className="text-white/40 hover:text-white transition-colors" aria-label="Social">
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
            {Object.entries({
              Product: ['Features', 'Pricing', 'Changelog'],
              Platform: ['Security', 'Analytics', 'Integrations'],
              Company: ['About', 'Blog', 'Contact'],
            }).map(([cat, links]) => (
              <div key={cat}>
                <h4 className="text-xs font-semibold uppercase tracking-wider mb-3 text-white/90">{cat}</h4>
                <ul className="space-y-2">
                  {links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-xs text-white/50 hover:text-white transition-colors">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-6 border-t border-white/15 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-[11px] text-white/50">© {new Date().getFullYear()} VedaAI. All rights reserved.</p>
            <div className="flex gap-4">
              {['Privacy', 'Terms', 'Security'].map((t) => (
                <a key={t} href="#" className="text-[11px] text-white/50 hover:text-white transition-colors">
                  {t}
                </a>
              ))}
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}
