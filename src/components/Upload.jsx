export default function UploadSection({ onFileChange }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-teal-300">Upload Prescription</h2>
      <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-teal-500/50 transition-colors bg-slate-800/50">
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => e.target.files && onFileChange(e.target.files[0])}
          className="block w-full text-sm text-slate-400
            file:mr-4 file:py-2.5 file:px-6
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-teal-500/10 file:text-teal-400
            hover:file:bg-teal-500/20 file:transition-colors
            cursor-pointer" 
        />
      </div>
    </div>
  );
}