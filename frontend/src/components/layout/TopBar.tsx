import { Search, Download, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

export default function TopBar() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="h-16 sticky top-0 z-20 flex items-center gap-4 px-8 border-b border-primary-500/5 glass">
      <h1 className="font-display font-semibold text-lg tracking-tight">
        Hackathon <span className="gradient-text">Commander</span>
      </h1>

      <div className="flex-1 max-w-xl mx-auto relative">
        
      </div>

     
      <button
        onClick={() => setDark((d) => !d)}
        className="p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-ink-700 text-ink-500"
      >
        {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
    </header>
  );
}