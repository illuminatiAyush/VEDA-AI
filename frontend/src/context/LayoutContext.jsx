import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { apiService } from '../lib/api';

const LayoutContext = createContext(null);

export function LayoutProvider({ children }) {
  const { user } = useAuth();
  const [assignmentCount, setAssignmentCount] = useState(0);

  const refreshAssignmentCount = useCallback(async () => {
    if (!user) {
      setAssignmentCount(0);
      return;
    }
    try {
      const tests = await apiService.getMyTests();
      setAssignmentCount(tests?.length ?? 0);
    } catch {
      setAssignmentCount(0);
    }
  }, [user]);

  useEffect(() => {
    refreshAssignmentCount();
  }, [refreshAssignmentCount]);

  return (
    <LayoutContext.Provider value={{ assignmentCount, refreshAssignmentCount }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const ctx = useContext(LayoutContext);
  if (!ctx) {
    return { assignmentCount: 0, refreshAssignmentCount: async () => {} };
  }
  return ctx;
}
