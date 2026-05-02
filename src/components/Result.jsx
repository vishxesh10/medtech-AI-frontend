export default function ResultSection({ rawText, cleanedText }) {
  return (
    <div className="flex flex-col gap-6 mt-4">
      <h2 className="text-2xl font-bold text-teal-300 border-b border-slate-700 pb-2">Results</h2>

      <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-sm">
        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Raw Text</h4>
        <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-300 min-h-[100px]">
          <p>{rawText || "No results yet"}</p>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-sm">
        <h4 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3">Cleaned Text</h4>
        <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-300 min-h-[100px] border-l-4 border-emerald-500">
          <p>{cleanedText || "No results yet"}</p>
        </div>
      </div>
    </div>
  );
}