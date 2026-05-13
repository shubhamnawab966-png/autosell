import { useCallback, useEffect, useState } from "react";

const sources = [
  { id: "meesho", name: "Meesho", color: "from-pink-600/30 to-rose-600/20" },
  { id: "glowroad", name: "Glowroad", color: "from-violet-600/30 to-purple-600/20" },
  { id: "indiamart", name: "IndiaMart", color: "from-amber-600/30 to-orange-600/20" },
  { id: "aliexpress", name: "AliExpress", color: "from-red-600/30 to-red-500/20" },
];

/** Public catalog: images (Unsplash) + videos (YouTube embeds & sample MP4s from the web). */
const catalog = [
  {
    id: "cat-1",
    name: "Handloom cotton saree — Indigo",
    category: "Fashion",
    price: "₹1,299",
    source: "Meesho",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80&auto=format&fit=crop",
    video: { kind: "youtube", id: "aqz-KE-bpKQ", caption: "Product reel (sample)" },
  },
  {
    id: "cat-2",
    name: "Stainless steel cookware set",
    category: "Kitchen",
    price: "₹2,450",
    source: "Glowroad",
    image:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&q=80&auto=format&fit=crop",
    video: {
      kind: "mp4",
      src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      caption: "Promo clip (Google sample CDN)",
    },
  },
  {
    id: "cat-3",
    name: "Wireless neckband earphones",
    category: "Electronics",
    price: "₹899",
    source: "IndiaMart",
    image:
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&q=80&auto=format&fit=crop",
    video: { kind: "youtube", id: "M7lc1UVf-VE", caption: "YouTube embed test (Google)" },
  },
  {
    id: "cat-4",
    name: "Ayurvedic hair oil combo",
    category: "Beauty",
    price: "₹549",
    source: "Meesho",
    image:
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80&auto=format&fit=crop",
    video: {
      kind: "mp4",
      src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      caption: "Lifestyle b-roll (sample)",
    },
  },
  {
    id: "cat-5",
    name: "Kids school backpack",
    category: "Kids",
    price: "₹699",
    source: "AliExpress",
    image:
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&q=80&auto=format&fit=crop",
    video: { kind: "youtube", id: "ScMzIvxBSi4", caption: "Unboxing style (sample)" },
  },
  {
    id: "cat-6",
    name: "Decorative wall plates (set of 3)",
    category: "Home",
    price: "₹1,050",
    source: "Glowroad",
    image:
      "https://images.unsplash.com/photo-1615876234889-fd8a39a275d9?w=600&q=80&auto=format&fit=crop",
    video: {
      kind: "mp4",
      src: "https://www.w3schools.com/html/mov_bbb.mp4",
      caption: "Short loop (W3Schools sample)",
    },
  },
];

const spotlightVideos = [
  {
    title: "Filming products on a budget",
    subtitle: "YouTube — Creative Commons / Big Buck Bunny channel",
    youtubeId: "aqz-KE-bpKQ",
  },
  {
    title: "YouTube player API sample",
    subtitle: "Google official embed test",
    youtubeId: "M7lc1UVf-VE",
  },
];

const products = [
  {
    sku: "ME-20491",
    name: "Cotton kurti set — Navy",
    source: "Meesho",
    price: "₹899",
    margin: "22%",
    status: "Live",
    thumb:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=120&q=80&auto=format&fit=crop",
  },
  {
    sku: "GR-8832",
    name: "Kitchen storage jars (6 pc)",
    source: "Glowroad",
    price: "₹449",
    margin: "18%",
    status: "Live",
    thumb:
      "https://images.unsplash.com/photo-1584990340481-57909576354e?w=120&q=80&auto=format&fit=crop",
  },
  {
    sku: "IM-7721",
    name: "LED emergency bulb 12W",
    source: "IndiaMart",
    price: "₹312",
    margin: "14%",
    status: "Draft",
    thumb:
      "https://images.unsplash.com/photo-1565814329452-e1efa1c3a89f?w=120&q=80&auto=format&fit=crop",
  },
  {
    sku: "AE-11902",
    name: "USB-C hub 7-in-1",
    source: "AliExpress",
    price: "₹1,290",
    margin: "31%",
    status: "Live",
    thumb:
      "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=120&q=80&auto=format&fit=crop",
  },
  {
    sku: "ME-441",
    name: "Men's sneakers — White",
    source: "Meesho",
    price: "₹1,099",
    margin: "6%",
    status: "Paused",
    thumb:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=120&q=80&auto=format&fit=crop",
  },
];

export function ProductsPage() {
  const [toast, setToast] = useState(null);
  const [videoModal, setVideoModal] = useState(null);

  const importFrom = (name) => {
    setToast(`Import started from ${name}…`);
    setTimeout(() => setToast(null), 2800);
  };

  const closeModal = useCallback(() => setVideoModal(null), []);

  useEffect(() => {
    if (!videoModal) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [videoModal, closeModal]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Products</h1>
          <p className="mt-1 text-slate-400">
            Browse the live-style catalog (internet media), then sync rows to your stores.
          </p>
        </div>
        <button
          type="button"
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:bg-blue-500"
        >
          Add product manually
        </button>
      </div>

      {/* Product catalog — images + video */}
      <section className="rounded-xl border border-slate-800/80 bg-surface-900/60 p-5 shadow-panel sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Product catalog</h2>
            <p className="text-sm text-slate-400">
              Photos from Unsplash; videos open YouTube embeds or MP4 streams from public CDNs.
            </p>
          </div>
          <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-medium text-blue-300">
            {catalog.length} trending SKUs
          </span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {catalog.map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-xl border border-slate-800/80 bg-surface-950/50 transition hover:border-blue-500/35"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                <img
                  src={item.image}
                  alt=""
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <button
                  type="button"
                  onClick={() => setVideoModal({ title: item.name, video: item.video })}
                  className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 rounded-lg bg-blue-600/90 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur transition hover:bg-blue-500"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M8 5v14l11-7L8 5z" />
                    </svg>
                  </span>
                  Play video
                </button>
                <span className="absolute left-3 top-3 rounded-md bg-black/50 px-2 py-1 text-xs font-medium text-white backdrop-blur">
                  {item.category}
                </span>
              </div>
              <div className="space-y-1 p-4">
                <h3 className="font-medium leading-snug text-slate-100">{item.name}</h3>
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
                  <span>{item.source}</span>
                  <span className="text-slate-600">·</span>
                  <span className="font-semibold text-white">{item.price}</span>
                </div>
                <p className="text-xs text-slate-500">{item.video.caption}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Inline internet videos */}
      <section className="rounded-xl border border-slate-800/80 bg-surface-900/60 p-5 shadow-panel sm:p-6">
        <h2 className="text-lg font-semibold text-white">Catalog video wall</h2>
        <p className="mt-1 text-sm text-slate-400">
          Curated embeds from YouTube — useful for training staff or supplier research.
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {spotlightVideos.map((v) => (
            <div key={v.youtubeId} className="overflow-hidden rounded-xl border border-slate-800 bg-black/40">
              <div className="aspect-video w-full">
                <iframe
                  title={v.title}
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${v.youtubeId}?rel=0`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              <div className="border-t border-slate-800/80 px-4 py-3">
                <p className="font-medium text-slate-200">{v.title}</p>
                <p className="text-xs text-slate-500">{v.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div>
        <h2 className="text-sm font-medium uppercase tracking-wide text-slate-500">Import from</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {sources.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => importFrom(s.name)}
              className={`group relative overflow-hidden rounded-xl border border-slate-800/80 bg-gradient-to-br ${s.color} p-5 text-left transition hover:border-blue-500/40`}
            >
              <span className="relative z-10 text-lg font-semibold text-white">{s.name}</span>
              <p className="relative z-10 mt-1 text-sm text-slate-300/90">Connect & sync catalog</p>
              <span className="relative z-10 mt-4 inline-flex items-center text-sm font-medium text-blue-300 group-hover:text-blue-200">
                Start import →
              </span>
            </button>
          ))}
        </div>
      </div>

      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-blue-500/40 bg-surface-900 px-4 py-2 text-sm text-blue-200 shadow-glow">
          {toast}
        </div>
      ) : null}

      {videoModal ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={closeModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="video-modal-title"
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-700 bg-surface-900 shadow-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 px-4 py-3 sm:px-5">
              <div>
                <h3 id="video-modal-title" className="pr-8 font-semibold text-white">
                  {videoModal.title}
                </h3>
                <p className="text-xs text-slate-500">{videoModal.video.caption}</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-400 hover:bg-surface-800 hover:text-white"
                aria-label="Close video"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="bg-black">
              {videoModal.video.kind === "youtube" ? (
                <div className="aspect-video w-full">
                  <iframe
                    title={videoModal.title}
                    className="h-full w-full"
                    src={`https://www.youtube.com/embed/${videoModal.video.id}?autoplay=1&rel=0`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : (
                <video
                  className="max-h-[70vh] w-full"
                  controls
                  playsInline
                  autoPlay
                  src={videoModal.video.src}
                />
              )}
            </div>
          </div>
        </div>
      ) : null}

      <div className="rounded-xl border border-slate-800/80 bg-surface-900/60 shadow-panel">
        <div className="flex flex-col gap-4 border-b border-slate-800/80 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <input
            type="search"
            placeholder="Search SKU or title…"
            className="w-full max-w-md rounded-lg border border-slate-700 bg-surface-800 px-3 py-2 text-sm text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 sm:w-auto"
          />
          <div className="flex flex-wrap gap-2">
            <select className="rounded-lg border border-slate-700 bg-surface-800 px-3 py-2 text-sm text-slate-200 outline-none focus:border-blue-500">
              <option>All sources</option>
              <option>Meesho</option>
              <option>Glowroad</option>
              <option>IndiaMart</option>
              <option>AliExpress</option>
            </select>
            <select className="rounded-lg border border-slate-700 bg-surface-800 px-3 py-2 text-sm text-slate-200 outline-none focus:border-blue-500">
              <option>All status</option>
              <option>Live</option>
              <option>Draft</option>
              <option>Paused</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-800/80 bg-surface-950/50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-3 font-medium">Product</th>
                <th className="px-6 py-3 font-medium">SKU</th>
                <th className="px-6 py-3 font-medium">Source</th>
                <th className="px-6 py-3 font-medium">Selling price</th>
                <th className="px-6 py-3 font-medium">Margin</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {products.map((p) => (
                <tr key={p.sku} className="hover:bg-surface-800/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.thumb}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded-lg object-cover ring-1 ring-slate-700/80"
                        loading="lazy"
                      />
                      <span className="font-medium text-slate-200">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">{p.sku}</td>
                  <td className="px-6 py-4 text-slate-300">{p.source}</td>
                  <td className="px-6 py-4 font-medium text-white">{p.price}</td>
                  <td className="px-6 py-4 text-slate-300">{p.margin}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        p.status === "Live"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : p.status === "Draft"
                            ? "bg-slate-600/40 text-slate-300"
                            : "bg-amber-500/15 text-amber-400"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
