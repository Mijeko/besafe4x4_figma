import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { TOURS } from "../data/tours";

const TYPES = ["Все", "Автотур", "Пеший тур"];
const REGIONS = ["Все регионы", ...new Set(TOURS.map((tour) => tour.region))];
const DIFFICULTIES = ["Любая сложность", "Лёгкий", "Средний", "Сложный"];

export default function ToursPage() {
  const navigate = useNavigate();
  const [type, setType] = useState("Все");
  const [region, setRegion] = useState("Все регионы");
  const [difficulty, setDifficulty] = useState("Любая сложность");
  const [search, setSearch] = useState("");

  const tours = useMemo(() => {
    const query = search.trim().toLowerCase();
    return TOURS.filter((tour) =>
      (type === "Все" || tour.type === type) &&
      (region === "Все регионы" || tour.region === region) &&
      (difficulty === "Любая сложность" || tour.difficulty === difficulty) &&
      (!query || `${tour.title} ${tour.region} ${tour.startCity}`.toLowerCase().includes(query)),
    );
  }, [difficulty, region, search, type]);

  return (
    <div className="tours-page">
      <section className="tours-hero">
        <img src="https://images.unsplash.com/photo-1698790723006-b19a91e35702?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=90&w=1800" alt="Автомобильный маршрут в горах" />
        <div className="tours-hero-overlay" />
        <div className="tours-hero-content">
          <span>Путешествия сообщества</span>
          <h1>Туры, после которых есть что вспомнить</h1>
          <p>Пешком или за рулём. С опытным организатором, продуманным маршрутом и людьми, которым тоже тесно дома.</p>
          <div className="tours-hero-types">
            {TYPES.map((item) => (
              <button key={item} className={type === item ? "is-active" : ""} onClick={() => setType(item)}>
                {item === "Автотур" && (
                  <svg width="19" height="16" viewBox="0 0 22 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="m3 11 2-6h12l2 6M1 11h20v5H1zM5 16v2M17 16v2M6 13h2M14 13h2" />
                  </svg>
                )}
                {item === "Пеший тур" && (
                  <svg width="16" height="18" viewBox="0 0 18 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="10" cy="3" r="2" /><path d="m8 6-3 5 3 2 2 6M9 8l4 3 3-1M6 12l-3 6" strokeLinecap="round" />
                  </svg>
                )}
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="tours-hero-note">
          <strong>{TOURS.length}</strong>
          <span>ближайших путешествий</span>
        </div>
      </section>

      <main className="tours-content">
        <div className="tours-intro">
          <div>
            <span>Найди своё направление</span>
            <h2>Ближайшие туры</h2>
          </div>
          <p>Все организаторы — участники сообщества с подтверждённым опытом и отзывами.</p>
        </div>

        <div className="tours-filters">
          <label className="tours-search">
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="8" cy="8" r="5.5" /><path d="m12 12 4 4" strokeLinecap="round" />
            </svg>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Куда хотите отправиться?" />
          </label>
          <label>
            <span>Регион</span>
            <select value={region} onChange={(event) => setRegion(event.target.value)}>
              {REGIONS.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>
            <span>Сложность</span>
            <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
              {DIFFICULTIES.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <div className="tours-filter-result"><b>{tours.length}</b><span>туров найдено</span></div>
        </div>

        {tours.length > 0 ? (
          <div className="tours-grid">
            {tours.map((tour, index) => (
              <article className={`tour-card ${index === 0 ? "is-featured" : ""}`} key={tour.id}>
                <div className="tour-card-image" onClick={() => navigate(`/tours/${tour.id}`)}>
                  <img src={tour.image} alt={tour.title} />
                  <span className={`tour-card-type ${tour.type === "Пеший тур" ? "is-walking" : ""}`}>{tour.type}</span>
                  <span className="tour-card-seats">{tour.seats} мест</span>
                  <button aria-label="Добавить тур в избранное">
                    <svg width="17" height="16" viewBox="0 0 18 17" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 15.5 2.2 9.1C-1.5 5.5 3.7-.1 7.5 3.3L9 4.8l1.5-1.5c3.8-3.4 9 2.2 5.3 5.8Z" />
                    </svg>
                  </button>
                </div>
                <div className="tour-card-body">
                  <div className="tour-card-meta">
                    <span>{tour.region}</span>
                    <b>★ {tour.rating} <em>({tour.reviews})</em></b>
                  </div>
                  <h3 onClick={() => navigate(`/tours/${tour.id}`)}>{tour.title}</h3>
                  <p>{tour.subtitle}</p>
                  <div className="tour-card-facts">
                    <div><span>Ближайшая дата</span><strong>{tour.nextDate}</strong></div>
                    <div><span>Длительность</span><strong>{tour.duration} дней</strong></div>
                    <div><span>Маршрут</span><strong>{tour.distance}</strong></div>
                  </div>
                  <div className="tour-card-footer">
                    <div><span>от</span><strong>{tour.price.toLocaleString("ru")} ₽</strong><small>за человека</small></div>
                    <button onClick={() => navigate(`/tours/${tour.id}`)}>Подробнее <span>→</span></button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="tours-empty">
            <strong>Подходящих туров пока нет</strong>
            <p>Попробуйте выбрать другой регион или уровень сложности.</p>
            <button onClick={() => { setSearch(""); setRegion("Все регионы"); setDifficulty("Любая сложность"); setType("Все"); }}>Сбросить фильтры</button>
          </div>
        )}

        <section className="tours-organizer-banner">
          <div>
            <span>Для организаторов</span>
            <h2>Знаете маршрут, который стоит показать?</h2>
            <p>Создайте тур, соберите группу и управляйте заявками внутри сообщества.</p>
          </div>
          <button>Предложить свой тур</button>
        </section>
      </main>
    </div>
  );
}
