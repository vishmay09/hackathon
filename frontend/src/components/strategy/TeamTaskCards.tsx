import type { TeamTask } from "../../types/strategy";
import { Clock, CheckCircle2, GitBranch, Flag } from "lucide-react";

export default function TeamTaskCards({ tasks }: { tasks: TeamTask[] }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {tasks.map((t) => (
        <div key={t.role} className="p-5 rounded-xl border border-primary-500/10 hover:shadow-soft transition">
          <div className="flex justify-between items-start mb-3">
            <div className="font-semibold">{t.role}</div>
            <span className={`text-[10px] px-2 py-0.5 rounded ${
              t.priority === "High" ? "bg-red-100 text-red-600" :
              t.priority === "Medium" ? "bg-amber-100 text-amber-600" :
              "bg-primary-100 text-primary-600"
            }`}>{t.priority}</span>
          </div>

          <Meta icon={Clock} label={`${t.estimated_hours}h`} />

          <Block title="Responsibilities" items={t.responsibilities} />
          <Block title="Deliverables"     items={t.deliverables} />
          <Block title="Milestones"       items={t.milestones} icon={Flag} />
          <Block title="Dependencies"     items={t.dependencies} icon={GitBranch} />
          <Block title="Testing Checklist" items={t.testing_checklist} icon={CheckCircle2} />
          <Block title="Completion Criteria" items={t.completion_criteria} />
        </div>
      ))}
    </div>
  );
}

function Meta({ icon: Icon, label }: any) {
  return (
    <div className="inline-flex items-center gap-1 text-xs text-ink-500 mb-3">
      <Icon className="w-3 h-3" /> {label}
    </div>
  );
}

function Block({ title, items }: { title: string; items?: string[]; icon?: any }) {
  if (!items?.length) return null;
  return (
    <div className="mt-3">
      <div className="text-[10px] uppercase tracking-wider text-ink-500 font-semibold mb-1">{title}</div>
      <ul className="text-xs text-ink-500 space-y-1">
        {items.map((x, i) => <li key={i}>• {x}</li>)}
      </ul>
    </div>
  );
}