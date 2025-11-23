import { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';

const API_BASE =
  import.meta.env.VITE_API_BASE || 'http://localhost:5000';

function StatsPage() {
  const { code } = useParams();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE}/api/links/${code}`);
        if (res.status === 404) {
          setError('Link not found');
          setLink(null);
        } else {
          const data = await res.json();
          setLink(data);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load stats');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [code]);

  return (
    <div className="space-y-4">
      <RouterLink
        to="/"
        className="text-xs text-sky-400 hover:underline"
      >
        ← Back to dashboard
      </RouterLink>

      <div>
        <h2 className="text-lg font-semibold text-black">
          Stats for <span className="text-sky-400">{code}</span>
        </h2>
      </div>

      {loading && (
        <p className="text-xs text-slate-400">Loading…</p>
      )}

      {error && !loading && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      {link && !loading && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="space-y-1">
            <div className="text-xs text-slate-400">
              Short URL
            </div>
            <div className="text-sm text-sky-400 break-all">
              {link.shortUrl}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-400">
              Target URL
            </div>
            <a
              href={link.target_url}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-slate-100 break-all underline"
            >
              {link.target_url}
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-xs text-slate-400">
                Total clicks
              </div>
              <div className="text-base text-white font-semibold">
                {link.total_clicks}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400">
                Last clicked
              </div>
              <div className="text-sm text-white">
                {link.last_clicked_at
                  ? new Date(
                      link.last_clicked_at
                    ).toLocaleString()
                  : 'Never'}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400">
                Created at
              </div>
              <div className="text-sm text-white">
                {new Date(link.created_at).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StatsPage;
