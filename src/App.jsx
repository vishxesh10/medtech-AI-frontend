import { useState } from "react";
import UploadSection from "./components/Upload";
import PreviewSection from "./components/Preview";
import AnalyzeButton from "./components/Analyze";
import ResultSection from "./components/Result";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [rawText, setRawText] = useState("");
  const [cleanedText, setCleanedText] = useState("");
  const [loading, setLoading] = useState(false);

  // file handle
  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setRawText("");
    setCleanedText("");
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setRawText("");
    setCleanedText("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/analyze-prescription", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze prescription");
      }

      const data = await response.json();
      setRawText(data.raw_text);
      setCleanedText(data.cleaned_text);
    } catch (error) {
      console.error(error);
      setRawText("Error analyzing prescription. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center py-12 px-4 sm:px-6">
      <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-teal-400 to-emerald-400 mb-10 tracking-tight">
        MEDTECH AI
      </h1>
      <div className="w-full max-w-3xl bg-slate-900/50 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-10 space-y-8 border border-slate-800">
        <UploadSection onFileChange={handleFileChange} />
        <PreviewSection preview={preview} />
        <div className="flex justify-center">
          <AnalyzeButton onClick={handleAnalyze} loading={loading} disabled={!file || loading} />
        </div>
        <ResultSection rawText={rawText} cleanedText={cleanedText} />
      </div>
    </div>
  );
}

export default App;
