import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    desc: "Try imports and manual order sync.",
    features: ["50 products", "100 orders / mo", "Email support", "1 marketplace"],
    cta: "Current plan",
    highlight: false,
    disabled: true,
  },
  {
    name: "Starter",
    price: "₹299",
    period: "/ month + GST",
    desc: "Growing sellers on one or two channels.",
    features: ["2,000 products", "2,000 orders / mo", "Meesho + Glowroad import", "AI templates (10)"],
    cta: "Upgrade",
    highlight: false,
    disabled: false,
  },
  {
    name: "Pro",
    price: "₹799",
    period: "/ month + GST",
    desc: "Automation at scale with priority routing.",
    features: [
      "Unlimited products",
      "Unlimited orders",
      "IndiaMart + AliExpress",
      "AI inbox + auto-reply rules",
      "Priority chat",
    ],
    cta: "Upgrade",
    highlight: true,
    disabled: false,
  },
  {
    name: "Enterprise",
    price: "₹1,999",
    period: "/ month + GST",
    desc: "Teams, APIs, and compliance-ready exports.",
    features: ["Dedicated success", "Custom integrations", "SLA & audit logs", "Multi-store seats"],
    cta: "Talk to sales",
    highlight: false,
    disabled: false,
  },
];

export function PricingPage() {
  return (
    <div className="space-y-10">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Simple INR pricing</h1>
        <p className="mx-auto mt-2 max-w-xl text-slate-400">
          Pick a plan that matches your volume. Cancel anytime. Invoices include GST details for Indian businesses.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`relative flex flex-col rounded-2xl border p-6 shadow-panel ${
              p.highlight
                ? "border-blue-500/50 bg-gradient-to-b from-blue-600/15 to-surface-900/90 shadow-glow"
                : "border-slate-800/80 bg-surface-900/60"
            }`}
          >
            {p.highlight ? (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-0.5 text-xs font-semibold text-white">
                Popular
              </span>
            ) : null}
            <h2 className="text-lg font-semibold text-white">{p.name}</h2>
            <p className="mt-2 text-sm text-slate-400">{p.desc}</p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-white">{p.price}</span>
              <span className="text-sm text-slate-500">{p.period}</span>
            </div>
            <ul className="mt-6 flex-1 space-y-3 text-sm text-slate-300">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-blue-400">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              type="button"
              disabled={p.disabled}
              className={`mt-8 w-full rounded-lg py-2.5 text-sm font-semibold transition ${
                p.disabled
                  ? "cursor-not-allowed border border-slate-800 bg-surface-800/50 text-slate-500"
                  : p.highlight
                    ? "bg-blue-600 text-white hover:bg-blue-500"
                    : "border border-slate-700 bg-surface-800 text-white hover:border-blue-500/40"
              }`}
            >
              {p.cta}
            </button>
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-slate-500">
        Questions?{" "}
        <Link to="/settings" className="text-blue-400 hover:text-blue-300">
          Open settings
        </Link>{" "}
        or email <span className="text-slate-400">hello@autosell.example</span>
      </p>
    </div>
  );
}
