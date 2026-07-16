import { Download } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { Strategy } from "../../types/strategy";

export default function ExportMenu({ strategy, title }: { strategy: Strategy; title: string }) {
  const exportPDF = async () => {
    const el = document.getElementById("result-root");
    if (!el) return;
    const canvas = await html2canvas(el, { scale: 2, backgroundColor: "#F7F9FF" });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const w = pdf.internal.pageSize.getWidth();
    const h = (canvas.height * w) / canvas.width;
    pdf.addImage(img, "PNG", 0, 0, w, h);
    pdf.save(`${title}.pdf`);
  };

  const exportMarkdown = () => {
    const md = `# ${title}\n\n## Executive Summary\n${strategy.executive_summary}\n\n## Winning Strategy\n${strategy.winning_strategy}`;
    downloadBlob(md, `${title}.md`, "text/markdown");
  };

  const copyJSON = async () => {
    await navigator.clipboard.writeText(JSON.stringify(strategy, null, 2));
    alert("Copied to clipboard!");
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-gradient text-white text-sm font-semibold shadow-lift">
        <Download className="w-4 h-4" /> Export
      </button>
      <div className="absolute right-0 top-full mt-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition bg-white rounded-xl shadow-lift border border-primary-500/10 p-1 w-40 z-30">
        <Item onClick={exportPDF}>PDF</Item>
        <Item onClick={exportMarkdown}>Markdown</Item>
        <Item onClick={copyJSON}>Copy JSON</Item>
      </div>
    </div>
  );
}

function Item({ children, onClick }: any) {
  return (
    <button onClick={onClick} className="block w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-primary-50">
      {children}
    </button>
  );
}

function downloadBlob(content: string, name: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}