import { motion } from "framer-motion";

export default function Timeline({ items }: { items: { hour: string; milestone: string; owner: string }[] }) {
  return (
    <div className="relative pl-6">
      <div className="absolute left-2 top-0 bottom-0 w-px bg-primary-500/20" />
      {items.map((t, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="relative pb-4"
        >
          <div className="absolute -left-[19px] top-1.5 w-3 h-3 rounded-full bg-brand-gradient ring-4 ring-white dark:ring-ink-800" />
          <div className="flex items-baseline gap-3">
            <span className="text-xs font-mono text-primary-500 font-semibold">{t.hour}</span>
            <span className="text-sm font-medium">{t.milestone}</span>
          </div>
          <div className="text-xs text-ink-500 mt-0.5">Owner: {t.owner}</div>
        </motion.div>
      ))}
    </div>
  );
}