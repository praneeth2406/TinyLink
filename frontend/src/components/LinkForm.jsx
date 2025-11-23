import { useState } from 'react';

const API_BASE =
  import.meta.env.VITE_API_BASE || 'http://localhost:5000';

function LinkForm({ onCreated }) {
  const [url, setUrl] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!url.trim()) {
      setError('URL is required');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url.trim(),
          code: code.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create link');
      } else {
        setSuccessMsg('Short link created!');
        setUrl('');
        setCode('');
        onCreated?.(data);
      }
    } catch (err) {
      console.error(err);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3"
    >
      <div className="space-y-1">
        <label className="text-sm text-slate-200">Long URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/very/long/path"
          className="w-full rounded-lg bg-white border border-slate-700 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm text-slate-200">
          Custom code (optional, 6–8 letters/digits)
        </label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="mycode1"
          className="w-full rounded-lg bg-white border border-slate-700 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
      {successMsg && (
        <p className="text-xs text-emerald-400">{successMsg}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-sky-500 hover:bg-sky-400 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating…' : 'Create Short Link'}
      </button>
    </form>
  );
}

export default LinkForm;
