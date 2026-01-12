import { useResendEmail } from "@/queries/auth.query";
import { ArrowLeft, Mail, MailCheck } from "lucide-react";
import { Link, Navigate, useSearchParams } from "react-router-dom";

export function SendVerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const { mutate: resendEmail, isPending } = useResendEmail();

  const email = searchParams.get("email");

  const handleResendEmail = () => {
    if (email) {
      resendEmail({ email });
    }
  };

  if (!email) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <section>
        <div className="card bg-base-200 mx-auto max-w-[400px] w-full border border-white/10 shadow-xl">
          <div className="card-body py-10 space-y-3">
            <div className="p-5 bg-primary/10 rounded-full w-fit mx-auto">
              <MailCheck className="w-12 h-12 text-primary" />
            </div>
            <div className="text-center space-y-4">
              <h2 className="text-2xl">Check your inbox</h2>
              <p className="text-white/70">
                We've sent a verification link to{" "}
                <strong className="text-primary">{email}</strong>. Please click
                the link in that email to activate your SnapURL account.
              </p>
              <p className="text-white/50">
                Can't find it? Don't forget to check your spam folder just in
                case.
              </p>
              <div>
                <button
                  className="btn btn-primary btn-gradient"
                  onClick={handleResendEmail}
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner"></span>
                    </>
                  ) : (
                    <>
                      <Mail size={20} />
                      <span>Resend Verification Email</span>
                    </>
                  )}
                </button>
              </div>
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
        </div>
      </section>
    </>
  );
}
