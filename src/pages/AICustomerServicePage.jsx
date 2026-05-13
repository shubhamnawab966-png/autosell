import { useState } from "react";

const templates = [
  {
    id: "ship",
    title: "Shipping update (Hindi + English)",
    category: "Shipping",
    body: `नमस्ते {{name}} जी,
आपका ऑर्डर #{{order_id}} कूरियर को सौंप दिया गया है। ट्रैकिंग: {{tracking}}
Tracking link: {{tracking_url}}

Hi {{name}},
Your order #{{order_id}} has been handed to the courier. Tracking: {{tracking}}`,
  },
  {
    id: "cod",
    title: "COD confirmation",
    category: "COD",
    body: `Hi {{name}}, this is {{store}}. Please keep ₹{{amount}} ready for COD delivery of order #{{order_id}}. Reply YES to confirm your address.`,
  },
  {
    id: "delay",
    title: "Delay apology + ETA",
    category: "Delays",
    body: `We're sorry — order #{{order_id}} is delayed due to high demand. New expected dispatch: {{eta}}. We appreciate your patience.`,
  },
  {
    id: "return",
    title: "Return window reminder",
    category: "Returns",
    body: `Your return window for #{{order_id}} closes on {{date}}. Initiate from your orders page or reply with RETURN to get steps in Hindi.`,
  },
];

export function AICustomerServicePage() {
  const [selected, setSelected] = useState(templates[0]);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(selected.body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">AI customer service</h1>
        <p className="mt-1 text-slate-400">
          Automated reply templates for WhatsApp, Instagram DMs, and marketplace chats
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="rounded-xl border border-slate-800/80 bg-surface-900/60 shadow-panel lg:col-span-2">
          <div className="border-b border-slate-800/80 px-4 py-3 sm:px-5">
            <h2 className="text-sm font-semibold text-white">Templates</h2>
            <p className="text-xs text-slate-500">Tap to edit in preview</p>
          </div>
          <ul className="max-h-[480px] divide-y divide-slate-800/80 overflow-y-auto">
            {templates.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => setSelected(t)}
                  className={`flex w-full flex-col items-start gap-1 px-4 py-4 text-left transition sm:px-5 ${
                    selected.id === t.id ? "bg-blue-600/10 ring-1 ring-inset ring-blue-500/30" : "hover:bg-surface-800/50"
                  }`}
                >
                  <span className="text-xs font-medium uppercase tracking-wide text-blue-400/90">
                    {t.category}
                  </span>
                  <span className="font-medium text-slate-200">{t.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-surface-900/60 shadow-panel lg:col-span-3">
          <div className="flex flex-col gap-3 border-b border-slate-800/80 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
            <div>
              <h2 className="font-semibold text-white">{selected.title}</h2>
              <p className="text-xs text-slate-500">Variables: {"{{name}}"}, {"{{order_id}}"}, etc.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={copy}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
              >
                {copied ? "Copied" : "Copy template"}
              </button>
              <button
                type="button"
                className="rounded-lg border border-slate-700 bg-surface-800 px-4 py-2 text-sm font-medium text-slate-200 hover:border-blue-500/40"
              >
                Simulate AI reply
              </button>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <label htmlFor="template-body" className="sr-only">
              Template body
            </label>
            <textarea
              id="template-body"
              rows={14}
              readOnly
              value={selected.body}
              className="w-full resize-none rounded-lg border border-slate-800 bg-surface-950/80 p-4 font-mono text-sm leading-relaxed text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <p className="mt-4 text-xs text-slate-500">
              Pro plans unlock auto-translation, tone controls, and guardrails for marketplace policy compliance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
