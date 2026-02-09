import MD from "react-markdown";

export function Markdown({ children }: { children: string }) {
  return <MD>{children}</MD>;
}
