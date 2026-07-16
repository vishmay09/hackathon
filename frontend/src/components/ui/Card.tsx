import { motion, HTMLMotionProps } from "framer-motion";
import clsx from "clsx";

export function Card({ className, children, ...rest }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.35 }}
      className={clsx(
        "rounded-2xl bg-white dark:bg-ink-800 border border-primary-500/8 shadow-soft p-6",
        className
      )}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-display font-semibold text-base tracking-tight mb-4">
      {children}
    </h3>
  );
}