import { Link } from "react-router-dom";
import { ArrowRight, Github } from "lucide-react";
import { InputField, type InputFieldProps } from "@/components";
import { useLogin } from "@/queries/auth.query";
import { isAxiosError } from "axios";

const formFields = [
  {
    label: "Email Address",
    type: "email",
    name: "email",
    placeholder: "e.g. name@domain.com",
  },
  {
    label: "Password",
    type: "password",
    name: "password",
    placeholder: "••••••••",
  },
];

export function LoginPage() {
  const { mutate, isPending, error } = useLogin();
  const errors = isAxiosError(error) ? error.response?.data?.errors : null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    mutate(Object.fromEntries(formData));
  };

  return (
    <section className="flex flex-col gap-5 w-full max-w-[440px] mx-auto ">
      <div className="text-center">
        <h1 className="text-2xl mb-1">Welcome back</h1>
        <p className="text-md opacity-70">
          Log in to manage your API keys and projects.
        </p>
      </div>

      <div>
        <Link
          to={import.meta.env.VITE_API_URL + "/auth/github"}
          className="btn btn-accent btn-gradient w-full"
        >
          <Github size={20} />
          <span>Continue with Github</span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="divider"></div>
        <span className="opacity-70">OR</span>
        <div className="divider"></div>
      </div>

      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        {formFields?.map((field) => (
          <InputField
            key={field.name}
            {...field}
            required
            errors={errors as InputFieldProps["errors"]}
          />
        ))}
        <button
          type="submit"
          className="btn btn-primary btn-gradient"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <span className="loading loading-spinner"></span>
            </>
          ) : (
            <>
              <span>Log in</span>
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </form>

      <div className="opacity-70 text-center">
        <p>
          Don't have an account?{" "}
          <Link
            to={"/signup"}
            className=" link-animated hover:text-primary text-base-content"
          >
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
}
