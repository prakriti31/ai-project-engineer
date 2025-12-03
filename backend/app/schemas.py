from pydantic import BaseModel
from typing import Dict, List, Optional

class AnalysisResponse(BaseModel):
    breakdown: Dict[str, List[str]]
    risks: List[str]
    questions: List[str]
    timeline: List[str]   # ✅ now Pydantic knows TimelineItem
    raw: Optional[str] = None