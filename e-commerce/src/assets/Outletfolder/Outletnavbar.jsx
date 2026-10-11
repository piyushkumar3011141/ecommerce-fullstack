import React, { useEffect, useRef } from "react";
import Navbar from "../components/Navbar/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/footer/Footer";

export default function Outletnavbar() {
  const headerRef = useRef(null);
  const { pathname } = useLocation();

  // Header ki height CSS variable me rakhte hain (sticky filters waghera isse use karte hain)
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const setHeight = () =>
      document.documentElement.style.setProperty(
        "--header-h",
        `${el.getBoundingClientRect().height}px`
      );

    setHeight();

    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(setHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Naye page par upar se shuru ho
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div>

      <header className="site-header" ref={headerRef}>
        <Navbar />
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <Footer />
      </footer>

    </div>
  );
}
