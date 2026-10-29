import { useState } from "react";
import { useNavigate } from "react-router";

const CLUBS = [
  { id: 1, name: "Стальные Волки", city: "Москва", members: 312, routes: 47, level: "Хардкор", levelColor: "#e84e00", tags: ["Горы", "Экспедиции", "Winch"], verified: true, rating: 4.9, img: "https://images.unsplash.com/photo-1579271723430-d600366f032f?w=600&h=400&fit=crop&auto=format", desc: "Покоряем горные перевалы Кавказа и Урала. Открыты для опытных водителей." },
  { id: 2, name: "Mud Brothers", city: "Екатеринбург", members: 189, routes: 31, level: "Средний", levelColor: "#d4820a", tags: ["Грязь", "Болота", "Лебёдка"], verified: true, rating: 4.7, img: "https://images.unsplash.com/photo-1654162456768-ebf2c2c81bb4?w=600&h=400&fit=crop&auto=format", desc: "Специализируемся на болотных выездах Свердловской области. Каждые выходные в полях." },
  { id: 3, name: "Тундра Экспедишн", city: "Новосибирск", members: 94, routes: 18, level: "Хардкор", levelColor: "#e84e00", tags: ["Снег", "Тайга", "Выживание"], verified: false, rating: 4.5, img: "https://images.unsplash.com/photo-1500921726673-e4bdc09efa55?w=600&h=400&fit=crop&auto=format", desc: "Зимние экспедиции в условиях сибирского бездорожья. Не для слабонервных." },
  { id: 4, name: "Red Dust Club", city: "Краснодар", members: 241, routes: 56, level: "Начинающий", levelColor: "#3a9e5f", tags: ["Степь", "Семейный", "Учебные"], verified: true, rating: 4.8, img: "https://images.unsplash.com/photo-1596507931135-75f699668356?w=600&h=400&fit=crop&auto=format", desc: "Дружественный клуб для любителей и новичков. Обучение вождению по бездорожью." },
  { id: 5, name: "Лесные Призраки", city: "Санкт-Петербург", members: 137, routes: 29, level: "Средний", levelColor: "#d4820a", tags: ["Лес", "Триал", "Ночные"], verified: false, rating: 4.6, img: "https://images.unsplash.com/photo-1622300868582-544a4dde5395?w=600&h=400&fit=crop&auto=format", desc: "Ночные выезды по лесным трассам Ленобласти. Триал-секции и техничные маршруты." },
  { id: 6, name: "Кавказ 4x4", city: "Казань", members: 205, routes: 38, level: "Хардкор", levelColor: "#e84e00", tags: ["Перевалы", "Rock Crawl", "Экстрим"], verified: true, rating: 4.9, img: "https://images.unsplash.com/photo-1579097648137-4b19188fdb4e?w=600&h=400&fit=crop&auto=format", desc: "Rock Crawling и горные маршруты. Требуем подготовленный автомобиль и опыт." },
];

const FILTERS = ["Все", "Хардкор", "Средний", "Начинающий"];

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="#e84e00"><path d="M6 1l1.35 2.74L10.5 4.27l-2.25 2.19.53 3.09L6 8l-2.78 1.55.53-3.09L1.5 4.27l3.15-.53L6 1z" /></svg>
      <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, color: "#1a1612" }}>{value}</span>
    </div>
  );
}

function ClubCard({ club, view }: { club: typeof CLUBS[0]; view: "grid" | "list" }) {
  const [joined, setJoined] = useState(false);
  const navigate = useNavigate();

  const joinBtn = (
    <button onClick={e => { e.stopPropagation(); setJoined(!joined); }} className="px-5 py-2.5 transition-all duration-150 shrink-0"
      style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", background: joined ? "#f5f2ee" : "#e84e00", color: joined ? "#6b6357" : "#fff", border: joined ? "1px solid #d6d0c8" : "1px solid #e84e00" }}
    >
      {joined ? "Вступил ✓" : "Вступить"}
    </button>
  );

  const stats = (
    <div className="flex items-center gap-4">
      <div className="flex flex-col">
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 18, color: "#1a1612", lineHeight: 1 }}>{club.members}</span>
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa49e" }}>Участников</span>
      </div>
      <div style={{ width: 1, height: 28, background: "#ece8e3" }} />
      <div className="flex flex-col">
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 18, color: "#1a1612", lineHeight: 1 }}>{club.routes}</span>
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa49e" }}>Маршрутов</span>
      </div>
    </div>
  );

  const tags = (
    <div className="flex flex-wrap gap-1.5">
      {club.tags.map(tag => (
        <span key={tag} className="px-2.5 py-1" style={{ background: "#f5f2ee", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b6357" }}>{tag}</span>
      ))}
    </div>
  );

  if (view === "list") {
    return (
      <article onClick={() => navigate(`/clubs/${club.id}`)} className="flex overflow-hidden bg-white border transition-all duration-200 group" style={{ borderColor: "#ece8e3", cursor: "pointer" }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "#e84e00"}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "#ece8e3"}
      >
        <div className="relative overflow-hidden shrink-0" style={{ width: 280, background: "#e0dbd4" }}>
          <img src={club.img} alt={club.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent 60%, rgba(255,255,255,0.06))" }} />
          <div className="absolute top-4 left-4 px-2.5 py-1" style={{ background: club.levelColor }}>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff" }}>{club.level}</span>
          </div>
          <div className="absolute bottom-4 left-4 flex items-center gap-1">
            <svg width="9" height="11" viewBox="0 0 12 14" fill="rgba(255,255,255,0.85)"><path d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5Zm0 6.75A1.75 1.75 0 1 1 6 3.25a1.75 1.75 0 0 1 0 3.5Z" /></svg>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 500, fontSize: 12, letterSpacing: "0.08em", color: "rgba(255,255,255,0.9)", textTransform: "uppercase" }}>{club.city}</span>
          </div>
        </div>
        <div className="flex flex-col flex-1 px-8 py-6 gap-3 justify-between">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 26, letterSpacing: "0.05em", textTransform: "uppercase", color: "#1a1612", lineHeight: 1, margin: 0 }}>{club.name}</h3>
                {club.verified && (
                  <div className="flex items-center gap-1 px-2 py-0.5 border" style={{ borderColor: "#e84e00" }}>
                    <svg width="9" height="9" viewBox="0 0 12 12" fill="#e84e00"><path d="M6 0L7.5 2.5H10.5L8.5 4.5L9.5 7.5L6 6L2.5 7.5L3.5 4.5L1.5 2.5H4.5L6 0Z" /></svg>
                    <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "#e84e00" }}>Верифицирован</span>
                  </div>
                )}
              </div>
              <StarRating value={club.rating} />
            </div>
            {joinBtn}
          </div>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: "#8c8480", lineHeight: 1.6, margin: 0 }}>{club.desc}</p>
          <div className="flex items-center justify-between pt-1" style={{ borderTop: "1px solid #f0ece8" }}>{stats}{tags}</div>
        </div>
      </article>
    );
  }

  return (
    <article onClick={() => navigate(`/clubs/${club.id}`)} className="flex flex-col overflow-hidden bg-white border transition-all duration-200 group" style={{ borderColor: "#ece8e3", cursor: "pointer" }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "#e84e00"}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "#ece8e3"}
    >
      <div className="relative overflow-hidden" style={{ height: 180, background: "#e0dbd4" }}>
        <img src={club.img} alt={club.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)" }} />
        <div className="absolute top-3 left-3 px-2.5 py-1" style={{ background: club.levelColor }}>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff" }}>{club.level}</span>
        </div>
        {club.verified && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1" style={{ background: "rgba(255,255,255,0.92)" }}>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="#e84e00"><path d="M6 0L7.5 2.5H10.5L8.5 4.5L9.5 7.5L6 6L2.5 7.5L3.5 4.5L1.5 2.5H4.5L6 0Z" /></svg>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "#1a1612" }}>Верифицирован</span>
          </div>
        )}
        <div className="absolute bottom-3 left-3 flex items-center gap-1">
          <svg width="9" height="11" viewBox="0 0 12 14" fill="rgba(255,255,255,0.8)"><path d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5Zm0 6.75A1.75 1.75 0 1 1 6 3.25a1.75 1.75 0 0 1 0 3.5Z" /></svg>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 500, fontSize: 12, letterSpacing: "0.08em", color: "rgba(255,255,255,0.9)", textTransform: "uppercase" }}>{club.city}</span>
        </div>
      </div>
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 20, letterSpacing: "0.05em", textTransform: "uppercase", color: "#1a1612", lineHeight: 1.1, margin: 0 }}>{club.name}</h3>
          <StarRating value={club.rating} />
        </div>
        <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: "#8c8480", lineHeight: 1.55, margin: 0 }}>{club.desc}</p>
        {tags}
        <div style={{ height: 1, background: "#f0ece8" }} />
        <div className="flex items-center justify-between">{stats}{joinBtn}</div>
      </div>
    </article>
  );
}

export function ClubsPage() {
  const [activeFilter, setActiveFilter] = useState("Все");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = CLUBS.filter(c => {
    const matchLevel = activeFilter === "Все" || c.level === activeFilter;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.city.toLowerCase().includes(search.toLowerCase());
    return matchLevel && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">

      {/* Section header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", color: "#e84e00", marginBottom: 6 }}>Найди своих</p>
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 44, letterSpacing: "0.06em", textTransform: "uppercase", color: "#1a1612", lineHeight: 1, margin: 0 }}>Автоклубы</h2>
        </div>
        <div className="flex items-center border" style={{ borderColor: "#e0dbd4", background: "#fff", minWidth: 260 }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#aaa" strokeWidth="1.5" className="ml-3 shrink-0"><circle cx="7" cy="7" r="5" /><path d="M11 11l3 3" strokeLinecap="round" /></svg>
          <input type="text" placeholder="Название или город…" value={search} onChange={e => setSearch(e.target.value)} className="w-full px-3 py-2.5 outline-none bg-transparent" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, letterSpacing: "0.06em", color: "#1a1612" }} />
        </div>
      </div>

      {/* Filters + view toggle */}
      <div className="flex items-center gap-0 mb-8 border-b" style={{ borderColor: "#e8e4df" }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)} className="relative px-5 py-3 transition-colors"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: activeFilter === f ? 700 : 500, fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: activeFilter === f ? "#1a1612" : "#8c8480", background: "transparent", border: "none", cursor: "pointer" }}
          >
            {f}
            {activeFilter === f && <span className="absolute bottom-0 left-0 w-full h-0.5" style={{ background: "#e84e00" }} />}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-3">
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, letterSpacing: "0.1em", color: "#aaa49e", textTransform: "uppercase" }}>
            {filtered.length} клуб{filtered.length === 1 ? "" : filtered.length < 5 ? "а" : "ов"}
          </span>
          <div className="flex items-center border" style={{ borderColor: "#e0dbd4" }}>
            <button onClick={() => setView("grid")} className="flex items-center justify-center w-9 h-9 transition-colors" style={{ background: view === "grid" ? "#e84e00" : "transparent" }} title="Сетка">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="5" height="5" rx="0.5" fill={view === "grid" ? "#fff" : "#8c8480"} />
                <rect x="8" y="1" width="5" height="5" rx="0.5" fill={view === "grid" ? "#fff" : "#8c8480"} />
                <rect x="1" y="8" width="5" height="5" rx="0.5" fill={view === "grid" ? "#fff" : "#8c8480"} />
                <rect x="8" y="8" width="5" height="5" rx="0.5" fill={view === "grid" ? "#fff" : "#8c8480"} />
              </svg>
            </button>
            <button onClick={() => setView("list")} className="flex items-center justify-center w-9 h-9 transition-colors border-l" style={{ background: view === "list" ? "#e84e00" : "transparent", borderColor: "#e0dbd4" }} title="Список">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="2" width="12" height="2.5" rx="0.5" fill={view === "list" ? "#fff" : "#8c8480"} />
                <rect x="1" y="5.75" width="12" height="2.5" rx="0.5" fill={view === "list" ? "#fff" : "#8c8480"} />
                <rect x="1" y="9.5" width="12" height="2.5" rx="0.5" fill={view === "list" ? "#fff" : "#8c8480"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-5" style={view === "grid" ? { gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" } : { gridTemplateColumns: "1fr" }}>
          {filtered.map(club => <ClubCard key={club.id} club={club} view={view} />)}
        </div>
      ) : (
        <div className="flex flex-col items-center py-24 gap-3">
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 32, letterSpacing: "0.08em", textTransform: "uppercase", color: "#d6d0c8" }}>Ничего не найдено</span>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, letterSpacing: "0.1em", color: "#aaa49e" }}>Попробуйте изменить фильтр</span>
        </div>
      )}

      <div className="flex justify-center mt-12">
        <button className="px-10 py-3.5 border transition-all duration-150 hover:border-[#e84e00] hover:text-[#e84e00]"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", color: "#6b6357", borderColor: "#d6d0c8", background: "transparent" }}
        >
          Показать ещё
        </button>
      </div>
    </div>
  );
}
