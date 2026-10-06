"use client";

import { useMemo, useState } from "react";

const products = [
  {
    name: "Canvas Weekender",
    category: "Travel",
    price: 89,
    tag: "Best seller",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",
    tone: "sand",
  },
  {
    name: "Everyday Tote",
    category: "Everyday",
    price: 42,
    tag: "New",
    image:
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=85",
    tone: "blush",
  },
  {
    name: "Metro Crossbody",
    category: "Everyday",
    price: 64,
    tag: "Editor pick",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85",
    tone: "stone",
  },
  {
    name: "Packable Shopper",
    category: "Sustainable",
    price: 28,
    tag: "Eco choice",
    image:
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=900&q=85",
    tone: "sage",
  },
  {
    name: "No. 04 Mini Bag",
    category: "New arrivals",
    price: 56,
    tag: "Limited",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85",
    tone: "ink",
  },
  {
    name: "Studio Carryall",
    category: "Travel",
    price: 118,
    tag: "Signature",
    image:
      "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&w=900&q=85",
    tone: "cream",
  },
];

const categories = ["All pieces", "New arrivals", "Everyday", "Travel", "Sustainable"];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All pieces");
  const [menuOpen, setMenuOpen] = useState(false);
  const [cart, setCart] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const filteredProducts = useMemo(
    () =>
      activeCategory === "All pieces"
        ? products
        : products.filter((product) => product.category === activeCategory),
    [activeCategory],
  );

  return (
    <main>
      <div className="announcement">
        <span>Complimentary shipping on orders over €75</span>
        <span className="announcement-link">Explore our materials <span aria-hidden="true">↗</span></span>
      </div>

      <header className="site-header">
        <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? "×" : "☰"}
        </button>
        <a className="brand" href="#" aria-label="Morrow home">morrow<span>®</span></a>
        <nav className={menuOpen ? "main-nav open" : "main-nav"}>
          <a href="#shop">Shop</a>
          <a href="#story">Our story</a>
          <a href="#materials">Materials</a>
          <a href="#journal">Journal</a>
        </nav>
        <div className="header-actions">
          <button aria-label="Search" className="icon-button">⌕</button>
          <button aria-label="Account" className="icon-button account-icon">◯</button>
          <button className="bag-button" onClick={() => setCart(cart + 1)}>
            Bag <span>{cart.toString().padStart(2, "0")}</span>
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Thoughtfully made / consciously carried</p>
          <h1>Carry the<br /><em>everyday</em> beautifully.</h1>
          <p className="hero-description">Quietly considered bags for wherever the day takes you. Designed to live with you, not just for a season.</p>
          <a className="button button-dark" href="#shop">Shop the collection <span>↗</span></a>
        </div>
        <div className="hero-image" role="img" aria-label="Morrow bags styled in a warm studio"></div>
        <div className="hero-note"><span>01</span><div><b>Made for more</b><br />Less waste, more wear.</div></div>
      </section>

      <section className="values" id="story">
        <p className="eyebrow">The Morrow approach</p>
        <h2>Good design should feel<br /><em>good to carry.</em></h2>
        <div className="value-grid">
          <div><span className="value-number">01</span><h3>Purposeful form</h3><p>Every pocket, handle and curve has a reason to be here.</p></div>
          <div><span className="value-number">02</span><h3>Honest materials</h3><p>We choose recycled, organic and traceable materials first.</p></div>
          <div><span className="value-number">03</span><h3>Made to remain</h3><p>Timeless silhouettes designed to travel far beyond a trend.</p></div>
        </div>
      </section>

      <section className="shop-section" id="shop">
        <div className="section-heading">
          <div><p className="eyebrow">Curated for your rhythm</p><h2>Find your <em>everyday essential.</em></h2></div>
          <p className="section-intro">Small-batch pieces that bring a little more ease to the way you move through the world.</p>
        </div>
        <div className="category-tabs" role="tablist">
          {categories.map((category) => (
            <button className={activeCategory === category ? "active" : ""} key={category} onClick={() => setActiveCategory(category)}>{category}</button>
          ))}
        </div>
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <article className="product-card" key={product.name}>
              <div className={`product-image ${product.tone}`} style={{ backgroundImage: `url(${product.image})` }}>
                <span className="product-tag">{product.tag}</span>
                <button className="quick-add" onClick={() => setCart(cart + 1)}>+ Add</button>
              </div>
              <div className="product-info"><div><h3>{product.name}</h3><p>{product.category}</p></div><strong>€{product.price}</strong></div>
            </article>
          ))}
        </div>
      </section>

      <section className="feature-banner" id="materials">
        <div className="feature-image"></div>
        <div className="feature-copy"><p className="eyebrow">A lighter footprint</p><h2>Beautifully made.<br /><em>Better considered.</em></h2><p>From recycled nylon to organic cotton, we make thoughtful material choices at every step. Because the future of design is one we all get to carry.</p><a className="text-link" href="#materials">Discover our materials <span>↗</span></a></div>
      </section>

      <section className="newsletter" id="journal">
        <div><p className="eyebrow">Stay in the loop</p><h2>Notes from <em>the road.</em></h2></div>
        {subscribed ? <p className="success-message">You&apos;re on the list — welcome to Morrow.</p> : <form onSubmit={(event) => { event.preventDefault(); setSubscribed(true); }}><input type="email" required placeholder="Your email address" value={email} onChange={(event) => setEmail(event.target.value)} /><button type="submit">Subscribe <span>↗</span></button></form>}
      </section>

      <footer className="footer"><div className="footer-brand"><a className="brand" href="#">morrow<span>®</span></a><p>Objects for moving through life.</p></div><div className="footer-links"><div><b>Explore</b><a href="#shop">Shop all</a><a href="#story">Our story</a><a href="#materials">Materials</a></div><div><b>Help</b><a href="#">Shipping & returns</a><a href="#">Contact</a><a href="#">FAQ</a></div><div><b>Follow</b><a href="#">Instagram</a><a href="#">Pinterest</a><a href="#">Journal</a></div></div><div className="footer-bottom"><span>© 2024 Morrow Studio</span><span>Designed with intention</span></div></footer>
    </main>
  );
}
