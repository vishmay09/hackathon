export interface StrategyRequest {
  statement: string;
  team_roles: string[];
  duration_hours?: number;
  constraints?: string;
  technologies?: string;
  target_audience?: string;
  demo_time_minutes?: number;
  additional_notes?: string;
}

export interface Strategy {
  executive_summary: string;
  root_cause_analysis: string[];
  problem_breakdown: { aspect: string; detail: string }[];
  stakeholders: { name: string; interest: string; influence: string }[];
  pain_points: string[];
  existing_solutions: { name: string; gap: string }[];
  innovation_opportunities: string[];
  proposed_solution: string;
  business_value: string[];
  features: { name: string; priority: string; description: string }[];
  technical_architecture: { overview: string; layers: { name: string; description: string }[] };
  ai_architecture: { models: string[]; pipeline: string };
  tech_stack: Record<string, string[]>;
  database_design: { entity: string; fields: string[] }[];
  api_design: { method: string; path: string; purpose: string }[];
  folder_structure: string;
  roadmap: { phase: string; hours: string; tasks: string[] }[];
  timeline: { hour: string; milestone: string; owner: string }[];
  kanban: { todo: string[]; in_progress: string[]; done: string[] };
  team_tasks: TeamTask[];
  testing_plan: { type: string; approach: string }[];
  demo_flow: { step: number; action: string; duration_sec: number }[];
  presentation_flow: { slide: string; content: string }[];
  judge_questions: { question: string; answer: string }[];
  future_scope: string[];
  risks: { risk: string; mitigation: string; severity: string }[];
  impact_analysis: { social: string; economic: string; environmental: string };
  winning_strategy: string;
  scores: { innovation: number; feasibility: number; impact: number; winning_potential: number };
}

export interface TeamTask {
  role: string;
  responsibilities: string[];
  priority: string;
  deliverables: string[];
  estimated_hours: number;
  dependencies: string[];
  milestones: string[];
  testing_checklist: string[];
  completion_criteria: string[];
}

export interface HistoryItem {
  id: string;
  title: string;
  createdAt: number;
  request: StrategyRequest;
  strategy: Strategy;
}