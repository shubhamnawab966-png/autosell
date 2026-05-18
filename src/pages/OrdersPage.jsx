import { useState } from "react";

const STATUS_COLORS = {
  Delivered: { bg: "#052e16", color: "#4ade80" },
  Shipped: { bg: "#0c1a4e", color: "#60a5fa" },
  Processing: { bg: "#422006", color: "#fb923c" },
  Cancelled: { bg: "#450a0a", color: "#f87171" },
};

export function OrdersPage() {
  const [orders] = useState([
    { id: "AS-9281", customer: "Priya K.", channel: "Flipkart", total: "₹1,240", status: "Shipped", tracking: "BD123456789IN" },
    { id: "AS-9280", customer: "Rahul M.", channel: "Meesho", total: "₹599", status: "Processing", tracking: "—" },
    { id: "AS-9279", customer: "Sunita D.", channel: "Amazon", total: "₹2,100", status: "Delivered", tracking: "AZ987654321IN" },
    { id: "AS-9278", customer: "Amit S.", channel: "Meesho", total: "₹450", status: "Cancelled", tracking: "—" },
  ]);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const filtered = orders.filter(o =>
    (o.id.toLowerCase().includes(search.toLowerCase()) ||
     o.customer.toLowerCase().includes(search.toLowerCase())) &&
    (filterStatus === "All" || o.status === filterStatus)
  );

  const statusCounts = {
    All: orders.length,
    Processing: orders.filter(o => o.status === "Processing").length,
    Shipped: orders.filter(o => o.status === "Shipped").length,
    Delivered: orders.filter(o => o.status === "Delivered").length,
    Cancelled: orders.filter(o => o.status === "Cancelled").length,
  };

  return (
    <div style={{ fontFamily: "sans-serif", color: "#f1f5f9" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, color: "#f1f5f9" }}>🛒 Orders</h1>
        <p style={{ color: "#64748b", marginTop: 4 }}>Sabhi orders ka track record</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 24 }}>
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} style={{ background: "#1e293b", borderRadius: 10, padding: "14px 16px", border: "1px solid #334155", textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: status === "All" ? "#6366f1" : (STATUS_COLORS[status]?.color || "#f1f5f9") }}>{count}</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{status}</div>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Order ID ya Customer..."
          style={{ padding: "8px 12px", border: "1.5px solid #334155", borderRadius: 8, fontSize: 14, flex: 1, maxWidth: 300, background: "#1e293b", color: "#f1f5f9" }} />
        {["All", "Processing", "Shipped", "Delivered", "Cancelled"].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            style={{ padding: "7px 14px", borderRadius: 20, border: filterStatus === s ? "none" : "1.5px solid #334155", background: filterStatus === s ? "#6366f1" : "#1e293b", color: filterStatus === s ? "#fff" : "#94a3b8", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "#1e293b", borderRadius: 12, border: "1px solid #334155", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "#0f172a" }}>
              {["Order ID", "Customer", "Channel", "Total", "Status", "Tracking"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "10px 16px", color: "#64748b", fontSize: 12, fontWeight: 600, textTransform: "uppercase", borderBottom: "1px solid #334155" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Koi order nahi mila</td></tr>
            ) : filtered.map((o, i) => (
              <tr key={o.id} style={{ background: i % 2 === 0 ? "#1e293b" : "#162032", borderTop: "1px solid #334155" }}>
                <td style={{ padding: "12px 16px", fontWeight: 700, color: "#6366f1" }}>{o.id}</td>
                <td style={{ padding: "12px 16px", color: "#f1f5f9" }}>{o.customer}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ background: "#1d4ed8", color: "#bfdbfe", padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{o.channel}</span>
                </td>
                <td style={{ padding: "12px 16px", color: "#f1f5f9", fontWeight: 700 }}>{o.total}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ background: STATUS_COLORS[o.status]?.bg || "#1e293b", color: STATUS_COLORS[o.status]?.color || "#f1f5f9", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{o.status}</span>
                </td>
                <td style={{ padding: "12px 16px", color: "#64748b", fontFamily: "monospace", fontSize: 12 }}>{o.tracking}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}