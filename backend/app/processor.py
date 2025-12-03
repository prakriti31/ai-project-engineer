import os
from typing import List, Dict, Any
from langchain.chat_models import ChatOpenAI
from langchain.schema import SystemMessage, HumanMessage
from .utils import split_into_chunks, extract_text_from_pdf_bytes
import json
import re

OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4")
OPENAI_TEMPERATURE = float(os.getenv("OPENAI_TEMPERATURE", "0.2"))

SYSTEM_PROMPT = """
You are an expert Project Engineer in industrial automation and heavy engineering.

Analyze the provided project description or scope and output JSON with these fields:

1) breakdown: A dictionary mapping discipline names to a list of tasks (MECHANICAL, ELECTRICAL, AUTOMATION/PLC, CIVIL/STRUCTURAL, SAFETY).
2) risks: A list of top execution risks (short items).
3) questions: Missing information or questions to ask the client.
4) timeline: A high-level phased timeline in the form of a gantt chart, which shows the amount of resource that will be required and what type of resource and how much time will it take to finish each task in hours, days and weeks. (each item indicates a phase and estimated duration).

Return a JSON object only, without extra commentary. Keep items concise.
"""

def assemble_prompt(context_chunks: List[str]) -> List:
    # Put the system prompt, and a combined human message containing the chunks
    combined_text = "\n\n---DOCUMENT CHUNK---\n\n".join(context_chunks[:6])  # limit to first N chunks for cost
    human = f"Document:\n{combined_text}\n\nAnalyze the document according to the system instructions."
    return [SystemMessage(content=SYSTEM_PROMPT), HumanMessage(content=human)]

def analyze_document_bytes(file_bytes: bytes) -> Dict[str, Any]:
    text = extract_text_from_pdf_bytes(file_bytes)
    chunks = split_into_chunks(text, chunk_size=800, overlap=100)
    messages = assemble_prompt(chunks)
    llm = ChatOpenAI(model=OPENAI_MODEL, temperature=OPENAI_TEMPERATURE)
    resp = llm(messages)
    content = resp.content

    # Parse JSON safely
    parsed = {}
    try:
        parsed = json.loads(content)
    except Exception:
        # If LLM returned plain text, try to extract JSON block
        m = re.search(r"(\{[\s\S]*\})", content)
        if m:
            try:
                parsed = json.loads(m.group(1))
            except Exception:
                parsed = {"raw": content}
        else:
            parsed = {"raw": content}

    # Convert timeline to list of strings if needed
    timeline_raw = parsed.get("timeline", [])
    timeline = []
    for t in timeline_raw:
        if isinstance(t, dict):
            phase = t.get("phase", "")
            duration = t.get("duration", "")
            timeline.append(f"{phase} ({duration})")
        else:
            timeline.append(str(t))

    return {
        "breakdown": parsed.get("breakdown", {}),
        "risks": parsed.get("risks", []),
        "questions": parsed.get("questions", []),
        "timeline": timeline,
        "raw": content
    }

def enrich_for_visualization(parsed_result: dict) -> dict:
    """
    Ensure timeline and risks are in numeric form for charts
    """
    timeline = parsed_result.get("timeline", [])
    if not timeline:
        # fallback: mock timeline if missing
        parsed_result["timeline"] = [
            {"task": "Design", "start": 1, "end": 5},
            {"task": "Procurement", "start": 6, "end": 10},
            {"task": "Construction", "start": 11, "end": 20}
        ]
    else:
        # convert string tasks to numeric start/end
        structured_timeline = []
        day_counter = 1
        for t in timeline:
            structured_timeline.append({
                "task": t if isinstance(t, str) else str(t.get("task", "Task")),
                "start": day_counter,
                "end": day_counter + 3  # default 3 days per task
            })
            day_counter += 4
        parsed_result["timeline"] = structured_timeline

    # Risks chart fallback
    risks = parsed_result.get("risks", [])
    if not risks:
        parsed_result["risks_chart"] = [
            {"name": "Delay", "probability": 8, "impact": 9},
            {"name": "Resource shortage", "probability": 7, "impact": 8}
        ]
    else:
        parsed_result["risks_chart"] = [
            {"name": r, "probability": 5 + i % 5, "impact": 5 + (i*2) % 5} for i, r in enumerate(risks)
        ]

    return parsed_result
