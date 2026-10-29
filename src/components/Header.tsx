import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useCart } from "../context/CartContext";

const CITIES = ["Москва","Санкт-Петербург","Екатеринбург","Новосибирск","Краснодар","Казань","Уфа","Самара"];

const NAV_LINKS = [
  { label: "Клубы", path: "/clubs" },
  { label: "Туры", path: "/tours" },
  { label: "Экипировка", path: "/catalog" },
  { label: "Бренды", path: "/brands" },
  { label: "Автосервисы", path: "/services" },
  { label: "Оплата", path: "/payment/success" },
  { label: "События", path: "/events" },
  { label: "Блог", path: "/blog" },
  { label: "Новости", path: "/news" },
];

const TOP_LINKS = [
  { label: "О нас", path: "/about" },
  { label: "Контакты", path: "/contacts" },
  { label: "FAQ", path: "/" },
];

function CitySelector() {
  const [open, setOpen] = useState(false);
  const [city, setCity] = useState("Москва");
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5 group">
        <svg width="11" height="14" viewBox="0 0 12 14" fill="#e84e00"><path d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5Zm0 6.75A1.75 1.75 0 1 1 6 3.25a1.75 1.75 0 0 1 0 3.5Z"/></svg>
        <span className="group-hover:text-[#e84e00] transition-colors" style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:600, fontSize:13, letterSpacing:"0.1em", textTransform:"uppercase", color:"#1a1612" }}>{city}</span>
        <svg width="9" height="5" viewBox="0 0 10 6" fill="none" stroke="#bbb" className={`transition-transform duration-200 ${open?"rotate-180":""}`}><path d="M1 1l4 4 4-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 w-52 z-50 shadow-xl border" style={{ background:"#fff", borderColor:"#e8e4df" }}>
          {CITIES.map(c=>(
            <button key={c} onClick={()=>{ setCity(c); setOpen(false); }} className="w-full text-left px-4 py-2.5 transition-colors hover:bg-[#e84e00] hover:text-white" style={{ fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:"0.08em", fontSize:13, color:c===city?"#e84e00":"#6b6357", textTransform:"uppercase" }}>{c}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function CartButton() {
  const { count, items, total, remove } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)}
        style={{ position: "relative", display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "1px solid #e0dbd4", background: "transparent", cursor: "pointer", transition: "border-color 0.15s" }}
        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.borderColor = "#e84e00"}
        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.borderColor = "#e0dbd4"}
      >
        <svg width="16" height="15" viewBox="0 0 18 17" fill="none" stroke="#6b6357" strokeWidth="1.5"><path d="M1 1h2.5l2.2 10.5a1.5 1.5 0 0 0 1.5 1.2h7.4a1.5 1.5 0 0 0 1.5-1.2L17.5 5H4.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="7.5" cy="15" r="1.2" fill="#6b6357" stroke="none"/><circle cx="14.5" cy="15" r="1.2" fill="#6b6357" stroke="none"/></svg>
        {count > 0 && (
          <span style={{ position: "absolute", top: -5, right: -5, width: 18, height: 18, background: "#e84e00", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 10, color: "#fff", lineHeight: 1 }}>{count > 99 ? "99+" : count}</span>
        )}
        <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 600, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b6357" }}>Корзина</span>
      </button>

      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: 340, background: "#fff", border: "1px solid #e8e4df", zIndex: 50, boxShadow: "0 12px 40px rgba(0,0,0,0.13)" }}>
          <div style={{ height: 3, background: "linear-gradient(90deg,#e84e00,#ff7a2f 60%,#e84e00)" }} />
          <div style={{ padding: "16px 18px 0" }}>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#1a1612", marginBottom: 12 }}>
              Корзина {count > 0 && <span style={{ color: "#e84e00" }}>({count})</span>}
            </div>

            {items.length === 0 ? (
              <div style={{ padding: "28px 0 20px", textAlign: "center" }}>
                <svg width="36" height="34" viewBox="0 0 36 34" fill="none" stroke="#d6d0c8" strokeWidth="1.5" style={{ marginBottom: 10 }}><path d="M1 1h5l4.4 21a3 3 0 0 0 3 2.4h14.8a3 3 0 0 0 3-2.4L35 10H9" strokeLinecap="round" strokeLinejoin="round"/><circle cx="15" cy="30" r="2.4"/><circle cx="29" cy="30" r="2.4"/></svg>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: "0.08em", textTransform: "uppercase", color: "#aaa49e", marginBottom: 12 }}>Корзина пуста</div>
                <button onClick={() => { navigate("/catalog"); setOpen(false); }} style={{ padding: "8px 18px", background: "#e84e00", border: "none", cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#fff" }}>В каталог</button>
              </div>
            ) : (
              <>
                <div style={{ maxHeight: 260, overflowY: "auto" }}>
                  {items.map(item => (
                    <div key={`${item.id}-${item.variant}`} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: "1px solid #f5f2ee" }}>
                      <div style={{ width: 44, height: 36, flexShrink: 0, overflow: "hidden", background: "#f5f2ee" }}>
                        <img src={item.img} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.04em", textTransform: "uppercase", color: "#1a1612", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
                        {item.variant && <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "#aaa49e" }}>{item.variant}</div>}
                        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 13, color: "#1a1612", marginTop: 3 }}>{(item.price * item.qty).toLocaleString("ru")} ₽ <span style={{ fontWeight: 400, color: "#aaa49e", fontSize: 11 }}>× {item.qty}</span></div>
                      </div>
                      <button onClick={() => remove(item.id, item.variant)} style={{ width: 18, height: 18, background: "none", border: "none", cursor: "pointer", color: "#d6d0c8", flexShrink: 0, alignSelf: "flex-start", marginTop: 2, padding: 0 }}
                        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "#e84e00"}
                        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = "#d6d0c8"}
                      >
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 1l10 10M11 1L1 11" strokeLinecap="round"/></svg>
                      </button>
                    </div>
                  ))}
                </div>
                <div style={{ padding: "12px 0 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8c8480" }}>Итого</span>
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 20, color: "#e84e00" }}>{total.toLocaleString("ru")} ₽</span>
                  </div>
                  <button onClick={() => { navigate("/checkout"); setOpen(false); }} style={{ width: "100%", padding: "12px 0", background: "#e84e00", border: "none", cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", color: "#fff" }}>
                    Оформить заказ
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function AccountButton() {
  const [open,setOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="relative">
      <button onClick={()=>setOpen(!open)} className="flex items-center gap-2 px-4 py-2 border transition-all group" style={{ borderColor:"#e0dbd4", background:"transparent" }}
        onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.borderColor="#e84e00"}
        onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.borderColor="#e0dbd4"}
      >
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#aaa" className="group-hover:stroke-[#e84e00] transition-colors" strokeWidth="1.5"><circle cx="8" cy="5.5" r="2.5"/><path d="M2.5 14c0-2.485 2.462-4.5 5.5-4.5s5.5 2.015 5.5 4.5" strokeLinecap="round"/></svg>
        <span className="group-hover:text-[#1a1612] transition-colors" style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:600, fontSize:13, letterSpacing:"0.12em", textTransform:"uppercase", color:"#6b6357" }}>Иван М.</span>
        <svg width="9" height="5" viewBox="0 0 10 6" fill="none" stroke="#bbb" className={`transition-transform duration-200 ${open?"rotate-180":""}`}><path d="M1 1l4 4 4-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-2 w-52 border z-50 shadow-xl" style={{ background:"#fff", borderColor:"#e8e4df" }}>
          {[
            { label:"Личный кабинет", path:"/lk" },
            { label:"Мои машины", path:"/lk/machines" },
            { label:"Мои события", path:"/lk/events" },
            { label:"Мои клубы", path:"/lk/clubs" },
            { label:"Сигналы помощи", path:"/lk/signals" },
            { label:"Достижения", path:"/lk/achievements" },
            { label:"Друзья", path:"/lk/friends" },
            { label:"Сообщения", path:"/lk/chat" },
            { label:"Настройки", path:"/lk/settings" },
          ].map(item=>(
            <button key={item.label} onClick={()=>{ navigate(item.path); setOpen(false); }} className="w-full text-left px-4 py-2.5 transition-colors hover:bg-[#e84e00] hover:text-white" style={{ fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:"0.06em", color:"#6b6357", textTransform:"uppercase", fontSize:12 }}>
              {item.label}
            </button>
          ))}
          <div style={{ borderTop:"1px solid #f0ece8" }}>
            <button onClick={()=>{ navigate("/seller/products"); setOpen(false); }} className="w-full text-left px-4 py-2.5 transition-colors hover:bg-[#1a1612] hover:text-white" style={{ fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:"0.06em", color:"#1a1612", textTransform:"uppercase", fontSize:12, fontWeight:700 }}>🏪 Кабинет продавца</button>
            <button className="w-full text-left px-4 py-2.5 transition-colors hover:bg-[#f5f2ee]" style={{ fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:"0.06em", color:"#c0392b", textTransform:"uppercase", fontSize:12 }}>Выйти</button>
          </div>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [mobileOpen,setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <div style={{ height:4, background:"linear-gradient(90deg,#e84e00 0%,#ff7a2f 60%,#e84e00 100%)" }}/>

      {/* TOP BAR */}
      <div className="w-full border-b" style={{ borderColor:"#ece8e3", background:"#ffffff" }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-9">
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, letterSpacing:"0.22em", color:"#aaa49e", textTransform:"uppercase" }}>Покоряй. Исследуй. Возвращайся.</span>
          <nav className="flex items-center gap-5">
            {TOP_LINKS.map(l=>(
              <Link key={l.label} to={l.path} className="transition-colors hover:text-[#e84e00]" style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, letterSpacing:"0.18em", color:"#aaa49e", textTransform:"uppercase", textDecoration:"none" }}>{l.label}</Link>
            ))}
            <div className="flex items-center gap-3 ml-1 pl-4" style={{ borderLeft:"1px solid #ece8e3" }}>
              {[
                { title:"VK", d:"M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.953 16.5h-1.79c-.678 0-.886-.54-2.104-1.77-.955-.97-1.376-.967-1.376-.967s-.336-.036-.336.474v1.617c0 .376-.12.6-1.103.6-1.625 0-3.428-.984-4.697-2.818C4.9 11.76 4.5 9.9 4.5 9.9s-.083-.333.253-.333h1.79c.29 0 .4.13.51.44.564 1.624 1.507 3.045 1.896 3.045.146 0 .212-.067.212-.433V10.89c-.042-.77-.45-.836-.45-.836s-.22-.025-.22-.25c0-.196.16-.25.25-.25h2.82c.245 0 .33.13.33.415v2.273c0 .218.097.294.156.294.146 0 .269-.076.538-.35.834-.934 1.428-2.372 1.428-2.372s.148-.32.437-.32h1.79c.536 0 .65.278.536.656-.22.76-2.386 3.27-2.386 3.27s-.192.224 0 .48c.14.188 1.6 1.55 2.008 2.076.375.49.668.893.741 1.178.07.27-.079.516-.375.516z" },
                { title:"TG", d:"M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.247l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.932z" },
              ].map(s=>(
                <a key={s.title} href="#" className="opacity-40 hover:opacity-80 transition-opacity"><svg width="14" height="14" viewBox="0 0 24 24" fill="#6b6357"><path d={s.d}/></svg></a>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* MAIN HEADER */}
      <header className="w-full border-b" style={{ borderColor:"#ece8e3", background:"#ffffff" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-[72px]">
            <div className="hidden md:flex items-center w-48"><CitySelector /></div>
            <div className="absolute left-1/2 -translate-x-1/2">
              <Link to="/" className="flex items-center gap-3 select-none" style={{ textDecoration:"none" }}>
                <div style={{ width:40, height:40, background:"#e84e00", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <svg width="22" height="22" viewBox="0 0 26 26" fill="none"><circle cx="13" cy="13" r="10" stroke="white" strokeWidth="2"/><circle cx="13" cy="13" r="4" fill="white"/><rect x="12" y="1" width="2" height="5" rx="1" fill="white"/><rect x="12" y="20" width="2" height="5" rx="1" fill="white"/><rect x="1" y="12" width="5" height="2" rx="1" fill="white"/><rect x="20" y="12" width="5" height="2" rx="1" fill="white"/></svg>
                </div>
                <div style={{ display:"flex", flexDirection:"column", lineHeight:1 }}>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:24, letterSpacing:"0.1em", color:"#1a1612", textTransform:"uppercase" }}>ГРЯЗЬ&nbsp;<span style={{ color:"#e84e00" }}>&amp;</span>&nbsp;КАМНИ</span>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:500, fontSize:9, letterSpacing:"0.28em", color:"#aaa49e", textTransform:"uppercase" }}>OFF&#8209;ROAD COMMUNITY</span>
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <CartButton />
              <AccountButton/>
              <button onClick={()=>setMobileOpen(!mobileOpen)} className="md:hidden flex flex-col gap-1.5 p-1">
                {[0,1,2].map(i=>(
                  <span key={i} className="block h-0.5 w-6 transition-all" style={{ background:"#6b6357", transform: mobileOpen&&i===0?"translateY(8px) rotate(45deg)":mobileOpen&&i===1?"scaleX(0)":mobileOpen&&i===2?"translateY(-8px) rotate(-45deg)":"none" }}/>
                ))}
              </button>
            </div>
          </div>

          {/* NAV ROW */}
          <nav className="hidden md:flex items-center border-t" style={{ borderColor:"#f0ece8" }}>
            {NAV_LINKS.map(({label,path})=>(
              <button key={label} onClick={()=>navigate(path)}
                className="relative px-5 py-3 transition-colors"
                style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:isActive(path)&&!(path==="/"&&location.pathname!=="/") || (path==="/"&&location.pathname==="/") ?700:500, fontSize:13, letterSpacing:"0.16em", color: (path==="/"&&location.pathname==="/")||(path!=="/"&&isActive(path))?"#1a1612":"#8c8480", textTransform:"uppercase", background:"none", border:"none", cursor:"pointer" }}
                onMouseEnter={e=>{ (e.currentTarget as HTMLButtonElement).style.color="#1a1612"; }}
                onMouseLeave={e=>{ if(!((path==="/"&&location.pathname==="/") || (path!=="/"&&isActive(path)))) (e.currentTarget as HTMLButtonElement).style.color="#8c8480"; }}
              >
                {label}
                {((path==="/"&&location.pathname==="/")||(path!=="/"&&isActive(path))) && <span className="absolute bottom-0 left-0 w-full h-0.5" style={{ background:"#e84e00" }}/>}
              </button>
            ))}
            <div className="ml-auto">
              <button className="flex items-center gap-2 px-4 py-3 transition-colors hover:text-[#1a1612]" style={{ color:"#aaa49e" }}>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="7" cy="7" r="5"/><path d="M11 11l3 3" strokeLinecap="round"/></svg>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase" }}>Поиск</span>
              </button>
            </div>
          </nav>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t" style={{ borderColor:"#ece8e3" }}>
            <div className="px-6 py-4 border-b" style={{ borderColor:"#ece8e3" }}><CitySelector/></div>
            {NAV_LINKS.map(({label,path})=>(
              <Link key={label} to={path} onClick={()=>setMobileOpen(false)} className="flex items-center px-6 py-4 border-b transition-colors hover:text-[#e84e00]" style={{ borderColor:"#ece8e3", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:600, fontSize:14, letterSpacing:"0.16em", color:"#6b6357", textTransform:"uppercase", textDecoration:"none" }}>{label}</Link>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
