import { useState, useEffect } from "react";

const API = "http://localhost:5000";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    store_name: "", phone: "", meesho_api_key: "", flipkart_api_key: "",
    auto_pricing: false, notification_email: true
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/settings/`)
      .then(res => res.json())
      .then(data => { setSettings(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    await fetch(`${API}/settings/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings)
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputStyle = {
    width: "100%", background: "#1f2937", border: "1px solid #374151",
    borderRadius: "8px", padding: "10px 14px", color: "white",
    marginTop: "6px", boxSizing: "border-box", fontSize: "14px"
  };

  if (loading) return <div style={{ background: "#030712", minHeight: "100vh", color: "white", padding: "24px" }}>Loading...</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#030712", color: "white", padding: "24px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "4px" }}>Settings</h1>
      <p style={{ color: "#6b7280", marginBottom: "24px" }}>Store aur platform settings</p>

      <div style={{ background: "#111827", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
        <h2 style={{ color: "#a78bfa", marginBottom: "16px" }}>Store Info</h2>
        <div style={{ marginBottom: "12px" }}>
          <label style={{ color: "#9ca3af", fontSize: "13px" }}>Store Name</label>
          <input style={inputStyle} value={settings.store_name || ""}
            onChange={e => setSettings({...settings, store_name: e.target.value})} />
        </div>
        <div>
          <label style={{ color: "#9ca3af", fontSize: "13px" }}>Phone</label>
          <input style={inputStyle} value={settings.phone || ""}
            onChange={e => setSettings({...settings, phone: e.target.value})} />
        </div>
      </div>

      <div style={{ background: "#111827", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
        <h2 style={{ color: "#60a5fa", marginBottom: "16px" }}>Platform API Keys</h2>
        <div style={{ marginBottom: "12px" }}>
          <label style={{ color: "#9ca3af", fontSize: "13px" }}>Meesho Supplier Key</label>
          <input type="password" style={inputStyle} value={settings.meesho_api_key || ""}
            placeholder="Enter Meesho API key"
            onChange={e => setSettings({...settings, meesho_api_key: e.target.value})} />
        </div>
        <div>
          <label style={{ color: "#9ca3af", fontSize: "13px" }}>Flipkart Seller Key</label>
          <input type="password" style={inputStyle} value={settings.flipkart_api_key || ""}
            placeholder="Enter Flipkart API key"
            onChange={e => setSettings({...settings, flipkart_api_key: e.target.value})} />
        </div>
      </div>

      <div style={{ background: "#111827", borderRadius: "12px", padding: "20px", marginBottom: "24px" }}>
        <h2 style={{ color: "#4ade80", marginBottom: "16px" }}>Preferences</h2>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <span style={{ color: "#d1d5db" }}>Auto Pricing</span>
          <input type="checkbox" checked={settings.auto_pricing || false}
            onChange={e => setSettings({...settings, auto_pricing: e.target.checked})} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#d1d5db" }}>Email Notifications</span>
          <input type="checkbox" checked={settings.notification_email || false}
            onChange={e => setSettings({...settings, notification_email: e.target.checked})} />
        </div>
      </div>

      <button onClick={handleSave}
        style={{ width: "100%", background: saved ? "#16a34a" : "#7c3aed", color: "white",
          padding: "14px", borderRadius: "12px", border: "none", fontSize: "16px",
          fontWeight: "600", cursor: "pointer" }}>
        {saved ? "Saved!" : "Save Settings"}
      </button>
    </div>
  );
}
