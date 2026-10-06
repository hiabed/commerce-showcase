"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  COLORS, PRINT_METHODS, TIERS, fromPrice, products, subcategories, unitPrice,
  type Feature, type Material, type Product,
} from "./data";
import { LANGS, dict, money, num, type Dict, type Lang } from "./i18n";

type CartLine = { key: string; product: Product; qty: number; color: string; method: number; unit: number; logo?: string };

const MATERIALS: Material[] = ["Cotton", "Canvas", "Jute", "Paper", "Recycled PET", "Leather"];
const FEATURES: Feature[] = ["Sustainable", "Fast delivery", "Bestseller", "New"];

function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className={`logo ${light ? "logo-light" : ""}`} aria-label="Linasprint">
      <svg viewBox="0 0 40 40" width="34" height="34" aria-hidden>
        <rect x="4" y="12" width="32" height="25" rx="7" fill="var(--accent)" />
        <path d="M13 15v-3a7 7 0 0 1 14 0v3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M15 21v9h9" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="logo-word">lina<b>sprint</b></span>
    </span>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <span className="stars" style={{ "--pct": `${(value / 5) * 100}%` } as CSSProperties} aria-label={`${value} / 5`}>
      ★★★★★
    </span>
  );
}

function LangSwitch({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="lang" role="group" aria-label="Language">
      {LANGS.map((l) => (
        <button key={l.code} className={l.code === lang ? "on" : ""} onClick={() => setLang(l.code)} title={l.label}>
          <span aria-hidden>{l.flag}</span>{l.code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function BagPreview({ color, logo, text, placeholder }: { color: string; logo?: string; text: string; placeholder: string }) {
  const fill = COLORS[color];
  const dark = ["Black", "Navy", "Forest", "Coral"].includes(color);
  return (
    <svg viewBox="0 0 300 330" className="bag-preview" aria-hidden>
      <path d="M95 95V70a55 55 0 0 1 110 0v25" fill="none" stroke={fill} strokeWidth="12" strokeLinecap="round" />
      <path d="M95 95V70a55 55 0 0 1 110 0v25" fill="none" stroke="#000" strokeOpacity=".12" strokeWidth="12" strokeLinecap="round" />
      <path d="M40 92h220l-12 222a12 12 0 0 1-12 11H64a12 12 0 0 1-12-11z" fill={fill} />
      <path d="M40 92h220l-2 30H42z" fill="#000" opacity=".08" />
      <path d="M150 92v233" stroke="#000" strokeOpacity=".04" strokeWidth="80" />
      {logo ? (
        <image href={logo} x="95" y="160" width="110" height="110" preserveAspectRatio="xMidYMid meet" />
      ) : (
        <text x="150" y="222" textAnchor="middle" fill={dark ? "#fff" : "#1f1b2e"} fontSize="28" fontWeight="700" fontFamily="var(--font-display)">
          {text || placeholder}
        </text>
      )}
    </svg>
  );
}

export default function Home() {
  const [lang, setLangState] = useState<Lang>("da");
  const [query, setQuery] = useState("");
  const [materials, setMaterials] = useState<Material[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(30);
  const [sort, setSort] = useState(0);
  const [dense, setDense] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [active, setActive] = useState<Product | null>(null);

  const t = dict[lang];
  const fmt = (n: number) => money(n, lang);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("lang", l); } catch {}
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restore saved preference after hydration
      if (saved === "en" || saved === "da") setLangState(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = `Linasprint — ${t.heroTitle}`;
  }, [lang, t.heroTitle]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 3200);
    return () => clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    document.body.style.overflow = active || cartOpen || filtersOpen ? "hidden" : "";
  }, [active, cartOpen, filtersOpen]);

  const toggle = <T,>(list: T[], set: (v: T[]) => void, v: T) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products.filter(
      (p) =>
        (!q || `${p.name.da} ${p.name.en} ${p.spec[lang]} ${dict[lang].materials[p.material]}`.toLowerCase().includes(q)) &&
        (!materials.length || materials.includes(p.material)) &&
        features.every((f) => p.features.includes(f)) &&
        (!colors.length || colors.some((c) => p.colors.includes(c))) &&
        fromPrice(p) <= maxPrice,
    );
    const by: Record<number, (a: Product, b: Product) => number> = {
      1: (a, b) => b.reviews - a.reviews,
      2: (a, b) => fromPrice(a) - fromPrice(b),
      3: (a, b) => fromPrice(b) - fromPrice(a),
      4: (a, b) => b.rating - a.rating,
      5: (a, b) => Number(b.features.includes("New")) - Number(a.features.includes("New")),
    };
    return by[sort] ? [...list].sort(by[sort]) : list;
  }, [query, materials, features, colors, maxPrice, sort, lang]);

  const chips = [
    ...materials.map((m) => ({ label: t.materials[m], clear: () => toggle(materials, setMaterials, m) })),
    ...features.map((f) => ({ label: t.featureNames[f], clear: () => toggle(features, setFeatures, f) })),
    ...colors.map((c) => ({ label: t.colors[c], clear: () => toggle(colors, setColors, c) })),
    ...(maxPrice < 30 ? [{ label: t.under(fmt(maxPrice)), clear: () => setMaxPrice(30) }] : []),
  ];
  const clearAll = () => { setMaterials([]); setFeatures([]); setColors([]); setMaxPrice(30); setQuery(""); };

  const cartCount = cart.reduce((n, l) => n + l.qty, 0);
  const cartTotal = cart.reduce((n, l) => n + l.qty * l.unit, 0);

  const filters = (
    <>
      <div className="filter-group">
        <h4>{t.pricePerPiece}</h4>
        <input type="range" min={1} max={30} step={1} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} />
        <div className="range-labels"><span>{fmt(1)}</span><b>{maxPrice >= 30 ? t.anyPrice : t.upTo(fmt(maxPrice))}</b></div>
      </div>
      <div className="filter-group">
        <h4>{t.colour}</h4>
        <div className="swatches">
          {Object.entries(COLORS).map(([name, hex]) => (
            <button key={name} title={t.colors[name]} aria-label={t.colors[name]} className={`swatch ${colors.includes(name) ? "on" : ""}`}
              style={{ background: hex }} onClick={() => toggle(colors, setColors, name)} />
          ))}
        </div>
      </div>
      <div className="filter-group">
        <h4>{t.material}</h4>
        {MATERIALS.map((m) => (
          <label key={m} className="check">
            <input type="checkbox" checked={materials.includes(m)} onChange={() => toggle(materials, setMaterials, m)} />
            <span>{t.materials[m]}</span><em>{products.filter((p) => p.material === m).length}</em>
          </label>
        ))}
      </div>
      <div className="filter-group">
        <h4>{t.features}</h4>
        {FEATURES.map((f) => (
          <label key={f} className="check">
            <input type="checkbox" checked={features.includes(f)} onChange={() => toggle(features, setFeatures, f)} />
            <span>{t.featureNames[f]}</span><em>{products.filter((p) => p.features.includes(f)).length}</em>
          </label>
        ))}
      </div>
      <div className="filter-promo">
        <b>{t.samplesTitle}</b>
        <p>{t.samplesText}</p>
      </div>
    </>
  );

  return (
    <>
      <div className="usp-bar">
        {t.usp.map((u) => <span key={u}>{u}</span>)}
        <span className="usp-rating"><Stars value={4.8} /> {t.reviewsSummary}</span>
      </div>

      <header className="header">
        <div className="header-main">
          <button className="burger" onClick={() => setMenuOpen(!menuOpen)} aria-label={t.menu}>☰</button>
          <a href="#" aria-label="Linasprint"><Logo /></a>
          <label className="search">
            <svg viewBox="0 0 24 24" width="18" aria-hidden><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" /><path d="m20 20-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.search} />
          </label>
          <div className="header-actions">
            <a className="contact" href="#"><small>{t.help}</small><b>+45 70 20 30 40</b></a>
            <LangSwitch lang={lang} setLang={setLang} />
            <button className="icon-btn wish-btn" aria-label="Wishlist">♡{wishlist.length > 0 && <i>{wishlist.length}</i>}</button>
            <button className="icon-btn" aria-label="Account">
              <svg viewBox="0 0 24 24" width="21" aria-hidden><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M4 21a8 8 0 0 1 16 0" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
            </button>
            <button className="cart-btn" onClick={() => setCartOpen(true)}>
              <svg viewBox="0 0 24 24" width="20" aria-hidden><path d="M5 8h14l-1 13H6zM9 8V6a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
              <span>{t.cart}</span>{cart.length > 0 && <i>{cart.length}</i>}
            </button>
          </div>
        </div>
        <nav className={`nav ${menuOpen ? "open" : ""}`}>
          {t.nav.map((n, i) => <a key={n} href="#" className={i === 0 ? "current" : ""}>{n}</a>)}
          <a href="#" className="nav-hot">{t.offers}</a>
          <a href="#" className="nav-fast">{t.express}</a>
        </nav>
      </header>

      <main className="page">
        <nav className="crumbs"><a href="#">{t.home}</a> / <a href="#">{t.nav[0]}</a> / <span>{t.crumb}</span></nav>

        <section className="cat-hero">
          <div>
            <p className="kicker">{t.nav[0]}</p>
            <h1>{t.heroTitle} <span>{t.heroAccent}</span></h1>
            <p>{t.heroText}</p>
            <div className="hero-stats">
              {t.stats.map(([b, s]) => <div key={s}><b>{b}</b><span>{s}</span></div>)}
            </div>
          </div>
          <div className="cat-hero-art">
            <div className="hero-card hero-card-a" style={{ backgroundImage: `url(${products[1].image})` }} />
            <div className="hero-card hero-card-b" style={{ backgroundImage: `url(${products[0].image})` }} />
            <div className="hero-badge"><b>-10%</b><span>{t.heroBadge}</span></div>
          </div>
        </section>

        <section className="subcats">
          {subcategories.map((s) => (
            <a key={s.name.en} href="#" className="subcat">
              <span style={{ backgroundImage: `url(${s.image})` }} />
              <b>{s.name[lang]}</b><small>{s.count} {t.productsCount}</small>
            </a>
          ))}
        </section>

        <div className="catalog">
          <aside className={`filters ${filtersOpen ? "open" : ""}`}>
            <div className="filters-head"><h3>{t.filters}</h3><button onClick={() => setFiltersOpen(false)}>✕</button></div>
            {filters}
            <button className="btn btn-dark filters-apply" onClick={() => setFiltersOpen(false)}>{t.show(visible.length)}</button>
          </aside>

          <section>
            <div className="toolbar">
              <button className="filter-toggle" onClick={() => setFiltersOpen(true)}>⚙ {t.filters} {chips.length > 0 && `(${chips.length})`}</button>
              <p><b>{visible.length}</b> {t.productsCount}</p>
              <div className="toolbar-right">
                <select value={sort} onChange={(e) => setSort(+e.target.value)} aria-label="Sort">
                  {t.sorts.map((s, i) => <option key={s} value={i}>{s}</option>)}
                </select>
                <div className="density">
                  <button className={!dense ? "on" : ""} onClick={() => setDense(false)} aria-label="Large grid">▦</button>
                  <button className={dense ? "on" : ""} onClick={() => setDense(true)} aria-label="Compact grid">▩</button>
                </div>
              </div>
            </div>

            {chips.length > 0 && (
              <div className="chips">
                {chips.map((c) => <button key={c.label} onClick={c.clear}>{c.label} ✕</button>)}
                <button className="chips-clear" onClick={clearAll}>{t.clearAll}</button>
              </div>
            )}

            {visible.length === 0 ? (
              <div className="empty">
                <h3>{t.emptyTitle}</h3>
                <p>{t.emptyText}</p>
                <button className="btn btn-dark" onClick={clearAll}>{t.reset}</button>
              </div>
            ) : (
              <div className={`grid ${dense ? "dense" : ""}`}>
                {visible.map((p, i) => (
                  <article key={p.id} className="card" style={{ animationDelay: `${i * 40}ms` }}>
                    <div className="card-media" onClick={() => setActive(p)}>
                      <span className="card-img" style={{ backgroundImage: `url(${p.image})` }} />
                      <div className="badges">
                        {p.discount && <span className="badge badge-sale">-{p.discount}%</span>}
                        {p.features.includes("Sustainable") && <span className="badge badge-eco">{t.badges.eco}</span>}
                        {p.features.includes("Bestseller") && <span className="badge">{t.badges.best}</span>}
                        {p.features.includes("New") && <span className="badge badge-new">{t.badges.new}</span>}
                      </div>
                      <button className="quick">{t.customise}</button>
                    </div>
                    <button className={`heart ${wishlist.includes(p.id) ? "on" : ""}`} aria-label="Wishlist"
                      onClick={() => toggle(wishlist, setWishlist, p.id)}>{wishlist.includes(p.id) ? "♥" : "♡"}</button>
                    <div className="card-body">
                      <div className="card-colors">
                        {p.colors.slice(0, 5).map((c) => <span key={c} style={{ background: COLORS[c] }} title={t.colors[c]} />)}
                        {p.colors.length > 5 && <small>+{p.colors.length - 5}</small>}
                      </div>
                      <h3 onClick={() => setActive(p)}>{p.name[lang]}</h3>
                      <p className="spec">{p.spec[lang]}</p>
                      <div className="rating"><Stars value={p.rating} /><small>({p.reviews})</small></div>
                      <div className="price-row">
                        <div>
                          <small>{t.from}</small>
                          <b>{fmt(fromPrice(p))}</b>
                          {p.discount && <s>{fmt(fromPrice(p) / (1 - p.discount / 100))}</s>}
                          <small>{t.pc}</small>
                        </div>
                        <span className="min">{t.min(p.minQty)}</span>
                      </div>
                      <p className={`stock ${p.features.includes("Fast delivery") ? "fast" : ""}`}>
                        ● {t.inStock(num(p.stock, lang))} · {p.features.includes("Fast delivery") ? t.express72 : t.ships}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="pager">
              <button disabled>‹</button><button className="on">1</button><button>2</button><button>3</button><span>…</span><button>11</button><button>›</button>
            </div>
          </section>
        </div>

        <section className="steps">
          <h2>{t.stepsTitle}</h2>
          <div className="steps-grid">
            {t.steps.map(([title, d], i) => (
              <div key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{d}</p></div>
            ))}
          </div>
        </section>

        <section className="reviews">
          {t.reviews.map(([q, n, r]) => (
            <figure key={n}><Stars value={5} /><blockquote>“{q}”</blockquote><figcaption><b>{n}</b>{r}</figcaption></figure>
          ))}
        </section>
      </main>

      <footer className="footer">
        <div className="footer-top">
          <div>
            <Logo light />
            <p>{t.footerText}</p>
            <form className="news" onSubmit={(e) => { e.preventDefault(); setToast(t.subscribed); (e.target as HTMLFormElement).reset(); }}>
              <input type="email" required placeholder={t.emailPh} />
              <button>{t.subscribe}</button>
            </form>
          </div>
          {t.footerCols.map(([h, ...links]) => (
            <div key={h} className="footer-col"><b>{h}</b>{links.map((l) => <a key={l} href="#">{l}</a>)}</div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Linasprint. {t.rights}</span>
          <span className="pay">{t.pay}</span>
        </div>
      </footer>

      {active && (
        <Configurator
          product={active}
          lang={lang}
          t={t}
          onClose={() => setActive(null)}
          onAdd={(line) => {
            setCart((c) => [...c, line]);
            setActive(null);
            setCartOpen(true);
          }}
        />
      )}

      <div className={`overlay ${cartOpen || filtersOpen ? "show" : ""}`} onClick={() => { setCartOpen(false); setFiltersOpen(false); }} />
      <aside className={`drawer ${cartOpen ? "open" : ""}`} aria-hidden={!cartOpen}>
        <div className="drawer-head"><h3>{t.yourCart} <small>{num(cartCount, lang)} {t.pcs}</small></h3><button onClick={() => setCartOpen(false)}>✕</button></div>
        {cart.length === 0 ? (
          <div className="drawer-empty"><span>🛍️</span><p>{t.emptyCart}</p><button className="btn btn-dark" onClick={() => setCartOpen(false)}>{t.browse}</button></div>
        ) : (
          <>
            <div className="lines">
              {cart.map((l) => (
                <div key={l.key} className="line">
                  <span className="line-img" style={{ backgroundImage: `url(${l.product.image})` }} />
                  <div>
                    <b>{l.product.name[lang]}</b>
                    <small>{num(l.qty, lang)} {t.pcs} · {t.colors[l.color]} · {t.methods[l.method][0]}</small>
                    <small>{fmt(l.unit)} {t.pc}</small>
                  </div>
                  <div className="line-end">
                    <b>{fmt(l.qty * l.unit)}</b>
                    <button onClick={() => setCart((c) => c.filter((x) => x.key !== l.key))}>{t.remove}</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="drawer-foot">
              <div className="sum"><span>{t.subtotal}</span><b>{fmt(cartTotal)}</b></div>
              <div className="sum muted"><span>{t.setup}</span><span>{t.free}</span></div>
              <div className="sum muted"><span>{t.delivery}</span><span>{cartTotal > 250 ? t.free : fmt(14.95)}</span></div>
              <button className="btn btn-accent" onClick={() => { setCart([]); setCartOpen(false); setToast(t.quoteSent); }}>{t.requestQuote}</button>
            </div>
          </>
        )}
      </aside>

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}

function Configurator({ product, lang, t, onClose, onAdd }: { product: Product; lang: Lang; t: Dict; onClose: () => void; onAdd: (l: CartLine) => void }) {
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(Math.max(product.minQty, 100));
  const [method, setMethod] = useState(0);
  const [logo, setLogo] = useState<string>();
  const [text, setText] = useState("");
  const [view, setView] = useState<"preview" | "photo">("preview");

  const fmt = (n: number) => money(n, lang);
  const extra = PRINT_METHODS[method].extra;
  const unit = unitPrice(product, qty) + extra;
  const valid = qty >= product.minQty;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const upload = (f?: File) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setLogo(r.result as string);
    r.readAsDataURL(f);
  };

  return (
    <div className="modal-wrap" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        <div className="modal-media">
          <div className="view-switch">
            <button className={view === "preview" ? "on" : ""} onClick={() => setView("preview")}>{t.logoPreview}</button>
            <button className={view === "photo" ? "on" : ""} onClick={() => setView("photo")}>{t.photo}</button>
          </div>
          {view === "preview"
            ? <BagPreview color={color} logo={logo} text={text} placeholder={t.yourLogo} />
            : <span className="modal-photo" style={{ backgroundImage: `url(${product.image})` }} />}
          <p className="modal-note">{t.previewNote}</p>
        </div>

        <div className="modal-body">
          <p className="kicker">{t.materials[product.material]} · {t.itemNo} LS-{1000 + product.id}</p>
          <h2>{product.name[lang]}</h2>
          <div className="rating"><Stars value={product.rating} /><small>{product.rating.toLocaleString(lang)} ({product.reviews} {t.reviewsWord})</small></div>
          <p className="spec">{product.spec[lang]}</p>

          <h4>{t.step1} <span>{t.colors[color]}</span></h4>
          <div className="swatches">
            {product.colors.map((c) => (
              <button key={c} title={t.colors[c]} aria-label={t.colors[c]} className={`swatch ${c === color ? "on" : ""}`} style={{ background: COLORS[c] }} onClick={() => setColor(c)} />
            ))}
          </div>

          <h4>{t.step2}</h4>
          <div className="logo-row">
            <label className="upload">
              <input type="file" accept="image/*" onChange={(e) => upload(e.target.files?.[0])} />
              {logo ? t.logoUploaded : t.uploadLogo}
            </label>
            <input className="text-in" value={text} maxLength={14} onChange={(e) => { setText(e.target.value); setLogo(undefined); }} placeholder={t.typeText} />
          </div>

          <h4>{t.step3}</h4>
          <div className="methods">
            {PRINT_METHODS.map((m, i) => (
              <button key={m.id} className={i === method ? "on" : ""} onClick={() => setMethod(i)}>
                <b>{t.methods[i][0]}</b><small>{t.methods[i][1]}</small><em>+{fmt(m.extra)}</em>
              </button>
            ))}
          </div>

          <h4>{t.step4}</h4>
          <div className="tiers">
            {TIERS.map((tier, i) => (
              <button key={tier} className={qty >= tier && (TIERS[i + 1] ?? Infinity) > qty ? "on" : ""} onClick={() => setQty(Math.max(tier, product.minQty))}>
                <small>{num(tier, lang)}+ {t.pcs}</small><b>{fmt(unitPrice(product, tier) + extra)}</b>
              </button>
            ))}
          </div>
          <div className="qty">
            <button onClick={() => setQty(Math.max(product.minQty, qty - 25))}>−</button>
            <input type="number" value={qty} min={product.minQty} onChange={(e) => setQty(Math.max(0, +e.target.value))} />
            <button onClick={() => setQty(qty + 25)}>+</button>
            {!valid && <small className="warn">{t.minWarn(product.minQty)}</small>}
          </div>

          <div className="total">
            <div><small>{t.perPcIncl(fmt(unit))}</small><b>{fmt(unit * qty)}</b><small>{t.exVat}</small></div>
            <button className="btn btn-accent" disabled={!valid}
              onClick={() => onAdd({ key: `${product.id}-${Date.now()}`, product, qty, color, method, unit, logo })}>
              {t.addToCart}
            </button>
          </div>
          <ul className="perks">{t.perks.map((p) => <li key={p}>{p}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}
