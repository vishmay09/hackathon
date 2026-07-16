import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import TopBar from "./components/layout/TopBar";
import Dashboard from "./pages/Dashboard";
import NewStrategy from "./pages/NewStrategy";
import Result from "./pages/Result";
import History from "./pages/History";
import Settings from "./pages/Settings";
import { HistoryProvider } from "./contexts/HistoryContext";
import Tools from "./pages/Tools"; 

export default function App() {
  return (
    <BrowserRouter>
      <HistoryProvider>
        <div className="flex">
          <Sidebar />
          <main className="flex-1 min-h-screen">
            <TopBar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/new" element={<NewStrategy />} />
              <Route path="/result/:id" element={<Result />} />
              <Route path="/history" element={<History />} />
              <Route path="/templates" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/help" element={<Settings />} />
              <Route path="/tools" element={<Tools />} />
            </Routes>
          </main>
        </div>
      </HistoryProvider>
    </BrowserRouter>
  );
}