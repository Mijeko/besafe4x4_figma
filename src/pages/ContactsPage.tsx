import { useState } from "react";

const CONTACTS = [
  { icon:"📍", label:"Адрес", value:"Москва, ул. Авиамоторная, 50с2, офис 412" },
  { icon:"📞", label:"Телефон", value:"+7 (495) 123-45-67" },
  { icon:"✉️", label:"Email", value:"hello@gryaz-kamni.ru" },
  { icon:"⏰", label:"Часы работы", value:"Пн–Пт: 10:00–19:00 МСК" },
];

const SOCIAL = [
  { name:"VK", url:"#", color:"#4c75a3" },
  { name:"Telegram", url:"#", color:"#2aabee" },
  { name:"YouTube", url:"#", color:"#ff0000" },
];

const TOPICS = ["Общий вопрос","Партнёрство","Реклама","Технические проблемы","Жалоба","Другое"];

export function ContactsPage() {
  const [form,setForm] = useState({ name:"",email:"",topic:"",message:"" });
  const [sent,setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if(form.name&&form.email&&form.message) setSent(true);
  };

  const inp: React.CSSProperties = { width:"100%", padding:"11px 14px", border:"1px solid #e0dbd4", outline:"none", fontFamily:"'Barlow',sans-serif", fontSize:14, color:"#1a1612", background:"#fff", boxSizing:"border-box" };

  return (
    <div style={{ maxWidth:1280, margin:"0 auto", padding:"56px 24px 80px" }}>

      {/* header */}
      <div style={{ marginBottom:52 }}>
        <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, letterSpacing:"0.28em", textTransform:"uppercase", color:"#e84e00", marginBottom:8 }}>Связаться</p>
        <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:44, letterSpacing:"0.06em", textTransform:"uppercase", color:"#1a1612", lineHeight:1, margin:0 }}>Контакты</h1>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"380px 1fr", gap:48 }}>

        {/* LEFT */}
        <div style={{ display:"flex", flexDirection:"column", gap:32 }}>

          {/* contact list */}
          <div style={{ background:"#fff", border:"1px solid #ece8e3" }}>
            <div style={{ height:4, background:"linear-gradient(90deg,#e84e00,#ff7a2f 60%,#e84e00)" }}/>
            <div style={{ padding:"28px" }}>
              <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:22, letterSpacing:"0.06em", textTransform:"uppercase", color:"#1a1612", margin:"0 0 24px" }}>Реквизиты</h2>
              {CONTACTS.map(c=>(
                <div key={c.label} style={{ display:"flex", gap:16, paddingBottom:20, marginBottom:20, borderBottom:"1px solid #f5f2ee" }}>
                  <span style={{ fontSize:22, flexShrink:0, lineHeight:1 }}>{c.icon}</span>
                  <div>
                    <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:"#aaa49e", marginBottom:4 }}>{c.label}</div>
                    <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:14, color:"#1a1612", lineHeight:1.4 }}>{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* socials */}
          <div style={{ background:"#fff", border:"1px solid #ece8e3", padding:"24px 28px" }}>
            <h3 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:16, letterSpacing:"0.1em", textTransform:"uppercase", color:"#1a1612", margin:"0 0 16px" }}>Социальные сети</h3>
            {SOCIAL.map(s=>(
              <a key={s.name} href={s.url} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:"1px solid #f5f2ee", textDecoration:"none" }}>
                <span style={{ width:32, height:32, background:s.color, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, color:"#fff", letterSpacing:"0.06em" }}>{s.name[0]}</span>
                </span>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:600, fontSize:14, letterSpacing:"0.08em", textTransform:"uppercase", color:"#1a1612" }}>{s.name}</span>
              </a>
            ))}
          </div>

          {/* map placeholder */}
          <div style={{ background:"#e8e4df", height:200, position:"relative", overflow:"hidden", border:"1px solid #ece8e3" }}>
            <img src="https://images.unsplash.com/photo-1599413142605-dbf742e4c5b9?w=500&h=250&fit=crop&auto=format" alt="Карта" style={{ width:"100%", height:"100%", objectFit:"cover", opacity:0.4 }}/>
            <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ background:"#e84e00", padding:"10px 20px" }}>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, letterSpacing:"0.2em", textTransform:"uppercase", color:"#fff" }}>Открыть карту</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — form */}
        <div style={{ background:"#fff", border:"1px solid #ece8e3" }}>
          <div style={{ height:4, background:"linear-gradient(90deg,#e84e00,#ff7a2f 60%,#e84e00)" }}/>
          <div style={{ padding:"36px 40px" }}>

            {sent ? (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:400, gap:20, textAlign:"center" }}>
                <div style={{ width:64, height:64, background:"#3a9e5f", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <svg width="28" height="22" viewBox="0 0 28 22" fill="none" stroke="white" strokeWidth="3"><path d="M2 11l8 8 16-16" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:28, letterSpacing:"0.06em", textTransform:"uppercase", color:"#1a1612", marginBottom:8 }}>Сообщение отправлено!</div>
                  <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:14, color:"#8c8480" }}>Мы ответим в течение одного рабочего дня.</div>
                </div>
                <button onClick={()=>{ setSent(false); setForm({name:"",email:"",topic:"",message:""}); }} style={{ padding:"11px 28px", background:"#e84e00", border:"none", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, letterSpacing:"0.14em", textTransform:"uppercase", color:"#fff" }}>
                  Написать ещё
                </button>
              </div>
            ) : (
              <>
                <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:28, letterSpacing:"0.06em", textTransform:"uppercase", color:"#1a1612", lineHeight:1, margin:"0 0 8px" }}>Напишите нам</h2>
                <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:14, color:"#8c8480", margin:"0 0 32px" }}>Ответим в течение одного рабочего дня.</p>

                <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:20 }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                    <div>
                      <label style={{ display:"block", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:"#6b6357", marginBottom:6 }}>Имя</label>
                      <input required value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Иван Морозов" style={inp}
                        onFocus={e=>(e.target as HTMLInputElement).style.borderColor="#e84e00"}
                        onBlur={e=>(e.target as HTMLInputElement).style.borderColor="#e0dbd4"}
                      />
                    </div>
                    <div>
                      <label style={{ display:"block", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:"#6b6357", marginBottom:6 }}>Email</label>
                      <input required type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="ivan@mail.ru" style={inp}
                        onFocus={e=>(e.target as HTMLInputElement).style.borderColor="#e84e00"}
                        onBlur={e=>(e.target as HTMLInputElement).style.borderColor="#e0dbd4"}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display:"block", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:"#6b6357", marginBottom:6 }}>Тема</label>
                    <select value={form.topic} onChange={e=>setForm(f=>({...f,topic:e.target.value}))} style={{ ...inp, appearance:"none" }}>
                      <option value="">Выберите тему</option>
                      {TOPICS.map(t=><option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={{ display:"block", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:"#6b6357", marginBottom:6 }}>Сообщение</label>
                    <textarea required value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} placeholder="Опишите ваш вопрос или предложение..." rows={6} style={{ ...inp, resize:"none" }}
                      onFocus={e=>(e.target as HTMLTextAreaElement).style.borderColor="#e84e00"}
                      onBlur={e=>(e.target as HTMLTextAreaElement).style.borderColor="#e0dbd4"}
                    />
                  </div>

                  <button type="submit" className="hover:bg-[#c93e00] transition-colors" style={{ padding:"14px 0", background:"#e84e00", border:"none", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, letterSpacing:"0.16em", textTransform:"uppercase", color:"#fff" }}>
                    Отправить сообщение
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
