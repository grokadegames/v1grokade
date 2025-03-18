'use client';

import { createContext, useContext, useState } from 'react';
import SponsorModal from '@/components/SponsorModal';

const SponsorModalContext = createContext({
  isSponsorModalOpen: false,
  openSponsorModal: () => {},
  closeSponsorModal: () => {},
});

export function SponsorModalProvider({ children }) {
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);
  
  const openSponsorModal = () => setIsSponsorModalOpen(true);
  const closeSponsorModal = () => setIsSponsorModalOpen(false);
  
  return (
    <SponsorModalContext.Provider
      value={{
        isSponsorModalOpen,
        openSponsorModal,
        closeSponsorModal,
      }}
    >
      {children}
      <SponsorModal isOpen={isSponsorModalOpen} onClose={closeSponsorModal} />
    </SponsorModalContext.Provider>
  );
}

export const useSponsorModal = () => useContext(SponsorModalContext); 