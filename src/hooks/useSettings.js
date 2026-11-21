import { useEffect, useState } from 'react';
import { apiFetch, fetchBackendMeta, getApiBase, readErrorMessage, saveApiSettings } from '../api';

export default function useSettings({ loadHistory, setError }) {
  const [baseInput, setBaseInput] = useState(() => getApiBase());
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [healthOk, setHealthOk] = useState(null);
  const [versionInfo, setVersionInfo] = useState(null);
  const [verifyOk, setVerifyOk] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchBackendMeta().then((meta) => {
      if (!cancelled) {
        setHealthOk(meta.healthOk);
        setVersionInfo(meta.version);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSaveSettings = () => {
    saveApiSettings({ baseUrl: baseInput });
    setSettingsSaved(true);
    setVerifyOk(null);
    fetchBackendMeta().then((meta) => {
      setHealthOk(meta.healthOk);
      setVersionInfo(meta.version);
    });
    loadHistory();
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  const handleVerifyAuth = async () => {
    setVerifyLoading(true);
    setVerifyOk(null);
    try {
      const response = await apiFetch('/auth/verify');
      setVerifyOk(response.ok);
      if (!response.ok) setError(await readErrorMessage(response));
      else loadHistory();
    } catch (error) {
      setVerifyOk(false);
      setError(error.message || 'Verify request failed');
    } finally {
      setVerifyLoading(false);
    }
  };

  return {
    baseInput,
    handleSaveSettings,
    handleVerifyAuth,
    healthOk,
    setBaseInput,
    settingsSaved,
    verifyLoading,
    verifyOk,
    versionInfo,
  };
}
