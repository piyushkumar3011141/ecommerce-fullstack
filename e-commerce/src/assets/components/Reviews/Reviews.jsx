import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { deleteReview, getReviews, saveReview } from "../../../services/reviewApi";
import { getErrorMessage } from "../../../services/axiosConfig";
import { useAuth } from "../../../context/AuthContext";
import "./Reviews.css";

function Stars({ value, size = 16 }) {
  return (
    <span className="rv-stars" style={{ fontSize: size }} aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <i key={n} className={n <= Math.round(value) ? "fa-solid fa-star" : "fa-regular fa-star"}></i>
      ))}
    </span>
  );
}

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";

// Customer reviews: list, rating summary aur review form (login required)
export default function Reviews({ productId, onChanged }) {
  const { currentUser, isLoggedIn, isAdmin } = useAuth();
  const location = useLocation();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const response = await getReviews(productId);
      setReviews(response.data);
    } catch (err) {
      console.error("Reviews Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  const mine = useMemo(
    () => reviews.find((r) => currentUser && r.userId === currentUser.id),
    [reviews, currentUser]
  );

  // Apna review pehle se ho to form me bhar do (edit)
  useEffect(() => {
    if (mine) {
      setRating(mine.rating);
      setComment(mine.comment || "");
    }
  }, [mine]);

  const summary = useMemo(() => {
    const count = reviews.length;
    const avg = count ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0;
    const bars = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: reviews.filter((r) => r.rating === star).length,
    }));
    return { count, avg, bars };
  }, [reviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (rating < 1) {
      setError("Please select a star rating.");
      return;
    }

    setBusy(true);
    try {
      await saveReview(productId, { rating, comment });
      await load();
      onChanged?.();
    } catch (err) {
      setError(getErrorMessage(err, "Review save nahi hua."));
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (review) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      await deleteReview(review.id);
      if (review.userId === currentUser?.id) {
        setRating(0);
        setComment("");
      }
      await load();
      onChanged?.();
    } catch (err) {
      alert(getErrorMessage(err, "Review delete nahi hua."));
    }
  };

  return (
    <section className="rv">
      <h4 className="fw-bold mb-3">Customer reviews</h4>

      <div className="row g-4">
        {/* SUMMARY + FORM */}
        <div className="col-md-5">
          <div className="rv-card">
            {summary.count > 0 ? (
              <>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <span className="rv-avg">{summary.avg.toFixed(1)}</span>
                  <div>
                    <Stars value={summary.avg} size={18} />
                    <div className="small text-secondary">{summary.count} review{summary.count > 1 ? "s" : ""}</div>
                  </div>
                </div>

                {summary.bars.map((b) => (
                  <div className="rv-bar" key={b.star}>
                    <span>{b.star}★</span>
                    <div className="rv-bar__track">
                      <div className="rv-bar__fill" style={{ width: `${(b.count / summary.count) * 100}%` }}></div>
                    </div>
                    <span className="text-secondary">{b.count}</span>
                  </div>
                ))}
              </>
            ) : (
              <p className="text-secondary mb-0">No written reviews yet. Be the first to review this product!</p>
            )}
          </div>

          <div className="rv-card mt-3">
            <h6 className="fw-bold">{mine ? "Edit your review" : "Write a review"}</h6>

            {isLoggedIn ? (
              <form onSubmit={handleSubmit}>
                <div className="rv-picker" role="radiogroup" aria-label="Your rating">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      type="button"
                      key={n}
                      className={n <= rating ? "on" : ""}
                      onClick={() => setRating(n)}
                      aria-label={`${n} star${n > 1 ? "s" : ""}`}
                    >
                      <i className={n <= rating ? "fa-solid fa-star" : "fa-regular fa-star"}></i>
                    </button>
                  ))}
                </div>

                <textarea
                  className="form-control mb-2"
                  rows={3}
                  maxLength={1000}
                  placeholder="Share your experience with this product (optional)"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />

                {error && <div className="alert alert-danger py-1 small">{error}</div>}

                <button className="btn btn-danger btn-sm" type="submit" disabled={busy}>
                  {busy ? "Saving..." : mine ? "Update review" : "Submit review"}
                </button>
              </form>
            ) : (
              <p className="small text-secondary mb-0">
                <Link to="/account" state={{ from: location.pathname }}>Sign in</Link> to write a review.
              </p>
            )}
          </div>
        </div>

        {/* LIST */}
        <div className="col-md-7">
          {loading ? (
            <p className="text-secondary">Loading reviews...</p>
          ) : (
            reviews.map((r) => (
              <div className="rv-item" key={r.id}>
                <div className="d-flex justify-content-between align-items-start gap-2">
                  <div>
                    <Stars value={r.rating} />
                    <strong className="ms-2">{r.userName}</strong>
                    {r.verifiedPurchase && <span className="rv-verified"><i className="fa-solid fa-circle-check"></i> Verified purchase</span>}
                  </div>

                  {(r.userId === currentUser?.id || isAdmin) && (
                    <button className="btn btn-link btn-sm text-danger p-0" onClick={() => handleDelete(r)}>
                      Delete
                    </button>
                  )}
                </div>

                <div className="small text-secondary mb-1">{formatDate(r.createdAt)}</div>
                {r.comment && <p className="mb-0">{r.comment}</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
