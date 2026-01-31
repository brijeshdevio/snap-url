import { Link } from "react-router-dom";
import { ArrowRight, Github } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { useLoginFacade } from "@/features/auth/auth.hooks";

function Form() {
  const { isPending, submit, handleSubmit, register, errors } =
    useLoginFacade();

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit(submit)}>
      <Input
        type="email"
        label="Email Address"
        placeholder="e.g. username@domain.com"
        {...register("email")}
        error={errors.email}
      />
      <Input
        type="password"
        label="Password"
        placeholder="••••••••"
        {...register("password")}
        error={errors.password}
      />
      <Button
        type="submit"
        isLoading={isPending}
        className="btn-gradient btn-primary"
      >
        <span>Log in</span>
        <ArrowRight size={20} />
      </Button>
    </form>
  );
}

export function Login() {
  return (
    <section className="mx-auto flex w-full flex-col gap-5">
      <div className="text-center">
        <h1 className="mb-1 text-2xl">Welcome back</h1>
        <p className="text-md opacity-70">Log in to manage your projects.</p>
      </div>

      <div>
        <Link
          to={import.meta.env.VITE_API_URL + "/auth/github"}
          className="btn btn-gradient w-full"
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

      <Form />

      <div className="text-center opacity-70">
        <p>
          Don't have an account?{" "}
          <Link
            to={"/register"}
            className="link-animated hover:text-primary text-base-content"
          >
            Register
          </Link>
        </p>
      </div>
    </section>
  );
}
