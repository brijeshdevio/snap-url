export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 px-3 py-5 rounded-t-2xl shadow">
      <div className="w-full sm:w-[90%] mx-auto">
        <div className="text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} <span className="logo">SnapURL</span>.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
