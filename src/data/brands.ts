export type Brand = {
  slug: string;
  name: string;
  country: string;
  founded: string;
  tagline: string;
  description: string;
  categories: string[];
  productsCount: number;
  heroImg: string;
  logoColor: string;
  accentColor: string;
  website: string;
  story: string;
  advantages: { title: string; text: string }[];
  products: {
    id: number; name: string; price: number; img: string; category: string; badge?: string;
  }[];
};

export const BRANDS: Brand[] = [
  {
    slug: "warn",
    name: "Warn",
    country: "США",
    founded: "1948",
    tagline: "The World's Leading Winch",
    description: "Американский производитель лебёдок и внедорожного оборудования с 75-летней историей. Стандарт отрасли по надёжности и тяговому усилию.",
    categories: ["Лебёдки", "Аксессуары"],
    productsCount: 48,
    heroImg: "https://images.unsplash.com/photo-1620029188962-be2c6486593d?w=1600&h=700&fit=crop&auto=format",
    logoColor: "#cc0000",
    accentColor: "#cc0000",
    website: "warn.com",
    story: "Warn Industries основана в 1948 году Артуром Уорном в Калифорнии. Первым продуктом стала система отключения переднего привода для джипов Willys. В 1959 году компания выпустила первую электрическую лебёдку, которая произвела революцию в мире бездорожья. Сегодня продукция Warn используется военными, спасательными службами и любителями внедорожного вождения по всему миру.",
    advantages: [
      { title:"75 лет опыта", text:"Пионеры рынка лебёдок с 1948 года. Технологии, проверенные десятилетиями в экстремальных условиях." },
      { title:"Военные стандарты", text:"Продукция Warn поставляется армии США. Запас прочности значительно превышает заявленные характеристики." },
      { title:"Гарантия на весь срок", text:"Пожизненная ограниченная гарантия на механические компоненты — редчайшее предложение в отрасли." },
    ],
    products: [
      { id:101, name:"Warn VR EVO 10-S", price:64900, img:"https://images.unsplash.com/photo-1620029188962-be2c6486593d?w=400&h=300&fit=crop&auto=format", category:"Лебёдки", badge:"Бестселлер" },
      { id:102, name:"Warn ZEON 12", price:124900, img:"https://images.unsplash.com/photo-1570129476815-ba368ac77013?w=400&h=300&fit=crop&auto=format", category:"Лебёдки", badge:"Топ" },
      { id:103, name:"Warn VR EVO 8-S", price:52900, img:"https://images.unsplash.com/photo-1599256630445-67b5772b1204?w=400&h=300&fit=crop&auto=format", category:"Лебёдки" },
      { id:104, name:"Warn Epic Snatch Block", price:4900, img:"https://images.unsplash.com/photo-1549636367-13c144c47063?w=400&h=300&fit=crop&auto=format", category:"Аксессуары" },
    ],
  },
  {
    slug: "bfgoodrich",
    name: "BFGoodrich",
    country: "США",
    founded: "1870",
    tagline: "Tires For The Driving Enthusiast",
    description: "Легендарный производитель шин, многократный победитель ралли Дакар. BFGoodrich KM и KO — эталон внедорожной резины для серьёзных экспедиций.",
    categories: ["Шины"],
    productsCount: 36,
    heroImg: "https://images.unsplash.com/photo-1605661480059-884578ac8ec8?w=1600&h=700&fit=crop&auto=format",
    logoColor: "#1a1a7a",
    accentColor: "#1a1a7a",
    website: "bfgoodrichtires.com",
    story: "Benjamin Franklin Goodrich основал компанию в 1870 году в Акроне, штат Огайо. С 1976 года BFGoodrich спонсирует гонку Baja 1000, где их шины побеждают более 40 раз подряд. Mud Terrain T/A KM3 — результат многолетних испытаний в пустынях, горах и болотах.",
    advantages: [
      { title:"40+ побед на Дакаре", text:"BFGoodrich — самый титулованный шинный бренд в истории ралли-рейдов. Побеждают там, где другие сдаются." },
      { title:"CoreGard™ технология", text:"Усиленные боковины выдерживают удары о камни без порезов. Разработано для экстремального rock crawling." },
      { title:"Самоочищающийся протектор", text:"Агрессивный рисунок протектора эффективно выбрасывает грязь и сохраняет сцепление в самых жёстких условиях." },
    ],
    products: [
      { id:201, name:"MT/A KM3 35×12.50 R17", price:18900, img:"https://images.unsplash.com/photo-1605661480059-884578ac8ec8?w=400&h=300&fit=crop&auto=format", category:"Шины", badge:"Хит" },
      { id:202, name:"MT/A KM3 33×12.50 R15", price:15900, img:"https://images.unsplash.com/photo-1605661480059-884578ac8ec8?w=400&h=300&fit=crop&auto=format", category:"Шины" },
      { id:203, name:"KO2 All-Terrain 265/70 R17", price:12900, img:"https://images.unsplash.com/photo-1760413496821-db15e5d085be?w=400&h=300&fit=crop&auto=format", category:"Шины" },
      { id:204, name:"KO2 All-Terrain 285/75 R16", price:13900, img:"https://images.unsplash.com/photo-1760413496821-db15e5d085be?w=400&h=300&fit=crop&auto=format", category:"Шины", badge:"Новинка" },
    ],
  },
  {
    slug: "ome",
    name: "Old Man Emu",
    country: "Австралия",
    founded: "1977",
    tagline: "Born In The Outback",
    description: "Австралийский производитель подвески ARB Group. OME разрабатывает лифт-киты для реального бездорожья в аутбэке — суровые условия гарантируют честное качество.",
    categories: ["Лифт-киты", "Амортизаторы"],
    productsCount: 29,
    heroImg: "https://images.unsplash.com/photo-1640636430727-649f73271766?w=1600&h=700&fit=crop&auto=format",
    logoColor: "#e67e00",
    accentColor: "#e67e00",
    website: "arb.com.au/ome",
    story: "Old Man Emu — подразделение австралийской компании ARB Corporation, основанной в 1975 году. Все продукты разрабатываются и тестируются в условиях австралийского аутбэка — одной из самых жёстких внедорожных сред на планете. Клиенты — австралийская армия, полиция и профессиональные экспедиторы.",
    advantages: [
      { title:"Тестирование в аутбэке", text:"Каждый комплект проходит тысячи километров по корням, камням и твёрдой как камень грунтовке Австралии." },
      { title:"Nitrocharger Sport", text:"Запатентованная технология азотного заряда амортизаторов. Стабильная работа при перегреве, характерном для длинных маршрутов." },
      { title:"Полная совместимость", text:"OME производит комплекты для более 200 моделей автомобилей. Всё в одной коробке — никаких доработок." },
    ],
    products: [
      { id:301, name:"Lift Kit 50mm Land Cruiser 200", price:42500, img:"https://images.unsplash.com/photo-1640636430727-649f73271766?w=400&h=300&fit=crop&auto=format", category:"Лифт-киты", badge:"Топ" },
      { id:302, name:"Lift Kit 40mm Hilux Revo", price:38900, img:"https://images.unsplash.com/photo-1636138103626-8057cad9c335?w=400&h=300&fit=crop&auto=format", category:"Лифт-киты" },
      { id:303, name:"Nitrocharger Sport Rear Pair", price:18400, img:"https://images.unsplash.com/photo-1635108198854-26645ffe6714?w=400&h=300&fit=crop&auto=format", category:"Амортизаторы" },
      { id:304, name:"Nitrocharger Sport Front Pair", price:19200, img:"https://images.unsplash.com/photo-1635108198854-26645ffe6714?w=400&h=300&fit=crop&auto=format", category:"Амортизаторы", badge:"Новинка" },
    ],
  },
  {
    slug: "arb",
    name: "ARB",
    country: "Австралия",
    founded: "1975",
    tagline: "4×4 Accessories & Expedition Equipment",
    description: "ARB — один из крупнейших мировых производителей внедорожного оборудования. Силовые бамперы, пороги, полки, компрессоры — всё для серьёзной экспедиционной подготовки.",
    categories: ["Защита", "Аксессуары", "Компрессоры"],
    productsCount: 112,
    heroImg: "https://images.unsplash.com/photo-1759428975028-fb239f944d92?w=1600&h=700&fit=crop&auto=format",
    logoColor: "#e84e00",
    accentColor: "#e84e00",
    website: "arb.com.au",
    story: "ARB Corporation основана Тони Ронном в 1975 году в Мельбурне. Начав с производства силовых бамперов, компания выросла в глобального игрока с заводами в Австралии, Таиланде и США. Продукция ARB используется в 100+ странах, включая армии Австралии и Новой Зеландии.",
    advantages: [
      { title:"Полный цикл производства", text:"ARB проектирует, производит и испытывает все продукты самостоятельно. Никаких аутсорс-партнёров, никаких компромиссов." },
      { title:"AIRBUMPER™ шноркели", text:"Запатентованная конструкция шноркеля с предварительным циклоном. Снижает загрязнение воздушного фильтра на 90%." },
      { title:"Компрессоры CKMTA12", text:"Двойной компрессор 12V — стандарт для серьёзного overlanding. Накачивает 35\" шину за 2 минуты." },
    ],
    products: [
      { id:401, name:"ARB Summit Bumper LC200", price:89900, img:"https://images.unsplash.com/photo-1640636430737-de4ae2656d43?w=400&h=300&fit=crop&auto=format", category:"Защита", badge:"Топ" },
      { id:402, name:"ARB Snorkel Prado 150", price:22900, img:"https://images.unsplash.com/photo-1759428925891-eb797202e3b2?w=400&h=300&fit=crop&auto=format", category:"Аксессуары" },
      { id:403, name:"ARB CKMTA12 Compressor", price:34900, img:"https://images.unsplash.com/photo-1671040690726-b78261eff126?w=400&h=300&fit=crop&auto=format", category:"Компрессоры", badge:"Хит" },
      { id:404, name:"ARB Air Locker Dana 44", price:58900, img:"https://images.unsplash.com/photo-1570129476815-ba368ac77013?w=400&h=300&fit=crop&auto=format", category:"Аксессуары" },
    ],
  },
  {
    slug: "rigid",
    name: "Rigid Industries",
    country: "США",
    founded: "2006",
    tagline: "The LED Light Bar Inventors",
    description: "Rigid Industries изобрели LED-балки для внедорожников в 2006 году. Продукция применяется армией США, NASA и лидерами гонок Baja.",
    categories: ["Освещение"],
    productsCount: 67,
    heroImg: "https://images.unsplash.com/photo-1636138100130-1780f51e3bee?w=1600&h=700&fit=crop&auto=format",
    logoColor: "#0066cc",
    accentColor: "#0066cc",
    website: "rigidindustries.com",
    story: "Компания основана в Гилберте, Аризона, в 2006 году. Изначально Rigid разрабатывала LED-системы для военных вертолётов. Технологии перенесли на гражданский рынок — результатом стала революция в внедорожном освещении. Сегодня Rigid — поставщик #1 для команд Trophy Truck и Stadium Super Trucks.",
    advantages: [
      { title:"Изобретатели LED-балок", text:"Rigid создали категорию светодиодных балок для внедорожников. 17 лет исследований превратили прототип в индустриальный стандарт." },
      { title:"Spectrum™ технология", text:"Уникальная оптика с несколькими режимами рассеивания. Spot, flood, driving — всё в одном корпусе IP68." },
      { title:"Поставщик NASA и US Army", text:"Если надёжности хватает для космических аппаратов и бронетехники — на бездорожье точно хватит." },
    ],
    products: [
      { id:501, name:"Rigid SR-Series Pro 40\"", price:89900, img:"https://images.unsplash.com/photo-1636138100130-1780f51e3bee?w=400&h=300&fit=crop&auto=format", category:"Освещение", badge:"Топ" },
      { id:502, name:"Rigid Adapt XE 20\"", price:54900, img:"https://images.unsplash.com/photo-1636138103626-8057cad9c335?w=400&h=300&fit=crop&auto=format", category:"Освещение" },
      { id:503, name:"Rigid D-Series Pro Spot Pair", price:18900, img:"https://images.unsplash.com/photo-1760413496821-db15e5d085be?w=400&h=300&fit=crop&auto=format", category:"Освещение", badge:"Хит" },
      { id:504, name:"Rigid Radiance+ 30\"", price:42900, img:"https://images.unsplash.com/photo-1636138100130-1780f51e3bee?w=400&h=300&fit=crop&auto=format", category:"Освещение" },
    ],
  },
  {
    slug: "mechanix",
    name: "Mechanix Wear",
    country: "США",
    founded: "1991",
    tagline: "The Original Performance Glove",
    description: "Mechanix Wear — создатели рабочих и тактических перчаток, которые носят механики NASCAR, солдаты спецназа и офроудеры по всему миру.",
    categories: ["Одежда", "Экипировка"],
    productsCount: 44,
    heroImg: "https://images.unsplash.com/photo-1596507931135-75f699668356?w=1600&h=700&fit=crop&auto=format",
    logoColor: "#ff6600",
    accentColor: "#ff6600",
    website: "mechanix.com",
    story: "В 1991 году основатель компании шил перчатки для механиков команды NASCAR в гараже. Через год Mechanix стали официальным поставщиком NASCAR. В 2001 году US Army приняла на вооружение — с тех пор поставлено более 40 миллионов пар для военных по всему миру.",
    advantages: [
      { title:"40 млн пар для армии США", text:"Если Mechanix доверяют спецназу в зонах боевых действий, на бездорожье они точно справятся с любой задачей." },
      { title:"TekDry™ технология", text:"Дышащий материал выводит влагу, сохраняя тактильность. Работайте в дождь — руки останутся сухими." },
      { title:"AX-Suede™ ладонь", text:"Синтетическая замша в 2× прочнее натуральной. Не намокает, не дубеет на морозе, не скользит на металле." },
    ],
    products: [
      { id:601, name:"M-PACT Gloves Black XL", price:3490, img:"https://images.unsplash.com/photo-1596507931135-75f699668356?w=400&h=300&fit=crop&auto=format", category:"Экипировка", badge:"Хит" },
      { id:602, name:"FastFit Gloves Coyote L", price:2890, img:"https://images.unsplash.com/photo-1596507931135-75f699668356?w=400&h=300&fit=crop&auto=format", category:"Экипировка" },
      { id:603, name:"ColdWork Peak Gloves XL", price:4290, img:"https://images.unsplash.com/photo-1596507931135-75f699668356?w=400&h=300&fit=crop&auto=format", category:"Экипировка", badge:"Зима" },
      { id:604, name:"Wear M-PACT Fingerless L", price:3190, img:"https://images.unsplash.com/photo-1596507931135-75f699668356?w=400&h=300&fit=crop&auto=format", category:"Экипировка" },
    ],
  },
];

export function getBrandBySlug(slug: string) {
  return BRANDS.find(b => b.slug === slug);
}
