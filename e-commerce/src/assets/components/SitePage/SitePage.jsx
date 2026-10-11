import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSitePage } from "../../../services/siteApi";

// /page/:slug -> About, FAQ, Privacy... (content backend/database se)
export default function SitePage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [state, setState] = useState("loading"); // loading | ok | missing

  useEffect(() => {
    setState("loading");

    getSitePage(slug)
      .then((response) => {
        setPage(response.data);
        setState("ok");
      })
      .catch(() => setState("missing"));
  }, [slug]);

  if (state === "loading") {
    return <div className="container py-5 text-center text-secondary">Loading...</div>;
  }

  if (state === "missing") {
    return (
      <div className="container py-5 text-center" style={{ minHeight: "50vh" }}>
        <h3 className="fw-bold">Page not found</h3>
        <Link to="/" className="btn btn-danger mt-2">Go to home</Link>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ maxWidth: "800px", minHeight: "50vh" }}>
      <h1 className="fw-bold mb-4">{page.title}</h1>

      {/* Blank line se paragraph alag hote hain */}
      {page.content.split(/\n\s*\n/).map((para, i) => (
        <p key={i} style={{ whiteSpace: "pre-line" }}>{para.trim()}</p>
      ))}
    </div>
  );
}
