import { motion } from "framer-motion";
import { Card, SectionTitle } from "../components/ui/Card";
import { useHistory } from "../contexts/HistoryContext";
import { Link } from "react-router-dom";
import { Sparkles, TrendingUp, Trophy, Rocket, ArrowRight, Zap } from "lucide-react";

const stats = [
  { label: "Strategies", value: "12", icon: Sparkles, change: "+3" },
  { label: "Winning Score", value: "87", icon: Trophy, change: "+12%" },
  { label: "Avg Complexity", value: "Med", icon: TrendingUp, change: "" },
  { label: "Hours Saved", value: "48h", icon: Zap, change: "+8h" },
];

export default function Dashboard() {
  const { items } = useHistory();

  return (
    <div className="p-8 space-y-8 bg-hero-glow min-h-full">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-xs uppercase tracking-[0.2em] text-primary-500 mb-2">Command Center</div>
        <h1 className="font-display text-4xl font-bold tracking-tight">
          Think Like Champions. <span className="gradient-text">Win Like Legends.</span>
        </h1>
        <p className="text-ink-500 mt-2 max-w-2xl">
          Your AI-powered war room for hackathon supremacy. Transform any problem statement into a
          winning execution strategy.
        </p>
      </motion.div>

     

      {/* Quick actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="col-span-2 bg-brand-gradient text-white border-none relative overflow-hidden">
          <div className="absolute inset-0 opacity-20"
               style={{ background: "radial-gradient(circle at 80% 0%, white, transparent 40%)" }} />
          <div className="relative">
            <Rocket className="w-8 h-8 mb-4" />
            <h2 className="font-display text-2xl font-bold mb-2">Launch a new strategy</h2>
            <p className="opacity-90 mb-6 max-w-md">
              Paste any hackathon problem statement and watch Commander build a complete winning plan.
            </p>
            <Link to="/new"
              className="inline-flex items-center gap-2 bg-white text-primary-600 px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lift transition">
              Start Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Card>

        <Card>
          <SectionTitle>AI Tips</SectionTitle>
          <ul className="space-y-3 text-sm text-ink-500">
            {[
              "Pick 3–4 roles for balanced execution.",
              "Add constraints for laser-focused output.",
              "Use voice input for faster ideation.",
              "Rehearse the demo flow twice.",
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <span className="w-1.5 h-1.5 mt-2 rounded-full bg-primary-500" />
                {t}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Recent */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <SectionTitle>Recent Strategies</SectionTitle>
          <Link to="/history" className="text-xs text-primary-500 hover:underline">View all</Link>
        </div>
        {items.length === 0 ? (
          <div className="text-sm text-ink-500 py-8 text-center">
            No strategies yet. Generate your first winning plan.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {items.slice(0, 4).map((it) => (
              <Link key={it.id} to={`/result/${it.id}`}
                className="p-4 border border-primary-500/8 rounded-xl hover:shadow-soft hover:border-primary-500/20 transition">
                <div className="font-medium text-sm line-clamp-1">{it.title}</div>
                <div className="text-xs text-ink-500 mt-1">
                  Winning Score: {it.strategy.scores?.winning_potential ?? "—"}
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}