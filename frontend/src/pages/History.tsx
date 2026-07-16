import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Copy,
  Edit3,
  Trash2,
  Search,
  Database,
} from "lucide-react";

import { useHistory } from "../contexts/HistoryContext";
import { Card } from "../components/ui/Card";

export default function History() {
  const {
    items,
    loading,
    error,
    remove,
    rename,
    duplicate,
  } = useHistory();

  const [query, setQuery] = useState("");
  const [processingId, setProcessingId] = useState<
    string | null
  >(null);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query
      .trim()
      .toLowerCase();

    if (!normalizedQuery) {
      return items;
    }

    return items.filter((item) => {
      const searchableText = [
        item.title,
        item.request.statement,
        item.request.technologies,
        item.request.target_audience,
        ...item.request.team_roles,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [items, query]);

  const handleRename = async (
    id: string,
    currentTitle: string
  ) => {
    const newTitle = window.prompt(
      "Rename strategy",
      currentTitle
    );

    if (!newTitle?.trim()) return;

    try {
      setProcessingId(id);
      await rename(id, newTitle);
    } catch (renameError) {
      console.error(renameError);
      window.alert("Could not rename strategy.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      setProcessingId(id);
      await duplicate(id);
    } catch (duplicateError) {
      console.error(duplicateError);
      window.alert("Could not duplicate strategy.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Delete this strategy permanently?"
    );

    if (!confirmed) return;

    try {
      setProcessingId(id);
      await remove(id);
    } catch (deleteError) {
      console.error(deleteError);
      window.alert("Could not delete strategy.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary-500 font-semibold mb-2">
          <Database className="w-3.5 h-3.5" />
          IndexedDB Storage
        </div>

        <h1 className="font-display text-3xl font-bold">
          History
        </h1>

        <p className="text-ink-500 text-sm mt-1">
          Your generated strategies are saved in this
          browser and remain after refresh.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />

        <input
          type="search"
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
          placeholder="Search strategies…"
          aria-label="Search strategies"
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-primary-500/10 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <Card>
          <div className="text-center text-sm text-ink-500 py-10">
            Loading saved strategies...
          </div>
        </Card>
      )}

      {/* Empty state */}
      {!loading && filteredItems.length === 0 && (
        <Card>
          <div className="text-center py-10">
            <p className="text-sm font-medium text-ink-600">
              {items.length === 0
                ? "No saved strategies yet."
                : "No strategies match your search."}
            </p>

            {items.length === 0 && (
              <Link
                to="/new"
                className="inline-block mt-3 text-sm font-semibold text-primary-600 hover:text-primary-700"
              >
                Generate your first strategy
              </Link>
            )}
          </div>
        </Card>
      )}

      {/* History list */}
      {!loading && (
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const isProcessing =
              processingId === item.id;

            const score =
              item.strategy?.scores
                ?.winning_potential;

            return (
              <Card
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/result/${item.id}`}
                    className="font-medium hover:text-primary-500 transition-colors block truncate"
                  >
                    {item.title}
                  </Link>

                  <div className="text-xs text-ink-500 mt-1">
                    {new Date(
                      item.createdAt
                    ).toLocaleString()}

                    {score !== undefined &&
                      score !== null && (
                        <>
                          {" "}
                          • Score {String(score)}
                        </>
                      )}
                  </div>

                  {item.request.team_roles.length >
                    0 && (
                    <div className="text-xs text-ink-400 mt-2 truncate">
                      {item.request.team_roles.join(
                        " • "
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 shrink-0">
                  <IconBtn
                    label="Rename strategy"
                    disabled={isProcessing}
                    onClick={() =>
                      void handleRename(
                        item.id,
                        item.title
                      )
                    }
                  >
                    <Edit3 className="w-4 h-4" />
                  </IconBtn>

                  <IconBtn
                    label="Duplicate strategy"
                    disabled={isProcessing}
                    onClick={() =>
                      void handleDuplicate(item.id)
                    }
                  >
                    <Copy className="w-4 h-4" />
                  </IconBtn>

                  <IconBtn
                    label="Delete strategy"
                    danger
                    disabled={isProcessing}
                    onClick={() =>
                      void handleDelete(item.id)
                    }
                  >
                    
                  </IconBtn>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

type IconBtnProps = {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  danger?: boolean;
  disabled?: boolean;
};

function IconBtn({
  children,
  onClick,
  label,
  danger = false,
  disabled = false,
}: IconBtnProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={
        danger
          ? "p-2 rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
          : "p-2 rounded-lg text-ink-500 hover:bg-primary-50 disabled:opacity-40 disabled:cursor-not-allowed"
      }
    >
      {children}
    </button>
  );
}