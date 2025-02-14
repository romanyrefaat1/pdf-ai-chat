"use client";
import { cn } from "@/lib/utils";
import { createContext, useState } from "react";

const ModalContext = createContext();

const ModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modal, setModal] = useState(null);

  const openModal = (modal) => {
    setIsOpen(true);
    setModal(modal);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModal(null);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {isOpen && (
        <div className="fixed inset-0 pointer-events-none">
          <div
            className="absolute inset-0 bg-black/25 pointer-events-auto"
            onClick={closeModal}
          />
          <div className="relative z-[999999999] flex items-center justify-center pointer-events-auto">
            {modal}
          </div>
        </div>
      )}
      <div className={`${isOpen ? 'pointer-events-none' : ''}`}>
        {children}
      </div>
    </ModalContext.Provider>
  );
};

export default ModalProvider;
export { ModalContext };
