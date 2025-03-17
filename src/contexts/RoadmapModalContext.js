'use client';

import { createContext, useState, useContext } from 'react';
import RoadmapModal from '@/components/RoadmapModal';

const RoadmapModalContext = createContext({
  isRoadmapModalOpen: false,
  openRoadmapModal: () => {},
  closeRoadmapModal: () => {},
});

export function RoadmapModalProvider({ children }) {
  const [isRoadmapModalOpen, setIsRoadmapModalOpen] = useState(false);

  const openRoadmapModal = () => setIsRoadmapModalOpen(true);
  const closeRoadmapModal = () => setIsRoadmapModalOpen(false);

  return (
    <RoadmapModalContext.Provider
      value={{
        isRoadmapModalOpen,
        openRoadmapModal,
        closeRoadmapModal,
      }}
    >
      {children}
      <RoadmapModal isOpen={isRoadmapModalOpen} onClose={closeRoadmapModal} />
    </RoadmapModalContext.Provider>
  );
}

export const useRoadmapModal = () => useContext(RoadmapModalContext); 