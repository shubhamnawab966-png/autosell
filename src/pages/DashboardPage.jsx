const stats = [
  { label: "Total orders", value: "2,847", change: "+12.4%", sub: "last 30 days" },
  { label: "Revenue", value: "₹18,42,900", change: "+8.1%", sub: "incl. GST" },
  { label: "Profit", value: "₹4,06,200", change: "+15.2%", sub: "after sourcing" },
  { label: "Active products", value: "186", change: "+6 new", sub: "synced live" },
];

const activity = [
  { title: "Order #AS-9281 shipped", meta: "BlueDart · 2 min ago", tone: "ok" },
  { title: "Meesho import batch completed", meta: "34 SKUs · 18 min ago", tone: "info" },
  { title: "AI replied: COD confirmation", meta: "WhatsApp · 42 min ago", tone: "info" },
  { title: "Low margin alert: SKU ME-441", meta: "Margin 6% · 1 hr ago", tone: "warn" },
];

export function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-slate-400">Overview of your dropshipping automation</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-slate-800/80 bg-surface-900/60 p-5 shadow-panel"
          >
            <p className="text-sm font-medium text-slate-400">{s.label}</p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-white">{s.value}</p>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 font-medium text-emerald-400">
                {s.change}
              </span>
              <span className="text-slate-500">{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-800/80 bg-surface-900/60 p-6 shadow-panel lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">Revenue trend</h2>
            <div className="flex gap-2">
              {["7D", "30D", "90D"].map((p, i) => (
                <button
                  key={p}
                  type="button"
                  className={`rounded-lg px-3 py-1 text-xs font-medium ${
                    i === 1 ? "bg-blue-600 text-white" : "bg-surface-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-8 flex h-48 items-end gap-2 sm:gap-3">
            {[42, 55, 38, 62, 48, 71, 58, 80, 66, 88, 74, 92].map((h, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full max-w-[28px] rounded-t-md bg-gradient-to-t from-blue-700 to-blue-400 opacity-90"
                  style={{ height: `${h}%` }}
                />
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-slate-500">Demo chart — connect stores for live data</p>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-surface-900/60 p-6 shadow-panel">
          <h2 className="text-lg font-semibold text-white">Quick actions</h2>
          <div className="mt-4 space-y-2">
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-lg border border-slate-800 bg-surface-800/50 px-4 py-3 text-left text-sm font-medium text-slate-200 transition hover:border-blue-500/40 hover:bg-surface-800"
            >
              Import from supplier
              <span className="text-blue-400">→</span>
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-lg border border-slate-800 bg-surface-800/50 px-4 py-3 text-left text-sm font-medium text-slate-200 transition hover:border-blue-500/40 hover:bg-surface-800"
            >
              Sync pending orders
              <span className="text-blue-400">→</span>
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-lg border border-slate-800 bg-surface-800/50 px-4 py-3 text-left text-sm font-medium text-slate-200 transition hover:border-blue-500/40 hover:bg-surface-800"
            >
              Open AI inbox
              <span className="text-blue-400">→</span>
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800/80 bg-surface-900/60 shadow-panel">
        <div className="border-b border-slate-800/80 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">Recent activity</h2>
        </div>
        <ul className="divide-y divide-slate-800/80">
          {activity.map((a) => (
            <li key={a.title} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
              <div>
                <p className="font-medium text-slate-200">{a.title}</p>
                <p className="text-sm text-slate-500">{a.meta}</p>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  a.tone === "warn"
                    ? "bg-amber-500/15 text-amber-400"
                    : a.tone === "ok"
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-blue-500/15 text-blue-300"
                }`}
              >
                {a.tone === "warn" ? "Review" : a.tone === "ok" ? "Done" : "Auto"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
