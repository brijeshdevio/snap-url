import type { ReactNode } from "react";
import { clsx } from "clsx";

export interface ButtonDto extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
  isDisabled?: boolean;
}

export function Button({
  children,
  isDisabled,
  isLoading,
  type = "button",
  ...props
}: ButtonDto) {
  return (
    <button
      {...props}
      type={type}
      disabled={isDisabled || isLoading}
      className={clsx("btn", props.className)}
    >
      {isLoading ? (
        <span
          className={
            "loading loading-spinner loading-sm disabled:cursor-not-allowed"
          }
        ></span>
      ) : (
        children
      )}
    </button>
  );
}
