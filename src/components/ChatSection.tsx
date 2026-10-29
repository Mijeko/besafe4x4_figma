import { useState } from "react";

type Message = { id:number; text:string; time:string; mine:boolean };

const CONVERSATIONS = [
  { id:"trail", name:"Trail Garage", role:"Автосервис", initials:"TG", preview:"Записали вас на субботу, 11:00", time:"12:48", unread:2, online:true },
  { id:"event", name:"Осеннее бездорожье", role:"Организатор события", initials:"ОБ", preview:"Точку сбора пришлём накануне", time:"Вчера", unread:0, online:true },
  { id:"store", name:"ARB Official Store", role:"Продавец", initials:"ARB", preview:"Заказ передан в службу доставки", time:"Пн", unread:0, online:false },
  { id:"club", name:"Стальные Волки", role:"Клуб", initials:"СВ", preview:"Кирилл: Кто едет на разведку?", time:"18 сен", unread:4, online:false },
];

const FRIENDS = [
  { id:"friend-roman", name:"Роман Власов", city:"Москва", vehicle:"Nissan Patrol Y61", initials:"РВ", online:true },
  { id:"friend-kirill", name:"Кирилл Орлов", city:"Химки", vehicle:"Toyota Hilux", initials:"КО", online:true },
  { id:"friend-elena", name:"Елена Соколова", city:"Подольск", vehicle:"Jeep Wrangler", initials:"ЕС", online:false },
  { id:"friend-maxim", name:"Максим Белов", city:"Москва", vehicle:"Land Rover Defender", initials:"МБ", online:false },
  { id:"friend-anton", name:"Антон Лебедев", city:"Балашиха", vehicle:"УАЗ Патриот", initials:"АЛ", online:true },
];

const INITIAL_MESSAGES: Record<string, Message[]> = {
  trail: [
    { id:1, text:"Добрый день! Хочу записаться на установку лебёдки на Land Cruiser 200.", time:"12:31", mine:true },
    { id:2, text:"Здравствуйте, Иван! Подскажите модель лебёдки и какой бампер установлен на машине?", time:"12:35", mine:false },
    { id:3, text:"ARB Summit, лебёдка Warn Zeon 12-S. Всё уже куплено.", time:"12:38", mine:true },
    { id:4, text:"Отлично, этот комплект знаем. Работа займёт около 5 часов. Ближайшее окно — в субботу.", time:"12:43", mine:false },
    { id:5, text:"Записали вас на субботу, 11:00. За день до визита пришлём напоминание.", time:"12:48", mine:false },
  ],
  event: [
    { id:1, text:"Иван, регистрация на «Осеннее бездорожье» подтверждена.", time:"10:12", mine:false },
    { id:2, text:"Спасибо! Где будет точка сбора колонны?", time:"10:18", mine:true },
    { id:3, text:"Точку сбора пришлём накануне. Ориентир — Тихвинский район.", time:"10:24", mine:false },
  ],
  store: [
    { id:1, text:"Ваш заказ GK-2026-104827 оплачен и принят в работу.", time:"Пн, 09:15", mine:false },
    { id:2, text:"Когда планируется отправка?", time:"Пн, 09:42", mine:true },
    { id:3, text:"Заказ передан в службу доставки. Трек-номер появится в разделе «Покупки».", time:"Пн, 11:20", mine:false },
  ],
  club: [
    { id:1, text:"В выходные хотим проверить новый брод на северном маршруте.", time:"18 сен, 18:06", mine:false },
    { id:2, text:"Кто едет на разведку? Нужна минимум одна машина с лебёдкой.", time:"18 сен, 18:11", mine:false },
  ],
};

export default function ChatSection() {
  const [conversations, setConversations] = useState(CONVERSATIONS);
  const [activeId, setActiveId] = useState("trail");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [friendQuery, setFriendQuery] = useState("");
  const active = conversations.find(item => item.id === activeId) ?? conversations[0];
  const filtered = conversations.filter(item => `${item.name} ${item.role}`.toLowerCase().includes(query.toLowerCase()));
  const filteredFriends = FRIENDS.filter(friend => `${friend.name} ${friend.city} ${friend.vehicle}`.toLowerCase().includes(friendQuery.toLowerCase()));

  const send = (event:React.FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages(current => ({
      ...current,
      [activeId]: [...(current[activeId] ?? []), {
        id:Date.now(),
        text,
        time:new Date().toLocaleTimeString("ru-RU", { hour:"2-digit", minute:"2-digit" }),
        mine:true,
      }],
    }));
    setDraft("");
  };

  const startDialog = (friend:typeof FRIENDS[number]) => {
    if (!conversations.some(item => item.id === friend.id)) {
      setConversations(current => [{
        id:friend.id,
        name:friend.name,
        role:`${friend.city} · ${friend.vehicle}`,
        initials:friend.initials,
        preview:"Новый диалог",
        time:"Сейчас",
        unread:0,
        online:friend.online,
      }, ...current]);
      setMessages(current => ({ ...current, [friend.id]:[] }));
    }
    setActiveId(friend.id);
    setNewDialogOpen(false);
    setFriendQuery("");
  };

  return (
    <>
      <div className="mb-7 flex items-end justify-between">
        <div>
          <div className="mb-1 font-['Barlow_Condensed'] text-xs uppercase tracking-[0.26em] text-primary">Общение</div>
          <div className="font-['Barlow_Condensed'] text-4xl font-black uppercase leading-none tracking-wide">Сообщения</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden font-['Barlow_Condensed'] text-xs uppercase tracking-widest text-muted-foreground sm:block">6 непрочитанных</div>
          <button onClick={()=>setNewDialogOpen(true)} className="flex items-center gap-2 bg-primary px-5 py-3 font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-widest text-white">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M7 1v12M1 7h12"/></svg>
            Новый диалог
          </button>
        </div>
      </div>

      <div className="grid min-h-[680px] overflow-hidden border border-border bg-card md:grid-cols-[19rem_1fr]">
        <aside className="border-b border-border md:border-b-0 md:border-r">
          <div className="border-b border-border p-4">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="7" cy="7" r="4.5"/><path d="m10.5 10.5 3.5 3.5" strokeLinecap="round"/>
              </svg>
              <input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Поиск диалогов" className="w-full border border-border bg-background py-3 pl-9 pr-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary"/>
            </div>
          </div>

          {filtered.map(item => {
            const selected = activeId === item.id;
            return (
              <button key={item.id} onClick={()=>setActiveId(item.id)} className={`grid w-full grid-cols-[2.75rem_1fr_auto] gap-3 border-b border-border p-4 text-left transition ${selected ? "bg-primary/5" : "bg-card hover:bg-background"}`}>
                <span className={`relative flex h-11 w-11 items-center justify-center font-['Barlow_Condensed'] text-sm font-black ${selected ? "bg-primary text-white" : "bg-secondary text-secondary-foreground"}`}>
                  {item.initials}
                  {item.online && <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 border-2 border-card bg-green-600"/>}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-['Barlow_Condensed'] text-sm font-black uppercase tracking-wide">{item.name}</span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">{item.preview}</span>
                </span>
                <span className="flex flex-col items-end gap-2">
                  <span className="font-['Barlow_Condensed'] text-[10px] uppercase tracking-wider text-muted-foreground">{item.time}</span>
                  {item.unread > 0 && <span className="flex h-5 min-w-5 items-center justify-center bg-primary px-1 font-['Barlow_Condensed'] text-[10px] font-bold text-white">{item.unread}</span>}
                </span>
              </button>
            );
          })}
        </aside>

        <section className="flex min-h-[36rem] flex-col">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center bg-primary font-['Barlow_Condensed'] text-sm font-black text-white">{active.initials}</span>
              <div>
                <div className="font-['Barlow_Condensed'] text-base font-black uppercase tracking-wide">{active.name}</div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className={`h-2 w-2 ${active.online ? "bg-green-600" : "bg-border"}`}/>
                  {active.online ? "Сейчас на связи" : active.role}
                </div>
              </div>
            </div>
            <button aria-label="Информация о диалоге" className="flex h-9 w-9 items-center justify-center border border-border text-muted-foreground transition hover:border-primary hover:text-primary">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6.5"/><path d="M8 7v4M8 4.5v.5" strokeLinecap="round"/></svg>
            </button>
          </div>

          <div className="flex flex-1 flex-col justify-end bg-background p-5 md:p-7">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-border"/><span className="font-['Barlow_Condensed'] text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Сегодня</span><span className="h-px flex-1 bg-border"/>
            </div>
            <div className="space-y-3">
              {(messages[activeId] ?? []).map(message => (
                <div key={message.id} className={`flex ${message.mine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] border px-4 py-3 ${message.mine ? "border-primary bg-primary text-white" : "border-border bg-card"}`}>
                    <p className="text-sm leading-6">{message.text}</p>
                    <div className={`mt-1 text-right font-['Barlow_Condensed'] text-[10px] tracking-wider ${message.mine ? "text-white/60" : "text-muted-foreground"}`}>{message.time}{message.mine ? " · ✓✓" : ""}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={send} className="flex items-end gap-3 border-t border-border bg-card p-4">
            <button type="button" aria-label="Прикрепить файл" className="flex h-11 w-11 shrink-0 items-center justify-center border border-border text-muted-foreground transition hover:border-primary hover:text-primary">
              <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="m6 9.5 5.5-5.5a3 3 0 0 1 4.2 4.2l-7 7a4.5 4.5 0 0 1-6.4-6.4l7-7a2 2 0 0 1 2.8 2.8L5.8 11a1 1 0 0 0 1.4 1.4l5.3-5.3"/></svg>
            </button>
            <textarea value={draft} onChange={event=>setDraft(event.target.value)} onKeyDown={event=>{ if(event.key==="Enter"&&!event.shiftKey){ event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} rows={1} placeholder="Напишите сообщение…" className="min-h-11 flex-1 resize-none border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary"/>
            <button type="submit" aria-label="Отправить сообщение" className="flex h-11 w-12 shrink-0 items-center justify-center bg-primary text-white">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m16 2-7 14-2-6-5-2 14-6Z"/><path d="m7 10 4-4"/></svg>
            </button>
          </form>
        </section>
      </div>

      {newDialogOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/70 p-4 backdrop-blur-sm" onMouseDown={event=>{ if(event.target===event.currentTarget) setNewDialogOpen(false); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="new-dialog-title" className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto border border-border bg-card shadow-2xl">
            <div className="h-1 bg-primary"/>
            <div className="border-b border-border px-6 py-5">
              <button onClick={()=>setNewDialogOpen(false)} aria-label="Закрыть окно" className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center border border-border text-muted-foreground transition hover:border-primary hover:text-primary">
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M1 1l12 12M13 1 1 13"/></svg>
              </button>
              <div className="font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-[0.25em] text-primary">Сообщения</div>
              <div id="new-dialog-title" className="mt-1 pr-12 font-['Barlow_Condensed'] text-3xl font-black uppercase tracking-wide">Новый диалог</div>
              <p className="mt-2 text-sm text-secondary-foreground">Выберите друга, которому хотите написать.</p>
            </div>

            <div className="p-5">
              <div className="relative mb-4">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="7" cy="7" r="4.5"/><path d="m10.5 10.5 3.5 3.5" strokeLinecap="round"/></svg>
                <input autoFocus value={friendQuery} onChange={event=>setFriendQuery(event.target.value)} placeholder="Найти друга по имени или машине" className="w-full border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary"/>
              </div>

              <div className="border border-border">
                {filteredFriends.map((friend, index) => (
                  <button key={friend.id} onClick={()=>startDialog(friend)} className={`group flex w-full items-center gap-4 p-4 text-left transition hover:bg-background ${index<filteredFriends.length-1?"border-b border-border":""}`}>
                    <span className="relative flex h-12 w-12 shrink-0 items-center justify-center bg-secondary font-['Barlow_Condensed'] text-sm font-black text-secondary-foreground">
                      {friend.initials}
                      <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 border-2 border-card ${friend.online?"bg-green-600":"bg-border"}`}/>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-['Barlow_Condensed'] text-base font-black uppercase tracking-wide">{friend.name}</span>
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">{friend.city} · {friend.vehicle}</span>
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-2 border border-primary bg-primary px-3 py-2 font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-widest text-white transition group-hover:bg-card group-hover:text-primary">
                      Написать
                      <svg width="13" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 5h12M9 1l4 4-4 4"/>
                      </svg>
                    </span>
                  </button>
                ))}
                {filteredFriends.length===0 && (
                  <div className="px-5 py-10 text-center font-['Barlow_Condensed'] text-sm font-bold uppercase tracking-widest text-muted-foreground">Друзья не найдены</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
