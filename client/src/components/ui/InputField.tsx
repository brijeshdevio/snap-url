import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";

type InputFieldError = { field: string; message: string };

export interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errors?: InputFieldError[];
}

export function InputField({ label, errors, ...props }: InputFieldProps) {
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  const id = useId();

  const handleTogglePassword = () => {
    setIsVisiblePassword(!isVisiblePassword);
  };

  const error = errors?.find((error) => error.field === props.name);

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={id} className="text-accent-content">
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
      {error && <span className="text-red-400 text-sm">{error.message}</span>}
    </div>
  );
}
