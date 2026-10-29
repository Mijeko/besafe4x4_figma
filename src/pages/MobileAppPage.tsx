import { useState } from "react";
import { useNavigate } from "react-router";
import "./MobileAppPage.css";

type MobileTab = "home" | "map" | "trips" | "profile";

const HOME_CARDS = [
  {
    id: "community",
    eyebrow: "Клубы · События · Туры",
    title: "Выезды и сообщество",
    description: "Находите клубы, поездки, события и людей, с которыми по пути.",
    image: "https://images.unsplash.com/photo-1636138103626-8057cad9c335?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=90&w=1200",
    alt: "Внедорожник на горной дороге",
    target: "/events",
    icon: "mountain",
  },
  {
    id: "help",
    eyebrow: "SOS · Помощь · Рядом",
    title: "Помощь в пути",
    description: "Отправьте сигнал, примите заявку рядом или помогите другому экипажу.",
    image: "https://images.unsplash.com/photo-1659430000545-84a3b2acff16?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=90&w=1200",
    alt: "Автомобиль на сложной грязевой дороге",
    target: "/lk/signals",
    icon: "help",
  },
  {
    id: "tracking",
    eyebrow: "Маршруты · Геопозиция · SOS",
    title: "Карта и трекинг",
    description: "Записывайте маршрут, делитесь координатами и находите интересное рядом.",
    image: "https://images.unsplash.com/photo-1769732107924-131c40f6e353?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=90&w=1200",
    alt: "Путешественник смотрит на горную долину",
    target: "/events",
    icon: "pin",
  },
];

function BrandMark() {
  return (
    <div className="mobile-brand-mark">
      <svg width="43" height="43" viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="17" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="22" cy="22" r="6" fill="currentColor" />
        <path d="M22 2v9M22 33v9M2 22h9M33 22h9M8 8l7 7M29 29l7 7M36 8l-7 7M15 29l-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function FeatureIcon({ name }: { name: string }) {
  if (name === "help") {
    return (
      <svg viewBox="0 0 42 42" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="m14 25-6-6a4 4 0 0 1 6-6l4 4M28 25l6-6a4 4 0 0 0-6-6l-4 4" strokeLinecap="round" />
        <path d="m13 22 8 8 8-8M17 17l4-4 4 4M11 28l5 5M31 28l-5 5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === "pin") {
    return (
      <svg viewBox="0 0 42 42" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M21 4a9 9 0 0 0-9 9c0 7 9 16 9 16s9-9 9-16a9 9 0 0 0-9-9Z" />
        <circle cx="21" cy="13" r="3" />
        <path d="M15 29C8 30 4 32 4 34c0 3 8 5 17 5s17-2 17-5c0-2-4-4-11-5" strokeDasharray="4 4" />
      </svg>
    );
  }
  if (name === "route") {
    return (
      <svg viewBox="0 0 42 42" fill="none" stroke="currentColor" strokeWidth="2.2">
        <circle cx="10" cy="32" r="4" /><circle cx="32" cy="10" r="4" />
        <path d="M14 32h5c9 0 4-14 13-18M8 27C5 22 6 15 11 12c4-3 8-1 10-5" strokeLinecap="round" strokeDasharray="4 4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 42 42" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="m3 33 10-19 7 11 6-15 13 23H3Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m11 33 7-12 8 12" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="25" height="18" viewBox="0 0 27 20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 10h23M16 2l8 8-8 8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MobileHome({ onOpen }: { onOpen: (target: string) => void }) {
  return (
    <>
      <section className="mobile-welcome">
        <p>Добрый вечер, Иван</p>
        <h1>Куда отправимся сегодня?</h1>
      </section>
      <section className="mobile-feature-list">
        {HOME_CARDS.map((card) => (
          <article className="mobile-feature-card" key={card.id} onClick={() => onOpen(card.target)}>
            <img src={card.image} alt={card.alt} />
            <div className="mobile-feature-shade" />
            <div className="mobile-feature-tag">
              <FeatureIcon name={card.icon} />
              <span>{card.eyebrow}</span>
            </div>
            <div className="mobile-feature-content">
              <div className="mobile-feature-symbol"><FeatureIcon name={card.icon} /></div>
              <h2>{card.title}</h2>
              <p>{card.description}</p>
            </div>
            <button aria-label={`Открыть ${card.title}`}><ArrowIcon /></button>
          </article>
        ))}
      </section>
      <div className="mobile-home-signature"><span />Грязь &amp; Камни<span /></div>
    </>
  );
}

function MobilePlaceholder({ tab, onHome }: { tab: Exclude<MobileTab, "home">; onHome: () => void }) {
  const content = {
    map: {
      overline: "Всё рядом",
      title: "Карта сообщества",
      text: "События, туры, клубы, сервисы и сигналы помощи на одной карте.",
      image: "https://images.unsplash.com/photo-1769732107924-131c40f6e353?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=90&w=1200",
    },
    trips: {
      overline: "Ваши планы",
      title: "Мои поездки",
      text: "Сохранённые туры, регистрации на события и записанные маршруты.",
      image: "https://images.unsplash.com/photo-1636138100130-1780f51e3bee?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=90&w=1200",
    },
    profile: {
      overline: "Личный кабинет",
      title: "Иван Морозов",
      text: "Машины, клубы, достижения, друзья и настройки безопасности.",
      image: "https://images.unsplash.com/photo-1721933004371-9484b6fa8175?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=90&w=1200",
    },
  }[tab];

  return (
    <section className="mobile-placeholder">
      <img src={content.image} alt="" />
      <div className="mobile-placeholder-shade" />
      <div className="mobile-placeholder-content">
        <span>{content.overline}</span>
        <h1>{content.title}</h1>
        <p>{content.text}</p>
        <button onClick={onHome}>Вернуться на главную</button>
      </div>
    </section>
  );
}

export default function MobileAppPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<MobileTab>("home");
  const [notifications, setNotifications] = useState(3);

  return (
    <div className="mobile-app">
      <div className="mobile-app-background" />
      <header className="mobile-app-header">
        <div className="mobile-brand">
          <BrandMark />
          <div>
            <strong>Грязь <i>&amp;</i> Камни</strong>
            <span>Люди. Дороги. Приключения.</span>
          </div>
        </div>
        <div className="mobile-header-actions">
          <button onClick={() => setNotifications(0)} aria-label="Уведомления">
            <svg width="23" height="25" viewBox="0 0 24 26" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M4 18h16l-2-3V9a6 6 0 0 0-12 0v6l-2 3Z" strokeLinejoin="round" />
              <path d="M9 22a3 3 0 0 0 6 0" strokeLinecap="round" />
            </svg>
            {notifications > 0 && <span>{notifications}</span>}
          </button>
          <button className="mobile-avatar" onClick={() => setTab("profile")} aria-label="Профиль">
            <img src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?crop=faces&fit=crop&fm=jpg&q=85&w=120&h=120" alt="Иван Морозов" />
          </button>
        </div>
      </header>

      <main className="mobile-app-main">
        {tab === "home" ? <MobileHome onOpen={navigate} /> : <MobilePlaceholder tab={tab} onHome={() => setTab("home")} />}
      </main>

      <nav className="mobile-bottom-nav">
        <button className={tab === "home" ? "is-active" : ""} onClick={() => setTab("home")}>
          <svg width="21" height="21" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="m2 10 9-8 9 8v10h-6v-6H8v6H2V10Z" strokeLinejoin="round" /></svg>
          <span>Главная</span>
        </button>
        <button className={tab === "map" ? "is-active" : ""} onClick={() => setTab("map")}>
          <svg width="21" height="21" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="m2 5 6-3 6 3 6-3v15l-6 3-6-3-6 3V5ZM8 2v15M14 5v15" /></svg>
          <span>Карта</span>
        </button>
        <button className="mobile-sos-button" onClick={() => navigate("/lk/signals")}>
          <i>SOS</i>
        </button>
        <button className={tab === "trips" ? "is-active" : ""} onClick={() => setTab("trips")}>
          <svg width="21" height="21" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 7h14v12H4zM8 7V4h6v3M1 12h20M7 12v3M15 12v3" /></svg>
          <span>Поездки</span>
        </button>
        <button className={tab === "profile" ? "is-active" : ""} onClick={() => setTab("profile")}>
          <svg width="21" height="21" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="11" cy="7" r="4" /><path d="M3 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>
          <span>Профиль</span>
        </button>
      </nav>
    </div>
  );
}
