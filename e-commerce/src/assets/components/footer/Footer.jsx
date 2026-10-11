import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import { getFooter, subscribeNewsletter } from "../../../services/siteApi";
import { getErrorMessage } from "../../../services/axiosConfig";

// Backend band ho to bhi footer khali na dikhe
const FALLBACK = [
  { id: 1, section: "SHOP", sectionOrder: 1, sortOrder: 1, label: "All Products", path: "/allproduct" },
  { id: 2, section: "SHOP", sectionOrder: 1, sortOrder: 2, label: "Deals & Offers", path: "/deals" },
  { id: 3, section: "HELP", sectionOrder: 2, sortOrder: 1, label: "Contact Us", path: "/contact" },
];

const isExternal = (path) => /^https?:\/\//i.test(path);

function FooterLinkItem({ link }) {
  const content = (
    <>
      {link.icon && <i className={link.icon}></i>} {link.label}
    </>
  );

  return isExternal(link.path) ? (
    <a href={link.path} target="_blank" rel="noopener noreferrer" className="footer-link">
      {content}
    </a>
  ) : (
    <Link to={link.path} className="footer-link">
      {content}
    </Link>
  );
}

export default function Footer() {
  const [links, setLinks] = useState(FALLBACK);
  const [email, setEmail] = useState("");
  const [note, setNote] = useState({ text: "", ok: true });
  const [busy, setBusy] = useState(false);

  // Footer database (backend) se aata hai
  useEffect(() => {
    getFooter()
      .then((response) => {
        if (Array.isArray(response.data) && response.data.length > 0) {
          setLinks(response.data);
        }
      })
      .catch((error) => console.error("Footer Fetch Error:", error));
  }, []);

  const { sections, bottom } = useMemo(() => {
    const grouped = new Map();
    links
      .filter((l) => l.section !== "BOTTOM")
      .forEach((l) => {
        if (!grouped.has(l.section)) grouped.set(l.section, []);
        grouped.get(l.section).push(l);
      });

    return {
      sections: [...grouped.entries()],
      bottom: links.filter((l) => l.section === "BOTTOM"),
    };
  }, [links]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setBusy(true);
    setNote({ text: "", ok: true });

    try {
      const response = await subscribeNewsletter(email);
      setNote({ text: response.data.message, ok: true });
      setEmail("");
    } catch (error) {
      setNote({ text: getErrorMessage(error, "Subscribe nahi ho paaya."), ok: false });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="site-footer">
      <div className="site-footer__main">

        {/* ================= LINK COLUMNS (backend se) ================= */}
        {sections.map(([name, items]) => (
          <div className="footer-col" key={name}>
            <h6>{name}</h6>
            <ul>
              {items.map((link) => (
                <li key={link.id}>
                  <FooterLinkItem link={link} />
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* ================= NEWSLETTER ================= */}
        <div className="footer-col footer-col--news">
          <h6>NEWSLETTER</h6>
          <p>Get deals and new arrivals in your inbox.</p>

          <form onSubmit={handleSubscribe} className="footer-news">
            <input
              type="email"
              required
              placeholder="Your email"
              aria-label="Email for newsletter"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" disabled={busy}>{busy ? "..." : "Subscribe"}</button>
          </form>

          {note.text && (
            <p className={`footer-note ${note.ok ? "ok" : "bad"}`}>{note.text}</p>
          )}
        </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="site-footer__bottom">
        <div className="footer-bottom-links">
          {bottom.map((link) => (
            <FooterLinkItem key={link.id} link={link} />
          ))}
        </div>

        <span className="footer-copy">
          <i className="fa-regular fa-copyright"></i> {new Date().getFullYear()} E-Commerce. All rights reserved.
        </span>
      </div>
    </div>
  );
}
