export type AutoService = {
  slug: string;
  name: string;
  city: string;
  address: string;
  rating: number;
  reviews: number;
  experience: string;
  phone: string;
  schedule: string;
  image: string;
  gallery: string[];
  description: string;
  specialties: string[];
  services: {
    name: string;
    description: string;
    price: string;
    duration: string;
  }[];
};

export const AUTO_SERVICES: AutoService[] = [
  {
    slug: "trail-garage",
    name: "Trail Garage",
    city: "Москва",
    address: "2-й Лихачёвский переулок, 7",
    rating: 4.9,
    reviews: 186,
    experience: "12 лет",
    phone: "+7 (495) 120-45-90",
    schedule: "Ежедневно, 09:00–21:00",
    image: "https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=1200&h=800&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1727893119356-1702fe921cf9?w=1200&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1676018366904-c083ed678e60?w=1200&h=800&fit=crop&auto=format",
    ],
    description: "Специализированный центр подготовки внедорожников для экспедиций и тяжёлого бездорожья. Устанавливаем и настраиваем оборудование с гарантией на работы.",
    specialties: ["Подвеска", "Лебёдки", "Защита", "Экспедиционная подготовка"],
    services: [
      { name: "Установка лебёдки", description: "Монтаж, подключение силовой проводки и проверка под нагрузкой.", price: "от 12 000 ₽", duration: "4–6 часов" },
      { name: "Лифт подвески", description: "Установка лифт-комплекта, регулировка и контроль геометрии.", price: "от 28 000 ₽", duration: "1–2 дня" },
      { name: "Монтаж силовой защиты", description: "Установка защиты днища, порогов и силовых бамперов.", price: "от 8 500 ₽", duration: "3–8 часов" },
      { name: "Подготовка к экспедиции", description: "Полная диагностика и комплексная подготовка автомобиля к маршруту.", price: "от 45 000 ₽", duration: "от 3 дней" },
    ],
  },
  {
    slug: "4x4-lab",
    name: "4x4 Lab",
    city: "Москва",
    address: "ул. Подольских Курсантов, 24",
    rating: 4.8,
    reviews: 142,
    experience: "9 лет",
    phone: "+7 (495) 228-14-44",
    schedule: "Пн–Сб, 10:00–20:00",
    image: "https://images.unsplash.com/photo-1632405862117-236585cfb757?w=1200&h=800&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1727893141025-35d62b3f4a03?w=1200&h=800&fit=crop&auto=format"],
    description: "Инженерная мастерская для точной настройки внедорожников. Диагностика, подбор компонентов и аккуратная установка без компромиссов.",
    specialties: ["Диагностика", "Электрика", "Свет", "Шины"],
    services: [
      { name: "Диагностика 4×4", description: "Проверка трансмиссии, подвески и электрических систем.", price: "от 3 500 ₽", duration: "2 часа" },
      { name: "Установка дополнительного света", description: "Монтаж оптики, реле, предохранителей и органов управления.", price: "от 7 000 ₽", duration: "3–5 часов" },
      { name: "Шиномонтаж Off-road", description: "Монтаж и балансировка колёс увеличенного диаметра.", price: "от 6 400 ₽", duration: "1,5 часа" },
    ],
  },
  {
    slug: "wild-track-service",
    name: "Wild Track Service",
    city: "Химки",
    address: "Вашутинское шоссе, 18",
    rating: 4.7,
    reviews: 98,
    experience: "7 лет",
    phone: "+7 (495) 777-36-04",
    schedule: "Ежедневно, 10:00–20:00",
    image: "https://images.unsplash.com/photo-1625047509252-ab38fb5c7343?w=1200&h=800&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1676018366904-c083ed678e60?w=1200&h=800&fit=crop&auto=format"],
    description: "Сервис и клубная мастерская на севере Москвы. Обслуживаем внедорожники перед выездами и устраняем последствия самых сложных маршрутов.",
    specialties: ["ТО", "Ремонт", "Шноркели", "Тюнинг"],
    services: [
      { name: "Плановое ТО", description: "Масла, фильтры и проверка узлов после бездорожья.", price: "от 9 500 ₽", duration: "3 часа" },
      { name: "Установка шноркеля", description: "Герметичный монтаж и проверка впускного тракта.", price: "от 14 000 ₽", duration: "1 день" },
      { name: "Обслуживание лебёдки", description: "Разборка, очистка, смазка и проверка электрики.", price: "от 6 000 ₽", duration: "4 часа" },
    ],
  },
];

export function getAutoServiceBySlug(slug: string) {
  return AUTO_SERVICES.find((service) => service.slug === slug);
}
