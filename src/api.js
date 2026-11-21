const ACCESS_TOKEN_KEY = 'medtech_access_token';
const BASE_KEY = 'medtech_api_base';
/** Legacy key from old static bearer; cleared on logout. */
const LEGACY_BEARER_KEY = 'medtech_bearer_token';

// Clean up legacy localStorage API base override if present
try {
  localStorage.removeItem(BASE_KEY);
  localStorage.removeItem(LEGACY_BEARER_KEY);
} catch {
  /* ignore */
}

export function getApiBase() {
  const fromEnv = import.meta.env.VITE_API_BASE_URL;
  const isLocal =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  if (fromEnv && fromEnv.trim()) {
    const trimmed = fromEnv.trim().replace(/\/$/, '');
    // If deployed in production and env still has local proxy '/api', use Render URL
    if (!isLocal && trimmed === '/api') {
      return 'https://medtech-backend-kppi.onrender.com';
    }
    return trimmed;
  }

  // For local development on localhost, default to Vite dev proxy '/api'
  // which forwards to port 8000 and avoids all CORS / Brave Shield blocks!
  if (isLocal) {
    return '/api';
  }

  // Production backend URL on Render
  return 'https://medtech-backend-kppi.onrender.com';
}

export function getSavedAccessToken() {
  const s = localStorage.getItem(ACCESS_TOKEN_KEY);
  return s ? s.trim() : '';
}

/**
 * JWT from login (localStorage) or optional `VITE_API_ACCESS_TOKEN` in `frontend/.env` for local dev.
 */
export function getAccessToken() {
  const saved = getSavedAccessToken();
  if (saved) return saved;
  const fromEnv = import.meta.env.VITE_API_ACCESS_TOKEN;
  if (typeof fromEnv === 'string' && fromEnv.trim()) return fromEnv.trim();
  return '';
}

/** @deprecated use getAccessToken */
export function getBearerToken() {
  return getAccessToken();
}

export function saveAccessToken(token) {
  if (token) localStorage.setItem(ACCESS_TOKEN_KEY, token);
  else localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function clearAuth() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(LEGACY_BEARER_KEY);
}

export function saveApiSettings({ baseUrl }) {
  if (baseUrl !== undefined) {
    const t = baseUrl.trim().replace(/\/$/, '');
    if (t) localStorage.setItem(BASE_KEY, t);
    else localStorage.removeItem(BASE_KEY);
  }
}

export async function apiFetch(path, options = {}) {
  const { method = 'GET', body, headers: extra = {}, skipAuth = false } = options;
  const headers = { ...extra };
  const token = getAccessToken();
  if (token && !skipAuth) headers.Authorization = `Bearer ${token}`;

  const base = getApiBase();
  const url = `${base}${path}`;

  try {
    return await fetch(url, {
      method,
      body,
      headers,
      credentials: 'include', // Include cookies on cross-origin requests
    });
  } catch (error) {
    if (error && (error.name === 'TypeError' || String(error).includes('fetch'))) {
      throw new Error(
        `Unable to reach server at ${base}. Please ensure backend is running and reachable.`
      );
    }
    throw error;
  }
}

export async function authRegister(email, password) {
  return apiFetch('/auth/register', {
    method: 'POST',
    skipAuth: true,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim(), password }),
  });
}

export async function authLogin(email, password) {
  const res = await apiFetch('/auth/login', {
    method: 'POST',
    skipAuth: true,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim(), password }),
  });
  if (res.ok) {
    const data = await res.json();
    if (data.access_token) saveAccessToken(data.access_token);
  }
  return res;
}

export async function readErrorMessage(response) {
  try {
    const data = await response.json();
    if (data?.error?.detail) return data.error.detail;
    if (typeof data?.detail === 'string') return data.detail;
    if (Array.isArray(data?.detail)) {
      return data.detail.join(', ');
    }
  } catch {
    /* ignore */
  }
  return response.statusText || `HTTP ${response.status}`;
}

export async function fetchBackendMeta() {
  try {
    const [h, v] = await Promise.all([
      apiFetch('/health', { skipAuth: true }),
      apiFetch('/version', { skipAuth: true }),
    ]);
    return {
      healthOk: h.ok,
      version: v.ok ? await v.json() : null,
    };
  } catch {
    return { healthOk: false, version: null };
  }
}

export async function fetchPrescriptionList() {
  if (!getAccessToken()) return [];
  try {
    const res = await apiFetch('/prescriptions');
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
