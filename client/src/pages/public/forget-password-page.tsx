import { InputField } from "@/components";
import { ArrowLeft, MailCheck } from "lucide-react";
import { Link } from "react-router-dom";

export function ForgetPasswordPage() {
  return (
    <>
      <section>
        <div className="card bg-base-200 mx-auto max-w-[400px] w-full border border-white/10 shadow-xl">
          <div className="card-body py-10 space-y-3">
            <div className="p-5 bg-primary/10 rounded-full w-fit mx-auto">
              <MailCheck className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl text-center">Reset your password</h2>
            <p className=" text-white/70 text-center">
              Enter the email address associated with your account and we'll
              send you a link to reset your password.
            </p>
            <form className="space-y-3">
              <InputField
                label="Email Address"
                type="email"
                name="email"
                placeholder="name@company.com"
              />
              <button className="btn btn-primary btn-gradient w-full">
                Send Reset Link
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
