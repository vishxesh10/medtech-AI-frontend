import { getAccessToken } from '../api';

export default function HistoryPanel({ historyLoading, historyList, loadHistory, openSavedPrescription, activeRecordId }) {
  const hasToken = Boolean(getAccessToken());

  return (
    <div className="glass-panel history-panel">
      <div className="history-header">
        <div>
          <h3 className="history-title">Previous prescriptions</h3>
          <p className="history-sub">Stored securely in your account.</p>
        </div>
        <button
          type="button"
          className="btn-secondary btn-small"
          onClick={loadHistory}
          disabled={historyLoading || !hasToken}
        >
          {historyLoading ? 'Loading…' : 'Refresh'}
        </button>
      </div>
      {!hasToken ? (
        <p className="history-empty">Sign in to see your saved prescriptions.</p>
      ) : historyList.length === 0 && !historyLoading ? (
        <p className="history-empty">No saved prescriptions yet. Analyze an image to create one.</p>
      ) : (
        <div className="history-table-wrap">
          <table className="history-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>File</th>
                <th>Saved</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {historyList.map((row) => (
                <tr key={row.id} className={activeRecordId === row.id ? 'history-row-active' : ''}>
                  <td className="history-id">#{row.id}</td>
                  <td className="history-filename">{row.filename || '—'}</td>
                  <td className="history-date">
                    {row.created_at
                      ? new Date(row.created_at).toLocaleString(undefined, {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })
                      : '—'}
                  </td>
                  <td className="history-action">
                    <button
                      type="button"
                      className="btn-ghost btn-small"
                      onClick={() => openSavedPrescription(row.id)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
