import { useState } from "react";

const stores = [
  {
    id: "meesho",
    name: "Meesho",
    desc: "Supplier catalog & fulfilment sync",
    connected: true,
  },
  {
    id: "flipkart",
    name: "Flipkart",
    desc: "Seller API — orders & inventory",
    connected: false,
  },
  {
    id: "amazon",
    name: "Amazon India",
    desc: "SP-API orders & messaging hooks",
    connected: false,
  },
];

export function SettingsPage() {
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(false);
  const [connections, setConnections] = useState(
    () => Object.fromEntries(stores.map((s) => [s.id, s.connected])),
  );

  const toggle = (id) => {
    setConnections((c) => ({ ...c, [id]: !c[id] }));
  };

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Settings</h1>
        <p className="mt-1 text-slate-400">Profile, alerts, and marketplace connections</p>
      </div>

      <section className="rounded-xl border border-slate-800/80 bg-surface-900/60 p-6 shadow-panel">
        <h2 className="text-lg font-semibold text-white">Profile</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-300">Store display name</label>
            <input
              type="text"
              defaultValue="DesiCart"
              className="mt-1.5 w-full rounded-lg border border-slate-700 bg-surface-800 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">GSTIN</label>
            <input
              type="text"
              placeholder="22AAAAA0000A1Z5"
              className="mt-1.5 w-full rounded-lg border border-slate-700 bg-surface-800 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Default currency</label>
            <select className="mt-1.5 w-full rounded-lg border border-slate-700 bg-surface-800 px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-blue-500">
              <option>INR (₹)</option>
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-800/80 bg-surface-900/60 p-6 shadow-panel">
        <h2 className="text-lg font-semibold text-white">Notifications</h2>
        <div className="mt-4 space-y-4">
          <label className="flex items-center justify-between gap-4 rounded-lg border border-slate-800 bg-surface-950/50 px-4 py-3">
            <span>
              <span className="font-medium text-slate-200">Email digests</span>
              <span className="mt-0.5 block text-xs text-slate-500">Daily summary of orders & margin</span>
            </span>
            <input
              type="checkbox"
              checked={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.checked)}
              className="h-4 w-4 rounded border-slate-600 bg-surface-800 text-blue-600 focus:ring-blue-500/40"
            />
          </label>
          <label className="flex items-center justify-between gap-4 rounded-lg border border-slate-800 bg-surface-950/50 px-4 py-3">
            <span>
              <span className="font-medium text-slate-200">WhatsApp alerts</span>
              <span className="mt-0.5 block text-xs text-slate-500">Requires Business API (Pro+)</span>
            </span>
            <input
              type="checkbox"
              checked={notifyWhatsApp}
              onChange={(e) => setNotifyWhatsApp(e.target.checked)}
              className="h-4 w-4 rounded border-slate-600 bg-surface-800 text-blue-600 focus:ring-blue-500/40"
            />
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-slate-800/80 bg-surface-900/60 p-6 shadow-panel">
        <h2 className="text-lg font-semibold text-white">Store connect</h2>
        <p className="mt-1 text-sm text-slate-400">
          Link official APIs where available. Credentials are encrypted at rest (demo toggles only).
        </p>
        <ul className="mt-6 space-y-4">
          {stores.map((s) => (
            <li
              key={s.id}
              className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-surface-950/40 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">{s.name}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      connections[s.id]
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-slate-600/40 text-slate-400"
                    }`}
                  >
                    {connections[s.id] ? "Connected" : "Not connected"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">{s.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => toggle(s.id)}
                className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  connections[s.id]
                    ? "border border-slate-600 bg-transparent text-slate-300 hover:border-red-500/50 hover:text-red-300"
                    : "bg-blue-600 text-white hover:bg-blue-500"
                }`}
              >
                {connections[s.id] ? "Disconnect" : "Connect API"}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
