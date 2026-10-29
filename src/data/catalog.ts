export type Product = {
  id: number;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  img: string;
  imgs: string[];
  badge?: string;
  badgeColor?: string;
  inStock: boolean;
  description: string;
  specs: { label: string; value: string }[];
  variants?: string[];
};

export type Category = {
  slug: string;
  name: string;
  icon: string;
  description: string;
  img: string;
  accent: string;
  count: number;
  products: Product[];
};

export const CATEGORIES: Category[] = [
  {
    slug: "winches",
    name: "Лебёдки",
    icon: "⚙️",
    description: "Электрические и гидравлические лебёдки для самовытаскивания и помощи другим",
    img: "https://images.unsplash.com/photo-1622300868582-544a4dde5395?w=600&h=380&fit=crop&auto=format",
    accent: "#e84e00",
    count: 24,
    products: [
      { id: 101, name: "Warn VR EVO 10", brand: "Warn", price: 64900, rating: 4.9, reviews: 312, img: "https://images.unsplash.com/photo-1620029188962-be2c6486593d?w=600&h=500&fit=crop&auto=format", imgs: ["https://images.unsplash.com/photo-1620029188962-be2c6486593d?w=800&h=600&fit=crop&auto=format","https://images.unsplash.com/photo-1640636430737-de4ae2656d43?w=800&h=600&fit=crop&auto=format"], badge: "Хит", badgeColor: "#e84e00", inStock: true, description: "Надёжная электрическая лебёдка с тяговым усилием 10 000 фунтов. Серия VR EVO оснащена бесщёточным мотором и контроллером Warn с защитой от перегрева. Идеальна для ежедневного использования на бездорожье.", specs: [{ label: "Тяговое усилие", value: "10 000 lbs / 4 536 кг" }, { label: "Тип мотора", value: "Бесщёточный 12В" }, { label: "Длина троса", value: "28 м (9,5 мм)" }, { label: "Вес", value: "17,7 кг" }, { label: "IP-защита", value: "IP68" }] },
      { id: 102, name: "Warn ZEON 12-S", brand: "Warn", price: 98500, oldPrice: 112000, rating: 4.8, reviews: 187, img: "https://images.unsplash.com/photo-1596507931135-75f699668356?w=600&h=500&fit=crop&auto=format", imgs: ["https://images.unsplash.com/photo-1596507931135-75f699668356?w=800&h=600&fit=crop&auto=format"], badge: "Скидка", badgeColor: "#3a9e5f", inStock: true, description: "Профессиональная лебёдка серии ZEON с нагрузочной способностью 12 000 lbs. Синтетический трос в комплекте, полная водонепроницаемость.", specs: [{ label: "Тяговое усилие", value: "12 000 lbs / 5 443 кг" }, { label: "Тип троса", value: "Синтетический, 9,5 мм" }, { label: "Длина троса", value: "30 м" }, { label: "Вес", value: "22,5 кг" }] },
      { id: 103, name: "Smittybilt X2O 10K", brand: "Smittybilt", price: 38900, rating: 4.6, reviews: 234, img: "https://images.unsplash.com/photo-1654162456768-ebf2c2c81bb4?w=600&h=500&fit=crop&auto=format", imgs: ["https://images.unsplash.com/photo-1654162456768-ebf2c2c81bb4?w=800&h=600&fit=crop&auto=format"], inStock: true, description: "Доступная, но мощная лебёдка с синтетическим тросом и пультом ДУ. Отличный выбор для начинающих.", specs: [{ label: "Тяговое усилие", value: "10 000 lbs" }, { label: "Мотор", value: "5,5 л.с." }, { label: "IP-защита", value: "IP67" }] },
      { id: 104, name: "Mile Marker HI-9500", brand: "Mile Marker", price: 52400, rating: 4.7, reviews: 98, img: "https://images.unsplash.com/photo-1640636430737-de4ae2656d43?w=600&h=500&fit=crop&auto=format", imgs: ["https://images.unsplash.com/photo-1640636430737-de4ae2656d43?w=800&h=600&fit=crop&auto=format"], badge: "Новинка", badgeColor: "#9b59b6", inStock: false, description: "Гидравлическая лебёдка — работает от ГУРа, не разряжает аккумулятор. Для тяжёлого класса.", specs: [{ label: "Тяговое усилие", value: "9 500 lbs" }, { label: "Тип", value: "Гидравлическая" }, { label: "Длина троса", value: "25 м" }] },
    ],
  },
  {
    slug: "lift-kits",
    name: "Лифт-киты",
    icon: "🔧",
    description: "Комплекты подвески для увеличения дорожного просвета и установки больших колёс",
    img: "https://images.unsplash.com/photo-1579271723430-d600366f032f?w=600&h=380&fit=crop&auto=format",
    accent: "#2d5a3d",
    count: 18,
    products: [
      { id: 201, name: "Lift Kit 50mm Ranger", brand: "Old Man Emu", price: 42500, rating: 4.8, reviews: 156, img: "https://images.unsplash.com/photo-1640636430727-649f73271766?w=600&h=500&fit=crop&auto=format", imgs: ["https://images.unsplash.com/photo-1640636430727-649f73271766?w=800&h=600&fit=crop&auto=format"], badge: "Хит", badgeColor: "#e84e00", inStock: true, description: "Полный комплект лифта 50 мм с амортизаторами Old Man Emu. Значительно улучшает внедорожные характеристики без ущерба для управляемости.", specs: [{ label: "Высота лифта", value: "50 мм" }, { label: "Комплектация", value: "Пружины + амортизаторы" }, { label: "Совместимость", value: "Toyota LC 80/100/200" }], variants: ["Без блоков", "+20мм блоки", "+40мм блоки"] },
      { id: 202, name: "Pro Lift 75mm Stage 2", brand: "Ironman 4x4", price: 68900, oldPrice: 79000, rating: 4.9, reviews: 89, img: "https://images.unsplash.com/photo-1684929954083-f10c179ed96d?w=600&h=500&fit=crop&auto=format", imgs: ["https://images.unsplash.com/photo-1684929954083-f10c179ed96d?w=800&h=600&fit=crop&auto=format"], badge: "Скидка", badgeColor: "#3a9e5f", inStock: true, description: "Профессиональный кит лифта Stage 2 с нитрогазовыми амортизаторами Foam Cell. Для серьёзного офф-роуда.", specs: [{ label: "Высота лифта", value: "75 мм" }, { label: "Тип аморт.", value: "Foam Cell Pro" }, { label: "Рычаги", value: "Усиленные, в комплекте" }], variants: ["Jeep Wrangler JL", "Jeep Wrangler JK", "Ford Bronco"] },
      { id: 203, name: "Budget Boost 30mm", brand: "Rough Country", price: 14900, rating: 4.4, reviews: 421, img: "https://images.unsplash.com/photo-1500921726673-e4bdc09efa55?w=600&h=500&fit=crop&auto=format", imgs: ["https://images.unsplash.com/photo-1500921726673-e4bdc09efa55?w=800&h=600&fit=crop&auto=format"], inStock: true, description: "Бюджетный лифт-кит 30 мм для установки колёс до 33 дюймов без доработок кузова.", specs: [{ label: "Высота лифта", value: "30 мм" }, { label: "Тип", value: "Проставки + пружины" }] },
    ],
  },
  {
    slug: "armor",
    name: "Защита кузова",
    icon: "🛡️",
    description: "Силовые бамперы, пороги, защита картера и рам для экстремального бездорожья",
    img: "https://images.unsplash.com/photo-1579097648137-4b19188fdb4e?w=600&h=380&fit=crop&auto=format",
    accent: "#1a2a3a",
    count: 31,
    products: [
      { id: 301, name: "Силовой бампер Алигатор", brand: "РИФ", price: 38900, rating: 4.7, reviews: 203, img: "https://images.unsplash.com/photo-1596507931135-75f699668356?w=600&h=500&fit=crop&auto=format", imgs: ["https://images.unsplash.com/photo-1596507931135-75f699668356?w=800&h=600&fit=crop&auto=format"], badge: "РФ", badgeColor: "#2d5a3d", inStock: true, description: "Силовой передний бампер из стали 4 мм. Интегрированная люлька для лебёдки, крепления для хайджека и дополнительного освещения.", specs: [{ label: "Материал", value: "Сталь 4 мм" }, { label: "Люлька", value: "Встроенная, до 12 000 lbs" }, { label: "Покрытие", value: "Порошковая краска" }, { label: "Совместимость", value: "Toyota Land Cruiser 200" }] },
      { id: 302, name: "Пороги с подножками Rock Rails", brand: "ARB", price: 24500, rating: 4.6, reviews: 134, img: "https://images.unsplash.com/photo-1654162456768-ebf2c2c81bb4?w=600&h=500&fit=crop&auto=format", imgs: ["https://images.unsplash.com/photo-1654162456768-ebf2c2c81bb4?w=800&h=600&fit=crop&auto=format"], inStock: true, description: "Стальные пороги с интегрированными подножками. Защищают пороги кузова на скальниках.", specs: [{ label: "Труба", value: "76 мм" }, { label: "Покрытие", value: "Чёрный матовый" }], variants: ["Короткая база", "Длинная база"] },
      { id: 303, name: "Защита картера ТСС", brand: "ТСС", price: 8900, rating: 4.8, reviews: 567, img: "https://images.unsplash.com/photo-1640636430737-de4ae2656d43?w=600&h=500&fit=crop&auto=format", imgs: ["https://images.unsplash.com/photo-1640636430737-de4ae2656d43?w=800&h=600&fit=crop&auto=format"], badge: "Хит", badgeColor: "#e84e00", inStock: true, description: "Алюминиевая защита картера двигателя толщиной 6 мм. Лёгкая и прочная.", specs: [{ label: "Материал", value: "Алюминий 6063 Т6" }, { label: "Толщина", value: "6 мм" }, { label: "Вес", value: "4,2 кг" }] },
    ],
  },
  {
    slug: "tires",
    name: "Шины",
    icon: "🔵",
    description: "Грязевые, все-сезонные и скальные шины от ведущих мировых брендов",
    img: "https://images.unsplash.com/photo-1622300868582-544a4dde5395?w=600&h=380&fit=crop&auto=format",
    accent: "#8b3a1a",
    count: 47,
    products: [
      { id: 401, name: "BFGoodrich MT/A KM3 35\"", brand: "BFGoodrich", price: 18900, rating: 4.9, reviews: 891, img: "https://images.unsplash.com/photo-1605661480059-884578ac8ec8?w=600&h=500&fit=crop&auto=format", imgs: ["https://images.unsplash.com/photo-1605661480059-884578ac8ec8?w=800&h=600&fit=crop&auto=format"], badge: "Лучший выбор", badgeColor: "#e84e00", inStock: true, description: "Культовые грязевые шины с непревзойдённой тягой на грязи и камнях. Бескамерные, усиленный корд.", specs: [{ label: "Размер", value: "35x12.50 R17" }, { label: "Нагрузочный индекс", value: "121Q" }, { label: "Тип", value: "Mud Terrain" }, { label: "Сезонность", value: "Всесезонная" }], variants: ["33x12.50 R15", "33x12.50 R17", "35x12.50 R17", "37x12.50 R17"] },
      { id: 402, name: "Toyo Open Country MT 37\"", brand: "Toyo", price: 22400, rating: 4.8, reviews: 432, img: "https://images.unsplash.com/photo-1596507931135-75f699668356?w=600&h=500&fit=crop&auto=format", imgs: ["https://images.unsplash.com/photo-1596507931135-75f699668356?w=800&h=600&fit=crop&auto=format"], inStock: true, description: "Агрессивная грязевая резина с улучшенным самоочищением протектора. Для экстремального офф-роуда.", specs: [{ label: "Размер", value: "37x13.50 R18" }, { label: "Тип", value: "Mud Terrain" }], variants: ["35x12.50 R17", "37x12.50 R17", "37x13.50 R18"] },
      { id: 403, name: "Cooper Discoverer AT3 XLT", brand: "Cooper", price: 11200, oldPrice: 13500, rating: 4.7, reviews: 623, img: "https://images.unsplash.com/photo-1684929954083-f10c179ed96d?w=600&h=500&fit=crop&auto=format", imgs: ["https://images.unsplash.com/photo-1684929954083-f10c179ed96d?w=800&h=600&fit=crop&auto=format"], badge: "Скидка", badgeColor: "#3a9e5f", inStock: true, description: "Всесезонная резина для бездорожья и асфальта. Тихая на шоссе, уверенная в грязи.", specs: [{ label: "Размер", value: "265/70 R17" }, { label: "Тип", value: "All Terrain" }], variants: ["265/70 R16", "265/70 R17", "285/70 R17"] },
    ],
  },
  {
    slug: "lighting",
    name: "Освещение",
    icon: "💡",
    description: "LED-балки, фары и вспомогательный свет для ночных выездов",
    img: "https://images.unsplash.com/photo-1500921726673-e4bdc09efa55?w=600&h=380&fit=crop&auto=format",
    accent: "#d4820a",
    count: 22,
    products: [
      { id: 501, name: "LED Балка Rigid Industries 40\"", brand: "Rigid Industries", price: 34900, rating: 4.9, reviews: 278, img: "https://images.unsplash.com/photo-1640636430727-649f73271766?w=600&h=500&fit=crop&auto=format", imgs: ["https://images.unsplash.com/photo-1640636430727-649f73271766?w=800&h=600&fit=crop&auto=format"], badge: "Хит", badgeColor: "#e84e00", inStock: true, description: "40-дюймовая LED-балка E-Series с комбинированным опиком. 240 Вт, 20 160 люмен. Алюминиевый корпус IP68.", specs: [{ label: "Длина", value: "40\" / 101 см" }, { label: "Мощность", value: "240 Вт" }, { label: "Световой поток", value: "20 160 лм" }, { label: "IP-защита", value: "IP68" }] },
      { id: 502, name: "Фара доп. света Baja Designs S8", brand: "Baja Designs", price: 16800, rating: 4.8, reviews: 156, img: "https://images.unsplash.com/photo-1654162456768-ebf2c2c81bb4?w=600&h=500&fit=crop&auto=format", imgs: ["https://images.unsplash.com/photo-1654162456768-ebf2c2c81bb4?w=800&h=600&fit=crop&auto=format"], inStock: true, description: "Круглая LED-фара дальнего света 3,9 дюйма. Применяется в ралли-рейдах и трофи.", specs: [{ label: "Диаметр", value: "3,9\"" }, { label: "Мощность", value: "80 Вт" }, { label: "Дальность", value: "до 800 м" }] },
    ],
  },
  {
    slug: "roof-racks",
    name: "Экспедиционные багажники",
    icon: "📦",
    description: "Крышные багажники, корзины и системы крепления для экспедиций",
    img: "https://images.unsplash.com/photo-1684929954083-f10c179ed96d?w=600&h=380&fit=crop&auto=format",
    accent: "#9b59b6",
    count: 15,
    products: [
      { id: 601, name: "Экспедиционный багажник ARB BASE Rack", brand: "ARB", price: 58900, rating: 4.8, reviews: 134, img: "https://images.unsplash.com/photo-1640636430737-de4ae2656d43?w=600&h=500&fit=crop&auto=format", imgs: ["https://images.unsplash.com/photo-1640636430737-de4ae2656d43?w=800&h=600&fit=crop&auto=format"], badge: "Хит", badgeColor: "#e84e00", inStock: true, description: "Модульный крышной багажник с системой крепления MOUNT. Совместим с большинством экспедиционного снаряжения ARB.", specs: [{ label: "Размер", value: "1850 × 1285 мм" }, { label: "Нагрузка", value: "до 100 кг" }, { label: "Материал", value: "Алюминий" }], variants: ["1.2m × 1.3m", "1.5m × 1.3m", "1.8m × 1.3m"] },
    ],
  },
  {
    slug: "apparel",
    name: "Одежда и снаряжение",
    icon: "🧥",
    description: "Технические куртки, перчатки, шлемы и одежда для офф-роуда",
    img: "https://images.unsplash.com/photo-1605661480059-884578ac8ec8?w=600&h=380&fit=crop&auto=format",
    accent: "#3a9e5f",
    count: 38,
    products: [
      { id: 701, name: "Куртка Expedition Hard Shell", brand: "Outdoor Research", price: 24900, oldPrice: 29900, rating: 4.7, reviews: 89, img: "https://images.unsplash.com/photo-1622300868582-544a4dde5395?w=600&h=500&fit=crop&auto=format", imgs: ["https://images.unsplash.com/photo-1622300868582-544a4dde5395?w=800&h=600&fit=crop&auto=format"], badge: "Скидка", badgeColor: "#3a9e5f", inStock: true, description: "Мембранная куртка для экспедиций и активного отдыха. Gore-Tex Pro, вентиляция, многочисленные карманы.", specs: [{ label: "Материал", value: "Gore-Tex Pro 3L" }, { label: "Водостойкость", value: "28 000 мм" }], variants: ["S", "M", "L", "XL", "XXL"] },
      { id: 702, name: "Перчатки механика Mechanix M-PACT", brand: "Mechanix", price: 3490, rating: 4.9, reviews: 1204, img: "https://images.unsplash.com/photo-1596507931135-75f699668356?w=600&h=500&fit=crop&auto=format", imgs: ["https://images.unsplash.com/photo-1596507931135-75f699668356?w=800&h=600&fit=crop&auto=format"], badge: "Хит", badgeColor: "#e84e00", inStock: true, description: "Культовые рабочие перчатки с усиленной ладонью. Незаменимы при ремонте и самовытаскивании.", specs: [{ label: "Защита суставов", value: "TPR" }, { label: "Ладонь", value: "Armortex" }], variants: ["S", "M", "L", "XL"] },
    ],
  },
  {
    slug: "communication",
    name: "Связь и навигация",
    icon: "📡",
    description: "Рации, GPS-навигаторы и спутниковые коммуникаторы для экспедиций",
    img: "https://images.unsplash.com/photo-1500921726673-e4bdc09efa55?w=600&h=380&fit=crop&auto=format",
    accent: "#4c75a3",
    count: 12,
    products: [
      { id: 801, name: "Icom IC-F5122D UHF Автомобильная", brand: "Icom", price: 28900, rating: 4.8, reviews: 67, img: "https://images.unsplash.com/photo-1640636430727-649f73271766?w=600&h=500&fit=crop&auto=format", imgs: ["https://images.unsplash.com/photo-1640636430727-649f73271766?w=800&h=600&fit=crop&auto=format"], badge: "Проф.", badgeColor: "#4c75a3", inStock: true, description: "Профессиональная автомобильная рация UHF для групповых выездов. 25 Вт, дальность до 40 км.", specs: [{ label: "Мощность", value: "25 Вт" }, { label: "Диапазон", value: "UHF 400–470 МГц" }, { label: "Дальность", value: "до 40 км" }] },
      { id: 802, name: "Garmin GPSMAP 66i", brand: "Garmin", price: 42900, oldPrice: 48000, rating: 4.9, reviews: 312, img: "https://images.unsplash.com/photo-1684929954083-f10c179ed96d?w=600&h=500&fit=crop&auto=format", imgs: ["https://images.unsplash.com/photo-1684929954083-f10c179ed96d?w=800&h=600&fit=crop&auto=format"], badge: "Скидка", badgeColor: "#3a9e5f", inStock: true, description: "GPS-навигатор со спутниковым коммуникатором inReach. Двусторонняя спутниковая связь, SOS, треки, погода.", specs: [{ label: "Связь", value: "Спутниковая inReach" }, { label: "Аккумулятор", value: "35 ч GPS / 200 ч отслеж." }, { label: "Защита", value: "IP67, MIL-STD-810" }] },
    ],
  },
];

export function getCategoryBySlug(slug: string) {
  return CATEGORIES.find(c => c.slug === slug);
}

export function getProductById(categorySlug: string, id: number) {
  const cat = getCategoryBySlug(categorySlug);
  return cat?.products.find(p => p.id === id);
}
