import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getProductById, getCategoryBySlug } from "../data/catalog";
import { useCart } from "../context/CartContext";
import { AUTO_SERVICES } from "../data/services";

// ── Mock seller ───────────────────────────────────────────────
const MOCK_SELLER = {
  id: "s1",
  name: "ARB Official Store",
  logo: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=80&h=80&fit=crop&auto=format",
  rating: 4.9,
  reviewCount: 1247,
  sales: 8430,
  since: "2018",
  dispatch: "Отправляет в течение 1 дня",
  verified: true,
};

// ── Mock reviews ──────────────────────────────────────────────
const MOCK_REVIEWS = [
  { id: 1, author: "Алексей М.", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=48&h=48&fit=crop&auto=format", rating: 5, date: "12 сен 2026", title: "Отличное качество, ставил на Defender", body: "Брал для установки на Land Rover Defender 110. Сборка отличная, всё крепко, ничего не болтается. Монтаж занял около 3 часов вместе с помощником. Уже прошли 2000 км по бездорожью — держится идеально.", tags: ["Внедорожник", "Установка своими руками"], helpful: 18, verified: true },
  { id: 2, author: "Дмитрий К.", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=48&h=48&fit=crop&auto=format", rating: 4, date: "3 авг 2026", title: "Хорошо, но инструкция слабовата", body: "Товар пришёл быстро, упаковка целая. Качество металла хорошее, покраска ровная. Немного запутался с инструкцией — она на английском и схемы мелкие. В итоге нашёл видео на YouTube и всё встало на место.", tags: ["Упаковка", "Документация"], helpful: 9, verified: true },
  { id: 3, author: "Ирина С.", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=48&h=48&fit=crop&auto=format", rating: 5, date: "19 июл 2026", title: "Брала в подарок мужу — доволен!", body: "Муж давно хотел, наконец решилась. Выбрала по отзывам, не пожалела. Приехало быстро, всё в порядке. Муж поставил сам, говорит сидит как родное.", tags: ["Подарок", "Быстрая доставка"], helpful: 14, verified: false },
  { id: 4, author: "Павел Р.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&auto=format", rating: 3, date: "5 июн 2026", title: "Нормально, но ожидал лучшего", body: "Сборка неплохая, но одна из гаек была немного перекошена. Пришлось подтачивать. В целом работает как надо, но за такую цену хотелось бы идеального исполнения.", tags: ["Качество"], helpful: 6, verified: true },
];

const RATING_DIST = [
  { stars: 5, pct: 68 },
  { stars: 4, pct: 18 },
  { stars: 3, pct: 8 },
  { stars: 2, pct: 4 },
  { stars: 1, pct: 2 },
];

function Stars({ value, size = 13, fill = "#e84e00", empty = "#e8e4df" }: { value: number; size?: number; fill?: string; empty?: string }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 12 12" fill={i <= Math.round(value) ? fill : empty}>
          <path d="M6 1l1.35 2.74L10.5 4.27l-2.25 2.19.53 3.09L6 8l-2.78 1.55.53-3.09L1.5 4.27l3.15-.53L6 1z"/>
        </svg>
      ))}
    </div>
  );
}

type OfferValue = {
  id: string;
  label: string;
  color?: string;
  priceDelta?: number;
  available?: boolean;
};

type OfferOption = {
  id: string;
  label: string;
  values: OfferValue[];
};

const OPTION_LABELS: Record<string, string> = {
  "lift-kits": "Совместимость",
  tires: "Размер",
  "roof-racks": "Размер платформы",
  apparel: "Размер",
};

function getOfferOptions(category: string, product?: ReturnType<typeof getProductById>): OfferOption[] {
  if (!product) return [];

  const options: OfferOption[] = [];
  if (product.variants?.length) {
    options.push({
      id: "variant",
      label: OPTION_LABELS[category] ?? "Модификация",
      values: product.variants.map((variant, index) => ({
        id: `v${index + 1}`,
        label: variant,
        priceDelta: index === 0 ? 0 : Math.round((product.price * index * 0.05) / 100) * 100,
        available: !(product.variants!.length > 3 && index === product.variants!.length - 1),
      })),
    });
  }

  const categoryOptions: Record<string, OfferOption[]> = {
    winches: [
      {
        id: "rope",
        label: "Тип троса",
        values: [
          { id: "steel", label: "Стальной" },
          { id: "synthetic", label: "Синтетический", priceDelta: 8900 },
        ],
      },
      {
        id: "voltage",
        label: "Напряжение",
        values: [
          { id: "12v", label: "12 В" },
          { id: "24v", label: "24 В", priceDelta: 2400 },
        ],
      },
    ],
    "lift-kits": [
      {
        id: "load",
        label: "Нагрузка",
        values: [
          { id: "standard", label: "Стандартная" },
          { id: "heavy", label: "+200 кг", priceDelta: 4500 },
        ],
      },
      {
        id: "finish",
        label: "Цвет пружин",
        values: [
          { id: "black", label: "Чёрный", color: "#1a1a18" },
          { id: "yellow", label: "Жёлтый", color: "#dfaa16" },
          { id: "red", label: "Красный", color: "#a83225" },
        ],
      },
    ],
    armor: [
      {
        id: "finish",
        label: "Покрытие",
        values: [
          { id: "black", label: "Чёрный матовый", color: "#1d1c1a" },
          { id: "graphite", label: "Графит", color: "#555653" },
          { id: "raw", label: "Без окраски", color: "#a8aaa8", priceDelta: -1800 },
        ],
      },
      {
        id: "mount",
        label: "Комплект крепежа",
        values: [
          { id: "base", label: "Базовый" },
          { id: "reinforced", label: "Усиленный", priceDelta: 3200 },
        ],
      },
    ],
    tires: [
      {
        id: "sidewall",
        label: "Оформление боковины",
        values: [
          { id: "black", label: "Чёрные буквы", color: "#22211f" },
          { id: "white", label: "Белые буквы", color: "#e8e5df", priceDelta: 600 },
        ],
      },
    ],
    lighting: [
      {
        id: "beam",
        label: "Световой пучок",
        values: [
          { id: "combo", label: "Комбинированный" },
          { id: "spot", label: "Дальний" },
          { id: "flood", label: "Рабочий" },
        ],
      },
      {
        id: "temperature",
        label: "Температура света",
        values: [
          { id: "4000k", label: "4000 K" },
          { id: "5000k", label: "5000 K" },
          { id: "6000k", label: "6000 K", available: false },
        ],
      },
    ],
    "roof-racks": [
      {
        id: "finish",
        label: "Цвет",
        values: [
          { id: "black", label: "Чёрный", color: "#1a1a18" },
          { id: "graphite", label: "Графит", color: "#555653" },
          { id: "silver", label: "Серебро", color: "#b8b9b5", priceDelta: 1900 },
        ],
      },
    ],
    apparel: [
      {
        id: "color",
        label: "Цвет",
        values: [
          { id: "khaki", label: "Хаки", color: "#69674e" },
          { id: "black", label: "Чёрный", color: "#1b1b19" },
          { id: "orange", label: "Оранжевый", color: "#e84e00", available: false },
        ],
      },
    ],
    communication: [
      {
        id: "bundle",
        label: "Комплектация",
        values: [
          { id: "base", label: "Базовая" },
          { id: "travel", label: "Экспедиционная", priceDelta: 5900 },
        ],
      },
      {
        id: "mount",
        label: "Крепление",
        values: [
          { id: "standard", label: "Стандартное" },
          { id: "ram", label: "RAM Mount", priceDelta: 3400 },
        ],
      },
    ],
  };

  options.push(...(categoryOptions[category] ?? []));
  return options;
}

export function ProductPage() {
  const { category, id } = useParams();
  const navigate = useNavigate();
  const { add, items } = useCart();
  const cat = getCategoryBySlug(category ?? "");
  const product = getProductById(category ?? "", Number(id));
  const offerOptions = getOfferOptions(category ?? "", product);

  const [activeImg, setActiveImg] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() =>
    Object.fromEntries(offerOptions.map((option) => [option.id, option.values.find((value) => value.available !== false)?.id ?? option.values[0].id])),
  );
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [helpfulVoted, setHelpfulVoted] = useState<Set<number>>(new Set());
  const [reviewFilter, setReviewFilter] = useState<number | null>(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    setSelectedOptions(
      Object.fromEntries(offerOptions.map((option) => [option.id, option.values.find((value) => value.available !== false)?.id ?? option.values[0].id])),
    );
    setQty(1);
    setActiveImg(0);
  }, [product?.id]);

  if (!product || !cat) { navigate("/catalog"); return null; }

  const selectedValues = offerOptions.map((option) => ({
    option,
    value: option.values.find((value) => value.id === selectedOptions[option.id]) ?? option.values[0],
  }));
  const currentPrice = product.price + selectedValues.reduce((sum, item) => sum + (item.value.priceDelta ?? 0), 0);
  const currentOldPrice = product.oldPrice
    ? product.oldPrice + selectedValues.reduce((sum, item) => sum + (item.value.priceDelta ?? 0), 0)
    : undefined;
  const offerAvailable = product.inStock && selectedValues.every((item) => item.value.available !== false);
  const offerName = selectedValues.map((item) => `${item.option.label}: ${item.value.label}`).join(" · ");
  const offerSku = `${product.id}-${selectedValues.map((item) => item.value.id).join("-")}`.toUpperCase();
  const inCart = items.some(i => i.id === product.id && i.variant === offerName);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      add({ id: product.id, categorySlug: cat.slug, name: product.name, price: currentPrice, img: product.img, variant: offerName });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const related = cat.products.filter(p => p.id !== product.id).slice(0, 3);
  const avgRating = (MOCK_REVIEWS.reduce((s, r) => s + r.rating, 0) / MOCK_REVIEWS.length).toFixed(1);
  const filteredReviews = reviewFilter ? MOCK_REVIEWS.filter(r => r.rating === reviewFilter) : MOCK_REVIEWS;
  const visibleReviews = showAllReviews ? filteredReviews : filteredReviews.slice(0, 3);

  return (
    <div style={{ background: "#f5f2ee", minHeight: "100vh" }}>
      {/* breadcrumb */}
      <div style={{ background: "#fff", borderBottom: "1px solid #ece8e3" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <button onClick={() => navigate("/catalog")} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa49e", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Экипировка</button>
          <svg width="6" height="10" viewBox="0 0 8 12" fill="none" stroke="#d6d0c8" strokeWidth="1.5"><path d="M1 1l6 5-6 5" strokeLinecap="round"/></svg>
          <button onClick={() => navigate(`/catalog/${cat.slug}`)} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa49e", background: "none", border: "none", cursor: "pointer", padding: 0 }}>{cat.name}</button>
          <svg width="6" height="10" viewBox="0 0 8 12" fill="none" stroke="#d6d0c8" strokeWidth="1.5"><path d="M1 1l6 5-6 5" strokeLinecap="round"/></svg>
          <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#1a1612" }}>{product.name}</span>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 48, marginBottom: 60 }}>

          {/* LEFT — gallery */}
          <div>
            <div style={{ position: "relative", overflow: "hidden", background: "#fff", border: "1px solid #ece8e3", aspectRatio: "4/3", marginBottom: 12 }}>
              <img src={product.imgs[activeImg] ?? product.img} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              {product.badge && (
                <div style={{ position: "absolute", top: 16, left: 16 }}>
                  <span style={{ background: product.badgeColor || "#e84e00", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff", padding: "5px 12px" }}>{product.badge}</span>
                </div>
              )}
            </div>
            {product.imgs.length > 1 && (
              <div style={{ display: "flex", gap: 8 }}>
                {product.imgs.map((src, i) => (
                  <div key={i} onClick={() => setActiveImg(i)} style={{ width: 80, height: 60, overflow: "hidden", cursor: "pointer", border: `2px solid ${activeImg === i ? "#e84e00" : "transparent"}`, background: "#fff" }}>
                    <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — details */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: cat.accent, marginBottom: 6 }}>{product.brand}</div>
              <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 32, letterSpacing: "0.04em", textTransform: "uppercase", color: "#1a1612", lineHeight: 1.05, margin: "0 0 12px" }}>{product.name}</h1>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Stars value={product.rating}/>
                <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 14, color: "#1a1612" }}>{product.rating}</span>
                <button onClick={() => document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth" })}
                  style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12, color: "#e84e00", background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline", textDecorationColor: "rgba(232,78,0,0.3)" }}>
                  {product.reviews} отзывов
                </button>
              </div>
            </div>

            {/* price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 36, color: "#1a1612" }}>{currentPrice.toLocaleString("ru")} ₽</span>
              {currentOldPrice && <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 18, color: "#aaa49e", textDecoration: "line-through" }}>{currentOldPrice.toLocaleString("ru")} ₽</span>}
            </div>

            {/* stock */}
            <div className="product-offer-status">
              <div>
                <i className={offerAvailable ? "is-available" : ""} />
                <span>{offerAvailable ? "В наличии" : "Нет в выбранном варианте"}</span>
              </div>
              <em>Арт. {offerSku}</em>
            </div>

            {/* offers */}
            {offerOptions.length > 0 && (
              <div className="product-offer-selector">
                <div className="product-offer-heading">
                  <strong>Выберите вариант</strong>
                  <span>Цена и наличие обновятся автоматически</span>
                </div>
                {offerOptions.map((option) => (
                  <div className="product-offer-group" key={option.id}>
                    <div className="product-offer-label">
                      <span>{option.label}</span>
                      <b>{option.values.find((value) => value.id === selectedOptions[option.id])?.label}</b>
                    </div>
                    <div className="product-offer-values">
                      {option.values.map((value) => {
                        const selected = selectedOptions[option.id] === value.id;
                        return (
                          <button
                            key={value.id}
                            className={`${selected ? "is-selected" : ""} ${value.color ? "has-color" : ""}`}
                            disabled={value.available === false}
                            onClick={() => setSelectedOptions((current) => ({ ...current, [option.id]: value.id }))}
                          >
                            {value.color && <i style={{ background: value.color }} />}
                            <span>{value.label}</span>
                            {value.priceDelta ? <small>{value.priceDelta > 0 ? "+" : "−"} {Math.abs(value.priceDelta).toLocaleString("ru")} ₽</small> : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <div className="product-offer-summary">
                  <span>Выбрано</span>
                  <strong>{selectedValues.map((item) => item.value.label).join(" / ")}</strong>
                </div>
              </div>
            )}

            {/* qty + add */}
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", border: "1px solid #e0dbd4" }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 36, height: 44, background: "none", border: "none", cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontSize: 18, color: "#6b6357" }}>−</button>
                <span style={{ width: 40, textAlign: "center", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 16, color: "#1a1612" }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ width: 36, height: 44, background: "none", border: "none", cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontSize: 18, color: "#6b6357" }}>+</button>
              </div>
              <button onClick={handleAdd} disabled={!offerAvailable}
                style={{ flex: 1, padding: "13px 0", border: "none", cursor: offerAvailable ? "pointer" : "not-allowed", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "0.16em", textTransform: "uppercase", color: "#fff", background: added ? "#3a9e5f" : offerAvailable ? "#e84e00" : "#d6d0c8", transition: "background 0.2s" }}>
                {added ? "✓ Добавлено в корзину" : inCart ? "Добавить ещё" : "В корзину"}
              </button>
            </div>
            <button onClick={() => { handleAdd(); navigate("/checkout"); }} disabled={!offerAvailable}
              style={{ padding: "13px 0", border: "1px solid #1a1612", background: "transparent", cursor: offerAvailable ? "pointer" : "not-allowed", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "0.16em", textTransform: "uppercase", color: "#1a1612", transition: "all 0.15s", opacity: offerAvailable ? 1 : .45 }}
              onMouseEnter={e => { if(offerAvailable) { (e.currentTarget as HTMLButtonElement).style.background="#1a1612"; (e.currentTarget as HTMLButtonElement).style.color="#fff"; }}}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background="transparent"; (e.currentTarget as HTMLButtonElement).style.color="#1a1612"; }}
            >
              Купить сейчас
            </button>

            {/* ── SELLER BLOCK ── */}
            <div style={{ border: "1px solid #ece8e3", background: "#fff", overflow: "hidden" }}>
              <div style={{ padding: "14px 16px", borderBottom: "1px solid #f5f2ee", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, overflow: "hidden", flexShrink: 0, background: "#f5f2ee", border: "1px solid #ece8e3" }}>
                  <img src={MOCK_SELLER.logo} alt={MOCK_SELLER.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase", color: "#1a1612" }}>{MOCK_SELLER.name}</span>
                    {MOCK_SELLER.verified && (
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="#3a9e5f"/><path d="M4.5 8l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Stars value={MOCK_SELLER.rating} size={11}/>
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.1em", color: "#aaa49e" }}>{MOCK_SELLER.rating} · {MOCK_SELLER.reviewCount.toLocaleString("ru")} отзывов</span>
                  </div>
                </div>
                <button onClick={() => navigate("/seller")}
                  style={{ padding: "7px 14px", border: "1px solid #e5e0d8", background: "transparent", cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6b6357", flexShrink: 0 }}>
                  В магазин
                </button>
              </div>
              <div style={{ padding: "10px 16px", display: "flex", gap: 20 }}>
                {[
                  { label: "Продаж", value: MOCK_SELLER.sales.toLocaleString("ru") },
                  { label: "На площадке с", value: MOCK_SELLER.since },
                  { label: "Отправка", value: MOCK_SELLER.dispatch },
                ].map(item => (
                  <div key={item.label} style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c0b9b0", marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 11, color: "#1a1612", letterSpacing: "0.04em" }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* description */}
            <div style={{ paddingTop: 4, borderTop: "1px solid #f0ece8" }}>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#aaa49e", marginBottom: 8 }}>Описание</div>
              <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 14, lineHeight: 1.75, color: "#4a443e", margin: 0 }}>{product.description}</p>
            </div>
          </div>
        </div>

        {/* specs */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 26, letterSpacing: "0.06em", textTransform: "uppercase", color: "#1a1612", marginBottom: 20 }}>Характеристики</div>
          <div style={{ background: "#fff", border: "1px solid #ece8e3" }}>
            {product.specs.map((s, i) => (
              <div key={s.label} style={{ display: "flex", borderBottom: i < product.specs.length - 1 ? "1px solid #f5f2ee" : "none" }}>
                <div style={{ width: 220, flexShrink: 0, padding: "14px 20px", background: "#faf8f5", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b6357" }}>{s.label}</div>
                <div style={{ padding: "14px 20px", fontFamily: "'Barlow',sans-serif", fontSize: 14, color: "#1a1612" }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* services */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, marginBottom: 20 }}>
            <div>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", color: "#e84e00", marginBottom: 4, fontWeight: 700 }}>Установка и настройка</div>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 26, letterSpacing: "0.06em", textTransform: "uppercase", color: "#1a1612" }}>Автосервисы рядом</div>
            </div>
            <button onClick={() => navigate("/services")} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#e84e00" }}>Все автосервисы →</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {AUTO_SERVICES.map(service => (
              <div key={service.slug} onClick={() => navigate(`/services/${service.slug}`)} style={{ display: "grid", gridTemplateColumns: "112px 1fr", background: "#fff", border: "1px solid #ece8e3", overflow: "hidden", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "#e84e00"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "#ece8e3"}>
                <img src={service.image} alt={service.name} style={{ width: "100%", height: "100%", minHeight: 126, objectFit: "cover" }} />
                <div style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start" }}>
                    <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 16, letterSpacing: "0.04em", textTransform: "uppercase", color: "#1a1612" }}>{service.name}</div>
                    <span style={{ flexShrink: 0, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 12, color: "#e84e00" }}>★ {service.rating}</span>
                  </div>
                  <div style={{ marginTop: 6, fontFamily: "'Barlow',sans-serif", fontSize: 11, lineHeight: 1.5, color: "#8c8078" }}>{service.city}, {service.address}</div>
                  <div style={{ marginTop: 10, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6b6357" }}>Установка от {service.services[0].price.replace("от ", "")}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── REVIEWS BLOCK ── */}
        <div id="reviews" style={{ marginBottom: 56 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", color: "#e84e00", marginBottom: 4, fontWeight: 700 }}>Покупатели</div>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 26, letterSpacing: "0.06em", textTransform: "uppercase", color: "#1a1612" }}>Отзывы о товаре</div>
            </div>
            <button style={{ padding: "10px 20px", background: "#e84e00", border: "none", cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#fff" }}>
              Написать отзыв
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 32, alignItems: "start" }}>

            {/* rating summary */}
            <div style={{ background: "#fff", border: "1px solid #ece8e3", padding: "24px 24px" }}>
              <div style={{ textAlign: "center", marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid #f5f2ee" }}>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 56, color: "#1a1612", lineHeight: 1 }}>{avgRating}</div>
                <Stars value={Number(avgRating)} size={16}/>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa49e", marginTop: 6 }}>{MOCK_REVIEWS.length} отзыва</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {RATING_DIST.map(d => (
                  <button key={d.stars} onClick={() => setReviewFilter(reviewFilter === d.stars ? null : d.stars)}
                    style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: "2px 0" }}>
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 11, color: reviewFilter === d.stars ? "#e84e00" : "#6b6357", width: 8, textAlign: "right", flexShrink: 0 }}>{d.stars}</span>
                    <svg width="10" height="10" viewBox="0 0 12 12" fill={reviewFilter === d.stars ? "#e84e00" : "#d6d0c8"}><path d="M6 1l1.35 2.74L10.5 4.27l-2.25 2.19.53 3.09L6 8l-2.78 1.55.53-3.09L1.5 4.27l3.15-.53L6 1z"/></svg>
                    <div style={{ flex: 1, height: 6, background: "#f0ece8", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${d.pct}%`, background: reviewFilter === d.stars ? "#e84e00" : "#c0b9b0", transition: "width 0.3s" }}/>
                    </div>
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, color: "#aaa49e", width: 28, textAlign: "right", flexShrink: 0 }}>{d.pct}%</span>
                  </button>
                ))}
              </div>
              {reviewFilter && (
                <button onClick={() => setReviewFilter(null)}
                  style={{ marginTop: 14, width: "100%", padding: "8px 0", border: "1px solid #e84e00", background: "transparent", cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#e84e00" }}>
                  Сбросить фильтр
                </button>
              )}
            </div>

            {/* review list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {visibleReviews.map(r => (
                <div key={r.id} style={{ background: "#fff", border: "1px solid #ece8e3", padding: "20px 24px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "1px solid #ece8e3" }}>
                      <img src={r.avatar} alt={r.author} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                        <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 13, letterSpacing: "0.04em", textTransform: "uppercase", color: "#1a1612" }}>{r.author}</span>
                        {r.verified && (
                          <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "'Barlow Condensed',sans-serif", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: "#3a9e5f" }}>
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="6" fill="#3a9e5f"/><path d="M3 6l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            Покупатель
                          </span>
                        )}
                        <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.1em", color: "#c0b9b0", marginLeft: "auto" }}>{r.date}</span>
                      </div>
                      <Stars value={r.rating} size={12}/>
                    </div>
                  </div>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 14, letterSpacing: "0.04em", textTransform: "uppercase", color: "#1a1612", marginBottom: 8 }}>{r.title}</div>
                  <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 13, lineHeight: 1.75, color: "#5a544e", margin: "0 0 12px" }}>{r.body}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      {r.tags.map(t => (
                        <span key={t} style={{ background: "#f5f2ee", border: "1px solid #e5e0d8", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 8, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8c8480", padding: "3px 9px" }}>{t}</span>
                      ))}
                    </div>
                    <button onClick={() => setHelpfulVoted(s => { const n = new Set(s); n.has(r.id) ? n.delete(r.id) : n.add(r.id); return n; })}
                      style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: helpfulVoted.has(r.id) ? "#e84e00" : "#aaa49e", padding: 0 }}>
                      <svg width="13" height="12" viewBox="0 0 14 13" fill={helpfulVoted.has(r.id) ? "#e84e00" : "none"} stroke={helpfulVoted.has(r.id) ? "#e84e00" : "#aaa49e"} strokeWidth="1.4"><path d="M1 6h2v6H1zM5 6l2-5a2 2 0 0 1 2 2v2h3l-1 5H5V6z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Полезно · {r.helpful + (helpfulVoted.has(r.id) ? 1 : 0)}
                    </button>
                  </div>
                </div>
              ))}

              {filteredReviews.length > 3 && (
                <button onClick={() => setShowAllReviews(s => !s)}
                  style={{ padding: "12px 0", border: "1px solid #e5e0d8", background: "#fff", cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#6b6357" }}>
                  {showAllReviews ? "Свернуть" : `Показать все ${filteredReviews.length} отзыва`}
                </button>
              )}

              {filteredReviews.length === 0 && (
                <div style={{ background: "#fff", border: "1px solid #ece8e3", padding: "40px 24px", textAlign: "center", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c0b9b0" }}>
                  Нет отзывов с оценкой {reviewFilter} ★
                </div>
              )}
            </div>
          </div>
        </div>

        {/* related */}
        {related.length > 0 && (
          <div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 26, letterSpacing: "0.06em", textTransform: "uppercase", color: "#1a1612", marginBottom: 20 }}>Похожие товары</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16 }}>
              {related.map(p => (
                <div key={p.id} onClick={() => navigate(`/catalog/${cat.slug}/${p.id}`)} style={{ background: "#fff", border: "1px solid #ece8e3", overflow: "hidden", cursor: "pointer", transition: "border-color 0.15s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "#e84e00"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "#ece8e3"}
                >
                  <div style={{ height: 160, overflow: "hidden", background: "#f5f2ee" }}>
                    <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ padding: "14px 16px" }}>
                    <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 14, letterSpacing: "0.04em", textTransform: "uppercase", color: "#1a1612", marginBottom: 4 }}>{p.name}</div>
                    <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 18, color: "#e84e00" }}>{p.price.toLocaleString("ru")} ₽</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
