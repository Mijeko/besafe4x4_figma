import { useState } from "react";

const CATEGORIES = ["Все", "Маршруты", "Техника", "Экипировка", "Экспедиции", "Советы"];

const POSTS = [
  { id:1, category:"Маршруты", title:"Карелия на 4x4: маршрут по северным озёрам", excerpt:"Пять дней, 1200 км грунтовок и бродов. Полный отчёт о нашей экспедиции по брошенным лесовозным дорогам Карелии.", author:"Алексей Громов", date:"18 авг 2026", readTime:"12 мин", img:"https://images.unsplash.com/photo-1684929954083-f10c179ed96d?w=800&h=500&fit=crop&auto=format", featured:true },
  { id:2, category:"Техника", title:"Лебёдка на LC200: выбор, установка, первые 10 тысяч км", excerpt:"Разбираем три самых популярных варианта — Warn, Runva и T-MAX. Личный опыт после двух сезонов жёсткого бездорожья.", author:"Михаил Петров", date:"12 авг 2026", readTime:"8 мин", img:"https://images.unsplash.com/photo-1579271723430-d600366f032f?w=600&h=380&fit=crop&auto=format", featured:false },
  { id:3, category:"Экспедиции", title:"Алтай за 14 дней: от Новосибирска до Монгольской границы", excerpt:"Маршрут через Чуйский тракт, Курайскую степь и плато Укок. Что взять, что ожидать и как не застрять на сотни километров от цивилизации.", author:"Команда Тундра", date:"5 авг 2026", readTime:"18 мин", img:"https://images.unsplash.com/photo-1640636430737-de4ae2656d43?w=600&h=380&fit=crop&auto=format", featured:false },
  { id:4, category:"Экипировка", title:"Базовый набор для первого серьёзного выезда", excerpt:"Лопата, хай-джек, сэнд-треки и сигнальные огни — что реально спасёт, а что займёт место зря.", author:"Дмитрий Волков", date:"29 июл 2026", readTime:"6 мин", img:"https://images.unsplash.com/photo-1620029188962-be2c6486593d?w=600&h=380&fit=crop&auto=format", featured:false },
  { id:5, category:"Советы", title:"Как выбрать шины для бездорожья: MT vs AT vs грязевые", excerpt:"Сравниваем в реальных условиях. Болото, снег, камни — где какая резина выигрывает и проигрывает.", author:"Иван Морозов", date:"21 июл 2026", readTime:"10 мин", img:"https://images.unsplash.com/photo-1596507931135-75f699668356?w=600&h=380&fit=crop&auto=format", featured:false },
  { id:6, category:"Маршруты", title:"Кольский полуостров зимой: когда минус 30 — это нормально", excerpt:"Ледовые переправы, замёрзшие реки и северное сияние. Зимняя экспедиция на Кольский — для тех, кто уже видел всё остальное.", author:"Наталья Рыжова", date:"14 июл 2026", readTime:"14 мин", img:"https://images.unsplash.com/photo-1500921726673-e4bdc09efa55?w=600&h=380&fit=crop&auto=format", featured:false },
  { id:7, category:"Техника", title:"Лифт подвески: мифы и реальность", excerpt:"Стоит ли поднимать LC200 на 5 сантиметров? Разбираем плюсы, минусы и что происходит с управляемостью на шоссе.", author:"Сергей Бондарев", date:"7 июл 2026", readTime:"9 мин", img:"https://images.unsplash.com/photo-1579097648137-4b19188fdb4e?w=600&h=380&fit=crop&auto=format", featured:false },
];

function FeaturedPost({ post }: { post: typeof POSTS[0] }) {
  return (
    <article className="relative overflow-hidden group cursor-pointer" style={{ height:440, background:"#1a1612" }}>
      <img src={post.img} alt={post.title} className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"/>
      <div className="absolute inset-0" style={{ background:"linear-gradient(to top, rgba(26,22,18,0.92) 0%, rgba(26,22,18,0.3) 60%, transparent 100%)" }}/>
      <div className="absolute inset-0 flex flex-col justify-end p-10">
        <div className="flex items-center gap-3 mb-4">
          <span style={{ background:"#e84e00", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:"#fff", padding:"3px 10px" }}>{post.category}</span>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, letterSpacing:"0.1em", color:"rgba(255,255,255,0.5)", textTransform:"uppercase" }}>Редакторский выбор</span>
        </div>
        <h2 className="group-hover:text-[#e84e00] transition-colors" style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:38, letterSpacing:"0.04em", textTransform:"uppercase", color:"#fff", lineHeight:1.05, margin:"0 0 12px", maxWidth:700 }}>{post.title}</h2>
        <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:14, color:"rgba(255,255,255,0.65)", lineHeight:1.6, maxWidth:600, margin:"0 0 16px" }}>{post.excerpt}</p>
        <div className="flex items-center gap-4">
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, letterSpacing:"0.08em", color:"rgba(255,255,255,0.5)", textTransform:"uppercase" }}>{post.author}</span>
          <span style={{ color:"rgba(255,255,255,0.25)" }}>·</span>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, letterSpacing:"0.08em", color:"rgba(255,255,255,0.5)", textTransform:"uppercase" }}>{post.date}</span>
          <span style={{ color:"rgba(255,255,255,0.25)" }}>·</span>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, letterSpacing:"0.08em", color:"rgba(255,255,255,0.5)", textTransform:"uppercase" }}>{post.readTime} чтения</span>
        </div>
      </div>
    </article>
  );
}

function PostCard({ post }: { post: typeof POSTS[0] }) {
  return (
    <article className="flex flex-col bg-white border overflow-hidden group cursor-pointer transition-all" style={{ borderColor:"#ece8e3" }}
      onMouseEnter={e=>(e.currentTarget as HTMLElement).style.borderColor="#e84e00"}
      onMouseLeave={e=>(e.currentTarget as HTMLElement).style.borderColor="#ece8e3"}
    >
      <div style={{ height:200, overflow:"hidden", background:"#e0dbd4", position:"relative" }}>
        <img src={post.img} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
        <span style={{ position:"absolute", top:12, left:12, background:"#e84e00", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:"#fff", padding:"3px 9px" }}>{post.category}</span>
      </div>
      <div style={{ padding:"20px 20px 24px", display:"flex", flexDirection:"column", flex:1, gap:10 }}>
        <h3 className="group-hover:text-[#e84e00] transition-colors" style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:18, letterSpacing:"0.04em", textTransform:"uppercase", color:"#1a1612", lineHeight:1.15, margin:0 }}>{post.title}</h3>
        <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:13, color:"#8c8480", lineHeight:1.55, margin:0, flex:1 }}>{post.excerpt}</p>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:10, borderTop:"1px solid #f0ece8" }}>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, letterSpacing:"0.08em", color:"#aaa49e", textTransform:"uppercase" }}>{post.author} · {post.date}</span>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, letterSpacing:"0.08em", color:"#aaa49e", textTransform:"uppercase" }}>{post.readTime}</span>
        </div>
      </div>
    </article>
  );
}

export function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("Все");
  const featured = POSTS.find(p=>p.featured)!;
  const filtered = POSTS.filter(p=>!p.featured && (activeCategory==="Все" || p.category===activeCategory));

  return (
    <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 24px 72px" }}>

      {/* Hero featured */}
      <div style={{ margin:"0 -24px 0" }}>
        <FeaturedPost post={featured}/>
      </div>

      {/* Filters */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid #e8e4df", margin:"40px 0 32px" }}>
        <div style={{ display:"flex" }}>
          {CATEGORIES.map(c=>(
            <button key={c} onClick={()=>setActiveCategory(c)} style={{ position:"relative", padding:"10px 20px", background:"none", border:"none", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:activeCategory===c?700:500, fontSize:13, letterSpacing:"0.14em", textTransform:"uppercase", color:activeCategory===c?"#1a1612":"#8c8480" }}>
              {c}
              {activeCategory===c && <span style={{ position:"absolute", bottom:0, left:0, width:"100%", height:2, background:"#e84e00" }}/>}
            </button>
          ))}
        </div>
        <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, letterSpacing:"0.1em", color:"#aaa49e", textTransform:"uppercase" }}>{filtered.length} материал{filtered.length===1?"":"ов"}</span>
      </div>

      {/* Grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:24 }}>
        {filtered.map(p=><PostCard key={p.id} post={p}/>)}
      </div>

      <div style={{ display:"flex", justifyContent:"center", marginTop:48 }}>
        <button className="hover:border-[#e84e00] hover:text-[#e84e00] transition-all" style={{ padding:"12px 40px", border:"1px solid #d6d0c8", background:"transparent", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, letterSpacing:"0.18em", textTransform:"uppercase", color:"#6b6357", cursor:"pointer" }}>
          Загрузить ещё
        </button>
      </div>
    </div>
  );
}
