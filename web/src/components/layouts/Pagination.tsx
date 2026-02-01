export function Pagination({
  hasNext,
  hasPrev,
  totalPages,
  page,
  onClick = () => {},
}: { onClick: (page: number) => void } & {
  hasNext: boolean;
  hasPrev: boolean;
  totalPages: number;
  page: number;
}) {
  const handleClick = (page: number) => {
    return () => onClick(page);
  };

  return (
    <nav className="join">
      <button
        type="button"
        className="btn btn-soft btn-square join-item"
        aria-label="Previous Button"
        disabled={!hasPrev}
        onClick={handleClick(page - 1)}
      >
        «
      </button>
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          className="btn btn-soft join-item btn-square aria-[current='page']:text-bg-soft-primary"
          disabled={index + 1 === page}
          onClick={handleClick(index + 1)}
        >
          {index + 1}
        </button>
      ))}
      <button
        type="button"
        className="btn btn-soft btn-square join-item"
        aria-label="Next Button"
        disabled={!hasNext}
        onClick={handleClick(page + 1)}
      >
        »
      </button>
    </nav>
  );
}
