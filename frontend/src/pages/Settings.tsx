import { useState } from "react";
import { Card, SectionTitle } from "../components/ui/Card";

export default function Settings() {
  const [apiURL, setApiURL] = useState(localStorage.getItem("api_url") || "http://localhost:8000/api");

  const save = () => {
    localStorage.setItem("api_url", apiURL);
    alert("Saved. Restart may be required.");
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="font-display text-3xl font-bold">Settings</h1>

      <Card>
        <SectionTitle>Backend Configuration</SectionTitle>
        <label className="block text-xs uppercase tracking-wider text-ink-500 mb-1">API Endpoint</label>
        <input value={apiURL} onChange={(e) => setApiURL(e.target.value)}
          className="w-full px-3 py-2 border border-primary-500/10 rounded-lg" />
        <button onClick={save} className="mt-4 px-5 py-2 bg-brand-gradient text-white rounded-lg text-sm font-semibold">Save</button>
      </Card>

      <Card>
        <SectionTitle>AI Engine</SectionTitle>
        <div className="text-sm text-ink-500">
          Powered exclusively by <span className="gradient-text font-semibold">NVIDIA Nemotron</span>.
          Configure your API key in the backend <code>.env</code> file.
        </div>
      </Card>

      <Card>
        <SectionTitle>Data & Privacy</SectionTitle>
        <p className="text-sm text-ink-500 mb-3">All strategies are stored locally in your browser (localStorage).</p>
        <button onClick={() => { localStorage.clear(); alert("Cleared!"); }}
          className="text-xs px-3 py-2 rounded-lg text-red-500 border border-red-200 hover:bg-red-50">
          Clear All Local Data
        </button>
      </Card>
    </div>
  );
}