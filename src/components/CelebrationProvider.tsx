import React, { createContext, useContext, useState, useCallback } from 'react';
import { Celebration, type Achievement } from './Celebration';

interface CelebrationContextValue {
  celebrate: (achievement: Achievement) => void;
}

const CelebrationContext = createContext<CelebrationContextValue>({
  celebrate: () => {},
});

export function useCelebrations() {
  return useContext(CelebrationContext);
}

export function CelebrationProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<Achievement[]>([]);

  const celebrate = useCallback((achievement: Achievement) => {
    setQueue(q => (q.some(a => a.id === achievement.id) ? q : [...q, achievement]));
  }, []);

  return (
    <CelebrationContext.Provider value={{ celebrate }}>
      {children}
      {queue.length > 0 && (
        <Celebration
          achievement={queue[0]}
          onClose={() => setQueue(q => q.slice(1))}
        />
      )}
    </CelebrationContext.Provider>
  );
}
