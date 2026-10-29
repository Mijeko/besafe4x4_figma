import { useEffect, useRef, useState } from "react";

type NotificationSettings = {
  enabled: boolean;
  browser: boolean;
  email: boolean;
  signals: boolean;
  messages: boolean;
  community: boolean;
  orders: boolean;
  news: boolean;
};

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled:true,
  browser:true,
  email:false,
  signals:true,
  messages:true,
  community:true,
  orders:true,
  news:false,
};

const STORAGE_KEY = "offroad-notification-settings";

function Toggle({ active, onChange, label }: { active:boolean; onChange:()=>void; label:string }) {
  return (
    <button type="button" role="switch" aria-checked={active} aria-label={label} onClick={onChange}
      style={{ width:42, height:24, borderRadius:12, border:"none", background:active?"#e84e00":"#d6d0c8", cursor:"pointer", position:"relative", flexShrink:0, transition:"background 0.2s" }}
    >
      <span style={{ position:"absolute", top:3, left:active?21:3, width:18, height:18, borderRadius:"50%", background:"#fff", boxShadow:"0 1px 3px rgba(26,22,18,0.18)", transition:"left 0.2s" }}/>
    </button>
  );
}

export default function NotificationWidget() {
  const [open,setOpen] = useState(false);
  const [settings,setSettings] = useState<NotificationSettings>(()=>{
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...DEFAULT_SETTINGS,...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    localStorage.setItem(STORAGE_KEY,JSON.stringify(settings));
  },[settings]);

  useEffect(()=>{
    if (!open) return;
    const closeOnOutside = (event:MouseEvent) => {
      if (rootRef.current&&!rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event:KeyboardEvent) => {
      if (event.key==="Escape") setOpen(false);
    };
    document.addEventListener("mousedown",closeOnOutside);
    document.addEventListener("keydown",closeOnEscape);
    return ()=>{
      document.removeEventListener("mousedown",closeOnOutside);
      document.removeEventListener("keydown",closeOnEscape);
    };
  },[open]);

  const toggle = (key:keyof NotificationSettings) => setSettings(current=>({...current,[key]:!current[key]}));
  const categories: { key:keyof NotificationSettings; title:string; description:string; icon:React.ReactNode }[] = [
    { key:"signals", title:"Сигналы помощи", description:"Результаты и изменения по вашим сигналам", icon:<><path d="M8 14s-5-4-5-8.5a5 5 0 1 1 10 0C13 10 8 14 8 14Z"/><path d="M8 3.5v3M8 9h.01"/></> },
    { key:"messages", title:"Сообщения", description:"Новые сообщения от участников", icon:<path d="M2 2.5h12v8H7l-3.5 3v-3H2v-8Z"/> },
    { key:"community", title:"События и клубы", description:"Изменения записей, анонсы и приглашения", icon:<><rect x="2" y="3.5" width="12" height="10"/><path d="M5 2v3M11 2v3M2 7h12"/></> },
    { key:"orders", title:"Заказы и покупки", description:"Оплата, сборка, доставка и получение", icon:<><path d="M2.5 5h11l-1 9h-9z"/><path d="M5.5 6V4a2.5 2.5 0 0 1 5 0v2"/></> },
    { key:"news", title:"Новости платформы", description:"Новые функции и важные объявления", icon:<><path d="M3 13V3h10v10H3Z"/><path d="M6 6h4M6 9h4"/></> },
  ];

  return (
    <div ref={rootRef} style={{ position:"fixed", right:24, bottom:24, zIndex:120 }}>
      {open&&(
        <div style={{ position:"absolute", right:0, bottom:68, width:360, maxWidth:"calc(100vw - 32px)", maxHeight:"calc(100vh - 110px)", overflowY:"auto", background:"#fff", border:"1px solid #d6d0c8", boxShadow:"0 20px 56px rgba(26,22,18,0.2)" }}>
          <div style={{ padding:"18px 20px", background:"#fff", borderTop:"4px solid #e84e00", borderBottom:"1px solid #ece8e3", display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:16 }}>
            <div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:18, letterSpacing:"0.08em", textTransform:"uppercase", color:"#1a1612" }}>Уведомления</div>
              <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:11, color:"#8c8480", marginTop:3 }}>Выберите, какие обновления получать</div>
            </div>
            <button onClick={()=>setOpen(false)} aria-label="Закрыть настройки уведомлений" style={{ width:28, height:28, border:"1px solid #e5e0d8", background:"transparent", color:"#8c8480", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m1 1 10 10M11 1 1 11" strokeLinecap="round"/></svg>
            </button>
          </div>

          <div style={{ padding:"14px 18px", background:"#fff4ee", borderBottom:"1px solid #f5dfd4", display:"flex", alignItems:"center", justifyContent:"space-between", gap:16 }}>
            <div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:13, letterSpacing:"0.08em", textTransform:"uppercase", color:"#1a1612" }}>Получать уведомления</div>
              <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:10, color:"#8c8480", marginTop:2 }}>{settings.enabled?"Уведомления включены":"Все уведомления приостановлены"}</div>
            </div>
            <Toggle active={settings.enabled} onChange={()=>toggle("enabled")} label="Получать уведомления"/>
          </div>

          <div style={{ opacity:settings.enabled?1:0.48, pointerEvents:settings.enabled?"auto":"none" }}>
            <div style={{ padding:"14px 18px 7px", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:"#aaa49e" }}>Каналы</div>
            {[
              { key:"browser" as const, title:"На сайте", description:"Виджет и всплывающие уведомления" },
              { key:"email" as const, title:"По электронной почте", description:"Письма на адрес из профиля" },
            ].map(item=>(
              <div key={item.key} style={{ padding:"10px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:16 }}>
                <div><div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:12, letterSpacing:"0.06em", textTransform:"uppercase", color:"#1a1612" }}>{item.title}</div><div style={{ fontFamily:"'Barlow',sans-serif", fontSize:10, color:"#aaa49e", marginTop:2 }}>{item.description}</div></div>
                <Toggle active={settings[item.key]} onChange={()=>toggle(item.key)} label={item.title}/>
              </div>
            ))}

            <div style={{ padding:"15px 18px 7px", borderTop:"1px solid #f0ece8", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:"#aaa49e" }}>Темы</div>
            {categories.map(item=>(
              <div key={item.key} style={{ padding:"10px 18px", display:"flex", alignItems:"center", gap:11, borderBottom:"1px solid #f5f2ee" }}>
                <div style={{ width:30, height:30, background:"#f5f2ee", color:settings[item.key]?"#e84e00":"#aaa49e", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">{item.icon}</svg>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:12, letterSpacing:"0.05em", textTransform:"uppercase", color:"#1a1612" }}>{item.title}</div>
                  <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:10, color:"#aaa49e", marginTop:2 }}>{item.description}</div>
                </div>
                <Toggle active={settings[item.key]} onChange={()=>toggle(item.key)} label={item.title}/>
              </div>
            ))}
          </div>
          <div style={{ padding:"11px 18px", background:"#faf8f5", fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.12em", textTransform:"uppercase", color:"#aaa49e", textAlign:"center" }}>Настройки сохраняются автоматически</div>
        </div>
      )}

      <button onClick={()=>setOpen(current=>!current)} aria-expanded={open} aria-label="Настройки уведомлений"
        style={{ width:56, height:56, borderRadius:"50%", border:"3px solid #fff", background:"#e84e00", color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 8px 24px rgba(232,78,0,0.32)", position:"relative", transition:"transform 0.2s", transform:open?"rotate(-8deg)":"none" }}
      >
        <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>
        </svg>
        {!open&&settings.enabled&&<span style={{ position:"absolute", top:2, right:2, width:11, height:11, borderRadius:"50%", background:"#fff", border:"2px solid #e84e00" }}/>}
      </button>
    </div>
  );
}
