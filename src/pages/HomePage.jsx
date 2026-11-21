import { useNavigate } from 'react-router-dom';
import HistoryPanel from '../components/HistoryPanel';
import ResultsPanel from '../components/ResultsPanel';
import StatusBar from '../components/StatusBar';
import UploadPanel from '../components/UploadPanel';
import useAuth from '../hooks/useAuth';
import usePrescriptionWorkspace from '../hooks/usePrescriptionWorkspace';
import useSettings from '../hooks/useSettings';

export default function HomePage() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const workspace = usePrescriptionWorkspace({
    onUnauthenticated: () => navigate('/login', {
      replace: true,
      state: { message: 'Please sign in to analyze a prescription.' },
    }),
  });
  const settings = useSettings({
    loadHistory: workspace.loadHistory,
    setError: workspace.setError,
  });

  return (
    <main className="app-shell">
      <StatusBar
        healthOk={settings.healthOk}
        versionInfo={settings.versionInfo}
        verifyOk={settings.verifyOk}
        userEmail={user?.email || ''}
        onLogout={logout}
      />

      <UploadPanel
        fileInputRef={workspace.fileInputRef}
        preview={workspace.preview}
        isDragActive={workspace.isDragActive}
        error={workspace.error}
        loading={workspace.loading}
        onDrag={workspace.handleDrag}
        onDrop={workspace.handleDrop}
        onChange={workspace.handleChange}
        onUpload={workspace.handleUpload}
        onClear={workspace.handleClear}
      />

      <HistoryPanel
        historyLoading={workspace.historyLoading}
        historyList={workspace.historyList}
        loadHistory={workspace.loadHistory}
        openSavedPrescription={workspace.openSavedPrescription}
        activeRecordId={workspace.activeRecordId}
      />

      <ResultsPanel
        results={workspace.results}
        activeRecordId={workspace.activeRecordId}
        copyJson={workspace.copyJson}
        downloadJson={workspace.downloadJson}
      />
    </main>
  );
}
