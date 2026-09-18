import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import { HomeExperience } from "../app/home/HomeExperience";
import { SignalExperience } from "../app/signal/SignalExperience";
import { IndexExperience } from "../app/index/IndexExperience";
import { HumanExperience } from "../app/human/HumanExperience";
import "../app/globals.css";
import "../app/home/home.css";
import "../app/signal/signal.css";
import "../app/index/index.css";
import "../app/human/human.css";

type Route = "/" | "/signal" | "/index" | "/human";

const routes = new Set<Route>(["/", "/signal", "/index", "/human"]);

function routeFromHash(): Route {
  const candidate = window.location.hash.slice(1).replace(/\/$/, "") || "/";
  return routes.has(candidate as Route) ? (candidate as Route) : "/";
}

function StaticPrototype() {
  const [route, setRoute] = useState<Route>(routeFromHash);

  useEffect(() => {
    const updateRoute = () => {
      // "#/signal" is a route; "#contact" is an in-page anchor on the home page and must keep its scroll.
      const isRouteHash = window.location.hash === "" || window.location.hash.startsWith("#/");
      setRoute(routeFromHash());
      if (isRouteHash) window.scrollTo({ top: 0, behavior: "instant" });
    };

    const navigate = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest("a");
      if (
        !anchor ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) return;

      const href = anchor.getAttribute("href") as Route | null;
      if (!href || !routes.has(href)) return;

      event.preventDefault();
      window.location.hash = href;
    };

    window.addEventListener("hashchange", updateRoute);
    document.addEventListener("click", navigate);
    return () => {
      window.removeEventListener("hashchange", updateRoute);
      document.removeEventListener("click", navigate);
    };
  }, []);

  // The page is client-rendered here, so the browser's own fragment scroll ran before the target existed.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (route !== "/" || !id || id.startsWith("/")) return;
    const frame = requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
    return () => cancelAnimationFrame(frame);
  }, [route]);

  let content;
  if (route === "/signal") content = <SignalExperience />;
  else if (route === "/index") content = <IndexExperience />;
  else if (route === "/human") content = <HumanExperience />;
  else content = <HomeExperience />;

  return <>{content}</>;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StaticPrototype />
  </StrictMode>,
);
