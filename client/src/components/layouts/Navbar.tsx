import { Settings } from "lucide-react";
import { Link } from "react-router-dom";

const navItems = [
  { to: "/playground", label: "Playground" },
  { to: "/keys", label: "API Keys" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/docs", label: "Docs" },
  { to: "/settings", label: <Settings /> },
];

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 z-10  navbar rounded-box flex w-full items-center justify-between gap-2 border-b border-white/5">
      <div className="navbar-start max-md:w-1/4">
        <Link to="/" className="logo">
          <span className="text-xl !font-extrabold">SnapURL</span>
        </Link>
      </div>
      <div className="md:hidden">
        <button
          type="button"
          className="collapse-toggle btn btn-outline btn-secondary btn-sm btn-square"
          data-collapse="#default-navbar-collapse"
          aria-controls="default-navbar-collapse"
          aria-label="Toggle navigation"
        >
          <span className="icon-[tabler--menu-2] collapse-open:hidden size-4"></span>
          <span className="icon-[tabler--x] collapse-open:block hidden size-4"></span>
        </button>
      </div>
      <div
        id="default-navbar-collapse"
        className="md:navbar-end collapse hidden grow basis-full overflow-hidden transition-[height] duration-300 max-md:w-full"
      >
        <ul className="menu md:menu-horizontal gap-2 p-0 text-base max-md:mt-2">
          {navItems?.map((item) => (
            <li key={item.to}>
              <Link to={item.to}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
