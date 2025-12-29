import { Link } from "react-router-dom";
import { Images } from "lucide-react";

type LinkItemProps = {
  to: string;
  label: string;
};

function LinkItem({ to, label }: LinkItemProps) {
  return (
    <Link
      to={to}
      className="px-2 link link-animated hover:text-primary text-base-content inline-flex items-center max-md:hidden"
    >
      <span>{label}</span>
    </Link>
  );
}

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full p-3 bg-base-100 border-b border-secondary/10">
      <div className="w-full sm:w-[90%] flex items-center justify-between mx-auto">
        <Link
          to="/"
          title="SnapURL"
          className="flex items-center gap-1.5 text-xl font-bold sm:gap-3"
        >
          <Images className="text-primary" size={30} />
          <span>SnapURL</span>
        </Link>

        <div className="flex items-center gap-x-5">
          <LinkItem to="/dashboard" label="Dashboard" />
          <LinkItem to="/docs" label="Docs" />
          <LinkItem to="/pricing" label="Pricing" />
        </div>

        <div className="flex items-center gap-x-2">
          <Link
            to={"/login"}
            className="btn btn-secondary btn-gradient text-nowrap"
          >
            <span>Log in</span>
          </Link>
          <Link
            to={"/signup"}
            className="btn btn-primary btn-gradient text-nowrap"
          >
            <span>Sign up for free</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
