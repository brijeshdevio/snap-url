import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const navItems = [
  { to: "/playground", label: "Playground" },
  { to: "/docs", label: "Docs" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/images", label: "Images" },
  { to: "/profile", label: "Profile" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full sticky top-0 bg-base-100 z-50 rounded-2xl shadow border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 w-full">
          {/* Logo */}
          <div className="flex items-center justify-between max-md:w-1/4">
            <Link to="/" className="logo">
              <span className="text-xl !font-extrabold">SnapURL</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-2">
            {navItems?.map((item) => (
              <Link
                key={`nav-item-${item.label}`}
                to={item.to}
                className="dropdown-item"
              >
                {item.label}
              </Link>
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
            <div className="pb-3 space-y-1">
              {navItems?.map((item) => (
                <Link
                  key={`mobile-menu-${item.label}`}
                  to={item.to}
                  className="dropdown-item"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export { Navbar };
