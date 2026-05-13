const orders = [
  {
    id: "AS-9281",
    customer: "Priya K.",
    channel: "Flipkart",
    total: "₹1,240",
    status: "Shipped",
    tracking: "BD123456789IN",
    timeline: ["Confirmed", "Packed", "Shipped", "Delivering"],
    step: 2,
  },
  {
    id: "AS-9280",
    customer: "Rahul M.",
    channel: "Meesho",
    total: "₹599",
    status: "Processing",
    tracking: "—",
    timeline: ["Confirmed", "Packed", "Shipped", "Delivered"],
    step: 1,
  },
  {
    id: "AS-9278",
    customer: "Ananya S.",
    channel: "Amazon IN",
    total: "₹2,899",
    status: "Delivered",
    tracking: "AMZNIN123456",
    timeline: ["Confirmed", "Packed", "Shipped", "Delivered"],
    step: 3,
  },
  {
    id: "AS-9275",
    customer: "Vikram D.",
    channel: "Shopify",
    total: "₹890",
    status: "Pending payment",
    tracking: "—",
    timeline: ["Pending", "Confirmed", "Packed", "Shipped"],
    step: 0,
  },
];

const statusStyles = {
  Shipped: "bg-blue-500/15 text-blue-300",
  Processing: "bg-amber-500/15 text-amber-400",
  Delivered: "bg-emerald-500/15 text-emerald-400",
  "Pending payment": "bg-slate-600/40 text-slate-300",
};

export function OrdersPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Orders</h1>
          <p className="mt-1 text-slate-400">Track fulfilment and courier updates in one place</p>
        </div>
        <button
          type="button"
          className="rounded-lg border border-slate-700 bg-surface-800 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-blue-500/40"
        >
          Export CSV
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {["All", "Pending", "Processing", "Shipped", "Delivered", "RTO"].map((f, i) => (
          <button
            key={f}
            type="button"
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              i === 0 ? "bg-blue-600 text-white" : "bg-surface-800 text-slate-400 hover:text-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {orders.map((o) => (
          <article
            key={o.id}
            className="rounded-xl border border-slate-800/80 bg-surface-900/60 p-5 shadow-panel sm:p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-lg font-semibold text-white">{o.id}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      statusStyles[o.status] ?? "bg-slate-600/40 text-slate-300"
                    }`}
                  >
                    {o.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-400">
                  {o.customer} · {o.channel}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xl font-bold text-white">{o.total}</p>
                {o.tracking !== "—" ? (
                  <button type="button" className="mt-1 text-sm text-blue-400 hover:text-blue-300">
                    Track: {o.tracking}
                  </button>
                ) : (
                  <p className="mt-1 text-sm text-slate-500">No tracking yet</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Status</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-0">
                {o.timeline.map((label, idx) => {
                  const active = idx <= o.step;
                  const last = idx === o.timeline.length - 1;
                  return (
                    <div key={label} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                            active ? "bg-blue-600 text-white" : "bg-surface-800 text-slate-500"
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <span className="mt-1 hidden text-[10px] text-slate-500 sm:block">{label}</span>
                      </div>
                      {!last ? (
                        <div
                          className={`mx-1 h-0.5 w-6 sm:w-10 ${idx < o.step ? "bg-blue-500" : "bg-slate-800"}`}
                        />
                      ) : null}
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 flex flex-wrap gap-2 sm:hidden">
                {o.timeline.map((label, idx) => (
                  <span
                    key={label}
                    className={`text-xs ${idx <= o.step ? "text-blue-300" : "text-slate-600"}`}
                  >
                    {label}
                    {idx < o.timeline.length - 1 ? " →" : ""}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
