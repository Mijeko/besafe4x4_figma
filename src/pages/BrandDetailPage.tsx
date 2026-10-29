import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getBrandBySlug } from "../data/brands";

export function BrandDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const brand = getBrandBySlug(slug ?? "");
  const [activeTab, setActiveTab] = useState<"products"|"about">("products");
  const [hoveredId, setHoveredId] = useState<number|null>(null);

  if (!brand) {
    return (
      <div style={{ minHeight:"60vh", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16, background:"#f5f2ee" }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:24, textTransform:"uppercase", color:"#1a1612" }}>Бренд не найден</div>
        <button onClick={()=>navigate("/brands")} style={{ padding:"10px 24px", background:"#e84e00", border:"none", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.16em", textTransform:"uppercase", color:"#fff" }}>← Все бренды</button>
      </div>
    );
  }

  return (
    <div style={{ background:"#f5f2ee", minHeight:"100vh" }}>

      {/* ── Hero ── */}
      <section style={{ position:"relative", height:480, overflow:"hidden", background:"#0e0c0a" }}>
        <img src={brand.heroImg} alt={brand.name} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", opacity:0.35 }}/>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(110deg, rgba(10,8,6,0.92) 0%, rgba(10,8,6,0.5) 60%, rgba(10,8,6,0.2) 100%)" }}/>
        {/* accent stripe */}
        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:5, background:brand.accentColor }}/>
        {/* grid pattern */}
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize:"60px 60px" }}/>

        <div style={{ position:"relative", zIndex:2, maxWidth:1400, margin:"0 auto", padding:"0 60px", height:"100%", display:"flex", flexDirection:"column", justifyContent:"flex-end", paddingBottom:52 }}>
          {/* breadcrumb */}
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:28 }}>
            <button onClick={()=>navigate("/brands")} style={{ background:"none", border:"none", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(255,255,255,0.4)", padding:0, display:"flex", alignItems:"center", gap:6 }}
              onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.color="rgba(255,255,255,0.8)"}
              onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.color="rgba(255,255,255,0.4)"}
            >
              <svg width="12" height="10" viewBox="0 0 14 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M13 6H1M6 1L1 6l5 5"/></svg>
              Все бренды
            </button>
            <svg width="5" height="8" viewBox="0 0 6 10" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round"><path d="M1 1l4 4-4 4"/></svg>
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(255,255,255,0.35)" }}>{brand.name}</span>
          </div>

          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", gap:32, flexWrap:"wrap" }}>
            <div>
              {/* founded badge */}
              <div style={{ display:"flex", gap:10, marginBottom:14, flexWrap:"wrap" }}>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.24em", textTransform:"uppercase", color:brand.accentColor, background:"rgba(255,255,255,0.06)", padding:"4px 12px", border:`1px solid ${brand.accentColor}44` }}>{brand.country}</span>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.24em", textTransform:"uppercase", color:"rgba(255,255,255,0.45)", background:"rgba(255,255,255,0.05)", padding:"4px 12px", border:"1px solid rgba(255,255,255,0.1)" }}>с {brand.founded} года</span>
                {brand.categories.map(c=>(
                  <span key={c} style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.24em", textTransform:"uppercase", color:"rgba(255,255,255,0.35)", padding:"4px 12px", border:"1px solid rgba(255,255,255,0.08)" }}>{c}</span>
                ))}
              </div>

              <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:"clamp(52px,8vw,100px)", letterSpacing:"0.03em", textTransform:"uppercase", color:"#fff", lineHeight:0.9, margin:"0 0 14px" }}>
                {brand.name}
              </h1>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(255,255,255,0.4)" }}>{brand.tagline}</div>
            </div>

            {/* products count + link */}
            <div style={{ flexShrink:0, textAlign:"right" }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:56, color:brand.accentColor, lineHeight:1 }}>{brand.productsCount}</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(255,255,255,0.35)", marginTop:2 }}>товаров в каталоге</div>
              <button onClick={()=>navigate("/catalog")} style={{ marginTop:12, padding:"9px 20px", background:"transparent", border:`1.5px solid ${brand.accentColor}`, cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", color:brand.accentColor }}
                onMouseEnter={e=>{ (e.currentTarget as HTMLButtonElement).style.background=brand.accentColor; (e.currentTarget as HTMLButtonElement).style.color="#fff"; }}
                onMouseLeave={e=>{ (e.currentTarget as HTMLButtonElement).style.background="transparent"; (e.currentTarget as HTMLButtonElement).style.color=brand.accentColor; }}
              >В каталог →</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tabs ── */}
      <div style={{ background:"#fff", borderBottom:"1.5px solid #ede9e2", position:"sticky", top:0, zIndex:20 }}>
        <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 60px", display:"flex", gap:0 }}>
          {([["products","Товары"],["about","О бренде"]] as const).map(([k,l])=>(
            <button key={k} onClick={()=>setActiveTab(k)} style={{ padding:"14px 22px", border:"none", borderBottom:`2px solid ${activeTab===k?brand.accentColor:"transparent"}`, background:"transparent", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:activeTab===k?700:500, fontSize:12, letterSpacing:"0.18em", textTransform:"uppercase", color:activeTab===k?"#1a1612":"#8c8480", transition:"all 0.15s", marginBottom:-1 }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:1400, margin:"0 auto", padding:"48px 60px 80px" }}>

        {/* ── Products tab ── */}
        {activeTab === "products" && (
          <div>
            <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:28 }}>
              <div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.3em", textTransform:"uppercase", color:brand.accentColor, marginBottom:6 }}>Каталог</div>
                <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:36, letterSpacing:"0.04em", textTransform:"uppercase", color:"#1a1612", lineHeight:1, margin:0 }}>Товары {brand.name}</h2>
              </div>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, letterSpacing:"0.12em", textTransform:"uppercase", color:"#aaa49e" }}>{brand.products.length} позиции</span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
              {brand.products.map(product=>(
                <div key={product.id} style={{ background:"#fff", border:"1.5px solid #ede9e2", overflow:"hidden", cursor:"pointer", transition:"border-color 0.15s, box-shadow 0.15s", boxShadow:hoveredId===product.id?"0 6px 24px rgba(26,22,18,0.1)":"none", borderColor:hoveredId===product.id?brand.accentColor:"#ede9e2" }}
                  onMouseEnter={()=>setHoveredId(product.id)}
                  onMouseLeave={()=>setHoveredId(null)}
                  onClick={()=>navigate("/catalog")}
                >
                  <div style={{ position:"relative", height:180, overflow:"hidden", background:"#f5f2ee" }}>
                    <img src={product.img} alt={product.name} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.4s ease", transform:hoveredId===product.id?"scale(1.06)":"scale(1)" }}/>
                    {product.badge && (
                      <div style={{ position:"absolute", top:10, left:10 }}>
                        <span style={{ background:brand.accentColor, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:"#fff", padding:"3px 9px" }}>{product.badge}</span>
                      </div>
                    )}
                  </div>
                  <div style={{ padding:"14px 16px 16px" }}>
                    <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", color:"#aaa49e", marginBottom:4 }}>{product.category}</div>
                    <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, letterSpacing:"0.04em", textTransform:"uppercase", color:"#1a1612", lineHeight:1.15, marginBottom:12 }}>{product.name}</div>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:20, color:brand.accentColor }}>{product.price.toLocaleString("ru")} ₽</div>
                      <button style={{ padding:"6px 14px", background:brand.accentColor, border:"none", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase", color:"#fff" }}>В каталог</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── About tab ── */}
        {activeTab === "about" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 380px", gap:40, alignItems:"start" }}>
            {/* left */}
            <div>
              {/* story */}
              <div style={{ background:"#fff", border:"1.5px solid #ede9e2", padding:"32px 36px", marginBottom:24 }}>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.3em", textTransform:"uppercase", color:brand.accentColor, marginBottom:10 }}>История</div>
                <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:28, letterSpacing:"0.04em", textTransform:"uppercase", color:"#1a1612", lineHeight:1, margin:"0 0 20px" }}>О компании {brand.name}</h2>
                <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:15, color:"#6b6357", lineHeight:1.75, margin:0 }}>{brand.story}</p>
              </div>

              {/* advantages */}
              <div style={{ background:"#fff", border:"1.5px solid #ede9e2", padding:"32px 36px" }}>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.3em", textTransform:"uppercase", color:brand.accentColor, marginBottom:10 }}>Преимущества</div>
                <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:28, letterSpacing:"0.04em", textTransform:"uppercase", color:"#1a1612", lineHeight:1, margin:"0 0 24px" }}>Почему {brand.name}?</h2>
                <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
                  {brand.advantages.map((adv, i)=>(
                    <div key={i} style={{ display:"grid", gridTemplateColumns:"3px 1fr", gap:20, paddingBottom:i<brand.advantages.length-1?24:0, marginBottom:i<brand.advantages.length-1?24:0, borderBottom:i<brand.advantages.length-1?"1px solid #f0ece6":"none" }}>
                      <div style={{ background:brand.accentColor, alignSelf:"stretch", minHeight:24 }}/>
                      <div>
                        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:16, letterSpacing:"0.06em", textTransform:"uppercase", color:"#1a1612", marginBottom:6 }}>{adv.title}</div>
                        <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:14, color:"#6b6357", lineHeight:1.65, margin:0 }}>{adv.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* right */}
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {/* brand card */}
              <div style={{ background:"#1a1612", padding:"28px 28px 24px", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:brand.accentColor }}/>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.28em", textTransform:"uppercase", color:"rgba(255,255,255,0.35)", marginBottom:4 }}>Бренд</div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:36, letterSpacing:"0.04em", textTransform:"uppercase", color:"#fff", lineHeight:1, marginBottom:20 }}>{brand.name}</div>
                {[
                  { l:"Страна", v:brand.country },
                  { l:"Основан", v:brand.founded },
                  { l:"Сайт", v:brand.website },
                  { l:"Товаров в каталоге", v:String(brand.productsCount) },
                ].map(row=>(
                  <div key={row.l} style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                    <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", color:"rgba(255,255,255,0.35)" }}>{row.l}</span>
                    <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, letterSpacing:"0.06em", textTransform:"uppercase", color:"rgba(255,255,255,0.8)" }}>{row.v}</span>
                  </div>
                ))}
                <button onClick={()=>navigate("/catalog")} style={{ width:"100%", marginTop:20, padding:"12px 0", background:brand.accentColor, border:"none", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:"#fff" }}>
                  Все товары в каталоге →
                </button>
              </div>

              {/* categories */}
              <div style={{ background:"#fff", border:"1.5px solid #ede9e2", padding:"22px 24px" }}>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:12, letterSpacing:"0.2em", textTransform:"uppercase", color:"#1a1612", marginBottom:14 }}>Категории</div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {brand.categories.map(c=>(
                    <div key={c} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 14px", background:"#faf8f5", border:"1px solid #f0ece6" }}>
                      <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.14em", textTransform:"uppercase", color:"#1a1612" }}>{c}</span>
                      <svg width="8" height="12" viewBox="0 0 8 14" fill="none" stroke="#d6d0c8" strokeWidth="1.8" strokeLinecap="round"><path d="M1 1l6 6-6 6"/></svg>
                    </div>
                  ))}
                </div>
              </div>

              {/* other brands */}
              <div style={{ background:"#fff", border:"1.5px solid #ede9e2", padding:"22px 24px" }}>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:12, letterSpacing:"0.2em", textTransform:"uppercase", color:"#1a1612", marginBottom:14 }}>Другие бренды</div>
                <button onClick={()=>navigate("/brands")} style={{ width:"100%", padding:"10px 0", border:"1.5px solid #e5e0d8", background:"transparent", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", color:"#6b6357" }}
                  onMouseEnter={e=>{ (e.currentTarget as HTMLButtonElement).style.borderColor="#e84e00"; (e.currentTarget as HTMLButtonElement).style.color="#e84e00"; }}
                  onMouseLeave={e=>{ (e.currentTarget as HTMLButtonElement).style.borderColor="#e5e0d8"; (e.currentTarget as HTMLButtonElement).style.color="#6b6357"; }}
                >← Все бренды</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
