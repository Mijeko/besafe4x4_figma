import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

type Event = {
  id: number;
  date: string;
  day: number;
  month: string;
  monthNum: number;
  title: string;
  location: string;
  city: string;
  type: string;
  typeColor: string;
  participants: number;
  maxParticipants: number;
  difficulty: string;
  img: string;
  description: string;
  registered: boolean;
  x: number;
  y: number;
};

const EVENTS: Event[] = [
  {
    id: 1,
    date: "02 сентября 2026",
    day: 2,
    month: "Сен",
    monthNum: 9,
    title: "Осеннее бездорожье 2026",
    location: "Ленинградская обл., Тихвинский р-н",
    city: "Санкт-Петербург",
    type: "Слёт",
    typeColor: "#e84e00",
    participants: 134,
    maxParticipants: 200,
    difficulty: "Средний",
    img: "https://images.unsplash.com/photo-1640636430737-de4ae2656d43?w=700&h=430&fit=crop&auto=format",
    description: "Большой осенний слёт: три внедорожные трассы, полевой лагерь, мастер-классы и вечерняя программа у костра.",
    registered: true,
    x: 20,
    y: 35,
  },
  {
    id: 2,
    date: "14 сентября 2026",
    day: 14,
    month: "Сен",
    monthNum: 9,
    title: "Rock Crawling Cup — Ural Open",
    location: "Свердловская обл., Уральские горы",
    city: "Екатеринбург",
    type: "Соревнование",
    typeColor: "#7a4da3",
    participants: 48,
    maxParticipants: 60,
    difficulty: "Хардкор",
    img: "https://images.unsplash.com/photo-1579097648137-4b19188fdb4e?w=700&h=430&fit=crop&auto=format",
    description: "Кубок по преодолению скальных секций для подготовленных экипажей. Техническая комиссия и три зачётные категории.",
    registered: false,
    x: 39,
    y: 52,
  },
  {
    id: 3,
    date: "21 сентября 2026",
    day: 21,
    month: "Сен",
    monthNum: 9,
    title: "Управление на скользкой дороге",
    location: "Подмосковье, полигон «Дружба»",
    city: "Москва",
    type: "Обучение",
    typeColor: "#3a9e5f",
    participants: 22,
    maxParticipants: 30,
    difficulty: "Начинающий",
    img: "https://images.unsplash.com/photo-1596507931135-75f699668356?w=700&h=430&fit=crop&auto=format",
    description: "Практический день на закрытом полигоне: колея, диагональное вывешивание, спуски и безопасная работа с лебёдкой.",
    registered: false,
    x: 16,
    y: 52,
  },
  {
    id: 4,
    date: "04 октября 2026",
    day: 4,
    month: "Окт",
    monthNum: 10,
    title: "Карелия — золотая осень",
    location: "Республика Карелия",
    city: "Петрозаводск",
    type: "Экспедиция",
    typeColor: "#c47a0b",
    participants: 31,
    maxParticipants: 40,
    difficulty: "Средний",
    img: "https://images.unsplash.com/photo-1684929954083-f10c179ed96d?w=700&h=430&fit=crop&auto=format",
    description: "Четыре дня среди карельских озёр и гранитных скал. Радиальные маршруты, ночёвки в лагере и маршрут для семейных экипажей.",
    registered: false,
    x: 18,
    y: 22,
  },
  {
    id: 5,
    date: "18 октября 2026",
    day: 18,
    month: "Окт",
    monthNum: 10,
    title: "Краснодар Mud Fest",
    location: "Краснодарский край, ст. Северская",
    city: "Краснодар",
    type: "Соревнование",
    typeColor: "#7a4da3",
    participants: 88,
    maxParticipants: 120,
    difficulty: "Средний",
    img: "https://images.unsplash.com/photo-1654162456768-ebf2c2c81bb4?w=700&h=430&fit=crop&auto=format",
    description: "Грязевая кольцевая гонка с отдельными заездами для стандартных и подготовленных автомобилей, зрительской зоной и кемпингом.",
    registered: false,
    x: 13,
    y: 73,
  },
  {
    id: 6,
    date: "01 ноября 2026",
    day: 1,
    month: "Ноя",
    monthNum: 11,
    title: "Зимняя экспедиция: подготовка",
    location: "Онлайн + площадка в Москве",
    city: "Москва",
    type: "Обучение",
    typeColor: "#3a9e5f",
    participants: 16,
    maxParticipants: 50,
    difficulty: "Начинающий",
    img: "https://images.unsplash.com/photo-1500921726673-e4bdc09efa55?w=700&h=430&fit=crop&auto=format",
    description: "Разбираем зимнее снаряжение, выбор шин, автономный обогрев и действия экипажа в нештатной ситуации.",
    registered: false,
    x: 23,
    y: 59,
  },
];

const TYPES = ["Все", "Слёт", "Соревнование", "Экспедиция", "Обучение"];
const MONTHS = [
  { value: 0, label: "Все месяцы" },
  { value: 9, label: "Сентябрь" },
  { value: 10, label: "Октябрь" },
  { value: 11, label: "Ноябрь" },
];
const DIFFICULTIES = ["Все уровни", "Начинающий", "Средний", "Хардкор"];
const CITIES = ["Все города", "Москва", "Санкт-Петербург", "Екатеринбург", "Петрозаводск", "Краснодар"];

function ChevronIcon() {
  return (
    <svg width="9" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="m1 1 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="event-filter-field">
      <span>{label}</span>
      <div>
        <select value={value} onChange={(event) => onChange(event.target.value)}>
          {children}
        </select>
        <ChevronIcon />
      </div>
    </label>
  );
}

function MapArtwork() {
  return (
    <svg className="event-map-art" viewBox="0 0 1200 720" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <pattern id="map-grid" width="72" height="72" patternUnits="userSpaceOnUse">
          <path d="M72 0H0v72" fill="none" stroke="currentColor" strokeWidth="0.7" />
        </pattern>
        <filter id="soft-map">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      <rect width="1200" height="720" fill="url(#map-grid)" opacity=".18" />
      <path className="event-map-water" d="M-20 95C124 54 171 117 258 99c109-23 116-97 231-71 109 25 132 113 238 121 127 9 207-90 492-40v-150H-20Z" />
      <path className="event-map-water" d="M625 720c52-77 123-93 181-72 53 20 87 8 133-31 63-53 152-64 281-27v150Z" />
      <path className="event-map-river" d="M581-20c-48 97-10 156-57 229-41 64-123 70-142 139-23 83 77 103 46 203-15 48-60 97-109 189" />
      <path className="event-map-river thin" d="M1146 64c-152 54-186 139-277 160-70 16-117-1-166 44-53 49-22 107-80 148-44 31-95 23-140 87" />
      <g className="event-map-terrain" filter="url(#soft-map)">
        <path d="M111 463c83-65 145-66 226-17s167 40 248-12c68-44 131-46 211 8 62 42 130 51 245 10v198H84Z" />
        <path d="M741 118c78-52 174-31 222 20 34 36 103 43 189 14v172c-98 35-184 23-236-31-47-49-111-65-197-37Z" />
      </g>
      <g className="event-map-roads">
        <path d="M-30 575C126 491 237 546 368 466s201-143 353-122c153 21 239-75 493-115" />
        <path d="M48 250c173 64 268 27 373-47 95-67 207-60 326 9 122 71 243 76 468 14" />
        <path d="M198 741c44-137 89-208 172-275 79-64 133-143 140-246 4-62 39-136 98-239" />
        <path d="M920 741c-27-148-94-231-188-298-73-52-82-130-31-232 30-61 36-133 18-231" />
      </g>
      <g className="event-map-secondary-roads">
        <path d="M-10 381c151-16 252 10 322 79 80 80 158 96 260 31 118-76 236-53 330 23 91 73 189 83 321 38" />
        <path d="M92 92c57 86 121 129 218 135 106 7 174 50 209 131 34 81 95 126 183 135" />
      </g>
      <g className="event-map-city-labels">
        <text x="108" y="395">Санкт-Петербург</text>
        <text x="117" y="572">Москва</text>
        <text x="401" y="422">Казань</text>
        <text x="482" y="547">Екатеринбург</text>
        <text x="762" y="469">Омск</text>
        <text x="920" y="373">Красноярск</text>
        <text x="1027" y="565">Иркутск</text>
      </g>
      <g className="event-map-mountains">
        <path d="m430 220 22-35 17 25 17-13 28 43" />
        <path d="m982 213 28-42 20 31 15-17 33 48" />
        <path d="m755 610 24-37 20 29 13-15 31 42" />
      </g>
    </svg>
  );
}

export function EventsPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState(EVENTS);
  const [selectedId, setSelectedId] = useState(1);
  const [activeType, setActiveType] = useState("Все");
  const [month, setMonth] = useState(0);
  const [difficulty, setDifficulty] = useState("Все уровни");
  const [city, setCity] = useState("Все города");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const filtered = useMemo(
    () =>
      events.filter(
        (event) =>
          (activeType === "Все" || event.type === activeType) &&
          (month === 0 || event.monthNum === month) &&
          (difficulty === "Все уровни" || event.difficulty === difficulty) &&
          (city === "Все города" || event.city === city),
      ),
    [activeType, city, difficulty, events, month],
  );

  const selected = filtered.find((event) => event.id === selectedId) ?? filtered[0];
  const activeFilterCount =
    Number(activeType !== "Все") +
    Number(month !== 0) +
    Number(difficulty !== "Все уровни") +
    Number(city !== "Все города");

  const resetFilters = () => {
    setActiveType("Все");
    setMonth(0);
    setDifficulty("Все уровни");
    setCity("Все города");
  };

  const toggleRegistration = (id: number) => {
    setEvents((current) =>
      current.map((event) =>
        event.id === id
          ? {
              ...event,
              registered: !event.registered,
              participants: event.participants + (event.registered ? -1 : 1),
            }
          : event,
      ),
    );
  };

  return (
    <div className="events-map-page">
      <div className="events-map-heading">
        <div>
          <p>События сообщества · Осень 2026</p>
          <h1>Карта приключений</h1>
        </div>
        <div className="events-map-heading-meta">
          <span><b>{filtered.length}</b> событий на карте</span>
          <span><i /> {events.filter((event) => event.registered).length} в моём календаре</span>
        </div>
      </div>

      <div className="events-map-shell">
        <button className="events-filter-mobile-button" onClick={() => setFiltersOpen((open) => !open)}>
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 4h14M5 9h8M7 14h4" strokeLinecap="round" />
          </svg>
          Фильтры
          {activeFilterCount > 0 && <span>{activeFilterCount}</span>}
        </button>

        <aside className={`events-filter-panel ${filtersOpen ? "is-open" : ""}`}>
          <div className="events-filter-title">
            <div>
              <span>Поиск событий</span>
              <strong>Фильтры</strong>
            </div>
            {activeFilterCount > 0 && <button onClick={resetFilters}>Сбросить</button>}
          </div>

          <div className="events-type-filter">
            <span className="events-filter-label">Формат</span>
            <div>
              {TYPES.map((type) => (
                <button
                  key={type}
                  className={activeType === type ? "is-active" : ""}
                  onClick={() => setActiveType(type)}
                >
                  {type}
                  <span>{type === "Все" ? events.length : events.filter((event) => event.type === type).length}</span>
                </button>
              ))}
            </div>
          </div>

          <FilterSelect label="Дата" value={month} onChange={(value) => setMonth(Number(value))}>
            {MONTHS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </FilterSelect>
          <FilterSelect label="Уровень подготовки" value={difficulty} onChange={setDifficulty}>
            {DIFFICULTIES.map((item) => <option key={item}>{item}</option>)}
          </FilterSelect>
          <FilterSelect label="Город" value={city} onChange={setCity}>
            {CITIES.map((item) => <option key={item}>{item}</option>)}
          </FilterSelect>

          <div className="events-map-legend">
            <span className="events-filter-label">Обозначения</span>
            <div>
              {TYPES.slice(1).map((type) => {
                const color = events.find((event) => event.type === type)?.typeColor;
                return <span key={type}><i style={{ background: color }} />{type}</span>;
              })}
            </div>
          </div>

          <button className="events-filter-apply" onClick={() => setFiltersOpen(false)}>
            Показать {filtered.length} событи{filtered.length === 1 ? "е" : filtered.length > 1 && filtered.length < 5 ? "я" : "й"}
          </button>
        </aside>

        <section className="events-map-viewport">
          <div className="events-map-canvas" style={{ transform: `scale(${zoom})` }}>
            <MapArtwork />
            {filtered.map((event) => (
              <button
                key={event.id}
                className={`event-map-pin ${selected?.id === event.id ? "is-selected" : ""}`}
                style={{ left: `${event.x}%`, top: `${event.y}%`, "--pin-color": event.typeColor } as React.CSSProperties}
                onClick={() => setSelectedId(event.id)}
                aria-label={`${event.title}, ${event.date}`}
              >
                <span className="event-map-pin-pulse" />
                <span className="event-map-pin-marker">
                  <strong>{event.day}</strong>
                  <small>{event.month}</small>
                </span>
                <span className="event-map-pin-label">{event.city}</span>
              </button>
            ))}
          </div>

          <div className="events-map-controls">
            <button onClick={() => setZoom((value) => Math.min(1.35, value + 0.1))} aria-label="Приблизить">+</button>
            <button onClick={() => setZoom((value) => Math.max(0.9, value - 0.1))} aria-label="Отдалить">−</button>
            <button onClick={() => setZoom(1)} aria-label="Сбросить масштаб">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
                <circle cx="8" cy="8" r="5.5" />
                <circle cx="8" cy="8" r="1.5" />
                <path d="M8 0v2.5M8 13.5V16M0 8h2.5M13.5 8H16" />
              </svg>
            </button>
          </div>

          {selected ? (
            <article className="event-map-card">
              <div className="event-map-card-image">
                <img src={selected.img} alt="" />
                <span style={{ background: selected.typeColor }}>{selected.type}</span>
                {selected.registered && <b>Вы участвуете</b>}
              </div>
              <div className="event-map-card-body">
                <div className="event-map-card-date">
                  <span>{selected.date}</span>
                  <em>{selected.difficulty}</em>
                </div>
                <h2>{selected.title}</h2>
                <p className="event-map-card-location">
                  <svg width="11" height="14" viewBox="0 0 12 14" fill="currentColor">
                    <path d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5Zm0 6.75A1.75 1.75 0 1 1 6 3.25a1.75 1.75 0 0 1 0 3.5Z" />
                  </svg>
                  {selected.location}
                </p>
                <p className="event-map-card-description">{selected.description}</p>
                <div className="event-map-card-capacity">
                  <div>
                    <span>Участники</span>
                    <b>{selected.participants} / {selected.maxParticipants}</b>
                  </div>
                  <div>
                    <i style={{ width: `${(selected.participants / selected.maxParticipants) * 100}%` }} />
                  </div>
                </div>
                <div className="event-map-card-actions">
                  <button onClick={() => navigate(`/events/${selected.id}`)}>
                    Подробнее
                    <svg width="14" height="9" viewBox="0 0 15 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M1 5h12M9 1l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button className={selected.registered ? "is-registered" : ""} onClick={() => toggleRegistration(selected.id)}>
                    {selected.registered ? "Отменить запись" : "Записаться"}
                  </button>
                </div>
              </div>
            </article>
          ) : (
            <div className="events-map-empty">
              <strong>Здесь пока тихо</strong>
              <span>Измените фильтры, чтобы увидеть другие события</span>
              <button onClick={resetFilters}>Сбросить фильтры</button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
