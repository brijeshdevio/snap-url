import { Link } from "react-router-dom";
import { ArrowRight, Github } from "lucide-react";
import { InputField } from "@/components";

const formFields = [
  {
    label: "Full Name",
    type: "text",
    name: "name",
    placeholder: "e.g. John Doe",
  },
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



export function Signup() {
  return (
    <section className="flex flex-col gap-5 w-full max-w-[440px] mx-auto ">
      <div className="text-center">
        <h1 className="text-2xl mb-1">Create your account</h1>
        <p className="text-md opacity-70">Start your journey with the fastest, most reliable image upload API.</p>
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
          <span>Create Account</span>
          <ArrowRight size={20} />
        </button>
      </form>

      <div className="text-center text-sm opacity-70">
        <p>Why we need your email? We use it to send important account notifications and for password recovery.
        </p>
      </div>

      <div className="opacity-70 text-center">
        <p>Already have an account? <Link to={"/login"} className=" link-animated hover:text-primary text-base-content">Log in</Link></p>
      </div>
    </section>
  )
}
