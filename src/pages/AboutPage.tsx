const TEAM = [
  { name:"Артём Соловьёв", role:"Основатель & CEO", since:"2018", img:"https://images.unsplash.com/photo-1779989301546-51dedcac3912?w=400&h=400&fit=crop&auto=format&face" },
  { name:"Мария Громова", role:"Директор по сообществу", since:"2019", img:"https://images.unsplash.com/photo-1783532901532-39427b344e21?w=400&h=400&fit=crop&auto=format" },
  { name:"Денис Крылов", role:"Технический директор", since:"2018", img:"https://images.unsplash.com/photo-1574410446540-0296ae8ebed7?w=400&h=400&fit=crop&auto=format" },
  { name:"Анна Федорова", role:"Главный редактор", since:"2021", img:"https://images.unsplash.com/photo-1750425694093-7a063385c884?w=400&h=400&fit=crop&auto=format" },
];

const STATS = [
  { value:"48 000+", label:"Участников" },
  { value:"620+", label:"Автоклубов" },
  { value:"3 200+", label:"Маршрутов" },
  { value:"8", label:"Лет в движении" },
];

const VALUES = [
  { icon:"🛞", title:"Взаимовыручка", text:"Никто не уезжает с трассы без помощи. Это главный закон бездорожья — и нашего сообщества." },
  { icon:"🗺", title:"Исследование", text:"Мы верим, что за каждым горизонтом есть что-то стоящее. Карты — только начало." },
  { icon:"🔧", title:"Подготовка", text:"Хорошо подготовленный автомобиль — это уважение к себе, спутникам и природе." },
  { icon:"🌲", title:"Экология", text:"Оставляем природу чище, чем нашли. Убираем за собой и за другими — без исключений." },
];

export function AboutPage() {
  return (
    <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 0 80px" }}>

      {/* Hero */}
      <div style={{ position:"relative", height:480, background:"#1a1612", overflow:"hidden" }}>
        <img src="https://images.unsplash.com/photo-1640636430737-de4ae2656d43?w=1400&h=600&fit=crop&auto=format" alt="О нас" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", opacity:0.45 }}/>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right,rgba(26,22,18,0.85) 40%,rgba(26,22,18,0.3))" }}/>
        <div style={{ position:"relative", maxWidth:1280, margin:"0 auto", padding:"0 24px", height:"100%", display:"flex", flexDirection:"column", justifyContent:"center" }}>
          <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, letterSpacing:"0.28em", textTransform:"uppercase", color:"#e84e00", marginBottom:12 }}>С 2018 года</p>
          <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:56, letterSpacing:"0.06em", textTransform:"uppercase", color:"#fff", lineHeight:1, margin:"0 0 20px", maxWidth:600 }}>Мы — крупнейшее OFF&#8209;ROAD сообщество России</h1>
          <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:16, color:"rgba(255,255,255,0.65)", lineHeight:1.65, maxWidth:520, margin:0 }}>Объединяем людей, которые выбирают грязь вместо асфальта. Маршруты, клубы, экспедиции и живое общение — всё в одном месте.</p>
        </div>
      </div>

      <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 24px" }}>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:0, margin:"0 0 72px", borderBottom:"1px solid #ece8e3" }}>
          {STATS.map((s,i)=>(
            <div key={s.label} style={{ padding:"40px 0 36px 40px", borderRight:i<3?"1px solid #ece8e3":"none" }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:48, letterSpacing:"0.04em", textTransform:"uppercase", color:"#e84e00", lineHeight:1 }}>{s.value}</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, letterSpacing:"0.2em", textTransform:"uppercase", color:"#aaa49e", marginTop:6 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"center", marginBottom:72 }}>
          <div>
            <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, letterSpacing:"0.28em", textTransform:"uppercase", color:"#e84e00", marginBottom:12 }}>Миссия</p>
            <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:38, letterSpacing:"0.05em", textTransform:"uppercase", color:"#1a1612", lineHeight:1.1, margin:"0 0 20px" }}>Бездорожье как стиль жизни, а не увлечение</h2>
            <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:15, color:"#6b6357", lineHeight:1.7, margin:"0 0 16px" }}>Мы создали платформу, где водители от новичков до экспертов могут находить маршруты, вступать в клубы, участвовать в событиях и делиться опытом.</p>
            <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:15, color:"#6b6357", lineHeight:1.7, margin:0 }}>Каждый выезд — это история. Мы помогаем её написать.</p>
          </div>
          <div style={{ position:"relative" }}>
            <img src="https://images.unsplash.com/photo-1620029188962-be2c6486593d?w=600&h=420&fit=crop&auto=format" alt="Миссия" style={{ width:"100%", display:"block" }}/>
            <div style={{ position:"absolute", bottom:-16, left:-16, width:120, height:120, background:"#e84e00", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:13, letterSpacing:"0.18em", textTransform:"uppercase", color:"#fff", textAlign:"center", lineHeight:1.3 }}>8 лет<br/>в пути</span>
            </div>
          </div>
        </div>

        {/* Values */}
        <div style={{ marginBottom:72 }}>
          <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, letterSpacing:"0.28em", textTransform:"uppercase", color:"#e84e00", marginBottom:12 }}>Ценности</p>
          <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:38, letterSpacing:"0.05em", textTransform:"uppercase", color:"#1a1612", lineHeight:1, margin:"0 0 36px" }}>Во что мы верим</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:0, border:"1px solid #ece8e3" }}>
            {VALUES.map((v,i)=>(
              <div key={v.title} style={{ padding:"36px 28px", borderRight:i<3?"1px solid #ece8e3":"none" }}>
                <div style={{ fontSize:28, marginBottom:16 }}>{v.icon}</div>
                <h3 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:18, letterSpacing:"0.05em", textTransform:"uppercase", color:"#1a1612", margin:"0 0 10px" }}>{v.title}</h3>
                <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:13, color:"#8c8480", lineHeight:1.6, margin:0 }}>{v.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, letterSpacing:"0.28em", textTransform:"uppercase", color:"#e84e00", marginBottom:12 }}>Люди</p>
          <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:38, letterSpacing:"0.05em", textTransform:"uppercase", color:"#1a1612", lineHeight:1, margin:"0 0 36px" }}>Команда</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:24 }}>
            {TEAM.map(m=>(
              <div key={m.name} className="group" style={{ background:"#fff", border:"1px solid #ece8e3", overflow:"hidden" }}>
                <div style={{ height:220, overflow:"hidden", background:"#e0dbd4" }}>
                  <img src={m.img} alt={m.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                </div>
                <div style={{ padding:"16px 18px 20px" }}>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:17, letterSpacing:"0.04em", textTransform:"uppercase", color:"#1a1612", lineHeight:1 }}>{m.name}</div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color:"#e84e00", marginTop:4 }}>{m.role}</div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:"#aaa49e", marginTop:2 }}>с {m.since}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
