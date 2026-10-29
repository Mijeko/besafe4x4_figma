import { useState } from "react";

const NEWS = [
  { id:1, date:"22 авг 2026", tag:"Событие", title:"Фестиваль «Бездорожье 2026» собрал рекордные 3000 участников", body:"Ежегодный фестиваль прошёл в Подмосковье и стал крупнейшим в истории. Более 800 подготовленных автомобилей, 40 трасс разного уровня сложности.", img:"https://images.unsplash.com/photo-1640636430727-649f73271766?w=700&h=420&fit=crop&auto=format", hot:true },
  { id:2, date:"19 авг 2026", tag:"Платформа", title:"Запущен новый раздел «Живая карта маршрутов»", body:"Теперь участники могут оставлять треки своих поездок прямо с телефона. Более 2400 маршрутов уже загружено в базу.", img:"https://images.unsplash.com/photo-1574410446540-0296ae8ebed7?w=700&h=420&fit=crop&auto=format", hot:false },
  { id:3, date:"15 авг 2026", tag:"Клубы", title:"Клуб «Стальные волки» открыл набор новых участников", body:"Один из крупнейших off-road клубов Москвы объявил о расширении. Приём заявок открыт до 1 сентября 2026.", img:"https://images.unsplash.com/photo-1779534783297-93343815de3e?w=700&h=420&fit=crop&auto=format", hot:false },
  { id:4, date:"10 авг 2026", tag:"Техника", title:"Toyota анонсировала GR Land Cruiser для экстремального офф-роуда", body:"Новая модель с усиленной рамой, заводским лифтом и блокировками на всех осях. Начало продаж в России запланировано на весну 2027.", img:"https://images.unsplash.com/photo-1599413142605-dbf742e4c5b9?w=700&h=420&fit=crop&auto=format", hot:true },
  { id:5, date:"5 авг 2026", tag:"Сообщество", title:"Итоги голосования: лучший маршрут лета — Кольский полуостров", body:"Пользователи проголосовали за маршрут, составленный командой «Северная экспедиция». Трек уже доступен для скачивания.", img:"https://images.unsplash.com/photo-1605661480059-884578ac8ec8?w=700&h=420&fit=crop&auto=format", hot:false },
  { id:6, date:"1 авг 2026", tag:"Событие", title:"Открыта регистрация на «Осеннее бездорожье — 2026»", body:"Ежегодный осенний слёт пройдёт в Ленинградской области. 200 мест, 5 трасс, полевой лагерь и ночные гонки.", img:"https://images.unsplash.com/photo-1626436808209-c5093d1a0f75?w=700&h=420&fit=crop&auto=format", hot:false },
];

const TAGS = ["Все", "Событие", "Платформа", "Клубы", "Техника", "Сообщество"];

export function NewsPage() {
  const [activeTag, setActiveTag] = useState("Все");
  const filtered = NEWS.filter(n=> activeTag==="Все" || n.tag===activeTag);
  const [main, ...rest] = filtered;

  return (
    <div style={{ maxWidth:1280, margin:"0 auto", padding:"48px 24px 72px" }}>

      {/* header */}
      <div style={{ marginBottom:40 }}>
        <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, letterSpacing:"0.28em", textTransform:"uppercase", color:"#e84e00", marginBottom:8 }}>Последнее</p>
        <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:44, letterSpacing:"0.06em", textTransform:"uppercase", color:"#1a1612", lineHeight:1, margin:0 }}>Новости</h1>
      </div>

      {/* tags */}
      <div style={{ display:"flex", alignItems:"center", gap:0, borderBottom:"1px solid #e8e4df", marginBottom:36 }}>
        {TAGS.map(t=>(
          <button key={t} onClick={()=>setActiveTag(t)} style={{ position:"relative", padding:"10px 18px", background:"none", border:"none", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:activeTag===t?700:500, fontSize:13, letterSpacing:"0.14em", textTransform:"uppercase", color:activeTag===t?"#1a1612":"#8c8480" }}>
            {t}
            {activeTag===t && <span style={{ position:"absolute", bottom:0, left:0, width:"100%", height:2, background:"#e84e00" }}/>}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign:"center", padding:"80px 0", color:"#d6d0c8", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:28, letterSpacing:"0.08em", textTransform:"uppercase" }}>Нет новостей</div>
      )}

      {main && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:32, marginBottom:32 }}>
          {/* main big */}
          <article className="group cursor-pointer bg-white border overflow-hidden" style={{ borderColor:"#ece8e3" }}
            onMouseEnter={e=>(e.currentTarget as HTMLElement).style.borderColor="#e84e00"}
            onMouseLeave={e=>(e.currentTarget as HTMLElement).style.borderColor="#ece8e3"}
          >
            <div style={{ height:320, overflow:"hidden", background:"#e0dbd4", position:"relative" }}>
              <img src={main.img} alt={main.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
              <div style={{ position:"absolute", top:16, left:16, display:"flex", gap:8 }}>
                <span style={{ background:"#e84e00", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:"#fff", padding:"3px 10px" }}>{main.tag}</span>
                {main.hot && <span style={{ background:"#1a1612", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:"#f5a623", padding:"3px 10px" }}>🔥 Горячо</span>}
              </div>
            </div>
            <div style={{ padding:"24px 28px 28px" }}>
              <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, letterSpacing:"0.16em", textTransform:"uppercase", color:"#aaa49e", marginBottom:8 }}>{main.date}</p>
              <h2 className="group-hover:text-[#e84e00] transition-colors" style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:26, letterSpacing:"0.04em", textTransform:"uppercase", color:"#1a1612", lineHeight:1.1, margin:"0 0 12px" }}>{main.title}</h2>
              <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:14, color:"#8c8480", lineHeight:1.6, margin:0 }}>{main.body}</p>
            </div>
          </article>

          {/* sidebar list */}
          <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
            {rest.slice(0,4).map((n,i)=>(
              <article key={n.id} className="group cursor-pointer" style={{ padding:"16px 0", borderBottom:"1px solid #f0ece8", borderTop:i===0?"1px solid #f0ece8":"none" }}>
                <div style={{ display:"flex", gap:14 }}>
                  <div style={{ width:80, height:60, flexShrink:0, overflow:"hidden", background:"#e0dbd4" }}>
                    <img src={n.img} alt={n.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", gap:8, marginBottom:4 }}>
                      <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.16em", textTransform:"uppercase", color:"#e84e00" }}>{n.tag}</span>
                      <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.1em", color:"#aaa49e", textTransform:"uppercase" }}>{n.date}</span>
                    </div>
                    <h3 className="group-hover:text-[#e84e00] transition-colors" style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, letterSpacing:"0.03em", textTransform:"uppercase", color:"#1a1612", lineHeight:1.2, margin:0 }}>{n.title}</h3>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* remaining grid */}
      {rest.length > 4 && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:20 }}>
          {rest.slice(4).map(n=>(
            <article key={n.id} className="group cursor-pointer bg-white border overflow-hidden" style={{ borderColor:"#ece8e3" }}
              onMouseEnter={e=>(e.currentTarget as HTMLElement).style.borderColor="#e84e00"}
              onMouseLeave={e=>(e.currentTarget as HTMLElement).style.borderColor="#ece8e3"}
            >
              <div style={{ height:160, overflow:"hidden", background:"#e0dbd4" }}>
                <img src={n.img} alt={n.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
              </div>
              <div style={{ padding:"16px 18px 20px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", color:"#e84e00" }}>{n.tag}</span>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.1em", color:"#aaa49e", textTransform:"uppercase" }}>{n.date}</span>
                </div>
                <h3 className="group-hover:text-[#e84e00] transition-colors" style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:15, letterSpacing:"0.03em", textTransform:"uppercase", color:"#1a1612", lineHeight:1.2, margin:0 }}>{n.title}</h3>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
