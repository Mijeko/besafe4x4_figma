import { useState } from "react";
import { useParams, useNavigate } from "react-router";

type Route = { id: number; title: string; distance: string; difficulty: string; diffColor: string; region: string; img: string; date: string };
type Member = { id: number; name: string; role: string; avatar: string; car: string };
type ClubEvent = { id: number; title: string; date: string; type: string; typeColor: string };

type Club = {
  id: number; name: string; city: string; founded: string; members: number; routes: number; img: string; logo: string;
  accent: string; tags: string[]; description: string; about: string;
  stats: { label: string; value: string }[];
  topRoutes: Route[];
  crew: Member[];
  events: ClubEvent[];
  social: { vk?: string; tg?: string; yt?: string };
};

const CLUBS: Club[] = [
  {
    id: 1,
    name: "Стальные Волки",
    city: "Москва",
    founded: "2014",
    members: 312,
    routes: 47,
    accent: "#2d5a3d",
    img: "https://images.unsplash.com/photo-1579271723430-d600366f032f?w=1400&h=640&fit=crop&auto=format",
    logo: "https://images.unsplash.com/photo-1579271723430-d600366f032f?w=120&h=120&fit=crop&auto=format",
    tags: ["Слёты", "Экспедиции", "Обучение", "Трофи"],
    description: "Крупнейший московский off-road клуб с 2014 года. Слёты по всей России, обучающие дни, экспедиции от Кольского до Алтая.",
    about: "«Стальные Волки» — это сообщество настоящих любителей бездорожья. Мы объединяем людей, которые живут офф-роудом: организуем слёты, обучающие дни, дальние экспедиции и просто выезды по выходным. Клуб основан в 2014 году группой энтузиастов из Москвы. За десять лет мы провели более 200 мероприятий и помогли сотням людей открыть для себя мир бездорожья. Приветствуем всех — от новичков до ветеранов.",
    stats: [
      { value: "312", label: "Участников" },
      { value: "47", label: "Маршрутов" },
      { value: "12", label: "Лет в строю" },
      { value: "4.9", label: "Рейтинг ★" },
    ],
    topRoutes: [
      { id: 1, title: "Тихвинские болота — кольцо", distance: "180 км", difficulty: "Средний", diffColor: "#d4820a", region: "Ленобласть", img: "https://images.unsplash.com/photo-1684929954083-f10c179ed96d?w=600&h=340&fit=crop&auto=format", date: "Авг 2026" },
      { id: 2, title: "Кольский трек — полуостров", distance: "620 км", difficulty: "Хардкор", diffColor: "#e84e00", region: "Мурманская обл.", img: "https://images.unsplash.com/photo-1605661480059-884578ac8ec8?w=600&h=340&fit=crop&auto=format", date: "Июл 2026" },
      { id: 3, title: "Тверские леса — грунтовое кольцо", distance: "95 км", difficulty: "Лёгкий", diffColor: "#3a9e5f", region: "Тверская обл.", img: "https://images.unsplash.com/photo-1596507931135-75f699668356?w=600&h=340&fit=crop&auto=format", date: "Июн 2026" },
    ],
    crew: [
      { id: 1, name: "Алексей Волков", role: "Основатель / Президент", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format", car: "Land Cruiser 200" },
      { id: 2, name: "Марина Соколова", role: "Организатор событий", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format", car: "Jimny Lifted" },
      { id: 3, name: "Дмитрий Кузнецов", role: "Технический директор", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format", car: "Wrangler Rubicon" },
      { id: 4, name: "Ирина Лебедева", role: "Медиа и SMM", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format", car: "Freelander 2" },
    ],
    events: [
      { id: 1, title: "Осеннее бездорожье 2026", date: "2–4 сен 2026", type: "Слёт", typeColor: "#e84e00" },
      { id: 2, title: "Учебный день — управление", date: "21 сен 2026", type: "Обучение", typeColor: "#3a9e5f" },
      { id: 3, title: "Зимняя экспедиция", date: "1 ноя 2026", type: "Экспедиция", typeColor: "#d4820a" },
    ],
    social: { vk: "#", tg: "#", yt: "#" },
  },
  {
    id: 2,
    name: "Red Dust Club",
    city: "Краснодар",
    founded: "2017",
    members: 241,
    routes: 56,
    accent: "#8b3a1a",
    img: "https://images.unsplash.com/photo-1596507931135-75f699668356?w=1400&h=640&fit=crop&auto=format",
    logo: "https://images.unsplash.com/photo-1596507931135-75f699668356?w=120&h=120&fit=crop&auto=format",
    tags: ["Грязь", "Соревнования", "Кубань", "Кавказ"],
    description: "Южный клуб со страстью к красной кубанской глине. Грязевые гонки, горные маршруты, Краснодар Mud Fest.",
    about: "Red Dust Club — неформальное сообщество краснодарских офф-роудеров. Нас объединяет любовь к красной кубанской глине, горным дорогам Кавказа и духу соревнований. Клуб ежегодно проводит «Краснодар Mud Fest» — один из самых известных грязевых фестивалей Юга России. Мы открыты для всех, кто готов мочить колёса и помогать соседям.",
    stats: [
      { value: "241", label: "Участников" },
      { value: "56", label: "Маршрутов" },
      { value: "7", label: "Лет в строю" },
      { value: "4.7", label: "Рейтинг ★" },
    ],
    topRoutes: [
      { id: 1, title: "Кавказский трек — перевалы", distance: "340 км", difficulty: "Хардкор", diffColor: "#e84e00", region: "Краснодарский край", img: "https://images.unsplash.com/photo-1622300868582-544a4dde5395?w=600&h=340&fit=crop&auto=format", date: "Сен 2026" },
      { id: 2, title: "Грязевые болота Кубани", distance: "75 км", difficulty: "Средний", diffColor: "#d4820a", region: "Краснодарский край", img: "https://images.unsplash.com/photo-1654162456768-ebf2c2c81bb4?w=600&h=340&fit=crop&auto=format", date: "Окт 2026" },
    ],
    crew: [
      { id: 1, name: "Роман Красин", role: "Президент", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format", car: "Defender 90" },
      { id: 2, name: "Светлана Прохорова", role: "Организатор Mud Fest", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&auto=format", car: "Nissan Patrol" },
    ],
    events: [
      { id: 5, title: "Краснодар Mud Fest 2026", date: "18 окт 2026", type: "Соревнование", typeColor: "#9b59b6" },
    ],
    social: { vk: "#", tg: "#" },
  },
];

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

export function ClubDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const club = CLUBS.find(c => c.id === Number(id)) ?? CLUBS[0];
  const [joined, setJoined] = useState(false);
  const [activeTab, setActiveTab] = useState<"routes" | "events" | "crew">("routes");

  const TABS = [
    { key: "routes" as const, label: "Маршруты", count: club.topRoutes.length },
    { key: "events" as const, label: "События", count: club.events.length },
    { key: "crew" as const, label: "Команда", count: club.crew.length },
  ];

  return (
    <div style={{ minHeight: "100vh" }}>

      {/* ── Hero ── */}
      <div style={{ position: "relative", height: 480, overflow: "hidden", background: "#1a1612" }}>
        <img src={club.img} alt={club.name} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.4 }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${club.accent}dd 0%, rgba(26,22,18,0.75) 60%, rgba(26,22,18,0.4) 100%)` }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 0 48px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", width: "100%" }}>
            <BackBtn label="Все клубы" onClick={() => navigate("/")} />
            <div style={{ display: "flex", alignItems: "flex-end", gap: 24, marginTop: 16 }}>
              {/* club logo */}
              <div style={{ width: 80, height: 80, background: club.accent, display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid rgba(255,255,255,0.15)", flexShrink: 0, overflow: "hidden" }}>
                <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 36, color: "#fff" }}>{club.name[0]}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                  {club.tags.map(t => (
                    <span key={t} style={{ background: "rgba(255,255,255,0.12)", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 600, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.75)", padding: "3px 10px", border: "1px solid rgba(255,255,255,0.2)" }}>{t}</span>
                  ))}
                </div>
                <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 52, letterSpacing: "0.04em", textTransform: "uppercase", color: "#fff", lineHeight: 1, margin: "0 0 8px" }}>{club.name}</h1>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>
                  {club.city} · основан в {club.founded}
                </div>
              </div>
              {/* stats */}
              <div style={{ display: "flex", gap: 0, border: "1px solid rgba(255,255,255,0.15)", flexShrink: 0 }}>
                {club.stats.map((s, i) => (
                  <div key={s.label} style={{ padding: "14px 22px", textAlign: "center", borderRight: i < club.stats.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
                    <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 28, color: i === 0 ? "#fff" : "rgba(255,255,255,0.8)", lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 40 }}>

          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

            {/* about */}
            <section style={{ background: "#fff", border: "1px solid #ece8e3" }}>
              <div style={{ height: 3, background: `linear-gradient(90deg,${club.accent},${club.accent}88)` }} />
              <div style={{ padding: "28px 32px" }}>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: club.accent, marginBottom: 10 }}>О клубе</div>
                <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 15, lineHeight: 1.75, color: "#4a443e", margin: 0 }}>{club.about}</p>
              </div>
            </section>

            {/* tabs */}
            <div>
              <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #e8e4df", marginBottom: 24 }}>
                {TABS.map(tab => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ position: "relative", display: "flex", alignItems: "center", gap: 8, padding: "10px 22px", background: "none", border: "none", cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: activeTab === tab.key ? 700 : 500, fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: activeTab === tab.key ? "#1a1612" : "#8c8480" }}>
                    {tab.label}
                    <span style={{ background: activeTab === tab.key ? club.accent : "#f0ece8", color: activeTab === tab.key ? "#fff" : "#aaa49e", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 10, padding: "1px 6px", minWidth: 18, textAlign: "center" }}>{tab.count}</span>
                    {activeTab === tab.key && <span style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 2, background: club.accent }} />}
                  </button>
                ))}
              </div>

              {/* routes tab */}
              {activeTab === "routes" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {club.topRoutes.map(route => (
                    <div key={route.id} style={{ display: "flex", overflow: "hidden", background: "#fff", border: "1px solid #ece8e3", transition: "border-color 0.15s", cursor: "pointer" }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = club.accent}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "#ece8e3"}
                    >
                      <div style={{ width: 200, flexShrink: 0, position: "relative", overflow: "hidden", background: "#1a1612" }}>
                        <img src={route.img} alt={route.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.75, transition: "transform 0.4s" }} />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right,rgba(26,22,18,0.5),transparent)" }} />
                      </div>
                      <div style={{ flex: 1, padding: "20px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                            <span style={{ background: route.diffColor, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: "#fff", padding: "3px 8px" }}>{route.difficulty}</span>
                            <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#aaa49e" }}>{route.date}</span>
                          </div>
                          <h3 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: "0.04em", textTransform: "uppercase", color: "#1a1612", lineHeight: 1.1, margin: "0 0 6px" }}>{route.title}</h3>
                          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#aaa49e" }}>{route.region}</div>
                        </div>
                        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 22, color: club.accent }}>{route.distance}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* events tab */}
              {activeTab === "events" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {club.events.map(ev => (
                    <div key={ev.id} onClick={() => navigate(`/events/${ev.id}`)} style={{ display: "flex", alignItems: "center", gap: 16, background: "#fff", border: "1px solid #ece8e3", padding: "16px 20px", cursor: "pointer", transition: "border-color 0.15s" }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = club.accent}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "#ece8e3"}
                    >
                      <div style={{ width: 4, alignSelf: "stretch", background: ev.typeColor, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 16, letterSpacing: "0.04em", textTransform: "uppercase", color: "#1a1612", marginBottom: 4 }}>{ev.title}</div>
                        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#aaa49e" }}>{ev.date}</div>
                      </div>
                      <span style={{ background: ev.typeColor, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: "#fff", padding: "4px 10px" }}>{ev.type}</span>
                      <svg width="7" height="12" viewBox="0 0 8 14" fill="none" stroke="#d6d0c8" strokeWidth="2"><path d="M1 1l6 6-6 6" strokeLinecap="round" /></svg>
                    </div>
                  ))}
                </div>
              )}

              {/* crew tab */}
              {activeTab === "crew" && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16 }}>
                  {club.crew.map(m => (
                    <div key={m.id} style={{ background: "#fff", border: "1px solid #ece8e3", overflow: "hidden" }}>
                      <div style={{ height: 6, background: club.accent }} />
                      <div style={{ padding: "20px 18px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                          <div style={{ width: 44, height: 44, borderRadius: "50%", overflow: "hidden", background: "#e0dbd4", flexShrink: 0 }}>
                            <img src={m.avatar} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                          <div>
                            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 15, letterSpacing: "0.04em", textTransform: "uppercase", color: "#1a1612", lineHeight: 1.1 }}>{m.name}</div>
                            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: club.accent, marginTop: 3 }}>{m.role}</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, paddingTop: 10, borderTop: "1px solid #f5f2ee" }}>
                          <svg width="9" height="11" viewBox="0 0 12 14" fill="#aaa49e"><path d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5Z" /></svg>
                          <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#8c8480" }}>{m.car}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* join card */}
            <div style={{ background: "#1a1612", position: "sticky", top: 20 }}>
              <div style={{ height: 3, background: `linear-gradient(90deg,${club.accent},${club.accent}88)` }} />
              <div style={{ padding: "24px 20px" }}>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 22, letterSpacing: "0.04em", textTransform: "uppercase", color: "#fff", lineHeight: 1, marginBottom: 4 }}>{club.name}</div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 24 }}>{club.city} · с {club.founded} года</div>

                <div style={{ display: "flex", gap: 0, marginBottom: 20 }}>
                  {[{ v: club.members, l: "Участников" }, { v: club.routes, l: "Маршрутов" }].map((s, i) => (
                    <div key={s.l} style={{ flex: 1, padding: "12px 0", textAlign: "center", borderRight: i === 0 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 26, color: club.accent, lineHeight: 1 }}>{s.v}</div>
                      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginTop: 4 }}>{s.l}</div>
                    </div>
                  ))}
                </div>

                <button onClick={() => setJoined(j => !j)} style={{ width: "100%", padding: "13px 0", border: joined ? `1px solid rgba(255,255,255,0.15)` : "none", cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "0.16em", textTransform: "uppercase", color: joined ? "rgba(255,255,255,0.65)" : "#fff", background: joined ? "rgba(255,255,255,0.06)" : club.accent, transition: "background 0.15s" }}>
                  {joined ? "Вы в клубе ✓" : "Вступить в клуб"}
                </button>

                {joined && (
                  <div style={{ marginTop: 10, padding: "10px 12px", background: "rgba(58,158,95,0.12)", border: "1px solid rgba(58,158,95,0.25)", display: "flex", alignItems: "center", gap: 8 }}>
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="#3a9e5f" strokeWidth="2.5"><path d="M1 4l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#3a9e5f" }}>Заявка отправлена</span>
                  </div>
                )}
              </div>
            </div>

            {/* tags */}
            <div style={{ background: "#fff", border: "1px solid #ece8e3", padding: "20px 20px" }}>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#aaa49e", marginBottom: 12 }}>Специализация</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {club.tags.map(t => (
                  <span key={t} style={{ border: `1px solid ${club.accent}55`, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 600, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: club.accent, padding: "4px 10px" }}>{t}</span>
                ))}
              </div>
            </div>

            {/* socials */}
            <div style={{ background: "#fff", border: "1px solid #ece8e3", padding: "20px 20px" }}>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#aaa49e", marginBottom: 12 }}>Соцсети</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {club.social.vk && (
                  <a href={club.social.vk} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "#4c75a3", textDecoration: "none" }}>
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff" }}>ВКонтакте</span>
                  </a>
                )}
                {club.social.tg && (
                  <a href={club.social.tg} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "#2aabee", textDecoration: "none" }}>
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff" }}>Telegram</span>
                  </a>
                )}
                {club.social.yt && (
                  <a href={club.social.yt} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "#cc0000", textDecoration: "none" }}>
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff" }}>YouTube</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
