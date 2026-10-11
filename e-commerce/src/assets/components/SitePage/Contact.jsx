import React, { useState } from "react";
import { sendContactMessage } from "../../../services/siteApi";
import { getErrorMessage } from "../../../services/axiosConfig";
import { useAuth } from "../../../context/AuthContext";

export default function Contact() {
  const { currentUser } = useAuth();

  const [form, setForm] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    subject: "",
    message: "",
  });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setDone("");

    try {
      const response = await sendContactMessage(form);
      setDone(response.data.message);
      setForm({ ...form, subject: "", message: "" });
    } catch (err) {
      setError(getErrorMessage(err, "Message send nahi hua."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "640px", minHeight: "60vh" }}>
      <h1 className="fw-bold">Contact us</h1>
      <p className="text-secondary mb-4">Question, feedback or a problem with an order? Send us a message.</p>

      {done && <div className="alert alert-success">{done}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form className="card border-0 shadow-sm p-4" onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="small text-secondary">Name</label>
            <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="small text-secondary">Email</label>
            <input className="form-control" type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="col-12">
            <label className="small text-secondary">Subject</label>
            <input className="form-control" name="subject" value={form.subject} onChange={handleChange} />
          </div>
          <div className="col-12">
            <label className="small text-secondary">Message</label>
            <textarea className="form-control" rows={5} name="message" maxLength={2000} value={form.message} onChange={handleChange} required />
          </div>
          <div className="col-12">
            <button className="btn btn-danger" type="submit" disabled={busy}>
              {busy ? "Sending..." : "Send message"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
