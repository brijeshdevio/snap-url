import MD from "@uiw/react-markdown-preview";

export function MarkdownPreview({ source }: { source: string }) {
  return (
    <MD
      source={source}
      style={{ padding: 0 }}
      className="!bg-base-200 rounded-lg border border-white/10 shadow"
    />
  );
}
