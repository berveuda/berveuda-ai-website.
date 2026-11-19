import { Header, Footer } from "./layout";
import { Home } from "./Home";
import {
  About,
  Industries,
  Legal,
  NotFound,
  Process,
  Solutions,
} from "./Pages";
import { Contact } from "./Contact";

const routes: Record<string, React.ReactNode> = {
  "/": <Home />,
  "/solutions": <Solutions />,
  "/industries": <Industries />,
  "/how-it-works": <Process />,
  "/about": <About />,
  "/contact": <Contact />,
  "/privacy": <Legal privacy />,
  "/terms": <Legal privacy={false} />,
};
export function App({ path }: { path: string }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header path={path} />
      <main id="main" tabIndex={-1}>
        {Object.hasOwn(routes, path) ? routes[path] : <NotFound />}
      </main>
      <Footer />
    </>
  );
}
