import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { useCart } from "../context/CartContext";

// ── Mock sellers ──────────────────────────────────────────────
// In a real app this would come from product data.
// We assign sellers deterministically by item id parity + brand guess.
const SELLER_MAP: Record<number, { id: string; name: string; rating: number; logo: string }> = {
  1: { id: "s1", name: "ARB Official Store", rating: 4.9, logo: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=48&h=48&fit=crop&auto=format" },
  2: { id: "s1", name: "ARB Official Store", rating: 4.9, logo: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=48&h=48&fit=crop&auto=format" },
  3: { id: "s2", name: "OffRoad Parts", rating: 4.7, logo: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=48&h=48&fit=crop&auto=format" },
  4: { id: "s2", name: "OffRoad Parts", rating: 4.7, logo: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=48&h=48&fit=crop&auto=format" },
  5: { id: "s3", name: "Ironman 4x4 Russia", rating: 4.8, logo: "https://images.unsplash.com/photo-1519245659620-e859806a8d3b?w=48&h=48&fit=crop&auto=format" },
};
const DEFAULT_SELLER = { id: "s3", name: "Ironman 4x4 Russia", rating: 4.8, logo: "https://images.unsplash.com/photo-1519245659620-e859806a8d3b?w=48&h=48&fit=crop&auto=format" };

type DeliveryAction = "pickup_modal" | "address_input" | null;
const DELIVERY_OPTIONS: { id: string; label: string; short: string; detail: string; price: number; action: DeliveryAction }[] = [
  { id: "cdek_pickup",    label: "СДЭК ПВЗ",        short: "СДЭК ПВЗ",   detail: "3–7 дн",  price: 0,   action: "pickup_modal"  },
  { id: "cdek_courier",   label: "СДЭК курьер",      short: "СДЭК курьер",detail: "3–7 дн",  price: 400, action: "address_input" },
  { id: "moscow_courier", label: "Курьер по Москве", short: "Курьер МСК", detail: "1–2 дня", price: 300, action: "address_input" },
  { id: "post",           label: "Почта России",     short: "Почта",      detail: "7–14 дн", price: 200, action: "address_input" },
];

// Mock СДЭК pickup points
const CDEK_POINTS = [
  { id: "p1", name: "СДЭК на Арбате",          address: "Москва, ул. Арбат, 24",             hours: "9:00–21:00", dist: "0.4 км" },
  { id: "p2", name: "СДЭК Смоленская",         address: "Москва, Смоленская пл., 3",          hours: "8:00–22:00", dist: "1.1 км" },
  { id: "p3", name: "СДЭК Киевская",           address: "Москва, пл. Киевского вокзала, 2",   hours: "8:00–21:00", dist: "2.3 км" },
  { id: "p4", name: "СДЭК Парк Победы",        address: "Москва, Кутузовский пр-т, 57",       hours: "9:00–20:00", dist: "3.0 км" },
  { id: "p5", name: "СДЭК Можайская",          address: "Москва, ул. Можайский вал, 6",       hours: "10:00–20:00",dist: "3.8 км" },
];

function PickupModal({ onClose, onSelect, selected }: { onClose: () => void; onSelect: (id: string, label: string) => void; selected: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(10,8,6,0.72)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div ref={ref} style={{ background: "#fff", width: "100%", maxWidth: 480, maxHeight: "92vh", overflowY: "auto", position: "relative" }}>
        <div style={{ background: "#1a1612", padding: "20px 24px", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "#e84e00" }} />
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)", marginBottom: 3 }}>СДЭК</div>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 20, letterSpacing: "0.04em", textTransform: "uppercase", color: "#fff", paddingRight: 32 }}>Выбрать пункт выдачи</div>
          <button onClick={onClose} style={{ position: "absolute", top: 16, right: 18, background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.45)", fontSize: 20, lineHeight: 1, padding: 4 }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "#fff"}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.45)"}
          >✕</button>
        </div>
        <div style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
          {CDEK_POINTS.map(p => (
            <div key={p.id} onClick={() => { onSelect(p.id, p.name + " — " + p.address); onClose(); }}
              style={{ padding: "14px 16px", border: `1.5px solid ${selected === p.id ? "#e84e00" : "#ece8e3"}`, background: selected === p.id ? "#fff9f7" : "#fff", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 12, transition: "border-color 0.13s" }}
              onMouseEnter={e => { if (selected !== p.id) (e.currentTarget as HTMLDivElement).style.borderColor = "#c0b0a4"; }}
              onMouseLeave={e => { if (selected !== p.id) (e.currentTarget as HTMLDivElement).style.borderColor = "#ece8e3"; }}
            >
              <div style={{ width: 16, height: 16, border: `2px solid ${selected === p.id ? "#e84e00" : "#d6d0c8"}`, borderRadius: "50%", flexShrink: 0, marginTop: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {selected === p.id && <div style={{ width: 7, height: 7, background: "#e84e00", borderRadius: "50%" }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 13, letterSpacing: "0.04em", textTransform: "uppercase", color: "#1a1612", marginBottom: 3 }}>{p.name}</div>
                <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 12, color: "#6b6357", marginBottom: 4 }}>{p.address}</div>
                <div style={{ display: "flex", gap: 12 }}>
                  <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#aaa49e" }}>{p.hours}</span>
                  <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#aaa49e" }}>· {p.dist}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Mock address suggestions
const ADDRESS_SUGGESTIONS = [
  "Москва, ул. Тверская, 1",
  "Москва, ул. Арбат, 24",
  "Москва, Кутузовский пр-т, 32",
  "Москва, ул. Новый Арбат, 19",
  "Москва, Ленинградский пр-т, 80",
];

function AddressModal({ initial, onClose, onSelect }: { initial: string; onClose: () => void; onSelect: (addr: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(initial);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [pinPos, setPinPos] = useState({ x: 50, y: 42 });
  const [fullscreen, setFullscreen] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose]);

  useEffect(() => {
    if (query.length > 2) setSuggestions(ADDRESS_SUGGESTIONS.filter(a => a.toLowerCase().includes(query.toLowerCase())));
    else setSuggestions([]);
  }, [query]);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPinPos({ x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) });
    setQuery("Москва, выбранная точка на карте");
    setSuggestions([]);
  };

  const confirm = () => { if (query.trim()) { onSelect(query.trim()); onClose(); } };

  const iS: React.CSSProperties = { width: "100%", padding: "11px 14px", border: "1px solid #e0dbd4", outline: "none", fontFamily: "'Barlow',sans-serif", fontSize: 14, color: "#1a1612", background: "#fff", boxSizing: "border-box" };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(10,8,6,0.72)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div ref={ref} style={{ background: "#fff", width: "100%", maxWidth: fullscreen ? "100%" : 560, maxHeight: fullscreen ? "100vh" : "92vh", height: fullscreen ? "100vh" : undefined, overflowY: "auto", position: "relative", display: "flex", flexDirection: "column", transition: "max-width 0.2s, max-height 0.2s" }}>

        {/* header */}
        <div style={{ background: "#1a1612", padding: "20px 24px", position: "relative", flexShrink: 0 }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "#e84e00" }} />
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)", marginBottom: 3 }}>Доставка</div>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 20, letterSpacing: "0.04em", textTransform: "uppercase", color: "#fff", paddingRight: 72 }}>Адрес доставки</div>
          <div style={{ position: "absolute", top: 16, right: 18, display: "flex", alignItems: "center", gap: 4 }}>
            <button onClick={() => setFullscreen(f => !f)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.45)", padding: 4, display: "flex", alignItems: "center", justifyContent: "center" }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "#fff"}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.45)"}
              title={fullscreen ? "Свернуть" : "Развернуть"}
            >
              {fullscreen ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M6 2H2v4M10 2h4v4M6 14H2v-4M10 14h4v-4"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4"/>
                </svg>
              )}
            </button>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.45)", fontSize: 20, lineHeight: 1, padding: 4 }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "#fff"}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.45)"}
            >✕</button>
          </div>
        </div>

        {/* map */}
        <div ref={mapRef} onClick={handleMapClick}
          style={{ height: fullscreen ? "calc(100vh - 260px)" : 260, background: "#e8e4dc", position: "relative", cursor: "crosshair", flexShrink: 0, overflow: "hidden", transition: "height 0.2s" }}
        >
          {/* fake map tile grid */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(#d8d3c9 1px, transparent 1px), linear-gradient(90deg, #d8d3c9 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          {/* fake roads */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 560 260" preserveAspectRatio="none">
            <path d="M0 130 Q140 110 280 130 Q420 150 560 130" stroke="#c8c2b4" strokeWidth="8" fill="none"/>
            <path d="M0 130 Q140 110 280 130 Q420 150 560 130" stroke="#fff" strokeWidth="4" fill="none"/>
            <path d="M200 0 Q210 65 200 130 Q190 195 200 260" stroke="#c8c2b4" strokeWidth="6" fill="none"/>
            <path d="M200 0 Q210 65 200 130 Q190 195 200 260" stroke="#fff" strokeWidth="3" fill="none"/>
            <path d="M350 0 L360 260" stroke="#c8c2b4" strokeWidth="5" fill="none"/>
            <path d="M350 0 L360 260" stroke="#fff" strokeWidth="2.5" fill="none"/>
            <path d="M0 60 L560 55" stroke="#c8c2b4" strokeWidth="4" fill="none"/>
            <path d="M0 60 L560 55" stroke="#fff" strokeWidth="2" fill="none"/>
            <rect x="80" y="80" width="60" height="35" rx="2" fill="#d0cab8"/>
            <rect x="260" y="50" width="50" height="60" rx="2" fill="#d0cab8"/>
            <rect x="390" y="145" width="80" height="45" rx="2" fill="#d0cab8"/>
            <rect x="420" y="40" width="40" height="30" rx="2" fill="#d0cab8"/>
            <rect x="80" y="165" width="45" height="50" rx="2" fill="#d0cab8"/>
          </svg>
          {/* label */}
          <div style={{ position: "absolute", top: 10, left: 12, background: "rgba(255,255,255,0.85)", padding: "4px 10px", fontFamily: "'Barlow Condensed',sans-serif", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#6b6357" }}>Нажмите на карту для выбора точки</div>
          {/* pin */}
          <div style={{ position: "absolute", left: `${pinPos.x}%`, top: `${pinPos.y}%`, transform: "translate(-50%, -100%)", pointerEvents: "none", transition: "left 0.15s, top 0.15s" }}>
            <svg width="28" height="36" viewBox="0 0 28 36" fill="none">
              <path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 22 14 22S28 23.333 28 14C28 6.268 21.732 0 14 0z" fill="#e84e00"/>
              <circle cx="14" cy="14" r="6" fill="white"/>
            </svg>
          </div>
        </div>

        {/* address input + suggestions */}
        <div style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="#aaa49e" strokeWidth="1.6"><circle cx="8" cy="8" r="5.5"/><path d="M12.5 12.5l3.5 3.5" strokeLinecap="round"/></svg>
            </div>
            <input
              value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Введите адрес…"
              style={{ ...iS, paddingLeft: 38 }}
              onFocus={e => (e.target as HTMLInputElement).style.borderColor = "#e84e00"}
              onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#e0dbd4"}
              autoFocus
            />
          </div>

          {suggestions.length > 0 && (
            <div style={{ border: "1px solid #ece8e3", overflow: "hidden" }}>
              {suggestions.map((s, i) => (
                <div key={s} onClick={() => { setQuery(s); setSuggestions([]); setPinPos({ x: 30 + i * 12, y: 35 + i * 8 }); }}
                  style={{ padding: "10px 14px", cursor: "pointer", borderBottom: i < suggestions.length - 1 ? "1px solid #f5f2ee" : "none", fontFamily: "'Barlow',sans-serif", fontSize: 13, color: "#1a1612", display: "flex", alignItems: "center", gap: 10, background: "#fff" }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "#fdf9f6"}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "#fff"}
                >
                  <svg width="12" height="14" viewBox="0 0 14 18" fill="none" stroke="#e84e00" strokeWidth="1.6"><path d="M7 1C4.239 1 2 3.239 2 6c0 4.667 5 11 5 11s5-6.333 5-11c0-2.761-2.239-5-5-5z"/><circle cx="7" cy="6" r="2"/></svg>
                  {s}
                </div>
              ))}
            </div>
          )}

          <button onClick={confirm}
            style={{ padding: "13px 0", background: "#e84e00", border: "none", cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff" }}>
            Подтвердить адрес
          </button>
        </div>
      </div>
    </div>
  );
}

// Mock current user (authorized)
const CURRENT_USER = { name: "Алексей Морозов", phone: "+7 (916) 234-56-78", email: "morozov@mail.ru", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&h=80&fit=crop&auto=format&face" };

function EditRecipientModal({ user, onClose, onSave }: {
  user: typeof CURRENT_USER;
  onClose: () => void;
  onSave: (u: typeof CURRENT_USER) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState(user);
  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose]);

  const iS: React.CSSProperties = { width: "100%", padding: "10px 13px", border: "1px solid #e0dbd4", outline: "none", fontFamily: "'Barlow',sans-serif", fontSize: 14, color: "#1a1612", background: "#fff", boxSizing: "border-box" };
  const lS: React.CSSProperties = { fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", color: "#aaa49e", display: "block", marginBottom: 5 };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(10,8,6,0.72)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div ref={ref} style={{ background: "#fff", width: "100%", maxWidth: 440, position: "relative" }}>
        <div style={{ background: "#1a1612", padding: "20px 24px", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "#e84e00" }} />
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)", marginBottom: 3 }}>Оформление заказа</div>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 20, letterSpacing: "0.04em", textTransform: "uppercase", color: "#fff", paddingRight: 36 }}>Данные получателя</div>
          <button onClick={onClose} style={{ position: "absolute", top: 16, right: 18, background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.45)", fontSize: 20, lineHeight: 1, padding: 4 }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "#fff"}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.45)"}
          >✕</button>
        </div>
        <div style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={lS}>Имя и фамилия</label>
            <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Иван Морозов" style={iS}
              onFocus={e => (e.target as HTMLInputElement).style.borderColor = "#e84e00"}
              onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#e0dbd4"} />
          </div>
          <div>
            <label style={lS}>Телефон</label>
            <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+7 (916) 000-00-00" style={iS}
              onFocus={e => (e.target as HTMLInputElement).style.borderColor = "#e84e00"}
              onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#e0dbd4"} />
          </div>
          <div>
            <label style={lS}>Email</label>
            <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="ivan@mail.ru" style={iS}
              onFocus={e => (e.target as HTMLInputElement).style.borderColor = "#e84e00"}
              onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#e0dbd4"} />
          </div>
          <button onClick={() => { onSave(form); onClose(); }}
            style={{ padding: "13px 0", background: "#e84e00", border: "none", cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff", marginTop: 4 }}>
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}

const PAY = [
  {
    id: "card", label: "Картой онлайн", sub: "Visa, MC, МИР",
    icon: (
      <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
        <rect x="0.5" y="0.5" width="27" height="19" rx="2.5" stroke="currentColor" strokeOpacity="0.2"/>
        <rect y="5" width="28" height="4" fill="currentColor" fillOpacity="0.15"/>
        <rect x="3" y="13" width="8" height="2" rx="1" fill="currentColor" fillOpacity="0.4"/>
        <rect x="13" y="13" width="4" height="2" rx="1" fill="currentColor" fillOpacity="0.4"/>
        <circle cx="21" cy="10" r="3" fill="currentColor" fillOpacity="0.35"/>
        <circle cx="24" cy="10" r="3" fill="currentColor" fillOpacity="0.55"/>
      </svg>
    ),
  },
  {
    id: "sbp", label: "СБП", sub: "Система быстрых платежей",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M4 7l5 3-5 3V7z" fill="currentColor" fillOpacity="0.6"/>
        <path d="M4 7l8 2V4L4 7z" fill="currentColor" fillOpacity="0.9"/>
        <path d="M4 13l8 2v-4l-8 2z" fill="currentColor" fillOpacity="0.75"/>
        <path d="M12 9v6l8-3-8-3z" fill="currentColor" fillOpacity="0.5"/>
      </svg>
    ),
  },
  {
    id: "cash", label: "Наличными", sub: "При получении курьеру",
    icon: (
      <svg width="26" height="18" viewBox="0 0 26 18" fill="none">
        <rect x="0.5" y="0.5" width="25" height="17" rx="2.5" stroke="currentColor" strokeOpacity="0.25"/>
        <circle cx="13" cy="9" r="4" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7"/>
        <path d="M13 6.5v1M13 10.5v1M11 9h.5a1.5 1.5 0 0 0 0-3H11v5M11 7.5h1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.7"/>
        <rect x="2" y="2" width="3" height="2" rx="0.5" fill="currentColor" fillOpacity="0.3"/>
        <rect x="21" y="14" width="3" height="2" rx="0.5" fill="currentColor" fillOpacity="0.3"/>
      </svg>
    ),
  },
  {
    id: "invoice", label: "Счёт", sub: "Для юридических лиц",
    icon: (
      <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
        <path d="M2 1h11l5 5v17a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.2"/>
        <path d="M13 1v5h5" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.2"/>
        <rect x="4" y="10" width="12" height="1.5" rx="0.75" fill="currentColor" fillOpacity="0.4"/>
        <rect x="4" y="13" width="9" height="1.5" rx="0.75" fill="currentColor" fillOpacity="0.4"/>
        <rect x="4" y="16" width="6" height="1.5" rx="0.75" fill="currentColor" fillOpacity="0.4"/>
      </svg>
    ),
  },
];

const inp: React.CSSProperties = { width: "100%", padding: "11px 14px", border: "1px solid #e0dbd4", outline: "none", fontFamily: "'Barlow',sans-serif", fontSize: 14, color: "#1a1612", background: "#fff", boxSizing: "border-box" };
const lbl: React.CSSProperties = { display: "block", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", color: "#aaa49e", marginBottom: 6 };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ display: "flex", flexDirection: "column" }}><label style={lbl}>{label}</label>{children}</div>;
}

function RadioCard({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", border: `1px solid ${selected ? "#e84e00" : "#ece8e3"}`, background: selected ? "#fff9f7" : "#fff", cursor: "pointer", transition: "all 0.13s" }}>
      <div style={{ width: 16, height: 16, border: `2px solid ${selected ? "#e84e00" : "#d6d0c8"}`, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {selected && <div style={{ width: 7, height: 7, background: "#e84e00", borderRadius: "50%" }} />}
      </div>
      {children}
    </div>
  );
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total, setQty, remove, clear } = useCart();

  const [recipient, setRecipient] = useState(CURRENT_USER);
  const [showEditRecipient, setShowEditRecipient] = useState(false);
  const [form, setForm] = useState({ address: "", comment: "" });
  const [sellerDelivery, setSellerDelivery] = useState<Record<string, string>>({});
  const [sellerAddress, setSellerAddress] = useState<Record<string, string>>({});
  const [sellerPickup, setSellerPickup] = useState<Record<string, string>>({});    // sid → point label
  const [sellerPickupId, setSellerPickupId] = useState<Record<string, string>>({});// sid → point id
  const [pickupModal, setPickupModal] = useState<string | null>(null);              // sid currently choosing pickup
  const [addressModal, setAddressModal] = useState<string | null>(null);            // sid currently choosing address
  const [pay, setPay] = useState("card");
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [success, setSuccess] = useState(false);

  const setF = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  // group items by seller
  const bySeller = items.reduce<Record<string, { seller: typeof DEFAULT_SELLER; items: typeof items }>>((acc, item) => {
    const seller = SELLER_MAP[item.id] ?? DEFAULT_SELLER;
    if (!acc[seller.id]) acc[seller.id] = { seller, items: [] };
    acc[seller.id].items.push(item);
    return acc;
  }, {});

  const getDelivery = (sid: string) => sellerDelivery[sid] ?? DELIVERY_OPTIONS[0].id;
  const getDeliveryCost = (sid: string) => DELIVERY_OPTIONS.find(d => d.id === getDelivery(sid))?.price ?? 0;

  const totalDelivery = Object.keys(bySeller).reduce((s, sid) => s + getDeliveryCost(sid), 0);
  const discount = promoApplied ? Math.round(total * 0.1) : 0;
  const grandTotal = total + totalDelivery - discount;

  const applyPromo = () => {
    if (promo.trim().toLowerCase() === "offroad10") { setPromoApplied(true); setPromoError(""); }
    else { setPromoError("Промокод не найден"); setPromoApplied(false); }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.name || !recipient.phone || !recipient.email) return;
    if (pay === "card" || pay === "sbp") {
      const orderNumber = `GK-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
      const paymentMethod = pay === "sbp" ? "СБП" : "Банковская карта";
      sessionStorage.setItem("lastPaidOrder", JSON.stringify({
        orderNumber,
        amount: grandTotal,
        email: recipient.email,
        itemCount: items.reduce((sum, item) => sum + item.qty, 0),
        paymentMethod,
        paidAt: new Date().toLocaleString("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }),
      }));
      clear();
      navigate(`/payment/success?order=${encodeURIComponent(orderNumber)}&payment=${encodeURIComponent(paymentMethod)}`);
      return;
    }
    setSuccess(true);
    clear();
  };

  if (items.length === 0 && !success) {
    return (
      <div style={{ maxWidth: 640, margin: "80px auto", padding: "0 24px", textAlign: "center" }}>
        <div style={{ width: 56, height: 56, background: "#f5f2ee", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <svg width="24" height="22" viewBox="0 0 26 24" fill="none" stroke="#d6d0c8" strokeWidth="1.5"><path d="M1 1h3l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L22 6H6" strokeLinecap="round" strokeLinejoin="round" /><circle cx="10" cy="21" r="1.5" /><circle cx="20" cy="21" r="1.5" /></svg>
        </div>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 26, letterSpacing: "0.06em", textTransform: "uppercase", color: "#1a1612", marginBottom: 10 }}>Корзина пуста</div>
        <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 14, color: "#8c8480", marginBottom: 24 }}>Добавьте товары из каталога, чтобы оформить заказ</p>
        <button onClick={() => navigate("/catalog")} style={{ padding: "12px 32px", background: "#e84e00", border: "none", cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", color: "#fff" }}>Перейти в каталог</button>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ maxWidth: 580, margin: "80px auto", padding: "0 24px", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, background: "#3a9e5f", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <svg width="28" height="22" viewBox="0 0 28 22" fill="none" stroke="white" strokeWidth="3"><path d="M2 11l8 8 16-16" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "#3a9e5f", marginBottom: 10 }}>Заказ оформлен</div>
        <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 36, letterSpacing: "0.04em", textTransform: "uppercase", color: "#1a1612", lineHeight: 1, margin: "0 0 14px" }}>Спасибо за заказ!</h1>
        <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 14, color: "#8c8480", lineHeight: 1.7, marginBottom: 32 }}>Мы отправили подтверждение на ваш email. Менеджер свяжется с вами в течение 30 минут для уточнения деталей.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={() => navigate("/catalog")} style={{ padding: "12px 24px", border: "1px solid #d6d0c8", background: "transparent", cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6b6357" }}>В каталог</button>
          <button onClick={() => navigate("/")} style={{ padding: "12px 24px", border: "none", background: "#e84e00", cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#fff" }}>На главную</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#f5f2ee", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "40px 40px 80px" }}>

        {/* page header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "#e84e00", marginBottom: 6 }}>Маркетплейс</div>
          <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 44, letterSpacing: "0.05em", textTransform: "uppercase", color: "#1a1612", lineHeight: 1, margin: 0 }}>Оформление заказа</h1>
        </div>

        <form onSubmit={submit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24, alignItems: "start" }}>

            {/* ── LEFT: cart split by seller ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {Object.values(bySeller).map(({ seller, items: sItems }, si) => {
                const sid = seller.id;
                const selDel = getDelivery(sid);
                const selDelCost = getDeliveryCost(sid);
                const selTotal = sItems.reduce((s, i) => s + i.price * i.qty, 0);

                return (
                  <section key={sid} style={{ background: "#fff", border: "1px solid #ece8e3", overflow: "hidden" }}>

                    {/* seller header */}
                    <div style={{ background: "#fff", padding: "14px 24px", display: "flex", alignItems: "center", gap: 14, borderBottom: "2px solid #e84e00" }}>
                      <div style={{ width: 36, height: 36, overflow: "hidden", flexShrink: 0, background: "#f5f2ee", border: "1px solid #ece8e3" }}>
                        <img src={seller.logo} alt={seller.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 15, letterSpacing: "0.06em", textTransform: "uppercase", color: "#1a1612", lineHeight: 1 }}>{seller.name}</div>
                        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa49e", marginTop: 2 }}>
                          ★ {seller.rating} · {sItems.length} {sItems.length === 1 ? "товар" : sItems.length < 5 ? "товара" : "товаров"}
                        </div>
                      </div>
                      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 18, color: "#e84e00" }}>{selTotal.toLocaleString("ru")} ₽</div>
                    </div>

                    {/* items list */}
                    <div style={{ padding: "0 24px" }}>
                      {sItems.map((item, ii) => (
                        <div key={`${item.id}-${item.variant}`} style={{ display: "flex", gap: 16, padding: "16px 0", borderBottom: ii < sItems.length - 1 ? "1px solid #f5f2ee" : "1px solid #ece8e3" }}>
                          <div style={{ width: 64, height: 52, flexShrink: 0, overflow: "hidden", background: "#f5f2ee" }}>
                            <img src={item.img} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "0.04em", textTransform: "uppercase", color: "#1a1612", lineHeight: 1.2, marginBottom: 2 }}>{item.name}</div>
                            {item.variant && <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#aaa49e", marginBottom: 6 }}>{item.variant}</div>}
                            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, letterSpacing: "0.1em", color: "#aaa49e" }}>{item.price.toLocaleString("ru")} ₽ / шт.</div>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between", flexShrink: 0 }}>
                            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 16, color: "#1a1612" }}>{(item.price * item.qty).toLocaleString("ru")} ₽</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ display: "flex", alignItems: "center", border: "1px solid #ece8e3" }}>
                                <button type="button" onClick={() => setQty(item.id, item.qty - 1, item.variant)} style={{ width: 28, height: 28, background: "none", border: "none", cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontSize: 16, color: "#6b6357", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                                <span style={{ width: 28, textAlign: "center", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 13, color: "#1a1612" }}>{item.qty}</span>
                                <button type="button" onClick={() => setQty(item.id, item.qty + 1, item.variant)} style={{ width: 28, height: 28, background: "none", border: "none", cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontSize: 16, color: "#6b6357", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                              </div>
                              <button type="button" onClick={() => remove(item.id, item.variant)} style={{ width: 24, height: 24, background: "none", border: "1px solid #ece8e3", cursor: "pointer", color: "#d6d0c8", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#e84e00"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#e84e00"; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#d6d0c8"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#ece8e3"; }}
                              >
                                <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 1l10 10M11 1L1 11" strokeLinecap="round" /></svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* delivery choice for this seller */}
                    <div style={{ padding: "14px 24px 18px", background: "#fafaf8", borderTop: "1px solid #ece8e3" }}>
                      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 9, letterSpacing: "0.26em", textTransform: "uppercase", color: "#aaa49e", marginBottom: 10, fontWeight: 700 }}>
                        Доставка
                      </div>

                      {/* compact tab row */}
                      <div style={{ display: "flex", gap: 0, border: "1px solid #e5e0d8", overflow: "hidden", marginBottom: 12 }}>
                        {DELIVERY_OPTIONS.map((opt, oi) => {
                          const active = selDel === opt.id;
                          return (
                            <button key={opt.id} type="button"
                              onClick={() => setSellerDelivery(p => ({ ...p, [sid]: opt.id }))}
                              style={{ flex: 1, padding: "8px 4px", border: "none", borderRight: oi < DELIVERY_OPTIONS.length - 1 ? "1px solid #e5e0d8" : "none", background: active ? "#fff9f7" : "#fff", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, transition: "background 0.13s", borderBottom: active ? "2px solid #e84e00" : "2px solid transparent" }}
                            >
                              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: active ? "#e84e00" : "#4a443e", lineHeight: 1.2, textAlign: "center" }}>{opt.short}</span>
                              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 9, letterSpacing: "0.06em", color: "#aaa49e", lineHeight: 1 }}>{opt.detail}</span>
                              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 11, color: opt.price === 0 ? "#3a9e5f" : "#1a1612", marginTop: 1 }}>
                                {opt.price === 0 ? "0 ₽" : `${opt.price} ₽`}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* action under tabs */}
                      {(() => {
                        const opt = DELIVERY_OPTIONS.find(o => o.id === selDel);
                        if (!opt) return null;
                        if (opt.action === "pickup_modal") {
                          const picked = sellerPickup[sid];
                          return (
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ flex: 1, padding: "8px 12px", background: picked ? "#fff" : "#f5f2ee", border: "1px solid #e5e0d8", fontFamily: "'Barlow',sans-serif", fontSize: 12, color: picked ? "#1a1612" : "#aaa49e", minHeight: 34, display: "flex", alignItems: "center" }}>
                                {picked || "Пункт выдачи не выбран"}
                              </div>
                              <button type="button" onClick={() => setPickupModal(sid)}
                                style={{ padding: "8px 14px", background: "#e84e00", border: "none", cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#fff", whiteSpace: "nowrap", flexShrink: 0 }}>
                                {picked ? "Изменить" : "Выбрать ПВЗ"}
                              </button>
                            </div>
                          );
                        }
                        if (opt.action === "address_input") {
                          const addr = sellerAddress[sid];
                          return (
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ flex: 1, padding: "8px 12px", background: addr ? "#fff" : "#f5f2ee", border: "1px solid #e5e0d8", fontFamily: "'Barlow',sans-serif", fontSize: 12, color: addr ? "#1a1612" : "#aaa49e", minHeight: 34, display: "flex", alignItems: "center" }}>
                                {addr || "Адрес не указан"}
                              </div>
                              <button type="button" onClick={() => setAddressModal(sid)}
                                style={{ padding: "8px 14px", background: "#e84e00", border: "none", cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#fff", whiteSpace: "nowrap", flexShrink: 0 }}>
                                {addr ? "Изменить" : "Указать адрес"}
                              </button>
                            </div>
                          );
                        }
                        return null;
                      })()}

                      {/* seller subtotal */}
                      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "baseline", gap: 8, marginTop: 12, paddingTop: 12, borderTop: "1px solid #e5e0d8" }}>
                        <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa49e" }}>Итого по продавцу</span>
                        <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 18, color: "#1a1612" }}>{(selTotal + selDelCost).toLocaleString("ru")} ₽</span>
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>

            {/* ── RIGHT: contact form + summary ── */}
            <div style={{ position: "sticky", top: 20, display: "flex", flexDirection: "column", gap: 16 }}>

              {/* recipient profile block */}
              <div style={{ background: "#fff", border: "1px solid #ece8e3", overflow: "hidden" }}>
                <div style={{ height: 3, background: "linear-gradient(90deg,#e84e00,#ff7a2f 60%,#e84e00)" }} />
                <div style={{ padding: "16px 22px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 13, letterSpacing: "0.16em", textTransform: "uppercase", color: "#1a1612" }}>Получатель</div>
                    <button type="button" onClick={() => setShowEditRecipient(true)}
                      style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#e84e00", padding: 0 }}
                      onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = "0.7"}
                      onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = "1"}
                    >
                      <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 1l4 4-8 8H1v-4L9 1z"/></svg>
                      Изменить
                    </button>
                  </div>

                  <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "2px solid #ece8e3" }}>
                      <img src={recipient.avatar} alt={recipient.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 15, letterSpacing: "0.04em", textTransform: "uppercase", color: "#1a1612", lineHeight: 1.1, marginBottom: 6 }}>{recipient.name}</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        {[
                          { icon: <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="#aaa49e" strokeWidth="1.5" strokeLinecap="round"><path d="M2 2h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/><path d="M1 3l6 5 6-5"/></svg>, v: recipient.email },
                          { icon: <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="#aaa49e" strokeWidth="1.5" strokeLinecap="round"><path d="M2 2a1 1 0 0 1 1-1h2l1 3-1.5 1.5a9 9 0 0 0 4 4L10 8l3 1v2a1 1 0 0 1-1 1C5.4 12 2 8.6 2 4.5V2z"/></svg>, v: recipient.phone },
                        ].map((r, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            {r.icon}
                            <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 12, color: "#6b6357" }}>{r.v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #f5f2ee", display: "flex", flexDirection: "column", gap: 10 }}>
                    <Field label="Комментарий к заказу">
                      <textarea value={form.comment} onChange={e => setF("comment", e.target.value)} placeholder="Пожелания по доставке, время звонка…" rows={2} style={{ ...inp, resize: "none", fontFamily: "'Barlow',sans-serif", fontSize: 13 }}
                        onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor = "#e84e00"}
                        onBlur={e => (e.target as HTMLTextAreaElement).style.borderColor = "#e0dbd4"} />
                    </Field>
                  </div>
                </div>
              </div>

              {/* payment */}
              <div style={{ background: "#fff", border: "1px solid #ece8e3", padding: "18px 22px" }}>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 13, letterSpacing: "0.16em", textTransform: "uppercase", color: "#1a1612", marginBottom: 14 }}>Способ оплаты</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {PAY.map(p => {
                    const active = pay === p.id;
                    return (
                      <button key={p.id} type="button" onClick={() => setPay(p.id)}
                        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "14px 8px 12px", border: `1.5px solid ${active ? "#e84e00" : "#ece8e3"}`, background: active ? "#fff9f7" : "#fff", cursor: "pointer", transition: "all 0.13s", position: "relative", flex: "1 1 calc(50% - 4px)", minWidth: 0 }}
                        onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.borderColor = "#c0b0a4"; }}
                        onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.borderColor = "#ece8e3"; }}
                      >
                        {active && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "#e84e00" }} />}
                        <div style={{ color: active ? "#e84e00" : "#aaa49e", transition: "color 0.13s" }}>{p.icon}</div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                          <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: active ? "#e84e00" : "#1a1612", lineHeight: 1 }}>{p.label}</span>
                          <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 9, letterSpacing: "0.06em", color: "#aaa49e", lineHeight: 1.3, textAlign: "center" }}>{p.sub}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* promo + totals */}
              <div style={{ background: "#fff", border: "1px solid #ece8e3", overflow: "hidden" }}>
                <div style={{ padding: "16px 22px", borderBottom: "1px solid #f5f2ee" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input value={promo} onChange={e => setPromo(e.target.value)} placeholder="Промокод" style={{ ...inp, flex: 1, fontSize: 13, padding: "9px 12px" }}
                      onFocus={e => (e.target as HTMLInputElement).style.borderColor = "#e84e00"}
                      onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#e0dbd4"} />
                    <button type="button" onClick={applyPromo} style={{ padding: "9px 14px", background: "#e84e00", border: "none", cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#fff", flexShrink: 0 }}>ОК</button>
                  </div>
                  {promoApplied && <div style={{ marginTop: 6, fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#3a9e5f" }}>✓ Скидка 10% применена</div>}
                  {promoError && <div style={{ marginTop: 6, fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#e84e00" }}>{promoError}</div>}
                </div>

                <div style={{ padding: "14px 22px 18px" }}>
                  {[
                    { label: "Товары", value: `${total.toLocaleString("ru")} ₽` },
                    { label: "Доставка", value: totalDelivery === 0 ? "Бесплатно" : `${totalDelivery.toLocaleString("ru")} ₽` },
                    ...(discount > 0 ? [{ label: "Промокод −10%", value: `−${discount.toLocaleString("ru")} ₽`, green: true }] : []),
                  ].map(r => (
                    <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                      <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#aaa49e" }}>{r.label}</span>
                      <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 13, color: (r as {green?:boolean}).green ? "#3a9e5f" : "#1a1612" }}>{r.value}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 12, borderTop: "2px solid #1a1612", marginTop: 8 }}>
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", color: "#1a1612" }}>Итого</span>
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 26, color: "#e84e00" }}>{grandTotal.toLocaleString("ru")} ₽</span>
                  </div>
                </div>
              </div>

              <button type="submit" style={{ padding: "16px 0", background: "#e84e00", border: "none", cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "#fff" }}>
                Подтвердить заказ
              </button>
              <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 11, color: "#aaa49e", textAlign: "center", lineHeight: 1.5 }}>
                Нажимая кнопку, вы соглашаетесь с условиями обработки персональных данных
              </div>
            </div>

          </div>
        </form>
      </div>

      {pickupModal && (
        <PickupModal
          selected={sellerPickupId[pickupModal] ?? ""}
          onClose={() => setPickupModal(null)}
          onSelect={(id, label) => {
            setSellerPickupId(p => ({ ...p, [pickupModal!]: id }));
            setSellerPickup(p => ({ ...p, [pickupModal!]: label }));
          }}
        />
      )}
      {addressModal && (
        <AddressModal
          initial={sellerAddress[addressModal] ?? ""}
          onClose={() => setAddressModal(null)}
          onSelect={addr => setSellerAddress(p => ({ ...p, [addressModal!]: addr }))}
        />
      )}
      {showEditRecipient && (
        <EditRecipientModal
          user={recipient}
          onClose={() => setShowEditRecipient(false)}
          onSave={u => setRecipient(u)}
        />
      )}
    </div>
  );
}
