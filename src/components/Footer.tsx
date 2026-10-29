import { Link } from "react-router";

const FOOTER_COLS = [
  {
    title: "Сообщество",
    links: ["Автоклубы", "Участники", "Форум", "Рейтинги", "Блог"],
  },
  {
    title: "Контент",
    links: ["Маршруты", "Экспедиции", "Видео", "Фотогалерея", "Карты"],
  },
  {
    title: "Техника",
    links: ["Экипировка", "Запчасти", "Тюнинг", "Сервис", "База знаний"],
  },
  {
    title: "Компания",
    links: ["О нас", "Контакты", "FAQ", "Реклама", "Партнёры"],
  },
];

export function Footer() {
  return (
    <footer style={{ background: "#1a1612", color: "#f0ede8" }}>
      {/* top accent */}
      <div style={{ height: 3, background: "linear-gradient(90deg, #e84e00 0%, #ff7a2f 50%, #e84e00 100%)" }} />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid gap-12" style={{ gridTemplateColumns: "1fr auto" }}>

          {/* LEFT: logo + about */}
          <div className="flex flex-col gap-6 max-w-xs">
            <Link to="/" className="flex items-center gap-3 select-none" style={{ textDecoration: "none" }}>
              <div className="flex items-center justify-center" style={{ width: 40, height: 40, background: "#e84e00" }}>
                <svg width="22" height="22" viewBox="0 0 26 26" fill="none">
                  <circle cx="13" cy="13" r="10" stroke="white" strokeWidth="2" />
                  <circle cx="13" cy="13" r="4" fill="white" />
                  <rect x="12" y="1" width="2" height="5" rx="1" fill="white" />
                  <rect x="12" y="20" width="2" height="5" rx="1" fill="white" />
                  <rect x="1" y="12" width="5" height="2" rx="1" fill="white" />
                  <rect x="20" y="12" width="5" height="2" rx="1" fill="white" />
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 22, letterSpacing: "0.1em", color: "#f0ede8", textTransform: "uppercase", lineHeight: 1 }}>
                  ГРЯЗЬ&nbsp;<span style={{ color: "#e84e00" }}>&amp;</span>&nbsp;КАМНИ
                </span>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 500, fontSize: 9, letterSpacing: "0.28em", color: "#6b6357", textTransform: "uppercase" }}>
                  OFF&#8209;ROAD COMMUNITY
                </span>
              </div>
            </Link>

            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: "#6b6357", lineHeight: 1.7 }}>
              Крупнейшее сообщество любителей бездорожья в России. Маршруты, клубы, экспедиции и живое общение.
            </p>

            {/* newsletter */}
            <div>
              <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#aaa49e", marginBottom: 10 }}>
                Подписка на новости
              </p>
              <div className="flex" style={{ border: "1px solid #2a2520" }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-3 py-2.5 bg-transparent outline-none"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, letterSpacing: "0.04em", color: "#f0ede8" }}
                />
                <button
                  className="px-4 py-2.5 transition-colors hover:bg-[#ff6520]"
                  style={{ background: "#e84e00", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#fff", border: "none" }}
                >
                  OK
                </button>
              </div>
            </div>

            {/* socials */}
            <div className="flex items-center gap-3">
              {[
                { title: "VK", path: "M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.953 16.5h-1.79c-.678 0-.886-.54-2.104-1.77-.955-.97-1.376-.967-1.376-.967s-.336-.036-.336.474v1.617c0 .376-.12.6-1.103.6-1.625 0-3.428-.984-4.697-2.818C4.9 11.76 4.5 9.9 4.5 9.9s-.083-.333.253-.333h1.79c.29 0 .4.13.51.44.564 1.624 1.507 3.045 1.896 3.045.146 0 .212-.067.212-.433V10.89c-.042-.77-.45-.836-.45-.836s-.22-.025-.22-.25c0-.196.16-.25.25-.25h2.82c.245 0 .33.13.33.415v2.273c0 .218.097.294.156.294.146 0 .269-.076.538-.35.834-.934 1.428-2.372 1.428-2.372s.148-.32.437-.32h1.79c.536 0 .65.278.536.656-.22.76-2.386 3.27-2.386 3.27s-.192.224 0 .48c.14.188 1.6 1.55 2.008 2.076.375.49.668.893.741 1.178.07.27-.079.516-.375.516z" },
                { title: "Telegram", path: "M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.247l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.932z" },
                { title: "YouTube", path: "M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.5 12s0 2.4-.305 3.556a1.85 1.85 0 0 1-1.302 1.309C14.74 17.17 12 17.17 12 17.17s-2.74 0-3.893-.305a1.85 1.85 0 0 1-1.302-1.31C6.5 14.4 6.5 12 6.5 12s0-2.4.305-3.556a1.85 1.85 0 0 1 1.302-1.309C9.26 6.83 12 6.83 12 6.83s2.74 0 3.893.305a1.85 1.85 0 0 1 1.302 1.31C17.5 9.6 17.5 12 17.5 12zm-6.5 2l3.5-2-3.5-2v4z" },
              ].map(s => (
                <a key={s.title} href="#" title={s.title}
                  className="flex items-center justify-center w-9 h-9 border transition-colors hover:border-[#e84e00] hover:bg-[rgba(232,78,0,0.1)]"
                  style={{ borderColor: "#2a2520" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#6b6357">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* RIGHT: nav columns */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 130px)", gap: 32 }}>
            {FOOTER_COLS.map(col => (
              <div key={col.title} className="flex flex-col gap-4">
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", color: "#f0ede8" }}>
                  {col.title}
                </span>
                <div className="flex flex-col gap-2.5">
                  {col.links.map(link => (
                    <a key={link} href="#" className="transition-colors hover:text-[#e84e00]"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, letterSpacing: "0.06em", color: "#6b6357", textDecoration: "none" }}
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-14 pt-8" style={{ borderTop: "1px solid #2a2520" }}>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, letterSpacing: "0.1em", color: "#3a3530" }}>
            © 2026 ГРЯЗЬ &amp; КАМНИ. Все права защищены.
          </span>
          <div className="flex items-center gap-6">
            {["Политика конфиденциальности", "Условия использования", "Карта сайта"].map(l => (
              <a key={l} href="#" className="transition-colors hover:text-[#e84e00]"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, letterSpacing: "0.1em", color: "#3a3530", textDecoration: "none" }}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
