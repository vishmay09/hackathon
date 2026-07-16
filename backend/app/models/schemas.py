from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class StrategyRequest(BaseModel):
    statement: str = Field(..., min_length=10)
    team_roles: List[str] = Field(default_factory=list)
    duration_hours: Optional[int] = 24
    constraints: Optional[str] = ""
    technologies: Optional[str] = ""
    target_audience: Optional[str] = ""
    demo_time_minutes: Optional[int] = 5
    additional_notes: Optional[str] = ""

class PreviewRequest(BaseModel):
    statement: str
    team_roles: List[str] = []

class PreviewResponse(BaseModel):
    complexity: str
    innovation_score: int
    difficulty: str
    build_time_hours: int
    winning_potential: int