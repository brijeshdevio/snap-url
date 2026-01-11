import { SearchIcon } from "lucide-react";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="w-full h-screen flex items-center justify-center">
      <main className="layout-container flex grow flex-col justify-center items-center py-10 px-4 md:px-40">
        <div className="layout-content-container flex flex-col max-w-[960px] w-full items-center">
          <div className="flex flex-col items-center gap-8 w-full max-w-2xl text-center">
            {/* <!-- Illustration --> */}
            <div className="relative w-full max-w-[320px] aspect-[4/3] flex items-center justify-center">
              {/* <!-- Abstract illustration representing emptiness or error --> */}
              <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl transform scale-75"></div>
              <div className="relative z-10 flex flex-col items-center justify-center">
                <h1 className="text-[120px] md:text-[160px] font-extrabold leading-none text-primary/20 dark:text-primary/30 tracking-tighter select-none">
                  404
                </h1>
                <div className="absolute inset-0 flex items-center justify-center">
                  <SearchIcon className="w-16 h-16 md:w-20 md:h-20 text-primary/40 dark:text-primary/50" />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-[#111318] dark:text-white text-3xl md:text-4xl font-extrabold leading-tight tracking-[-0.015em]">
                Oops! Page not found
              </h2>
              <p className="text-sm opacity-70">
                The page you are looking for might have been removed, had its
                name changed, or is temporarily unavailable. Please check the
                URL for proper spelling and capitalization.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full justify-center">
              <Link to="/">
                <button className="btn btn-primary rounded-full">
                  <span className="truncate">Return to Home</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </main>
  );
}
