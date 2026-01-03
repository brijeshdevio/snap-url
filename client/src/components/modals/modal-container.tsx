// modal-container.tsx
import { useModal } from "@/app/providers/modal-provider";
import React from "react";

export const ModalContainer = React.memo(
  ({ children }: { children: React.ReactNode }) => {
    const { closeModal } = useModal();

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-base-200/90" onClick={closeModal} />

        {/* Modal Box */}
        <div className="">{children}</div>
      </div>
    );
  }
);
