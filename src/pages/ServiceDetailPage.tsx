import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getAutoServiceBySlug } from "../data/services";

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const service = getAutoServiceBySlug(slug ?? "");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [bookingSent, setBookingSent] = useState(false);

  useEffect(() => {
    if (!bookingOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setBookingOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [bookingOpen]);

  const openBooking = (serviceName = "") => {
    setSelectedService(serviceName);
    setBookingSent(false);
    setBookingOpen(true);
  };

  const closeBooking = () => {
    setBookingOpen(false);
    setBookingSent(false);
  };

  if (!service) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 bg-background">
        <div className="font-['Barlow_Condensed'] text-3xl font-black uppercase">Автосервис не найден</div>
        <button onClick={() => navigate("/services")} className="bg-primary px-6 py-3 font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-widest text-primary-foreground">Все автосервисы</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative h-[32rem] overflow-hidden bg-foreground">
        <img src={service.image} alt={service.name} className="absolute inset-0 h-full w-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/75 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-14">
          <button onClick={() => navigate("/services")} className="mb-8 w-fit bg-transparent font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white">← Все автосервисы</button>
          <div className="mb-3 flex flex-wrap gap-2">
            {service.specialties.map((item) => <span key={item} className="border border-white/20 bg-white/10 px-3 py-1 font-['Barlow_Condensed'] text-[10px] font-bold uppercase tracking-widest text-white/70">{item}</span>)}
          </div>
          <div className="font-['Barlow_Condensed'] text-6xl font-black uppercase leading-none tracking-wide text-white md:text-8xl">{service.name}</div>
          <div className="mt-5 flex flex-wrap items-center gap-5 font-['Barlow_Condensed'] text-sm uppercase tracking-widest text-white/60">
            <span className="bg-primary px-3 py-1 font-black text-white">★ {service.rating}</span>
            <span>{service.reviews} отзывов</span>
            <span>{service.city}</span>
            <span>Опыт {service.experience}</span>
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1fr_22rem]">
        <div>
          <section className="mb-12">
            <div className="mb-2 font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-[0.25em] text-primary">О мастерской</div>
            <div className="mb-5 font-['Barlow_Condensed'] text-4xl font-black uppercase tracking-wide">Готовим к настоящему бездорожью</div>
            <p className="max-w-3xl text-base leading-7 text-secondary-foreground">{service.description}</p>
          </section>

          <section>
            <div className="mb-2 font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-[0.25em] text-primary">Прайс-лист</div>
            <div className="mb-6 font-['Barlow_Condensed'] text-4xl font-black uppercase tracking-wide">Услуги автосервиса</div>
            <div className="border border-border bg-card">
              {service.services.map((item, index) => (
                <div key={item.name} className={`grid gap-5 p-6 md:grid-cols-[1fr_auto] ${index < service.services.length - 1 ? "border-b border-border" : ""}`}>
                  <div>
                    <div className="font-['Barlow_Condensed'] text-xl font-black uppercase tracking-wide">{item.name}</div>
                    <p className="mt-2 text-sm leading-6 text-secondary-foreground">{item.description}</p>
                    <div className="mt-3 font-['Barlow_Condensed'] text-xs uppercase tracking-widest text-muted-foreground">Срок: {item.duration}</div>
                  </div>
                  <div className="flex items-center gap-5 md:flex-col md:items-end md:justify-center">
                    <div className="whitespace-nowrap font-['Barlow_Condensed'] text-2xl font-black text-primary">{item.price}</div>
                    <button onClick={() => openBooking(item.name)} className="border border-primary px-4 py-2 font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-widest text-primary transition hover:bg-primary hover:text-white">Записаться</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside>
          <div className="sticky top-6 border border-border border-t-4 border-t-primary bg-card p-7 text-foreground">
            <div className="font-['Barlow_Condensed'] text-2xl font-black uppercase tracking-wide">Запись в сервис</div>
            <div className="mt-6 space-y-5">
              <div><div className="font-['Barlow_Condensed'] text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Адрес</div><div className="mt-1 text-sm leading-6">{service.city}, {service.address}</div></div>
              <div><div className="font-['Barlow_Condensed'] text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Телефон</div><div className="mt-1 font-['Barlow_Condensed'] text-lg font-bold">{service.phone}</div></div>
              <div><div className="font-['Barlow_Condensed'] text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Режим работы</div><div className="mt-1 text-sm">{service.schedule}</div></div>
            </div>
            <button onClick={() => openBooking()} className="mt-7 w-full bg-primary py-3 font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-widest text-primary-foreground">Записаться онлайн</button>
          </div>
        </aside>
      </main>

      {bookingOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeBooking();
          }}
        >
          <div role="dialog" aria-modal="true" aria-labelledby="booking-title" className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto border border-border bg-card shadow-2xl">
            <div className="h-1 bg-primary" />
            <button onClick={closeBooking} aria-label="Закрыть окно" className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center border border-border bg-card text-muted-foreground transition hover:border-primary hover:text-primary">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                <path d="M1 1l12 12M13 1 1 13" />
              </svg>
            </button>

            {bookingSent ? (
              <div className="px-7 py-14 text-center md:px-12">
                <div className="mx-auto flex h-14 w-14 items-center justify-center bg-primary text-white">
                  <svg width="26" height="20" viewBox="0 0 26 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m2 10 7 7L24 2" />
                  </svg>
                </div>
                <div className="mt-6 font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-[0.25em] text-primary">Заявка отправлена</div>
                <div id="booking-title" className="mt-2 font-['Barlow_Condensed'] text-4xl font-black uppercase tracking-wide">Скоро свяжемся</div>
                <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-secondary-foreground">Администратор {service.name} перезвонит, уточнит детали и предложит удобное время для визита.</p>
                <button onClick={closeBooking} className="mt-8 bg-primary px-8 py-3 font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-widest text-primary-foreground">Готово</button>
              </div>
            ) : (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  setBookingSent(true);
                }}
                className="px-7 pb-8 pt-7 md:px-10 md:pb-10"
              >
                <div className="pr-12">
                  <div className="font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-[0.25em] text-primary">Онлайн-запись</div>
                  <div id="booking-title" className="mt-1 font-['Barlow_Condensed'] text-4xl font-black uppercase leading-none tracking-wide">{service.name}</div>
                  <p className="mt-3 text-sm leading-6 text-secondary-foreground">Оставьте контакты — мастер уточнит задачу, стоимость и свободное время.</p>
                </div>

                <div className="mt-7 grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-widest text-secondary-foreground">Ваше имя *</span>
                    <input required name="name" autoComplete="name" placeholder="Иван" className="w-full border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-widest text-secondary-foreground">Телефон *</span>
                    <input required name="phone" type="tel" autoComplete="tel" placeholder="+7 999 000-00-00" className="w-full border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-widest text-secondary-foreground">Автомобиль</span>
                    <input name="vehicle" placeholder="Toyota Land Cruiser 200" className="w-full border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-widest text-secondary-foreground">Желаемая дата</span>
                    <input name="date" type="date" className="w-full border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary" />
                  </label>
                  <label className="block md:col-span-2">
                    <span className="mb-2 block font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-widest text-secondary-foreground">Услуга</span>
                    <select value={selectedService} onChange={(event) => setSelectedService(event.target.value)} className="w-full border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary">
                      <option value="">Нужна консультация мастера</option>
                      {service.services.map((item) => <option key={item.name} value={item.name}>{item.name} — {item.price}</option>)}
                    </select>
                  </label>
                  <label className="block md:col-span-2">
                    <span className="mb-2 block font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-widest text-secondary-foreground">Комментарий</span>
                    <textarea name="comment" rows={3} placeholder="Расскажите, что нужно сделать с автомобилем" className="w-full resize-none border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary" />
                  </label>
                </div>

                <div className="mt-7 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="max-w-xs text-xs leading-5 text-muted-foreground">Нажимая кнопку, вы соглашаетесь на обработку контактных данных.</div>
                  <button type="submit" className="bg-primary px-7 py-3 font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-widest text-primary-foreground">Отправить заявку</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
