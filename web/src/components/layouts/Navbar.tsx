import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const navItems = [
  { to: "/projects", label: "Projects" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/images", label: "Images" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-base-100 sticky top-0 z-50 w-full rounded-2xl border-b border-white/10 shadow">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex h-16 w-full items-center justify-between">
          {/* Logo */}
          <div className="flex items-center justify-between max-md:w-1/4">
            <Link to="/" className="logo">
              <span className="text-xl">SnapURL</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden space-x-2 md:flex">
            {navItems?.map((item) => (
              <NavLink
                key={`nav-item-${item.label}`}
                to={item.to}
                className={({ isActive }) =>
                  `dropdown-item font-space-grotesk text-sm font-semibold ${isActive ? "text-primary dropdown-active" : "text-base-content/70"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="dropdown-toggle btn btn-text btn-circle dropdown-open:bg-base-content/10 dropdown-open:text-base-content"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="space-y-1 pb-3">
              {navItems?.map((item) => (
                <NavLink
                  key={`mobile-menu-${item.label}`}
                  to={item.to}
                  className={({ isActive }) =>
                    `dropdown-item font-space-grotesk text-sm font-semibold ${isActive ? "text-primary dropdown-active" : "text-base-content/70"}`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export { Navbar };
