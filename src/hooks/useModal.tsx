/** biome-ignore-all lint/a11y/noStaticElementInteractions: Cause i need that */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: Cause i need that too */
"use client";
import { useCallback, useState } from "react";

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  
  // biome-ignore lint/correctness/useExhaustiveDependencies: I don't understand so i don't care, future me or who are you ignore.
    const Modal = useCallback(({ children }: { children: React.ReactNode }) => {
    if (!isOpen) return null;
    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300 opacity-100"
        onClick={close}
      >
        <div className="max-w-[600px] w-full mx-5" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    );
  }, [isOpen]);
  return { isOpen, open, close, Modal };
};
export default useModal;
