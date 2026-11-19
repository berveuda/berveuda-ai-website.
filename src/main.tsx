import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App";
import "./style.css";
const path = window.location.pathname.replace(/\/+$/, "") || "/";
const root = document.getElementById("root")!;
if (root.hasChildNodes()) hydrateRoot(root, <App path={path} />);
else createRoot(root).render(<App path={path} />);
