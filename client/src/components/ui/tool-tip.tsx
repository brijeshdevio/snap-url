export function ToolTip({
  children,
  content,
}: {
  children: React.ReactNode;
  content: string;
}) {
  return (
    <div className="tooltip">
      <div className="tooltip-toggle" title={content}>
        {children}
      </div>
    </div>
  );
}
