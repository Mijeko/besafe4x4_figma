export type Tour = {
  id: string;
  title: string;
  subtitle: string;
  type: "Автотур" | "Пеший тур";
  region: string;
  startCity: string;
  image: string;
  gallery: string[];
  nextDate: string;
  dates: string[];
  duration: number;
  distance: string;
  difficulty: "Лёгкий" | "Средний" | "Сложный";
  price: number;
  rating: number;
  reviews: number;
  seats: number;
  groupSize: number;
  organizer: string;
  organizerSince: string;
  description: string;
  itinerary: { day: string; title: string; description: string }[];
  included: string[];
  equipment: string[];
};

export const TOURS: Tour[] = [
  {
    id: "altai-chuysky",
    title: "Чуйский тракт и Марсианские долины",
    subtitle: "Большой Алтай на своём внедорожнике",
    type: "Автотур",
    region: "Алтай",
    startCity: "Горно-Алтайск",
    image: "https://images.unsplash.com/photo-1698790723006-b19a91e35702?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200",
    gallery: [
      "https://images.unsplash.com/photo-1635437425166-992606a21e9a?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200",
      "https://images.unsplash.com/photo-1721933004371-9484b6fa8175?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200",
    ],
    nextDate: "12–19 сентября",
    dates: ["12–19 сентября", "26 сентября – 3 октября"],
    duration: 8,
    distance: "1 240 км",
    difficulty: "Средний",
    price: 78000,
    rating: 4.9,
    reviews: 47,
    seats: 4,
    groupSize: 8,
    organizer: "Алтай 4×4 Экспедиции",
    organizerSince: "Организует туры с 2018 года",
    description: "Восемь дней по одному из красивейших автомобильных маршрутов России. Перевалы, высокогорные озёра, долина Чулышмана и ночёвки там, где не бывает туристических автобусов.",
    itinerary: [
      { day: "День 1", title: "Знакомство и проверка машин", description: "Встреча в Горно-Алтайске, технический осмотр, брифинг и общий ужин." },
      { day: "Дни 2–3", title: "Чуйский тракт", description: "Семинский перевал, Чике-Таман, слияние Чуи и Катуни. Ночёвка у реки." },
      { day: "Дни 4–5", title: "Марс и Курайская степь", description: "Грунтовые маршруты к цветным горам и ледникам Северо-Чуйского хребта." },
      { day: "Дни 6–8", title: "Улаган и долина Чулышмана", description: "Перевал Кату-Ярык, водопады и возвращение через Телецкое озеро." },
    ],
    included: ["Работа ведущего экипажа", "Все кемпинги и гостевые дома", "Завтраки и ужины", "Спутниковая связь", "Групповая аптечка"],
    equipment: ["Исправный полноприводный автомобиль", "Запас хода не менее 500 км", "Полноразмерная запаска", "Рация диапазона CB или LPD"],
  },
  {
    id: "karelia-lakes",
    title: "Ладожские шхеры налегке",
    subtitle: "Тропы, скалы и острова Северной Ладоги",
    type: "Пеший тур",
    region: "Карелия",
    startCity: "Сортавала",
    image: "https://images.unsplash.com/photo-1790343009500-37503dd910de?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200",
    gallery: [
      "https://images.unsplash.com/photo-1771838026237-e6d3838e75ca?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200",
      "https://images.unsplash.com/photo-1740549160204-9a6a2024af52?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200",
    ],
    nextDate: "5–8 сентября",
    dates: ["5–8 сентября", "19–22 сентября"],
    duration: 4,
    distance: "46 км",
    difficulty: "Лёгкий",
    price: 32900,
    rating: 4.8,
    reviews: 63,
    seats: 7,
    groupSize: 14,
    organizer: "Северная тропа",
    organizerSince: "Организует походы с 2016 года",
    description: "Комфортный поход без тяжёлых рюкзаков по гранитным берегам Ладоги. Днём идём по лесным тропам, вечером возвращаемся в уютный гостевой дом.",
    itinerary: [
      { day: "День 1", title: "Сортавала и гора Паасо", description: "Знакомство с группой, короткий маршрут к древнему городищу и ужин." },
      { day: "День 2", title: "Тропа вдоль шхер", description: "Переход по скальным берегам, пикник с видом на острова." },
      { day: "День 3", title: "Остров Хонкасало", description: "Лодочная заброска и кольцевой маршрут по острову." },
      { day: "День 4", title: "Водопады и возвращение", description: "Лёгкая прогулка к водопадам и трансфер в Сортавалу." },
    ],
    included: ["Проживание в гостевом доме", "Трёхразовое питание", "Лодочные трансферы", "Работа инструктора", "Групповое снаряжение"],
    equipment: ["Треккинговые ботинки", "Рюкзак 20–30 литров", "Мембранная куртка", "Личная аптечка"],
  },
  {
    id: "caucasus-pass",
    title: "Перевалы Северного Кавказа",
    subtitle: "Карачаево-Черкесия вне асфальта",
    type: "Автотур",
    region: "Кавказ",
    startCity: "Минеральные Воды",
    image: "https://images.unsplash.com/photo-1654756451073-ed10fa74e326?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200",
    gallery: [
      "https://images.unsplash.com/photo-1532483692704-cfa7b41edf9b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200",
      "https://images.unsplash.com/photo-1661155334389-722417c42e25?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200",
    ],
    nextDate: "20–25 сентября",
    dates: ["20–25 сентября", "4–9 октября"],
    duration: 6,
    distance: "680 км",
    difficulty: "Сложный",
    price: 64500,
    rating: 5,
    reviews: 28,
    seats: 3,
    groupSize: 6,
    organizer: "Высота Off-road",
    organizerSince: "Организует экспедиции с 2014 года",
    description: "Технический маршрут для подготовленных машин через горные перевалы, пастушьи дороги и альпийские долины. Маленькая группа и максимум настоящего бездорожья.",
    itinerary: [
      { day: "День 1", title: "Сбор в Минеральных Водах", description: "Техкомиссия, знакомство и переезд к старту маршрута." },
      { day: "Дни 2–3", title: "Долина Большого Зеленчука", description: "Горные грунтовки, броды и лагерь у границы леса." },
      { day: "Дни 4–5", title: "Перевальные дороги", description: "Основная внедорожная часть с высотами до 2800 метров." },
      { day: "День 6", title: "Домбай", description: "Финальный маршрут, обед и возвращение в Минеральные Воды." },
    ],
    included: ["Сопровождение двух инструкторов", "Разрешения на маршрут", "Кемпинги", "Общие ужины", "Эвакуационное оборудование"],
    equipment: ["Понижающая передача", "Колёса от 31 дюйма", "Лебёдка", "Шноркель", "Запас топлива 40 литров"],
  },
  {
    id: "kola-winter",
    title: "Северное сияние на Кольском",
    subtitle: "Зимняя экспедиция к берегу Баренцева моря",
    type: "Автотур",
    region: "Кольский",
    startCity: "Мурманск",
    image: "https://images.unsplash.com/photo-1702487508562-7695f7f424d9?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200",
    gallery: [
      "https://images.unsplash.com/photo-1768347441482-5ffbd9eacbee?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200",
      "https://images.unsplash.com/photo-1777768785659-2c0c72bde17c?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200",
    ],
    nextDate: "10–14 ноября",
    dates: ["10–14 ноября", "24–28 ноября"],
    duration: 5,
    distance: "520 км",
    difficulty: "Средний",
    price: 89000,
    rating: 4.9,
    reviews: 34,
    seats: 5,
    groupSize: 8,
    organizer: "Полярный круг",
    organizerSince: "Организует северные туры с 2017 года",
    description: "Зимние дороги тундры, океан, Териберка и охота за северным сиянием. Можно участвовать на своём автомобиле или занять место в машине организатора.",
    itinerary: [
      { day: "День 1", title: "Мурманск", description: "Встреча, выдача зимнего снаряжения и вводный брифинг." },
      { day: "День 2", title: "Тундра", description: "Первый внедорожный маршрут и вечерняя охота за сиянием." },
      { day: "Дни 3–4", title: "Берег океана", description: "Териберка, старые дороги и ночёвка у Баренцева моря." },
      { day: "День 5", title: "Возвращение", description: "Запасной маршрут по погоде и завершение в Мурманске." },
    ],
    included: ["Место в подготовленном внедорожнике", "Гостевые дома", "Питание", "Тёплая экипировка", "Фотограф в группе"],
    equipment: ["Зимняя обувь", "Термобельё", "Личная аптечка", "Термос"],
  },
  {
    id: "dagestan-trails",
    title: "Тропы горного Дагестана",
    subtitle: "Аулы, каньоны и древние башни",
    type: "Пеший тур",
    region: "Дагестан",
    startCity: "Махачкала",
    image: "https://images.unsplash.com/photo-1773959997847-a783bd70df37?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200",
    gallery: [
      "https://images.unsplash.com/photo-1762375212850-3a0b41bf4ab6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200",
      "https://images.unsplash.com/photo-1761626717589-915e3f6f3b33?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200",
    ],
    nextDate: "3–9 октября",
    dates: ["3–9 октября", "17–23 октября"],
    duration: 7,
    distance: "72 км",
    difficulty: "Средний",
    price: 54900,
    rating: 4.9,
    reviews: 51,
    seats: 6,
    groupSize: 12,
    organizer: "Горизонт",
    organizerSince: "Организует походы с 2015 года",
    description: "Пешее путешествие между горными аулами с ночёвками в домах местных жителей. Несложные переходы, домашняя кухня и история региона без спешки.",
    itinerary: [
      { day: "День 1", title: "Сулакский каньон", description: "Встреча и первый видовой маршрут." },
      { day: "Дни 2–3", title: "Гуниб", description: "Переходы по плато, старые крепости и знакомство с местными жителями." },
      { day: "Дни 4–5", title: "Гоор и Кахиб", description: "Башенные комплексы и тропы над долиной." },
      { day: "Дни 6–7", title: "Гамсутль", description: "Маршрут к заброшенному аулу и возвращение в Махачкалу." },
    ],
    included: ["Все трансферы", "Проживание", "Питание", "Услуги гида", "Входные билеты"],
    equipment: ["Разношенные ботинки", "Треккинговые палки", "Рюкзак 25 литров", "Защита от солнца"],
  },
  {
    id: "forest-weekend",
    title: "Лесной внедорожный уикенд",
    subtitle: "Первый автотур для стандартных машин",
    type: "Автотур",
    region: "Подмосковье",
    startCity: "Москва",
    image: "https://images.unsplash.com/photo-1681399728145-0d9ead7faa31?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200",
    gallery: [
      "https://images.unsplash.com/photo-1726094232512-0fa973e153a0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200",
      "https://images.unsplash.com/photo-1635437425166-992606a21e9a?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200",
    ],
    nextDate: "14–15 сентября",
    dates: ["14–15 сентября", "28–29 сентября"],
    duration: 2,
    distance: "190 км",
    difficulty: "Лёгкий",
    price: 14900,
    rating: 4.7,
    reviews: 86,
    seats: 8,
    groupSize: 12,
    organizer: "Выходные 4×4",
    organizerSince: "Организует выезды с 2020 года",
    description: "Два дня для тех, кто хочет впервые попробовать путешествие вне асфальта. Маршрут подходит стандартным кроссоверам с полным приводом, всё необходимое покажут инструкторы.",
    itinerary: [
      { day: "День 1", title: "Основы бездорожья", description: "Сбор за МКАД, инструктаж, лесные дороги и практика работы в команде." },
      { day: "День 2", title: "Большой маршрут", description: "Броды, песчаные участки, полевой обед и возвращение к асфальту." },
    ],
    included: ["Работа инструкторов", "Полевое питание", "Кемпинг", "Рация на экипаж", "Помощь на маршруте"],
    equipment: ["Полноприводный автомобиль", "Буксировочная проушина", "Запасное колесо", "Одежда по погоде"],
  },
];

export function getTourById(id: string) {
  return TOURS.find((tour) => tour.id === id);
}
