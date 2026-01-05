export function Footer() {
  return (
    <footer className="w-full border-t border-secondary/10 px-3 py-5">
      <div className="w-full sm:w-[90%] mx-auto">
        <div className="text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} SnapURL. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
