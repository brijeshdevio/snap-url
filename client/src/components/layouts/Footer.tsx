import { Images } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="w-full border-t border-secondary/10 px-3 py-5">
      <div className="w-full sm:w-[90%] mx-auto">
        <div>
          <Link
            to="/"
            title="SnapURL"
            className="flex items-center gap-1.5 text-xl font-bold sm:gap-3"
          >
            <Images className="text-primary" size={30} />
            <span>SnapURL</span>
          </Link>
          <p className="text-sm opacity-70 mt-2">
            The simplest API for image uploads.
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} SnapURL. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
