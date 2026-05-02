export default function PreviewSection({ preview }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-teal-300">Preview</h2>
      <div className="w-full h-48 bg-slate-800/80 rounded-xl border border-slate-700 flex items-center justify-center overflow-hidden shadow-inner">
        {preview ? (
          <img src={preview} alt="Prescription preview" className="object-contain h-full w-full" />
        ) : (
          <p className="text-slate-500 font-medium">Image Preview Here</p>
        )}
      </div>
    </div>
  );
}