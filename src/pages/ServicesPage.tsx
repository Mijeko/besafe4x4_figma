import { useState } from "react";
import { useNavigate } from "react-router";
import { AUTO_SERVICES } from "../data/services";

const SERVICE_FILTERS = [
  { name: "Все", label: "Все сервисы", icon: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></> },
  { name: "Подвеска", label: "Подвеска", icon: <><path d="M9 2v3l-2 2 4 3-4 3 4 3-2 2v4M15 2v20" /><path d="M5 2h8M5 22h8M13 6h4M13 18h4" /></> },
  { name: "Лебёдки", label: "Лебёдки", icon: <><rect x="3" y="6" width="18" height="12" rx="1" /><circle cx="12" cy="12" r="4" /><path d="M12 8v8M8 12h8M3 9H1M23 9h-2" /></> },
  { name: "Защита", label: "Защита", icon: <path d="M12 2 20 5v6c0 5.2-3.4 9.1-8 11-4.6-1.9-8-5.8-8-11V5l8-3Z" /> },
  { name: "Электрика", label: "Электрика", icon: <path d="m13 2-8 12h6l-1 8 9-13h-6V2Z" /> },
  { name: "Шины", label: "Шины", icon: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><path d="m6 5 3 4M15 15l3 4M18 5l-3 4M9 15l-3 4" /></> },
  { name: "ТО", label: "Техобслуживание", icon: <path d="M14.5 5.5a5 5 0 0 0-6.4 6.4L3 17l4 4 5.1-5.1a5 5 0 0 0 6.4-6.4l-3.2 3.2-4-4 3.2-3.2Z" /> },
  { name: "Тюнинг", label: "Тюнинг", icon: <><path d="M4 4v16M12 4v16M20 4v16M1 8h6M9 16h6M17 10h6" /><circle cx="4" cy="8" r="2" /><circle cx="12" cy="16" r="2" /><circle cx="20" cy="10" r="2" /></> },
];

export default function ServicesPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("Все");
  const visible = filter === "Все" ? AUTO_SERVICES : AUTO_SERVICES.filter((service) => service.specialties.includes(filter));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden bg-foreground">
        <img
          src="https://images.unsplash.com/photo-1727893119356-1702fe921cf9?w=1800&h=700&fit=crop&auto=format"
          alt="Автомобиль в мастерской"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/80 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 py-20">
          <div className="mb-3 font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-[0.3em] text-primary">Проверенные мастерские</div>
          <div className="max-w-3xl font-['Barlow_Condensed'] text-6xl font-black uppercase leading-none tracking-wide text-white md:text-8xl">Автосервисы 4×4</div>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/60">Найдите специалистов по установке оборудования, ремонту и подготовке внедорожника к следующему маршруту.</p>
          <div className="mt-8 flex gap-8">
            <div><span className="font-['Barlow_Condensed'] text-3xl font-black text-primary">{AUTO_SERVICES.length}</span><span className="ml-2 font-['Barlow_Condensed'] text-xs uppercase tracking-widest text-white/50">сервиса</span></div>
            <div><span className="font-['Barlow_Condensed'] text-3xl font-black text-primary">4.8</span><span className="ml-2 font-['Barlow_Condensed'] text-xs uppercase tracking-widest text-white/50">средний рейтинг</span></div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-7">
          <div className="mb-4 font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-widest text-muted-foreground">Что нужно сделать</div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {SERVICE_FILTERS.map((item) => {
              const active = filter === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setFilter(item.name)}
                  className={`group flex min-h-16 items-center gap-3 border p-3 text-left transition ${active ? "border-primary bg-primary text-white" : "border-border bg-background text-foreground hover:border-primary"}`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-primary text-white">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      {item.icon}
                    </svg>
                  </span>
                  <span className="font-['Barlow_Condensed'] text-xs font-bold uppercase leading-tight tracking-widest">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-7 flex items-end justify-between border-b border-border pb-7">
          <div>
            <div className="mb-1 font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-[0.25em] text-primary">Рядом с вами</div>
            <div className="font-['Barlow_Condensed'] text-4xl font-black uppercase tracking-wide">Выберите мастерскую</div>
          </div>
          <div className="hidden font-['Barlow_Condensed'] text-xs uppercase tracking-widest text-muted-foreground sm:block">{visible.length} варианта</div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((service) => (
            <article key={service.slug} className="group cursor-pointer overflow-hidden border border-border bg-card transition hover:border-primary" onClick={() => navigate(`/services/${service.slug}`)}>
              <div className="relative h-56 overflow-hidden bg-muted">
                <img src={service.image} alt={service.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                  <div className="font-['Barlow_Condensed'] text-3xl font-black uppercase tracking-wide text-white">{service.name}</div>
                  <div className="bg-white px-2 py-1 font-['Barlow_Condensed'] text-sm font-black text-primary">★ {service.rating}</div>
                </div>
              </div>
              <div className="p-5">
                <div className="mb-4 flex items-start gap-2 text-sm text-secondary-foreground">
                  <span className="mt-1 block h-2 w-2 shrink-0 bg-primary" />
                  <span>{service.city}, {service.address}</span>
                </div>
                <div className="mb-5 flex flex-wrap gap-2">
                  {service.specialties.slice(0, 3).map((item) => <span key={item} className="border border-border bg-background px-2 py-1 font-['Barlow_Condensed'] text-[10px] font-bold uppercase tracking-widest text-secondary-foreground">{item}</span>)}
                </div>
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <span className="font-['Barlow_Condensed'] text-xs uppercase tracking-widest text-muted-foreground">{service.reviews} отзывов</span>
                  <span className="font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-widest text-primary">Подробнее →</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
