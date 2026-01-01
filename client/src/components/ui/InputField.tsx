import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function InputField({ label, ...props }: InputFieldProps) {
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  const id = useId();

  const handleTogglePassword = () => {
    setIsVisiblePassword(!isVisiblePassword);
  };

  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={id}>{label}</label>}
      <div className="input w-full">
        <input
          {...props}
          id={id}
          className={props.className}
          type={isVisiblePassword ? "text" : props.type}
        />
        {props.name === "password" && (
          <button type="button" onClick={handleTogglePassword}>
            {isVisiblePassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
}
