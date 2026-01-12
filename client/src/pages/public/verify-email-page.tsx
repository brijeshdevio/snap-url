import { ArrowLeft, ArrowRight, CircleCheckBig, CircleX } from "lucide-react";
import { Link } from "react-router-dom";
import { Loader } from "@/components";
import { useVerifyEmail } from "@/queries/auth.query";

function SuccessCard() {
  return (
    <div className="card bg-base-200 mx-auto max-w-[400px] w-full border border-white/10 shadow-xl">
      <div className="card-body py-10 space-y-3">
        <div className="p-5 bg-primary/10 rounded-full w-fit mx-auto">
          <CircleCheckBig className="w-12 h-12 text-primary" />
        </div>
        <div className="text-center space-y-4">
          <h2 className="text-2xl">Success!</h2>
          <p className=" text-white/70">
            Your email has been verified. You can now access your dashboard and
            start uploading images via our API.
          </p>
          <div>
            <Link to={"/dashboard"} className="btn btn-primary btn-gradient">
              <span>Go to Dashboard</span>
              <ArrowRight size={20} />
            </Link>
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
  );
}

function ErrorCard() {
  return (
    <div className="card bg-base-200 mx-auto max-w-[400px] w-full border border-white/10 shadow-xl">
      <div className="card-body py-10 space-y-3">
        <div className="p-5 bg-error/10 rounded-full w-fit mx-auto">
          <CircleX className="w-12 h-12 text-error" />
        </div>
        <div className="text-center space-y-4">
          <h2 className="text-2xl">Failed!</h2>
          <p className=" text-white/70">
            Your email has not been verified. Please try again.
          </p>
          <div>
            <Link to={"/dashboard"} className="btn btn-primary btn-gradient">
              <span>Go to Dashboard</span>
              <ArrowRight size={20} />
            </Link>
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
  );
}

export function VerifyEmailPage() {
  const { isPending, isError, data } = useVerifyEmail();

  if (isPending) {
    return <Loader />;
  }

  if (isError) {
    return (
      <section>
        <ErrorCard />
      </section>
    );
  }
  if (data?.success) {
    return (
      <section>
        <SuccessCard />
      </section>
    );
  }

  return (
    <>
      <section>
        <Loader />
      </section>
    </>
  );
}
