import { useNavigate } from "react-router";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px", position: "relative", overflow: "hidden" }}>

      {/* bg texture */}
      <div style={{ position: "absolute", inset: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1640636430737-de4ae2656d43?w=1600&h=800&fit=crop&auto=format"
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.07 }}
        />
      </div>

      {/* large 404 bg text */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", userSelect: "none" }}>
        <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "clamp(160px,28vw,320px)", letterSpacing: "-0.04em", color: "rgba(26,22,18,0.045)", lineHeight: 1 }}>404</span>
      </div>

      {/* content */}
      <div style={{ position: "relative", textAlign: "center", maxWidth: 520 }}>
        {/* orange stripe accent */}
        <div style={{ width: 48, height: 4, background: "#e84e00", margin: "0 auto 28px" }} />

        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "#e84e00", marginBottom: 16 }}>Ошибка 404</div>

        <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "clamp(36px,6vw,60px)", letterSpacing: "0.04em", textTransform: "uppercase", color: "#1a1612", lineHeight: 1, margin: "0 0 16px" }}>
          Дорога<br/>не найдена
        </h1>

        <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 15, lineHeight: 1.7, color: "#8c8480", margin: "0 0 36px" }}>
          Этой страницы не существует — возможно, маршрут изменился или вы свернули не туда. Возвращайтесь на главную и продолжайте путь.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => navigate(-1 as never)}
            style={{ padding: "12px 28px", border: "1px solid #d6d0c8", background: "transparent", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", color: "#6b6357", cursor: "pointer" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#1a1612"; (e.currentTarget as HTMLButtonElement).style.color = "#1a1612"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#d6d0c8"; (e.currentTarget as HTMLButtonElement).style.color = "#6b6357"; }}
          >
            ← Назад
          </button>
          <button
            onClick={() => navigate("/")}
            style={{ padding: "12px 28px", border: "none", background: "#e84e00", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", color: "#fff", cursor: "pointer" }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "#c93e00"}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "#e84e00"}
          >
            На главную →
          </button>
        </div>

        {/* quick links */}
        <div style={{ marginTop: 48, paddingTop: 28, borderTop: "1px solid #ece8e3" }}>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#aaa49e", marginBottom: 14 }}>Популярные разделы</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { label: "Клубы", path: "/" },
              { label: "События", path: "/events" },
              { label: "Блог", path: "/blog" },
              { label: "Новости", path: "/news" },
            ].map(l => (
              <button key={l.label} onClick={() => navigate(l.path)}
                style={{ padding: "7px 16px", border: "1px solid #e0dbd4", background: "transparent", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 600, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b6357", cursor: "pointer" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#e84e00"; (e.currentTarget as HTMLButtonElement).style.color = "#e84e00"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#e0dbd4"; (e.currentTarget as HTMLButtonElement).style.color = "#6b6357"; }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
