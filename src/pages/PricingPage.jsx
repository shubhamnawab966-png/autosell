import { useState, useEffect } from "react";

const API_BASE = "https://autosell-production-b292.up.railway.app";
const getToken = () => localStorage.getItem("token");

export function PricingPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [margin, setMargin] = useState(50);
  const [applying, setApplying] = useState(false);
  const [success, setSuccess] = useState("");
  const [competitor, setCompetitor] = useState("");
  const [compPrice, setCompPrice] = useState("");

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/products`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      setProducts(data.products || []);
    } catch { }
    finally { setLoading(false); }
  };

  const applyMargin = async () => {
    setApplying(true);
    setSuccess("");
    try {
      for (const p of products) {
        const newSellPrice = parseFloat(p.cost_price) * (1 + margin / 100);
        await fetch(`${API_BASE}/api/products/${p.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
          body: JSON.stringify({ ...p, sell_price: newSellPrice.toFixed(2) }),
        });
      }
      setSuccess(`✅ Sabhi ${products.length} products ka sell price update ho gaya!`);
      fetchProducts();
    } catch { }
    finally { setApplying(false); }
  };

  return (
    <div style={{ fontFamily: "sans-serif", color: "#f1f5f9" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, color: "#f1f5f9" }}>💰 Pricing Automation</h1>
        <p style={{ color: "#64748b", marginTop: 4 }}>Auto price rules, bulk update aur competitor tracking</p>
      </div>

      {success && <div style={{ background: "#052e16", color: "#86efac", padding: "12px 16px", borderRadius: 8, marginBottom: 20, border: "1px solid #14532d" }}>{success}</div>}

      {/* Feature 1 — Auto Margin */}
      <div style={{ background: "#1e293b", borderRadius: 12, padding: 20, marginBottom: 20, border: "1px solid #334155" }}>
        <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 4, color: "#f1f5f9" }}>📊 Auto Margin Rule</h2>
        <p style={{ color: "#64748b", fontSize: 13, marginBottom: 16 }}>Cost price pe margin add karke sell price auto set karo</p>

        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 6 }}>Margin %</label>
            <input type="number" value={margin} onChange={e => setMargin(e.target.value)} min="1" max="500"
              style={{ padding: "8px 12px", border: "1.5px solid #334155", borderRadius: 8, fontSize: 16, fontWeight: 700, background: "#0f172a", color: "#6366f1", width: 100, textAlign: "center" }} />
          </div>
          <div style={{ background: "#0f172a", borderRadius: 8, padding: "10px 16px", fontSize: 13, color: "#94a3b8" }}>
            Example: Cost ₹200 → Sell <strong style={{ color: "#4ade80" }}>₹{(200 * (1 + margin / 100)).toFixed(0)}</strong>
          </div>
        </div>

        <button onClick={applyMargin} disabled={applying || products.length === 0}
          style={{ background: applying ? "#334155" : "#6366f1", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
          {applying ? "Updating..." : `✅ Sabhi ${products.length} Products pe Apply Karo`}
        </button>
      </div>

      {/* Feature 2 — Current Prices Table */}
      <div style={{ background: "#1e293b", borderRadius: 12, border: "1px solid #334155", overflow: "hidden", marginBottom: 20 }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #334155", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#f1f5f9" }}>📋 Current Prices</h2>
          <span style={{ fontSize: 12, color: "#64748b" }}>{products.length} products</span>
        </div>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Loading...</div>
        ) : products.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Koi product nahi — pehle Products page pe add karo!</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#0f172a" }}>
                {["Product", "Platform", "Cost", "Sell", "Margin %", "Profit"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 16px", color: "#64748b", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => {
                const cost = parseFloat(p.cost_price || 0);
                const sell = parseFloat(p.sell_price || 0);
                const profit = sell - cost;
                const marginPct = cost > 0 ? ((profit / cost) * 100).toFixed(0) : 0;
                return (
                  <tr key={p.id} style={{ background: i % 2 === 0 ? "#1e293b" : "#162032", borderTop: "1px solid #334155" }}>
                    <td style={{ padding: "12px 16px", fontWeight: 600, color: "#f1f5f9" }}>{p.name}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ background: "#4c1d95", color: "#c4b5fd", padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{p.platform}</span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#94a3b8" }}>₹{cost.toFixed(0)}</td>
                    <td style={{ padding: "12px 16px", color: "#f1f5f9", fontWeight: 700 }}>₹{sell.toFixed(0)}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ background: marginPct > 30 ? "#052e16" : "#422006", color: marginPct > 30 ? "#4ade80" : "#fb923c", padding: "2px 8px", borderRadius: 6, fontWeight: 700 }}>{marginPct}%</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ color: profit > 0 ? "#4ade80" : "#f87171", fontWeight: 700 }}>₹{profit.toFixed(0)}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Feature 3 — Competitor Tracking */}
      <div style={{ background: "#1e293b", borderRadius: 12, padding: 20, border: "1px solid #334155" }}>
        <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 4, color: "#f1f5f9" }}>🔍 Competitor Price Track</h2>
        <p style={{ color: "#64748b", fontSize: 13, marginBottom: 16 }}>Competitor ka price note karo aur compare karo</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
          <input value={competitor} onChange={e => setCompetitor(e.target.value)} placeholder="Competitor product name"
            style={{ flex: 1, padding: "8px 12px", border: "1.5px solid #334155", borderRadius: 8, fontSize: 14, background: "#0f172a", color: "#f1f5f9", minWidth: 180 }} />
          <input value={compPrice} onChange={e => setCompPrice(e.target.value)} placeholder="₹ Price" type="number"
            style={{ width: 120, padding: "8px 12px", border: "1.5px solid #334155", borderRadius: 8, fontSize: 14, background: "#0f172a", color: "#f1f5f9" }} />
          <button onClick={() => { if(competitor && compPrice) { setSuccess(`✅ "${competitor}" ka price ₹${compPrice} note ho gaya!`); setCompetitor(""); setCompPrice(""); }}}
            style={{ background: "#0ea5e9", color: "#fff", border: "none", padding: "8px 20px", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>
            Track Karo
          </button>
        </div>
        <p style={{ color: "#475569", fontSize: 12, margin: 0 }}>💡 Tip: Apne sell price ko competitor se ₹10-50 kam rakho!</p>
      </div>
    </div>
  );
}