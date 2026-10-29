import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

// ── Data ──────────────────────────────────────────────────────

const FEATURED_EVENTS = [
  { id:"e1", title:"Осеннее бездорожье 2026", date:"18 окт", location:"Ленинградская обл.", type:"Слёт", fee:"Бесплатно", participants:84, max:120, img:"https://images.unsplash.com/photo-1636138103626-8057cad9c335?w=800&h=500&fit=crop&auto=format" },
  { id:"e2", title:"Экспедиция Карелия X", date:"2 ноя", location:"Республика Карелия", type:"Экспедиция", fee:"4 500 ₽", participants:22, max:30, img:"https://images.unsplash.com/photo-1765519333785-892ba0e85e91?w=800&h=500&fit=crop&auto=format" },
  { id:"e3", title:"Кубок грязи — осень", date:"25 окт", location:"Подмосковье", type:"Соревнование", fee:"2 000 ₽", participants:56, max:60, img:"https://images.unsplash.com/photo-1788170803834-dfd7b3589230?w=800&h=500&fit=crop&auto=format" },
];

const FEATURED_CLUBS = [
  { id:"c1", name:"Mud Titans", city:"Москва", members:347, routes:28, img:"https://images.unsplash.com/photo-1499977811654-44bf42276428?w=400&h=280&fit=crop&auto=format", accent:"#e84e00" },
  { id:"c2", name:"Северный Путь", city:"Санкт-Петербург", members:214, routes:41, img:"https://images.unsplash.com/photo-1636138100130-1780f51e3bee?w=400&h=280&fit=crop&auto=format", accent:"#3a9e5f" },
  { id:"c3", name:"Степные Волки", city:"Екатеринбург", members:189, routes:19, img:"https://images.unsplash.com/photo-1558405588-0eff8afefeb3?w=400&h=280&fit=crop&auto=format", accent:"#d4820a" },
  { id:"c4", name:"Rock Crawlers SPb", city:"Санкт-Петербург", members:124, routes:33, img:"https://images.unsplash.com/photo-1628701856385-aceb8a75d4ac?w=400&h=280&fit=crop&auto=format", accent:"#4c75a3" },
];

const NEWS = [
  { id:"n1", tag:"Новости", date:"6 сен 2026", title:"BFGoodrich выпустил новую версию MT/A KM4 — чем отличается?", excerpt:"Американцы обновили флагманскую резину для бездорожья. Разбираем, что изменилось в протекторе, составе и ресурсе.", img:"https://images.unsplash.com/photo-1605661480059-884578ac8ec8?w=600&h=380&fit=crop&auto=format", readTime:"4 мин" },
  { id:"n2", tag:"Блог", date:"4 сен 2026", title:"5 маршрутов Карелии для новичков с полным приводом", excerpt:"Карелия предлагает бесконечные лесные дороги. Выбрали пять маршрутов с несложными препятствиями и красивыми видами.", img:"https://images.unsplash.com/photo-1636138103626-8057cad9c335?w=600&h=380&fit=crop&auto=format", readTime:"7 мин" },
  { id:"n3", tag:"Обзор", date:"1 сен 2026", title:"Warn VR EVO 12-S: тест лебёдки в реальных условиях Подмосковья", excerpt:"Прогнали новую лебёдку через три дня болот и песка. Честный отзыв без рекламных купюр.", img:"https://images.unsplash.com/photo-1620029188962-be2c6486593d?w=600&h=380&fit=crop&auto=format", readTime:"6 мин" },
];

const CATALOG_SECTIONS = [
  { slug:"winches",   name:"Лебёдки",    icon:"⚙️", count:48,  img:"https://images.unsplash.com/photo-1620029188962-be2c6486593d?w=480&h=320&fit=crop&auto=format" },
  { slug:"tires",     name:"Шины",       icon:"🛞", count:136, img:"https://images.unsplash.com/photo-1605661480059-884578ac8ec8?w=480&h=320&fit=crop&auto=format" },
  { slug:"lift-kits", name:"Лифт-киты",  icon:"🔧", count:64,  img:"https://images.unsplash.com/photo-1640636430727-649f73271766?w=480&h=320&fit=crop&auto=format" },
  { slug:"armor",     name:"Защита",     icon:"🛡️", count:91,  img:"https://images.unsplash.com/photo-1640636430737-de4ae2656d43?w=480&h=320&fit=crop&auto=format" },
];

const STATS = [
  { v:"12 400+", l:"Участников", sub:"в 47 городах" },
  { v:"340",     l:"Клубов",    sub:"по всей России" },
  { v:"1 200",   l:"Маршрутов", sub:"с отзывами" },
  { v:"820+",    l:"Событий",   sub:"за последний год" },
];

const TYPE_COLORS: Record<string,string> = {
  "Слёт":"#e84e00", "Экспедиция":"#3a9e5f", "Соревнование":"#4c75a3",
};

// ── Hero ──────────────────────────────────────────────────────

function Hero({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  const [slide, setSlide] = useState(0);
  const slides = [
    { headline:"ГРЯЗЬ —\nЭТО\nСВОБОДА", sub:"Крупнейший портал бездорожья России. Клубы, события, маршруты.", img:"https://images.unsplash.com/photo-1772389192562-f4196bfcb4a4?w=1600&h=900&fit=crop&auto=format" },
    { headline:"НАЙДИ\nСВОЙ\nМАРШРУТ", sub:"Более 1 200 маршрутов по всей стране с отзывами и треками.", img:"https://images.unsplash.com/photo-1636138103626-8057cad9c335?w=1600&h=900&fit=crop&auto=format" },
    { headline:"ВСТУПИ\nВ КЛУБ", sub:"340 активных клубов ищут новых участников. Найди своих.", img:"https://images.unsplash.com/photo-1765519333785-892ba0e85e91?w=1600&h=900&fit=crop&auto=format" },
  ];

  useEffect(()=>{
    const t = setInterval(()=>setSlide(s=>(s+1)%slides.length), 5000);
    return ()=>clearInterval(t);
  }, []);

  const s = slides[slide];

  return (
    <section style={{ position:"relative", height:"90vh", minHeight:560, overflow:"hidden", background:"#0e0c0a" }}>
      {/* bg image */}
      {slides.map((sl,i)=>(
        <div key={i} style={{ position:"absolute", inset:0, opacity:i===slide?1:0, transition:"opacity 1s ease", backgroundImage:`url(${sl.img})`, backgroundSize:"cover", backgroundPosition:"center" }}/>
      ))}
      {/* dark gradient overlay */}
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(110deg, rgba(10,8,6,0.88) 0%, rgba(10,8,6,0.55) 55%, rgba(10,8,6,0.2) 100%)" }}/>
      {/* orange accent stripe left */}
      <div style={{ position:"absolute", left:0, top:0, bottom:0, width:5, background:"#e84e00" }}/>

      {/* content */}
      <div style={{ position:"relative", zIndex:2, maxWidth:1400, margin:"0 auto", padding:"0 60px", height:"100%", display:"flex", flexDirection:"column", justifyContent:"center" }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.4em", textTransform:"uppercase", color:"#e84e00", marginBottom:20 }}>
          Портал бездорожья России
        </div>
        <h1 key={slide} style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:"clamp(64px,9vw,130px)", letterSpacing:"0.02em", textTransform:"uppercase", color:"#fff", lineHeight:0.9, margin:"0 0 32px", whiteSpace:"pre-line", animation:"heroFadeIn 0.7s ease" }}>
          {s.headline}
        </h1>
        <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:17, color:"rgba(255,255,255,0.65)", maxWidth:480, lineHeight:1.6, margin:"0 0 40px" }}>
          {s.sub}
        </p>
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <button onClick={()=>navigate("/events")} style={{ padding:"14px 32px", background:"#e84e00", border:"none", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, letterSpacing:"0.2em", textTransform:"uppercase", color:"#fff", transition:"background 0.15s" }}
            onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.background="#d44000"}
            onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.background="#e84e00"}
          >Найти событие</button>
          <button onClick={()=>navigate("/clubs")} style={{ padding:"14px 32px", background:"transparent", border:"1.5px solid rgba(255,255,255,0.35)", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(255,255,255,0.85)", transition:"all 0.15s" }}
            onMouseEnter={e=>{ (e.currentTarget as HTMLButtonElement).style.borderColor="#fff"; (e.currentTarget as HTMLButtonElement).style.color="#fff"; }}
            onMouseLeave={e=>{ (e.currentTarget as HTMLButtonElement).style.borderColor="rgba(255,255,255,0.35)"; (e.currentTarget as HTMLButtonElement).style.color="rgba(255,255,255,0.85)"; }}
          >Все клубы</button>
        </div>

        {/* slide dots */}
        <div style={{ display:"flex", gap:8, marginTop:48 }}>
          {slides.map((_,i)=>(
            <button key={i} onClick={()=>setSlide(i)} style={{ width:i===slide?28:8, height:8, background:i===slide?"#e84e00":"rgba(255,255,255,0.25)", border:"none", cursor:"pointer", padding:0, transition:"all 0.3s" }}/>
          ))}
        </div>
      </div>

      {/* scroll hint */}
      <div style={{ position:"absolute", bottom:32, right:60, display:"flex", alignItems:"center", gap:8, zIndex:2 }}>
        <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(255,255,255,0.3)" }}>Прокрутить</span>
        <div style={{ width:1, height:40, background:"rgba(255,255,255,0.2)" }}/>
      </div>

      <style>{`@keyframes heroFadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </section>
  );
}

// ── Stats bar ─────────────────────────────────────────────────

function StatsBar() {
  return (
    <div style={{ background:"#1a1612", borderBottom:"3px solid #e84e00" }}>
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 60px", display:"grid", gridTemplateColumns:"repeat(4,1fr)" }}>
        {STATS.map((s,i)=>(
          <div key={s.l} style={{ padding:"28px 0", borderRight:i<3?"1px solid rgba(255,255,255,0.08)":"none", textAlign:"center" }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:38, color:"#e84e00", lineHeight:1 }}>{s.v}</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, letterSpacing:"0.18em", textTransform:"uppercase", color:"#fff", marginTop:4 }}>{s.l}</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(255,255,255,0.35)", marginTop:2 }}>{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Section header ────────────────────────────────────────────

function SectionHeader({ eyebrow, title, action, onAction }: { eyebrow:string; title:string; action?:string; onAction?:()=>void }) {
  return (
    <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:32, gap:16 }}>
      <div>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.32em", textTransform:"uppercase", color:"#e84e00", marginBottom:6 }}>{eyebrow}</div>
        <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:"clamp(28px,4vw,44px)", letterSpacing:"0.04em", textTransform:"uppercase", color:"#1a1612", lineHeight:0.95, margin:0 }}>{title}</h2>
      </div>
      {action && (
        <button onClick={onAction} style={{ flexShrink:0, display:"flex", alignItems:"center", gap:8, padding:"10px 20px", border:"1.5px solid #d6d0c8", background:"transparent", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:"#6b6357", transition:"all 0.15s" }}
          onMouseEnter={e=>{ (e.currentTarget as HTMLButtonElement).style.borderColor="#e84e00"; (e.currentTarget as HTMLButtonElement).style.color="#e84e00"; }}
          onMouseLeave={e=>{ (e.currentTarget as HTMLButtonElement).style.borderColor="#d6d0c8"; (e.currentTarget as HTMLButtonElement).style.color="#6b6357"; }}
        >
          {action} →
        </button>
      )}
    </div>
  );
}

// ── Events ────────────────────────────────────────────────────

function EventsSection({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  return (
    <section style={{ padding:"80px 0", background:"#f5f2ee" }}>
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 60px" }}>
        <SectionHeader eyebrow="Ближайшие события" title={"Куда\nехать?"} action="Все события" onAction={()=>navigate("/events")}/>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:16 }}>
          {FEATURED_EVENTS.map((ev, i)=>{
            const typeColor = TYPE_COLORS[ev.type] ?? "#6b6357";
            const big = i===0;
            return (
              <div key={ev.id} onClick={()=>navigate("/events/"+ev.id)} style={{ position:"relative", overflow:"hidden", cursor:"pointer", background:"#1a1612", gridRow:big?"span 1":undefined }}
                onMouseEnter={e=>{ (e.currentTarget as HTMLElement).querySelector(".ev-img")!.setAttribute("style","transform:scale(1.05);transition:transform 0.5s ease"); }}
                onMouseLeave={e=>{ (e.currentTarget as HTMLElement).querySelector(".ev-img")!.setAttribute("style","transform:scale(1);transition:transform 0.5s ease"); }}
              >
                <div className="ev-img" style={{ width:"100%", height:big?420:200, backgroundImage:`url(${ev.img})`, backgroundSize:"cover", backgroundPosition:"center", transition:"transform 0.5s ease" }}/>
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(10,8,6,0.9) 0%, rgba(10,8,6,0.3) 60%, transparent 100%)" }}/>
                {/* type badge */}
                <div style={{ position:"absolute", top:16, left:16, display:"flex", gap:8, alignItems:"center" }}>
                  <span style={{ background:typeColor, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.22em", textTransform:"uppercase", color:"#fff", padding:"3px 10px" }}>{ev.type}</span>
                </div>
                {/* content */}
                <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:big?"24px 24px 22px":"16px 18px 18px" }}>
                  <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:8, flexWrap:"wrap" }}>
                    <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:big?13:11, letterSpacing:"0.12em", textTransform:"uppercase", color:"#e84e00" }}>{ev.date}</span>
                    <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:big?11:10, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(255,255,255,0.5)" }}>{ev.location}</span>
                  </div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:big?26:17, letterSpacing:"0.04em", textTransform:"uppercase", color:"#fff", lineHeight:1.05, marginBottom:12 }}>{ev.title}</div>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
                    <div>
                      <div style={{ height:3, background:"rgba(255,255,255,0.15)", marginBottom:4, maxWidth:120 }}>
                        <div style={{ height:"100%", background:"#e84e00", width:`${(ev.participants/ev.max)*100}%` }}/>
                      </div>
                      <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.16em", textTransform:"uppercase", color:"rgba(255,255,255,0.4)" }}>{ev.participants} / {ev.max} чел.</span>
                    </div>
                    <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:big?16:13, color:"#fff" }}>{ev.fee}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Clubs ─────────────────────────────────────────────────────

function ClubsSection({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  return (
    <section style={{ padding:"80px 0", background:"#fff" }}>
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 60px" }}>
        <SectionHeader eyebrow="Сообщество" title={"Клубы\nБездорожья"} action="Все клубы" onAction={()=>navigate("/")}/>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
          {FEATURED_CLUBS.map(club=>(
            <div key={club.id} style={{ overflow:"hidden", cursor:"pointer", border:"1.5px solid #ede9e2", transition:"border-color 0.15s, box-shadow 0.15s" }}
              onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.borderColor=club.accent; (e.currentTarget as HTMLElement).style.boxShadow=`0 4px 24px ${club.accent}22`; }}
              onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.borderColor="#ede9e2"; (e.currentTarget as HTMLElement).style.boxShadow="none"; }}
            >
              {/* image */}
              <div style={{ position:"relative", height:160, overflow:"hidden", background:"#1a1612" }}>
                <img src={club.img} alt={club.name} style={{ width:"100%", height:"100%", objectFit:"cover", opacity:0.8, transition:"transform 0.4s ease" }}
                  onMouseEnter={e=>(e.currentTarget as HTMLImageElement).style.transform="scale(1.05)"}
                  onMouseLeave={e=>(e.currentTarget as HTMLImageElement).style.transform="scale(1)"}
                />
                <div style={{ position:"absolute", bottom:0, left:0, right:0, height:60, background:"linear-gradient(to top, rgba(10,8,6,0.7), transparent)" }}/>
                <div style={{ position:"absolute", top:12, left:12, width:36, height:36, background:club.accent, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:14, color:"#fff" }}>{club.name[0]}</span>
                </div>
              </div>
              {/* info */}
              <div style={{ padding:"16px 18px 18px", background:"#fff" }}>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:17, letterSpacing:"0.04em", textTransform:"uppercase", color:"#1a1612", lineHeight:1, marginBottom:4 }}>{club.name}</div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", color:"#aaa49e", marginBottom:14 }}>{club.city}</div>
                <div style={{ display:"flex", gap:0, borderTop:"1px solid #f0ece6", paddingTop:12 }}>
                  {[{ v:club.members, l:"Участников" },{ v:club.routes, l:"Маршрутов" }].map((s,i)=>(
                    <div key={s.l} style={{ flex:1, paddingRight:i===0?12:0, borderRight:i===0?"1px solid #f0ece6":"none", paddingLeft:i===1?12:0 }}>
                      <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:22, color:club.accent, lineHeight:1 }}>{s.v}</div>
                      <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", color:"#aaa49e", marginTop:2 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Catalog promo ─────────────────────────────────────────────

function CatalogSection({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  return (
    <section style={{ padding:"80px 0", background:"#1a1612" }}>
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 60px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:60, alignItems:"center" }}>
          {/* text */}
          <div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.36em", textTransform:"uppercase", color:"#e84e00", marginBottom:16 }}>Магазин</div>
            <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:"clamp(36px,5vw,64px)", letterSpacing:"0.03em", textTransform:"uppercase", color:"#fff", lineHeight:0.95, margin:"0 0 24px" }}>
              ВСЁ ДЛЯ<br/>БЕЗДОРОЖЬЯ
            </h2>
            <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:16, color:"rgba(255,255,255,0.5)", lineHeight:1.7, marginBottom:32 }}>
              Лебёдки, шины, лифт-киты, защита, освещение — только проверенное оборудование от ведущих мировых брендов.
            </p>
            <div style={{ display:"flex", gap:10, marginBottom:40, flexWrap:"wrap" }}>
              {["Warn","BFGoodrich","OME","Rigid","ARB"].map(b=>(
                <span key={b} style={{ padding:"6px 16px", border:"1px solid rgba(255,255,255,0.15)", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", color:"rgba(255,255,255,0.4)" }}>{b}</span>
              ))}
            </div>
            <button onClick={()=>navigate("/catalog")} style={{ padding:"14px 32px", background:"#e84e00", border:"none", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, letterSpacing:"0.2em", textTransform:"uppercase", color:"#fff" }}
              onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.background="#d44000"}
              onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.background="#e84e00"}
            >Перейти в каталог</button>
          </div>
          {/* category grid */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:3 }}>
            {CATALOG_SECTIONS.map(cat=>(
              <div key={cat.slug} onClick={()=>navigate("/catalog/"+cat.slug)} style={{ position:"relative", height:180, overflow:"hidden", cursor:"pointer" }}
                onMouseEnter={e=>(e.currentTarget as HTMLElement).querySelector("img")!.style.transform="scale(1.07)"}
                onMouseLeave={e=>(e.currentTarget as HTMLElement).querySelector("img")!.style.transform="scale(1)"}
              >
                <img src={cat.img} alt={cat.name} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.4s ease" }}/>
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(10,8,6,0.85) 0%, rgba(10,8,6,0.2) 100%)" }}/>
                <div style={{ position:"absolute", bottom:14, left:14 }}>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:16, letterSpacing:"0.06em", textTransform:"uppercase", color:"#fff" }}>{cat.name}</div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(255,255,255,0.45)", marginTop:2 }}>{cat.count} товаров</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── News / Blog ───────────────────────────────────────────────

function NewsSection({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  const [hovered, setHovered] = useState<string|null>(null);
  return (
    <section style={{ padding:"80px 0", background:"#f5f2ee" }}>
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 60px" }}>
        <SectionHeader eyebrow="Медиа" title={"Новости\nи блог"} action="Все материалы" onAction={()=>navigate("/news")}/>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:20 }}>
          {NEWS.map((n,i)=>{
            const big = i===0;
            return (
              <div key={n.id} onClick={()=>navigate("/news")} style={{ cursor:"pointer", background:"#fff", border:"1.5px solid #ede9e2", overflow:"hidden", transition:"box-shadow 0.2s", boxShadow:hovered===n.id?"0 8px 32px rgba(26,22,18,0.1)":"none" }}
                onMouseEnter={()=>setHovered(n.id)}
                onMouseLeave={()=>setHovered(null)}
              >
                <div style={{ height:big?240:180, overflow:"hidden", background:"#1a1612" }}>
                  <img src={n.img} alt={n.title} style={{ width:"100%", height:"100%", objectFit:"cover", opacity:0.9, transition:"transform 0.4s ease, opacity 0.3s", transform:hovered===n.id?"scale(1.04)":"scale(1)" }}/>
                </div>
                <div style={{ padding:"20px 22px 22px" }}>
                  <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:12 }}>
                    <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:"#e84e00", background:"#fff8f5", padding:"3px 8px", border:"1px solid #ffd4c0" }}>{n.tag}</span>
                    <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:"#aaa49e" }}>{n.date}</span>
                    <span style={{ marginLeft:"auto", fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.12em", textTransform:"uppercase", color:"#ccc5bf" }}>{n.readTime}</span>
                  </div>
                  <h3 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:big?20:17, letterSpacing:"0.03em", textTransform:"uppercase", color:"#1a1612", lineHeight:1.1, margin:"0 0 10px" }}>{n.title}</h3>
                  <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:13, color:"#6b6357", lineHeight:1.6, margin:0 }}>{n.excerpt}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Community CTA ─────────────────────────────────────────────

function CommunityCTA({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  return (
    <section style={{ position:"relative", overflow:"hidden", background:"#0e0c0a" }}>
      <img src="https://images.unsplash.com/photo-1773522918526-19adcbba988d?w=1600&h=500&fit=crop&auto=format" alt="Off-road trail" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", opacity:0.18 }}/>
      {/* diagonal accent */}
      <div style={{ position:"absolute", top:0, right:0, width:"40%", height:"100%", background:"linear-gradient(135deg, transparent 40%, rgba(232,78,0,0.08) 100%)" }}/>
      <div style={{ position:"relative", zIndex:2, maxWidth:1400, margin:"0 auto", padding:"80px 60px", display:"grid", gridTemplateColumns:"1fr auto", alignItems:"center", gap:40 }}>
        <div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.36em", textTransform:"uppercase", color:"#e84e00", marginBottom:12 }}>Присоединяйся</div>
          <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:"clamp(36px,5vw,60px)", letterSpacing:"0.03em", textTransform:"uppercase", color:"#fff", lineHeight:0.95, margin:"0 0 16px" }}>
            ТВОЙ СЛЕДУЮЩИЙ<br/>МАРШРУТ ЖДЁТ
          </h2>
          <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:16, color:"rgba(255,255,255,0.45)", lineHeight:1.6, margin:0, maxWidth:500 }}>
            Регистрируйся бесплатно — находи маршруты, вступай в клубы, участвуй в событиях и делись опытом с 12 000+ единомышленников.
          </p>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:12, flexShrink:0 }}>
          <button onClick={()=>navigate("/lk")} style={{ padding:"16px 40px", background:"#e84e00", border:"none", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, letterSpacing:"0.2em", textTransform:"uppercase", color:"#fff" }}
            onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.background="#d44000"}
            onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.background="#e84e00"}
          >Создать аккаунт</button>
          <button onClick={()=>navigate("/about")} style={{ padding:"14px 40px", background:"transparent", border:"1.5px solid rgba(255,255,255,0.2)", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(255,255,255,0.55)", transition:"all 0.15s" }}
            onMouseEnter={e=>{ (e.currentTarget as HTMLButtonElement).style.borderColor="rgba(255,255,255,0.5)"; (e.currentTarget as HTMLButtonElement).style.color="rgba(255,255,255,0.9)"; }}
            onMouseLeave={e=>{ (e.currentTarget as HTMLButtonElement).style.borderColor="rgba(255,255,255,0.2)"; (e.currentTarget as HTMLButtonElement).style.color="rgba(255,255,255,0.55)"; }}
          >Узнать подробнее</button>
        </div>
      </div>
    </section>
  );
}

// ── Main ──────────────────────────────────────────────────────

export function HomePage() {
  const navigate = useNavigate();
  return (
    <div>
      <Hero navigate={navigate}/>
      <StatsBar/>
      <EventsSection navigate={navigate}/>
      <ClubsSection navigate={navigate}/>
      <CatalogSection navigate={navigate}/>
      <NewsSection navigate={navigate}/>
      <CommunityCTA navigate={navigate}/>
    </div>
  );
}
