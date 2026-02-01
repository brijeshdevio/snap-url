import { type MouseEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";

type ModalWrapperDto = {
  children: ReactNode;
  isActive: boolean;
  onClose: () => void;
};

export function ModalWrapper({ children, isActive, onClose }: ModalWrapperDto) {
  if (!isActive) return null;

  function handleStopPropagation(e: MouseEvent) {
    e.stopPropagation();
  }

  return createPortal(
    <div
      onClick={onClose}
      className="bg-base-200/60 fixed top-0 left-0 z-50 flex h-screen w-full items-center justify-center"
    >
      <div
        onClick={handleStopPropagation}
        className="mx-auto w-full max-w-[350px] p-3 sm:min-w-[500px]"
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
