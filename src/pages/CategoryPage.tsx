import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getCategoryBySlug } from "../data/catalog";
import { useCart } from "../context/CartContext";

function StarRow({ value, reviews }: { value: number; reviews: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <div style={{ display: "flex", gap: 1 }}>
        {[1,2,3,4,5].map(i => (
          <svg key={i} width="10" height="10" viewBox="0 0 12 12" fill={i <= Math.round(value) ? "#e84e00" : "#e8e4df"}><path d="M6 1l1.35 2.74L10.5 4.27l-2.25 2.19.53 3.09L6 8l-2.78 1.55.53-3.09L1.5 4.27l3.15-.53L6 1z"/></svg>
        ))}
      </div>
      <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 12, color: "#1a1612" }}>{value}</span>
      <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, color: "#aaa49e" }}>({reviews})</span>
    </div>
  );
}

const SORT_OPTIONS = ["По популярности", "Сначала дешевле", "Сначала дороже", "По рейтингу"];

export function CategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { add, items } = useCart();
  const cat = getCategoryBySlug(category ?? "");
  const [sort, setSort] = useState("По популярности");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [added, setAdded] = useState<number | null>(null);

  if (!cat) {
    navigate("/catalog");
    return null;
  }

  const sorted = [...cat.products]
    .filter(p => !onlyInStock || p.inStock)
    .sort((a, b) => {
      if (sort === "Сначала дешевле") return a.price - b.price;
      if (sort === "Сначала дороже") return b.price - a.price;
      if (sort === "По рейтингу") return b.rating - a.rating;
      return b.reviews - a.reviews;
    });

  const handleAdd = (p: typeof cat.products[0]) => {
    add({ id: p.id, categorySlug: cat.slug, name: p.name, price: p.price, img: p.img });
    setAdded(p.id);
    setTimeout(() => setAdded(null), 1800);
  };

  const inCart = (id: number) => items.some(i => i.id === id);

  return (
    <div>
      {/* breadcrumb + hero */}
      <div style={{ background: "#fff", borderBottom: "1px solid #ece8e3" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => navigate("/catalog")} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa49e", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Экипировка</button>
          <svg width="6" height="10" viewBox="0 0 8 12" fill="none" stroke="#d6d0c8" strokeWidth="1.5"><path d="M1 1l6 5-6 5" strokeLinecap="round"/></svg>
          <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#1a1612" }}>{cat.name}</span>
        </div>
      </div>

      <div style={{ position: "relative", height: 220, overflow: "hidden", background: "#1a1612" }}>
        <img src={cat.img} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.35 }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg,${cat.accent}cc 0%,rgba(26,22,18,0.7) 100%)` }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", width: "100%" }}>
            <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 48, letterSpacing: "0.04em", textTransform: "uppercase", color: "#fff", lineHeight: 1, margin: "0 0 10px" }}>{cat.icon} {cat.name}</h1>
            <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 14, color: "rgba(255,255,255,0.55)", margin: 0 }}>{cat.description}</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 80px" }}>
        {/* toolbar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", color: "#aaa49e" }}>
            {sorted.length} товаров
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <div onClick={() => setOnlyInStock(v => !v)} style={{ width: 38, height: 22, borderRadius: 11, background: onlyInStock ? "#e84e00" : "#e0dbd4", position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}>
                <div style={{ position: "absolute", top: 3, left: onlyInStock ? 19 : 3, width: 16, height: 16, borderRadius: 8, background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
              </div>
              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b6357" }}>В наличии</span>
            </label>
            <select value={sort} onChange={e => setSort(e.target.value)}
              style={{ padding: "8px 32px 8px 12px", border: "1px solid #e0dbd4", background: "#fff", fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b6357", cursor: "pointer", appearance: "none" }}>
              {SORT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>

        {/* products grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
          {sorted.map(p => (
            <article key={p.id} style={{ background: "#fff", border: "1px solid #ece8e3", overflow: "hidden", display: "flex", flexDirection: "column", transition: "border-color 0.15s, box-shadow 0.15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#e84e00"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(232,78,0,0.1)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#ece8e3"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
            >
              {/* image */}
              <div onClick={() => navigate(`/catalog/${cat.slug}/${p.id}`)} style={{ height: 220, position: "relative", overflow: "hidden", background: "#f5f2ee", cursor: "pointer" }}>
                <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)"}
                  onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"}
                />
                {p.badge && (
                  <div style={{ position: "absolute", top: 12, left: 12 }}>
                    <span style={{ background: p.badgeColor || "#e84e00", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff", padding: "4px 10px" }}>{p.badge}</span>
                  </div>
                )}
                {!p.inStock && (
                  <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "#aaa49e" }}>Нет в наличии</span>
                  </div>
                )}
              </div>

              {/* info */}
              <div style={{ padding: "16px 18px 20px", display: "flex", flexDirection: "column", flex: 1, gap: 8 }}>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: cat.accent }}>{p.brand}</div>
                <h3 onClick={() => navigate(`/catalog/${cat.slug}/${p.id}`)} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 16, letterSpacing: "0.04em", textTransform: "uppercase", color: "#1a1612", lineHeight: 1.15, margin: 0, cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#e84e00"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#1a1612"}
                >{p.name}</h3>
                <StarRow value={p.rating} reviews={p.reviews} />
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: "auto" }}>
                  <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 22, color: "#1a1612" }}>{p.price.toLocaleString("ru")} ₽</span>
                  {p.oldPrice && <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 14, color: "#aaa49e", textDecoration: "line-through" }}>{p.oldPrice.toLocaleString("ru")} ₽</span>}
                </div>
                <button disabled={!p.inStock} onClick={() => handleAdd(p)}
                  style={{ marginTop: 6, padding: "10px 0", border: "none", cursor: p.inStock ? "pointer" : "not-allowed", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#fff", background: added === p.id ? "#3a9e5f" : inCart(p.id) ? "#6b6357" : p.inStock ? "#e84e00" : "#d6d0c8", transition: "background 0.2s" }}>
                  {added === p.id ? "✓ Добавлено" : inCart(p.id) ? "Уже в корзине" : "В корзину"}
                </button>
              </div>
            </article>
          ))}
        </div>

        {sorted.length === 0 && (
          <div style={{ background: "#fff", border: "1px solid #ece8e3", padding: "60px 0", textAlign: "center" }}>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 20, letterSpacing: "0.08em", textTransform: "uppercase", color: "#d6d0c8" }}>Товары не найдены</div>
          </div>
        )}
      </div>
    </div>
  );
}
