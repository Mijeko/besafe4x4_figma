import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";

// ── Shared data (mirrors EventsPage, would normally be in a shared module) ──

type Event = {
  id: number; title: string; date: string; day: number; month: string; monthNum: number; year: number;
  location: string; city: string; type: string; typeColor: string; difficulty: string;
  participants: number; maxParticipants: number; img: string; registered: boolean;
  description: string; organizer: string; organizerAvatar: string;
  schedule: { time: string; label: string }[];
  requirements: string[];
  gallery: string[];
  fee: string;
};

const EVENTS: Event[] = [
  {
    id: 1, day: 2, month: "Сен", monthNum: 9, year: 2026,
    title: "Осеннее бездорожье 2026",
    date: "2–4 сентября 2026",
    location: "Ленинградская обл., Тихвинский р-н",
    city: "Санкт-Петербург",
    type: "Слёт", typeColor: "#e84e00",
    participants: 134, maxParticipants: 200,
    difficulty: "Средний",
    img: "https://images.unsplash.com/photo-1640636430737-de4ae2656d43?w=1400&h=640&fit=crop&auto=format",
    registered: true,
    fee: "4 200 ₽ / экипаж",
    organizer: "Стальные Волки",
    organizerAvatar: "https://images.unsplash.com/photo-1579271723430-d600366f032f?w=80&h=80&fit=crop&auto=format",
    description: "Ежегодный осенний слёт любителей бездорожья в живописном Тихвинском районе. Три дня в полевом лагере, ночные трофи-трассы, командные гонки по грязи и торфяным болотам. Маршруты от «Зелёного» (для новичков) до «Чёрного» (экстремал). Организовано клубом «Стальные Волки» при поддержке администрации Ленобласти.",
    schedule: [
      { time: "Пт 12:00", label: "Открытие полевого лагеря, регистрация участников" },
      { time: "Пт 18:00", label: "Техосмотр машин и брифинг по трассам" },
      { time: "Пт 21:00", label: "Ночной трофи-спецучасток (по желанию)" },
      { time: "Сб 09:00", label: "Старт дневных трасс — «Зелёная» и «Жёлтая»" },
      { time: "Сб 14:00", label: "Обед, свободное время, мойка техники" },
      { time: "Сб 17:00", label: "Трасса «Чёрная» — хардкор для опытных" },
      { time: "Сб 20:00", label: "Вечеринка у костра, награждения" },
      { time: "Вс 10:00", label: "Экспедиционный маршрут вдоль реки Тихвинки" },
      { time: "Вс 16:00", label: "Закрытие слёта, разъезд" },
    ],
    requirements: [
      "Полный привод, буксировочные проушины обязательны",
      "Трос или сдёргивающий ремень у каждого экипажа",
      "Огнетушитель в салоне",
      "Аптечка и запасное колесо",
      "Для «Чёрной» трассы — боковые упоры или стальной бампер",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1596507931135-75f699668356?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1654162456768-ebf2c2c81bb4?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1620029188962-be2c6486593d?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1579097648137-4b19188fdb4e?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1640636430727-649f73271766?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1684929954083-f10c179ed96d?w=600&h=400&fit=crop&auto=format",
    ],
  },
  {
    id: 2, day: 14, month: "Сен", monthNum: 9, year: 2026,
    title: "Rock Crawling Cup — Ural Open",
    date: "14–15 сентября 2026",
    location: "Свердловская обл., Уральские горы",
    city: "Екатеринбург",
    type: "Соревнование", typeColor: "#9b59b6",
    participants: 48, maxParticipants: 60,
    difficulty: "Хардкор",
    img: "https://images.unsplash.com/photo-1579097648137-4b19188fdb4e?w=1400&h=640&fit=crop&auto=format",
    registered: false,
    fee: "8 500 ₽ / экипаж",
    organizer: "Ural Off-Road Federation",
    organizerAvatar: "https://images.unsplash.com/photo-1622300868582-544a4dde5395?w=80&h=80&fit=crop&auto=format",
    description: "Открытый чемпионат Урала по рок-кроулингу. Каменные трассы Уральских гор, специальные категории для стоковых и подготовленных машин. Трофеи, спонсорские призы, профессиональная фотосъёмка на трассе. Зрители приветствуются.",
    schedule: [
      { time: "Сб 08:00", label: "Регистрация, техосмотр, жеребьёвка порядка старта" },
      { time: "Сб 10:00", label: "Квалификация — категория «Сток»" },
      { time: "Сб 14:00", label: "Финал — категория «Сток», награждение" },
      { time: "Вс 09:00", label: "Категория «Подготовленные» — раунды 1–2" },
      { time: "Вс 15:00", label: "Финал «Подготовленные», общее награждение" },
    ],
    requirements: [
      "Омологация техники по регламенту UAF 2026",
      "Шлем и огнеупорный комбинезон для пилота и штурмана",
      "Каркас безопасности или усиленный кузов",
      "Гидроусилитель или гидравлическое управление",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1622300868582-544a4dde5395?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1620029188962-be2c6486593d?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1654162456768-ebf2c2c81bb4?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1596507931135-75f699668356?w=600&h=400&fit=crop&auto=format",
    ],
  },
  {
    id: 3, day: 21, month: "Сен", monthNum: 9, year: 2026,
    title: "Учебный день: управление на скользкой дороге",
    date: "21 сентября 2026",
    location: "Подмосковье, полигон «Дружба»",
    city: "Москва",
    type: "Обучение", typeColor: "#3a9e5f",
    participants: 22, maxParticipants: 30,
    difficulty: "Начинающий",
    img: "https://images.unsplash.com/photo-1596507931135-75f699668356?w=1400&h=640&fit=crop&auto=format",
    registered: false,
    fee: "2 900 ₽ / чел.",
    organizer: "OFF-ROAD SCHOOL",
    organizerAvatar: "https://images.unsplash.com/photo-1620029188962-be2c6486593d?w=80&h=80&fit=crop&auto=format",
    description: "Однодневный практикум для тех, кто хочет уверенно чувствовать себя на мокрых, обледенелых и грунтовых дорогах. Теория + практика на специально подготовленном полигоне с инструкторами-мастерами спорта.",
    schedule: [
      { time: "09:00", label: "Теоретическая часть — физика скольжения, техники контраварийного управления" },
      { time: "11:00", label: "Практика: занос, снос, стабилизация" },
      { time: "13:00", label: "Обед" },
      { time: "14:00", label: "Упражнения на мокром асфальте и грунте" },
      { time: "16:30", label: "Итоговая оценка навыков, вручение сертификатов" },
    ],
    requirements: [
      "Любой автомобиль в исправном техническом состоянии",
      "Обязательно страховое покрытие КАСКО или разрешение на учебные манёвры",
      "Удобная одежда и закрытая обувь",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1654162456768-ebf2c2c81bb4?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1596507931135-75f699668356?w=600&h=400&fit=crop&auto=format",
    ],
  },
];

const DIFFICULTY_COLOR: Record<string, string> = { "Начинающий": "#3a9e5f", "Средний": "#d4820a", "Хардкор": "#e84e00" };

type Participant = { id: number; name: string; city: string; car: string; avatar: string; badge?: string };

const PARTICIPANTS: Record<number, Participant[]> = {
  1: [
    { id:1,  name:"Алексей Громов",   city:"Москва",          car:"Toyota LC200",        avatar:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format", badge:"Ветеран" },
    { id:2,  name:"Мария Соколова",   city:"СПб",             car:"Jeep Wrangler",       avatar:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format" },
    { id:3,  name:"Дмитрий Нечаев",   city:"Тверь",           car:"Mitsubishi Pajero",   avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format", badge:"Организатор" },
    { id:4,  name:"Ольга Ким",         city:"Новгород",        car:"Nissan Patrol",       avatar:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format" },
    { id:5,  name:"Роман Власов",      city:"Псков",           car:"UAZ Pickup",          avatar:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format" },
    { id:6,  name:"Наталья Зверева",   city:"Вологда",         car:"Land Rover Defender", avatar:"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&auto=format" },
    { id:7,  name:"Сергей Потапов",    city:"Петрозаводск",   car:"Toyota Hilux",        avatar:"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&auto=format" },
    { id:8,  name:"Ирина Макарова",    city:"Москва",          car:"Suzuki Jimny",        avatar:"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&auto=format" },
  ],
  2: [
    { id:1, name:"Виктор Орлов",     city:"Екатеринбург", car:"Toyota Hilux",      avatar:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format", badge:"Чемпион" },
    { id:2, name:"Анна Белова",      city:"Челябинск",    car:"Jeep Rubicon",      avatar:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format" },
    { id:3, name:"Максим Тихонов",   city:"Тюмень",       car:"Mitsubishi L200",   avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format" },
  ],
  3: [
    { id:1, name:"Павел Лебедев",    city:"Москва",   car:"Kia Sportage",      avatar:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format", badge:"Новичок" },
    { id:2, name:"Светлана Кузина",  city:"Москва",   car:"Renault Duster",    avatar:"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&auto=format" },
    { id:3, name:"Иван Фролов",      city:"Подольск", car:"Toyota RAV4",       avatar:"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&auto=format" },
  ],
};

function BackBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 0", background: "none", border: "none", cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}
      onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "#fff"}
      onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.7)"}
    >
      <svg width="14" height="10" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 6H1M6 1L1 6l5 5" /></svg>
      {label}
    </button>
  );
}

const CURRENT_USER = {
  name: "Алексей Громов",
  username: "@grommov",
  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format",
  rating: "4.8 ★",
  events: 23,
  cars: [
    { id:1, brand:"Toyota", model:"Land Cruiser 200", year:"2019", plate:"А777КХ 77", color:"#2d5a3d", mods:"Лифт 50мм, силовой бампер, лебёдка Warn 12000", primary:true },
    { id:2, brand:"Jeep",   model:"Wrangler Rubicon", year:"2021", plate:"В321МО 50", color:"#8b3a1a", mods:'Rock rails, шины BFG 37"', primary:false },
  ],
};

function RegisterModal({ ev, onClose, onConfirm }: { ev: Event; onClose: () => void; onConfirm: () => void }) {
  const [selectedCarId, setSelectedCarId] = useState(CURRENT_USER.cars.find(c=>c.primary)?.id ?? CURRENT_USER.cars[0].id);
  const [comment, setComment] = useState("");
  const [agree, setAgree] = useState(false);
  const [agreeErr, setAgreeErr] = useState(false);
  const selectedCar = CURRENT_USER.cars.find(c=>c.id===selectedCarId)!;

  const submit = () => { if (!agree) { setAgreeErr(true); return; } onConfirm(); };

  const inp: React.CSSProperties = { width:"100%", padding:"11px 14px", border:"1px solid #e0dbd4", outline:"none", fontFamily:"'Barlow',sans-serif", fontSize:14, color:"#1a1612", background:"#fff", boxSizing:"border-box", resize:"none" };

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:200, background:"rgba(10,8,6,0.72)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#fff", width:"100%", maxWidth:480, maxHeight:"92vh", overflowY:"auto", position:"relative" }}>

        {/* header */}
        <div style={{ background:"#1a1612", padding:"20px 24px", position:"relative" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"#e84e00" }}/>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.28em", textTransform:"uppercase", color:"rgba(255,255,255,0.38)", marginBottom:3 }}>{ev.type} · {ev.date}</div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:20, letterSpacing:"0.04em", textTransform:"uppercase", color:"#fff", lineHeight:1.1, paddingRight:32 }}>{ev.title}</div>
          <button onClick={onClose} style={{ position:"absolute", top:16, right:18, background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.45)", fontSize:20, lineHeight:1, padding:4 }}
            onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.color="#fff"}
            onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.color="rgba(255,255,255,0.45)"}
          >✕</button>
        </div>

        <div style={{ padding:"20px 24px 24px", display:"flex", flexDirection:"column", gap:16 }}>

          {/* user card */}
          <div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.24em", textTransform:"uppercase", color:"#aaa49e", marginBottom:8 }}>Участник</div>
            <div style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", background:"#faf8f5", border:"1.5px solid #e0dbd4" }}>
              <div style={{ width:48, height:48, borderRadius:"50%", overflow:"hidden", flexShrink:0 }}>
                <img src={CURRENT_USER.avatar} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:17, letterSpacing:"0.04em", textTransform:"uppercase", color:"#1a1612" }}>{CURRENT_USER.name}</div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.12em", color:"#aaa49e", marginTop:2 }}>{CURRENT_USER.username}</div>
              </div>
              <div style={{ display:"flex", gap:12, flexShrink:0 }}>
                {[{v:CURRENT_USER.rating,l:"Рейтинг"},{v:String(CURRENT_USER.events),l:"Событий"}].map(s=>(
                  <div key={s.l} style={{ textAlign:"center" }}>
                    <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:16, color:"#e84e00", lineHeight:1 }}>{s.v}</div>
                    <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, letterSpacing:"0.16em", textTransform:"uppercase", color:"#c0b9b0", marginTop:2 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* car selector */}
          <div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.24em", textTransform:"uppercase", color:"#aaa49e", marginBottom:8 }}>Автомобиль для участия</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {CURRENT_USER.cars.map(car=>{
                const sel = car.id === selectedCarId;
                return (
                  <button key={car.id} onClick={()=>setSelectedCarId(car.id)}
                    style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 16px", border:`1.5px solid ${sel?"#e84e00":"#e0dbd4"}`, background:sel?"#fff9f7":"#fff", cursor:"pointer", textAlign:"left", transition:"border-color 0.15s, background 0.15s", position:"relative" }}
                  >
                    {/* color dot */}
                    <div style={{ width:36, height:36, background:car.color, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <svg width="18" height="12" viewBox="0 0 24 14" fill="none"><rect x="2" y="5" width="20" height="7" rx="2" fill="rgba(255,255,255,0.35)"/><rect x="5" y="2" width="14" height="6" rx="1.5" fill="rgba(255,255,255,0.5)"/><circle cx="6" cy="12" r="2" fill="rgba(255,255,255,0.8)"/><circle cx="18" cy="12" r="2" fill="rgba(255,255,255,0.8)"/></svg>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:14, letterSpacing:"0.04em", textTransform:"uppercase", color:"#1a1612" }}>{car.brand} {car.model} <span style={{ fontWeight:400, color:"#aaa49e" }}>{car.year}</span></div>
                      <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:"#aaa49e", marginTop:2 }}>{car.plate}</div>
                      <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:11, color:"#c0b9b0", marginTop:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{car.mods}</div>
                    </div>
                    {/* radio */}
                    <div style={{ width:18, height:18, borderRadius:"50%", border:`2px solid ${sel?"#e84e00":"#d6d0c8"}`, background:sel?"#e84e00":"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      {sel && <div style={{ width:6, height:6, borderRadius:"50%", background:"#fff" }}/>}
                    </div>
                    {car.primary && <div style={{ position:"absolute", top:8, right:40, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:8, letterSpacing:"0.18em", textTransform:"uppercase", color:"#e84e00" }}>Основная</div>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* fee */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", background:"#1a1612" }}>
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(255,255,255,0.4)" }}>Взнос за участие</span>
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:20, color:"#e84e00" }}>{ev.fee}</span>
          </div>

          {/* comment */}
          <div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.24em", textTransform:"uppercase", color:"#aaa49e", marginBottom:8 }}>Комментарий организатору <span style={{ fontWeight:400 }}>(необязательно)</span></div>
            <textarea value={comment} onChange={e=>setComment(e.target.value)} rows={2} placeholder="Особые пожелания, вопросы…" style={inp}
              onFocus={e=>(e.target as HTMLTextAreaElement).style.borderColor="#e84e00"}
              onBlur={e=>(e.target as HTMLTextAreaElement).style.borderColor="#e0dbd4"}
            />
          </div>

          {/* agree */}
          <label style={{ display:"flex", alignItems:"flex-start", gap:10, cursor:"pointer" }} onClick={()=>setAgreeErr(false)}>
            <input type="checkbox" checked={agree} onChange={e=>setAgree(e.target.checked)} style={{ marginTop:3, accentColor:"#e84e00", flexShrink:0 }}/>
            <span style={{ fontFamily:"'Barlow',sans-serif", fontSize:13, color: agreeErr?"#e84e00":"#6b6357", lineHeight:1.5 }}>
              Я ознакомлен с требованиями к технике и экипажу и принимаю условия участия
            </span>
          </label>

          <button onClick={submit} style={{ padding:"14px 0", background:"#e84e00", border:"none", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, letterSpacing:"0.16em", textTransform:"uppercase", color:"#fff" }}>
            Подтвердить запись
          </button>
        </div>
      </div>
    </div>
  );
}

export function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const ev = EVENTS.find(e => e.id === Number(id)) ?? EVENTS[0];
  const [registered, setRegistered] = useState(ev.registered);
  const [participants, setParticipants] = useState(ev.participants);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [showAllParticipants, setShowAllParticipants] = useState(false);
  const [showRegModal, setShowRegModal] = useState(false);

  const partList = PARTICIPANTS[ev.id] ?? [];
  const visibleParts = showAllParticipants ? partList : partList.slice(0, 6);
  const full = participants >= ev.maxParticipants && !registered;
  const pct = Math.round((participants / ev.maxParticipants) * 100);

  return (
    <div style={{ minHeight: "100vh" }}>

      {/* ── Hero ── */}
      <div style={{ position: "relative", height: 520, overflow: "hidden", background: "#1a1612" }}>
        <img src={ev.img} alt={ev.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.45 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #1a1612 0%, rgba(26,22,18,0.7) 50%, rgba(26,22,18,0.3) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 0 48px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", width: "100%" }}>
            <BackBtn label="Все события" onClick={() => navigate("/events")} />
            <div style={{ display: "flex", alignItems: "flex-end", gap: 20, marginTop: 16 }}>
              {/* date block */}
              <div style={{ background: "#e84e00", padding: "10px 16px", textAlign: "center", flexShrink: 0 }}>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 36, color: "#fff", lineHeight: 1 }}>{ev.day}</div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 600, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.85)" }}>{ev.month}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ background: ev.typeColor, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff", padding: "4px 12px" }}>{ev.type}</span>
                  <span style={{ background: DIFFICULTY_COLOR[ev.difficulty] || "#aaa", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff", padding: "4px 12px" }}>{ev.difficulty}</span>
                  {registered && (
                    <span style={{ background: "rgba(58,158,95,0.9)", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#fff", padding: "4px 12px", display: "flex", alignItems: "center", gap: 5 }}>
                      <svg width="9" height="7" viewBox="0 0 10 8" fill="none" stroke="white" strokeWidth="2"><path d="M1 4l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      Вы записаны
                    </span>
                  )}
                </div>
                <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 48, letterSpacing: "0.04em", textTransform: "uppercase", color: "#fff", lineHeight: 1, margin: "0 0 10px" }}>{ev.title}</h1>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <svg width="10" height="13" viewBox="0 0 12 14" fill="rgba(255,255,255,0.6)"><path d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5Zm0 6.75A1.75 1.75 0 1 1 6 3.25a1.75 1.75 0 0 1 0 3.5Z" /></svg>
                  <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)" }}>{ev.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 40 }}>

          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

            {/* description */}
            <section style={{ background: "#fff", border: "1px solid #ece8e3" }}>
              <div style={{ height: 3, background: "linear-gradient(90deg,#e84e00,#ff7a2f 60%,#e84e00)" }} />
              <div style={{ padding: "28px 32px" }}>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "#e84e00", marginBottom: 8 }}>О событии</div>
                <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 15, lineHeight: 1.75, color: "#4a443e", margin: 0 }}>{ev.description}</p>
              </div>
            </section>

            {/* schedule */}
            <section style={{ background: "#fff", border: "1px solid #ece8e3" }}>
              <div style={{ padding: "24px 32px 28px" }}>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "#e84e00", marginBottom: 18 }}>Программа</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {ev.schedule.map((s, i) => (
                    <div key={i} style={{ display: "flex", gap: 20, paddingBottom: 16, marginBottom: 16, borderBottom: i < ev.schedule.length - 1 ? "1px solid #f5f2ee" : "none" }}>
                      <div style={{ minWidth: 90, flexShrink: 0 }}>
                        <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "#e84e00" }}>{s.time}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flex: 1 }}>
                        <div style={{ width: 8, height: 8, background: i === 0 ? "#e84e00" : "#d6d0c8", flexShrink: 0, marginTop: 4 }} />
                        <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 14, color: "#1a1612", lineHeight: 1.5 }}>{s.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* requirements */}
            <section style={{ background: "#fff", border: "1px solid #ece8e3" }}>
              <div style={{ padding: "24px 32px 28px" }}>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "#e84e00", marginBottom: 18 }}>Требования к технике и экипажу</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {ev.requirements.map((r, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div style={{ width: 20, height: 20, background: "#1a1612", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <svg width="9" height="7" viewBox="0 0 10 8" fill="none" stroke="white" strokeWidth="2.5"><path d="M1 4l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                      <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 14, color: "#4a443e", lineHeight: 1.5 }}>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* gallery */}
            {ev.gallery.length > 0 && (
              <section>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "#e84e00", marginBottom: 14 }}>Фотогалерея</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                  {ev.gallery.map((src, i) => (
                    <div key={i} onClick={() => setLightbox(src)} style={{ aspectRatio: "3/2", overflow: "hidden", cursor: "zoom-in", background: "#1a1612", position: "relative" }}
                      onMouseEnter={e => { (e.currentTarget.querySelector("img") as HTMLImageElement).style.opacity = "0.7"; (e.currentTarget.querySelector("img") as HTMLImageElement).style.transform = "scale(1.05)"; }}
                      onMouseLeave={e => { (e.currentTarget.querySelector("img") as HTMLImageElement).style.opacity = "1"; (e.currentTarget.querySelector("img") as HTMLImageElement).style.transform = "scale(1)"; }}
                    >
                      <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.2s,transform 0.4s" }} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* participants */}
            {partList.length > 0 && (
              <section style={{ background: "#fff", border: "1px solid #ece8e3" }}>
                <div style={{ height: 3, background: "#1a1612" }} />
                <div style={{ padding: "24px 32px 28px" }}>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 20 }}>
                    <div>
                      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "#e84e00", marginBottom: 4 }}>Участники</div>
                      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 22, letterSpacing: "0.04em", textTransform: "uppercase", color: "#1a1612", lineHeight: 1 }}>
                        {participants} <span style={{ fontWeight: 400, fontSize: 14, color: "#aaa49e" }}>из {ev.maxParticipants}</span>
                      </div>
                    </div>
                    {/* mini progress */}
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 28, color: pct >= 90 ? "#e84e00" : "#3a9e5f", lineHeight: 1 }}>{pct}%</div>
                      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#aaa49e", marginTop: 2 }}>мест занято</div>
                    </div>
                  </div>

                  {/* progress bar */}
                  <div style={{ height: 4, background: "#f5f2ee", marginBottom: 24 }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: pct >= 90 ? "#e84e00" : "#3a9e5f", transition: "width 0.4s" }} />
                  </div>

                  {/* list */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {visibleParts.map((p, i) => (
                      <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: i < visibleParts.length - 1 ? "1px solid #f5f2ee" : "none" }}>
                        {/* avatar */}
                        <div style={{ width: 40, height: 40, borderRadius: "50%", overflow: "hidden", flexShrink: 0, background: "#e0dbd4", position: "relative" }}>
                          <img src={p.avatar} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        {/* info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 14, letterSpacing: "0.04em", textTransform: "uppercase", color: "#1a1612" }}>{p.name}</span>
                            {p.badge && (
                              <span style={{ background: p.badge === "Организатор" ? "#e84e00" : p.badge === "Ветеран" ? "#1a1612" : "#3a9e5f", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 8, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff", padding: "2px 7px" }}>{p.badge}</span>
                            )}
                          </div>
                          <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 12, color: "#aaa49e", marginTop: 1 }}>{p.car} · {p.city}</div>
                        </div>
                        {/* number */}
                        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 16, color: "#e8e2da", flexShrink: 0 }}>#{i + 1}</div>
                      </div>
                    ))}
                  </div>

                  {partList.length > 6 && (
                    <button onClick={() => setShowAllParticipants(v => !v)}
                      style={{ marginTop: 16, width: "100%", padding: "10px 0", border: "1px solid #e5e0d8", background: "transparent", cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "#6b6357" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#e84e00"; (e.currentTarget as HTMLButtonElement).style.color = "#e84e00"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e0d8"; (e.currentTarget as HTMLButtonElement).style.color = "#6b6357"; }}
                    >
                      {showAllParticipants ? "Скрыть" : `Показать всех ${partList.length} участников`}
                    </button>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* CTA card */}
            <div style={{ background: "#1a1612", position: "sticky", top: 20 }}>
              <div style={{ height: 3, background: "linear-gradient(90deg,#e84e00,#ff7a2f)" }} />
              <div style={{ padding: "28px 24px" }}>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 26, letterSpacing: "0.04em", textTransform: "uppercase", color: "#fff", lineHeight: 1, marginBottom: 4 }}>{ev.date}</div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 24 }}>{ev.city}</div>

                {/* fee */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderTop: "1px solid rgba(255,255,255,0.08)", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 20 }}>
                  <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>Взнос</span>
                  <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 20, color: "#e84e00" }}>{ev.fee}</span>
                </div>

                {/* progress */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>Участники</span>
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 14, color: pct >= 90 ? "#e84e00" : "#fff" }}>{participants} / {ev.maxParticipants}</span>
                  </div>
                  <div style={{ height: 4, background: "rgba(255,255,255,0.1)" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: pct >= 90 ? "#e84e00" : "#3a9e5f", transition: "width 0.3s" }} />
                  </div>
                </div>

                <button
                  onClick={() => { if (registered) { setRegistered(false); setParticipants(p=>p-1); } else if (!full) setShowRegModal(true); }}
                  disabled={full}
                  style={{ width: "100%", padding: "14px 0", border: "none", cursor: full ? "not-allowed" : "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "0.16em", textTransform: "uppercase", color: registered ? "#1a1612" : "#fff", background: registered ? "rgba(255,255,255,0.12)" : full ? "#3a3530" : "#e84e00", transition: "background 0.15s" }}
                >
                  {registered ? "Отменить запись" : full ? "Мест нет" : "Записаться"}
                </button>
              </div>
            </div>

            {/* organizer */}
            <div style={{ background: "#fff", border: "1px solid #ece8e3", padding: "20px 20px" }}>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#aaa49e", marginBottom: 14 }}>Организатор</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, overflow: "hidden", flexShrink: 0, background: "#e0dbd4" }}>
                  <img src={ev.organizerAvatar} alt={ev.organizer} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 15, letterSpacing: "0.04em", textTransform: "uppercase", color: "#1a1612" }}>{ev.organizer}</div>
                  <button onClick={() => navigate("/")} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#e84e00", background: "none", border: "none", cursor: "pointer", padding: 0, marginTop: 2 }}>Страница клуба →</button>
                </div>
              </div>
            </div>

            {/* share */}
            <div style={{ background: "#fff", border: "1px solid #ece8e3", padding: "20px 20px" }}>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#aaa49e", marginBottom: 12 }}>Поделиться</div>
              <div style={{ display: "flex", gap: 8 }}>
                {[{ label: "VK", bg: "#4c75a3" }, { label: "TG", bg: "#2aabee" }].map(s => (
                  <button key={s.label} style={{ flex: 1, padding: "9px 0", background: s.bg, border: "none", cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#fff" }}>{s.label}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Register Modal */}
      {showRegModal && (
        <RegisterModal ev={ev} onClose={()=>setShowRegModal(false)} onConfirm={()=>{ setRegistered(true); setParticipants(p=>p+1); setShowRegModal(false); }}/>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out", padding: 24 }}>
          <img src={lightbox} alt="" style={{ maxWidth: "90vw", maxHeight: "85vh", objectFit: "contain" }} />
        </div>
      )}
    </div>
  );
}
