import React, { useState } from "react";
import { analyzeDocument } from "../api";
import LoadingSpinner from "./LoadingSpinner";

export default function UploadForm({ onResult }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!file) {
      setErr("Please choose a file (PDF or TXT).");
      return;
    }
    setErr(null);
    setLoading(true);
    try {
      const data = await analyzeDocument(file);
      onResult(data);
    } catch (error) {
      console.error(error);
      setErr(error?.response?.data?.detail || error.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-primary-800 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-semibold mb-6 text-white">Upload Project Document</h2>
      <form onSubmit={submit} className="space-y-6">
        <input
          type="file"
          accept=".pdf,.txt"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full text-gray-200 file:bg-primary-700 file:text-white file:rounded-lg file:px-4 file:py-2 file:border-0 hover:file:bg-primary-500"
        />
        {err && <div className="text-red-400">{err}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-500 hover:to-purple-300 rounded-xl text-white font-medium transition-all duration-300 button-primary"
        >
          {loading ? "Analyzing..." : "Analyze Document"}
        </button>
      </form>
      {loading && <LoadingSpinner className="mt-6" />}
    </div>
  );
}
