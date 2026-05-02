export default function AnalyzeButton({ onClick, loading, disabled }) {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`bg-linear-to-r from-teal-500 to-emerald-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-all w-full sm:w-auto
        ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:from-teal-400 hover:to-emerald-400 shadow-teal-500/30 hover:scale-105 active:scale-95'}`}
    >
      {loading ? "Analyzing..." : "Analyze Prescription"}
    </button>
  );
}
