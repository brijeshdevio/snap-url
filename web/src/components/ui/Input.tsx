import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";

export interface InputDto extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: { message?: string };
}

export function Input({ label, error, ...props }: InputDto) {
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  const id = useId();

  const handleTogglePassword = () => {
    setIsVisiblePassword(!isVisiblePassword);
  };

  return (
    <div className="flex w-full flex-col gap-1">
      {label && (
        <label
          htmlFor={id}
          className="text-base-content/70 text-sm font-medium"
        >
          {label}
        </label>
      )}
      <div className="input w-full">
        <input
          {...props}
          id={id}
          className={props.className}
          type={isVisiblePassword ? "text" : props.type}
        />
        {props.type === "password" && (
          <button type="button" onClick={handleTogglePassword}>
            {isVisiblePassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && <span className="text-sm text-red-400">{error?.message}</span>}
    </div>
  );
}
