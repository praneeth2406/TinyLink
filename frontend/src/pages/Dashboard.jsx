import { useEffect, useState } from 'react';
import LinkForm from '../components/LinkForm.jsx';
import LinkTable from '../components/LinkTable.jsx';

const API_BASE =
  import.meta.env.VITE_API_BASE || 'http://localhost:5000';

function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchLinks() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/links`);
      const data = await res.json();
      setLinks(data);
    } catch (err) {
      console.error('Failed to fetch links', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLinks();
  }, []);

  function handleCreated(link) {
    setLinks((prev) => [link, ...prev]);
  }

  function handleDeleted(code) {
    setLinks((prev) => prev.filter((l) => l.code !== code));
  }

function handleClickIncrement(code) {
  setLinks((prev) =>
    prev.map((l) =>
      l.code === code
        ? {
            ...l,
            total_clicks: l.total_clicks + 1,
            last_clicked_at: new Date().toISOString(),
          }
        : l
    )
  );
}



  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-black">
          Dashboard
        </h2>
        <p className="text-xs text-black-400 mt-1">
          Create, manage, and track your shortened links.
        </p>
      </div>

      <LinkForm onCreated={handleCreated} />

      {loading ? (

        <p className="text-xs text-slate-400 mt-4">
          Loading links…
        </p>
      ) : (
        <LinkTable links={links} onDeleted={handleDeleted} onClickIncrement={handleClickIncrement} />
      )}
    </div>
  );
}

export default Dashboard;
