import { Markdown } from "@/components/ui";
import { docs } from "@/data/docs";

export function Docs() {
  return <Markdown>{docs}</Markdown>;
}
