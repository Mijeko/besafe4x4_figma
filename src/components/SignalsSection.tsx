import { useState } from "react";
import { useNavigate } from "react-router";

type SignalStatus = "resolved" | "cancelled";

type Signal = {
  id: string;
  status: SignalStatus;
  title: string;
  description: string;
  location: string;
  coordinates: string;
  createdAt: string;
  updatedAt: string;
  vehicle: string;
  plate: string;
  people: number;
  helper?: {
    name: string;
    initials: string;
    vehicle: string;
    rating: string;
    assignedAt: string;
    phone: string;
  };
};

const SIGNALS: Signal[] = [
  {
    id:"SIG-1048",
    status:"resolved",
    title:"Застрял в глубокой колее",
    description:"Машина села на мосты после дождя. Лебёдка есть, но рядом нет подходящих деревьев. Нужен автомобиль с лебёдкой или динамической стропой.",
    location:"Московская обл., Рузский район",
    coordinates:"55.6712, 36.5218",
    createdAt:"Сегодня, 14:32",
    updatedAt:"Помощь оказана сегодня в 15:21",
    vehicle:"Toyota Land Cruiser 80",
    plate:"А777АА 77",
    people:2,
    helper:{ name:"Алексей Воронов", initials:"АВ", vehicle:"Nissan Patrol Y61", rating:"4.9", assignedAt:"Назначен сегодня в 14:39", phone:"+7 916 555-24-81" },
  },
  {
    id:"SIG-1036",
    status:"resolved",
    title:"Пробито два колеса",
    description:"На каменистом участке пробил два правых колеса. Одна запаска есть, нужна вторая R17 или помощь с эвакуацией до дороги.",
    location:"Тверская обл., Конаковский район",
    coordinates:"56.6841, 36.7425",
    createdAt:"Сегодня, 09:17",
    updatedAt:"Помощь оказана сегодня в 10:06",
    vehicle:"Jeep Wrangler Rubicon",
    plate:"В321МО 50",
    people:3,
    helper:{ name:"Денис Орлов", initials:"ДО", vehicle:"Land Rover Defender", rating:"4.7", assignedAt:"Назначен сегодня в 09:24", phone:"+7 926 310-09-72" },
  },
  {
    id:"SIG-1019",
    status:"resolved",
    title:"Не запускается двигатель",
    description:"После брода двигатель заглох и не запускался. Требовалась диагностика и буксировка до твёрдого покрытия.",
    location:"Ленинградская обл., Тихвинский район",
    coordinates:"59.6442, 33.5074",
    createdAt:"18 сентября, 18:44",
    updatedAt:"Завершён 18 сентября в 20:12",
    vehicle:"Toyota Land Cruiser 80",
    plate:"А777АА 77",
    people:2,
    helper:{ name:"Роман Беляев", initials:"РБ", vehicle:"УАЗ Патриот", rating:"4.8", assignedAt:"Назначен 18 сентября в 18:51", phone:"+7 921 440-18-02" },
  },
  {
    id:"SIG-0987",
    status:"resolved",
    title:"Нужен компрессор",
    description:"После песчаного участка не смог накачать колёса — штатный компрессор перегрелся.",
    location:"Калужская обл., Дзержинский район",
    coordinates:"54.7791, 35.9512",
    createdAt:"2 августа, 16:05",
    updatedAt:"Завершён 2 августа в 16:48",
    vehicle:"Jeep Wrangler Rubicon",
    plate:"В321МО 50",
    people:1,
    helper:{ name:"Михаил Серов", initials:"МС", vehicle:"Toyota Hilux", rating:"5.0", assignedAt:"Назначен 2 августа в 16:12", phone:"+7 903 117-62-49" },
  },
  {
    id:"SIG-0942",
    status:"cancelled",
    title:"Требуется буксировка",
    description:"Автомобиль потерял тягу на подъёме. Сигнал отменён после самостоятельного решения проблемы.",
    location:"Московская обл., Дмитровский район",
    coordinates:"56.3105, 37.5164",
    createdAt:"14 июня, 11:20",
    updatedAt:"Отменён 14 июня в 11:31",
    vehicle:"Toyota Land Cruiser 80",
    plate:"А777АА 77",
    people:2,
  },
];

const STATUS: Record<SignalStatus,{ label:string; color:string; background:string }> = {
  resolved:{ label:"Помощь оказана", color:"#55705d", background:"#edf4ef" },
  cancelled:{ label:"Отменён", color:"#8c8480", background:"#f0ede9" },
};

function SignalIcon({ status }: { status:SignalStatus }) {
  const resolved = status==="resolved";
  return (
    <div style={{ width:48, height:48, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", background:resolved?"#e84e00":"#ece8e3", color:resolved?"#fff":"#8c8480" }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21s-7-5.5-7-12a7 7 0 1 1 14 0c0 6.5-7 12-7 12Z"/>
        <path d="M12 6v5M12 15h.01"/>
      </svg>
    </div>
  );
}

function StatusBadge({ status }: { status:SignalStatus }) {
  const meta = STATUS[status];
  return <span style={{ padding:"4px 9px", background:meta.background, color:meta.color, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{meta.label}</span>;
}

function SignalDetail({ signal, onBack }: { signal:Signal; onBack:()=>void }) {
  return (
    <div style={{ paddingTop:32 }}>
      <button onClick={onBack} style={{ display:"flex", alignItems:"center", gap:8, padding:0, marginBottom:22, border:"none", background:"transparent", cursor:"pointer", color:"#6b6357", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.16em", textTransform:"uppercase" }}>
        <svg width="13" height="10" viewBox="0 0 14 12" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M13 6H1m5-5L1 6l5 5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Все сигналы
      </button>

      <div style={{ background:"#fff", border:"1px solid #e5e0d8", borderTop:`4px solid ${signal.status==="resolved"?"#e84e00":"#d6d0c8"}`, padding:"22px 24px", marginBottom:16 }}>
        <div className="flex-col md:flex-row md:items-start" style={{ display:"flex", justifyContent:"space-between", gap:20 }}>
          <div style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
            <SignalIcon status={signal.status}/>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:7 }}>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:10, letterSpacing:"0.18em", color:"#e84e00" }}>{signal.id}</span>
                <StatusBadge status={signal.status}/>
              </div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:28, letterSpacing:"0.04em", textTransform:"uppercase", color:"#1a1612", lineHeight:1.05 }}>{signal.title}</div>
              <div style={{ marginTop:8, fontFamily:"'Barlow',sans-serif", fontSize:12, color:"#8c8480" }}>{signal.createdAt} · {signal.location}</div>
            </div>
          </div>
          <div style={{ padding:"10px 14px", background:"#f5f2ee", color:"#6b6357", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase" }}>{signal.updatedAt}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-4">
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ background:"#fff", border:"1px solid #e5e0d8", padding:"22px 24px" }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"#1a1612", marginBottom:14 }}>Описание ситуации</div>
            <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:13, lineHeight:1.7, color:"#6b6357" }}>{signal.description}</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3" style={{ marginTop:20 }}>
              {[
                { label:"Автомобиль", value:signal.vehicle },
                { label:"Госномер", value:signal.plate },
                { label:"Людей на месте", value:String(signal.people) },
              ].map(item=>(
                <div key={item.label} style={{ padding:"12px 14px", background:"#f5f2ee" }}>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, letterSpacing:"0.18em", textTransform:"uppercase", color:"#aaa49e", marginBottom:4 }}>{item.label}</div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:13, color:"#1a1612" }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background:"#ded8cf", border:"1px solid #d2cbc2", height:250, position:"relative", overflow:"hidden" }}>
            <svg width="100%" height="100%" viewBox="0 0 700 250" preserveAspectRatio="none" aria-hidden="true">
              <path d="M-20 190C100 130 160 235 290 160S480 40 730 115" fill="none" stroke="#c4bcb2" strokeWidth="28"/>
              <path d="M-20 190C100 130 160 235 290 160S480 40 730 115" fill="none" stroke="#f5f2ee" strokeWidth="18"/>
              <path d="M80 0c20 70 5 120 80 250M430 0c-15 75 40 155 20 250" fill="none" stroke="#c9c2b9" strokeWidth="2" strokeDasharray="8 7"/>
              <circle cx="405" cy="103" r="18" fill="#e84e00" opacity=".18"/>
              <circle cx="405" cy="103" r="8" fill="#e84e00" stroke="#fff" strokeWidth="3"/>
            </svg>
            <div style={{ position:"absolute", left:16, top:16, padding:"9px 12px", background:"rgba(255,255,255,0.92)" }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:10, letterSpacing:"0.13em", textTransform:"uppercase", color:"#1a1612" }}>{signal.location}</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:"#8c8480", marginTop:2 }}>{signal.coordinates}</div>
            </div>
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ background:"#fff", border:"1px solid #e5e0d8", padding:"20px" }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"#1a1612", marginBottom:16 }}>{signal.helper?"Помощник по сигналу":"Итог сигнала"}</div>
            {signal.helper ? (
              <>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                  <div style={{ width:48, height:48, background:"#e84e00", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:16 }}>{signal.helper.initials}</div>
                  <div>
                    <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:16, textTransform:"uppercase", color:"#1a1612" }}>{signal.helper.name}</div>
                    <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.08em", color:"#8c8480", marginTop:2 }}>{signal.helper.vehicle} · рейтинг {signal.helper.rating}</div>
                  </div>
                </div>
                <div style={{ padding:"10px 12px", background:"#f5f2ee", marginBottom:12, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:"#6b6357" }}>{signal.helper.assignedAt}</div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, letterSpacing:"0.06em", color:"#6b6357" }}>{signal.helper.phone}</div>
              </>
            ) : (
              <div style={{ padding:"16px", background:"#f5f2ee", color:"#6b6357", fontFamily:"'Barlow',sans-serif", fontSize:12, lineHeight:1.55 }}>Сигнал был закрыт без назначения помощника.</div>
            )}
          </div>

          <div style={{ background:"#fff", border:"1px solid #e5e0d8", padding:"20px" }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"#1a1612", marginBottom:16 }}>Хронология</div>
            {[
              { title:"Сигнал создан", text:signal.createdAt },
              ...(signal.helper ? [{ title:"Помощник назначен", text:signal.helper.assignedAt }] : []),
              { title:signal.status==="resolved"?"Помощь оказана":"Сигнал отменён", text:signal.updatedAt },
            ].map((item,index)=>(
              <div key={item.title} style={{ display:"flex", gap:10, paddingBottom:index<(signal.helper?2:1)?16:0 }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                  <div style={{ width:9, height:9, background:signal.status==="resolved"?"#e84e00":"#8c8480", marginTop:3 }}/>
                  {index<(signal.helper?2:1) && <div style={{ width:1, flex:1, background:"#e5e0d8", marginTop:3 }}/>}
                </div>
                <div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:11, letterSpacing:"0.08em", textTransform:"uppercase", color:"#1a1612" }}>{item.title}</div>
                  <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:10, color:"#aaa49e", marginTop:2 }}>{item.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignalsSection({ signalId }: { signalId?:string }) {
  const navigate = useNavigate();
  const [filter,setFilter] = useState<"all"|"helped"|"cancelled">("all");
  const selected = signalId ? SIGNALS.find(signal=>signal.id===signalId) : undefined;

  if (selected) return <SignalDetail signal={selected} onBack={()=>navigate("/lk/signals")}/>;

  const visible = SIGNALS.filter(signal=>{
    if (filter==="helped") return Boolean(signal.helper);
    if (filter==="cancelled") return signal.status==="cancelled";
    return true;
  });

  return (
    <div style={{ paddingTop:32 }}>
      <div className="flex-col sm:flex-row sm:items-end" style={{ display:"flex", justifyContent:"space-between", gap:18, marginBottom:22 }}>
        <div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.28em", textTransform:"uppercase", color:"#e84e00", marginBottom:5 }}>Помощь на маршруте</div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:30, letterSpacing:"0.05em", textTransform:"uppercase", color:"#1a1612", lineHeight:1 }}>Мои сигналы</div>
          <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:12, color:"#8c8480", marginTop:7 }}>История сигналов помощи, отправленных из мобильного приложения.</div>
        </div>
        <div style={{ display:"flex", gap:18 }}>
          <div><span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:22, color:"#e84e00" }}>{SIGNALS.length}</span><span style={{ marginLeft:6, fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase", color:"#8c8480" }}>всего</span></div>
          <div><span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:22, color:"#6b6357" }}>{SIGNALS.filter(signal=>signal.helper).length}</span><span style={{ marginLeft:6, fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase", color:"#8c8480" }}>с помощником</span></div>
        </div>
      </div>

      <div style={{ display:"flex", marginBottom:12 }}>
        {[
          { key:"all" as const, label:"Все" },
          { key:"helped" as const, label:"С помощником" },
          { key:"cancelled" as const, label:"Отменённые" },
        ].map(item=>(
          <button key={item.key} onClick={()=>setFilter(item.key)} style={{ padding:"8px 15px", border:"1px solid #d6d0c8", borderRight:item.key!=="cancelled"?"none":"1px solid #d6d0c8", background:filter===item.key?"#e84e00":"#fff", color:filter===item.key?"#fff":"#6b6357", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase" }}>{item.label}</button>
        ))}
      </div>

      <div style={{ background:"#fff", borderTop:"1px solid #e5e0d8" }}>
        {visible.map(signal=>(
          <button key={signal.id} onClick={()=>navigate(`/lk/signals/${signal.id}`)}
            style={{ width:"100%", padding:"16px 18px", border:"none", borderBottom:"1px solid #e5e0d8", background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", gap:16, textAlign:"left" }}
          >
            <SignalIcon status={signal.status}/>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:9, flexWrap:"wrap", marginBottom:5 }}>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:9, letterSpacing:"0.14em", color:"#aaa49e" }}>{signal.id}</span>
                <StatusBadge status={signal.status}/>
              </div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:17, letterSpacing:"0.04em", textTransform:"uppercase", color:"#1a1612", marginBottom:4 }}>{signal.title}</div>
              <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:11, color:"#8c8480", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{signal.location} · {signal.vehicle}</div>
            </div>
            <div className="hidden md:block" style={{ width:180, flexShrink:0 }}>
              {signal.helper ? (
                <>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:11, textTransform:"uppercase", color:"#1a1612" }}>{signal.helper.name}</div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.08em", color:"#aaa49e", marginTop:3 }}>Помощник по сигналу</div>
                </>
              ) : <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:"#aaa49e" }}>Помощник не назначен</div>}
            </div>
            <div className="hidden sm:block" style={{ width:116, flexShrink:0, fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.08em", color:"#aaa49e", textAlign:"right" }}>{signal.createdAt}</div>
            <svg width="7" height="12" viewBox="0 0 8 14" fill="none" stroke="#aaa49e" strokeWidth="1.5"><path d="m1 1 6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        ))}
      </div>
    </div>
  );
}
