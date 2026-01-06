import { clsx } from "clsx";

export function Loader({ className = "" }: { className?: string }) {
  return (
    <div
      className={clsx(
        "w-full h-full flex items-center justify-center",
        className
      )}
    >
      <div className="flex flex-col items-center gap-2">
        <span className={"loading loading-spinner loading-sm"}></span>
        <p>Loading... </p>
      </div>
    </div>
  );
}
