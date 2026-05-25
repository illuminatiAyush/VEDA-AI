import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { apiService } from '../../lib/api';
import { Filter, Search, MoreVertical, Plus, ChevronDown } from 'lucide-react';
import Button from '../../components/ui/Button';
import EmptyAssignmentsIllustration from '../../components/vedaai/EmptyAssignmentsIllustration';
import { formatDDMMYYYY } from '../../lib/timezone';
import { useLayout } from '../../context/LayoutContext';

const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'active', label: 'Active' },
  { value: 'ended', label: 'Ended' },
];

export default function TeacherDashboard() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const { refreshAssignmentCount } = useLayout();

  const loadDashboardData = useCallback(async () => {
    try {
      const data = await apiService.getMyTests();
      setTests(data || []);
      await refreshAssignmentCount();
    } catch (err) {
      console.warn('Could not load tests:', err.message);
    } finally {
      setLoading(false);
    }
  }, [refreshAssignmentCount]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const filteredTests = tests.filter((t) => {
    const matchesSearch = (t.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (test) => {
    toast('Delete this assignment?', {
      description: `"${test.title}" will be permanently removed.`,
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            await apiService.updateTestStatus(test.id, 'delete'); // Delegate deletion securely
            toast.success('Assignment deleted.');
            setOpenMenuId(null);
            loadDashboardData();
          } catch (err) {
            toast.error(err.message || 'Failed to delete');
          }
        },
      },
      cancel: { label: 'Cancel' },
    });
  };

  const filterLabel = FILTER_OPTIONS.find((f) => f.value === statusFilter)?.label || 'All';

  return (
    <div className="bg-white rounded-veda-xl min-h-[calc(100vh-8rem)] lg:min-h-[calc(100vh-6rem)] shadow-soft overflow-hidden">
      <div className="px-6 sm:px-8 pt-8 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-success shrink-0" />
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Assignments</h1>
        </div>
        <p className="text-sm text-text-muted ml-4">
          Manage and create assignments for your classes.
        </p>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-2 border-border border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-text-muted">Loading assignments...</p>
        </div>
      ) : tests.length === 0 ? (
        <div className="px-6 pb-16 flex flex-col items-center text-center max-w-lg mx-auto">
          <EmptyAssignmentsIllustration className="mb-8" />
          <h2 className="text-xl font-bold text-primary mb-3">No assignments yet</h2>
          <p className="text-sm text-text-muted leading-relaxed mb-8">
            Create your first assignment to start collecting and grading student submissions.
            You can set up rubrics, define marking criteria, and let AI assist with grading.
          </p>
          <Button to="/teacher/create-test" variant="primary" size="lg">
            <Plus size={18} className="mr-2" />
            Create Your First Assignment
          </Button>
        </div>
      ) : (
        <>
          <div className="mx-4 sm:mx-6 mb-6 flex flex-col sm:flex-row sm:items-center gap-3 bg-surface-muted rounded-veda px-4 py-3">
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-primary px-2 py-1"
              >
                <Filter size={18} />
                <span>Filter By</span>
                <span className="text-primary font-semibold">: {filterLabel}</span>
                <ChevronDown size={14} className={filterOpen ? 'rotate-180' : ''} />
              </button>
              {filterOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setFilterOpen(false)} />
                  <div className="absolute left-0 top-full mt-1 z-20 w-40 bg-white border border-border rounded-veda shadow-card py-1">
                    {FILTER_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setStatusFilter(opt.value);
                          setFilterOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-surface-muted ${
                          statusFilter === opt.value ? 'font-semibold text-primary bg-surface-muted' : 'text-text-muted'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-subtle" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Assignment"
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>
          </div>

          {filteredTests.length === 0 ? (
            <p className="text-center py-12 text-sm text-text-muted">No assignments match your filter.</p>
          ) : (
            <div className="px-4 sm:px-6 pb-24 grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTests.map((test) => (
                <div
                  key={test.id}
                  className="relative bg-white border border-border rounded-veda p-5 shadow-soft hover:shadow-card transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3 mb-8">
                    <Link to={`/teacher/test/${test.id}`} className="font-bold text-primary text-base leading-snug pr-2 hover:underline">
                      {test.title || 'Quiz on Electricity'}
                    </Link>
                    <div className="relative shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setOpenMenuId(openMenuId === test.id ? null : test.id);
                        }}
                        className="p-1 text-text-muted hover:text-primary rounded-lg"
                        aria-label="Options"
                      >
                        <MoreVertical size={20} />
                      </button>
                      {openMenuId === test.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                          <div className="absolute right-0 top-8 z-20 w-44 bg-white rounded-veda shadow-card border border-border py-1 overflow-hidden">
                            <Link
                              to={`/teacher/test/${test.id}`}
                              className="block px-4 py-2.5 text-sm font-medium text-primary hover:bg-surface-muted"
                              onClick={() => setOpenMenuId(null)}
                            >
                              View Assignment
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDelete(test)}
                              className="w-full text-left px-4 py-2.5 text-sm text-danger hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <Link to={`/teacher/test/${test.id}`} className="flex items-center justify-between text-xs text-text-muted hover:text-primary">
                    <span>Assigned on : {formatDDMMYYYY(test.created_at || test.createdAt)}</span>
                    <span>Due : {formatDDMMYYYY(test.end_time || test.start_time)}</span>
                  </Link>
                </div>
              ))}
            </div>
          )}

          <div className="hidden sm:flex fixed bottom-8 left-1/2 -translate-x-1/2 z-20 lg:left-[calc(260px+(100%-260px)/2)]">
            <Button to="/teacher/create-test" variant="primary" size="lg">
              <Plus size={18} className="mr-2" />
              Create Assignment
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
