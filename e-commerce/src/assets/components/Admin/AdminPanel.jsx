import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./AdminPanel.css";

import {
  getAdminMessages,
  getAdminOrders,
  getAdminStats,
  getAdminUsers,
  setOrderStatus,
  toggleMessageResolved,
} from "../../../services/adminApi";
import {
  addProduct,
  addProductsBulk,
  deleteProduct,
  updateProduct,
} from "../../../services/productApi";
import { getErrorMessage } from "../../../services/axiosConfig";
import { useProducts } from "../../../context/ProductContext";
import { CATEGORIES } from "../../../data/categories";
import { products as seedProducts } from "../../../data/products";

const STATUSES = ["Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];
const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const date = (v) =>
  v ? new Date(v).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-";

const TABS = [
  ["dashboard", "Dashboard", "fa-solid fa-chart-line"],
  ["products", "Products", "fa-solid fa-box"],
  ["orders", "Orders", "fa-solid fa-receipt"],
  ["users", "Users", "fa-solid fa-users"],
  ["messages", "Messages", "fa-solid fa-envelope"],
];

// Ek hi hook se loading / error / reload sambhalte hain
function useLoader(fetcher) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    try {
      const response = await fetcher();
      setData(response.data);
      setError("");
    } catch (err) {
      setError(getErrorMessage(err, "Data not load"));
    }
  }, [fetcher]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, error, reload, setData };
}

function Status({ error, data }) {
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (data === null) return <p className="text-secondary">Loading...</p>;
  return null;
}

/* ---------------------------------------------------------------- DASHBOARD */
function Dashboard() {
  const { data, error } = useLoader(getAdminStats);

  if (!data) return <Status error={error} data={data} />;

  const cards = [
    ["Revenue", money(data.revenue), "fa-solid fa-indian-rupee-sign", "success"],
    ["Orders", data.totalOrders, "fa-solid fa-receipt", "primary"],
    ["Products", data.totalProducts, "fa-solid fa-box", "info"],
    ["Customers", data.totalUsers, "fa-solid fa-users", "warning"],
    ["Subscribers", data.subscribers, "fa-solid fa-newspaper", "secondary"],
    ["Open messages", data.openMessages, "fa-solid fa-envelope", "danger"],
  ];

  const maxStatus = Math.max(1, ...Object.values(data.ordersByStatus));

  return (
    <>
      <div className="adm-cards">
        {cards.map(([label, value, icon, color]) => (
          <div className={`adm-card adm-card--${color}`} key={label}>
            <i className={icon}></i>
            <div>
              <div className="adm-card__value">{value}</div>
              <div className="adm-card__label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3 mt-1">
        <div className="col-lg-5">
          <div className="adm-box">
            <h6 className="fw-bold">Orders by status</h6>
            {Object.entries(data.ordersByStatus).map(([status, count]) => (
              <div className="adm-bar" key={status}>
                <span>{status}</span>
                <div className="adm-bar__track">
                  <div className="adm-bar__fill" style={{ width: `${(count / maxStatus) * 100}%` }}></div>
                </div>
                <strong>{count}</strong>
              </div>
            ))}
          </div>

          <div className="adm-box mt-3">
            <h6 className="fw-bold">Low stock (5 or less)</h6>
            {data.lowStock.length === 0 ? (
              <p className="text-secondary small mb-0">All products are well stocked.</p>
            ) : (
              data.lowStock.map((p) => (
                <div className="d-flex justify-content-between small py-1 border-bottom" key={p.id}>
                  <span className="text-truncate me-2">{p.name}</span>
                  <strong className={p.stock === 0 ? "text-danger" : "text-warning"}>{p.stock}</strong>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="col-lg-7">
          <div className="adm-box">
            <h6 className="fw-bold">Recent orders</h6>
            <div className="table-responsive">
              <table className="table table-sm align-middle mb-0">
                <thead>
                  <tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {data.recentOrders.map((o) => (
                    <tr key={o.id}>
                      <td>#{o.orderNumber || o.id}</td>
                      <td>{o.customerName || "-"}</td>
                      <td>{money(o.total)}</td>
                      <td>{o.status}</td>
                    </tr>
                  ))}
                  {data.recentOrders.length === 0 && (
                    <tr><td colSpan="4" className="text-secondary">No orders yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ----------------------------------------------------------------- PRODUCTS */
const EMPTY_PRODUCT = {
  name: "", brand: "", category: CATEGORIES[0], subCategory: "", price: "", mrp: "",
  stock: 10, image: "", description: "", deal: false, featured: false, newArrival: false,
};

function ProductsTab() {
  const { products, refreshProducts } = useProducts();
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(null); // null = hidden, object = add/edit
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState({ text: "", ok: true });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? products.filter((p) => `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(q))
      : products;
  }, [products, query]);

  const say = (text, ok = true) => setMessage({ text, ok });

  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    say("");

    const price = Number(form.price);
    const mrp = Number(form.mrp) || price;

    const payload = {
      ...form,
      price,
      mrp,
      stock: Number(form.stock),
      discount: mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0,
      rating: form.rating ?? 0,
      reviews: form.reviews ?? 0,
    };

    try {
      if (form.id) await updateProduct(form.id, payload);
      else await addProduct(payload);

      await refreshProducts();
      setForm(null);
      say(form.id ? "Product updated." : "Product added.");
    } catch (err) {
      say(getErrorMessage(err, "Product not save."), false);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.name}"? It is also removed from carts and wishlists.`)) return;

    try {
      await deleteProduct(p.id);
      await refreshProducts();
      say("Product deleted.");
    } catch (err) {
      say(getErrorMessage(err, "Not Delete "), false);
    }
  };

  const importSamples = async () => {
    if (
      products.length > 0 &&
      !window.confirm(`There are already ${products.length} products in the database. Re-importing the sample products will create duplicates. Continue?`)
    ) return;

    setBusy(true);
    try {
      const withoutId = seedProducts.map(({ id, ...rest }) => rest);
      const response = await addProductsBulk(withoutId);
      await refreshProducts();
      say(`${response.data.length} sample products imported.`);
    } catch (err) {
      say(getErrorMessage(err, "Not Import"), false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="d-flex flex-wrap gap-2 mb-3">
        <input
          className="form-control adm-search"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-danger" onClick={() => setForm({ ...EMPTY_PRODUCT })}>
          <i className="fa-solid fa-plus"></i> Add product
        </button>
        <button className="btn btn-outline-secondary" onClick={importSamples} disabled={busy}>
          Import sample products
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.ok ? "success" : "danger"} py-2`}>{message.text}</div>
      )}

      {/* ADD / EDIT FORM */}
      {form && (
        <form className="adm-box mb-3" onSubmit={save}>
          <h6 className="fw-bold">{form.id ? `Edit product #${form.id}` : "New product"}</h6>

          <div className="row g-2">
            <div className="col-md-6">
              <label className="small text-secondary">Name</label>
              <input className="form-control" required value={form.name} onChange={(e) => setField("name", e.target.value)} />
            </div>
            <div className="col-md-3">
              <label className="small text-secondary">Brand</label>
              <input className="form-control" value={form.brand || ""} onChange={(e) => setField("brand", e.target.value)} />
            </div>
            <div className="col-md-3">
              <label className="small text-secondary">Category</label>
              <select className="form-select" value={form.category} onChange={(e) => setField("category", e.target.value)}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="col-6 col-md-3">
              <label className="small text-secondary">Price (₹)</label>
              <input className="form-control" type="number" min="1" required value={form.price} onChange={(e) => setField("price", e.target.value)} />
            </div>
            <div className="col-6 col-md-3">
              <label className="small text-secondary">MRP (₹)</label>
              <input className="form-control" type="number" min="0" value={form.mrp} onChange={(e) => setField("mrp", e.target.value)} />
            </div>
            <div className="col-6 col-md-3">
              <label className="small text-secondary">Stock</label>
              <input className="form-control" type="number" min="0" required value={form.stock} onChange={(e) => setField("stock", e.target.value)} />
            </div>
            <div className="col-6 col-md-3">
              <label className="small text-secondary">Sub category</label>
              <input className="form-control" value={form.subCategory || ""} onChange={(e) => setField("subCategory", e.target.value)} />
            </div>
            <div className="col-12">
              <label className="small text-secondary">Image URL</label>
              <input className="form-control" required value={form.image || ""} onChange={(e) => setField("image", e.target.value)} />
            </div>
            <div className="col-12">
              <label className="small text-secondary">Description</label>
              <textarea className="form-control" rows={2} value={form.description || ""} onChange={(e) => setField("description", e.target.value)} />
            </div>
            <div className="col-12 d-flex flex-wrap gap-3">
              {[["deal", "Deal"], ["featured", "Featured"], ["newArrival", "New arrival"]].map(([key, label]) => (
                <label className="form-check-label d-flex align-items-center gap-1" key={key}>
                  <input type="checkbox" className="form-check-input mt-0" checked={!!form[key]} onChange={(e) => setField(key, e.target.checked)} />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div className="mt-3 d-flex gap-2">
            <button className="btn btn-danger" type="submit" disabled={busy}>{busy ? "Saving..." : "Save"}</button>
            <button className="btn btn-outline-secondary" type="button" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="adm-box p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr><th></th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Rating</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td><img src={p.image} alt="" className="adm-thumb" /></td>
                  <td className="adm-name">{p.name}<div className="small text-secondary">{p.brand}</div></td>
                  <td>{p.category}</td>
                  <td>{money(p.price)}</td>
                  <td className={p.stock <= 5 ? "text-danger fw-bold" : ""}>{p.stock}</td>
                  <td>{Number(p.rating).toFixed(1)} ({p.reviews})</td>
                  <td className="text-nowrap">
                    <button className="btn btn-sm btn-outline-primary me-1" onClick={() => setForm({ ...p })}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => remove(p)}>Delete</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="7" className="text-secondary p-3">No products found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------- ORDERS */
function OrdersTab() {
  const { data, error, reload, setData } = useLoader(getAdminOrders);
  const [filter, setFilter] = useState("All");
  const [err, setErr] = useState("");

  if (!data) return <Status error={error} data={data} />;

  const change = async (order, status) => {
    setErr("");
    try {
      const response = await setOrderStatus(order.id, status);
      setData((list) => list.map((o) => (o.id === order.id ? response.data : o)));
    } catch (e) {
      setErr(getErrorMessage(e, "Status update nahi hua."));
      reload();
    }
  };

  const list = filter === "All" ? data : data.filter((o) => o.status === filter);

  return (
    <>
      <div className="d-flex flex-wrap gap-2 mb-3">
        {["All", ...STATUSES].map((s) => (
          <button key={s} className={`btn btn-sm ${filter === s ? "btn-danger" : "btn-outline-secondary"}`} onClick={() => setFilter(s)}>
            {s}
          </button>
        ))}
      </div>

      {err && <div className="alert alert-danger py-2">{err}</div>}

      <div className="adm-box p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr><th>Order</th><th>Date</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th></tr>
            </thead>
            <tbody>
              {list.map((o) => (
                <tr key={o.id}>
                  <td>#{o.orderNumber || o.id}</td>
                  <td className="text-nowrap small">{date(o.orderDate)}</td>
                  <td>{o.customerName || "-"}<div className="small text-secondary">{o.customerEmail}</div></td>
                  <td className="small">{(o.items || []).map((i) => `${i.productName} × ${i.quantity}`).join(", ")}</td>
                  <td className="text-nowrap">{money(o.total)}</td>
                  <td className="small">{o.payment}<div className="text-secondary">{o.paymentStatus}</div></td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={o.status}
                      disabled={o.status === "Cancelled"}
                      onChange={(e) => change(o, e.target.value)}
                    >
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr><td colSpan="7" className="text-secondary p-3">No orders.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------- USERS */
function UsersTab() {
  const { data, error } = useLoader(getAdminUsers);
  if (!data) return <Status error={error} data={data} />;

  return (
    <div className="adm-box p-0">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Role</th></tr></thead>
          <tbody>
            {data.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone || "-"}</td>
                <td><span className={`badge text-bg-${u.role === "ADMIN" ? "danger" : "secondary"}`}>{u.role}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- MESSAGES */
function MessagesTab() {
  const { data, error, setData } = useLoader(getAdminMessages);
  if (!data) return <Status error={error} data={data} />;

  const toggle = async (m) => {
    const response = await toggleMessageResolved(m.id);
    setData((list) => list.map((x) => (x.id === m.id ? response.data : x)));
  };

  if (data.length === 0) return <p className="text-secondary">No messages yet.</p>;

  return data.map((m) => (
    <div className={`adm-box mb-2 ${m.resolved ? "adm-resolved" : ""}`} key={m.id}>
      <div className="d-flex justify-content-between flex-wrap gap-2">
        <div>
          <strong>{m.subject || "(no subject)"}</strong>
          <div className="small text-secondary">{m.name} · {m.email} · {date(m.createdAt)}</div>
        </div>
        <button className={`btn btn-sm ${m.resolved ? "btn-outline-secondary" : "btn-success"}`} onClick={() => toggle(m)}>
          {m.resolved ? "Reopen" : "Mark resolved"}
        </button>
      </div>
      <p className="mb-0 mt-2" style={{ whiteSpace: "pre-line" }}>{m.message}</p>
    </div>
  ));
}

/* -------------------------------------------------------------------- PANEL */
export default function AdminPanel() {
  const [tab, setTab] = useState("dashboard");

  return (
    <div className="adm">
      <h2 className="fw-bold mb-3">Admin panel</h2>

      <div className="adm-tabs" role="tablist">
        {TABS.map(([id, label, icon]) => (
          <button key={id} role="tab" aria-selected={tab === id} className={tab === id ? "active" : ""} onClick={() => setTab(id)}>
            <i className={icon}></i> <span>{label}</span>
          </button>
        ))}
      </div>

      {tab === "dashboard" && <Dashboard />}
      {tab === "products" && <ProductsTab />}
      {tab === "orders" && <OrdersTab />}
      {tab === "users" && <UsersTab />}
      {tab === "messages" && <MessagesTab />}
    </div>
  );
}
