import { useState } from "react";
import { useNavigate } from "react-router";

type Friend = {
  id:number;
  name:string;
  initials:string;
  city:string;
  vehicle:string;
  club:string;
  mutual:number;
  online:boolean;
};

const FRIENDS: Friend[] = [
  { id:1, name:"Роман Власов", initials:"РВ", city:"Москва", vehicle:"Nissan Patrol Y61", club:"Стальные Волки", mutual:12, online:true },
  { id:2, name:"Кирилл Орлов", initials:"КО", city:"Химки", vehicle:"Toyota Hilux", club:"Стальные Волки", mutual:8, online:true },
  { id:3, name:"Елена Соколова", initials:"ЕС", city:"Подольск", vehicle:"Jeep Wrangler", club:"Red Dust Club", mutual:5, online:false },
  { id:4, name:"Максим Белов", initials:"МБ", city:"Москва", vehicle:"Land Rover Defender", club:"Трофи Москва", mutual:16, online:false },
  { id:5, name:"Антон Лебедев", initials:"АЛ", city:"Балашиха", vehicle:"УАЗ Патриот", club:"Стальные Волки", mutual:7, online:true },
  { id:6, name:"Олег Смирнов", initials:"ОС", city:"Тверь", vehicle:"Mitsubishi Pajero", club:"Вольные следопыты", mutual:3, online:false },
];

const INITIAL_REQUESTS = [
  { id:101, name:"Андрей Котов", initials:"АК", city:"Москва", vehicle:"Toyota Land Cruiser 100", mutual:9 },
  { id:102, name:"Мария Громова", initials:"МГ", city:"Красногорск", vehicle:"Suzuki Jimny", mutual:4 },
];

const SUGGESTIONS = [
  { id:201, name:"Денис Фролов", initials:"ДФ", city:"Москва", vehicle:"Ford Ranger", mutual:6 },
  { id:202, name:"Павел Нестеров", initials:"ПН", city:"Одинцово", vehicle:"Chevrolet Niva", mutual:3 },
  { id:203, name:"Ирина Волкова", initials:"ИВ", city:"Москва", vehicle:"Jeep Cherokee", mutual:11 },
];

export default function FriendsSection() {
  const navigate = useNavigate();
  const [friends, setFriends] = useState(FRIENDS);
  const [tab, setTab] = useState<"all"|"online"|"requests">("all");
  const [query, setQuery] = useState("");
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [added, setAdded] = useState<Set<number>>(new Set());
  const list = friends.filter(friend => {
    const matchesTab = tab !== "online" || friend.online;
    const matchesQuery = `${friend.name} ${friend.city} ${friend.vehicle} ${friend.club}`.toLowerCase().includes(query.toLowerCase());
    return matchesTab && matchesQuery;
  });

  return (
    <>
      <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-1 font-['Barlow_Condensed'] text-xs uppercase tracking-[0.26em] text-primary">Сообщество</div>
          <div className="font-['Barlow_Condensed'] text-4xl font-black uppercase leading-none tracking-wide">Мои друзья</div>
        </div>
        <div className="relative w-full sm:w-72">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="7" cy="7" r="4.5"/><path d="m10.5 10.5 3.5 3.5" strokeLinecap="round"/></svg>
          <input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Найти друга" className="w-full border border-border bg-card py-3 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"/>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 border-b border-border pb-4">
        {[
          { key:"all" as const, label:"Все друзья", count:friends.length },
          { key:"online" as const, label:"Сейчас в сети", count:friends.filter(friend=>friend.online).length },
          { key:"requests" as const, label:"Заявки", count:requests.length },
        ].map(item=>(
          <button key={item.key} onClick={()=>setTab(item.key)} className={`flex items-center gap-2 border px-4 py-2 font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-widest transition ${tab===item.key?"border-primary bg-primary text-white":"border-border bg-card text-secondary-foreground hover:border-primary hover:text-primary"}`}>
            {item.label}
            <span className={`flex h-5 min-w-5 items-center justify-center px-1 text-[10px] ${tab===item.key?"bg-white/20":"bg-secondary text-secondary-foreground"}`}>{item.count}</span>
          </button>
        ))}
      </div>

      {tab !== "requests" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map(friend=>(
            <article key={friend.id} className="border border-border bg-card p-5 transition hover:border-primary">
              <div className="flex items-start gap-4">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center bg-secondary font-['Barlow_Condensed'] text-lg font-black text-secondary-foreground">
                  {friend.initials}
                  <span className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 border-2 border-card ${friend.online?"bg-green-600":"bg-border"}`}/>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-['Barlow_Condensed'] text-lg font-black uppercase tracking-wide">{friend.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{friend.city} · {friend.online?"В сети":"Не в сети"}</div>
                </div>
              </div>
              <div className="mt-5 space-y-2 border-y border-border py-4">
                <div className="flex justify-between gap-4 text-xs"><span className="text-muted-foreground">Автомобиль</span><span className="truncate font-medium">{friend.vehicle}</span></div>
                <div className="flex justify-between gap-4 text-xs"><span className="text-muted-foreground">Клуб</span><span className="truncate font-medium">{friend.club}</span></div>
                <div className="flex justify-between gap-4 text-xs"><span className="text-muted-foreground">Общие друзья</span><span className="font-medium">{friend.mutual}</span></div>
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={()=>navigate("/lk/chat")} className="flex flex-1 items-center justify-center gap-2 bg-primary px-3 py-2.5 font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-widest text-white">
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 2.5h12v8H7l-3.5 3v-3H2v-8Z" strokeLinejoin="round"/></svg>
                  Написать
                </button>
                <button onClick={()=>setFriends(current=>current.filter(item=>item.id!==friend.id))} aria-label={`Удалить ${friend.name} из друзей`} title="Удалить из друзей" className="flex w-10 items-center justify-center border border-border text-muted-foreground transition hover:border-red-700 hover:text-red-700">
                  <svg width="14" height="16" viewBox="0 0 14 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M1 4h12M5 1h4l1 3H4l1-3ZM3 4l.7 10h6.6L11 4M5.5 7v4M8.5 7v4"/></svg>
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {requests.map(request=>(
            <article key={request.id} className="flex items-center gap-4 border border-border bg-card p-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center bg-secondary font-['Barlow_Condensed'] text-lg font-black text-secondary-foreground">{request.initials}</div>
              <div className="min-w-0 flex-1">
                <div className="font-['Barlow_Condensed'] text-lg font-black uppercase tracking-wide">{request.name}</div>
                <div className="mt-1 truncate text-xs text-muted-foreground">{request.city} · {request.vehicle}</div>
                <div className="mt-1 text-xs text-primary">{request.mutual} общих друзей</div>
                <div className="mt-4 flex gap-2">
                  <button onClick={()=>setRequests(current=>current.filter(item=>item.id!==request.id))} className="bg-primary px-4 py-2 font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-widest text-white">Принять</button>
                  <button onClick={()=>setRequests(current=>current.filter(item=>item.id!==request.id))} className="border border-border px-4 py-2 font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-widest text-secondary-foreground">Отклонить</button>
                </div>
              </div>
            </article>
          ))}
          {requests.length===0 && <div className="col-span-full border border-border bg-card px-6 py-14 text-center font-['Barlow_Condensed'] text-sm font-bold uppercase tracking-widest text-muted-foreground">Новых заявок нет</div>}
        </div>
      )}

      {tab==="all" && !query && (
        <section className="mt-10 border-t border-border pt-8">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <div className="font-['Barlow_Condensed'] text-xs uppercase tracking-[0.24em] text-primary">Новые знакомства</div>
              <div className="mt-1 font-['Barlow_Condensed'] text-2xl font-black uppercase tracking-wide">Возможно, вы знакомы</div>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {SUGGESTIONS.map(person=>(
              <div key={person.id} className="flex items-center gap-3 border border-border bg-card p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-secondary font-['Barlow_Condensed'] text-sm font-black text-secondary-foreground">{person.initials}</div>
                <div className="min-w-0 flex-1"><div className="truncate font-['Barlow_Condensed'] text-sm font-black uppercase">{person.name}</div><div className="mt-0.5 text-xs text-muted-foreground">{person.mutual} общих друзей</div></div>
                <button onClick={()=>setAdded(current=>new Set(current).add(person.id))} aria-label={`Добавить ${person.name} в друзья`} className={`flex h-9 w-9 items-center justify-center border ${added.has(person.id)?"border-primary bg-primary text-white":"border-border text-primary hover:border-primary"}`}>
                  {added.has(person.id)?<svg width="13" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m1 5 4 4 8-8" strokeLinecap="round" strokeLinejoin="round"/></svg>:<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M7 1v12M1 7h12" strokeLinecap="round"/></svg>}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
