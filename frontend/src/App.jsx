import React, { useState } from "react";
import UploadForm from "./components/UploadForm";
import ResultView from "./components/ResultView";
import logo from "./public/logo.jpeg";

export default function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="min-h-screen bg-primary-900">
      <header className="py-6 bg-primary-800 shadow-md">
        <div className="max-w-5xl mx-auto px-6 flex items-center gap-4">
          <img src={logo} alt="logo" className="w-24 h-24" /> 
          <div>
            <h1 className="text-3xl font-bold text-white">AI Project Engineer Agent</h1>
            <p className="text-gray-300 text-sm mt-1">Upload project documents and let AI generate structured task breakdowns.</p>
          </div>
        </div>
      </header>

      <main className="px-6 py-10">
        <UploadForm onResult={setResult} />
        <ResultView data={result} />
      </main>

      <footer className="text-center py-6 text-gray-400 border-t border-primary-700">
        - Prakriti Sharma
      </footer>
    </div>
  );
}
