import { useState } from "react";
import { useNavigate } from "react-router";
import { BRANDS } from "../data/brands";

const ALL_CATS = ["Все", ...Array.from(new Set(BRANDS.flatMap(b => b.categories)))];

export function BrandsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("Все");
  const [search, setSearch] = useState("");
  const [hovered, setHovered] = useState<string | null>(null);

  const filtered = BRANDS.filter(b => {
    const matchCat = filter === "Все" || b.categories.includes(filter);
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ background:"#f5f2ee", minHeight:"100vh" }}>

      {/* ── Hero ── */}
      <section style={{ background:"#1a1612", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"url(https://images.unsplash.com/photo-1570129476815-ba368ac77013?w=1600&h=500&fit=crop&auto=format)", backgroundSize:"cover", backgroundPosition:"center", opacity:0.12 }}/>
        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:5, background:"#e84e00" }}/>
        {/* decorative grid lines */}
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize:"60px 60px" }}/>
        <div style={{ position:"relative", zIndex:2, maxWidth:1400, margin:"0 auto", padding:"64px 60px 56px" }}>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.36em", textTransform:"uppercase", color:"#e84e00", marginBottom:12 }}>Каталог</div>
          <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:"clamp(48px,7vw,88px)", letterSpacing:"0.03em", textTransform:"uppercase", color:"#fff", lineHeight:0.9, margin:"0 0 20px" }}>
            БРЕНДЫ
          </h1>
          <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:16, color:"rgba(255,255,255,0.45)", maxWidth:520, lineHeight:1.7, margin:0 }}>
            Только проверенные производители внедорожного оборудования — лебёдки, шины, подвеска, защита, освещение и экипировка.
          </p>

          {/* search bar */}
          <div style={{ position:"relative", maxWidth:560, marginTop:32 }}>
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.6" style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}><circle cx="8" cy="8" r="5.5"/><path d="M12.5 12.5l3.5 3.5" strokeLinecap="round"/></svg>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Найти бренд…" style={{ width:"100%", padding:"14px 16px 14px 46px", border:"1.5px solid rgba(255,255,255,0.12)", outline:"none", fontFamily:"'Barlow',sans-serif", fontSize:15, color:"#fff", background:"rgba(255,255,255,0.07)", boxSizing:"border-box" }}
              onFocus={e=>{ (e.target as HTMLInputElement).style.borderColor="#e84e00"; (e.target as HTMLInputElement).style.background="rgba(255,255,255,0.1)"; }}
              onBlur={e=>{ (e.target as HTMLInputElement).style.borderColor="rgba(255,255,255,0.12)"; (e.target as HTMLInputElement).style.background="rgba(255,255,255,0.07)"; }}
            />
          </div>

          {/* stat pills */}
          <div style={{ display:"flex", gap:24, marginTop:24, flexWrap:"wrap" }}>
            {[
              { v:String(BRANDS.length), l:"Брендов" },
              { v:String(BRANDS.reduce((s,b)=>s+b.productsCount,0))+" +", l:"Товаров" },
              { v:Array.from(new Set(BRANDS.flatMap(b=>b.categories))).length+" ", l:"Категорий" },
            ].map(s=>(
              <div key={s.l} style={{ display:"flex", alignItems:"baseline", gap:6 }}>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:28, color:"#e84e00" }}>{s.v}</span>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(255,255,255,0.35)" }}>{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Toolbar ── */}
      <div style={{ background:"#fff", borderBottom:"1.5px solid #ede9e2", position:"sticky", top:0, zIndex:30 }}>
        <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 60px", display:"flex", alignItems:"center", gap:0, minHeight:56 }}>
          {ALL_CATS.map(c=>(
            <button key={c} onClick={()=>setFilter(c)} style={{ padding:"8px 16px", border:"none", borderBottom:`2px solid ${filter===c?"#e84e00":"transparent"}`, background:"transparent", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:filter===c?700:500, fontSize:11, letterSpacing:"0.16em", textTransform:"uppercase", color:filter===c?"#e84e00":"#6b6357", whiteSpace:"nowrap", transition:"all 0.15s" }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ── Brand Grid ── */}
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"48px 60px 80px" }}>
        {filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:"80px 0", color:"#ccc5bf" }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:20, letterSpacing:"0.1em", textTransform:"uppercase" }}>Бренды не найдены</div>
          </div>
        )}

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
          {filtered.map(brand=>(
            <div key={brand.slug} onClick={()=>navigate(`/brands/${brand.slug}`)}
              style={{ background:"#fff", border:"1.5px solid #ede9e2", overflow:"hidden", cursor:"pointer", transition:"border-color 0.2s, box-shadow 0.2s", boxShadow:hovered===brand.slug?"0 8px 32px rgba(26,22,18,0.1)":"none", borderColor:hovered===brand.slug?"#e84e00":"#ede9e2" }}
              onMouseEnter={()=>setHovered(brand.slug)}
              onMouseLeave={()=>setHovered(null)}
            >
              {/* hero image */}
              <div style={{ position:"relative", height:200, overflow:"hidden", background:"#1a1612" }}>
                <img src={brand.heroImg} alt={brand.name} style={{ width:"100%", height:"100%", objectFit:"cover", opacity:0.7, transition:"transform 0.5s ease, opacity 0.3s", transform:hovered===brand.slug?"scale(1.05)":"scale(1)" }}/>
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(10,8,6,0.85) 0%, rgba(10,8,6,0.1) 60%)" }}/>
                {/* country badge */}
                <div style={{ position:"absolute", top:14, right:14, padding:"3px 10px", background:"rgba(10,8,6,0.6)", backdropFilter:"blur(4px)", border:"1px solid rgba(255,255,255,0.12)" }}>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(255,255,255,0.7)" }}>{brand.country} · {brand.founded}</span>
                </div>
                {/* logo area */}
                <div style={{ position:"absolute", bottom:16, left:18 }}>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:28, letterSpacing:"0.06em", textTransform:"uppercase", color:"#fff", lineHeight:1 }}>{brand.name}</div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", color:"rgba(255,255,255,0.5)", marginTop:3 }}>{brand.tagline}</div>
                </div>
                {/* accent left bar */}
                <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:brand.accentColor }}/>
              </div>

              {/* info */}
              <div style={{ padding:"18px 20px 20px" }}>
                <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:13, color:"#6b6357", lineHeight:1.6, margin:"0 0 14px" }}>
                  {brand.description}
                </p>

                {/* categories */}
                <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:16 }}>
                  {brand.categories.map(c=>(
                    <span key={c} style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", color:"#6b6357", background:"#f5f2ee", padding:"3px 9px", border:"1px solid #ece8e2" }}>{c}</span>
                  ))}
                </div>

                {/* footer */}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:14, borderTop:"1px solid #f0ece6" }}>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:20, color:brand.accentColor }}>{brand.productsCount} <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:400, fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", color:"#aaa49e" }}>товаров</span></div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:hovered===brand.slug?"#e84e00":"#aaa49e", transition:"color 0.15s" }}>
                    Смотреть
                    <svg width="12" height="8" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1 5h12M8 1l5 4-5 4"/></svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
