export default function UploadPanel({
  fileInputRef,
  preview,
  isDragActive,
  error,
  loading,
  onDrag,
  onDrop,
  onChange,
  onUpload,
  onClear,
}) {
  return (
    <div className="glass-panel">
      <header className="header">
        <h1 className="title">MediScan AI</h1>
        <p className="subtitle">
          Upload a prescription to automatically extract medicines, dosages, and frequencies.
        </p>
      </header>

      <main>
        <div
          className={`upload-area ${isDragActive ? 'drag-active' : ''}`}
          onDragEnter={onDrag}
          onDragLeave={onDrag}
          onDragOver={onDrag}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          role="button"
          tabIndex={0}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={onChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <div className="upload-icon">📄</div>
          <h3>Drag &amp; Drop your prescription</h3>
          <p className="subtitle upload-hint">or click to browse files</p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {preview && (
          <div className="preview-container">
            <img src={preview} alt="Prescription preview" className="preview-image" />
          </div>
        )}

        {preview && (
          <div className="action-row">
            <button type="button" className="analyze-btn" onClick={onUpload} disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner" /> Analyzing image…
                </>
              ) : (
                'Analyze prescription'
              )}
            </button>
            <button type="button" className="btn-secondary btn-clear" onClick={onClear}>
              Clear
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
