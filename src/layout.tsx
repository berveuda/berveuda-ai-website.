import { useEffect, useRef, useState } from "react";
import {
  Menu,
  X,
  ScanLine,
  SlidersHorizontal,
  CalendarClock,
  MessagesSquare,
} from "lucide-react";
import { Brand } from "./brand";
import { solutions } from "./content";

export const icons = [
  ScanLine,
  SlidersHorizontal,
  CalendarClock,
  MessagesSquare,
];
const navigation = [
  ["Home", "/"],
  ["Solutions", "/solutions"],
  ["Industries", "/industries"],
  ["How it works", "/how-it-works"],
  ["About", "/about"],
];
export function Header({ path }: { path: string }) {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    function escape(e: KeyboardEvent) {
      if (e.key === "Escape" && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    }
    function wide() {
      if (window.innerWidth > 900) setOpen(false);
    }
    window.addEventListener("keydown", escape);
    window.addEventListener("resize", wide);
    return () => {
      window.removeEventListener("keydown", escape);
      window.removeEventListener("resize", wide);
    };
  }, [open]);
  return (
    <header className="header">
      <div className="container header-inner">
        <Brand />
        <button
          ref={toggle}
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="site-nav"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav
          id="site-nav"
          aria-label="Main"
          className={open ? "nav is-open" : "nav"}
        >
          {navigation.map(([name, url]) => (
            <a
              key={url}
              href={url}
              aria-current={path === url ? "page" : undefined}
            >
              {name}
            </a>
          ))}
          <a
            className="btn main-cta"
            aria-current={path === "/contact" ? "page" : undefined}
            href="/contact"
          >
            Request an assessment
          </a>
        </nav>
      </div>
    </header>
  );
}
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="eyebrow">
      <span aria-hidden="true" className="ticks" />
      {children}
    </p>
  );
}
export function Cta() {
  return (
    <aside className="closing">
      <div className="container closing-body">
        <div>
          <Eyebrow>Workflow assessment</Eyebrow>
          <h2>
            Where does work stall
            <br />
            in your office?
          </h2>
          <p>Bring one recurring task. We’ll look at the handoffs together.</p>
        </div>
        <a href="/contact" className="btn primary">
          Request an Automation Assessment
        </a>
      </div>
    </aside>
  );
}
export function Footer() {
  return (
    <footer>
      <div className="container footer-main">
        <div>
          <Brand />
          <p>Practical automation for industrial service businesses.</p>
        </div>
        <nav aria-label="Footer">
          {navigation.slice(1).map(([n, url]) => (
            <a key={url} href={url}>
              {n}
            </a>
          ))}
          <a href="/contact">Contact</a>
        </nav>
      </div>
      <div className="container footer-base">
        <span>Berveuda AI · A Berveuda business</span>
        <div>
          <a href="/privacy">Privacy policy</a>
          <a href="/terms">Terms of use</a>
        </div>
      </div>
    </footer>
  );
}
export function CapabilityStrip() {
  return (
    <nav className="capabilities" aria-label="Featured solutions">
      <div className="container">
        {solutions.map((s, i) => {
          const Icon = icons[i];
          return (
            <a href={"/solutions#" + s.id} key={s.id}>
              <Icon aria-hidden="true" />
              <span>{s.short}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
export function Plant({ hero = false }: { hero?: boolean }) {
  return (
    <img
      className={hero ? "plant hero-plant" : "plant"}
      src="/images/plant-1000.webp"
      srcSet="/images/plant-600.webp 600w, /images/plant-1000.webp 1000w, /images/plant-1500.webp 1500w"
      sizes={
        hero
          ? "(max-width: 640px) 100vw, 72vw"
          : "(max-width: 800px) 100vw, 48vw"
      }
      width="1500"
      height="1000"
      loading={hero ? "eager" : "lazy"}
      fetchPriority={hero ? "high" : "auto"}
      alt="Blue industrial boiler with pressure gauges and overhead steel pipework"
    />
  );
}
export function PageIntro({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <section className="page-intro">
      <div className="container">
        <Eyebrow>{label}</Eyebrow>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}
