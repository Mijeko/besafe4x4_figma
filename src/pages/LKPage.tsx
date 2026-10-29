import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import ChatSection from "../components/ChatSection";
import FriendsSection from "../components/FriendsSection";
import SignalsSection from "../components/SignalsSection";
import { CATEGORIES } from "../data/catalog";
import { AUTO_SERVICES } from "../data/services";

// ── Types ────────────────────────────────────────────────────

type Car = { id:number; brand:string; model:string; year:string; plate:string; engine:string; drive:string; mods:string; color:string; primary:boolean; };
type LKEvent = { id:number; title:string; date:string; location:string; type:string; typeColor:string; status:"Записан"|"Завершено"|"Отменён"; img:string; role:"participant"|"organizer"; participants?:number; maxParticipants?:number; };
type UserClub = { id:number; name:string; city:string; role:string; members:number; routes:number; joined:string; img:string; accent:string; };
type Achievement = { id:number; title:string; description:string; category:string; earned:boolean; earnedAt?:string; progress:number; goal:number; unit:string; trackProgress?:boolean; icon:"route"|"distance"|"club"|"event"|"helper"|"garage"|"night"|"veteran"; };

// ── Data ─────────────────────────────────────────────────────

const INIT_CARS: Car[] = [
  { id:1, brand:"Toyota", model:"Land Cruiser 200", year:"2019", plate:"А777КХ 77", engine:"4.5 V8 Diesel", drive:"4WD", mods:"Лифт 50мм, силовой бампер, лебёдка Warn 12000", color:"#2d5a3d", primary:true },
  { id:2, brand:"Jeep", model:"Wrangler Rubicon", year:"2021", plate:"В321МО 50", engine:"2.0 Turbo", drive:"4WD", mods:'Rock rails, шины BFG 37"', color:"#8b3a1a", primary:false },
];

const MY_EVENTS: LKEvent[] = [
  { id:1, title:"Осеннее бездорожье 2026", date:"2 сен 2026", location:"Ленинградская обл., Тихвинский р-н", type:"Слёт", typeColor:"#e84e00", status:"Записан", img:"https://images.unsplash.com/photo-1640636430737-de4ae2656d43?w=600&h=360&fit=crop&auto=format", role:"participant" },
  { id:2, title:"Весенний офф-роуд 2026", date:"15 апр 2026", location:"Подмосковье, полигон Дружба", type:"Слёт", typeColor:"#e84e00", status:"Завершено", img:"https://images.unsplash.com/photo-1596507931135-75f699668356?w=600&h=360&fit=crop&auto=format", role:"participant" },
  { id:3, title:"Учебный день — апрель", date:"20 апр 2026", location:"Москва, полигон", type:"Обучение", typeColor:"#3a9e5f", status:"Завершено", img:"https://images.unsplash.com/photo-1620029188962-be2c6486593d?w=600&h=360&fit=crop&auto=format", role:"participant" },
  { id:4, title:"Ночной триал — июнь", date:"8 июн 2026", location:"Ленобласть", type:"Соревнование", typeColor:"#9b59b6", status:"Отменён", img:"https://images.unsplash.com/photo-1654162456768-ebf2c2c81bb4?w=600&h=360&fit=crop&auto=format", role:"participant" },
  { id:5, title:"Грязевой марафон — август", date:"18 авг 2026", location:"Тверская обл., Конаково", type:"Слёт", typeColor:"#e84e00", status:"Записан", img:"https://images.unsplash.com/photo-1570129476815-ba368ac77013?w=600&h=360&fit=crop&auto=format", role:"organizer", participants:34, maxParticipants:60 },
  { id:6, title:"Зимний офф-роуд 2026", date:"12 янв 2026", location:"Подмосковье, Ногинск", type:"Слёт", typeColor:"#e84e00", status:"Завершено", img:"https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&h=360&fit=crop&auto=format", role:"organizer", participants:48, maxParticipants:50 },
  { id:7, title:"Школа езды — март", date:"5 мар 2026", location:"Москва, полигон Востряково", type:"Обучение", typeColor:"#3a9e5f", status:"Завершено", img:"https://images.unsplash.com/photo-1590005354167-6da97870c757?w=600&h=360&fit=crop&auto=format", role:"organizer", participants:22, maxParticipants:25 },
];

const MY_CLUBS: UserClub[] = [
  { id:1, name:"Стальные Волки", city:"Москва", role:"Участник", members:312, routes:47, joined:"Янв 2023", img:"https://images.unsplash.com/photo-1579271723430-d600366f032f?w=700&h=400&fit=crop&auto=format", accent:"#2d5a3d" },
  { id:3, name:"Уральские Медведи", city:"Екатеринбург", role:"Участник", members:178, routes:29, joined:"Авг 2024", img:"https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=700&h=400&fit=crop&auto=format", accent:"#1a3a5c" },
  { id:2, name:"Red Dust Club", city:"Краснодар", role:"Организатор", members:241, routes:56, joined:"Мар 2024", img:"https://images.unsplash.com/photo-1596507931135-75f699668356?w=700&h=400&fit=crop&auto=format", accent:"#8b3a1a" },
];

const BRANDS = ["Toyota","Jeep","Land Rover","Mitsubishi","Nissan","Ford","UAZ","Lada","Другой"];
const DRIVES = ["4WD","AWD","RWD","FWD"];
const SWATCHES = ["#2d5a3d","#8b3a1a","#1a2a3a","#2a2a2a","#c0a060","#e84e00","#6b3fa0","#ffffff"];

const PRIMARY_LK_TABS = [
  { key:"overview", label:"Главная" },
  { key:"machines", label:"Мои машины" },
  { key:"events", label:"Мои события" },
  { key:"clubs", label:"Мои клубы" },
  { key:"achievements", label:"Достижения" },
  { key:"signals", label:"Сигналы" },
];

const MORE_LK_TABS = [
  { key:"friends", label:"Друзья" },
  { key:"chat", label:"Сообщения" },
  { key:"purchases", label:"Покупки" },
  { key:"settings", label:"Настройки" },
];

const LK_NAV_GROUPS = [
  { label:"Профиль", keys:["overview","machines","achievements"] },
  { label:"Сообщество", keys:["events","clubs","signals","friends","chat"] },
  { label:"Аккаунт", keys:["purchases","settings"] },
];

const ACHIEVEMENTS: Achievement[] = [
  { id:1, title:"Первый след", description:"Пройти первый маршрут и сохранить его в профиле", category:"Маршруты", earned:true, earnedAt:"14 мая 2021", progress:1, goal:1, unit:"маршрут", icon:"route" },
  { id:2, title:"Тысяча километров", description:"Проехать 1 000 км вне асфальта", category:"Маршруты", earned:true, earnedAt:"3 июл 2023", progress:1000, goal:1000, unit:"км", icon:"distance" },
  { id:3, title:"Свой в клубе", description:"Вступить в клуб единомышленников", category:"Сообщество", earned:true, earnedAt:"21 янв 2023", progress:1, goal:1, unit:"клуб", icon:"club" },
  { id:4, title:"Ветеран сообщества", description:"Провести на платформе пять активных сезонов", category:"Сообщество", earned:true, earnedAt:"8 апр 2026", progress:5, goal:5, unit:"сезонов", icon:"veteran" },
  { id:5, title:"Всегда на старте", description:"Принять участие в 10 событиях сообщества", category:"События", earned:false, progress:7, goal:10, unit:"событий", trackProgress:true, icon:"event" },
  { id:6, title:"Протяни трос", description:"Помочь пяти участникам на маршруте", category:"Сообщество", earned:false, progress:3, goal:5, unit:"помощи", trackProgress:true, icon:"helper" },
  { id:7, title:"Гараж мечты", description:"Добавить три подготовленных автомобиля", category:"Гараж", earned:false, progress:2, goal:3, unit:"машины", trackProgress:true, icon:"garage" },
  { id:8, title:"Ночная смена", description:"Финишировать в трёх ночных трофи-рейдах", category:"События", earned:false, progress:1, goal:3, unit:"рейда", icon:"night" },
];

function SectionIcon({ name }: { name:string }) {
  const paths: Record<string, React.ReactNode> = {
    overview:<><circle cx="8" cy="8" r="5.5"/><circle cx="8" cy="8" r="1.5"/></>,
    machines:<><path d="M2 10.5 3.5 6h9l1.5 4.5M1.5 10.5h13v3h-13z"/><circle cx="4" cy="13.5" r="1"/><circle cx="12" cy="13.5" r="1"/></>,
    events:<><rect x="2" y="3.5" width="12" height="10" rx=".5"/><path d="M5 2v3M11 2v3M2 7h12"/></>,
    clubs:<><path d="M3 14V2M3 3h9l-2 3 2 3H3"/></>,
    achievements:<><path d="M5 2h6v4a3 3 0 0 1-6 0V2Z"/><path d="M5 4H2.5v1A3 3 0 0 0 6 8M11 4h2.5v1A3 3 0 0 1 10 8M8 9v3M5 14h6M6 12h4"/></>,
    signals:<><path d="M8 14s-5-4-5-8.5a5 5 0 1 1 10 0C13 10 8 14 8 14Z"/><path d="M8 3.5v3M8 9h.01"/></>,
    friends:<><circle cx="6" cy="5" r="2.5"/><path d="M1.5 13c0-2.4 2-4.3 4.5-4.3s4.5 1.9 4.5 4.3M11 3.5a2 2 0 0 1 0 4M11.5 9c1.8.4 3 1.9 3 4"/></>,
    chat:<path d="M2 2.5h12v8H7l-3.5 3v-3H2v-8Z"/>,
    purchases:<><path d="M2.5 5h11l-1 9h-9z"/><path d="M5.5 6V4a2.5 2.5 0 0 1 5 0v2"/></>,
    settings:<><circle cx="8" cy="8" r="2.5"/><path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M12.6 3.4l-1.4 1.4M4.8 11.2l-1.4 1.4"/></>,
  };
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

const PROFILE_STATS = [
  { value:"23", label:"Маршрутов", color:"#e84e00" },
  { value:"4 812", label:"Км офф-роуд", color:"#2d5a3d" },
  { value:"2", label:"Клуба", color:"#8b3a1a" },
  { value:"4.8", label:"Рейтинг ★", color:"#d4820a" },
];

const inp: React.CSSProperties = { width:"100%", padding:"11px 14px", border:"1px solid #e0dbd4", outline:"none", fontFamily:"'Barlow',sans-serif", fontSize:14, color:"#1a1612", background:"#fff", boxSizing:"border-box" };

// ── Profile Hero Banner ───────────────────────────────────────

function ProfileHero() {
  return (
    <div style={{ position:"relative", overflow:"hidden" }}>
      {/* bg image */}
      <div style={{ position:"absolute", inset:0 }}>
        <img src="https://images.unsplash.com/photo-1640636430727-649f73271766?w=1400&h=400&fit=crop&auto=format" alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,rgba(26,22,18,0.92) 0%,rgba(26,22,18,0.7) 50%,rgba(232,78,0,0.4) 100%)" }}/>
      </div>

      <div style={{ position:"relative", width:"100%", maxWidth:1280, margin:"0 auto", padding:"40px 24px" }}>
        {/* top row: avatar + name + stats */}
        <div style={{ display:"flex", alignItems:"flex-start", gap:28 }}>
          {/* avatar */}
          <div style={{ position:"relative", flexShrink:0 }}>
            <div style={{ width:88, height:88, background:"#e84e00", display:"flex", alignItems:"center", justifyContent:"center", border:"3px solid rgba(255,255,255,0.15)" }}>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:34, color:"#fff", letterSpacing:"0.04em" }}>ИМ</span>
            </div>
            <div style={{ position:"absolute", bottom:-3, right:-3, width:22, height:22, background:"#3a9e5f", border:"2px solid #1a1612", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="9" height="7" viewBox="0 0 10 8" fill="none" stroke="white" strokeWidth="2.5"><path d="M1 4l3 3 5-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>

          {/* name + meta */}
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:6 }}>
              <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:32, letterSpacing:"0.06em", textTransform:"uppercase", color:"#fff", lineHeight:1, margin:0 }}>Иван Морозов</h2>
              <span style={{ background:"#e84e00", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:"#fff", padding:"3px 10px" }}>Ветеран</span>
            </div>
            <div style={{ display:"flex", gap:16 }}>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(255,255,255,0.5)" }}>@ivan_morozov</span>
              <span style={{ color:"rgba(255,255,255,0.25)" }}>·</span>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(255,255,255,0.5)" }}>Участник с 2021</span>
              <span style={{ color:"rgba(255,255,255,0.25)" }}>·</span>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(255,255,255,0.5)" }}>Москва</span>
            </div>
          </div>

          {/* stats row */}
          <div style={{ display:"flex", gap:0, border:"1px solid rgba(255,255,255,0.1)" }}>
            {PROFILE_STATS.map((s,i)=>(
              <div key={s.label} style={{ padding:"14px 24px", textAlign:"center", borderRight:i<3?"1px solid rgba(255,255,255,0.1)":"none" }}>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:26, color:s.color, lineHeight:1 }}>{s.value}</div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(255,255,255,0.45)", marginTop:3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function AccountNavigation({ activeKey, onNav }: { activeKey:string; onNav:(key:string)=>void }) {
  const [mobileOpen,setMobileOpen] = useState(false);
  const tabs = [...PRIMARY_LK_TABS,...MORE_LK_TABS];
  const activeTab = tabs.find(tab=>tab.key===activeKey) || tabs[0];
  const goTo = (key:string) => { setMobileOpen(false); onNav(key); };

  const navigation = (
    <>
      {LK_NAV_GROUPS.map((group,index)=>(
        <div key={group.label} style={{ padding:index===0?"18px 12px 10px":"14px 12px 10px", borderTop:index===0?"none":"1px solid #f0ece8" }}>
          <div style={{ padding:"0 10px 7px", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.22em", textTransform:"uppercase", color:"#aaa49e" }}>{group.label}</div>
          <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
            {group.keys.map(key=>{
              const tab = tabs.find(item=>item.key===key)!;
              const active = activeKey===key;
              return (
                <button key={key} onClick={()=>goTo(key)}
                  style={{ width:"100%", padding:"10px", border:"none", borderLeft:active?"3px solid #e84e00":"3px solid transparent", background:active?"#fff4ee":"transparent", color:active?"#e84e00":"#6b6357", cursor:"pointer", display:"flex", alignItems:"center", gap:10, textAlign:"left", transition:"background 0.15s,color 0.15s" }}
                >
                  <SectionIcon name={key}/>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:active?800:600, fontSize:12, letterSpacing:"0.1em", textTransform:"uppercase" }}>{tab.label}</span>
                  {key==="chat" && <span style={{ marginLeft:"auto", minWidth:18, height:18, padding:"0 5px", background:"#e84e00", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:9 }}>3</span>}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );

  return (
    <>
      <aside className="hidden lg:block" style={{ alignSelf:"start", position:"sticky", top:24, marginTop:32, background:"#fff", border:"1px solid #e5e0d8" }}>
        <div style={{ padding:"16px 22px", background:"#1a1612", borderBottom:"3px solid #e84e00" }}>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:17, letterSpacing:"0.1em", textTransform:"uppercase", color:"#fff" }}>Личный кабинет</div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase", color:"rgba(255,255,255,0.4)", marginTop:3 }}>Управление профилем</div>
        </div>
        {navigation}
      </aside>

      <div className="lg:hidden" style={{ position:"relative", marginTop:20 }}>
        <button onClick={()=>setMobileOpen(open=>!open)} aria-expanded={mobileOpen}
          style={{ width:"100%", padding:"14px 16px", border:"1px solid #e5e0d8", borderLeft:"4px solid #e84e00", background:"#fff", color:"#1a1612", cursor:"pointer", display:"flex", alignItems:"center", gap:11, textAlign:"left" }}
        >
          <SectionIcon name={activeTab.key}/>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:13, letterSpacing:"0.13em", textTransform:"uppercase" }}>{activeTab.label}</span>
          <span style={{ marginLeft:"auto", fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.15em", textTransform:"uppercase", color:"#aaa49e" }}>Сменить раздел</span>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="#6b6357" style={{ transform:mobileOpen?"rotate(180deg)":"none" }}><path d="m1 1 4 4 4-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        {mobileOpen && <div style={{ background:"#fff", border:"1px solid #e5e0d8", borderTop:"none" }}>{navigation}</div>}
      </div>
    </>
  );
}

// ── Journal types & data ─────────────────────────────────────

type JournalEntry = {
  id: number; carId: number; date: string; title: string; odometer: number;
  category: "Обслуживание" | "Доработка" | "Поездка" | "Ремонт" | "Экспедиция";
  categoryColor: string; body: string; cost?: number; img?: string;
  tags: string[];
};

const CATEGORY_COLOR: Record<string, string> = {
  "Обслуживание": "#3a9e5f",
  "Доработка":    "#e84e00",
  "Поездка":      "#2d5a8e",
  "Ремонт":       "#c0392b",
  "Экспедиция":   "#9b59b6",
};

const INIT_JOURNAL: JournalEntry[] = [
  { id:1, carId:1, date:"18 сен 2026", title:"Замена масла и фильтров перед сезоном", odometer:87400, category:"Обслуживание", categoryColor:CATEGORY_COLOR["Обслуживание"], cost:4200, body:"Заменил моторное масло Motul 10W-40, масляный фильтр, воздушный и топливный фильтры. Попутно проверил уровень тормозной жидкости и ОЖ — в норме. Следующая замена через 10 000 км или весной 2027.", tags:["масло","фильтры","плановое"], img:"https://images.unsplash.com/photo-1621955964441-c173e01c135b?w=800&h=400&fit=crop&auto=format" },
  { id:2, carId:1, date:"5 сен 2026", title:"Осеннее бездорожье 2026 — слёт в Тихвине", odometer:87100, category:"Экспедиция", categoryColor:CATEGORY_COLOR["Экспедиция"], body:"Три дня в Тихвинском районе. Прошёл «Зелёную» и «Жёлтую» трассы без проблем. На «Чёрной» чуть не сел на брюхо в болотном участке — вытащил Роман на лебёдке. Машина показала себя отлично, ни одной поломки. Грязи было по самое не хочу.", tags:["слёт","Тихвин","трофи"], img:"https://images.unsplash.com/photo-1640636430737-de4ae2656d43?w=800&h=400&fit=crop&auto=format" },
  { id:3, carId:1, date:"12 авг 2026", title:"Установка защиты картера ARB", odometer:86200, category:"Доработка", categoryColor:CATEGORY_COLOR["Доработка"], cost:18500, body:"Поставил защиту картера ARB с алюминиевыми вставками. Заодно проверил крепления лифт-комплекта — всё в порядке. Защита встала идеально, ничего не пришлось подгонять.", tags:["ARB","защита","установка"] },
  { id:4, carId:1, date:"3 июл 2026", title:"Прорвало патрубок охлаждения", odometer:84700, category:"Ремонт", categoryColor:CATEGORY_COLOR["Ремонт"], cost:1800, body:"В дороге загорелась лампа температуры. Оказался лопнувший патрубок верхнего радиатора. Заменил сам в полевых условиях, запасной патрубок был в ЗИП. Повезло что не потерял много ОЖ.", tags:["охлаждение","ремонт","ЗИП"] },
  { id:5, carId:2, date:"20 сен 2026", title:"Новая резина BFGoodrich Mud-Terrain", odometer:41200, category:"Доработка", categoryColor:CATEGORY_COLOR["Доработка"], cost:62000, body:"Поставил комплект BFG MT 37x12.5R17. Разница с шоссейной резиной — небо и земля. На асфальте немного шумнее, зато в грязи машина стала совершенно другой.", tags:["резина","BFG","mud-terrain"], img:"https://images.unsplash.com/photo-1596507931135-75f699668356?w=800&h=400&fit=crop&auto=format" },
  { id:6, carId:2, date:"8 авг 2026", title:"ТО-2 по регламенту Jeep", odometer:40000, category:"Обслуживание", categoryColor:CATEGORY_COLOR["Обслуживание"], cost:12400, body:"Плановое ТО в официальном центре. Замена масла в двигателе, КПП и раздатке. Проверка тормозов — передние колодки заменены.", tags:["ТО","плановое","официальный"] },
];

// ── Car card ─────────────────────────────────────────────────

const CAR_BG: Record<string, string> = {
  "Toyota":"https://images.unsplash.com/photo-1579271723430-d600366f032f?w=600&h=300&fit=crop&auto=format",
  "Jeep":"https://images.unsplash.com/photo-1622300868582-544a4dde5395?w=600&h=300&fit=crop&auto=format",
};

function CarCard({ car, onDelete, onSetPrimary, onClick }: { car:Car; onDelete:(id:number)=>void; onSetPrimary:(id:number)=>void; onClick?:()=>void }) {
  const [menuOpen,setMenuOpen] = useState(false);
  const [flipped,setFlipped] = useState(false);
  const bg = CAR_BG[car.brand] || "https://images.unsplash.com/photo-1596507931135-75f699668356?w=600&h=300&fit=crop&auto=format";

  return (
    <div style={{ position:"relative", overflow:"hidden", cursor:"pointer", border:"1px solid transparent", transition:"border-color 0.2s" }}
      onMouseEnter={e=>(e.currentTarget as HTMLElement).style.borderColor="#e84e00"}
      onMouseLeave={e=>(e.currentTarget as HTMLElement).style.borderColor="transparent"}
      onClick={onClick || (()=>setFlipped(!flipped))}
    >
      {/* poster image */}
      <div style={{ height:200, position:"relative", background:"#1a1612", overflow:"hidden" }}>
        <img src={bg} alt={car.model} style={{ width:"100%", height:"100%", objectFit:"cover", opacity:0.55, transition:"transform 0.5s", transform:flipped?"scale(1.06)":"scale(1)" }}/>
        <div style={{ position:"absolute", inset:0, background:`linear-gradient(to top, ${car.color}ee 0%, ${car.color}44 50%, transparent 100%)` }}/>

        {/* top badges */}
        <div style={{ position:"absolute", top:12, left:12, right:12, display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          {car.primary && (
            <span style={{ background:"#e84e00", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:"#fff", padding:"4px 10px" }}>✦ Основная</span>
          )}
          {!car.primary && <span/>}
          {/* 3-dot menu */}
          <div style={{ position:"relative" }}>
            <button onClick={e=>{ e.stopPropagation(); setMenuOpen(!menuOpen); }}
              style={{ width:32, height:32, background:"rgba(255,255,255,0.15)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", backdropFilter:"blur(4px)" }}>
              <svg width="4" height="14" viewBox="0 0 4 16" fill="white"><circle cx="2" cy="2" r="1.5"/><circle cx="2" cy="8" r="1.5"/><circle cx="2" cy="14" r="1.5"/></svg>
            </button>
            {menuOpen && (
              <div onClick={e=>e.stopPropagation()} style={{ position:"absolute", right:0, top:36, width:176, background:"#fff", border:"1px solid #e8e4df", zIndex:30, boxShadow:"0 12px 32px rgba(0,0,0,0.15)" }}>
                {!car.primary && <button onClick={()=>{ onSetPrimary(car.id); setMenuOpen(false); }} className="hover:bg-[#e84e00] hover:text-white" style={{ width:"100%", textAlign:"left", padding:"10px 16px", background:"none", border:"none", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, letterSpacing:"0.1em", textTransform:"uppercase", color:"#6b6357" }}>Сделать основной</button>}
                <button onClick={()=>{ onDelete(car.id); setMenuOpen(false); }} className="hover:bg-red-500 hover:text-white" style={{ width:"100%", textAlign:"left", padding:"10px 16px", background:"none", border:"none", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, letterSpacing:"0.1em", textTransform:"uppercase", color:"#c0392b" }}>Удалить</button>
              </div>
            )}
          </div>
        </div>

        {/* name over image */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"16px" }}>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:22, letterSpacing:"0.06em", textTransform:"uppercase", color:"#fff", lineHeight:1, marginBottom:3 }}>{car.brand} {car.model}</div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(255,255,255,0.65)" }}>{car.year} · {car.plate}</div>
        </div>
      </div>

      {/* info panel */}
      <div style={{ background:"#fff", padding:"16px" }}>
        <div style={{ display:"flex", gap:0, marginBottom:car.mods?14:0 }}>
          {[{l:"Двигатель",v:car.engine},{l:"Привод",v:car.drive}].map((s,i)=>(
            <div key={s.l} style={{ flex:1, paddingRight:i===0?16:0, borderRight:i===0?"1px solid #f0ece8":"none", paddingLeft:i===1?16:0 }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:"#aaa49e", marginBottom:3 }}>{s.l}</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:16, color:"#1a1612" }}>{s.v}</div>
            </div>
          ))}
        </div>
        {car.mods && (
          <div style={{ paddingTop:10, borderTop:"1px solid #f5f2ee" }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", color:"#aaa49e", marginBottom:3 }}>Доработки</div>
            <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:12, color:"#6b6357", lineHeight:1.5 }}>{car.mods}</div>
          </div>
        )}
        {/* color bar */}
        <div style={{ height:3, background:car.color, marginTop:14, marginLeft:-16, marginRight:-16, marginBottom:-16 }}/>
      </div>
    </div>
  );
}

// ── Add Journal Modal ─────────────────────────────────────────

function AddJournalModal({ carId, onClose, onAdd }: { carId:number; onClose:()=>void; onAdd:(e:JournalEntry)=>void }) {
  const [form, setForm] = useState({ title:"", category:"Обслуживание" as JournalEntry["category"], odometer:"", cost:"", body:"", tags:"" });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const set = (k: keyof typeof form, v: string) => { setForm(f=>({...f,[k]:v})); setErrors(e=>({...e,[k]:""})); };

  const submit = () => {
    const e: Partial<typeof form> = {};
    if (!form.title.trim()) e.title = "Укажите заголовок";
    if (!form.body.trim())  e.body  = "Напишите текст записи";
    if (Object.keys(e).length) { setErrors(e); return; }
    const now = new Date();
    const months = ["янв","фев","мар","апр","май","июн","июл","авг","сен","окт","ноя","дек"];
    onAdd({
      id: Date.now(), carId, date: `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`,
      title: form.title, odometer: Number(form.odometer)||0, category: form.category,
      categoryColor: CATEGORY_COLOR[form.category], body: form.body,
      cost: form.cost ? Number(form.cost) : undefined,
      tags: form.tags.split(",").map(t=>t.trim()).filter(Boolean),
    });
    onClose();
  };

  const inpS: React.CSSProperties = { width:"100%", padding:"11px 14px", border:"1px solid #e0dbd4", outline:"none", fontFamily:"'Barlow',sans-serif", fontSize:14, color:"#1a1612", background:"#fff", boxSizing:"border-box" };
  const lbl: React.CSSProperties = { fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.24em", textTransform:"uppercase", color:"#aaa49e", display:"block", marginBottom:6 };

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:200, background:"rgba(10,8,6,0.72)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#fff", width:"100%", maxWidth:480, maxHeight:"92vh", overflowY:"auto", position:"relative" }}>
        <div style={{ background:"#1a1612", padding:"20px 24px", position:"relative" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"#e84e00" }}/>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.28em", textTransform:"uppercase", color:"rgba(255,255,255,0.38)", marginBottom:3 }}>Журнал машины</div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:20, letterSpacing:"0.04em", textTransform:"uppercase", color:"#fff", lineHeight:1.1, paddingRight:32 }}>Новая запись</div>
          <button onClick={onClose} style={{ position:"absolute", top:16, right:18, background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.45)", fontSize:20, lineHeight:1, padding:4 }}
            onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.color="#fff"}
            onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.color="rgba(255,255,255,0.45)"}
          >✕</button>
        </div>
        <div style={{ padding:"20px 24px 24px", display:"flex", flexDirection:"column", gap:14 }}>
          <div>
            <label style={lbl}>Заголовок {errors.title && <span style={{ color:"#e84e00", fontWeight:400 }}>— {errors.title}</span>}</label>
            <input value={form.title} onChange={e=>set("title",e.target.value)} placeholder="Что произошло с машиной?" style={{ ...inpS, borderColor:errors.title?"#e84e00":"#e0dbd4" }}
              onFocus={e=>(e.target as HTMLInputElement).style.borderColor="#e84e00"}
              onBlur={e=>(e.target as HTMLInputElement).style.borderColor=errors.title?"#e84e00":"#e0dbd4"}
            />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <label style={lbl}>Категория</label>
              <select value={form.category} onChange={e=>set("category",e.target.value as JournalEntry["category"])} style={{ ...inpS, appearance:"none" }}>
                {Object.keys(CATEGORY_COLOR).map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Пробег (км)</label>
              <input type="number" value={form.odometer} onChange={e=>set("odometer",e.target.value)} placeholder="87 400" style={inpS}
                onFocus={e=>(e.target as HTMLInputElement).style.borderColor="#e84e00"}
                onBlur={e=>(e.target as HTMLInputElement).style.borderColor="#e0dbd4"}
              />
            </div>
          </div>
          <div>
            <label style={lbl}>Стоимость (₽, необязательно)</label>
            <input type="number" value={form.cost} onChange={e=>set("cost",e.target.value)} placeholder="4 200" style={inpS}
              onFocus={e=>(e.target as HTMLInputElement).style.borderColor="#e84e00"}
              onBlur={e=>(e.target as HTMLInputElement).style.borderColor="#e0dbd4"}
            />
          </div>
          <div>
            <label style={lbl}>Запись {errors.body && <span style={{ color:"#e84e00", fontWeight:400 }}>— {errors.body}</span>}</label>
            <textarea value={form.body} onChange={e=>set("body",e.target.value)} rows={5} placeholder="Опишите что произошло, что заменили, как прошло…" style={{ ...inpS, resize:"none", borderColor:errors.body?"#e84e00":"#e0dbd4" }}
              onFocus={e=>(e.target as HTMLTextAreaElement).style.borderColor="#e84e00"}
              onBlur={e=>(e.target as HTMLTextAreaElement).style.borderColor=errors.body?"#e84e00":"#e0dbd4"}
            />
          </div>
          <div>
            <label style={lbl}>Теги (через запятую)</label>
            <input value={form.tags} onChange={e=>set("tags",e.target.value)} placeholder="масло, фильтры, плановое" style={inpS}
              onFocus={e=>(e.target as HTMLInputElement).style.borderColor="#e84e00"}
              onBlur={e=>(e.target as HTMLInputElement).style.borderColor="#e0dbd4"}
            />
          </div>
          <button onClick={submit} style={{ padding:"13px 0", background:"#e84e00", border:"none", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, letterSpacing:"0.16em", textTransform:"uppercase", color:"#fff", marginTop:4 }}>
            Сохранить запись
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Journal Entry Detail ──────────────────────────────────────

function JournalEntryDetail({ entry, journal, car, onBack, onNavigate }: { entry:JournalEntry; journal:JournalEntry[]; car:Car; onBack:()=>void; onNavigate:(id:number)=>void }) {
  const bg = CAR_BG[car.brand] || "https://images.unsplash.com/photo-1596507931135-75f699668356?w=1200&h=500&fit=crop&auto=format";
  const firstSentence = entry.body.split(/[.!?]\s/)[0];
  const restBody = entry.body.slice(firstSentence.length).replace(/^[.!?]\s*/,"");
  const idx = journal.findIndex(e=>e.id===entry.id);
  const prev = idx > 0 ? journal[idx - 1] : null;
  const next = idx < journal.length - 1 ? journal[idx + 1] : null;

  return (
    <div style={{ background:"#f5f2ee", margin:"-32px -32px 0", padding:"32px 32px 60px" }}>
      {/* breadcrumb */}
      <button onClick={onBack} style={{ display:"inline-flex", alignItems:"center", gap:8, background:"none", border:"none", cursor:"pointer", padding:"0 0 28px", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"#aaa49e" }}
        onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.color="#e84e00"}
        onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.color="#aaa49e"}
      >
        <svg width="14" height="10" viewBox="0 0 14 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M13 6H1M6 1L1 6l5 5"/></svg>
        {car.brand} {car.model} / Журнал
      </button>

      {/* HERO */}
      <div style={{ position:"relative", height:360, overflow:"hidden", background:"#1a1612", marginBottom:0 }}>
        <img src={entry.img || bg} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", opacity:entry.img?0.55:0.3 }}/>
        {/* noise overlay */}
        <div style={{ position:"absolute", inset:0, backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")", opacity:0.6 }}/>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(10,8,6,1) 0%, rgba(10,8,6,0.6) 50%, rgba(10,8,6,0.15) 100%)" }}/>
        {/* category color bar + sweep */}
        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:5, background:entry.categoryColor }}/>
        <div style={{ position:"absolute", inset:0, background:`linear-gradient(90deg, ${entry.categoryColor}40 0%, transparent 35%)` }}/>
        {/* grid lines */}
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize:"100% 60px", pointerEvents:"none" }}/>

        <div style={{ position:"absolute", inset:0, padding:"32px 40px", display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
          <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
            <span style={{ background:entry.categoryColor, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.26em", textTransform:"uppercase", color:"#fff", padding:"4px 12px" }}>{entry.category}</span>
            <span style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.12)", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:600, fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(255,255,255,0.75)", padding:"4px 12px" }}>{entry.date}</span>
            {entry.odometer > 0 && (
              <span style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.12)", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:600, fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(255,255,255,0.75)", padding:"4px 12px" }}>⊙ {entry.odometer.toLocaleString("ru")} км</span>
            )}
            {entry.cost && (
              <span style={{ background:"rgba(232,78,0,0.25)", border:"1px solid rgba(232,78,0,0.4)", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", color:"#ff8c5a", padding:"4px 12px" }}>{entry.cost.toLocaleString("ru")} ₽</span>
            )}
          </div>
          <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:"clamp(26px,4vw,48px)", letterSpacing:"0.03em", textTransform:"uppercase", color:"#fff", lineHeight:1, margin:0, maxWidth:700 }}>{entry.title}</h1>
        </div>
      </div>

      {/* content grid */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 260px", gap:0, alignItems:"start" }}>

        {/* left: article */}
        <div style={{ background:"#fff", borderRight:"1px solid #ece8e3", padding:"40px 44px 48px" }}>
          {/* lead */}
          <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:600, fontSize:20, lineHeight:1.5, color:"#2a2420", margin:"0 0 24px", letterSpacing:"0.01em" }}>{firstSentence}.</p>
          {/* divider */}
          <div style={{ width:48, height:3, background:"#e84e00", marginBottom:24 }}/>
          {/* body */}
          {restBody && <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:15, lineHeight:1.9, color:"#5a544e", margin:"0 0 32px", whiteSpace:"pre-wrap" }}>{restBody}</p>}

          {/* tags */}
          {entry.tags.length > 0 && (
            <div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.26em", textTransform:"uppercase", color:"#c0b9b0", marginBottom:12 }}>Теги</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {entry.tags.map(t=>(
                  <span key={t} style={{ background:"#f5f2ee", border:"1px solid #e5e0d8", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:"#8c8480", padding:"5px 12px" }}>#{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* right: sidebar */}
        <div style={{ display:"flex", flexDirection:"column", gap:0, position:"sticky", top:0 }}>
          {/* metadata dark card */}
          <div style={{ background:"#1a1612", padding:"28px 24px", position:"relative" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:4, background:entry.categoryColor }}/>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.26em", textTransform:"uppercase", color:"rgba(255,255,255,0.3)", marginBottom:20 }}>Данные записи</div>
            {[
              { l:"Дата", v:entry.date },
              { l:"Пробег", v:entry.odometer > 0 ? `${entry.odometer.toLocaleString("ru")} км` : "—" },
              { l:"Категория", v:entry.category },
              ...(entry.cost ? [{ l:"Расходы", v:`${entry.cost.toLocaleString("ru")} ₽`, accent:true }] : []),
            ].map(row=>(
              <div key={row.l} style={{ padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(255,255,255,0.28)", marginBottom:3 }}>{row.l}</div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:15, letterSpacing:"0.04em", color:(row as {accent?:boolean}).accent?"#e84e00":"rgba(255,255,255,0.88)" }}>{row.v}</div>
              </div>
            ))}
          </div>

          {/* car card */}
          <div style={{ background:"#f5f2ee", border:"1px solid #e5e0d8", padding:"20px 24px" }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, letterSpacing:"0.26em", textTransform:"uppercase", color:"#c0b9b0", marginBottom:14 }}>Автомобиль</div>
            <div style={{ display:"flex", gap:12, alignItems:"center" }}>
              <div style={{ width:5, height:44, background:car.color, flexShrink:0 }}/>
              <div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:17, letterSpacing:"0.04em", textTransform:"uppercase", color:"#1a1612", lineHeight:1.1 }}>{car.brand}</div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, letterSpacing:"0.06em", textTransform:"uppercase", color:"#5a544e" }}>{car.model}</div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.12em", color:"#aaa49e", marginTop:2 }}>{car.year} · {car.plate}</div>
              </div>
            </div>
          </div>

          {/* back button */}
          <button onClick={onBack} style={{ padding:"16px 24px", background:"#e84e00", border:"none", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:"#fff", textAlign:"left", display:"flex", alignItems:"center", gap:10 }}>
            <svg width="14" height="10" viewBox="0 0 14 12" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M13 6H1M6 1L1 6l5 5"/></svg>
            К журналу
          </button>
        </div>
      </div>

      {/* prev / next navigation */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:0, marginTop:24, borderTop:"1px solid #e5e0d8" }}>
        {prev ? (
          <button onClick={()=>onNavigate(prev.id)} style={{ display:"flex", alignItems:"center", gap:14, padding:"20px 24px", background:"#fff", border:"none", borderRight:"1px solid #e5e0d8", cursor:"pointer", textAlign:"left" }}
            onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.background="#fdf9f6"}
            onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.background="#fff"}
          >
            <div style={{ width:32, height:32, border:"1px solid #e5e0d8", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg width="7" height="12" viewBox="0 0 8 14" fill="none" stroke="#e84e00" strokeWidth="2.2" strokeLinecap="round"><path d="M7 1L1 7l6 6"/></svg>
            </div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, letterSpacing:"0.24em", textTransform:"uppercase", color:"#c0b9b0", marginBottom:4 }}>Предыдущая запись</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:13, letterSpacing:"0.04em", textTransform:"uppercase", color:"#1a1612", lineHeight:1.2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{prev.title}</div>
              <div style={{ display:"flex", gap:8, marginTop:4, alignItems:"center" }}>
                <span style={{ display:"inline-block", width:8, height:8, background:prev.categoryColor }}/>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase", color:"#aaa49e" }}>{prev.category} · {prev.date}</span>
              </div>
            </div>
          </button>
        ) : <div style={{ background:"#fafaf8" }}/>}

        {next ? (
          <button onClick={()=>onNavigate(next.id)} style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", gap:14, padding:"20px 24px", background:"#fff", border:"none", cursor:"pointer", textAlign:"right" }}
            onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.background="#fdf9f6"}
            onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.background="#fff"}
          >
            <div style={{ minWidth:0 }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, letterSpacing:"0.24em", textTransform:"uppercase", color:"#c0b9b0", marginBottom:4 }}>Следующая запись</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:13, letterSpacing:"0.04em", textTransform:"uppercase", color:"#1a1612", lineHeight:1.2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{next.title}</div>
              <div style={{ display:"flex", gap:8, marginTop:4, alignItems:"center", justifyContent:"flex-end" }}>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase", color:"#aaa49e" }}>{next.category} · {next.date}</span>
                <span style={{ display:"inline-block", width:8, height:8, background:next.categoryColor }}/>
              </div>
            </div>
            <div style={{ width:32, height:32, border:"1px solid #e5e0d8", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg width="7" height="12" viewBox="0 0 8 14" fill="none" stroke="#e84e00" strokeWidth="2.2" strokeLinecap="round"><path d="M1 1l6 6-6 6"/></svg>
            </div>
          </button>
        ) : <div style={{ background:"#fafaf8" }}/>}
      </div>
    </div>
  );
}

// ── Car Detail ────────────────────────────────────────────────

function CarDetail({ car, journal, onBack, onAddJournal }: { car:Car; journal:JournalEntry[]; onBack:()=>void; onAddJournal:(e:JournalEntry)=>void }) {
  const navigate = useNavigate();
  const [entryId, setEntryId] = useState<number|null>(null);
  const [showAddJournal, setShowAddJournal] = useState(false);
  const [hoveredEntry, setHoveredEntry] = useState<number|null>(null);
  const [activePhoto, setActivePhoto] = useState(0);
  const [thumbsStart, setThumbsStart] = useState(0);

  const bg = CAR_BG[car.brand] || "https://images.unsplash.com/photo-1596507931135-75f699668356?w=1400&h=600&fit=crop&auto=format";
  const GALLERY = [
    bg,
    "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=1400&h=600&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1400&h=600&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&h=600&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1400&h=600&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&h=600&fit=crop&auto=format",
  ];
  const THUMB_VISIBLE = 5;

  const detail = journal.find(e=>e.id===entryId);
  if (detail) return <JournalEntryDetail entry={detail} journal={journal} car={car} onBack={()=>setEntryId(null)} onNavigate={setEntryId}/>;

  const totalCost = journal.reduce((s,e)=>s+(e.cost??0),0);
  const lastOdo = journal.length ? Math.max(...journal.map(e=>e.odometer)) : 0;
  const categorySlugs = car.brand==="Jeep" ? ["lift-kits","tires","lighting"] : ["lift-kits","armor","tires"];
  const recommendedProducts = categorySlugs.flatMap(slug=>{
    const category = CATEGORIES.find(item=>item.slug===slug);
    return category ? [{ category, product:category.products[0] }] : [];
  });
  const recommendedServices = AUTO_SERVICES.slice(0,3);

  const goPhoto = (dir: 1|-1) => {
    const next = (activePhoto + dir + GALLERY.length) % GALLERY.length;
    setActivePhoto(next);
    if (next < thumbsStart) setThumbsStart(next);
    else if (next >= thumbsStart + THUMB_VISIBLE) setThumbsStart(next - THUMB_VISIBLE + 1);
  };

  return (
    <>
      <button onClick={onBack} style={{ display:"flex", alignItems:"center", gap:8, background:"none", border:"none", cursor:"pointer", padding:0, marginBottom:20, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:"#aaa49e" }}
        onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.color="#e84e00"}
        onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.color="#aaa49e"}
      >
        <svg width="14" height="10" viewBox="0 0 14 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M13 6H1M6 1L1 6l5 5"/></svg>
        Мои машины
      </button>

      {/* hero gallery — two columns */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:0, background:"#fff", marginBottom:28, border:"1px solid #e5e0d8" }}>

        {/* LEFT: photo viewer */}
        <div style={{ display:"flex", flexDirection:"column" }}>
          {/* main photo — fills remaining height */}
          <div style={{ position:"relative", flex:"1 1 0", minHeight:0, background:"#f5f2ee", overflow:"hidden" }}>
            <img src={GALLERY[activePhoto]} alt=""
              style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
            {/* add photo button */}
            <button style={{ position:"absolute", top:12, right:12, display:"flex", alignItems:"center", gap:5, background:"rgba(255,255,255,0.9)", border:"1px solid #e0dbd4", cursor:"pointer", padding:"5px 10px" }}
              onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.background="#e84e00"}
              onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.background="rgba(255,255,255,0.9)"}
            >
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 1v10M1 6h10"/></svg>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.16em", textTransform:"uppercase", color:"inherit" }}>Добавить фото</span>
            </button>
            {/* counter */}
            <div style={{ position:"absolute", top:12, left:12, display:"flex", alignItems:"center", gap:5, background:"rgba(26,22,18,0.55)", padding:"3px 9px" }}>
              <svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5"><rect x="1" y="3" width="12" height="9" rx="1"/><circle cx="7" cy="7.5" r="2.2"/><path d="M4 3V2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"/></svg>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.14em", color:"rgba(255,255,255,0.85)" }}>{activePhoto+1} / {GALLERY.length}</span>
            </div>
            {/* nav arrows */}
            <button onClick={()=>goPhoto(-1)} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", width:32, height:32, background:"rgba(255,255,255,0.85)", border:"1px solid #e0dbd4", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}
              onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.background="#e84e00"}
              onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.background="rgba(255,255,255,0.85)"}
            ><svg width="10" height="9" viewBox="0 0 14 12" fill="none" stroke="#1a1612" strokeWidth="2.2" strokeLinecap="round"><path d="M13 6H1M6 1L1 6l5 5"/></svg></button>
            <button onClick={()=>goPhoto(1)} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", width:32, height:32, background:"rgba(255,255,255,0.85)", border:"1px solid #e0dbd4", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}
              onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.background="#e84e00"}
              onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.background="rgba(255,255,255,0.85)"}
            ><svg width="10" height="9" viewBox="0 0 14 12" fill="none" stroke="#1a1612" strokeWidth="2.2" strokeLinecap="round"><path d="M1 6h12M8 1l5 5-5 5"/></svg></button>
          </div>

          {/* thumbnails row */}
          <div style={{ display:"flex", gap:2, background:"#ece8e3", padding:2, height:56 }}>
            {GALLERY.map((src, idx) => (
              <div key={idx} onClick={()=>setActivePhoto(idx)} style={{ flex:"1 1 0", minWidth:0, height:"100%", overflow:"hidden", cursor:"pointer", outline: activePhoto===idx ? "2px solid #e84e00" : "2px solid transparent", outlineOffset:-2, position:"relative", background:"#f5f2ee" }}>
                <img src={src} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", opacity: activePhoto===idx ? 1 : 0.55, transition:"opacity 0.15s" }}/>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: car info — light */}
        <div style={{ display:"flex", flexDirection:"column", justifyContent:"space-between", padding:"28px 28px 24px", borderLeft:"1px solid #e5e0d8", background:"#fff" }}>
          <div>
            {car.primary && (
              <div style={{ marginBottom:14 }}>
                <span style={{ background:"#e84e00", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.22em", textTransform:"uppercase", color:"#fff", padding:"4px 12px" }}>✦ Основная машина</span>
              </div>
            )}
            <div style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:4 }}>
              <div style={{ width:4, height:40, background:car.color, flexShrink:0, marginTop:4 }}/>
              <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:34, letterSpacing:"0.04em", textTransform:"uppercase", color:"#1a1612", lineHeight:1, margin:0 }}>{car.brand}<br/>{car.model}</h1>
            </div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, letterSpacing:"0.14em", textTransform:"uppercase", color:"#aaa49e", marginBottom:24 }}>{car.year}</div>

            {/* specs grid */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px 20px", marginBottom:24 }}>
              {[
                { label:"Гос. номер", value: car.plate },
                { label:"Двигатель",  value: car.engine },
                { label:"Привод",     value: car.drive },
                { label:"Пробег",     value: `${lastOdo.toLocaleString("ru")} км` },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, letterSpacing:"0.22em", textTransform:"uppercase", color:"#c0b9b0", marginBottom:3 }}>{s.label}</div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:15, letterSpacing:"0.06em", textTransform:"uppercase", color:"#1a1612" }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* journal stats */}
            <div style={{ display:"flex", gap:0, borderTop:"1px solid #f0ece8", paddingTop:18 }}>
              {[
                { label:"Записей", value: journal.length },
                { label:"Потрачено", value: `${totalCost.toLocaleString("ru")} ₽` },
              ].map((s, i) => (
                <div key={s.label} style={{ flex:1, paddingLeft: i > 0 ? 20 : 0, borderLeft: i > 0 ? "1px solid #f0ece8" : "none" }}>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, letterSpacing:"0.22em", textTransform:"uppercase", color:"#c0b9b0", marginBottom:4 }}>{s.label}</div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:22, color:"#e84e00" }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* actions */}
          <div style={{ display:"flex", flexDirection:"column", gap:8, marginTop:24, borderTop:"1px solid #f0ece8", paddingTop:20 }}>
            <button onClick={()=>setShowAddJournal(true)} style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"11px 0", background:"#e84e00", border:"none", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.16em", textTransform:"uppercase", color:"#fff" }}>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5"><path d="M6 1v10M1 6h10" strokeLinecap="round"/></svg>
              Запись в журнал
            </button>
            <div style={{ display:"flex", gap:6 }}>
              {[
                { label:"Редактировать" },
                { label:"Архивировать" },
                ...(!car.primary ? [{ label:"Сделать основной" }] : []),
              ].map(btn => (
                <button key={btn.label} style={{ flex:1, padding:"9px 0", background:"transparent", border:"1px solid #e0dbd4", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase", color:"#6b6357" }}
                  onMouseEnter={e=>{ (e.currentTarget as HTMLButtonElement).style.borderColor="#e84e00"; (e.currentTarget as HTMLButtonElement).style.color="#e84e00"; }}
                  onMouseLeave={e=>{ (e.currentTarget as HTMLButtonElement).style.borderColor="#e0dbd4"; (e.currentTarget as HTMLButtonElement).style.color="#6b6357"; }}
                >{btn.label}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* quiet contextual recommendations */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4" style={{ marginBottom:28 }}>
        <div style={{ background:"#fff", border:"1px solid #e5e0d8" }}>
          <div style={{ padding:"16px 18px", borderBottom:"1px solid #f0ece8", display:"flex", alignItems:"baseline", justifyContent:"space-between", gap:16 }}>
            <div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:"#1a1612" }}>Подойдёт для этой машины</div>
              <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:10, color:"#aaa49e", marginTop:3 }}>Товары с совместимостью для {car.brand} {car.model}</div>
            </div>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#c0b9b0" strokeWidth="1.3"><path d="M3 5h14l-1 10H4L3 5ZM6 5V3h8v2M7 9h6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div>
            {recommendedProducts.map(({ category,product },index)=>(
              <button key={product.id} onClick={()=>navigate(`/catalog/${category.slug}/${product.id}`)}
                style={{ width:"100%", padding:"11px 14px", border:"none", borderBottom:index<recommendedProducts.length-1?"1px solid #f0ece8":"none", background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", gap:12, textAlign:"left" }}
              >
                <div style={{ width:52, height:42, background:"#f5f2ee", overflow:"hidden", flexShrink:0 }}>
                  <img src={product.img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:12, letterSpacing:"0.04em", textTransform:"uppercase", color:"#1a1612", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{product.name}</div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.09em", textTransform:"uppercase", color:"#aaa49e", marginTop:3 }}>{category.name} · {product.brand}</div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:13, color:"#1a1612" }}>{product.price.toLocaleString("ru")} ₽</div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, letterSpacing:"0.1em", textTransform:"uppercase", color:product.inStock?"#e84e00":"#aaa49e", marginTop:3 }}>{product.inStock?"В наличии":"Под заказ"}</div>
                </div>
                <svg width="6" height="10" viewBox="0 0 7 12" fill="none" stroke="#c0b9b0" strokeWidth="1.5"><path d="m1 1 5 5-5 5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            ))}
          </div>
        </div>

        <div style={{ background:"#fff", border:"1px solid #e5e0d8" }}>
          <div style={{ padding:"16px 18px", borderBottom:"1px solid #f0ece8", display:"flex", alignItems:"baseline", justifyContent:"space-between", gap:16 }}>
            <div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:"#1a1612" }}>Сервисы по вашей машине</div>
              <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:10, color:"#aaa49e", marginTop:3 }}>Мастерские, работающие с {car.brand} {car.model}</div>
            </div>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#c0b9b0" strokeWidth="1.3"><path d="m12 3-2.2 2.2 5 5L17 8a5 5 0 0 1-6.8 6.8L5 20l-3-3 5.2-5.2A5 5 0 0 1 14 5l-2-2Z" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div>
            {recommendedServices.map((service,index)=>(
              <button key={service.slug} onClick={()=>navigate(`/services/${service.slug}`)}
                style={{ width:"100%", padding:"11px 14px", border:"none", borderBottom:index<recommendedServices.length-1?"1px solid #f0ece8":"none", background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", gap:12, textAlign:"left" }}
              >
                <div style={{ width:52, height:42, background:"#f5f2ee", overflow:"hidden", flexShrink:0 }}>
                  <img src={service.image} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
                    <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:12, letterSpacing:"0.04em", textTransform:"uppercase", color:"#1a1612" }}>{service.name}</div>
                    <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:9, color:"#e84e00" }}>{service.rating}</span>
                  </div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.06em", color:"#aaa49e", marginTop:3, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{service.city} · {service.address}</div>
                </div>
                <div className="hidden sm:block" style={{ maxWidth:120, fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, letterSpacing:"0.1em", textTransform:"uppercase", color:"#8c8480", textAlign:"right" }}>{service.specialties.slice(0,2).join(" · ")}</div>
                <svg width="6" height="10" viewBox="0 0 7 12" fill="none" stroke="#c0b9b0" strokeWidth="1.5"><path d="m1 1 5 5-5 5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr", gap:20, alignItems:"start" }}>
        {/* left: journal */}
        <div>
          <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:16 }}>
            <div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.28em", textTransform:"uppercase", color:"#e84e00", marginBottom:4 }}>История</div>
              <h3 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:22, letterSpacing:"0.06em", textTransform:"uppercase", color:"#1a1612", lineHeight:1, margin:0 }}>Журнал машины</h3>
            </div>
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, letterSpacing:"0.14em", textTransform:"uppercase", color:"#aaa49e" }}>{journal.length} записей</span>
          </div>

          {journal.length === 0 ? (
            <div style={{ background:"#fff", border:"2px dashed #e5e0d8", padding:"48px 24px", textAlign:"center" }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, letterSpacing:"0.1em", textTransform:"uppercase", color:"#c0b9b0", marginBottom:12 }}>Журнал пуст</div>
              <button onClick={()=>setShowAddJournal(true)} style={{ padding:"9px 20px", background:"#e84e00", border:"none", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.14em", textTransform:"uppercase", color:"#fff" }}>Добавить первую запись</button>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:0, border:"1px solid #ece8e3", background:"#fff", overflow:"hidden" }}>
              {journal.map((entry, i)=>(
                <div key={entry.id}
                  onClick={()=>setEntryId(entry.id)}
                  onMouseEnter={()=>setHoveredEntry(entry.id)}
                  onMouseLeave={()=>setHoveredEntry(null)}
                  style={{ display:"flex", gap:0, cursor:"pointer", borderBottom: i<journal.length-1?"1px solid #f5f1ed":"none", background:hoveredEntry===entry.id?"#fdf9f6":"#fff", transition:"background 0.12s" }}
                >
                  <div style={{ width:4, background:entry.categoryColor, flexShrink:0 }}/>
                  {entry.img ? (
                    <div style={{ width:80, flexShrink:0, overflow:"hidden", background:"#1a1612" }}>
                      <img src={entry.img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", opacity:hoveredEntry===entry.id?0.85:0.65, transition:"opacity 0.2s, transform 0.3s", transform:hoveredEntry===entry.id?"scale(1.06)":"scale(1)" }}/>
                    </div>
                  ) : (
                    <div style={{ width:80, flexShrink:0, background:entry.categoryColor+"18", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={entry.categoryColor} strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>
                    </div>
                  )}
                  <div style={{ flex:1, padding:"14px 16px", minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, marginBottom:4 }}>
                      <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:14, letterSpacing:"0.04em", textTransform:"uppercase", color:"#1a1612", lineHeight:1.2 }}>{entry.title}</div>
                      <span style={{ background:entry.categoryColor+"18", border:`1px solid ${entry.categoryColor}44`, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:8, letterSpacing:"0.18em", textTransform:"uppercase", color:entry.categoryColor, padding:"2px 8px", flexShrink:0 }}>{entry.category}</span>
                    </div>
                    <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:12, color:"#aaa49e", marginBottom:8, lineHeight:1.5, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" as const }}>{entry.body}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:"#c0b9b0" }}>{entry.date}</span>
                      {entry.odometer > 0 && <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:"#c0b9b0" }}>{entry.odometer.toLocaleString("ru")} км</span>}
                      {entry.cost && <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:"#e84e00" }}>{entry.cost.toLocaleString("ru")} ₽</span>}
                    </div>
                  </div>
                  <div style={{ padding:"0 14px", display:"flex", alignItems:"center", opacity:hoveredEntry===entry.id?1:0, transition:"opacity 0.15s" }}>
                    <svg width="7" height="12" viewBox="0 0 8 14" fill="none" stroke="#e84e00" strokeWidth="2" strokeLinecap="round"><path d="M1 1l6 6-6 6"/></svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {showAddJournal && (
        <AddJournalModal carId={car.id} onClose={()=>setShowAddJournal(false)} onAdd={e=>{ onAddJournal(e); setShowAddJournal(false); }}/>
      )}
    </>
  );
}

// ── Add Car Modal ─────────────────────────────────────────────

type FormData = { brand:string; model:string; year:string; plate:string; engine:string; drive:string; mods:string; color:string };
const EMPTY: FormData = { brand:"", model:"", year:"", plate:"", engine:"", drive:"4WD", mods:"", color:"#2d5a3d" };

function Field({ label, error, children }: { label:string; error?:string; children:React.ReactNode }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
      <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.22em", textTransform:"uppercase", color:"#6b6357" }}>{label}</label>
      {children}
      {error && <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, color:"#e84e00" }}>{error}</span>}
    </div>
  );
}

function AddCarModal({ onClose, onAdd }: { onClose:()=>void; onAdd:(c:Omit<Car,"id"|"primary">)=>void }) {
  const [form,setForm] = useState<FormData>(EMPTY);
  const [errors,setErrors] = useState<Partial<FormData>>({});
  const set = (k:keyof FormData,v:string) => { setForm(f=>({...f,[k]:v})); setErrors(e=>({...e,[k]:""})); };
  const submit = () => {
    const e: Partial<FormData> = {};
    if(!form.brand) e.brand="Выберите марку";
    if(!form.model.trim()) e.model="Укажите модель";
    if(!form.year||+form.year<1980||+form.year>2026) e.year="1980–2026";
    if(!form.plate.trim()) e.plate="Укажите номер";
    if(!form.engine.trim()) e.engine="Укажите двигатель";
    if(Object.keys(e).length){ setErrors(e); return; }
    onAdd({ brand:form.brand, model:form.model, year:form.year, plate:form.plate, engine:form.engine, drive:form.drive, mods:form.mods, color:form.color });
    onClose();
  };
  return (
    <div style={{ position:"fixed", inset:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", padding:16, background:"rgba(26,22,18,0.75)", backdropFilter:"blur(4px)" }} onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div style={{ width:"100%", maxWidth:520, background:"#fff", maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ height:4, background:"linear-gradient(90deg,#e84e00,#ff7a2f 60%,#e84e00)" }}/>
        <div style={{ padding:"32px" }}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:28 }}>
            <div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.26em", textTransform:"uppercase", color:"#e84e00", marginBottom:6 }}>Гараж</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:28, letterSpacing:"0.06em", textTransform:"uppercase", color:"#1a1612", lineHeight:1 }}>Новая машина</div>
            </div>
            <button onClick={onClose} style={{ width:36, height:36, border:"1px solid #e0dbd4", background:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#aaa" }}>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 1l10 10M11 1L1 11" strokeLinecap="round"/></svg>
            </button>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <Field label="Марка" error={errors.brand}>
              <select value={form.brand} onChange={e=>set("brand",e.target.value)} style={{ ...inp, appearance:"none" }}>
                <option value="">Выберите марку</option>
                {BRANDS.map(b=><option key={b} value={b}>{b}</option>)}
              </select>
            </Field>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <Field label="Модель" error={errors.model}><input value={form.model} onChange={e=>set("model",e.target.value)} placeholder="Defender" style={inp}/></Field>
              <Field label="Год" error={errors.year}><input type="number" value={form.year} onChange={e=>set("year",e.target.value)} placeholder="2020" min={1980} max={2026} style={inp}/></Field>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <Field label="Гос. номер" error={errors.plate}><input value={form.plate} onChange={e=>set("plate",e.target.value)} placeholder="А000АА 77" style={inp}/></Field>
              <Field label="Двигатель" error={errors.engine}><input value={form.engine} onChange={e=>set("engine",e.target.value)} placeholder="3.0 TD" style={inp}/></Field>
            </div>
            <Field label="Привод">
              <div style={{ display:"flex", gap:8 }}>
                {DRIVES.map(d=>(
                  <button key={d} onClick={()=>set("drive",d)} style={{ padding:"8px 14px", border:`1px solid ${form.drive===d?"#e84e00":"#e0dbd4"}`, background:form.drive===d?"#e84e00":"transparent", color:form.drive===d?"#fff":"#6b6357", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, letterSpacing:"0.12em", textTransform:"uppercase", cursor:"pointer" }}>{d}</button>
                ))}
              </div>
            </Field>
            <Field label="Цвет кузова">
              <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                {SWATCHES.map(c=>(
                  <button key={c} onClick={()=>set("color",c)} style={{ width:28, height:28, background:c, border:form.color===c?"2px solid #e84e00":c==="#ffffff"?"1px solid #e0dbd4":"2px solid transparent", cursor:"pointer", position:"relative" }}>
                    {form.color===c && <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke={c==="#ffffff"?"#1a1612":"#fff"} strokeWidth="2" style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)" }}><path d="M1 4l3 3 5-6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </button>
                ))}
                <input type="color" value={form.color} onChange={e=>set("color",e.target.value)} style={{ width:28, height:28, cursor:"pointer", border:"1px solid #e0dbd4", padding:2 }}/>
              </div>
            </Field>
            <Field label="Доработки (необязательно)">
              <textarea value={form.mods} onChange={e=>set("mods",e.target.value)} placeholder="Лебёдка, лифт, шины…" rows={3} style={{ ...inp, resize:"none", fontFamily:"'Barlow',sans-serif", fontSize:13 }}/>
            </Field>
          </div>
          <div style={{ display:"flex", gap:10, marginTop:24 }}>
            <button onClick={onClose} style={{ flex:1, padding:"12px 0", border:"1px solid #e0dbd4", background:"transparent", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, letterSpacing:"0.14em", textTransform:"uppercase", color:"#6b6357", cursor:"pointer" }}>Отмена</button>
            <button onClick={submit} style={{ flex:1, padding:"12px 0", border:"none", background:"#e84e00", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, letterSpacing:"0.14em", textTransform:"uppercase", color:"#fff", cursor:"pointer" }}>Добавить</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Overview Section ─────────────────────────────────────────

const RECENT_JOURNAL: { id:number; title:string; category:string; categoryColor:string; date:string; carName:string; cost?:number; img:string }[] = [
  { id:1, title:"Замена масла и фильтров", category:"Обслуживание", categoryColor:"#2d7dd2", date:"18 сен 2026", carName:"Toyota Land Cruiser 80", cost:4200, img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=160&h=120&fit=crop" },
  { id:2, title:"Лифт подвески +50мм", category:"Доработка", categoryColor:"#e84e00", date:"5 сен 2026", carName:"Toyota Land Cruiser 80", cost:38000, img:"https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=160&h=120&fit=crop" },
  { id:3, title:"Экспедиция Алтай 2026", category:"Экспедиция", categoryColor:"#2d5a3d", date:"22 авг 2026", carName:"Toyota Land Cruiser 80", img:"https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=160&h=120&fit=crop" },
];

const UPCOMING_EVENTS: { id:number; title:string; date:string; location:string; img:string; status:string }[] = [
  { id:1, title:"Грязь & Камни — Осенний кубок", date:"12 окт 2026", location:"Подмосковье", img:"https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=160&h=100&fit=crop", status:"Записан" },
  { id:2, title:"Ночной трофи-рейд", date:"25 окт 2026", location:"Тверская обл.", img:"https://images.unsplash.com/photo-1471389655753-3b2b949e4e67?w=160&h=100&fit=crop", status:"Ожидание" },
];

const RECENT_ORDERS: { id:string; name:string; price:number; date:string; status:string; img:string }[] = [
  { id:"ORD-8821", name:"ARB Бампер силовой", price:62400, date:"20 сен 2026", status:"Доставляется", img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&h=80&fit=crop" },
  { id:"ORD-8715", name:"Лебёдка Warn 9500i", price:48900, date:"10 сен 2026", status:"Получен", img:"https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=80&h=80&fit=crop" },
];

function AchievementIcon({ type, earned=true }: { type:Achievement["icon"]; earned?:boolean }) {
  const paths: Record<Achievement["icon"], React.ReactNode> = {
    route:<><path d="M7 22C4 18.6 2 15.8 2 12.5a5 5 0 0 1 10 0c0 3.3-2 6.1-5 9.5Z"/><circle cx="7" cy="12.5" r="1.8"/><path d="M13 6h7M17 3l3 3-3 3M13 18h8"/></>,
    distance:<><circle cx="12" cy="12" r="9"/><path d="m12 12 4-5M5 16h14M7 8l2 2"/></>,
    club:<><path d="M5 21v-7M19 21v-7M3 14h18M6 14V9l6-6 6 6v5M9 14v-4h6v4"/></>,
    event:<><rect x="3" y="5" width="18" height="16"/><path d="M7 3v5M17 3v5M3 10h18M8 15h3M13 15h3"/></>,
    helper:<><path d="M12 21s-8-4.8-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.2-8 11-8 11Z"/><path d="M8 12h8M12 8v8"/></>,
    garage:<><path d="m3 10 9-7 9 7v11H3V10Z"/><path d="M7 21v-7h10v7M8 10h8"/></>,
    night:<><path d="M19 15.5A8 8 0 0 1 8.5 5 8.5 8.5 0 1 0 19 15.5Z"/><path d="m17 4 .5 1.5L19 6l-1.5.5L17 8l-.5-1.5L15 6l1.5-.5L17 4Z"/></>,
    veteran:<><path d="M8 3h8l2 5-6 4-6-4 2-5Z"/><circle cx="12" cy="16" r="5"/><path d="m12 13.5.8 1.6 1.7.2-1.2 1.2.3 1.7-1.6-.8-1.6.8.3-1.7-1.2-1.2 1.7-.2.8-1.6Z"/></>,
  };
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true" style={{ flexShrink:0, filter:earned?"drop-shadow(0 5px 8px rgba(232,78,0,0.18))":"none" }}>
      <path d="M32 3 54 15v25L32 59 10 40V15L32 3Z" fill={earned?"#fff4ee":"#ece8e3"} stroke={earned?"#e84e00":"#c9c2ba"} strokeWidth="2"/>
      <path d="M32 8 49 17.5v20L32 52.5 15 37.5v-20L32 8Z" stroke={earned?"#e84e00":"#b5ada4"} strokeWidth="1" strokeDasharray="2 3"/>
      <circle cx="32" cy="30" r="15" fill={earned?"#e84e00":"#d8d2cb"}/>
      <g transform="translate(20 18)" stroke={earned?"#fff":"#8c8480"} strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
        {paths[type]}
      </g>
      {earned && <path d="m26.5 54 5.5 5 5.5-5" fill="#e84e00"/>}
    </svg>
  );
}

function OverviewSection() {
  const navigate = useNavigate();
  const primaryCar = { brand:"Toyota", model:"Land Cruiser 80", year:1997, plate:"A777AA77", engine:"4.5 V8", drive:"4WD", color:"#2d5a3d", img:"https://images.unsplash.com/photo-1596507931135-75f699668356?w=600&h=400&fit=crop" };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:32, paddingTop:32 }}>

      {/* top row: primary car + quick stats */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>

        {/* primary car card */}
        <div onClick={()=>navigate("/lk/machines")} style={{ position:"relative", overflow:"hidden", background:"#1a1612", cursor:"pointer", border:"1px solid #2a2420" }}
          onMouseEnter={e=>(e.currentTarget as HTMLElement).style.borderColor="#e84e00"}
          onMouseLeave={e=>(e.currentTarget as HTMLElement).style.borderColor="#2a2420"}
        >
          <img src={primaryCar.img} alt="" style={{ width:"100%", height:200, objectFit:"cover", opacity:0.45, display:"block" }}/>
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(26,22,18,0.95) 0%, rgba(26,22,18,0.2) 70%)" }}/>
          <div style={{ position:"absolute", left:0, top:0, bottom:0, width:4, background:primaryCar.color }}/>
          <div style={{ position:"absolute", top:16, left:20 }}>
            <span style={{ background:"#e84e00", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:8, letterSpacing:"0.22em", textTransform:"uppercase", color:"#fff", padding:"3px 10px" }}>✦ Основная машина</span>
          </div>
          <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"16px 20px" }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:26, letterSpacing:"0.04em", textTransform:"uppercase", color:"#fff", lineHeight:1, marginBottom:4 }}>{primaryCar.brand} {primaryCar.model}</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(255,255,255,0.45)" }}>{primaryCar.year} · {primaryCar.plate} · {primaryCar.engine}</div>
            <div style={{ marginTop:12, display:"flex", gap:8 }}>
              {[
                { l:"Записей в журнале", v:"6" },
                { l:"Потрачено", v:"89 500 ₽" },
              ].map(s=>(
                <div key={s.l} style={{ flex:1, background:"rgba(255,255,255,0.07)", padding:"8px 12px" }}>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:7, letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(255,255,255,0.35)", marginBottom:3 }}>{s.l}</div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:18, color:"#e84e00" }}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* quick stats 2×2 */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          {[
            { label:"Маршрутов пройдено", value:"23", sub:"+3 в этом месяце", color:"#e84e00", icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h12"/></svg> },
            { label:"Км офф-роуд", value:"4 812", sub:"Суммарный пробег", color:"#2d5a3d", icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg> },
            { label:"Мои клубы", value:"2", sub:"Активный участник", color:"#8b3a1a", icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
            { label:"Рейтинг",   value:"4.8 ★", sub:"Ветеран сообщества", color:"#d4820a", icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
          ].map(s=>(
            <div key={s.label} style={{ background:"#fff", border:"1px solid #e5e0d8", padding:"20px 20px" }}>
              <div style={{ color:s.color, marginBottom:12 }}>{s.icon}</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:28, color:"#1a1612", lineHeight:1, marginBottom:4 }}>{s.value}</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", color:"#1a1612", marginBottom:3 }}>{s.label}</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.08em", color:"#aaa49e" }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* achievements preview */}
      <div style={{ background:"#fff", border:"1px solid #e5e0d8" }}>
        <div style={{ padding:"18px 20px", borderBottom:"1px solid #f0ece8", display:"flex", alignItems:"center", justifyContent:"space-between", gap:20 }}>
          <div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.28em", textTransform:"uppercase", color:"#e84e00", marginBottom:3, fontWeight:700 }}>Прогресс профиля</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:20, letterSpacing:"0.06em", textTransform:"uppercase", color:"#1a1612" }}>Последние достижения</div>
          </div>
          <button onClick={()=>navigate("/lk/achievements")} style={{ padding:"10px 16px", border:"1px solid #e84e00", background:"transparent", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", color:"#e84e00", whiteSpace:"nowrap" }}>Все достижения →</button>
        </div>
        <div>
          {ACHIEVEMENTS.filter(item=>item.earned).slice(0,3).map((item,index)=>(
            <div key={item.id} style={{ padding:"15px 20px", display:"flex", gap:16, alignItems:"center", borderBottom:index<2?"1px solid #f0ece8":"none" }}>
              <AchievementIcon type={item.icon}/>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:15, letterSpacing:"0.04em", textTransform:"uppercase", color:"#1a1612", marginBottom:4 }}>{item.title}</div>
                <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:11, lineHeight:1.45, color:"#8c8480", marginBottom:5 }}>{item.description}</div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.12em", textTransform:"uppercase", color:"#e84e00" }}>{item.category}</div>
              </div>
              <div className="hidden sm:block" style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:"#aaa49e", whiteSpace:"nowrap" }}>Получено {item.earnedAt}</div>
            </div>
          ))}
        </div>
      </div>

      {/* middle row: recent journal + upcoming events */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:16 }}>

        {/* recent journal */}
        <div>
          <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:14 }}>
            <div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.28em", textTransform:"uppercase", color:"#e84e00", marginBottom:3, fontWeight:700 }}>Активность</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:20, letterSpacing:"0.06em", textTransform:"uppercase", color:"#1a1612" }}>Последние записи журнала</div>
            </div>
            <button onClick={()=>navigate("/lk/machines")} style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:"#e84e00", background:"none", border:"none", cursor:"pointer", padding:0 }}>Все записи →</button>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:0, border:"1px solid #e5e0d8", background:"#fff", overflow:"hidden" }}>
            {RECENT_JOURNAL.map((entry, i)=>(
              <div key={entry.id} style={{ display:"flex", gap:0, borderBottom: i < RECENT_JOURNAL.length-1 ? "1px solid #f5f1ed":"none", cursor:"pointer", transition:"background 0.12s" }}
                onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background="#fdf9f6"}
                onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background="#fff"}
              >
                <div style={{ width:4, background:entry.categoryColor, flexShrink:0 }}/>
                <div style={{ width:80, flexShrink:0, overflow:"hidden", background:"#f5f2ee" }}>
                  <img src={entry.img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
                </div>
                <div style={{ flex:1, padding:"12px 16px", minWidth:0 }}>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:13, letterSpacing:"0.04em", textTransform:"uppercase", color:"#1a1612", marginBottom:3, lineHeight:1.2 }}>{entry.title}</div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:"#aaa49e", marginBottom:0 }}>{entry.carName}</div>
                </div>
                <div style={{ padding:"12px 16px", display:"flex", flexDirection:"column", alignItems:"flex-end", justifyContent:"center", gap:4, flexShrink:0 }}>
                  <span style={{ background:entry.categoryColor+"18", border:`1px solid ${entry.categoryColor}44`, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:8, letterSpacing:"0.16em", textTransform:"uppercase", color:entry.categoryColor, padding:"2px 8px" }}>{entry.category}</span>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.1em", color:"#c0b9b0" }}>{entry.date}</span>
                  {entry.cost && <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, color:"#e84e00" }}>{entry.cost.toLocaleString("ru")} ₽</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* upcoming events */}
        <div>
          <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:14 }}>
            <div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.28em", textTransform:"uppercase", color:"#e84e00", marginBottom:3, fontWeight:700 }}>Календарь</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:20, letterSpacing:"0.06em", textTransform:"uppercase", color:"#1a1612" }}>Ближайшие события</div>
            </div>
            <button onClick={()=>navigate("/lk/events")} style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:"#e84e00", background:"none", border:"none", cursor:"pointer", padding:0 }}>Все →</button>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {UPCOMING_EVENTS.map(ev=>(
              <div key={ev.id} style={{ background:"#fff", border:"1px solid #e5e0d8", display:"flex", gap:0, overflow:"hidden", cursor:"pointer" }}
                onMouseEnter={e=>(e.currentTarget as HTMLElement).style.borderColor="#e84e00"}
                onMouseLeave={e=>(e.currentTarget as HTMLElement).style.borderColor="#e5e0d8"}
              >
                <div style={{ width:80, flexShrink:0, overflow:"hidden", background:"#f5f2ee" }}>
                  <img src={ev.img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
                </div>
                <div style={{ flex:1, padding:"12px 14px", minWidth:0 }}>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:12, letterSpacing:"0.04em", textTransform:"uppercase", color:"#1a1612", lineHeight:1.2, marginBottom:4 }}>{ev.title}</div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:"#aaa49e", marginBottom:6 }}>📍 {ev.location}</div>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:"#1a1612" }}>{ev.date}</span>
                    <span style={{ background: ev.status==="Записан" ? "#e84e00" : "#f5f2ee", border: ev.status==="Записан" ? "none" : "1px solid #e0dbd4", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:8, letterSpacing:"0.16em", textTransform:"uppercase", color: ev.status==="Записан" ? "#fff" : "#8c8480", padding:"3px 9px" }}>{ev.status}</span>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={()=>navigate("/events")} style={{ padding:"11px 0", border:"1px dashed #d6d0c8", background:"transparent", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", color:"#aaa49e" }}>+ Найти события</button>
          </div>
        </div>
      </div>

      {/* bottom row: recent orders */}
      <div>
        <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:14 }}>
          <div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.28em", textTransform:"uppercase", color:"#e84e00", marginBottom:3, fontWeight:700 }}>Маркетплейс</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:20, letterSpacing:"0.06em", textTransform:"uppercase", color:"#1a1612" }}>Последние заказы</div>
          </div>
          <button onClick={()=>navigate("/lk/purchases")} style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:"#e84e00", background:"none", border:"none", cursor:"pointer", padding:0 }}>Все заказы →</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {RECENT_ORDERS.map(order=>(
            <div key={order.id} style={{ background:"#fff", border:"1px solid #e5e0d8", display:"flex", gap:0, overflow:"hidden", cursor:"pointer" }}
              onMouseEnter={e=>(e.currentTarget as HTMLElement).style.borderColor="#e84e00"}
              onMouseLeave={e=>(e.currentTarget as HTMLElement).style.borderColor="#e5e0d8"}
            >
              <div style={{ width:64, height:64, flexShrink:0, overflow:"hidden", background:"#f5f2ee" }}>
                <img src={order.img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
              </div>
              <div style={{ flex:1, padding:"10px 14px", minWidth:0 }}>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:12, letterSpacing:"0.04em", textTransform:"uppercase", color:"#1a1612", lineHeight:1.2, marginBottom:3 }}>{order.name}</div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:14, color:"#e84e00", marginBottom:3 }}>{order.price.toLocaleString("ru")} ₽</div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.1em", color:"#c0b9b0" }}>{order.date}</span>
                  <span style={{ background: order.status==="Доставляется" ? "#fff8ec" : "#f0faf4", border: order.status==="Доставляется" ? "1px solid #f5c842" : "1px solid #a3d9b1", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:8, letterSpacing:"0.14em", textTransform:"uppercase", color: order.status==="Доставляется" ? "#d4820a" : "#2d7a47", padding:"2px 8px" }}>{order.status}</span>
                </div>
              </div>
            </div>
          ))}
          <div style={{ gridColumn:"1/-1", textAlign:"center" }}>
            <button onClick={()=>navigate("/catalog")} style={{ padding:"11px 32px", border:"none", background:"#e84e00", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:"#fff" }}>В каталог</button>
          </div>
        </div>
      </div>

    </div>
  );
}

// ── Achievements Section ──────────────────────────────────────

function AchievementsSection() {
  const [filter,setFilter] = useState("Все");
  const categories = ["Все","Маршруты","События","Сообщество","Гараж"];
  const earnedCount = ACHIEVEMENTS.filter(item=>item.earned).length;
  const visible = filter==="Все" ? ACHIEVEMENTS : ACHIEVEMENTS.filter(item=>item.category===filter);

  return (
    <div style={{ paddingTop:32 }}>
      <div style={{ marginBottom:24, display:"flex", alignItems:"flex-end", justifyContent:"space-between", gap:24 }}>
        <div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.28em", textTransform:"uppercase", color:"#e84e00", marginBottom:5, fontWeight:700 }}>Личный прогресс</div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:30, letterSpacing:"0.05em", textTransform:"uppercase", color:"#1a1612", lineHeight:1 }}>Достижения</div>
          <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:13, color:"#8c8480", marginTop:8 }}>Отмечаем каждый важный этап вашего пути вне асфальта.</div>
        </div>
        <div style={{ minWidth:250, background:"#fff", border:"1px solid #e5e0d8", padding:"14px 16px" }}>
          <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:9 }}>
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:22, color:"#e84e00" }}>{earnedCount} / {ACHIEVEMENTS.length}</span>
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase", color:"#8c8480" }}>Открыто</span>
          </div>
          <div style={{ height:5, background:"#ece8e3" }}>
            <div style={{ width:`${earnedCount/ACHIEVEMENTS.length*100}%`, height:"100%", background:"#e84e00" }}/>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto" style={{ display:"flex", gap:6, marginBottom:18 }}>
        {categories.map(category=>(
          <button key={category} onClick={()=>setFilter(category)}
            style={{ padding:"9px 16px", border:filter===category?"1px solid #e84e00":"1px solid #d6d0c8", background:filter===category?"#e84e00":"transparent", color:filter===category?"#fff":"#6b6357", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.14em", textTransform:"uppercase", whiteSpace:"nowrap" }}
          >
            {category}
          </button>
        ))}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
        {[
          { title:"Полученные достижения", items:visible.filter(item=>item.earned) },
          { title:"Ещё предстоит открыть", items:visible.filter(item=>!item.earned) },
        ].filter(group=>group.items.length>0).map(group=>(
          <div key={group.title}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:9 }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"#6b6357" }}>{group.title}</div>
              <div style={{ height:1, background:"#d6d0c8", flex:1 }}/>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, color:"#aaa49e" }}>{group.items.length}</span>
            </div>
            <div style={{ borderTop:"1px solid #e5e0d8" }}>
              {group.items.map(item=>{
                const percent = Math.min(100,Math.round(item.progress/item.goal*100));
                return (
                  <div key={item.id} className="flex-col sm:flex-row sm:items-center" style={{ background:"#fff", borderBottom:"1px solid #e5e0d8", borderLeft:item.earned?"3px solid #e84e00":"3px solid #d6d0c8", padding:"14px 18px", display:"flex", gap:16, opacity:item.earned?1:0.86 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:16, flex:1, minWidth:0 }}>
                      <AchievementIcon type={item.icon} earned={item.earned}/>
                      <div style={{ minWidth:0 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:4 }}>
                          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:18, letterSpacing:"0.04em", textTransform:"uppercase", color:"#1a1612" }}>{item.title}</div>
                          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:8, letterSpacing:"0.15em", textTransform:"uppercase", color:item.earned?"#e84e00":"#8c8480" }}>{item.category}</span>
                        </div>
                        <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:12, lineHeight:1.5, color:"#8c8480" }}>{item.description}</div>
                      </div>
                    </div>
                    <div style={{ width:220, maxWidth:"100%", flexShrink:0 }}>
                      {item.earned ? (
                        <div className="sm:text-right">
                          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:"#e84e00", marginBottom:4 }}>Достижение получено</div>
                          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:"#aaa49e" }}>{item.earnedAt}</div>
                        </div>
                      ) : item.trackProgress ? (
                        <>
                          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
                            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:"#6b6357" }}>{item.progress} из {item.goal} {item.unit}</span>
                            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:10, color:"#e84e00" }}>{percent}%</span>
                          </div>
                          <div style={{ height:4, background:"#ece8e3" }}><div style={{ width:`${percent}%`, height:"100%", background:"#e84e00" }}/></div>
                        </>
                      ) : (
                        <div className="sm:text-right" style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:"#aaa49e" }}>Пока не открыто</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Machines Section ──────────────────────────────────────────

function MachinesSection() {
  const [cars,setCars] = useState<Car[]>(INIT_CARS);
  const [journal,setJournal] = useState<JournalEntry[]>(INIT_JOURNAL);
  const [showModal,setShowModal] = useState(false);
  const [detailCarId,setDetailCarId] = useState<number|null>(null);

  const addCar = (data:Omit<Car,"id"|"primary">) => {
    const id = Math.max(0,...cars.map(c=>c.id))+1;
    setCars(prev=>[...prev,{...data,id,primary:prev.length===0}]);
  };
  const deleteCar = (id:number) => setCars(prev=>{ const next=prev.filter(c=>c.id!==id); if(next.length>0&&!next.some(c=>c.primary)) next[0]={...next[0],primary:true}; return next; });
  const setPrimary = (id:number) => setCars(prev=>prev.map(c=>({...c,primary:c.id===id})));
  const addJournalEntry = (e:JournalEntry) => setJournal(prev=>[e,...prev]);

  const detailCar = cars.find(c=>c.id===detailCarId);

  if (detailCar) {
    return (
      <CarDetail
        car={detailCar}
        journal={journal.filter(e=>e.carId===detailCar.id)}
        onBack={()=>setDetailCarId(null)}
        onAddJournal={addJournalEntry}
      />
    );
  }

  return (
    <>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.26em", textTransform:"uppercase", color:"#e84e00", marginBottom:4 }}>Гараж</div>
          <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:32, letterSpacing:"0.06em", textTransform:"uppercase", color:"#1a1612", lineHeight:1, margin:0 }}>Мои машины</h2>
        </div>
        <button onClick={()=>setShowModal(true)} style={{ display:"flex", alignItems:"center", gap:8, padding:"11px 20px", background:"#e84e00", border:"none", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, letterSpacing:"0.14em", textTransform:"uppercase", color:"#fff" }}>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5"><path d="M6 1v10M1 6h10" strokeLinecap="round"/></svg>
          Добавить
        </button>
      </div>

      {cars.length===0 ? (
        <div style={{ background:"#fff", border:"2px dashed #d6d0c8", padding:"60px 24px", display:"flex", flexDirection:"column", alignItems:"center", gap:16, textAlign:"center" }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="#d6d0c8" strokeWidth="1.5"><rect x="4" y="14" width="40" height="24" rx="2"/><circle cx="13" cy="38" r="4"/><circle cx="35" cy="38" r="4"/><path d="M4 22h40M14 14l4-6h12l4 6" strokeLinecap="round"/></svg>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:18, letterSpacing:"0.06em", textTransform:"uppercase", color:"#1a1612" }}>Гараж пуст</div>
          <button onClick={()=>setShowModal(true)} style={{ padding:"10px 22px", background:"#e84e00", border:"none", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, letterSpacing:"0.14em", textTransform:"uppercase", color:"#fff" }}>Добавить машину</button>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:20 }}>
          {cars.map(car=>(
            <CarCard key={car.id} car={car} onDelete={deleteCar} onSetPrimary={setPrimary} onClick={()=>setDetailCarId(car.id)}/>
          ))}
          <button onClick={()=>setShowModal(true)} style={{ border:"2px dashed #d6d0c8", background:"transparent", cursor:"pointer", minHeight:220, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12, transition:"border-color 0.15s" }}
            onMouseEnter={e=>{ (e.currentTarget as HTMLButtonElement).style.borderColor="#e84e00"; }}
            onMouseLeave={e=>{ (e.currentTarget as HTMLButtonElement).style.borderColor="#d6d0c8"; }}
          >
            <div style={{ width:44, height:44, border:"2px solid #d6d0c8", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="#d6d0c8" strokeWidth="2"><path d="M6 1v10M1 6h10" strokeLinecap="round"/></svg>
            </div>
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, letterSpacing:"0.14em", textTransform:"uppercase", color:"#aaa49e" }}>Добавить машину</span>
          </button>
        </div>
      )}
      {showModal && <AddCarModal onClose={()=>setShowModal(false)} onAdd={addCar}/>}
    </>
  );
}

// ── Dots Menu ────────────────────────────────────────────────

function DotsMenu({ items, dark }: { items: { label: string; danger?: boolean; onClick: () => void }[]; dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position:"relative", flexShrink:0 }}>
      <button
        onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
        style={{ width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center", border: dark ? "1px solid rgba(255,255,255,0.18)" : "1px solid #e5e0d8", background: open ? (dark ? "rgba(255,255,255,0.12)" : "#f5f2ee") : "transparent", cursor:"pointer", borderRadius:2, transition:"background 0.12s", flexShrink:0 }}
        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = dark ? "rgba(255,255,255,0.12)" : "#f5f2ee"}
        onMouseLeave={e => { if (!open) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
      >
        <svg width="14" height="4" viewBox="0 0 14 4" fill={dark ? "rgba(255,255,255,0.7)" : "#6b6357"}><circle cx="2" cy="2" r="1.5"/><circle cx="7" cy="2" r="1.5"/><circle cx="12" cy="2" r="1.5"/></svg>
      </button>
      {open && (
        <div style={{ position:"absolute", right:0, top:"calc(100% + 4px)", background:"#fff", border:"1px solid #e5e0d8", boxShadow:"0 6px 20px rgba(26,22,18,0.12)", zIndex:100, minWidth:160, overflow:"hidden" }}>
          {items.map((item, i) => (
            <button key={i} onClick={e => { e.stopPropagation(); setOpen(false); item.onClick(); }}
              style={{ display:"block", width:"100%", padding:"9px 16px", border:"none", borderBottom: i < items.length - 1 ? "1px solid #f5f1ed" : "none", background:"transparent", cursor:"pointer", textAlign:"left", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:600, fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color: item.danger ? "#c0392b" : "#1a1612", transition:"background 0.1s" }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = item.danger ? "#fff5f5" : "#faf8f5"}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "transparent"}
            >{item.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Review Modal ─────────────────────────────────────────────

function ReviewModal({ eventTitle, onClose, onSubmit }: { eventTitle: string; onClose: () => void; onSubmit: () => void }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({ rating: false, text: false });

  const TAGS = ["Отличная организация","Сложные трассы","Дружная атмосфера","Красивая природа","Хорошая техподдержка","Советую новичкам","Только для опытных","Буду снова"];

  const toggleTag = (t: string) => setTags(ts => ts.includes(t) ? ts.filter(x=>x!==t) : [...ts, t]);

  const submit = () => {
    const e = { rating: rating === 0, text: text.trim().length < 10 };
    if (e.rating || e.text) { setErrors(e); return; }
    setSubmitted(true);
    setTimeout(onSubmit, 1800);
  };

  const inpStyle: React.CSSProperties = { width:"100%", padding:"11px 14px", border:"1px solid #e0dbd4", outline:"none", fontFamily:"'Barlow',sans-serif", fontSize:14, color:"#1a1612", background:"#fff", boxSizing:"border-box", resize:"none" };

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:300, background:"rgba(10,8,6,0.72)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#fff", width:"100%", maxWidth:480, maxHeight:"92vh", overflowY:"auto", position:"relative" }}>

        {/* header */}
        <div style={{ background:"#1a1612", padding:"20px 24px", position:"relative" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"#e84e00" }}/>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.28em", textTransform:"uppercase", color:"rgba(255,255,255,0.38)", marginBottom:3 }}>Отзыв об событии</div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:20, letterSpacing:"0.04em", textTransform:"uppercase", color:"#fff", lineHeight:1.1, paddingRight:32 }}>{eventTitle}</div>
          <button onClick={onClose} style={{ position:"absolute", top:16, right:18, background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.45)", fontSize:20, lineHeight:1, padding:4 }}
            onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.color="#fff"}
            onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.color="rgba(255,255,255,0.45)"}
          >✕</button>
        </div>

        {submitted ? (
          <div style={{ padding:"48px 24px", textAlign:"center" }}>
            <div style={{ width:56, height:56, background:"#3a9e5f", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
              <svg width="24" height="18" viewBox="0 0 26 20" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 10l7 7L24 2"/></svg>
            </div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:22, letterSpacing:"0.06em", textTransform:"uppercase", color:"#1a1612", marginBottom:8 }}>Спасибо за отзыв!</div>
            <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:14, color:"#aaa49e", lineHeight:1.6 }}>Ваш отзыв поможет другим участникам сообщества.</div>
          </div>
        ) : (
          <div style={{ padding:"20px 24px 24px", display:"flex", flexDirection:"column", gap:16 }}>

            {/* star rating */}
            <div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.24em", textTransform:"uppercase", color: errors.rating?"#e84e00":"#aaa49e", marginBottom:10 }}>
                Оценка {errors.rating && <span style={{ fontWeight:400 }}>— обязательно</span>}
              </div>
              <div style={{ display:"flex", gap:6 }}>
                {[1,2,3,4,5].map(n=>(
                  <button key={n}
                    onClick={()=>{ setRating(n); setErrors(e=>({...e,rating:false})); }}
                    onMouseEnter={()=>setHover(n)}
                    onMouseLeave={()=>setHover(0)}
                    style={{ background:"none", border:"none", cursor:"pointer", padding:2, fontSize:0 }}
                  >
                    <svg width="36" height="34" viewBox="0 0 24 22" fill={n<=(hover||rating)?"#e84e00":"#e8e2da"} style={{ transition:"fill 0.1s, transform 0.1s", transform: n<=(hover||rating)?"scale(1.15)":"scale(1)", display:"block" }}>
                      <path d="M12 2l2.9 6.3 6.8.6-5 4.7 1.5 6.8L12 17l-6.2 3.4 1.5-6.8-5-4.7 6.8-.6z"/>
                    </svg>
                  </button>
                ))}
                {rating > 0 && (
                  <div style={{ marginLeft:8, display:"flex", alignItems:"center", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:18, color:"#e84e00" }}>
                    {["","Плохо","Слабо","Нормально","Хорошо","Отлично!"][rating]}
                  </div>
                )}
              </div>
            </div>

            {/* tags */}
            <div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.24em", textTransform:"uppercase", color:"#aaa49e", marginBottom:10 }}>Что понравилось</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {TAGS.map(t=>{
                  const sel = tags.includes(t);
                  return (
                    <button key={t} onClick={()=>toggleTag(t)} style={{ padding:"5px 12px", border:`1px solid ${sel?"#e84e00":"#e0dbd4"}`, background:sel?"#fff9f7":"transparent", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase", color:sel?"#e84e00":"#8c8480", transition:"all 0.12s" }}>
                      {sel && "✓ "}{t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* text */}
            <div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.24em", textTransform:"uppercase", color:errors.text?"#e84e00":"#aaa49e", marginBottom:8 }}>
                Отзыв {errors.text && <span style={{ fontWeight:400 }}>— минимум 10 символов</span>}
              </div>
              <textarea value={text} onChange={e=>{ setText(e.target.value); setErrors(er=>({...er,text:false})); }} rows={4}
                placeholder="Расскажите о своих впечатлениях — трассы, организация, атмосфера…"
                style={{ ...inpStyle, borderColor: errors.text?"#e84e00":"#e0dbd4" }}
                onFocus={e=>(e.target as HTMLTextAreaElement).style.borderColor="#e84e00"}
                onBlur={e=>(e.target as HTMLTextAreaElement).style.borderColor=errors.text?"#e84e00":"#e0dbd4"}
              />
              <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:11, color:"#c0b9b0", marginTop:4, textAlign:"right" }}>{text.length} символов</div>
            </div>

            <button onClick={submit} style={{ padding:"13px 0", background:"#e84e00", border:"none", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, letterSpacing:"0.16em", textTransform:"uppercase", color:"#fff" }}>
              Опубликовать отзыв
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Events Section ────────────────────────────────────────────

const STATUS_META: Record<string,{ color:string; bg:string; label:string }> = {
  "Записан":  { color:"#fff",     bg:"#3a9e5f", label:"Записан" },
  "Завершено":{ color:"#6b6357", bg:"#ece8e3", label:"Завершено" },
  "Отменён":  { color:"#fff",     bg:"#c0392b", label:"Отменён" },
};

function EventDetail({ ev, onBack }: { ev: LKEvent; onBack: () => void }) {
  const sm = STATUS_META[ev.status];
  const fillPct = ev.participants && ev.maxParticipants ? Math.round(ev.participants / ev.maxParticipants * 100) : null;
  const isOrg = ev.role === "organizer";
  const [showReview, setShowReview] = useState(false);
  const [reviewDone, setReviewDone] = useState(false);

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", padding:"10px 0", borderBottom:"1px solid #f5f1ed" }}>
      <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:"#aaa49e" }}>{label}</span>
      <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, letterSpacing:"0.06em", textTransform:"uppercase", color:"#1a1612" }}>{value}</span>
    </div>
  );

  return (
    <>
      {/* back */}
      <button onClick={onBack} style={{ display:"flex", alignItems:"center", gap:8, background:"none", border:"none", cursor:"pointer", padding:0, marginBottom:20, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:"#aaa49e" }}
        onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.color="#e84e00"}
        onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.color="#aaa49e"}
      >
        <svg width="14" height="10" viewBox="0 0 14 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M13 6H1M6 1L1 6l5 5"/></svg>
        Все события
      </button>

      {/* hero */}
      <div style={{ position:"relative", height:260, overflow:"hidden", background:"#1a1612", marginBottom:24 }}>
        <img src={ev.img} alt={ev.title} style={{ width:"100%", height:"100%", objectFit:"cover", opacity:0.45 }}/>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(10,8,6,0.92) 0%, rgba(10,8,6,0.3) 100%)" }}/>
        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:4, background:ev.typeColor }}/>
        <div style={{ position:"absolute", inset:0, padding:"28px 32px", display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
          <div style={{ display:"flex", gap:8, marginBottom:12 }}>
            <span style={{ background:ev.typeColor, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:"#fff", padding:"3px 10px" }}>{ev.type}</span>
            <span style={{ background:sm.bg, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:sm.color, padding:"3px 10px" }}>{sm.label}</span>
            {isOrg && <span style={{ background:"#e84e00", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:"#fff", padding:"3px 10px" }}>Организатор</span>}
          </div>
          <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:"clamp(24px,4vw,42px)", letterSpacing:"0.04em", textTransform:"uppercase", color:"#fff", lineHeight:1, margin:"0 0 8px" }}>{ev.title}</h2>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(255,255,255,0.5)" }}>{ev.date} · {ev.location}</div>
        </div>
      </div>

      {/* body */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:20, alignItems:"start" }}>
        {/* left */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

          {/* details card */}
          <div style={{ background:"#fff", border:"1px solid #ece8e3", padding:"22px 24px" }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:13, letterSpacing:"0.2em", textTransform:"uppercase", color:"#1a1612", marginBottom:4 }}>Детали события</div>
            <InfoRow label="Дата" value={ev.date}/>
            <InfoRow label="Место" value={ev.location}/>
            <InfoRow label="Формат" value={ev.type}/>
            <InfoRow label="Статус" value={sm.label}/>
            <InfoRow label="Роль" value={isOrg ? "Организатор" : "Участник"}/>
          </div>

          {/* organizer: participants */}
          {isOrg && fillPct !== null && (
            <div style={{ background:"#fff", border:"1px solid #ece8e3", padding:"22px 24px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:16 }}>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:13, letterSpacing:"0.2em", textTransform:"uppercase", color:"#1a1612" }}>Участники</div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:22, color: fillPct>=90?"#e84e00":"#3a9e5f" }}>{ev.participants}<span style={{ fontWeight:400, fontSize:14, color:"#c0b9b0" }}>/{ev.maxParticipants}</span></div>
              </div>
              <div style={{ height:6, background:"#f0ece8", marginBottom:8 }}>
                <div style={{ height:"100%", width:`${fillPct}%`, background:fillPct>=90?"#e84e00":"#3a9e5f", transition:"width 0.4s" }}/>
              </div>
              <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:12, color:"#aaa49e" }}>{fillPct}% мест занято{fillPct>=90?" — почти заполнено":""}</div>
              <div style={{ marginTop:16, display:"flex", gap:8 }}>
                <button style={{ flex:1, padding:"9px 0", border:"1px solid #e5e0d8", background:"transparent", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:"#6b6357" }}>Список участников</button>
                <button style={{ flex:1, padding:"9px 0", border:"none", background:"#e84e00", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:"#fff" }}>Написать всем</button>
              </div>
            </div>
          )}

          {/* participant: actions */}
          {!isOrg && (
            <div style={{ background:"#fff", border:"1px solid #ece8e3", padding:"22px 24px" }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:13, letterSpacing:"0.2em", textTransform:"uppercase", color:"#1a1612", marginBottom:16 }}>Действия</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {ev.status==="Записан" && <button style={{ padding:"11px 0", border:"none", background:"#e84e00", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.14em", textTransform:"uppercase", color:"#fff" }}>Связаться с организатором</button>}
                {ev.status==="Завершено" && !reviewDone && (
                  <button onClick={()=>setShowReview(true)} style={{ padding:"11px 0", border:"none", background:"#1a1612", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.14em", textTransform:"uppercase", color:"#fff" }}>Оставить отзыв</button>
                )}
                {reviewDone && (
                  <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", background:"#f0faf5", border:"1px solid #b6e0c8" }}>
                    <svg width="14" height="11" viewBox="0 0 16 12" fill="none" stroke="#3a9e5f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 6l5 5L15 1"/></svg>
                    <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:"#3a9e5f" }}>Отзыв опубликован</span>
                  </div>
                )}
                {ev.status==="Записан" && <button style={{ padding:"11px 0", border:"1px solid #ffd0c0", background:"transparent", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.14em", textTransform:"uppercase", color:"#e84e00" }}>Отменить участие</button>}
              </div>
            </div>
          )}
        </div>

        {/* right */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {/* organizer actions */}
          {isOrg && (
            <div style={{ background:"#1a1612", padding:"22px 22px" }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"#e84e00" }}/>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:12, letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(255,255,255,0.5)", marginBottom:14 }}>Управление</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                <button style={{ padding:"10px 0", border:"none", background:"#e84e00", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:"#fff" }}>Редактировать событие</button>
                <button style={{ padding:"10px 0", border:"1px solid rgba(255,255,255,0.15)", background:"transparent", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:"rgba(255,255,255,0.7)" }}>Написать участникам</button>
                {ev.status==="Записан" && <button style={{ padding:"10px 0", border:"1px solid rgba(192,57,43,0.4)", background:"transparent", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:"#e57368" }}>Отменить событие</button>}
              </div>
            </div>
          )}

          {/* status card */}
          <div style={{ background:"#fff", border:"1px solid #ece8e3", padding:"18px 20px" }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"#aaa49e", marginBottom:10 }}>Статус записи</div>
            <div style={{ display:"inline-block", background:sm.bg, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.16em", textTransform:"uppercase", color:sm.color, padding:"6px 16px", marginBottom:10 }}>{sm.label}</div>
            {ev.status==="Записан" && <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:12, color:"#aaa49e", lineHeight:1.6, margin:0 }}>Вы записаны на это событие. Следите за обновлениями в уведомлениях.</p>}
            {ev.status==="Завершено" && <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:12, color:"#aaa49e", lineHeight:1.6, margin:0 }}>Событие завершено. Поделитесь впечатлениями — оставьте отзыв.</p>}
            {ev.status==="Отменён" && <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:12, color:"#aaa49e", lineHeight:1.6, margin:0 }}>Это событие было отменено.</p>}
          </div>

          {/* share */}
          <div style={{ background:"#fff", border:"1px solid #ece8e3", padding:"18px 20px" }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"#aaa49e", marginBottom:10 }}>Поделиться</div>
            <button style={{ width:"100%", padding:"9px 0", border:"1px solid #e5e0d8", background:"transparent", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:"#6b6357" }}>Скопировать ссылку</button>
          </div>
        </div>
      </div>

      {showReview && (
        <ReviewModal
          eventTitle={ev.title}
          onClose={()=>setShowReview(false)}
          onSubmit={()=>{ setShowReview(false); setReviewDone(true); }}
        />
      )}
    </>
  );
}

function EventsSection() {
  const [events] = useState<LKEvent[]>(MY_EVENTS);
  const [tab, setTab] = useState<"participant"|"organizer">("participant");
  const [hoveredRow, setHoveredRow] = useState<number|null>(null);
  const [detailId, setDetailId] = useState<number|null>(null);

  const detail = events.find(e => e.id === detailId) ?? null;
  if (detail) return <EventDetail ev={detail} onBack={() => setDetailId(null)}/>;


  const list = events.filter(e=>e.role===tab);
  const upcoming = list.filter(e=>e.status==="Записан");
  const past = list.filter(e=>e.status!=="Записан");

  const participantCount = events.filter(e=>e.role==="participant").length;
  const organizerCount = events.filter(e=>e.role==="organizer").length;

  const colW = { thumb:"72px", date:"100px", type:"140px", location:"1fr", participants:"120px", status:"100px", actions:"120px" };
  const gridCols = tab === "organizer"
    ? [colW.thumb, colW.date, colW.type, colW.location, colW.participants, colW.status, colW.actions].join(" ")
    : [colW.thumb, colW.date, colW.type, colW.location, colW.status, colW.actions].join(" ");
  const headerLabels = tab === "organizer"
    ? ["","Дата","Тип","Название и место","Участники","Статус","Действия"]
    : ["","Дата","Тип","Название и место","Статус","Действия"];

  const TableRow = ({ ev, isHeader }: { ev?:LKEvent; isHeader?:boolean }) => {
    if (isHeader) return (
      <div style={{ display:"grid", gridTemplateColumns:gridCols, gap:0, background:"#faf8f5", borderBottom:"1px solid #ece8e3", alignItems:"center" }}>
        {headerLabels.map((h,i)=>(
          <div key={i} style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.22em", textTransform:"uppercase", color:"#aaa49e", padding: i===0 ? "8px 0" : "8px 8px" }}>{h}</div>
        ))}
      </div>
    );
    if (!ev) return null;
    const sm = STATUS_META[ev.status];
    const fillPct = ev.participants && ev.maxParticipants ? Math.round(ev.participants/ev.maxParticipants*100) : null;
    const isHovered = hoveredRow === ev.id;
    return (
      <div
        onMouseEnter={()=>setHoveredRow(ev.id)}
        onMouseLeave={()=>setHoveredRow(null)}
        onClick={()=>setDetailId(ev.id)}
        style={{ display:"grid", gridTemplateColumns:gridCols, gap:0, borderBottom:"1px solid #f5f1ed", background:isHovered?"#fdf9f6":"#fff", transition:"background 0.12s", alignItems:"center", minHeight:64, cursor:"pointer" }}
      >
        {/* thumbnail */}
        <div style={{ width:"100%", height:64, overflow:"hidden", position:"relative", flexShrink:0 }}>
          <img src={ev.img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", opacity: ev.status==="Отменён" ? 0.35 : isHovered ? 0.9 : 0.7, transition:"opacity 0.2s, transform 0.3s", transform:isHovered?"scale(1.08)":"scale(1)" }}/>
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right,rgba(26,22,18,0.3),transparent)" }}/>
          <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:ev.typeColor }}/>
        </div>
        {/* date */}
        <div style={{ padding:"0 8px" }}>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, letterSpacing:"0.06em", color:"#1a1612" }}>{ev.date.split(" ").slice(0,2).join(" ")}</div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.08em", color:"#c0b9b0" }}>{ev.date.split(" ")[2]??""}</div>
        </div>
        {/* type */}
        <div style={{ padding:"0 8px" }}>
          <span style={{ background:ev.typeColor+"22", border:`1px solid ${ev.typeColor}55`, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", color:ev.typeColor, padding:"2px 8px" }}>{ev.type}</span>
        </div>
        {/* name + location */}
        <div style={{ padding:"0 8px", minWidth:0 }}>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:13, letterSpacing:"0.04em", textTransform:"uppercase", color:"#1a1612", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{ev.title}</div>
          <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:11, color:"#aaa49e", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", marginTop:1 }}>{ev.location}</div>
        </div>
        {/* participants (organizer only) */}
        {tab==="organizer" && (
          <div style={{ padding:"0 8px" }}>
            {fillPct!==null ? (
              <>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, color:"#1a1612", marginBottom:4 }}>{ev.participants}<span style={{ fontWeight:400, color:"#c0b9b0" }}>/{ev.maxParticipants}</span></div>
                <div style={{ height:3, background:"#f0ece8" }}>
                  <div style={{ height:"100%", width:`${fillPct}%`, background:fillPct>=90?"#e84e00":"#3a9e5f", transition:"width 0.3s" }}/>
                </div>
              </>
            ) : <span style={{ color:"#d6d0c8", fontSize:11 }}>—</span>}
          </div>
        )}
        {/* status */}
        <div style={{ padding:"0 8px" }}>
          <span style={{ background:sm.bg, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase", color:sm.color, padding:"3px 10px", display:"inline-block" }}>{sm.label}</span>
        </div>
        {/* actions */}
        <div onClick={e=>e.stopPropagation()} style={{ padding:"0 8px", display:"flex", alignItems:"center", justifyContent:"flex-end", opacity:isHovered?1:0.35, transition:"opacity 0.15s" }}>
          <DotsMenu items={[
            { label:"Открыть", onClick:()=>setDetailId(ev.id) },
            ...(tab==="organizer" && ev.status==="Записан" ? [{ label:"Редактировать", onClick:()=>{} }] : []),
            ...(tab==="organizer" ? [{ label:"Участники", onClick:()=>{} }] : []),
            ...(tab==="participant" && ev.status==="Записан" ? [{ label:"Отменить запись", danger:true, onClick:()=>{} }] : []),
            ...(ev.status==="Завершено" ? [{ label:"Оставить отзыв", onClick:()=>{} }] : []),
          ]}/>
        </div>
      </div>
    );
  };

  const TableBlock = ({ label, color, items }: { label:string; color:string; items:LKEvent[] }) =>
    items.length > 0 ? (
      <div>
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 20px", background:"#f5f2ee", borderBottom:"1px solid #ece8e3", borderTop:"1px solid #ece8e3" }}>
          <div style={{ width:3, height:14, background:color, flexShrink:0 }}/>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.22em", textTransform:"uppercase", color }}>{label}</span>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.12em", color:"#c0b9b0" }}>{items.length}</span>
        </div>
        {items.map(ev=><TableRow key={ev.id} ev={ev}/>)}
      </div>
    ) : null;

  return (
    <>
      {/* header */}
      <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.26em", textTransform:"uppercase", color:"#e84e00", marginBottom:4 }}>Участие</div>
          <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:32, letterSpacing:"0.06em", textTransform:"uppercase", color:"#1a1612", lineHeight:1, margin:0 }}>Мои события</h2>
        </div>
        <button style={{ display:"flex", alignItems:"center", gap:7, padding:"10px 18px", background:"#e84e00", border:"none", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.16em", textTransform:"uppercase", color:"#fff", flexShrink:0 }}>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"><path d="M6 1v10M1 6h10"/></svg>
          Добавить событие
        </button>
      </div>

      {/* tab switcher */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", border:"1px solid #ece8e3", marginBottom:24, background:"#fff" }}>
        {([
          { key:"participant", label:"Я участник", count:participantCount, icon:"🎯" },
          { key:"organizer",   label:"Мои созданные", count:organizerCount, icon:"⚡" },
        ] as const).map((t,i)=>(
          <button key={t.key} onClick={()=>setTab(t.key)} style={{ position:"relative", padding:"18px 24px", border:"none", borderRight:i===0?"1px solid #ece8e3":"none", background:tab===t.key?"#fff":"#faf8f5", cursor:"pointer", textAlign:"left", transition:"background 0.15s" }}>
            {tab===t.key && <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"#e84e00" }}/>}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:15, letterSpacing:"0.08em", textTransform:"uppercase", color:tab===t.key?"#1a1612":"#8c8480" }}>{t.icon} {t.label}</div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:"#aaa49e", marginTop:3 }}>{t.count} {t.count===1?"событие":t.count<5?"события":"событий"}</div>
              </div>
              {tab===t.key && <div style={{ width:8, height:8, borderRadius:"50%", background:"#e84e00" }}/>}
            </div>
          </button>
        ))}
      </div>

      {/* stats row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:0, marginBottom:24, border:"1px solid #ece8e3", background:"#fff" }}>
        {[
          { value:String(upcoming.length), label:"Предстоящих", color:"#e84e00" },
          { value:String(past.filter(e=>e.status==="Завершено").length), label:"Пройдено", color:"#3a9e5f" },
          { value:String(past.filter(e=>e.status==="Отменён").length), label:"Отменено", color:"#aaa49e" },
        ].map((s,i)=>(
          <div key={s.label} style={{ padding:"16px 24px", borderRight:i<2?"1px solid #ece8e3":"none", textAlign:"center" }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:34, color:s.color, lineHeight:1 }}>{s.value}</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:"#aaa49e", marginTop:3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {list.length===0 ? (
        <div style={{ textAlign:"center", padding:"60px 0", color:"#ccc5bf" }}>
          <div style={{ fontSize:32, marginBottom:12 }}>{tab==="organizer"?"⚡":"🎯"}</div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, letterSpacing:"0.1em", textTransform:"uppercase" }}>
            {tab==="organizer" ? "Вы ещё не создавали событий" : "Нет записей на события"}
          </div>
        </div>
      ) : (
        <div style={{ border:"1px solid #ece8e3", background:"#fff", overflow:"hidden" }}>
          <TableRow isHeader/>
          <TableBlock label="Предстоящие" color="#3a9e5f" items={upcoming}/>
          <TableBlock label="История" color="#aaa49e" items={past}/>
        </div>
      )}
    </>
  );
}

// ── Clubs Section ─────────────────────────────────────────────

type ClubEvent = { id:number; title:string; date:string; type:string; typeColor:string; participants:number; maxParticipants:number };

type FullClub = UserClub & {
  description: string;
  tags: string[];
  events: ClubEvent[];
};

const INIT_CLUBS: FullClub[] = [
  {
    id:1, name:"Стальные Волки", city:"Москва", role:"Участник", members:312, routes:47, joined:"Янв 2023",
    img:"https://images.unsplash.com/photo-1579271723430-d600366f032f?w=700&h=400&fit=crop&auto=format",
    accent:"#2d5a3d",
    description:"Крупнейший московский off-road клуб. Слёты по всей России, обучающие дни, экспедиции от Кольского до Алтая.",
    tags:["Слёты","Экспедиции","Обучение","Трофи"],
    events:[
      { id:1, title:"Осеннее бездорожье 2026", date:"2–4 сен 2026", type:"Слёт", typeColor:"#e84e00", participants:134, maxParticipants:200 },
      { id:2, title:"Учебный день — сентябрь", date:"21 сен 2026", type:"Обучение", typeColor:"#3a9e5f", participants:22, maxParticipants:30 },
    ],
  },
  {
    id:3, name:"Уральские Медведи", city:"Екатеринбург", role:"Участник", members:178, routes:29, joined:"Авг 2024",
    img:"https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=700&h=400&fit=crop&auto=format",
    accent:"#1a3a5c",
    description:"Уральский клуб любителей горного бездорожья. Маршруты по Уралу и Западной Сибири, зимние экспедиции.",
    tags:["Горы","Урал","Зима","Экспедиции"],
    events:[
      { id:5, title:"Урал Осень 2026", date:"12 окт 2026", type:"Слёт", typeColor:"#e84e00", participants:67, maxParticipants:100 },
    ],
  },
  {
    id:2, name:"Red Dust Club", city:"Краснодар", role:"Организатор", members:241, routes:56, joined:"Мар 2024",
    img:"https://images.unsplash.com/photo-1596507931135-75f699668356?w=700&h=400&fit=crop&auto=format",
    accent:"#8b3a1a",
    description:"Южный клуб со страстью к красной кубанской глине. Грязевые гонки, горные маршруты, Краснодар Mud Fest.",
    tags:["Грязь","Соревнования","Кубань","Кавказ"],
    events:[
      { id:3, title:"Краснодар Mud Fest 2026", date:"18 окт 2026", type:"Соревнование", typeColor:"#9b59b6", participants:88, maxParticipants:120 },
    ],
  },
];

const EVENT_TYPES = ["Слёт","Соревнование","Экспедиция","Обучение","Трофи","Другое"];
const EVENT_TYPE_COLORS: Record<string,string> = { "Слёт":"#e84e00","Соревнование":"#9b59b6","Экспедиция":"#d4820a","Обучение":"#3a9e5f","Трофи":"#1a2a3a","Другое":"#aaa49e" };
const ACCENTS = ["#2d5a3d","#8b3a1a","#1a2a3a","#e84e00","#9b59b6","#d4820a","#3a9e5f","#4c75a3"];

// ── Add Event Modal ───────────────────────────────────────────

type NewEvent = { title:string; date:string; location:string; type:string; maxParticipants:string; description:string };
const EMPTY_EV: NewEvent = { title:"", date:"", location:"", type:"Слёт", maxParticipants:"", description:"" };

function AddEventModal({ clubName, onClose, onAdd }: { clubName:string; onClose:()=>void; onAdd:(e:ClubEvent)=>void }) {
  const [form, setForm] = useState<NewEvent>(EMPTY_EV);
  const [errors, setErrors] = useState<Partial<NewEvent>>({});
  const set = (k:keyof NewEvent, v:string) => { setForm(f=>({...f,[k]:v})); setErrors(e=>({...e,[k]:""})); };

  const submit = () => {
    const e:Partial<NewEvent> = {};
    if(!form.title.trim()) e.title="Укажите название";
    if(!form.date.trim()) e.date="Укажите дату";
    if(!form.location.trim()) e.location="Укажите место";
    if(!form.maxParticipants || +form.maxParticipants < 1) e.maxParticipants="Укажите число";
    if(Object.keys(e).length){ setErrors(e); return; }
    onAdd({ id:Date.now(), title:form.title, date:form.date, type:form.type, typeColor:EVENT_TYPE_COLORS[form.type]||"#aaa49e", participants:0, maxParticipants:+form.maxParticipants });
    onClose();
  };

  const lbl: React.CSSProperties = { display:"block", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.22em", textTransform:"uppercase", color:"#6b6357", marginBottom:6 };

  return (
    <div onClick={e=>{ if(e.target===e.currentTarget) onClose(); }} style={{ position:"fixed", inset:0, zIndex:60, background:"rgba(26,22,18,0.8)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ width:"100%", maxWidth:500, background:"#fff", maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ height:4, background:"linear-gradient(90deg,#e84e00,#ff7a2f 60%,#e84e00)" }}/>
        <div style={{ padding:"32px" }}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24 }}>
            <div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.26em", textTransform:"uppercase", color:"#e84e00", marginBottom:5 }}>{clubName}</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:26, letterSpacing:"0.06em", textTransform:"uppercase", color:"#1a1612", lineHeight:1 }}>Новое событие</div>
            </div>
            <button onClick={onClose} style={{ width:34, height:34, border:"1px solid #e0dbd4", background:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#aaa" }}>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 1l10 10M11 1L1 11" strokeLinecap="round"/></svg>
            </button>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div>
              <label style={lbl}>Название события{errors.title && <span style={{ color:"#e84e00", marginLeft:8, fontSize:10 }}>{errors.title}</span>}</label>
              <input value={form.title} onChange={e=>set("title",e.target.value)} placeholder="Осенний слёт 2026" style={inp} onFocus={e=>(e.target as HTMLInputElement).style.borderColor="#e84e00"} onBlur={e=>(e.target as HTMLInputElement).style.borderColor="#e0dbd4"}/>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div>
                <label style={lbl}>Дата{errors.date && <span style={{ color:"#e84e00", marginLeft:8, fontSize:10 }}>{errors.date}</span>}</label>
                <input value={form.date} onChange={e=>set("date",e.target.value)} placeholder="15–17 окт 2026" style={inp} onFocus={e=>(e.target as HTMLInputElement).style.borderColor="#e84e00"} onBlur={e=>(e.target as HTMLInputElement).style.borderColor="#e0dbd4"}/>
              </div>
              <div>
                <label style={lbl}>Макс. участников{errors.maxParticipants && <span style={{ color:"#e84e00", marginLeft:8, fontSize:10 }}>{errors.maxParticipants}</span>}</label>
                <input type="number" value={form.maxParticipants} onChange={e=>set("maxParticipants",e.target.value)} placeholder="50" min={1} style={inp} onFocus={e=>(e.target as HTMLInputElement).style.borderColor="#e84e00"} onBlur={e=>(e.target as HTMLInputElement).style.borderColor="#e0dbd4"}/>
              </div>
            </div>
            <div>
              <label style={lbl}>Место{errors.location && <span style={{ color:"#e84e00", marginLeft:8, fontSize:10 }}>{errors.location}</span>}</label>
              <input value={form.location} onChange={e=>set("location",e.target.value)} placeholder="Подмосковье, полигон Дружба" style={inp} onFocus={e=>(e.target as HTMLInputElement).style.borderColor="#e84e00"} onBlur={e=>(e.target as HTMLInputElement).style.borderColor="#e0dbd4"}/>
            </div>
            <div>
              <label style={lbl}>Тип события</label>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {EVENT_TYPES.map(t=>(
                  <button key={t} type="button" onClick={()=>set("type",t)}
                    style={{ padding:"7px 14px", border:`1px solid ${form.type===t ? EVENT_TYPE_COLORS[t]||"#e84e00" : "#e0dbd4"}`, background:form.type===t ? EVENT_TYPE_COLORS[t]||"#e84e00" : "transparent", color:form.type===t?"#fff":"#6b6357", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", cursor:"pointer" }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={lbl}>Описание (необязательно)</label>
              <textarea value={form.description} onChange={e=>set("description",e.target.value)} placeholder="Расскажите об условиях, программе, требованиях…" rows={3} style={{ ...inp, resize:"none", fontFamily:"'Barlow',sans-serif", fontSize:13 }} onFocus={e=>(e.target as HTMLTextAreaElement).style.borderColor="#e84e00"} onBlur={e=>(e.target as HTMLTextAreaElement).style.borderColor="#e0dbd4"}/>
            </div>
          </div>
          <div style={{ display:"flex", gap:10, marginTop:24 }}>
            <button type="button" onClick={onClose} style={{ flex:1, padding:"12px 0", border:"1px solid #e0dbd4", background:"transparent", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, letterSpacing:"0.14em", textTransform:"uppercase", color:"#6b6357", cursor:"pointer" }}>Отмена</button>
            <button type="button" onClick={submit} style={{ flex:1, padding:"12px 0", border:"none", background:"#e84e00", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, letterSpacing:"0.14em", textTransform:"uppercase", color:"#fff", cursor:"pointer" }}>Создать событие</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Edit Club Modal ───────────────────────────────────────────

function EditClubModal({ club, onClose, onSave }: { club:FullClub; onClose:()=>void; onSave:(c:FullClub)=>void }) {
  const [name, setName] = useState(club.name);
  const [city, setCity] = useState(club.city);
  const [description, setDescription] = useState(club.description);
  const [accent, setAccent] = useState(club.accent);
  const [tagsRaw, setTagsRaw] = useState(club.tags.join(", "));
  const lbl: React.CSSProperties = { display:"block", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.22em", textTransform:"uppercase", color:"#6b6357", marginBottom:6 };

  const save = () => {
    onSave({ ...club, name, city, description, accent, tags: tagsRaw.split(",").map(t=>t.trim()).filter(Boolean) });
    onClose();
  };

  return (
    <div onClick={e=>{ if(e.target===e.currentTarget) onClose(); }} style={{ position:"fixed", inset:0, zIndex:60, background:"rgba(26,22,18,0.8)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ width:"100%", maxWidth:500, background:"#fff", maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ height:4, background:`linear-gradient(90deg,${accent},${accent}88 60%,${accent})` }}/>
        <div style={{ padding:"32px" }}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24 }}>
            <div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.26em", textTransform:"uppercase", color:accent, marginBottom:5 }}>Редактирование</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:26, letterSpacing:"0.06em", textTransform:"uppercase", color:"#1a1612", lineHeight:1 }}>{club.name}</div>
            </div>
            <button onClick={onClose} style={{ width:34, height:34, border:"1px solid #e0dbd4", background:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#aaa" }}>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 1l10 10M11 1L1 11" strokeLinecap="round"/></svg>
            </button>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div><label style={lbl}>Название клуба</label><input value={name} onChange={e=>setName(e.target.value)} style={inp} onFocus={e=>(e.target as HTMLInputElement).style.borderColor=accent} onBlur={e=>(e.target as HTMLInputElement).style.borderColor="#e0dbd4"}/></div>
              <div><label style={lbl}>Город</label><input value={city} onChange={e=>setCity(e.target.value)} style={inp} onFocus={e=>(e.target as HTMLInputElement).style.borderColor=accent} onBlur={e=>(e.target as HTMLInputElement).style.borderColor="#e0dbd4"}/></div>
            </div>
            <div>
              <label style={lbl}>Описание</label>
              <textarea value={description} onChange={e=>setDescription(e.target.value)} rows={3} style={{ ...inp, resize:"none", fontFamily:"'Barlow',sans-serif", fontSize:13 }} onFocus={e=>(e.target as HTMLTextAreaElement).style.borderColor=accent} onBlur={e=>(e.target as HTMLTextAreaElement).style.borderColor="#e0dbd4"}/>
            </div>
            <div>
              <label style={lbl}>Теги (через запятую)</label>
              <input value={tagsRaw} onChange={e=>setTagsRaw(e.target.value)} placeholder="Слёты, Горы, Экспедиции" style={inp} onFocus={e=>(e.target as HTMLInputElement).style.borderColor=accent} onBlur={e=>(e.target as HTMLInputElement).style.borderColor="#e0dbd4"}/>
            </div>
            <div>
              <label style={lbl}>Акцентный цвет</label>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
                {ACCENTS.map(c=>(
                  <button key={c} type="button" onClick={()=>setAccent(c)}
                    style={{ width:28, height:28, background:c, border:accent===c?"3px solid #1a1612":"2px solid transparent", cursor:"pointer" }}/>
                ))}
                <input type="color" value={accent} onChange={e=>setAccent(e.target.value)} style={{ width:28, height:28, cursor:"pointer", border:"1px solid #e0dbd4", padding:2 }}/>
              </div>
            </div>
            {/* preview strip */}
            <div style={{ height:48, background:`linear-gradient(135deg,${accent} 0%,${accent}88 100%)`, display:"flex", alignItems:"center", padding:"0 16px", gap:12 }}>
              <div style={{ width:32, height:32, background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:16, color:"#fff" }}>{name[0]||"?"}</span>
              </div>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:16, letterSpacing:"0.06em", textTransform:"uppercase", color:"#fff" }}>{name||"Название клуба"}</span>
            </div>
          </div>
          <div style={{ display:"flex", gap:10, marginTop:24 }}>
            <button type="button" onClick={onClose} style={{ flex:1, padding:"12px 0", border:"1px solid #e0dbd4", background:"transparent", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, letterSpacing:"0.14em", textTransform:"uppercase", color:"#6b6357", cursor:"pointer" }}>Отмена</button>
            <button type="button" onClick={save} style={{ flex:1, padding:"12px 0", border:"none", background:accent, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, letterSpacing:"0.14em", textTransform:"uppercase", color:"#fff", cursor:"pointer" }}>Сохранить</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Club Detail View (inside LK) ──────────────────────────────

function ClubDetailView({ club, onBack, onEdit, onAddEvent, onSaveClub }: { club:FullClub; onBack:()=>void; onEdit:()=>void; onAddEvent:(e:ClubEvent)=>void; onSaveClub:(c:FullClub)=>void }) {
  const [showAddEvent, setShowAddEvent] = useState(false);
  const isOrg = club.role === "Организатор";
  const pctOf = (p:number,m:number) => Math.round((p/m)*100);

  return (
    <>
      {/* club hero */}
      <div style={{ position:"relative", height:220, overflow:"hidden", background:"#1a1612", marginBottom:28 }}>
        <img src={club.img} alt={club.name} style={{ width:"100%", height:"100%", objectFit:"cover", opacity:0.45 }}/>
        <div style={{ position:"absolute", inset:0, background:`linear-gradient(135deg,${club.accent}ee 0%,rgba(26,22,18,0.7) 100%)` }}/>
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"flex-end", padding:"20px 28px" }}>
          <button onClick={onBack} style={{ position:"absolute", top:16, left:20, display:"flex", alignItems:"center", gap:6, background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", padding:"6px 12px", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(255,255,255,0.8)" }}>
            <svg width="12" height="8" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M13 5H1M5 1L1 5l4 4"/></svg>
            Назад
          </button>
          <div style={{ display:"flex", alignItems:"flex-end", gap:20, width:"100%" }}>
            <div style={{ width:64, height:64, background:club.accent, display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid rgba(255,255,255,0.2)", flexShrink:0 }}>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:28, color:"#fff" }}>{club.name[0]}</span>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:30, letterSpacing:"0.06em", textTransform:"uppercase", color:"#fff", lineHeight:1, margin:0 }}>{club.name}</h2>
                {isOrg && <span style={{ background:"#e84e00", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", color:"#fff", padding:"3px 9px" }}>Организатор</span>}
              </div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(255,255,255,0.55)" }}>{club.city} · с {club.joined}</div>
            </div>
            <div style={{ display:"flex", gap:8, flexShrink:0 }}>
              {isOrg && (
                <button onClick={onEdit} style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.25)", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:"#fff" }}>
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 1l3 3-7 7H1V8L8 1z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Редактировать
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:24 }}>
        {/* LEFT */}
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          {/* description */}
          <div style={{ background:"#fff", border:"1px solid #ece8e3" }}>
            <div style={{ height:3, background:`linear-gradient(90deg,${club.accent},${club.accent}66)` }}/>
            <div style={{ padding:"20px 24px" }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.22em", textTransform:"uppercase", color:club.accent, marginBottom:8 }}>О клубе</div>
              <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:14, lineHeight:1.7, color:"#4a443e", margin:"0 0 14px" }}>{club.description}</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {club.tags.map(t=>(
                  <span key={t} style={{ border:`1px solid ${club.accent}44`, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:600, fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase", color:club.accent, padding:"4px 10px" }}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* events */}
          <div style={{ background:"#fff", border:"1px solid #ece8e3" }}>
            <div style={{ padding:"20px 24px" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.22em", textTransform:"uppercase", color:"#aaa49e" }}>События клуба</div>
                {isOrg && (
                  <button onClick={()=>setShowAddEvent(true)} style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px", background:"#e84e00", border:"none", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:"#fff" }}>
                    <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5"><path d="M6 1v10M1 6h10" strokeLinecap="round"/></svg>
                    Добавить событие
                  </button>
                )}
              </div>
              {club.events.length === 0 ? (
                <div style={{ padding:"32px 0", textAlign:"center" }}>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, letterSpacing:"0.08em", textTransform:"uppercase", color:"#d6d0c8", marginBottom:12 }}>Событий пока нет</div>
                  {isOrg && <button onClick={()=>setShowAddEvent(true)} style={{ padding:"8px 18px", background:"#e84e00", border:"none", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.14em", textTransform:"uppercase", color:"#fff" }}>Создать первое</button>}
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {club.events.map(ev=>{
                    const pct = pctOf(ev.participants, ev.maxParticipants);
                    return (
                      <div key={ev.id} style={{ border:"1px solid #f0ece8", padding:"14px 16px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                          <div style={{ width:4, alignSelf:"stretch", background:ev.typeColor, flexShrink:0 }}/>
                          <div style={{ flex:1 }}>
                            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:15, letterSpacing:"0.04em", textTransform:"uppercase", color:"#1a1612", lineHeight:1.1 }}>{ev.title}</div>
                            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:"#aaa49e", marginTop:3 }}>{ev.date}</div>
                          </div>
                          <span style={{ background:ev.typeColor, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase", color:"#fff", padding:"3px 8px", flexShrink:0 }}>{ev.type}</span>
                        </div>
                        <div>
                          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase", color:"#aaa49e" }}>Участники</span>
                            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, color:pct>=90?"#e84e00":"#1a1612" }}>{ev.participants} / {ev.maxParticipants}</span>
                          </div>
                          <div style={{ height:3, background:"#f0ece8" }}>
                            <div style={{ height:"100%", width:`${pct}%`, background:pct>=90?"#e84e00":"#3a9e5f", transition:"width 0.3s" }}/>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT sidebar */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ background:"#1a1612" }}>
            <div style={{ height:3, background:`linear-gradient(90deg,${club.accent},${club.accent}88)` }}/>
            <div style={{ padding:"20px 18px" }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(255,255,255,0.4)", marginBottom:16 }}>Статистика</div>
              {[{v:club.members,l:"Участников",c:"#fff"},{v:club.routes,l:"Маршрутов",c:club.accent},{v:club.events.length,l:"Событий",c:"#d4820a"}].map((s,i)=>(
                <div key={s.l} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", borderBottom:i<2?"1px solid rgba(255,255,255,0.06)":"none" }}>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(255,255,255,0.45)" }}>{s.l}</span>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:22, color:s.c, lineHeight:1 }}>{s.v}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background:"#fff", border:"1px solid #ece8e3", padding:"16px 18px" }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:"#aaa49e", marginBottom:12 }}>Моя роль</div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:36, height:36, background:club.accent, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:16, color:"#fff" }}>{club.name[0]}</span>
              </div>
              <div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:14, letterSpacing:"0.04em", textTransform:"uppercase", color:"#1a1612" }}>{club.role}</div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:"#aaa49e", marginTop:2 }}>с {club.joined}</div>
              </div>
            </div>
          </div>
          {isOrg && (
            <button onClick={()=>setShowAddEvent(true)} style={{ padding:"12px 0", border:"none", background:"#e84e00", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.16em", textTransform:"uppercase", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5"><path d="M6 1v10M1 6h10" strokeLinecap="round"/></svg>
              Добавить событие
            </button>
          )}
        </div>
      </div>

      {showAddEvent && (
        <AddEventModal clubName={club.name} onClose={()=>setShowAddEvent(false)} onAdd={ev=>{
          onAddEvent(ev);
          setShowAddEvent(false);
        }}/>
      )}
    </>
  );
}

// ── Clubs List View ───────────────────────────────────────────

function ClubsSection() {
  const [clubs, setClubs] = useState<FullClub[]>(INIT_CLUBS);
  const [viewId, setViewId] = useState<number|null>(null);
  const [editId, setEditId] = useState<number|null>(null);
  const [tab, setTab] = useState<"member"|"owner">("member");

  const viewedClub = clubs.find(c=>c.id===viewId) ?? null;
  const editedClub = clubs.find(c=>c.id===editId) ?? null;

  const saveClub = (updated:FullClub) => setClubs(prev=>prev.map(c=>c.id===updated.id?updated:c));
  const addEvent = (clubId:number, ev:ClubEvent) => setClubs(prev=>prev.map(c=>c.id===clubId?{...c,events:[...c.events,ev]}:c));

  if(viewedClub) return (
    <>
      <ClubDetailView
        club={viewedClub}
        onBack={()=>setViewId(null)}
        onEdit={()=>setEditId(viewedClub.id)}
        onAddEvent={ev=>addEvent(viewedClub.id,ev)}
        onSaveClub={saveClub}
      />
      {editedClub && (
        <EditClubModal club={editedClub} onClose={()=>setEditId(null)} onSave={c=>{ saveClub(c); setEditId(null); }}/>
      )}
    </>
  );

  const memberClubs = clubs.filter(c=>c.role==="Участник");
  const ownerClubs  = clubs.filter(c=>c.role==="Организатор");
  const visibleClubs = tab === "member" ? memberClubs : ownerClubs;

  return (
    <>
      <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.26em", textTransform:"uppercase", color:"#e84e00", marginBottom:4 }}>Членство</div>
          <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:32, letterSpacing:"0.06em", textTransform:"uppercase", color:"#1a1612", lineHeight:1, margin:0 }}>Мои клубы</h2>
        </div>
        <button style={{ display:"flex", alignItems:"center", gap:7, padding:"10px 18px", background:"#e84e00", border:"none", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.16em", textTransform:"uppercase", color:"#fff", flexShrink:0 }}>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"><path d="M6 1v10M1 6h10"/></svg>
          Добавить клуб
        </button>
      </div>

      {/* tab switcher */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", border:"1px solid #ece8e3", marginBottom:24, background:"#fff" }}>
        {([
          { key:"member", label:"Вступил", count:memberClubs.length, icon:"🏁" },
          { key:"owner",  label:"Созданные", count:ownerClubs.length,  icon:"⚡" },
        ] as const).map((t,i)=>(
          <button key={t.key} onClick={()=>setTab(t.key)} style={{ position:"relative", padding:"18px 24px", border:"none", borderRight:i===0?"1px solid #ece8e3":"none", background:tab===t.key?"#fff":"#faf8f5", cursor:"pointer", textAlign:"left", transition:"background 0.15s" }}>
            {tab===t.key && <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"#e84e00" }}/>}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:15, letterSpacing:"0.08em", textTransform:"uppercase", color:tab===t.key?"#1a1612":"#8c8480" }}>{t.icon} {t.label}</div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:"#aaa49e", marginTop:3 }}>{t.count} {t.count===1?"клуб":t.count<5?"клуба":"клубов"}</div>
              </div>
              {tab===t.key && <div style={{ width:8, height:8, borderRadius:"50%", background:"#e84e00" }}/>}
            </div>
          </button>
        ))}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
        {visibleClubs.length === 0 && (
          <div style={{ textAlign:"center", padding:"60px 0", color:"#ccc5bf" }}>
            <div style={{ fontSize:32, marginBottom:12 }}>⚡</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, letterSpacing:"0.1em", textTransform:"uppercase" }}>Вы ещё не создавали клубов</div>
          </div>
        )}
        {visibleClubs.map(club=>(
          <div key={club.id} style={{ position:"relative", overflow:"hidden", cursor:"pointer" }} onClick={()=>setViewId(club.id)}>
            <div style={{ height:200, position:"relative", background:"#1a1612", transition:"opacity 0.2s" }}
              onMouseEnter={e=>(e.currentTarget.querySelector("img") as HTMLImageElement).style.opacity="0.65"}
              onMouseLeave={e=>(e.currentTarget.querySelector("img") as HTMLImageElement).style.opacity="0.5"}
            >
              <img src={club.img} alt={club.name} style={{ width:"100%", height:"100%", objectFit:"cover", opacity:0.5, transition:"opacity 0.2s" }}/>
              <div style={{ position:"absolute", inset:0, background:`linear-gradient(to right, ${club.accent}cc 0%, ${club.accent}55 40%, transparent 100%)` }}/>
              <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", padding:"28px 32px", gap:24 }}>
                <div style={{ width:64, height:64, background:club.accent, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, border:"2px solid rgba(255,255,255,0.2)" }}>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:26, color:"#fff", letterSpacing:"0.04em" }}>{club.name[0]}</span>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                    <h3 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:26, letterSpacing:"0.06em", textTransform:"uppercase", color:"#fff", lineHeight:1, margin:0 }}>{club.name}</h3>
                    {club.role==="Организатор" && <span style={{ background:"#e84e00", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", color:"#fff", padding:"3px 9px" }}>Организатор</span>}
                  </div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(255,255,255,0.6)" }}>{club.city} · Вступил: {club.joined}</div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, letterSpacing:"0.08em", color:"rgba(255,255,255,0.4)", marginTop:4 }}>{club.description.slice(0,80)}…</div>
                </div>
                <div style={{ display:"flex", gap:0, border:"1px solid rgba(255,255,255,0.15)" }}>
                  {[{v:club.members,l:"Участников"},{v:club.routes,l:"Маршрутов"},{v:club.events.length,l:"Событий"}].map((s,i)=>(
                    <div key={s.l} style={{ padding:"12px 16px", textAlign:"center", borderRight:i<2?"1px solid rgba(255,255,255,0.1)":"none" }}>
                      <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:22, color:"#fff", lineHeight:1 }}>{s.v}</div>
                      <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, letterSpacing:"0.16em", textTransform:"uppercase", color:"rgba(255,255,255,0.45)", marginTop:2 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ background:"#fff", padding:"12px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", border:"1px solid #ece8e3", borderTop:"none" }}>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color:"#aaa49e" }}>Нажмите, чтобы открыть</span>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color:club.accent }}>Подробнее →</span>
            </div>
          </div>
        ))}

        <button style={{ border:"2px dashed #d6d0c8", background:"transparent", cursor:"pointer", padding:"32px 0", display:"flex", alignItems:"center", justifyContent:"center", gap:10, transition:"border-color 0.15s" }}
          onMouseEnter={e=>{ (e.currentTarget as HTMLButtonElement).style.borderColor="#e84e00"; }}
          onMouseLeave={e=>{ (e.currentTarget as HTMLButtonElement).style.borderColor="#d6d0c8"; }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#aaa49e" strokeWidth="2"><path d="M6 1v10M1 6h10" strokeLinecap="round"/></svg>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, letterSpacing:"0.14em", textTransform:"uppercase", color:"#aaa49e" }}>
            {tab === "member" ? "Найти новый клуб" : "Создать клуб"}
          </span>
        </button>
      </div>

      {editedClub && (
        <EditClubModal club={editedClub} onClose={()=>setEditId(null)} onSave={c=>{ saveClub(c); setEditId(null); }}/>
      )}
    </>
  );
}

// ── Purchases Section ─────────────────────────────────────────

type Purchase = {
  id: string; date: string;
  items: { name: string; img: string; price: number; qty: number; variant?: string; category?: string }[];
  total: number; status: "Доставлен" | "В пути" | "Обрабатывается" | "Отменён";
  delivery: string; address?: string; payment?: string; trackNumber?: string;
};

const MY_PURCHASES: Purchase[] = [
  { id:"ORD-2847", date:"28 авг 2026", total:64900, status:"Доставлен", delivery:"СДЭК", address:"Москва, ул. Ленина, 10, кв. 5", payment:"Карта •••• 4321", trackNumber:"1234567890123",
    items:[{ name:"Warn VR EVO 10", img:"https://images.unsplash.com/photo-1620029188962-be2c6486593d?w=120&h=100&fit=crop&auto=format", price:64900, qty:1, category:"Лебёдки" }] },
  { id:"ORD-2761", date:"14 авг 2026", total:25880, status:"Доставлен", delivery:"Курьер", address:"Москва, ул. Ленина, 10, кв. 5", payment:"Карта •••• 4321", trackNumber:"9876543210987",
    items:[
      { name:"Mechanix M-PACT", img:"https://images.unsplash.com/photo-1596507931135-75f699668356?w=120&h=100&fit=crop&auto=format", price:3490, qty:2, variant:"L", category:"Одежда" },
      { name:"Защита картера ТСС", img:"https://images.unsplash.com/photo-1640636430737-de4ae2656d43?w=120&h=100&fit=crop&auto=format", price:8900, qty:1, category:"Защита" },
      { name:"BFGoodrich MT/A KM3", img:"https://images.unsplash.com/photo-1605661480059-884578ac8ec8?w=120&h=100&fit=crop&auto=format", price:18900, qty:1, variant:"35x12.50 R17", category:"Шины" },
    ]},
  { id:"ORD-2834", date:"2 сен 2026", total:42500, status:"В пути", delivery:"СДЭК", address:"Москва, ул. Ленина, 10, кв. 5", payment:"СБП", trackNumber:"5555666677778888",
    items:[{ name:"Lift Kit 50mm Ranger", img:"https://images.unsplash.com/photo-1640636430727-649f73271766?w=120&h=100&fit=crop&auto=format", price:42500, qty:1, variant:"Без блоков", category:"Лифт-киты" }] },
  { id:"ORD-2851", date:"5 сен 2026", total:3490, status:"Обрабатывается", delivery:"Почта России", address:"Москва, ул. Ленина, 10, кв. 5", payment:"Карта •••• 4321",
    items:[{ name:"Mechanix M-PACT", img:"https://images.unsplash.com/photo-1596507931135-75f699668356?w=120&h=100&fit=crop&auto=format", price:3490, qty:1, variant:"M", category:"Одежда" }] },
];

const ORDER_STATUS_META: Record<string,{bg:string;color:string;dot:string;border:string}> = {
  "Доставлен":     { bg:"#f0faf5", color:"#3a9e5f", dot:"#3a9e5f", border:"#b7e4c7" },
  "В пути":        { bg:"#fff8f0", color:"#d4820a", dot:"#d4820a", border:"#fcd8a0" },
  "Обрабатывается":{ bg:"#f0f4ff", color:"#4c75a3", dot:"#4c75a3", border:"#bdd0f0" },
  "Отменён":       { bg:"#fff0f0", color:"#c0392b", dot:"#c0392b", border:"#f5b7b1" },
};

// progress steps per status
const STATUS_STEPS: Record<string, number> = {
  "Обрабатывается": 1,
  "В пути": 2,
  "Доставлен": 3,
  "Отменён": 0,
};

const TRACK_STEPS = [
  { label:"Заказ оформлен", icon:<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="2" y="3" width="12" height="11" rx="1"/><path d="M5 3V2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"/><path d="M5 8h6M5 11h4"/></svg> },
  { label:"Обрабатывается",  icon:<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="1" y="4" width="14" height="10" rx="1"/><path d="M11 4V3a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v1"/><path d="M1 9h14"/></svg> },
  { label:"В пути",          icon:<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M1 10V7l2-4h8l2 4v3"/><path d="M1 10h14"/><circle cx="4.5" cy="13" r="1.5"/><circle cx="11.5" cy="13" r="1.5"/><path d="M6 10V3"/></svg> },
  { label:"Доставлен",       icon:<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M2 8l4 4 8-8"/></svg> },
];

function OrderDetail({ order, onBack }: { order: Purchase; onBack: ()=>void }) {
  const navigate = useNavigate();
  const sm = ORDER_STATUS_META[order.status];
  const step = STATUS_STEPS[order.status];
  const cancelled = order.status === "Отменён";

  return (
    <div>
      {/* back */}
      <button onClick={onBack} style={{ display:"flex", alignItems:"center", gap:8, background:"none", border:"none", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:"#8c8480", padding:0, marginBottom:24 }}
        onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.color="#e84e00"}
        onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.color="#8c8480"}
      >
        <svg width="14" height="10" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 6H1M6 1L1 6l5 5"/></svg>
        Все заказы
      </button>

      {/* order hero */}
      <div style={{ background:"#fff", border:"1px solid #ece8e3", marginBottom:20, overflow:"hidden" }}>
        <div style={{ height:4, background:sm.dot }}/>
        <div style={{ padding:"24px 28px", display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
          <div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.28em", textTransform:"uppercase", color:"#aaa49e", marginBottom:4 }}>Заказ</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:30, letterSpacing:"0.06em", textTransform:"uppercase", color:"#1a1612", lineHeight:1 }}>{order.id}</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color:"#aaa49e", marginTop:6 }}>Оформлен {order.date}</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 18px", background:sm.bg, border:`1.5px solid ${sm.border}` }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:sm.dot }}/>
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:13, letterSpacing:"0.16em", textTransform:"uppercase", color:sm.color }}>{order.status}</span>
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:20, alignItems:"start" }}>
        {/* LEFT column */}
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

          {/* tracking */}
          <div style={{ background:"#fff", border:"1px solid #ece8e3", padding:"24px 28px" }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:14, letterSpacing:"0.16em", textTransform:"uppercase", color:"#1a1612", marginBottom:24 }}>Отслеживание</div>
            {cancelled ? (
              <div style={{ display:"flex", alignItems:"center", gap:12, padding:"16px", background:"#fff0f0", border:"1px solid #f5b7b1" }}>
                <svg width="20" height="20" viewBox="0 0 22 22" fill="none" stroke="#c0392b" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="9"/><path d="M7 7l8 8M15 7l-8 8"/></svg>
                <div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, letterSpacing:"0.08em", textTransform:"uppercase", color:"#c0392b" }}>Заказ отменён</div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, color:"#e88080", marginTop:2 }}>Средства возвращены на карту в течение 3–5 дней</div>
                </div>
              </div>
            ) : (
              <div>
                {/* step bar */}
                <div style={{ display:"flex", alignItems:"flex-start", gap:0, position:"relative", marginBottom:28 }}>
                  {TRACK_STEPS.map((s, i) => {
                    const done = i < step;
                    const current = i === step - 1;
                    const isLast = i === TRACK_STEPS.length - 1;
                    return (
                      <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", position:"relative" }}>
                        {/* connector line */}
                        {!isLast && (
                          <div style={{ position:"absolute", top:17, left:"50%", width:"100%", height:2, background:done?"#e84e00":"#ece8e3", zIndex:0 }}/>
                        )}
                        {/* circle */}
                        <div style={{ width:34, height:34, borderRadius:"50%", background:done||current?"#e84e00":"#f5f2ee", border:`2px solid ${done||current?"#e84e00":"#ece8e3"}`, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", zIndex:1, color:done||current?"#fff":"#ccc5bf", transition:"all 0.2s" }}>
                          {s.icon}
                        </div>
                        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase", color:done||current?"#1a1612":"#bbb6b0", marginTop:8, textAlign:"center", fontWeight:done||current?700:400 }}>{s.label}</div>
                      </div>
                    );
                  })}
                </div>
                {/* track number */}
                {order.trackNumber && (
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", background:"#faf8f5", border:"1px solid #ece8e3" }}>
                    <div>
                      <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:"#aaa49e", marginBottom:3 }}>Трек-номер {order.delivery}</div>
                      <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:15, letterSpacing:"0.08em", color:"#1a1612" }}>{order.trackNumber}</div>
                    </div>
                    <button style={{ padding:"7px 14px", border:"1px solid #e84e00", background:"transparent", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:"#e84e00" }}>Отследить</button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* items */}
          <div style={{ background:"#fff", border:"1px solid #ece8e3", overflow:"hidden" }}>
            <div style={{ padding:"18px 28px 14px", borderBottom:"1px solid #f5f2ee" }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:14, letterSpacing:"0.16em", textTransform:"uppercase", color:"#1a1612" }}>
                Состав заказа · {order.items.length} позиц.
              </div>
            </div>
            {order.items.map((it, i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:16, padding:"16px 28px", borderBottom:i<order.items.length-1?"1px solid #f8f6f3":"none" }}>
                <div style={{ width:72, height:56, overflow:"hidden", background:"#f5f2ee", flexShrink:0 }}>
                  <img src={it.img} alt={it.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, letterSpacing:"0.04em", textTransform:"uppercase", color:"#1a1612", lineHeight:1.1 }}>{it.name}</div>
                  <div style={{ display:"flex", gap:8, marginTop:5, flexWrap:"wrap" }}>
                    {it.category && <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", color:"#aaa49e", background:"#f5f2ee", padding:"2px 8px" }}>{it.category}</span>}
                    {it.variant  && <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", color:"#6b6357", background:"#ece8e3", padding:"2px 8px" }}>{it.variant}</span>}
                  </div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:16, color:"#1a1612" }}>{(it.price*it.qty).toLocaleString("ru")} ₽</div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase", color:"#aaa49e", marginTop:2 }}>{it.price.toLocaleString("ru")} ₽ × {it.qty}</div>
                </div>
              </div>
            ))}
            <div style={{ padding:"14px 28px", background:"#faf8f5", borderTop:"1px solid #f0ece8", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <button onClick={()=>navigate("/catalog")} style={{ padding:"8px 18px", border:"1px solid #d6d0c8", background:"#fff", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:"#6b6357" }}>
                Купить снова
              </button>
              {order.status==="Доставлен" && (
                <button style={{ padding:"8px 18px", border:"1px solid #e84e00", background:"transparent", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:"#e84e00" }}>
                  Оставить отзыв
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT column — summary */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

          {/* total card */}
          <div style={{ background:"#1a1612", padding:"24px 24px 20px" }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.26em", textTransform:"uppercase", color:"rgba(255,255,255,0.4)", marginBottom:12 }}>Итог по заказу</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:16 }}>
              {order.items.map((it,i)=>(
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, letterSpacing:"0.06em", textTransform:"uppercase", color:"rgba(255,255,255,0.5)", flex:1, marginRight:8, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{it.name} ×{it.qty}</span>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, color:"rgba(255,255,255,0.7)", flexShrink:0 }}>{(it.price*it.qty).toLocaleString("ru")} ₽</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop:"1px solid rgba(255,255,255,0.1)", paddingTop:14, display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(255,255,255,0.4)" }}>Итого</span>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:24, color:"#e84e00" }}>{order.total.toLocaleString("ru")} ₽</span>
            </div>
          </div>

          {/* delivery info */}
          <div style={{ background:"#fff", border:"1px solid #ece8e3", padding:"20px 22px" }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:12, letterSpacing:"0.18em", textTransform:"uppercase", color:"#1a1612", marginBottom:16 }}>Доставка</div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {[
                { icon:<svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="#aaa49e" strokeWidth="1.5" strokeLinecap="round"><path d="M1 10V7l2-4h6l2 4v3M1 10h12"/><circle cx="4" cy="12.5" r="1.5"/><circle cx="10" cy="12.5" r="1.5"/></svg>, label:"Способ", value:order.delivery },
                { icon:<svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="#aaa49e" strokeWidth="1.5" strokeLinecap="round"><path d="M7 1C4.8 1 3 2.8 3 5c0 3 4 8 4 8s4-5 4-8c0-2.2-1.8-4-4-4z"/><circle cx="7" cy="5" r="1.5"/></svg>, label:"Адрес", value:order.address ?? "—" },
              ].map(row=>(
                <div key={row.label} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                  <div style={{ marginTop:1, flexShrink:0 }}>{row.icon}</div>
                  <div>
                    <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:"#aaa49e", marginBottom:2 }}>{row.label}</div>
                    <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, letterSpacing:"0.04em", color:"#1a1612", lineHeight:1.3 }}>{row.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* payment info */}
          <div style={{ background:"#fff", border:"1px solid #ece8e3", padding:"20px 22px" }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:12, letterSpacing:"0.18em", textTransform:"uppercase", color:"#1a1612", marginBottom:16 }}>Оплата</div>
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              <div style={{ width:36, height:24, background:"#f5f2ee", border:"1px solid #ece8e3", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="18" height="12" viewBox="0 0 22 14" fill="none"><rect x="1" y="1" width="20" height="12" rx="2" stroke="#d6d0c8" strokeWidth="1.5"/><path d="M1 5h20" stroke="#d6d0c8" strokeWidth="1.5"/></svg>
              </div>
              <div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, color:"#1a1612" }}>{order.payment ?? "Карта"}</div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", color:"#aaa49e", marginTop:2 }}>Оплачено</div>
              </div>
            </div>
          </div>

          {/* support */}
          <div style={{ padding:"16px 20px", background:"#f5f2ee", border:"1px solid #ece8e3", display:"flex", gap:12, alignItems:"center" }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#aaa49e" strokeWidth="1.5" strokeLinecap="round"><circle cx="10" cy="10" r="9"/><path d="M7.5 7.5a2.5 2.5 0 0 1 5 0c0 2-2.5 2.5-2.5 4"/><circle cx="10" cy="15.5" r=".75" fill="#aaa49e"/></svg>
            <div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color:"#6b6357" }}>Нужна помощь?</div>
              <button style={{ background:"none", border:"none", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, color:"#e84e00", padding:0, marginTop:2 }}>Написать в поддержку →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PurchasesSection() {
  const orders = MY_PURCHASES;
  const [detailId, setDetailId] = useState<string|null>(null);
  const statuses = ["Все","Доставлен","В пути","Обрабатывается","Отменён"] as const;
  const [filter, setFilter] = useState<string>("Все");
  const filtered = orders.filter(o => filter === "Все" || o.status === filter);

  const detailOrder = orders.find(o=>o.id===detailId);

  if (detailOrder) {
    return <OrderDetail order={detailOrder} onBack={()=>setDetailId(null)}/>;
  }

  return (
    <>
      <div style={{ marginBottom:28 }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.26em", textTransform:"uppercase", color:"#e84e00", marginBottom:4 }}>История</div>
        <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:32, letterSpacing:"0.06em", textTransform:"uppercase", color:"#1a1612", lineHeight:1, margin:0 }}>Мои покупки</h2>
      </div>

      {/* summary tiles */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:0, marginBottom:28, background:"#fff", border:"1px solid #ece8e3" }}>
        {[
          { v:String(orders.length), l:"Всего заказов", c:"#1a1612" },
          { v:String(orders.filter(o=>o.status==="Доставлен").length), l:"Доставлено", c:"#3a9e5f" },
          { v:String(orders.filter(o=>o.status==="В пути").length), l:"В пути", c:"#d4820a" },
          { v:orders.reduce((s,o)=>s+o.total,0).toLocaleString("ru")+" ₽", l:"Потрачено", c:"#e84e00" },
        ].map((s,i)=>(
          <div key={s.l} style={{ padding:"20px 24px", borderRight:i<3?"1px solid #ece8e3":"none", textAlign:"center" }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:i===3?22:36, color:s.c, lineHeight:1 }}>{s.v}</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:"#aaa49e", marginTop:5 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* filter tabs */}
      <div style={{ display:"flex", gap:0, borderBottom:"1px solid #e8e4df", marginBottom:20 }}>
        {statuses.map(s=>(
          <button key={s} onClick={()=>setFilter(s)} style={{ position:"relative", padding:"9px 18px", background:"none", border:"none", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:filter===s?700:500, fontSize:12, letterSpacing:"0.14em", textTransform:"uppercase", color:filter===s?"#1a1612":"#8c8480" }}>
            {s}
            {filter===s && <span style={{ position:"absolute", bottom:0, left:0, width:"100%", height:2, background:"#e84e00" }}/>}
          </button>
        ))}
      </div>

      {/* orders list */}
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {filtered.length === 0 && (
          <div style={{ background:"#fff", border:"1px solid #ece8e3", padding:"48px 0", textAlign:"center" }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, letterSpacing:"0.08em", textTransform:"uppercase", color:"#d6d0c8" }}>Заказов не найдено</div>
          </div>
        )}
        {filtered.map(order => {
          const sm = ORDER_STATUS_META[order.status];
          return (
            <div key={order.id} onClick={()=>setDetailId(order.id)} style={{ background:"#fff", border:"1px solid #ece8e3", overflow:"hidden", cursor:"pointer", transition:"border-color 0.15s, box-shadow 0.15s" }}
              onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.borderColor="#e84e00"; (e.currentTarget as HTMLElement).style.boxShadow="0 2px 12px rgba(232,78,0,0.08)"; }}
              onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.borderColor="#ece8e3"; (e.currentTarget as HTMLElement).style.boxShadow="none"; }}
            >
              <div style={{ height:3, background:sm.dot, opacity:0.6 }}/>
              <div style={{ display:"flex", alignItems:"center", gap:16, padding:"16px 20px" }}>
                {/* thumbnails */}
                <div style={{ display:"flex", flexShrink:0 }}>
                  {order.items.slice(0,3).map((it,i)=>(
                    <div key={i} style={{ width:44, height:36, overflow:"hidden", background:"#f5f2ee", border:"2px solid #fff", marginLeft:i>0?-10:0, position:"relative", zIndex:order.items.length-i }}>
                      <img src={it.img} alt={it.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div style={{ width:44, height:36, background:"#f0ece8", border:"2px solid #fff", marginLeft:-10, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, color:"#aaa49e" }}>+{order.items.length-3}</span>
                    </div>
                  )}
                </div>
                {/* info */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:15, letterSpacing:"0.06em", textTransform:"uppercase", color:"#1a1612" }}>{order.id}</div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color:"#aaa49e", marginTop:2 }}>{order.date} · {order.delivery} · {order.items.length} позиц.</div>
                </div>
                {/* status */}
                <div style={{ display:"flex", alignItems:"center", gap:6, padding:"5px 12px", background:sm.bg, flexShrink:0 }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:sm.dot }}/>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:sm.color }}>{order.status}</span>
                </div>
                {/* total */}
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:18, color:"#1a1612", flexShrink:0, minWidth:90, textAlign:"right" }}>{order.total.toLocaleString("ru")} ₽</div>
                {/* arrow */}
                <svg width="7" height="12" viewBox="0 0 8 14" fill="none" stroke="#d6d0c8" strokeWidth="1.8" strokeLinecap="round"><path d="M1 1l6 6-6 6"/></svg>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ── Settings Section ──────────────────────────────────────────

function SettingsSection() {
  const [saved,setSaved] = useState(false);
  const [notif,setNotif] = useState({ events:true, clubs:true, news:false });
  const [name,setName] = useState("Иван Морозов");
  const [username,setUsername] = useState("ivan_morozov");
  const [email,setEmail] = useState("ivan@mail.ru");
  const [phone,setPhone] = useState("+7 (916) 123-45-67");
  const [bio,setBio] = useState("Люблю бездорожье, горы и экспедиции. За рулём с 2010 года.");

  const save = (e:React.FormEvent) => { e.preventDefault(); setSaved(true); setTimeout(()=>setSaved(false),3000); };

  const labelStyle: React.CSSProperties = { display:"block", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.22em", textTransform:"uppercase", color:"#6b6357", marginBottom:6 };
  const blockStyle: React.CSSProperties = { background:"#fff", border:"1px solid #ece8e3" };

  return (
    <>
      <div style={{ marginBottom:28 }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.26em", textTransform:"uppercase", color:"#e84e00", marginBottom:4 }}>Аккаунт</div>
        <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:32, letterSpacing:"0.06em", textTransform:"uppercase", color:"#1a1612", lineHeight:1, margin:0 }}>Настройки профиля</h2>
      </div>

      <form onSubmit={save} style={{ display:"flex", flexDirection:"column", gap:16 }}>
        {/* avatar */}
        <div style={{ ...blockStyle }}>
          <div style={{ height:120, position:"relative", overflow:"hidden" }}>
            <img src="https://images.unsplash.com/photo-1640636430737-de4ae2656d43?w=800&h=160&fit=crop&auto=format" alt="" style={{ width:"100%", height:"100%", objectFit:"cover", opacity:0.4 }}/>
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right,#1a1612,rgba(26,22,18,0.6))" }}/>
            <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", padding:"0 28px", gap:20 }}>
              <div style={{ width:68, height:68, background:"#e84e00", display:"flex", alignItems:"center", justifyContent:"center", border:"3px solid rgba(255,255,255,0.2)", flexShrink:0 }}>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:26, color:"#fff" }}>ИМ</span>
              </div>
              <div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:20, letterSpacing:"0.06em", textTransform:"uppercase", color:"#fff", marginBottom:2 }}>Иван Морозов</div>
                <button type="button" style={{ padding:"5px 14px", background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.25)", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:600, fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(255,255,255,0.8)", cursor:"pointer" }}>Загрузить фото</button>
              </div>
            </div>
          </div>
          <div style={{ padding:"24px 28px" }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"#1a1612", marginBottom:20 }}>Личные данные</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
              <div><label style={labelStyle}>Имя и фамилия</label><input value={name} onChange={e=>setName(e.target.value)} style={inp} onFocus={ev=>(ev.target as HTMLInputElement).style.borderColor="#e84e00"} onBlur={ev=>(ev.target as HTMLInputElement).style.borderColor="#e0dbd4"}/></div>
              <div><label style={labelStyle}>Никнейм</label><input value={username} onChange={e=>setUsername(e.target.value)} style={inp} onFocus={ev=>(ev.target as HTMLInputElement).style.borderColor="#e84e00"} onBlur={ev=>(ev.target as HTMLInputElement).style.borderColor="#e0dbd4"}/></div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
              <div><label style={labelStyle}>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} style={inp} onFocus={ev=>(ev.target as HTMLInputElement).style.borderColor="#e84e00"} onBlur={ev=>(ev.target as HTMLInputElement).style.borderColor="#e0dbd4"}/></div>
              <div><label style={labelStyle}>Телефон</label><input value={phone} onChange={e=>setPhone(e.target.value)} style={inp} onFocus={ev=>(ev.target as HTMLInputElement).style.borderColor="#e84e00"} onBlur={ev=>(ev.target as HTMLInputElement).style.borderColor="#e0dbd4"}/></div>
            </div>
            <div><label style={labelStyle}>О себе</label><textarea value={bio} onChange={e=>setBio(e.target.value)} rows={3} style={{ ...inp, resize:"none", fontFamily:"'Barlow',sans-serif", fontSize:13 }} onFocus={ev=>(ev.target as HTMLTextAreaElement).style.borderColor="#e84e00"} onBlur={ev=>(ev.target as HTMLTextAreaElement).style.borderColor="#e0dbd4"}/></div>
          </div>
        </div>

        {/* notifications */}
        <div style={{ ...blockStyle, padding:"24px 28px" }}>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"#1a1612", marginBottom:20 }}>Уведомления</div>
          {([
            ["events","События и выезды","Уведомления о новых событиях и изменениях в ваших записях"] as const,
            ["clubs","Активность клубов","Новые посты, анонсы и обновления в ваших клубах"] as const,
            ["news","Новости платформы","Обновления, новые функции и важные объявления"] as const,
          ]).map(([key,label,desc])=>(
            <div key={key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 0", borderBottom:"1px solid #f5f2ee" }}>
              <div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, letterSpacing:"0.04em", color:"#1a1612" }}>{label}</div>
                <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:12, color:"#8c8480", marginTop:2 }}>{desc}</div>
              </div>
              <button type="button" onClick={()=>setNotif(n=>({...n,[key]:!n[key]}))}
                style={{ width:46, height:26, borderRadius:13, background:notif[key]?"#e84e00":"#e0dbd4", border:"none", cursor:"pointer", position:"relative", transition:"background 0.2s", flexShrink:0, marginLeft:20 }}
              >
                <div style={{ position:"absolute", top:3, left:notif[key]?23:3, width:20, height:20, borderRadius:10, background:"#fff", transition:"left 0.2s", boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }}/>
              </button>
            </div>
          ))}
        </div>

        {/* danger zone */}
        <div style={{ ...blockStyle, padding:"24px 28px", borderColor:"#f0e0dc" }}>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"#c0392b", marginBottom:16 }}>Опасная зона</div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:600, fontSize:14, color:"#1a1612" }}>Удалить аккаунт</div>
              <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:12, color:"#8c8480", marginTop:2 }}>Это действие необратимо. Все данные будут удалены.</div>
            </div>
            <button type="button" style={{ padding:"9px 18px", border:"1px solid #c0392b", background:"transparent", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.14em", textTransform:"uppercase", color:"#c0392b", cursor:"pointer" }}>Удалить</button>
          </div>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <button type="submit" style={{ padding:"13px 36px", background:"#e84e00", border:"none", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, letterSpacing:"0.14em", textTransform:"uppercase", color:"#fff" }}>
            Сохранить изменения
          </button>
          {saved && (
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:20, height:20, background:"#3a9e5f", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="white" strokeWidth="2.5"><path d="M1 4l3 3 5-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, letterSpacing:"0.12em", textTransform:"uppercase", color:"#3a9e5f" }}>Сохранено</span>
            </div>
          )}
        </div>
      </form>
    </>
  );
}

// ── Page ─────────────────────────────────────────────────────

export function LKPage() {
  const { section, signalId } = useParams();
  const navigate = useNavigate();
  const activeKey = signalId ? "signals" : section || "overview";

  return (
    <div>
      <ProfileHero/>

      <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 24px 72px" }}>
        <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-6">
          <AccountNavigation activeKey={activeKey} onNav={key=>navigate(`/lk/${key}`)}/>
          <div style={{ minWidth:0 }}>
            {(!activeKey || activeKey==="overview")  && <OverviewSection/>}
            {activeKey==="machines"  && <MachinesSection/>}
            {activeKey==="events"    && <EventsSection/>}
            {activeKey==="clubs"     && <ClubsSection/>}
            {activeKey==="achievements" && <AchievementsSection/>}
            {activeKey==="signals"   && <SignalsSection signalId={signalId}/>}
            {activeKey==="friends"   && <FriendsSection/>}
            {activeKey==="chat"      && <ChatSection/>}
            {activeKey==="purchases" && <PurchasesSection/>}
            {activeKey==="settings"  && <SettingsSection/>}
          </div>
        </div>
      </div>
    </div>
  );
}
