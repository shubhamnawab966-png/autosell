import { useState, useEffect } from "react";

const API_BASE = "https://autosell-production-b292.up.railway.app";
const getToken = () => localStorage.getItem("token");

const PLATFORMS = ["Meesho", "Flipkart", "Amazon", "Other"];
const CATEGORIES = ["Fashion", "Electronics", "Home & Kitchen", "Beauty", "Sports", "Toys", "Books", "Other"];
const emptyForm = { name: "", sku: "", cost_price: "", sell_price: "", platform: "Meesho", category: "Fashion", stock: "", image_url: "", description: "" };

export function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("All");
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/products`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      setError("Products load nahi hue");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    setError(""); setSuccess("");
    if (!form.name || !form.cost_price || !form.sell_price) { setError("Name, Cost Price aur Sell Price required hain."); return; }
    setSubmitting(true);
    try {
      const url = editId ? `${API_BASE}/api/products/${editId}` : `${API_BASE}/api/products`;
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ ...form, cost_price: parseFloat(form.cost_price), sell_price: parseFloat(form.sell_price), stock: parseInt(form.stock) || 0 }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message || d.detail || "Error"); }
      setSuccess(editId ? "Product update ho gaya! ✅" : "Product add ho gaya! ✅");
      setForm(emptyForm); setShowForm(false); setEditId(null);
      fetchProducts();
    } catch (err) { setError(err.message); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
    try {
      await fetch(`${API_BASE}/api/products/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
      setSuccess("Deleted ✅"); fetchProducts();
    } catch { setError("Delete error"); }
    finally { setDeleteId(null); }
  };

  const handleEdit = (p) => { setForm({ name: p.name||"", sku: p.sku||"", cost_price: p.cost_price||"", sell_price: p.sell_price||"", platform: p.platform||"Meesho", category: p.category||"Fashion", stock: p.stock||"", image_url: p.image_url||"", description: p.description||"" }); setEditId(p.id); setShowForm(true); };

  const filtered = products.filter(p => (p.name?.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase())) && (filterPlatform === "All" || p.platform === filterPlatform));

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto", fontFamily: "sans-serif", background: "#f3f4f6", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>📦 Products</h1>
        <button onClick={() => { setShowForm(!showForm); setForm(emptyForm); setEditId(null); }} style={{ background: "#4f46e5", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>
          {showForm ? "✕ Cancel" : "+ Product Add Karo"}
        </button>
      </div>

      {error && <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "10px 16px", borderRadius: 8, marginBottom: 16 }}>{error}</div>}
      {success && <div style={{ background: "#dcfce7", color: "#15803d", padding: "10px 16px", borderRadius: 8, marginBottom: 16 }}>{success}</div>}

      {showForm && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 20, marginBottom: 20, border: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 16 }}>{editId ? "✏️ Edit Product" : "➕ Naya Product"}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[["name","Product Name *"],["sku","SKU"],["cost_price","Cost Price (₹) *"],["sell_price","Sell Price (₹) *"]].map(([key, label]) => (
              <div key={key}>
                <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>{label}</label>
                <input name={key} value={form[key]} onChange={handleChange} style={{ width: "100%", padding: "8px 12px", border: "1.5px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }} />
              </div>
            ))}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>Platform</label>
              <select name="platform" value={form.platform} onChange={handleChange} style={{ width: "100%", padding: "8px 12px", border: "1.5px solid #d1d5db", borderRadius: 8, fontSize: 14 }}>
                {PLATFORMS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>Category</label>
              <select name="category" value={form.category} onChange={handleChange} style={{ width: "100%", padding: "8px 12px", border: "1.5px solid #d1d5db", borderRadius: 8, fontSize: 14 }}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>Stock</label>
              <input name="stock" type="number" value={form.stock} onChange={handleChange} style={{ width: "100%", padding: "8px 12px", border: "1.5px solid #d1d5db", borderRadius: 8, fontSize: 14 }} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>Image URL</label>
              <input name="image_url" value={form.image_url} onChange={handleChange} style={{ width: "100%", padding: "8px 12px", border: "1.5px solid #d1d5db", borderRadius: 8, fontSize: 14 }} />
            </div>
          </div>
          <button onClick={handleSubmit} disabled={submitting} style={{ marginTop: 16, background: "#4f46e5", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>
            {submitting ? "Saving..." : editId ? "✅ Update" : "✅ Add Karo"}
          </button>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search..." style={{ padding: "8px 12px", border: "1.5px solid #d1d5db", borderRadius: 8, fontSize: 14, flex: 1, maxWidth: 300 }} />
        {["All", ...PLATFORMS].map(p => (
          <button key={p} onClick={() => setFilterPlatform(p)} style={{ padding: "7px 14px", borderRadius: 20, border: filterPlatform === p ? "none" : "1.5px solid #d1d5db", background: filterPlatform === p ? "#4f46e5" : "#fff", color: filterPlatform === p ? "#fff" : "#374151", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>{p}</button>
        ))}
      </div>

      {loading ? <div style={{ textAlign: "center", padding: 60, background: "#fff", borderRadius: 12 }}>Loading...</div>
      : filtered.length === 0 ? <div style={{ textAlign: "center", padding: 60, background: "#fff", borderRadius: 12, border: "2px dashed #e5e7eb" }}><div style={{ fontSize: 48 }}>📦</div><h3>Koi product nahi hai</h3><p style={{ color: "#9ca3af" }}>Upar "+ Product Add Karo" button dabaao!</p></div>
      : (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                {["Product","SKU","Platform","Cost","Sell","Profit","Stock","Actions"].map(h => <th key={h} style={{ textAlign: "left", padding: "10px 14px", color: "#6b7280", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id} style={{ background: i % 2 === 0 ? "#fff" : "#f9fafb", borderTop: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 600 }}>{p.name}</td>
                  <td style={{ padding: "12px 14px", color: "#6b7280", fontFamily: "monospace", fontSize: 12 }}>{p.sku || "—"}</td>
                  <td style={{ padding: "12px 14px" }}><span style={{ background: "#ede9fe", color: "#7c3aed", padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{p.platform}</span></td>
        <td style={{ padding: "12px 14px", color: "#111827", fontWeight: 600 }}>₹{parseFloat(p.cost_price||0).toFixed(0)}</td>    
                 <td style={{ padding: "12px 14px", fontWeight: 600, color: "#111827" }}>₹{parseFloat(p.sell_price||0).toFixed(0)}</td>
                  <td style={{ padding: "12px 14px" }}><span style={{ background: "#dcfce7", color: "#16a34a", padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>₹{(parseFloat(p.sell_price||0)-parseFloat(p.cost_price||0)).toFixed(0)}</span></td>
                  <td style={{ padding: "12px 14px" }}>{p.stock ?? "—"}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <button onClick={() => handleEdit(p)} style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 6, padding: "4px 8px", cursor: "pointer", marginRight: 6 }}>✏️</button>
                    <button onClick={() => handleDelete(p.id)} disabled={deleteId === p.id} style={{ background: "#fff1f2", border: "1px solid #fecaca", borderRadius: 6, padding: "4px 8px", cursor: "pointer" }}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}