import axios from "axios";
import type { StrategyRequest, Strategy } from "../types/strategy";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  timeout: 180_000,
});

export async function generateStrategy(req: StrategyRequest): Promise<Strategy> {
  const { data } = await api.post("/strategy/generate", req);
  return data.strategy;
}

export async function previewStrategy(statement: string, roles: string[]) {
  const { data } = await api.post("/strategy/preview", {
    statement, team_roles: roles,
  });
  return data;
}

export async function uploadFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const { data } = await api.post("/upload", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.text;
}