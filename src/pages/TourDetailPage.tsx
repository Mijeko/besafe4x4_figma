import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getTourById } from "../data/tours";

export default function TourDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tour = getTourById(id ?? "");
  const [date, setDate] = useState(tour?.dates[0] ?? "");
  const [people, setPeople] = useState(1);
  const [requested, setRequested] = useState(false);

  if (!tour) {
    navigate("/tours");
    return null;
  }

  return (
    <div className="tour-detail-page">
      <div className="tour-detail-breadcrumb">
        <button onClick={() => navigate("/tours")}>Все туры</button><span>›</span><b>{tour.title}</b>
      </div>
      <section className="tour-detail-hero">
        <img src={tour.image} alt={tour.title} />
        <div />
        <div className="tour-detail-hero-content">
          <span>{tour.type} · {tour.region}</span>
          <h1>{tour.title}</h1>
          <p>{tour.subtitle}</p>
          <div>
            <b>★ {tour.rating} <small>{tour.reviews} отзывов</small></b>
            <b>{tour.duration} дней</b>
            <b>{tour.distance}</b>
            <b>{tour.difficulty}</b>
          </div>
        </div>
      </section>

      <main className="tour-detail-layout">
        <div className="tour-detail-main">
          <section className="tour-detail-description">
            <span>О путешествии</span>
            <h2>Маршрут, который запомнится</h2>
            <p>{tour.description}</p>
          </section>

          <div className="tour-detail-gallery">
            {tour.gallery.map((image, index) => <img key={image} src={image} alt={`${tour.title}, фотография ${index + 1}`} />)}
          </div>

          <section className="tour-itinerary">
            <div className="tour-detail-section-title"><span>По дням</span><h2>Программа тура</h2></div>
            <div>
              {tour.itinerary.map((item, index) => (
                <article key={item.day}>
                  <i>{String(index + 1).padStart(2, "0")}</i>
                  <div><span>{item.day}</span><h3>{item.title}</h3><p>{item.description}</p></div>
                </article>
              ))}
            </div>
          </section>

          <div className="tour-detail-columns">
            <section>
              <h3>Включено в стоимость</h3>
              {tour.included.map((item) => <div key={item}><i>✓</i><span>{item}</span></div>)}
            </section>
            <section>
              <h3>Что взять с собой</h3>
              {tour.equipment.map((item) => <div key={item}><i>—</i><span>{item}</span></div>)}
            </section>
          </div>
        </div>

        <aside className="tour-booking">
          <span>Стоимость участия</span>
          <div className="tour-booking-price"><strong>{tour.price.toLocaleString("ru")} ₽</strong><small>за человека</small></div>
          <label><span>Дата старта</span><select value={date} onChange={(event) => setDate(event.target.value)}>{tour.dates.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>
            <span>Участники</span>
            <div className="tour-booking-people">
              <button onClick={() => setPeople((value) => Math.max(1, value - 1))}>−</button>
              <b>{people}</b>
              <button onClick={() => setPeople((value) => Math.min(tour.seats, value + 1))}>+</button>
            </div>
          </label>
          <div className="tour-booking-total"><span>Итого</span><strong>{(tour.price * people).toLocaleString("ru")} ₽</strong></div>
          <button className={requested ? "is-success" : ""} onClick={() => setRequested(true)}>
            {requested ? "Заявка отправлена" : "Оставить заявку"}
          </button>
          <p>Оплата только после подтверждения организатором. Осталось {tour.seats} мест.</p>
          <div className="tour-organizer">
            <i>{tour.organizer.slice(0, 1)}</i>
            <div><span>Организатор</span><strong>{tour.organizer}</strong><small>{tour.organizerSince}</small></div>
          </div>
        </aside>
      </main>
    </div>
  );
}
