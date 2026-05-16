import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo.jsx";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: "dash" },
  { to: "/products", label: "Products", icon: "box" },
  { to: "/orders", label: "Orders", icon: "cart" },
  { to: "/ai-support", label: "AI Support", icon: "bot" },
  { to: "/pricing", label: "Pricing", icon: "tag" },
  { to: "/settings", label: "Settings", icon: "gear" },
];

function NavIcon({ name }) {
  const common = "h-5 w-5 shrink-0";
  switch (name) {
    case "dash": return (<svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>);
    case "box": return (<svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>);
    case "cart": return (<svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>);
    case "bot": return (<svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>);
    case "tag": return (<svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" /></svg>);
    case "gear": return (<svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);
    default: return null;
  }
}

export function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const S = {
    wrapper: { minHeight: "100vh", display: "flex", background: "#0f172a", color: "#f1f5f9" },
    sidebar: { width: 240, background: "#1e293b", borderRight: "1px solid #334155", display: "flex", flexDirection: "column", padding: "24px 0", flexShrink: 0 },
    logo: { padding: "0 20px 24px", borderBottom: "1px solid #334155", marginBottom: 16 },
    navItem: { display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", color: "#94a3b8", textDecoration: "none", fontSize: 14, fontWeight: 500, borderRadius: 8, margin: "2px 8px", transition: "all 0.15s" },
    navItemActive: { background: "#1d4ed8", color: "#fff" },
    main: { flex: 1, padding: "32px 24px", overflowY: "auto" },
  };

  return (
    <div style={S.wrapper}>
      {/* Sidebar */}
      <div style={S.sidebar}>
        <div style={S.logo}>
          <Logo />
        </div>
        <nav>
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                ...S.navItem,
                ...(isActive ? S.navItemActive : {}),
              })}
            >
              <NavIcon name={item.icon} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div style={{ marginTop: "auto", padding: "16px 20px", borderTop: "1px solid #334155" }}>
          <button
            onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}
            style={{ width: "100%", padding: "8px", background: "#7f1d1d", color: "#fca5a5", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600 }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main style={S.main}>
        <Outlet />
      </main>
    </div>
  );
}