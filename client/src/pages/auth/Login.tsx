import { Link } from "react-router-dom";
import { ArrowRight, Github } from "lucide-react";
import { InputField } from "@/components";

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



export function Login() {
  return (
    <section className="flex flex-col gap-5 w-full max-w-[440px] mx-auto ">
      <div className="text-center">
        <h1 className="text-2xl mb-1">Welcome back</h1>
        <p className="text-md opacity-70">Log in to manage your API keys and projects.</p>
      </div>

      <div>
        <Link to={"/auth/github"} className="btn btn-accent btn-gradient w-full" >
          <Github size={20} />
          <span>Continue with Github</span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="divider"></div>
        <span className="opacity-70">OR</span>
        <div className="divider"></div>
      </div>

      <form className="flex flex-col gap-3">
        {formFields?.map((field) => (
          <InputField key={field.name} {...field} />
        ))}
        <button
          type="submit"
          className="btn btn-primary btn-gradient"
        >
          <span>Log in</span>
          <ArrowRight size={20} />
        </button>
      </form>

      <div className="opacity-70 text-center">
        <p>Don't have an account? <Link to={"/signup"} className=" link-animated hover:text-primary text-base-content">Sign up</Link></p>
      </div>
    </section>
  )
}
