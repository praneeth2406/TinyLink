import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

const API_BASE =
  import.meta.env.VITE_API_BASE || 'http://localhost:5000';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString();
}

function LinkTable({ links, onDeleted, onClickIncrement }) {
  const [search, setSearch] = useState('');
  const [deletingCode, setDeletingCode] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;


  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return links;
    return links.filter(
      (l) =>
        l.code.toLowerCase().includes(q) ||
        l.target_url.toLowerCase().includes(q)
    );
  }, [links, search]);

  const totalPages = Math.ceil(filtered.length / pageSize);

  const paginatedLinks = useMemo(() => {
  const start = (currentPage - 1) * pageSize;
  return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);




  async function handleDelete(code) {
    if (!window.confirm(`Delete link ${code}?`)) return;
    setDeletingCode(code);
    try {
      const res = await fetch(`${API_BASE}/api/links/${code}`, {
        method: 'DELETE',
      });
      if (res.status === 204) {
        onDeleted?.(code);
      } else {
        console.error('Failed to delete');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingCode(null);
    }
  }


  function handleShortClick(link) {
  // Open the short URL
  window.open(link.shortUrl, "_blank");

  // Update the click count in UI
  onClickIncrement?.(link.code);
}




  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 mt-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-200">
          All Links
        </h2>
        <input
          type="text"
          value={search}
          onChange={(e) => {setSearch(e.target.value); setCurrentPage(1);}}
          placeholder="Search by code or URL"
          className="max-w-xs w-full rounded-lg bg-white border border-slate-700 px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      {links.length === 0 ? (
        <p className="text-xs text-slate-500">
          No links yet. Create one above.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="py-2 pr-3 font-medium text-slate-300">
                  Short
                </th>
                <th className="py-2 pr-3 font-medium text-white">
                  Target URL
                </th>
                <th className="py-2 pr-3 font-medium text-white">
                  Clicks
                </th>
                <th className="py-2 pr-3 font-medium text-slate-300">
                  Last clicked
                </th>
                <th className="py-2 pr-3 font-medium text-slate-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedLinks.map((link) => (
                <tr
                  key={link.id}
                  className="border-b border-slate-800/60 hover:bg-slate-800/40"
                >
                  <td className="py-2 pr-3 align-top">
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() =>
                        //   copyToClipboard(link.shortUrl)
                        //   location.href = link.shortUrl
                          // window.open(link.shortUrl, '_blank')
                           handleShortClick(link)
                        }
                        className="text-sky-400 hover:underline text-[11px]"
                      >
                        {link.shortUrl}
                      </button>
                      <Link
                        to={`/code/${link.code}`}
                        className="text-[10px] text-slate-400 hover:underline"
                      >
                        View stats
                      </Link>
                    </div>
                  </td>
                  <td className="py-2 pr-3 align-top max-w-xs">
                    <a className="inline-block truncate max-w-xs text-white" >
                      {link.target_url}
                    </a>
                  </td>
                  <td className="py-2 pr-3 align-top text-white text-center">
                    {link.total_clicks}
                  </td>
                  <td className="py-2 pr-3 align-top text-white">
                    {formatDate(link.last_clicked_at)}
                  </td>
                  <td className="py-2 pr-3 align-top">
                    <button
                      type="button"
                      onClick={() => handleDelete(link.code)}
                      disabled={deletingCode === link.code}
                      className="text-[11px] text-red-400 hover:text-red-300 disabled:opacity-50"
                    >
                      {deletingCode === link.code
                        ? 'Deleting…'
                        : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between mt-3 text-xs text-slate-300">
  <button
    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
    disabled={currentPage === 1}
    className="px-2 py-1 rounded bg-slate-800 disabled:opacity-50"
  >
    Prev
  </button>

  <div className="flex gap-1">
    {[...Array(totalPages)].map((_, i) => (
      <button
        key={i}
        onClick={() => setCurrentPage(i + 1)}
        className={`px-2 py-1 rounded ${
          currentPage === i + 1
            ? 'bg-sky-600 text-white'
            : 'bg-slate-800'
        }`}
      >
        {i + 1}
      </button>
    ))}
  </div>

  <button
    onClick={() =>
      setCurrentPage((p) => Math.min(p + 1, totalPages))
    }
    disabled={currentPage === totalPages}
    className="px-2 py-1 rounded bg-slate-800 disabled:opacity-50"
  >
    Next
  </button>
</div>

        </div>
      )}
    </div>
  );
}

export default LinkTable;
