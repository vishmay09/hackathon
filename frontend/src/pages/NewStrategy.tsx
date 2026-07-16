import {
  useState,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  X,
  Server,
  Smartphone,
  Bug,
  Palette,
  Brain,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  Card,
  SectionTitle,
} from "../components/ui/Card";
import {
  generateStrategy,
  previewStrategy,
} from "../services/api";
import { useHistory } from "../contexts/HistoryContext";
import ThinkingModal from "../components/strategy/ThinkingModal";
import clsx from "clsx";

/* ─────────────── Types ─────────────── */

type Role = {
  id: string;
  icon: LucideIcon;
  color: string;
};

type PreviewData = {
  complexity?: string;
  innovation_score?: number;
  difficulty?: string;
  build_time_hours?: number;
  winning_potential?: number;
};

/* ─────────────── Roles ─────────────── */

const ROLES: Role[] = [
  {
    id: "AI/ML Developer",
    icon: Brain,
    color: "from-purple-500 to-indigo-500",
  },
  {
    id: "Backend Developer",
    icon: Server,
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "Flutter Developer",
    icon: Smartphone,
    color: "from-sky-500 to-blue-500",
  },
  {
    id: "Android Developer",
    icon: Smartphone,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "QA Tester",
    icon: Bug,
    color: "from-orange-500 to-red-500",
  },
  {
    id: "UI/UX Designer",
    icon: Palette,
    color: "from-pink-500 to-rose-500",
  },
];

/* ─────────────── Page ─────────────── */

export default function NewStrategy() {
  const navigate = useNavigate();
  const { add } = useHistory();

  const [statement, setStatement] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [duration, setDuration] = useState(24);
  const [constraints, setConstraints] = useState("");
  const [technologies, setTechnologies] =
    useState("");
  const [audience, setAudience] = useState("");
  const [demoTime, setDemoTime] = useState(5);
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] =
    useState(false);
  const [preview, setPreview] =
    useState<PreviewData | null>(null);

  /* ─────────────── Team Roles ─────────────── */

  const toggleRole = (role: string) => {
    setRoles((currentRoles) =>
      currentRoles.includes(role)
        ? currentRoles.filter(
            (currentRole) => currentRole !== role
          )
        : [...currentRoles, role]
    );

    setPreview(null);
  };

  const canGenerate =
    statement.trim().length > 20 &&
    roles.length > 0 &&
    !loading;

  /* ─────────────── Preview ─────────────── */

  const doPreview = async () => {
    if (
      statement.trim().length < 30 ||
      previewLoading
    ) {
      return;
    }

    try {
      setPreviewLoading(true);

      const previewResult = await previewStrategy(
        statement.trim(),
        roles
      );

      setPreview(previewResult as PreviewData);
    } catch (error) {
      console.error(
        "Strategy preview failed:",
        error
      );
    } finally {
      setPreviewLoading(false);
    }
  };

  /* ─────────────── Generate and Cloud Save ─────────────── */

  const handleGenerate = async () => {
    if (!canGenerate) return;

    setLoading(true);

    try {
      const request = {
        statement: statement.trim(),
        team_roles: roles,
        duration_hours: duration,
        constraints: constraints.trim(),
        technologies: technologies.trim(),
        target_audience: audience.trim(),
        demo_time_minutes: demoTime,
        additional_notes: notes.trim(),
      };

      /*
       * Generate the strategy from the FastAPI backend.
       */
      const strategy = await generateStrategy(request);

      /*
       * Generate an ID for the cloud history record.
       */
      const id = crypto.randomUUID();

      /*
       * Save through HistoryContext.
       * HistoryContext should send this data to your
       * cloud database through the backend.
       */
      await add({
        id,
        title:
          statement.trim().slice(0, 60) ||
          "Untitled Strategy",
        createdAt: Date.now(),
        request,
        strategy,
      });

      /*
       * Open the result only after cloud saving succeeds.
       */
      navigate(`/result/${id}`);
    } catch (error) {
      console.error(
        "Strategy generation or cloud saving failed:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Unknown error";

      window.alert(
        `Generation or cloud saving failed: ${message}`
      );
    } finally {
      setLoading(false);
    }
  };

  /* ─────────────── Clear Statement ─────────────── */

  const clearStatement = () => {
    setStatement("");
    setPreview(null);
  };

  /* ─────────────── Example Statement ─────────────── */

  const useExample = () => {
    setStatement(
      "Design an AI-powered mental wellness companion for college students that reduces anxiety through personalized micro-interventions and connects users with peer support anonymously."
    );

    setPreview(null);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-hero-glow min-h-screen">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_320px] gap-8">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-xs uppercase tracking-[0.25em] text-primary-500 mb-2">
              New Strategy
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-bold">
              Build{" "}
              <span className="gradient-text">
                Winning Hackathon
              </span>{" "}
              Solutions with AI
            </h1>

            <p className="text-ink-500 mt-2">
              Describe the problem, pick your team, and
              let Commander orchestrate victory.
            </p>
          </motion.div>

          {/* Problem Statement */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <SectionTitle>
                Problem Statement
              </SectionTitle>

              <div className="text-xs text-ink-500">
                {statement.length} chars
              </div>
            </div>

            <div className="relative rounded-xl border border-primary-500/10 transition focus-within:border-primary-500/30 focus-within:ring-2 focus-within:ring-primary-500/10">
              <textarea
                value={statement}
                onChange={(event) => {
                  setStatement(event.target.value);
                  setPreview(null);
                }}
                onBlur={() => {
                  void doPreview();
                }}
                placeholder="Paste your hackathon problem statement here. For example: Design an AI-powered platform that helps rural farmers predict crop yield…"
                className="w-full min-h-[220px] p-4 bg-transparent resize-none focus:outline-none text-[15px] leading-relaxed"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              {statement && (
                <button
                  type="button"
                  onClick={clearStatement}
                  className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg text-ink-500 hover:bg-ink-100/50 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear
                </button>
              )}

              <button
                type="button"
                onClick={useExample}
                className="text-xs px-3 py-2 rounded-lg text-primary-500 hover:bg-primary-50 transition-colors"
              >
                Use example
              </button>
            </div>
          </Card>

          {/* Team Composition */}
          <Card>
            <SectionTitle>
              Team Composition
            </SectionTitle>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {ROLES.map((role) => {
                const active = roles.includes(role.id);
                const RoleIcon = role.icon;

                return (
                  <motion.button
                    type="button"
                    key={role.id}
                    onClick={() =>
                      toggleRole(role.id)
                    }
                    whileTap={{ scale: 0.97 }}
                    aria-pressed={active}
                    className={clsx(
                      "relative p-4 rounded-xl text-left border transition-all",
                      active
                        ? "border-primary-500 bg-primary-50 shadow-soft"
                        : "border-primary-500/10 hover:border-primary-500/40"
                    )}
                  >
                    <div
                      className={clsx(
                        "w-9 h-9 rounded-lg flex items-center justify-center mb-3 bg-gradient-to-br text-white",
                        role.color
                      )}
                    >
                      <RoleIcon className="w-4 h-4" />
                    </div>

                    <div className="text-sm font-medium">
                      {role.id}
                    </div>

                    {active && (
                      <motion.div
                        layoutId="selected-role-check"
                        className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary-500"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {roles.length > 0 && (
              <div className="mt-4 text-xs text-ink-500">
                Selected {roles.length} role
                {roles.length > 1 ? "s" : ""}:{" "}
                {roles.join(" • ")}
              </div>
            )}
          </Card>

          {/* Optional Configuration */}
          <Card>
            <SectionTitle>
              Optional Configuration
            </SectionTitle>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <Field label="Hackathon Duration (hours)">
                <input
                  type="number"
                  min={1}
                  max={1000}
                  value={duration}
                  onChange={(event) =>
                    setDuration(
                      Math.max(
                        1,
                        Number(event.target.value) || 1
                      )
                    )
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Demo Time (minutes)">
                <input
                  type="number"
                  min={1}
                  max={180}
                  value={demoTime}
                  onChange={(event) =>
                    setDemoTime(
                      Math.max(
                        1,
                        Number(event.target.value) || 1
                      )
                    )
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Constraints">
                <input
                  value={constraints}
                  onChange={(event) =>
                    setConstraints(event.target.value)
                  }
                  placeholder="No paid APIs, offline demo…"
                  className={inputClass}
                />
              </Field>

              <Field label="Available Technologies">
                <input
                  value={technologies}
                  onChange={(event) =>
                    setTechnologies(
                      event.target.value
                    )
                  }
                  placeholder="React, FastAPI, Postgres…"
                  className={inputClass}
                />
              </Field>

              <Field label="Target Audience">
                <input
                  value={audience}
                  onChange={(event) =>
                    setAudience(event.target.value)
                  }
                  placeholder="College students, rural users…"
                  className={inputClass}
                />
              </Field>

              <Field label="Additional Notes">
                <input
                  value={notes}
                  onChange={(event) =>
                    setNotes(event.target.value)
                  }
                  placeholder="Any other requirements…"
                  className={inputClass}
                />
              </Field>
            </div>
          </Card>

          {/* Generate Button */}
          <motion.button
            type="button"
            whileHover={
              canGenerate ? { scale: 1.01 } : {}
            }
            whileTap={
              canGenerate ? { scale: 0.99 } : {}
            }
            disabled={!canGenerate}
            onClick={() => {
              void handleGenerate();
            }}
            className={clsx(
              "w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 transition-all",
              canGenerate
                ? "bg-brand-gradient shadow-lift hover:shadow-2xl"
                : "bg-ink-300 cursor-not-allowed"
            )}
          >
            <Sparkles className="w-4 h-4" />

            {loading
              ? "Generating and saving..."
              : "Generate Winning Strategy"}
          </motion.button>

          {!canGenerate && !loading && (
            <p className="text-center text-xs text-ink-400">
              Enter at least 20 characters and select
              one or more team roles.
            </p>
          )}
        </div>

        {/* Right Sidebar */}
        <aside className="space-y-4">
          <Card className="sticky top-24">
            <SectionTitle>
              Live Analysis
            </SectionTitle>

            <div className="space-y-4 text-sm">
              <PreviewRow
                label="Selected Roles"
                value={
                  roles.length
                    ? String(roles.length)
                    : "—"
                }
              />

              <PreviewRow
                label="Complexity"
                value={preview?.complexity ?? "—"}
              />

              <PreviewRow
                label="Innovation Score"
                value={
                  preview?.innovation_score ?? "—"
                }
                bar={preview?.innovation_score}
              />

              <PreviewRow
                label="Difficulty"
                value={preview?.difficulty ?? "—"}
              />

              <PreviewRow
                label="Est. Build Time"
                value={
                  preview?.build_time_hours !==
                  undefined
                    ? `${preview.build_time_hours}h`
                    : "—"
                }
              />

              <PreviewRow
                label="Winning Potential"
                value={
                  preview?.winning_potential ?? "—"
                }
                bar={preview?.winning_potential}
                highlight
              />
            </div>

            <button
              type="button"
              onClick={() => {
                void doPreview();
              }}
              disabled={
                statement.trim().length < 30 ||
                previewLoading
              }
              className="w-full mt-4 py-2 rounded-lg text-xs text-primary-600 border border-primary-500/20 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {previewLoading
                ? "Analyzing..."
                : "Refresh Preview"}
            </button>
          </Card>
        </aside>
      </div>

      <ThinkingModal open={loading} />
    </div>
  );
}

/* ─────────────── Shared Styles ─────────────── */

const inputClass =
  "w-full px-3 py-2 bg-white dark:bg-ink-800 border border-primary-500/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/30";

/* ─────────────── Field Component ─────────────── */

type FieldProps = {
  label: string;
  children: ReactNode;
};

function Field({
  label,
  children,
}: FieldProps) {
  return (
    <label className="block">
      <div className="text-[11px] uppercase tracking-wider text-ink-500 mb-1">
        {label}
      </div>

      {children}
    </label>
  );
}

/* ─────────────── Preview Row ─────────────── */

type PreviewRowProps = {
  label: string;
  value: ReactNode;
  bar?: number;
  highlight?: boolean;
};

function PreviewRow({
  label,
  value,
  bar,
  highlight = false,
}: PreviewRowProps) {
  const safeBar =
    typeof bar === "number"
      ? Math.min(100, Math.max(0, bar))
      : undefined;

  return (
    <div>
      <div className="flex justify-between gap-3 mb-1">
        <span className="text-[11px] uppercase tracking-wider text-ink-500">
          {label}
        </span>

        <span
          className={clsx(
            "font-semibold text-right",
            highlight && "gradient-text"
          )}
        >
          {value}
        </span>
      </div>

      {safeBar !== undefined && (
        <div className="h-1.5 rounded-full bg-primary-50 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${safeBar}%` }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
            className="h-full bg-brand-gradient"
          />
        </div>
      )}
    </div>
  );
}