/** biome-ignore-all lint/a11y/noStaticElementInteractions: Cause i need that */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: Cause i need that too */
import { useState } from "react";

const useModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    const Modal = ({ children }: { children: React.ReactNode }) => {
        if (!isOpen) return null;
        return (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300 opacity-100"
            onClick={close}
          >
            <div  onClick={(e) => e.stopPropagation()}>
              {children}
            </div>
          </div>
        );
    }
    return { isOpen, open, close, Modal };
}
export default useModal