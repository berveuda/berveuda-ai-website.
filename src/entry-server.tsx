import { renderToString } from "react-dom/server";
import { App } from "./App";
export { pages, missingPage } from "./content";
export function render(path: string) {
  return renderToString(<App path={path} />);
}
