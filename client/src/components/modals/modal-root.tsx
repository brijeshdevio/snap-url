// modal-root.tsx
import React from "react";
import ReactDOM from "react-dom";
import { ModalContainer } from "./modal-container";

export const ModalRoot = React.memo(
  ({ children }: { children: React.ReactNode }) => {
    if (!children) return null;

    return ReactDOM.createPortal(
      <ModalContainer>{children}</ModalContainer>,
      document.body
    );
  }
);
