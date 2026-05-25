import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, MoreVertical } from 'lucide-react';
import { apiService } from '../../lib/api';
import { formatDDMMYYYY } from '../../lib/timezone';
import { useLayout } from '../../context/LayoutContext';

export default function LibraryPage() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const { refreshAssignmentCount } = useLayout();

  const load = useCallback(async () => {
    try {
      const data = await apiService.getMyTests();
      setTests(data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = tests.filter((t) =>
    (t.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-veda-xl min-h-[calc(100vh-8rem)] shadow-soft overflow-hidden">
      <div className="px-6 sm:px-8 pt-8 pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">My Library</h1>
        <p className="text-sm text-text-muted mt-1">All saved assignments and question papers.</p>
      </div>

      <div className="mx-4 sm:mx-6 mb-6 relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-subtle" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Assignment"
          className="w-full pl-11 pr-4 py-2.5 bg-surface-muted border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
      </div>

      {loading ? (
        <p className="text-center py-16 text-text-muted text-sm">Loading library...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center py-16 text-text-muted text-sm">No items in your library yet.</p>
      ) : (
        <div className="px-4 sm:px-6 pb-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((test) => (
            <div key={test.id} className="relative border border-border rounded-veda p-5 hover:shadow-card transition-shadow">
              <div className="flex justify-between gap-2 mb-6">
                <Link to={`/teacher/test/${test.id}`} className="font-bold text-primary hover:underline">
                  {test.title}
                </Link>
                <button
                  type="button"
                  onClick={() => setOpenMenuId(openMenuId === test.id ? null : test.id)}
                  className="p-1 text-text-muted"
                >
                  <MoreVertical size={18} />
                </button>
                {openMenuId === test.id && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                    <div className="absolute right-4 top-12 z-20 w-40 bg-white rounded-veda border border-border shadow-card py-1">
                      <Link
                        to={`/teacher/test/${test.id}`}
                        className="block px-4 py-2 text-sm hover:bg-surface-muted"
                        onClick={() => setOpenMenuId(null)}
                      >
                        View Assignment
                      </Link>
                    </div>
                  </>
                )}
              </div>
              <p className="text-xs text-text-muted">
                Added : {formatDDMMYYYY(test.created_at)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
