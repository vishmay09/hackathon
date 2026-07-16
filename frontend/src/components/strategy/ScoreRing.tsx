import { motion } from "framer-motion";

export default function ScoreRing({ value = 0, highlight }: { value?: number; highlight?: boolean }) {
  const r = 28, c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;

  return (
    <div className="flex items-center gap-3">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} stroke={highlight ? "rgba(255,255,255,0.25)" : "#EEF2FF"} strokeWidth="6" fill="none" />
        <motion.circle
          cx="36" cy="36" r={r}
          stroke={highlight ? "white" : "#456EFE"}
          strokeWidth="6" fill="none" strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          transform="rotate(-90 36 36)"
        />
      </svg>
      <div>
        <div className="text-2xl font-display font-bold">{value}</div>
        <div className={`text-[10px] uppercase tracking-wider ${highlight ? "opacity-80" : "text-ink-500"}`}>/ 100</div>
      </div>
    </div>
  );
}