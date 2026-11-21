import { useCallback, useEffect, useRef, useState } from 'react';
import {
  apiFetch,
  fetchPrescriptionList,
  getAccessToken,
  readErrorMessage,
} from '../api';

export default function usePrescriptionWorkspace({ onUnauthenticated }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const [historyList, setHistoryList] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [activeRecordId, setActiveRecordId] = useState(null);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const list = await fetchPrescriptionList();
      setHistoryList(list);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchPrescriptionList().then((list) => {
      if (!cancelled) setHistoryList(list);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleDrag = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === 'dragenter' || event.type === 'dragover') {
      setIsDragActive(true);
    } else if (event.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setError(null);
    setResults(null);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      handleFile(event.dataTransfer.files[0]);
    }
  };

  const handleChange = (event) => {
    event.preventDefault();
    if (event.target.files && event.target.files[0]) {
      handleFile(event.target.files[0]);
    }
  };

  const clearUploadOnly = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClear = () => {
    clearUploadOnly();
    setResults(null);
    setActiveRecordId(null);
  };

  const openSavedPrescription = async (id) => {
    if (!getAccessToken()) return;
    setError(null);
    try {
      const response = await apiFetch(`/prescriptions/${id}`);
      if (!response.ok) {
        setError(await readErrorMessage(response));
        return;
      }
      const data = await response.json();
      clearUploadOnly();
      setResults(data.extracted_data);
      setActiveRecordId(data.id);
    } catch (requestError) {
      setError(requestError.message || 'Failed to load prescription');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    if (!getAccessToken()) {
      onUnauthenticated();
      return;
    }

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiFetch('/extract-prescription', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await readErrorMessage(response));
      }

      const data = await response.json();
      if (!data.extracted_data) {
        throw new Error('AI returned invalid data structure.');
      }

      setResults(data.extracted_data);
      setActiveRecordId(data.saved_id ?? null);
      loadHistory();
    } catch (uploadError) {
      setError(uploadError.message || 'Something went wrong during analysis.');
    } finally {
      setLoading(false);
    }
  };

  const rawJson = results ? JSON.stringify(results, null, 2) : '';

  const copyJson = async () => {
    if (!rawJson) return;
    try {
      await navigator.clipboard.writeText(rawJson);
    } catch {
      setError('Could not copy to clipboard.');
    }
  };

  const downloadJson = () => {
    if (!rawJson) return;
    const blob = new Blob([rawJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'prescription-extract.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return {
    activeRecordId,
    copyJson,
    downloadJson,
    error,
    fileInputRef,
    handleChange,
    handleClear,
    handleDrag,
    handleDrop,
    handleUpload,
    historyList,
    historyLoading,
    isDragActive,
    loadHistory,
    loading,
    openSavedPrescription,
    preview,
    results,
    setError,
  };
}
