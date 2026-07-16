import { useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "../contexts/HistoryContext";
import { Card } from "../components/ui/Card";
import { Copy, Edit3, Trash2, Search } from "lucide-react";

export default function History() {
  const { items, remove, rename, duplicate } = useHistory();
  const [q, setQ] = useState("");
  const filtered = items.filter((i) => i.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">History</h1>
        <p className="text-ink-500 text-sm mt-1">All your generated strategies, stored locally.</p>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
        <input value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Search…"
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-primary-500/10 focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
      </div>

      {filtered.length === 0 && (
        <Card><div className="text-center text-sm text-ink-500 py-10">No strategies found.</div></Card>
      )}

      <div className="space-y-3">
        {filtered.map((it) => (
          <Card key={it.id} className="flex items-center justify-between">
            <div className="flex-1">
              <Link to={`/result/${it.id}`} className="font-medium hover:text-primary-500">{it.title}</Link>
              <div className="text-xs text-ink-500 mt-1">
                {new Date(it.createdAt).toLocaleString()} • Score {it.strategy.scores?.winning_potential}
              </div>
            </div>
            <div className="flex gap-2">
              <IconBtn onClick={() => {
                const t = prompt("Rename", it.title); if (t) rename(it.id, t);
              }}><Edit3 className="w-4 h-4" /></IconBtn>
              <IconBtn onClick={() => duplicate(it.id)}><Copy className="w-4 h-4" /></IconBtn>
              <IconBtn danger onClick={() => confirm("Delete?") && remove(it.id)}>
                <Trash2 className="w-4 h-4" />
              </IconBtn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function IconBtn({ children, onClick, danger }: any) {
  return (
    <button onClick={onClick}
      className={`p-2 rounded-lg ${danger ? "hover:bg-red-50 text-red-500" : "hover:bg-primary-50 text-ink-500"}`}>
      {children}
    </button>
  );
}