import MD from "@uiw/react-markdown-preview";

export function MarkdownPreview({ source }: { source: string }) {
  return <MD source={source} style={{ padding: 16 }} />;
}
