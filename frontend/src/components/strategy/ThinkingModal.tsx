import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Brain, Check } from "lucide-react";

const STEPS = [
  "Analyzing Problem",
  "Finding Root Cause",
  "Understanding Stakeholders",
  "Researching Existing Solutions",
  "Designing Innovation",
  "Creating Architecture",
  "Planning Development",
  "Assigning Team Tasks",
  "Preparing Demo Strategy",
  "Generating Final Strategy",
];

export default function ThinkingModal({ open }: { open: boolean }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!open) { setStep(0); return; }
    const id = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 2200);
    return () => clearInterval(id);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }}
            className="bg-white dark:bg-ink-800 rounded-3xl p-8 max-w-md w-full shadow-lift"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-gradient flex items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }}>
                  <Brain className="w-6 h-6 text-white" />
                </motion.div>
              </div>
              <div>
                <div className="font-display font-semibold">Commander is thinking</div>
                <div className="text-xs text-ink-500">Orchestrating your winning strategy…</div>
              </div>
            </div>

            <div className="space-y-2">
              {STEPS.map((s, i) => {
                const done = i < step;
                const active = i === step;
                return (
                  <motion.div
                    key={s}
                    animate={{ opacity: i <= step ? 1 : 0.35 }}
                    className="flex items-center gap-3 py-1.5 text-sm"
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      done ? "bg-primary-500 text-white" : active ? "bg-primary-100" : "bg-ink-100/50"
                    }`}>
                      {done ? <Check className="w-3 h-3" /> :
                        active ? <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}
                                             className="w-1.5 h-1.5 rounded-full bg-primary-500" /> : null}
                    </div>
                    <span className={active ? "font-medium" : ""}>{s}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}