import { InputField } from "@/components";
import { ArrowLeft, ArrowRight, LockKeyhole } from "lucide-react";
import { Link } from "react-router-dom";

const formFields = [
  {
    label: "New Password",
    type: "password",
    name: "newPassword",
    placeholder: "Enter new password",
  },
  {
    label: "Confirm New Password",
    type: "password",
    name: "confirmPassword",
    placeholder: "Re-type new password",
  },
];

export function ResetPasswordPage() {
  return (
    <>
      <section>
        <div className="card bg-base-200 mx-auto max-w-[400px] w-full border border-white/10 shadow-xl">
          <div className="card-body py-10 space-y-3">
            <div className="p-5 bg-primary/10 rounded-full w-fit mx-auto">
              <LockKeyhole className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl text-center">Reset your password</h2>
            <p className=" text-white/70 text-center">
              Set a secure password to regain access to your account and API
              dashboard.
            </p>
            <form className="flex flex-col gap-3">
              {formFields?.map((field) => (
                <InputField key={field.name} {...field} required />
              ))}
              <button type="submit" className="btn btn-primary btn-gradient">
                <span>Reset Password</span>
                <ArrowRight size={20} />
              </button>
            </form>
            <div>
              <Link
                to="/login"
                className="text-primary flex items-center gap-x-1 mx-auto w-fit"
              >
                <ArrowLeft size={20} />
                <span>Back to login</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
