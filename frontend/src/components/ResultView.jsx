import React from "react";
import TimelineChart from "./TimelineChart";
import RiskHeatmap from "./RiskHeatmap";

export default function ResultView({ data }) {
  if (!data) return null;

  const { breakdown, risks, questions, timeline, raw } = data;

  // Prepare risk heatmap data: probability and impact numeric 1–10
  const risksWithScore = (risks || []).map((r, i) => ({
    name: r,
    probability: Math.floor(Math.random() * 6) + 5, // mock 5-10
    impact: Math.floor(Math.random() * 6) + 5       // mock 5-10
  }));

  return (
    <div className="max-w-5xl mx-auto mt-10 p-8 bg-primary-800 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-semibold mb-6 text-white">Analysis Result</h2>

      <section className="mb-8">
        <h3 className="text-lg font-medium text-gray-300">Discipline-wise Task Breakdown</h3>
        <div className="mt-4 grid gap-6 grid-cols-1 md:grid-cols-2">
          {Object.keys(breakdown || {}).map((disc) => (
            <div key={disc} className="p-4 bg-primary-700 rounded-xl border border-gray-600">
              <h4 className="font-semibold text-white">{disc}</h4>
              <ul className="list-disc ml-5 mt-2 text-gray-200">
                {(breakdown[disc] || []).map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-medium text-gray-300">Top Risks</h3>
        <ul className="list-decimal ml-5 mt-2 text-gray-200">
          {(risks || []).map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      </section>

      <RiskHeatmap risks={risksWithScore} />

      <section className="mb-8">
        <h3 className="text-lg font-medium text-gray-300">Missing Information / Questions</h3>
        <ul className="list-disc ml-5 mt-2 text-gray-200">
          {(questions || []).map((q, i) => <li key={i}>{q}</li>)}
        </ul>
      </section>
      
      {/* <TimelineChart timeline={data.timeline || []} /> */}

      <details className="mt-4 text-gray-200">
        <summary className="cursor-pointer hover:text-white">Raw Model Output</summary>
        <pre className="whitespace-pre-wrap mt-2 bg-primary-700 p-4 rounded-xl text-gray-100">{raw || JSON.stringify(data, null, 2)}</pre>
      </details>
    </div>
  );
}
