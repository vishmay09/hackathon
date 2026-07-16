import { useParams, Link } from "react-router-dom";
import { useHistory } from "../contexts/HistoryContext";
import { Card, SectionTitle } from "../components/ui/Card";
import {
  Trophy, Target, Users, Lightbulb, Layers, Code, Database, GitBranch,
  Calendar, Play, MessageSquare, ShieldAlert, Sparkles, ArrowLeft,
} from "lucide-react";
import ExportMenu from "../components/strategy/ExportMenu";
import KanbanBoard from "../components/strategy/KanbanBoard";
import Timeline from "../components/strategy/Timeline";
import TeamTaskCards from "../components/strategy/TeamTaskCards";
import ScoreRing from "../components/strategy/ScoreRing";

// Failsafe array converter to guarantee .map() never crashes
function ensureArray<T = any>(val: any): T[] {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") return val.split("\n").filter(Boolean) as any;
  if (val && typeof val === "object") return Object.values(val) as any;
  return [];
}

// Crisp Light Theme Badge Renderer for Tech Stack items
function renderBadges(val: any) {
  if (Array.isArray(val)) {
    return val.map((item, idx) => (
      <span key={idx} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white text-slate-800 border border-slate-200 shadow-2xs">
        {typeof item === "object" ? JSON.stringify(item) : String(item)}
      </span>
    ));
  }
  if (typeof val === "string") {
    return val.split(",").map((item, idx) => (
      <span key={idx} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white text-slate-800 border border-slate-200 shadow-2xs">
        {item.trim()}
      </span>
    ));
  }
  if (val && typeof val === "object") {
    return Object.entries(val).map(([k, v], idx) => (
      <span key={idx} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white text-slate-800 border border-slate-200 shadow-2xs">
        <span className="text-indigo-600 font-bold">{k}:</span> {String(v)}
      </span>
    ));
  }
  return <span className="text-xs text-slate-500">{String(val || "N/A")}</span>;
}

export default function Result() {
  const { id } = useParams();
  const { items } = useHistory();
  const item = items.find((x) => x.id === id);

  if (!item) return (
    <div className="p-12 text-center bg-hero-glow min-h-screen flex flex-col items-center justify-center">
      <p className="text-slate-600 text-lg font-medium">Strategy not found in local archive.</p>
      <Link to="/new" className="text-indigo-600 hover:text-indigo-700 font-bold mt-3 inline-flex items-center gap-1">
        ← Create a new strategy
      </Link>
    </div>
  );

  const s = item.strategy || {};

  return (
    <div id="result-root" className="p-6 md:p-10 max-w-6xl mx-auto space-y-6 text-slate-900 bg-hero-glow min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <Link to="/history" className="text-xs font-bold text-slate-500 flex items-center gap-1 mb-2 hover:text-indigo-600 transition">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Strategy History
          </Link>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">{item.title}</h1>
          <div className="text-xs font-medium text-slate-500 mt-1.5 flex items-center gap-2">
            <span>{new Date(item.createdAt).toLocaleString()}</span>
            <span>•</span>
            <span className="bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded border border-indigo-200/60">
              {item.request?.team_roles?.length ?? 0} roles assigned
            </span>
          </div>
        </div>
        
      </div>

      {/* Scores */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ScoreCard label="Winning Potential" value={s.scores?.winning_potential ?? 0} icon={Trophy} highlight />
        <ScoreCard label="Innovation" value={s.scores?.innovation ?? 0} icon={Sparkles} />
        <ScoreCard label="Feasibility" value={s.scores?.feasibility ?? 0} icon={Target} />
        <ScoreCard label="Impact" value={s.scores?.impact ?? 0} icon={ShieldAlert} />
      </div>

      {/* Executive Summary */}
      <Section icon={Trophy} title="Executive Summary">
        <p className="text-[15px] leading-relaxed text-slate-700 font-normal whitespace-pre-line">{s.executive_summary}</p>
      </Section>

      {/* Winning Strategy Banner */}
      <Card className="bg-brand-gradient text-white border-none p-6 shadow-md shadow-indigo-500/10 rounded-2xl">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-5 h-5 text-amber-300" />
          <h3 className="font-display font-extrabold text-lg">Final Winning Execution Strategy</h3>
        </div>
        <p className="leading-relaxed opacity-95 text-sm md:text-base whitespace-pre-line">{s.winning_strategy}</p>
      </Card>

      {/* Root Cause + Pain Points */}
      <div className="grid md:grid-cols-2 gap-6">
        <Section icon={Target} title="Root Cause Analysis">
          <ul className="space-y-2.5">
            {ensureArray(s.root_cause_analysis).map((r, i) => (
              <li key={i} className="flex gap-2.5 text-xs md:text-sm text-slate-700 font-medium">
                <span className="text-indigo-600 font-extrabold">{String(i+1).padStart(2,"0")}.</span> {r}
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={ShieldAlert} title="Pain Points">
          <div className="flex flex-wrap gap-2">
            {ensureArray(s.pain_points).map((p, i) => (
              <span key={i} className="px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold text-xs shadow-2xs">
                {p}
              </span>
            ))}
          </div>
        </Section>
      </div>

      {/* Stakeholders */}
      <Section icon={Users} title="Stakeholder Analysis">
        <div className="grid md:grid-cols-3 gap-3.5">
          {ensureArray(s.stakeholders).map((st, i) => (
            <div key={i} className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50">
              <div className="flex justify-between items-center">
                <div className="font-bold text-sm text-slate-900">{st.name}</div>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                  st.influence === "High" ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "bg-slate-100 text-slate-600 border-slate-200"
                }`}>{st.influence}</span>
              </div>
              <div className="text-xs text-slate-600 mt-2 leading-relaxed">{st.interest}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Existing Solutions vs Innovation */}
      <div className="grid md:grid-cols-2 gap-6">
        <Section icon={Layers} title="Existing Solutions & Gaps">
          <div className="space-y-3">
            {ensureArray(s.existing_solutions).map((e, i) => (
              <div key={i} className="p-3.5 border-l-4 border-indigo-600 bg-indigo-50/40 rounded-r-xl border-y border-r border-indigo-100">
                <div className="font-bold text-sm text-slate-900">{e.name}</div>
                <div className="text-xs text-slate-600 mt-1">{e.gap}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section icon={Lightbulb} title="Innovation Opportunities">
          <ul className="space-y-2.5 text-xs md:text-sm text-slate-700 font-medium">
            {ensureArray(s.innovation_opportunities).map((o, i) => (
              <li key={i} className="flex gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" /> {o}
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* Features */}
      <Section icon={Layers} title="Feature Breakdown">
        <div className="grid md:grid-cols-3 gap-3.5">
          {ensureArray(s.features).map((f, i) => (
            <div key={i} className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="font-bold text-sm text-slate-900">{f.name}</div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                    f.priority === "P0" ? "bg-red-50 text-red-700 border-red-200" :
                    f.priority === "P1" ? "bg-amber-50 text-amber-700 border-amber-200" :
                    "bg-indigo-50 text-indigo-700 border-indigo-200"
                  }`}>{f.priority}</span>
                </div>
                <div className="text-xs text-slate-600 leading-relaxed">{f.description}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Architecture */}
      <Section icon={Code} title="Technical Architecture">
        <p className="text-sm text-slate-600 mb-4">{s.technical_architecture?.overview}</p>
        <div className="grid md:grid-cols-2 gap-3.5">
          {ensureArray(s.technical_architecture?.layers).map((l, i) => (
            <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="font-bold text-sm text-slate-900 mb-1">{l.name}</div>
              <div className="text-xs text-slate-600 leading-relaxed">{l.description}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Technology Stack */}
      <Section icon={Code} title="Technology Stack">
        <SafeTechStack techStack={s.tech_stack} />
      </Section>

      {/* DB + API */}
      <div className="grid md:grid-cols-2 gap-6">
        <Section icon={Database} title="Database Design">
          <div className="space-y-3">
            {ensureArray(s.database_design).map((d, i) => (
              <div key={i} className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <div className="bg-indigo-50 border-b border-indigo-100 px-3.5 py-2 text-xs font-bold text-indigo-700">{d.entity}</div>
                <div className="p-3.5 text-xs text-slate-700 space-y-1 bg-white font-mono">
                  {ensureArray(d.fields).map((f, idx) => <div key={idx}>• {String(f)}</div>)}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section icon={GitBranch} title="API Design">
          <div className="space-y-2">
            {ensureArray(s.api_design).map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 border border-slate-200/80 rounded-xl bg-white text-xs">
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                  a.method === "GET" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                  a.method === "POST" ? "bg-indigo-50 text-indigo-700 border-indigo-200" :
                  a.method === "DELETE" ? "bg-red-50 text-red-700 border-red-200" :
                  "bg-amber-50 text-amber-700 border-amber-200"
                }`}>{a.method}</span>
                <code className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">{a.path}</code>
                <span className="text-xs text-slate-500 ml-auto font-medium">{a.purpose}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Folder Structure */}
      <Section icon={Layers} title="Folder Structure">
        <pre className="bg-slate-900 text-emerald-400 text-xs p-4 rounded-xl overflow-auto font-mono border border-slate-800 shadow-sm">
{s.folder_structure || "// Folder structure ready"}
        </pre>
      </Section>

      {/* Timeline & Interactive Kanban */}
      <Section icon={Calendar} title="Implementation Timeline">
        <Timeline items={ensureArray(s.timeline)} />
      </Section>

      <Section icon={Layers} title="Interactive Kanban Board">
        <KanbanBoard kanban={s.kanban || { "To Do": [], "In Progress": [], Done: [] }} />
      </Section>

      <Section icon={Users} title="Team Task Assignment">
        <TeamTaskCards tasks={ensureArray(s.team_tasks)} />
      </Section>

      {/* Demo Flow */}
      <Section icon={Play} title="Demo Flow">
        <div className="space-y-2.5">
          {ensureArray(s.demo_flow).map((d, i) => (
            <div key={i} className="flex items-center gap-3.5 p-3.5 border border-slate-200/90 rounded-xl bg-white shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-brand-gradient text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
                {d.step || i + 1}
              </div>
              <div className="flex-1 text-sm font-semibold text-slate-800">{d.action}</div>
              <div className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-1 rounded-lg">{d.duration_sec}s</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Judge Q&A */}
      <Section icon={MessageSquare} title="Anticipated Judge Questions">
        <div className="space-y-3">
          {ensureArray(s.judge_questions).map((q, i) => (
            <details key={i} className="group p-4 border border-slate-200/90 bg-slate-50/50 rounded-xl">
              <summary className="cursor-pointer font-bold text-sm text-slate-900">Q: {q.question}</summary>
              <div className="mt-2 text-xs md:text-sm text-slate-600 leading-relaxed pl-4 border-l-2 border-indigo-500">A: {q.answer}</div>
            </details>
          ))}
        </div>
      </Section>

      {/* Risks Analysis */}
      <Section icon={ShieldAlert} title="Risk Analysis">
        <div className="grid md:grid-cols-2 gap-3.5">
          {ensureArray(s.risks).map((r, i) => (
            <div key={i} className="p-4 rounded-xl border border-slate-200 bg-white">
              <div className="flex justify-between items-center mb-1.5">
                <div className="font-bold text-sm text-slate-900">{r.risk}</div>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                  r.severity === "High" ? "bg-red-50 text-red-700 border-red-200" :
                  r.severity === "Medium" ? "bg-amber-50 text-amber-700 border-amber-200" :
                  "bg-emerald-50 text-emerald-700 border-emerald-200"
                }`}>{r.severity}</span>
              </div>
              <div className="text-xs text-slate-600"><b>Mitigation:</b> {r.mitigation}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Future Scope */}
      <Section icon={Sparkles} title="Future Scope & Expansion">
        <div className="flex flex-wrap gap-2">
          {ensureArray(s.future_scope).map((f, i) => (
            <span key={i} className="px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold shadow-2xs">
              {f}
            </span>
          ))}
        </div>
      </Section>
    </div>
  );
}

// Dedicated Light Mode Tech Stack Component
function SafeTechStack({ techStack }: { techStack: any }) {
  if (!techStack) return <div className="text-xs text-slate-500">No technology stack specified.</div>;

  // Case 1: Tech stack is an Array of Objects [{ category: "Frontend", items: [...] }]
  if (Array.isArray(techStack)) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {techStack.map((item, i) => {
          const label = typeof item === "object" ? (item.category || item.name || item.layer || `Layer ${i + 1}`) : `Category ${i + 1}`;
          const items = typeof item === "object" ? (item.items || item.technologies || item.tools || item) : item;
          return (
            <div key={i} className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 shadow-2xs">
              <div className="text-[11px] uppercase tracking-wider text-indigo-600 font-extrabold mb-2.5">{String(label)}</div>
              <div className="flex flex-wrap gap-1.5">{renderBadges(items)}</div>
            </div>
          );
        })}
      </div>
    );
  }

  // Case 2: Tech stack is a Key-Value Object { frontend: ["React"], backend: "Node" }
  if (typeof techStack === "object") {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {Object.entries(techStack).map(([category, value], i) => (
          <div key={i} className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 shadow-2xs">
            <div className="text-[11px] uppercase tracking-wider text-indigo-600 font-extrabold mb-2.5">
              {category.replace(/_/g, " ")}
            </div>
            <div className="flex flex-wrap gap-1.5">{renderBadges(value)}</div>
          </div>
        ))}
      </div>
    );
  }

  // Case 3: Plain String
  return <div className="flex flex-wrap gap-1.5">{renderBadges(techStack)}</div>;
}

function Section({ icon: Icon, title, children }: any) {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
          <Icon className="w-4 h-4" />
        </div>
        <SectionTitle>{title}</SectionTitle>
      </div>
      {children}
    </Card>
  );
}

function ScoreCard({ label, value, icon: Icon, highlight }: any) {
  return (
    <Card className={highlight ? "bg-brand-gradient text-white border-none shadow-md" : "bg-white border-slate-200 text-slate-900"}>
      <div className="flex items-center justify-between mb-3">
        <div className={`text-xs font-bold uppercase tracking-wider ${highlight ? "opacity-90" : "text-slate-500"}`}>{label}</div>
        <Icon className={`w-4 h-4 ${highlight ? "opacity-90" : "text-indigo-600"}`} />
      </div>
      <ScoreRing value={value} highlight={highlight} />
    </Card>
  );
}