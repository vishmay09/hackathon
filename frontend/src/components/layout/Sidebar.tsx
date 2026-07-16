import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Sparkles,
  History,
  Settings,
  HelpCircle,
  Layers,
  Command,
  Wrench,
  Zap,
} from "lucide-react";
import clsx from "clsx";

const NAV = [
  { to: "/",          label: "Dashboard",       icon: LayoutDashboard },
  { to: "/new",       label: "New Strategy",    icon: Sparkles },
  { to: "/tools",     label: "Tools",        icon: Wrench },
  { to: "/history",   label: "History",         icon: History },
  // { to: "/templates", label: "Templates",       icon: Layers },
  // { to: "/settings",  label: "Settings",        icon: Settings },
  // { to: "/help",      label: "Help",            icon: HelpCircle },
];

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 border-r border-slate-200/80 bg-white/90 backdrop-blur-md px-4 py-6 flex flex-col justify-between z-40">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Command className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-display font-extrabold text-slate-900 leading-tight text-base">
              Commander
            </div>
            <div className="text-[10px] font-mono font-bold text-indigo-600 tracking-widest uppercase flex items-center gap-1">
              <Zap className="w-3 h-3 fill-indigo-600" /> Hackathon AI
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {NAV.map((n, i) => (
            <NavLink key={n.to} to={n.to} end={n.to === "/"}>
              {({ isActive }) => (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={clsx(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all",
                    isActive
                      ? "bg-brand-gradient text-white shadow-md shadow-indigo-500/20"
                      : "text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/80"
                  )}
                >
                  <n.icon className={clsx("w-4 h-4", isActive ? "text-white" : "text-slate-400")} />
                  {n.label}
                </motion.div>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Powered By Footer */}
      <div className="rounded-2xl p-4 bg-slate-50 border border-slate-200/80 text-slate-900 text-xs shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <span className="font-bold text-slate-900">Powered by NVIDIA</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <div className="text-[11px] text-slate-500 leading-relaxed font-medium">
          Nemotron • Ultra low latency reasoning
        </div>
      </div>
    </aside>
  );
}