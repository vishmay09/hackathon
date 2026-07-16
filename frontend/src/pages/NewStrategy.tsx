import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import {
  Sparkles, Upload, Mic, X, Cpu, Server, Smartphone, Bug, Palette, Brain, Rocket,
} from "lucide-react";
import { Card, SectionTitle } from "../components/ui/Card";
import { generateStrategy, uploadFile, previewStrategy } from "../services/api";
import { useHistory } from "../contexts/HistoryContext";
import ThinkingModal from "../components/strategy/ThinkingModal";
import clsx from "clsx";

const ROLES = [
  { id: "AI/ML Developer",     icon: Brain,      color: "from-purple-500 to-indigo-500" },
  { id: "Backend Developer",   icon: Server,     color: "from-emerald-500 to-teal-500" },
  { id: "Flutter Developer",   icon: Smartphone, color: "from-sky-500 to-blue-500" },
  { id: "Android Developer",   icon: Smartphone, color: "from-green-500 to-emerald-500" },
  { id: "QA Tester",           icon: Bug,        color: "from-orange-500 to-red-500" },
  { id: "UI/UX Designer",      icon: Palette,    color: "from-pink-500 to-rose-500" },
];

export default function NewStrategy() {
  const nav = useNavigate();
  const { add } = useHistory();

  const [statement, setStatement] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [duration, setDuration] = useState(24);
  const [constraints, setConstraints] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [audience, setAudience] = useState("");
  const [demoTime, setDemoTime] = useState(5);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<any>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "text/plain": [".txt"],
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    onDrop: async ([file]) => {
      if (!file) return;
      const text = await uploadFile(file);
      setStatement((s) => (s ? s + "\n\n" : "") + text);
    },
  });

  const toggleRole = (r: string) =>
    setRoles((s) => (s.includes(r) ? s.filter((x) => x !== r) : [...s, r]));

  const canGenerate = statement.trim().length > 20 && roles.length > 0;

  const doPreview = async () => {
    if (statement.trim().length < 30) return;
    try {
      const p = await previewStrategy(statement, roles);
      setPreview(p);
    } catch {}
  };

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setLoading(true);
    try {
      const strategy = await generateStrategy({
        statement, team_roles: roles, duration_hours: duration,
        constraints, technologies, target_audience: audience,
        demo_time_minutes: demoTime, additional_notes: notes,
      });
      const id = crypto.randomUUID();
      add({
        id, title: statement.slice(0, 60), createdAt: Date.now(),
        request: {
          statement, team_roles: roles, duration_hours: duration,
          constraints, technologies, target_audience: audience,
          demo_time_minutes: demoTime, additional_notes: notes,
        },
        strategy,
      });
      nav(`/result/${id}`);
    } catch (e: any) {
      alert("Generation failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const voiceInput = () => {
    // @ts-ignore
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Voice not supported");
    const r = new SR();
    r.lang = "en-US"; r.continuous = false;
    r.onresult = (e: any) => setStatement((s) => s + " " + e.results[0][0].transcript);
    r.start();
  };

  return (
    <div className="p-8 bg-hero-glow">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_320px] gap-8">
        {/* MAIN */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-xs uppercase tracking-[0.25em] text-primary-500 mb-2">New Strategy</div>
            <h1 className="font-display text-3xl md:text-4xl font-bold">
              Build <span className="gradient-text">Winning Hackathon</span> Solutions with AI
            </h1>
            <p className="text-ink-500 mt-2">
              Describe the problem, pick your team, and let Commander orchestrate victory.
            </p>
          </motion.div>

          {/* Statement */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <SectionTitle>Problem Statement</SectionTitle>
              <div className="text-xs text-ink-500">{statement.length} chars</div>
            </div>

            <div className={clsx("relative rounded-xl border-2 border-dashed transition p-1",
                   isDragActive ? "border-primary-500 bg-primary-50" : "border-transparent")}>
              <div {...getRootProps()} className="absolute inset-0 pointer-events-none">
                <input {...getInputProps()} />
              </div>
              <textarea
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                onBlur={doPreview}
                placeholder="Paste your hackathon problem statement here. e.g. 'Design an AI-powered platform that helps rural farmers predict crop yield…'"
                className="w-full min-h-[220px] p-4 bg-transparent resize-none focus:outline-none text-[15px] leading-relaxed relative z-10"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <button {...getRootProps()} className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100">
                <input {...getInputProps()} />
                <Upload className="w-3.5 h-3.5" /> Upload PDF / DOCX / TXT
              </button>
              <button onClick={voiceInput} className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100">
                <Mic className="w-3.5 h-3.5" /> Voice
              </button>
              {statement && (
                <button onClick={() => setStatement("")}
                  className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg text-ink-500 hover:bg-ink-100/50">
                  <X className="w-3.5 h-3.5" /> Clear
                </button>
              )}
              <button onClick={() => setStatement(
                "Design an AI-powered mental wellness companion for college students that reduces anxiety through personalized micro-interventions and connects users with peer support anonymously."
              )}
                className="text-xs px-3 py-2 rounded-lg text-primary-500 hover:underline">
                Use example
              </button>
            </div>
          </Card>

          {/* Team */}
          <Card>
            <SectionTitle>Team Composition</SectionTitle>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {ROLES.map((r) => {
                const active = roles.includes(r.id);
                return (
                  <motion.button
                    key={r.id}
                    onClick={() => toggleRole(r.id)}
                    whileTap={{ scale: 0.97 }}
                    className={clsx(
                      "relative p-4 rounded-xl text-left border transition-all",
                      active
                        ? "border-primary-500 bg-primary-50 shadow-soft"
                        : "border-primary-500/10 hover:border-primary-500/40"
                    )}
                  >
                    <div className={clsx(
                      "w-9 h-9 rounded-lg flex items-center justify-center mb-3 bg-gradient-to-br text-white",
                      r.color
                    )}>
                      <r.icon className="w-4 h-4" />
                    </div>
                    <div className="text-sm font-medium">{r.id}</div>
                    {active && (
                      <motion.div layoutId="check" className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary-500" />
                    )}
                  </motion.button>
                );
              })}
            </div>
            {roles.length > 0 && (
              <div className="mt-4 text-xs text-ink-500">
                Selected {roles.length} role{roles.length > 1 ? "s" : ""}: {roles.join(" • ")}
              </div>
            )}
          </Card>

          {/* Optional */}
          <Card>
            <SectionTitle>Optional Configuration</SectionTitle>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <Field label="Hackathon Duration (hours)">
                <input type="number" value={duration} onChange={(e) => setDuration(+e.target.value)} className={input} />
              </Field>
              <Field label="Demo Time (minutes)">
                <input type="number" value={demoTime} onChange={(e) => setDemoTime(+e.target.value)} className={input} />
              </Field>
              <Field label="Constraints">
                <input value={constraints} onChange={(e) => setConstraints(e.target.value)}
                  placeholder="No paid APIs, offline demo…" className={input} />
              </Field>
              <Field label="Available Technologies">
                <input value={technologies} onChange={(e) => setTechnologies(e.target.value)}
                  placeholder="React, FastAPI, Postgres…" className={input} />
              </Field>
              <Field label="Target Audience">
                <input value={audience} onChange={(e) => setAudience(e.target.value)}
                  placeholder="College students, rural users…" className={input} />
              </Field>
              <Field label="Additional Notes">
                <input value={notes} onChange={(e) => setNotes(e.target.value)} className={input} />
              </Field>
            </div>
          </Card>

          <motion.button
            whileHover={canGenerate ? { scale: 1.01 } : {}}
            whileTap={canGenerate ? { scale: 0.99 } : {}}
            disabled={!canGenerate || loading}
            onClick={handleGenerate}
            className={clsx(
              "w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 transition-all",
              canGenerate ? "bg-brand-gradient shadow-lift hover:shadow-2xl" : "bg-ink-300 cursor-not-allowed"
            )}
          >
            <Sparkles className="w-4 h-4" />
            Generate Winning Strategy
          </motion.button>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="space-y-4">
          <Card className="sticky top-24">
            <SectionTitle>Live Analysis</SectionTitle>
            <div className="space-y-4 text-sm">
              <PreviewRow label="Selected Roles"       value={roles.length ? `${roles.length}` : "—"} />
              <PreviewRow label="Complexity"           value={preview?.complexity ?? "—"} />
              <PreviewRow label="Innovation Score"     value={preview?.innovation_score ?? "—"} bar={preview?.innovation_score} />
              <PreviewRow label="Difficulty"           value={preview?.difficulty ?? "—"} />
              <PreviewRow label="Est. Build Time"      value={preview ? `${preview.build_time_hours}h` : "—"} />
              <PreviewRow label="Winning Potential"    value={preview?.winning_potential ?? "—"} bar={preview?.winning_potential} highlight />
            </div>
            <button onClick={doPreview}
              className="w-full mt-4 py-2 rounded-lg text-xs text-primary-600 border border-primary-500/20 hover:bg-primary-50">
              Refresh Preview
            </button>
          </Card>
        </aside>
      </div>

      <ThinkingModal open={loading} />
    </div>
  );
}

const input =
  "w-full px-3 py-2 bg-white dark:bg-ink-800 border border-primary-500/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/30";

function Field({ label, children }: any) {
  return (
    <label className="block">
      <div className="text-[11px] uppercase tracking-wider text-ink-500 mb-1">{label}</div>
      {children}
    </label>
  );
}

function PreviewRow({ label, value, bar, highlight }: any) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-[11px] uppercase tracking-wider text-ink-500">{label}</span>
        <span className={clsx("font-semibold", highlight && "gradient-text")}>{value}</span>
      </div>
      {typeof bar === "number" && (
        <div className="h-1.5 rounded-full bg-primary-50 overflow-hidden">
          <motion.div
            initial={{ width: 0 }} animate={{ width: `${bar}%` }}
            className="h-full bg-brand-gradient"
          />
        </div>
      )}
    </div>
  );
}