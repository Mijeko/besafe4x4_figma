import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import NotificationWidget from "../components/NotificationWidget";

// ── Types ─────────────────────────────────────────────────────

type SellerProduct = {
  id: number; name: string; category: string; price: number; stock: number;
  sold: number; status: "active" | "draft" | "archived"; img: string;
  description: string; brand: string;
};

type SellerOrder = {
  id: string; date: string; customer: string; phone: string; address: string;
  items: { productId: number; name: string; qty: number; price: number; variant?: string }[];
  total: number; status: "new" | "processing" | "shipped" | "delivered" | "cancelled";
  delivery: string; comment: string;
};

// ── Sample data ───────────────────────────────────────────────

const INIT_PRODUCTS: SellerProduct[] = [
  { id:1, name:"Warn VR EVO 10", category:"Лебёдки", price:64900, stock:3, sold:47, status:"active", brand:"Warn", img:"https://images.unsplash.com/photo-1620029188962-be2c6486593d?w=200&h=160&fit=crop&auto=format", description:"Электрическая лебёдка 10 000 lbs с бесщёточным мотором." },
  { id:2, name:"BFGoodrich MT/A KM3", category:"Шины", price:18900, stock:12, sold:183, status:"active", brand:"BFGoodrich", img:"https://images.unsplash.com/photo-1605661480059-884578ac8ec8?w=200&h=160&fit=crop&auto=format", description:"Mud Terrain 35×12.50 R17, усиленный корд." },
  { id:3, name:"Lift Kit 50mm OME", category:"Лифт-киты", price:42500, stock:5, sold:22, status:"active", brand:"OME", img:"https://images.unsplash.com/photo-1640636430727-649f73271766?w=200&h=160&fit=crop&auto=format", description:"Пружины + амортизаторы Old Man Emu, 50 мм." },
  { id:4, name:"Защита картера ТСС", category:"Защита", price:8900, stock:0, sold:91, status:"archived", brand:"ТСС", img:"https://images.unsplash.com/photo-1640636430737-de4ae2656d43?w=200&h=160&fit=crop&auto=format", description:"Алюминиевая защита картера 6 мм." },
  { id:5, name:"LED Балка 40\"", category:"Освещение", price:34900, stock:2, sold:8, status:"draft", brand:"Rigid", img:"https://images.unsplash.com/photo-1640636430727-649f73271766?w=200&h=160&fit=crop&auto=format", description:"240 Вт, 20 160 лм, IP68." },
];

const INIT_ORDERS: SellerOrder[] = [
  { id:"ORD-3021", date:"6 сен 2026", customer:"Алексей Петров", phone:"+7 (916) 543-21-00", address:"Москва, ул. Ленина, 10, кв. 5", items:[{ productId:1, name:"Warn VR EVO 10", qty:1, price:64900 }], total:64900, status:"new", delivery:"СДЭК курьером", comment:"Позвоните перед доставкой" },
  { id:"ORD-3018", date:"5 сен 2026", customer:"Дмитрий Козлов", phone:"+7 (921) 111-22-33", address:"СПб, пр. Невский, 45", items:[{ productId:2, name:"BFGoodrich MT/A KM3", qty:4, price:18900, variant:"35x12.50 R17" }], total:75600, status:"processing", delivery:"СДЭК до ПВЗ", comment:"" },
  { id:"ORD-3015", date:"4 сен 2026", customer:"Мария Сидорова", phone:"+7 (903) 987-65-43", address:"Краснодар, ул. Красная, 33", items:[{ productId:3, name:"Lift Kit 50mm OME", qty:1, price:42500 },{ productId:2, name:"BFGoodrich MT/A KM3", qty:2, price:18900, variant:"33x12.50 R17" }], total:80300, status:"shipped", delivery:"Курьером", comment:"" },
  { id:"ORD-3010", date:"1 сен 2026", customer:"Иван Морозов", phone:"+7 (916) 123-45-67", address:"Москва, Садовая, 22", items:[{ productId:2, name:"BFGoodrich MT/A KM3", qty:1, price:18900, variant:"37x12.50 R17" }], total:18900, status:"delivered", delivery:"Почта России", comment:"" },
  { id:"ORD-3005", date:"29 авг 2026", customer:"Роман Иванов", phone:"+7 (912) 000-11-22", address:"Екатеринбург, ул. Горького, 5", items:[{ productId:5, name:"LED Балка 40\"", qty:1, price:34900 }], total:34900, status:"cancelled", delivery:"СДЭК", comment:"Не устроил размер" },
];

const CATEGORIES_LIST = ["Лебёдки","Шины","Лифт-киты","Защита","Освещение","Багажники","Одежда","Связь"];

const STATUS_ORDER: Record<string, { bg:string; color:string; border:string; label:string }> = {
  new:        { bg:"#eff6ff", color:"#2563eb", border:"#bfdbfe", label:"Новый" },
  processing: { bg:"#fff8f0", color:"#d97706", border:"#fde68a", label:"Обрабатывается" },
  shipped:    { bg:"#f0f9ff", color:"#0891b2", border:"#bae6fd", label:"Отправлен" },
  delivered:  { bg:"#f0fdf4", color:"#16a34a", border:"#bbf7d0", label:"Доставлен" },
  cancelled:  { bg:"#fff1f2", color:"#e11d48", border:"#fecdd3", label:"Отменён" },
};

const STATUS_PROD: Record<string, { bg:string; color:string; border:string; label:string }> = {
  active:   { bg:"#f0fdf4", color:"#16a34a", border:"#bbf7d0", label:"Активен" },
  draft:    { bg:"#f8f8f8", color:"#6b7280", border:"#e5e7eb", label:"Черновик" },
  archived: { bg:"#fff1f2", color:"#e11d48", border:"#fecdd3", label:"Архив" },
};

const inp: React.CSSProperties = { width:"100%", padding:"9px 12px", border:"1.5px solid #e5e0d8", outline:"none", fontFamily:"'Barlow',sans-serif", fontSize:13, color:"#1a1612", background:"#fff", boxSizing:"border-box", transition:"border-color 0.15s" };
const lbl: React.CSSProperties = { display:"block", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:"#8c8480", marginBottom:5 };

const focusOr = (e: React.FocusEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => (e.target as HTMLElement).style.borderColor = "#e84e00";
const focusGr = (e: React.FocusEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => (e.target as HTMLElement).style.borderColor = "#16a34a";
const blurGy  = (e: React.FocusEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => (e.target as HTMLElement).style.borderColor = "#e5e0d8";

// ── Product Form Page ──────────────────────────────────────────

type ProdForm = { name:string; category:string; brand:string; price:string; oldPrice:string; stock:string; description:string; specs:string; tags:string; status:"active"|"draft"|"archived" };
const EMPTY_PROD: ProdForm = { name:"", category:"Лебёдки", brand:"", price:"", oldPrice:"", stock:"", description:"", specs:"", tags:"", status:"draft" };

const FIELD_GROUPS = [
  { title:"Основная информация", fields:["name","category","brand"] },
  { title:"Цена и наличие",      fields:["price","oldPrice","stock"] },
  { title:"Описание",            fields:["description","specs","tags"] },
];

function ProductFormPage({ product, onBack, onSave }: { product?: SellerProduct; onBack:()=>void; onSave:(p:SellerProduct)=>void }) {
  const isNew = !product;
  const [form, setForm] = useState<ProdForm>(product
    ? { name:product.name, category:product.category, brand:product.brand, price:String(product.price), oldPrice:"", stock:String(product.stock), description:product.description, specs:"", tags:"", status:product.status }
    : EMPTY_PROD);
  const [errors, setErrors] = useState<Partial<Record<keyof ProdForm, string>>>({});
  const [saved, setSaved] = useState(false);

  const set = (k: keyof ProdForm, v: string) => {
    setForm(f=>({...f,[k]:v}));
    if (errors[k]) setErrors(e=>({...e,[k]:undefined}));
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim())  e.name  = "Обязательное поле";
    if (!form.price.trim()) e.price = "Укажите цену";
    if (form.price && isNaN(Number(form.price))) e.price = "Должно быть числом";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = () => {
    if (!validate()) return;
    onSave({
      id:    product?.id ?? Date.now(),
      img:   product?.img ?? "https://images.unsplash.com/photo-1596507931135-75f699668356?w=200&h=160&fit=crop&auto=format",
      sold:  product?.sold ?? 0,
      name:  form.name.trim(),
      category: form.category,
      brand: form.brand.trim(),
      price: Number(form.price),
      stock: Number(form.stock) || 0,
      description: form.description.trim(),
      status: form.status,
    });
    setSaved(true);
    setTimeout(()=>{ onBack(); }, 800);
  };

  const inp2: React.CSSProperties = { ...inp, padding:"11px 14px", fontSize:14 };

  return (
    <div>
      {/* breadcrumb */}
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:28 }}>
        <button onClick={onBack} style={{ display:"flex", alignItems:"center", gap:7, background:"none", border:"none", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:"#8c8480", padding:0 }}
          onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.color="#e84e00"}
          onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.color="#8c8480"}
        >
          <svg width="12" height="10" viewBox="0 0 14 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M13 6H1M6 1L1 6l5 5"/></svg>
          Мои товары
        </button>
        <svg width="5" height="8" viewBox="0 0 6 10" fill="none" stroke="#d6d0c8" strokeWidth="1.5" strokeLinecap="round"><path d="M1 1l4 4-4 4"/></svg>
        <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:"#6b6357" }}>{isNew ? "Новый товар" : "Редактирование"}</span>
      </div>

      {/* page title */}
      <div style={{ marginBottom:32 }}>
        <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:34, letterSpacing:"0.06em", textTransform:"uppercase", color:"#1a1612", lineHeight:1, margin:"0 0 8px" }}>
          {isNew ? "Новый товар" : form.name || "Редактирование товара"}
        </h1>
        <div style={{ width:44, height:3, background:"#e84e00" }}/>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:24, alignItems:"start" }}>
        {/* LEFT — form fields */}
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

          {/* Basic info */}
          <div style={{ background:"#fff", border:"1.5px solid #ede9e2", padding:"24px 28px" }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:12, letterSpacing:"0.2em", textTransform:"uppercase", color:"#1a1612", marginBottom:20, paddingBottom:12, borderBottom:"1px solid #f0ece6" }}>Основная информация</div>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div>
                <label style={lbl}>Название товара *</label>
                <input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Warn VR EVO 10-S" style={{ ...inp2, borderColor:errors.name?"#e11d48":undefined }} onFocus={focusOr} onBlur={blurGy}/>
                {errors.name && <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, color:"#e11d48", marginTop:4, letterSpacing:"0.08em" }}>{errors.name}</div>}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                <div>
                  <label style={lbl}>Категория</label>
                  <div style={{ position:"relative" }}>
                    <select value={form.category} onChange={e=>set("category",e.target.value)} style={{ ...inp2, appearance:"none", paddingRight:32 }} onFocus={focusOr} onBlur={blurGy}>
                      {CATEGORIES_LIST.map(c=><option key={c}>{c}</option>)}
                    </select>
                    <svg width="10" height="6" viewBox="0 0 12 8" fill="none" stroke="#aaa59f" strokeWidth="1.5" style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}><path d="M1 1l5 5 5-5" strokeLinecap="round"/></svg>
                  </div>
                </div>
                <div>
                  <label style={lbl}>Бренд / Производитель</label>
                  <input value={form.brand} onChange={e=>set("brand",e.target.value)} placeholder="Warn" style={inp2} onFocus={focusOr} onBlur={blurGy}/>
                </div>
              </div>
              <div>
                <label style={lbl}>Теги (через запятую)</label>
                <input value={form.tags} onChange={e=>set("tags",e.target.value)} placeholder="лебёдка, 12v, синтетический трос" style={inp2} onFocus={focusOr} onBlur={blurGy}/>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div style={{ background:"#fff", border:"1.5px solid #ede9e2", padding:"24px 28px" }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:12, letterSpacing:"0.2em", textTransform:"uppercase", color:"#1a1612", marginBottom:20, paddingBottom:12, borderBottom:"1px solid #f0ece6" }}>Цена и наличие</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
              <div>
                <label style={lbl}>Цена продажи, ₽ *</label>
                <div style={{ position:"relative" }}>
                  <input type="number" value={form.price} onChange={e=>set("price",e.target.value)} placeholder="64900" min={0} style={{ ...inp2, paddingRight:28, borderColor:errors.price?"#e11d48":undefined }} onFocus={focusOr} onBlur={blurGy}/>
                  <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, color:"#aaa59f" }}>₽</span>
                </div>
                {errors.price && <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, color:"#e11d48", marginTop:4, letterSpacing:"0.08em" }}>{errors.price}</div>}
              </div>
              <div>
                <label style={lbl}>Старая цена (зачёркнутая)</label>
                <div style={{ position:"relative" }}>
                  <input type="number" value={form.oldPrice} onChange={e=>set("oldPrice",e.target.value)} placeholder="74900" min={0} style={{ ...inp2, paddingRight:28 }} onFocus={focusOr} onBlur={blurGy}/>
                  <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, color:"#aaa59f" }}>₽</span>
                </div>
              </div>
              <div>
                <label style={lbl}>Остаток, шт.</label>
                <input type="number" value={form.stock} onChange={e=>set("stock",e.target.value)} placeholder="5" min={0} style={inp2} onFocus={focusOr} onBlur={blurGy}/>
              </div>
            </div>
            {form.price && form.oldPrice && Number(form.oldPrice) > Number(form.price) && (
              <div style={{ marginTop:12, display:"flex", alignItems:"center", gap:8, padding:"8px 14px", background:"#f0fdf4", border:"1px solid #bbf7d0" }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round"><path d="M2 8l4 4 8-8"/></svg>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color:"#16a34a" }}>
                  Скидка {Math.round((1 - Number(form.price)/Number(form.oldPrice))*100)}%
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <div style={{ background:"#fff", border:"1.5px solid #ede9e2", padding:"24px 28px" }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:12, letterSpacing:"0.2em", textTransform:"uppercase", color:"#1a1612", marginBottom:20, paddingBottom:12, borderBottom:"1px solid #f0ece6" }}>Описание и характеристики</div>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div>
                <label style={lbl}>Описание товара</label>
                <textarea value={form.description} onChange={e=>set("description",e.target.value)} rows={5} placeholder="Подробное описание товара, его особенности и преимущества…" style={{ ...inp2, resize:"vertical", lineHeight:1.6 }} onFocus={focusOr} onBlur={blurGy}/>
              </div>
              <div>
                <label style={lbl}>Характеристики (каждая с новой строки: Параметр: Значение)</label>
                <textarea value={form.specs} onChange={e=>set("specs",e.target.value)} rows={5} placeholder={"Тяговое усилие: 10 000 lbs\nТип мотора: Бесщёточный\nДлина троса: 28 м\nВес: 17.2 кг\nНапряжение: 12V"} style={{ ...inp2, resize:"vertical", lineHeight:1.7, fontFamily:"'Barlow',sans-serif", fontSize:13 }} onFocus={focusOr} onBlur={blurGy}/>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — status + preview + actions */}
        <div style={{ display:"flex", flexDirection:"column", gap:16, position:"sticky", top:20 }}>

          {/* status */}
          <div style={{ background:"#fff", border:"1.5px solid #ede9e2", padding:"20px 22px" }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:12, letterSpacing:"0.2em", textTransform:"uppercase", color:"#1a1612", marginBottom:16 }}>Статус публикации</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {(["active","draft","archived"] as const).map(s=>{
                const sm = STATUS_PROD[s];
                const active = form.status === s;
                return (
                  <button key={s} type="button" onClick={()=>set("status",s)} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", border:`1.5px solid ${active?sm.border:"#ede9e2"}`, background:active?sm.bg:"transparent", cursor:"pointer", textAlign:"left", transition:"all 0.15s" }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:active?sm.color:"#d6d0c8", flexShrink:0 }}/>
                    <div>
                      <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.14em", textTransform:"uppercase", color:active?sm.color:"#6b6357" }}>{sm.label}</div>
                      <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:"#aaa59f", marginTop:1 }}>
                        {s==="active"?"Отображается в каталоге":s==="draft"?"Не виден покупателям":"Скрыт и заархивирован"}
                      </div>
                    </div>
                    {active && <svg width="12" height="10" viewBox="0 0 14 12" fill="none" stroke={sm.color} strokeWidth="2" strokeLinecap="round" style={{ marginLeft:"auto" }}><path d="M1 6l4 4 8-8"/></svg>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* preview card */}
          {(form.name || form.price) && (
            <div style={{ background:"#fff", border:"1.5px solid #ede9e2", overflow:"hidden" }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:"#aaa59f", padding:"12px 16px", background:"#faf8f5", borderBottom:"1px solid #f0ece6" }}>Предпросмотр карточки</div>
              <div style={{ padding:"14px 16px" }}>
                <div style={{ width:"100%", height:120, background:"#f5f2ee", overflow:"hidden", marginBottom:12 }}>
                  <img src={product?.img ?? "https://images.unsplash.com/photo-1596507931135-75f699668356?w=300&h=200&fit=crop&auto=format"} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                </div>
                {form.category && <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:"#aaa59f", marginBottom:4 }}>{form.category}</div>}
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, letterSpacing:"0.04em", textTransform:"uppercase", color:"#1a1612", lineHeight:1.1, marginBottom:8 }}>{form.name || "Название товара"}</div>
                <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
                  {form.price && <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:18, color:"#e84e00" }}>{Number(form.price).toLocaleString("ru")} ₽</span>}
                  {form.oldPrice && Number(form.oldPrice) > Number(form.price) && <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, color:"#aaa59f", textDecoration:"line-through" }}>{Number(form.oldPrice).toLocaleString("ru")} ₽</span>}
                </div>
              </div>
            </div>
          )}

          {/* save / cancel */}
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            <button onClick={save} style={{ padding:"13px 0", border:"none", background:saved?"#16a34a":"#e84e00", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"#fff", transition:"background 0.2s", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              {saved
                ? <><svg width="12" height="10" viewBox="0 0 14 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M1 6l4 4 8-8"/></svg> Сохранено</>
                : isNew ? "Создать товар" : "Сохранить изменения"
              }
            </button>
            <button onClick={onBack} style={{ padding:"11px 0", border:"1.5px solid #e5e0d8", background:"transparent", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"#6b6357" }}>
              Отмена
            </button>
          </div>

          {/* danger zone for existing product */}
          {!isNew && (
            <div style={{ padding:"14px 16px", background:"#fff", border:"1.5px solid #fecdd3" }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:"#e11d48", marginBottom:8 }}>Опасная зона</div>
              <button onClick={onBack} style={{ width:"100%", padding:"9px 0", border:"1.5px solid #fecdd3", background:"transparent", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:"#e11d48" }}>
                Удалить товар
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Order Modal ────────────────────────────────────────────────

function OrderModal({ order, products, onClose, onSave }: { order?: SellerOrder; products:SellerProduct[]; onClose:()=>void; onSave:(o:SellerOrder)=>void }) {
  const isNew = !order;
  const [form, setForm] = useState({ customer:order?.customer??"", phone:order?.phone??"", address:order?.address??"", delivery:order?.delivery??"СДЭК до ПВЗ", comment:order?.comment??"", status:(order?.status??"new") as SellerOrder["status"] });
  const [orderItems, setOrderItems] = useState(order?.items??[]);
  const [addProd, setAddProd] = useState(String(products[0]?.id??""));
  const [addQty, setAddQty] = useState("1");
  const total = orderItems.reduce((s,i)=>s+i.price*i.qty, 0);
  const addItem = () => {
    const prod = products.find(p=>p.id===Number(addProd));
    if(!prod) return;
    setOrderItems(prev=>{ const ex=prev.find(i=>i.productId===prod.id); if(ex) return prev.map(i=>i.productId===prod.id?{...i,qty:i.qty+Number(addQty)}:i); return [...prev,{ productId:prod.id, name:prod.name, qty:Number(addQty), price:prod.price }]; });
  };
  const save = () => {
    if(!form.customer||!form.phone||orderItems.length===0) return;
    onSave({ id:order?.id??`ORD-${Date.now().toString().slice(-4)}`, date:order?.date??new Date().toLocaleDateString("ru-RU",{day:"numeric",month:"short",year:"numeric"}), ...form, items:orderItems, total });
    onClose();
  };
  return (
    <div onClick={e=>{ if(e.target===e.currentTarget) onClose(); }} style={{ position:"fixed", inset:0, zIndex:70, background:"rgba(26,22,18,0.5)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ width:"100%", maxWidth:600, background:"#fff", boxShadow:"0 24px 64px rgba(0,0,0,0.16)", maxHeight:"92vh", overflowY:"auto" }}>
        <div style={{ height:4, background:"linear-gradient(90deg,#16a34a,#4ade80 60%,#16a34a)" }}/>
        <div style={{ padding:"28px 28px 32px" }}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24 }}>
            <div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.28em", textTransform:"uppercase", color:"#16a34a", marginBottom:4 }}>Заказы</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:22, letterSpacing:"0.06em", textTransform:"uppercase", color:"#1a1612", lineHeight:1 }}>{isNew?"Новый заказ":`Заказ ${order.id}`}</div>
            </div>
            <button onClick={onClose} style={{ width:30, height:30, border:"1.5px solid #e5e0d8", background:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#8c8480" }}>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 1l10 10M11 1L1 11" strokeLinecap="round"/></svg>
            </button>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.22em", textTransform:"uppercase", color:"#bbb6b0", paddingBottom:6, borderBottom:"1px solid #f0ece6" }}>Покупатель</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div><label style={lbl}>Имя *</label><input value={form.customer} onChange={e=>setForm(f=>({...f,customer:e.target.value}))} placeholder="Алексей Петров" style={inp} onFocus={focusGr} onBlur={blurGy}/></div>
              <div><label style={lbl}>Телефон *</label><input value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="+7 (000) 000-00-00" style={inp} onFocus={focusGr} onBlur={blurGy}/></div>
            </div>
            <div><label style={lbl}>Адрес доставки</label><input value={form.address} onChange={e=>setForm(f=>({...f,address:e.target.value}))} placeholder="Город, улица, дом, кв." style={inp} onFocus={focusGr} onBlur={blurGy}/></div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div><label style={lbl}>Способ доставки</label><select value={form.delivery} onChange={e=>setForm(f=>({...f,delivery:e.target.value}))} style={{ ...inp, appearance:"none" }} onFocus={focusGr} onBlur={blurGy}>{["СДЭК до ПВЗ","СДЭК курьером","Курьером","Почта России","Самовывоз"].map(d=><option key={d}>{d}</option>)}</select></div>
              <div><label style={lbl}>Статус</label><select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value as SellerOrder["status"]}))} style={{ ...inp, appearance:"none" }} onFocus={focusGr} onBlur={blurGy}>{Object.entries(STATUS_ORDER).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select></div>
            </div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.22em", textTransform:"uppercase", color:"#bbb6b0", paddingBottom:6, borderBottom:"1px solid #f0ece6" }}>Состав заказа</div>
            <div style={{ background:"#faf8f5", border:"1.5px solid #f0ece6", padding:14 }}>
              <div style={{ display:"flex", gap:8, marginBottom:orderItems.length?12:0 }}>
                <select value={addProd} onChange={e=>setAddProd(e.target.value)} style={{ ...inp, flex:1 }}>{products.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select>
                <input type="number" value={addQty} onChange={e=>setAddQty(e.target.value)} min={1} style={{ ...inp, width:64 }}/>
                <button type="button" onClick={addItem} style={{ padding:"0 16px", background:"#e84e00", border:"none", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:"#fff", flexShrink:0 }}>+ Добавить</button>
              </div>
              {orderItems.map(it=>(
                <div key={it.productId} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderTop:"1px solid #ece8e2" }}>
                  <span style={{ flex:1, fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, letterSpacing:"0.04em", textTransform:"uppercase", color:"#1a1612" }}>{it.name}</span>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, color:"#8c8480" }}>× {it.qty}</span>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, color:"#1a1612", minWidth:80, textAlign:"right" }}>{(it.price*it.qty).toLocaleString("ru")} ₽</span>
                  <button type="button" onClick={()=>setOrderItems(prev=>prev.filter(i=>i.productId!==it.productId))} style={{ width:20, height:20, background:"none", border:"none", cursor:"pointer", color:"#ccc5bf", padding:0, display:"flex", alignItems:"center", justifyContent:"center" }}
                    onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.color="#e11d48"}
                    onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.color="#ccc5bf"}
                  ><svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 1l10 10M11 1L1 11" strokeLinecap="round"/></svg></button>
                </div>
              ))}
              {orderItems.length>0 && (
                <div style={{ display:"flex", justifyContent:"flex-end", paddingTop:10, borderTop:"1px solid #ece8e2", marginTop:4 }}>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:18, color:"#e84e00" }}>{total.toLocaleString("ru")} ₽</span>
                </div>
              )}
            </div>
            <div><label style={lbl}>Комментарий</label><textarea value={form.comment} onChange={e=>setForm(f=>({...f,comment:e.target.value}))} rows={2} style={{ ...inp, resize:"none" }} onFocus={focusGr} onBlur={blurGy}/></div>
          </div>
          <div style={{ display:"flex", gap:10, marginTop:24 }}>
            <button onClick={onClose} style={{ flex:1, padding:"11px 0", border:"1.5px solid #e5e0d8", background:"transparent", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.14em", textTransform:"uppercase", color:"#6b6357", cursor:"pointer" }}>Отмена</button>
            <button onClick={save} style={{ flex:1, padding:"11px 0", border:"none", background:"#16a34a", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.14em", textTransform:"uppercase", color:"#fff", cursor:"pointer" }}>{isNew?"Создать заказ":"Сохранить"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderInfoLine({ label, value, accent=false }: { label:string; value:string; accent?:boolean }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", gap:16, padding:"8px 0", borderBottom:"1px solid #f5f2ee" }}>
      <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.13em", textTransform:"uppercase", color:"#aaa59f" }}>{label}</span>
      <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.05em", color:accent?"#e84e00":"#1a1612", textAlign:"right" }}>{value}</span>
    </div>
  );
}

function OrderDetailPage({ order, products, onBack, onEdit }: { order:SellerOrder; products:SellerProduct[]; onBack:()=>void; onEdit:()=>void }) {
  const status = STATUS_ORDER[order.status];
  const subtotal = order.items.reduce((sum,item)=>sum+item.price*item.qty,0);
  const steps: SellerOrder["status"][] = ["new","processing","shipped","delivered"];
  const currentStep = order.status==="cancelled" ? -1 : steps.indexOf(order.status);
  const stepLabels: Record<string,string> = { new:"Создан", processing:"В обработке", shipped:"Передан в доставку", delivered:"Получен" };
  const tracking = `CDEK-${order.id.replace(/\D/g,"")}-RU`;

  return (
    <div>
      <button onClick={onBack} style={{ display:"flex", alignItems:"center", gap:8, padding:0, marginBottom:22, border:"none", background:"transparent", cursor:"pointer", color:"#8c8480", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.16em", textTransform:"uppercase" }}>
        <svg width="13" height="10" viewBox="0 0 14 12" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M13 6H1m5-5L1 6l5 5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Все заказы
      </button>

      <div style={{ background:"#fff", border:"1px solid #e5e0d8", borderTop:"4px solid #e84e00", padding:"22px 24px", marginBottom:16 }}>
        <div className="flex-col md:flex-row md:items-start" style={{ display:"flex", justifyContent:"space-between", gap:20 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:7 }}>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:"#aaa59f" }}>Заказ покупателя</span>
              <span style={{ padding:"4px 9px", background:status.bg, border:`1px solid ${status.border}`, color:status.color, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase" }}>{status.label}</span>
            </div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:32, letterSpacing:"0.05em", textTransform:"uppercase", color:"#1a1612", lineHeight:1 }}>{order.id}</div>
            <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:12, color:"#8c8480", marginTop:8 }}>Создан {order.date} · {order.items.reduce((sum,item)=>sum+item.qty,0)} товара</div>
          </div>
          <div className="md:text-right">
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", color:"#aaa59f", marginBottom:3 }}>Сумма заказа</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:30, color:"#e84e00", lineHeight:1 }}>{order.total.toLocaleString("ru")} ₽</div>
            <button onClick={onEdit} style={{ marginTop:12, padding:"8px 14px", border:"1px solid #e5e0d8", background:"transparent", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:"#6b6357" }}>Редактировать</button>
          </div>
        </div>
      </div>

      <div style={{ background:"#fff", border:"1px solid #e5e0d8", padding:"20px 24px", marginBottom:16 }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:"#1a1612", marginBottom:18 }}>Статус выполнения</div>
        {order.status==="cancelled" ? (
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 14px", background:status.bg, color:status.color, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:11, letterSpacing:"0.13em", textTransform:"uppercase" }}>Заказ отменён · {order.comment || "Причина не указана"}</div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)" }}>
            {steps.map((step,index)=>{
              const done = index<=currentStep;
              return (
                <div key={step} style={{ paddingRight:index<3?12:0 }}>
                  <div style={{ display:"flex", alignItems:"center", marginBottom:8 }}>
                    <div style={{ width:18, height:18, background:done?"#e84e00":"#e5e0d8", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center" }}>{done&&<svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="currentColor" strokeWidth="2"><path d="m1 4 3 3 5-6" strokeLinecap="round" strokeLinejoin="round"/></svg>}</div>
                    {index<3&&<div style={{ height:2, flex:1, background:index<currentStep?"#e84e00":"#e5e0d8" }}/>}
                  </div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:10, letterSpacing:"0.08em", textTransform:"uppercase", color:done?"#1a1612":"#aaa59f" }}>{stepLabels[step]}</div>
                  <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:9, color:"#aaa59f", marginTop:3 }}>{index===0?order.date:index===currentStep?"Текущий этап":"—"}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-4">
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ background:"#fff", border:"1px solid #e5e0d8" }}>
            <div style={{ padding:"16px 20px", borderBottom:"1px solid #f0ece8", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"#1a1612" }}>Состав заказа</div>
            {order.items.map((item,index)=>{
              const product = products.find(entry=>entry.id===item.productId);
              return (
                <div key={`${item.productId}-${index}`} style={{ padding:"16px 20px", borderBottom:"1px solid #f0ece8", display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{ width:68, height:58, background:"#f5f2ee", overflow:"hidden", flexShrink:0 }}>{product&&<img src={product.img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:14, letterSpacing:"0.04em", textTransform:"uppercase", color:"#1a1612" }}>{item.name}</div>
                    <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:"#aaa59f", marginTop:4 }}>Артикул {String(item.productId).padStart(6,"0")}{item.variant?` · ${item.variant}`:""}</div>
                    <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, color:"#8c8480", marginTop:5 }}>{item.price.toLocaleString("ru")} ₽ × {item.qty} шт.</div>
                  </div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:16, color:"#1a1612", flexShrink:0 }}>{(item.price*item.qty).toLocaleString("ru")} ₽</div>
                </div>
              );
            })}
            <div style={{ padding:"16px 20px", display:"flex", justifyContent:"flex-end" }}>
              <div style={{ width:270 }}>
                <OrderInfoLine label="Товары" value={`${subtotal.toLocaleString("ru")} ₽`}/>
                <OrderInfoLine label="Доставка" value="Бесплатно"/>
                <div style={{ display:"flex", justifyContent:"space-between", paddingTop:11, marginTop:4, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:17, textTransform:"uppercase", color:"#1a1612" }}><span>Итого</span><span style={{ color:"#e84e00" }}>{order.total.toLocaleString("ru")} ₽</span></div>
              </div>
            </div>
          </div>
          <div style={{ background:"#fff", border:"1px solid #e5e0d8", padding:"18px 20px" }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"#1a1612", marginBottom:10 }}>Комментарий покупателя</div>
            <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:12, lineHeight:1.6, color:order.comment?"#6b6357":"#aaa59f" }}>{order.comment||"Покупатель не оставил комментарий к заказу."}</div>
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ background:"#fff", border:"1px solid #e5e0d8", padding:"18px 20px" }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"#1a1612", marginBottom:14 }}>Покупатель</div>
            <div style={{ display:"flex", alignItems:"center", gap:11, marginBottom:14 }}>
              <div style={{ width:42, height:42, background:"#e84e00", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:14 }}>{order.customer.split(" ").map(part=>part[0]).slice(0,2).join("")}</div>
              <div><div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:15, textTransform:"uppercase", color:"#1a1612" }}>{order.customer}</div><div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, color:"#8c8480", marginTop:3 }}>{order.phone}</div></div>
            </div>
            <div style={{ paddingTop:12, borderTop:"1px solid #f0ece8", fontFamily:"'Barlow',sans-serif", fontSize:11, lineHeight:1.55, color:"#6b6357" }}>{order.address}</div>
          </div>
          <div style={{ background:"#fff", border:"1px solid #e5e0d8", padding:"18px 20px" }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"#1a1612", marginBottom:14 }}>Доставка</div>
            <OrderInfoLine label="Способ" value={order.delivery}/>
            <OrderInfoLine label="Получатель" value={order.customer}/>
            <OrderInfoLine label="Адрес" value={order.address}/>
            {(order.status==="shipped"||order.status==="delivered")&&<OrderInfoLine label="Трек-номер" value={tracking} accent/>}
          </div>
          <div style={{ background:"#fff", border:"1px solid #e5e0d8", padding:"18px 20px" }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"#1a1612", marginBottom:14 }}>Оплата</div>
            <OrderInfoLine label="Статус" value={order.status==="cancelled"?"Возврат оформлен":"Оплачено"} accent={order.status!=="cancelled"}/>
            <OrderInfoLine label="Способ" value="Банковская карта"/>
            <OrderInfoLine label="Сумма" value={`${order.total.toLocaleString("ru")} ₽`}/>
            <OrderInfoLine label="Операция" value={`PAY-${order.id.replace(/\D/g,"")}`}/>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Products Section ───────────────────────────────────────────

function ProductsSection({ products, setProducts, initialStatus="all" }: { products:SellerProduct[]; setProducts:React.Dispatch<React.SetStateAction<SellerProduct[]>>; initialStatus?:"all"|"active"|"draft"|"archived" }) {
  const [view, setView] = useState<"list"|"create"|number>("list");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all"|"active"|"draft"|"archived">(initialStatus);

  const editingProduct = typeof view==="number" ? products.find(p=>p.id===view) : undefined;
  const filtered = products.filter(p=>(statusFilter==="all"||p.status===statusFilter) && (p.name.toLowerCase().includes(search.toLowerCase())||p.category.toLowerCase().includes(search.toLowerCase())));

  const saveProduct = (p: SellerProduct) => setProducts(prev=>prev.some(x=>x.id===p.id)?prev.map(x=>x.id===p.id?p:x):[...prev,p]);
  const deleteProduct = (id: number) => setProducts(prev=>prev.filter(p=>p.id!==id));

  if (view === "create" || typeof view === "number") {
    return (
      <ProductFormPage
        product={editingProduct}
        onBack={()=>setView("list")}
        onSave={p=>{ saveProduct(p); }}
      />
    );
  }

  return (
    <>
      {/* stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
        {[
          { v:String(products.filter(p=>p.status==="active").length), l:"Активных", accent:"#e84e00" },
          { v:String(products.filter(p=>p.status==="draft").length), l:"Черновиков", accent:"#d97706" },
          { v:String(products.reduce((s,p)=>s+p.sold,0)), l:"Продано шт.", accent:"#2563eb" },
          { v:`${Math.round(products.filter(p=>p.status==="active").reduce((s,p)=>s+p.price*p.sold,0)/1000)}K ₽`, l:"Выручка", accent:"#16a34a" },
        ].map(s=>(
          <div key={s.l} style={{ background:"#fff", border:"1.5px solid #ede9e2", padding:"16px 18px" }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:24, color:s.accent, lineHeight:1 }}>{s.v}</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:"#8c8480", marginTop:4 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* toolbar */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, marginBottom:14, flexWrap:"wrap" }}>
        <div style={{ display:"flex" }}>
          {([["all","Все"],["active","Активные"],["draft","Черновики"],["archived","Архив"]] as const).map(([k,l],i,arr)=>(
            <button key={k} onClick={()=>setStatusFilter(k)} style={{ padding:"7px 14px", border:"1.5px solid #e5e0d8", borderRight:i<arr.length-1?"none":"1.5px solid #e5e0d8", background:statusFilter===k?"#1a1612":"#fff", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:statusFilter===k?"#fff":"#6b6357", cursor:"pointer" }}>{l}</button>
          ))}
        </div>
        <div style={{ display:"flex", gap:10, flex:1, maxWidth:360 }}>
          <div style={{ flex:1, position:"relative" }}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#aaa59f" strokeWidth="1.5" style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)" }}><circle cx="7" cy="7" r="5"/><path d="M11 11l3 3" strokeLinecap="round"/></svg>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Поиск по товарам…" style={{ ...inp, paddingLeft:34 }}/>
          </div>
          <button onClick={()=>setView("create")} style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", background:"#e84e00", border:"none", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", color:"#fff", flexShrink:0 }}>
            <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5"><path d="M6 1v10M1 6h10" strokeLinecap="round"/></svg>
            Добавить
          </button>
        </div>
      </div>

      {/* table */}
      <div style={{ background:"#fff", border:"1.5px solid #ede9e2", overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"52px 1fr 120px 90px 70px 110px 80px", padding:"10px 16px", background:"#faf8f5", borderBottom:"1px solid #f0ece6" }}>
          {["","Товар","Категория","Цена","Остаток","Статус",""].map((h,i)=>(
            <div key={i} style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:"#aaa59f" }}>{h}</div>
          ))}
        </div>
        {filtered.length===0 && <div style={{ padding:"40px 0", textAlign:"center", color:"#ccc5bf", fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, letterSpacing:"0.1em", textTransform:"uppercase" }}>Товары не найдены</div>}
        {filtered.map((p,i)=>{
          const sm=STATUS_PROD[p.status];
          return (
            <div key={p.id} style={{ display:"grid", gridTemplateColumns:"52px 1fr 120px 90px 70px 110px 80px", padding:"11px 16px", borderBottom:i<filtered.length-1?"1px solid #f5f2ee":"none", alignItems:"center", transition:"background 0.1s" }}
              onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background="#faf8f5"}
              onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background="transparent"}
            >
              <div style={{ width:38, height:30, overflow:"hidden", background:"#f0ece6" }}><img src={p.img} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/></div>
              <div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, letterSpacing:"0.04em", textTransform:"uppercase", color:"#1a1612", lineHeight:1.1 }}>{p.name}</div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:"#aaa59f", marginTop:2 }}>{p.brand} · {p.sold} продано</div>
              </div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, letterSpacing:"0.06em", textTransform:"uppercase", color:"#8c8480" }}>{p.category}</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:14, color:"#1a1612" }}>{p.price.toLocaleString("ru")} ₽</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, color:p.stock===0?"#e11d48":p.stock<3?"#d97706":"#1a1612" }}>{p.stock}</div>
              <div><span style={{ background:sm.bg, border:`1px solid ${sm.border}`, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase", color:sm.color, padding:"3px 8px" }}>{sm.label}</span></div>
              <div style={{ display:"flex", gap:6, justifyContent:"flex-end" }}>
                <button onClick={()=>setView(p.id)} style={{ width:28, height:28, border:"1.5px solid #e5e0d8", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#8c8480" }}
                  onMouseEnter={e=>{ (e.currentTarget as HTMLButtonElement).style.borderColor="#e84e00"; (e.currentTarget as HTMLButtonElement).style.color="#e84e00"; }}
                  onMouseLeave={e=>{ (e.currentTarget as HTMLButtonElement).style.borderColor="#e5e0d8"; (e.currentTarget as HTMLButtonElement).style.color="#8c8480"; }}
                ><svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 1l3 3-7 7H1V8L8 1z" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
                <button onClick={()=>deleteProduct(p.id)} style={{ width:28, height:28, border:"1.5px solid #e5e0d8", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#8c8480" }}
                  onMouseEnter={e=>{ (e.currentTarget as HTMLButtonElement).style.borderColor="#e11d48"; (e.currentTarget as HTMLButtonElement).style.color="#e11d48"; }}
                  onMouseLeave={e=>{ (e.currentTarget as HTMLButtonElement).style.borderColor="#e5e0d8"; (e.currentTarget as HTMLButtonElement).style.color="#8c8480"; }}
                ><svg width="10" height="11" viewBox="0 0 12 13" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 3h10M4 3V2h4v1M5 6v4M7 6v4M2 3l1 9h6l1-9" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ── Orders Section ─────────────────────────────────────────────

function OrdersSection({ orders, setOrders, products, initialStatus="all" }: { orders:SellerOrder[]; setOrders:React.Dispatch<React.SetStateAction<SellerOrder[]>>; products:SellerProduct[]; initialStatus?:string }) {
  const [modal, setModal] = useState<"create"|string|null>(null);
  const [detailId, setDetailId] = useState<string|null>(null);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [search, setSearch] = useState("");

  const editingOrder = typeof modal==="string"&&modal!=="create" ? orders.find(o=>o.id===modal) : undefined;
  const detailOrder = detailId ? orders.find(order=>order.id===detailId) : undefined;
  const filtered = orders.filter(o=>(statusFilter==="all"||o.status===statusFilter) && (o.id.toLowerCase().includes(search.toLowerCase())||o.customer.toLowerCase().includes(search.toLowerCase())));
  const saveOrder = (o: SellerOrder) => setOrders(prev=>prev.some(x=>x.id===o.id)?prev.map(x=>x.id===o.id?o:x):[o,...prev]);
  const revenue = orders.filter(o=>o.status==="delivered").reduce((s,o)=>s+o.total,0);

  if (detailOrder) {
    return (
      <>
        <OrderDetailPage order={detailOrder} products={products} onBack={()=>setDetailId(null)} onEdit={()=>setModal(detailOrder.id)}/>
        {modal && <OrderModal order={editingOrder} products={products} onClose={()=>setModal(null)} onSave={saveOrder}/>}
      </>
    );
  }

  return (
    <>
      {/* stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:14, marginBottom:24 }}>
        {[
          { v:String(orders.length), l:"Всего", accent:"#1a1612" },
          { v:String(orders.filter(o=>o.status==="new").length), l:"Новых", accent:"#2563eb" },
          { v:String(orders.filter(o=>o.status==="processing"||o.status==="shipped").length), l:"В работе", accent:"#d97706" },
          { v:String(orders.filter(o=>o.status==="delivered").length), l:"Доставлено", accent:"#16a34a" },
          { v:`${Math.round(revenue/1000)}K ₽`, l:"Выручка", accent:"#e84e00" },
        ].map(s=>(
          <div key={s.l} style={{ background:"#fff", border:"1.5px solid #ede9e2", padding:"16px 18px" }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:24, color:s.accent, lineHeight:1 }}>{s.v}</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:"#8c8480", marginTop:4 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* toolbar */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, marginBottom:14, flexWrap:"wrap" }}>
        <div style={{ display:"flex", flexWrap:"wrap" }}>
          {[["all","Все"],...Object.entries(STATUS_ORDER).map(([k,v])=>[k,v.label])].map(([k,l],i,arr)=>(
            <button key={k} onClick={()=>setStatusFilter(k)} style={{ padding:"7px 13px", border:"1.5px solid #e5e0d8", borderRight:i<arr.length-1?"none":"1.5px solid #e5e0d8", background:statusFilter===k?"#1a1612":"#fff", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase", color:statusFilter===k?"#fff":"#6b6357", cursor:"pointer" }}>{l}</button>
          ))}
        </div>
        <div style={{ display:"flex", gap:10, flex:1, maxWidth:360 }}>
          <div style={{ flex:1, position:"relative" }}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#aaa59f" strokeWidth="1.5" style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)" }}><circle cx="7" cy="7" r="5"/><path d="M11 11l3 3" strokeLinecap="round"/></svg>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Поиск по заказу или покупателю…" style={{ ...inp, paddingLeft:34 }}/>
          </div>
          <button onClick={()=>setModal("create")} style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 15px", background:"#16a34a", border:"none", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", color:"#fff", flexShrink:0 }}>
            <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5"><path d="M6 1v10M1 6h10" strokeLinecap="round"/></svg>
            Новый заказ
          </button>
        </div>
      </div>

      {/* table */}
      <div style={{ background:"#fff", border:"1.5px solid #ede9e2", overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"110px 1fr 1fr 100px 120px 56px", padding:"10px 16px", background:"#faf8f5", borderBottom:"1px solid #f0ece6" }}>
          {["Заказ","Покупатель","Состав","Сумма","Статус",""].map((h,i)=>(
            <div key={i} style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:"#aaa59f" }}>{h}</div>
          ))}
        </div>
        {filtered.length===0 && <div style={{ padding:"40px 0", textAlign:"center", color:"#ccc5bf", fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, letterSpacing:"0.1em", textTransform:"uppercase" }}>Заказов не найдено</div>}
        {filtered.map((o,i)=>{
          const sm=STATUS_ORDER[o.status];
          return (
            <div key={o.id} onClick={()=>setDetailId(o.id)} style={{ display:"grid", gridTemplateColumns:"110px 1fr 1fr 100px 120px 56px", padding:"11px 16px", borderBottom:i<filtered.length-1?"1px solid #f5f2ee":"none", alignItems:"center", transition:"background 0.1s", cursor:"pointer" }}
              onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background="#faf8f5"}
              onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background="transparent"}
            >
              <div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:13, letterSpacing:"0.06em", color:"#e84e00" }}>{o.id}</div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.08em", textTransform:"uppercase", color:"#aaa59f", marginTop:2 }}>{o.date}</div>
              </div>
              <div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, letterSpacing:"0.04em", textTransform:"uppercase", color:"#1a1612" }}>{o.customer}</div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.06em", textTransform:"uppercase", color:"#aaa59f", marginTop:2 }}>{o.delivery}</div>
              </div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, letterSpacing:"0.04em", textTransform:"uppercase", color:"#8c8480", paddingRight:8, lineHeight:1.4 }}>{o.items.map(it=>`${it.name} ×${it.qty}`).join(", ").slice(0,50)}{o.items.length>1?"…":""}</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:14, color:"#1a1612" }}>{o.total.toLocaleString("ru")} ₽</div>
              <div><span style={{ background:sm.bg, border:`1px solid ${sm.border}`, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.12em", textTransform:"uppercase", color:sm.color, padding:"3px 8px" }}>{sm.label}</span></div>
              <div style={{ display:"flex", justifyContent:"flex-end" }}>
                <button onClick={event=>{ event.stopPropagation(); setDetailId(o.id); }} aria-label={`Открыть заказ ${o.id}`} style={{ width:28, height:28, border:"1.5px solid #e5e0d8", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#8c8480" }}
                  onMouseEnter={e=>{ (e.currentTarget as HTMLButtonElement).style.borderColor="#16a34a"; (e.currentTarget as HTMLButtonElement).style.color="#16a34a"; }}
                  onMouseLeave={e=>{ (e.currentTarget as HTMLButtonElement).style.borderColor="#e5e0d8"; (e.currentTarget as HTMLButtonElement).style.color="#8c8480"; }}
                ><svg width="12" height="9" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M1 6s2.5-4.5 7-4.5S15 6 15 6s-2.5 4.5-7 4.5S1 6 1 6Z"/><circle cx="8" cy="6" r="2"/></svg></button>
              </div>
            </div>
          );
        })}
      </div>
      {modal && <OrderModal order={editingOrder} products={products} onClose={()=>setModal(null)} onSave={saveOrder}/>}
    </>
  );
}

// ── Seller Page ────────────────────────────────────────────────

export function SellerPage() {
  const { section } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const activeKey = section ?? "products";
  const requestedStatus = new URLSearchParams(location.search).get("status") ?? "all";

  const [products, setProducts] = useState<SellerProduct[]>(INIT_PRODUCTS);
  const [orders, setOrders] = useState<SellerOrder[]>(INIT_ORDERS);
  const [openMenu, setOpenMenu] = useState<string|null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string|null>(null);

  const newOrdersCount = orders.filter(o=>o.status==="new").length;
  const revenue = orders.filter(o=>o.status==="delivered").reduce((s,o)=>s+o.total,0);
  const productStatus = (["all","active","draft","archived"].includes(requestedStatus) ? requestedStatus : "all") as "all"|"active"|"draft"|"archived";
  const orderStatus = ["all","new","processing","shipped","delivered","cancelled"].includes(requestedStatus) ? requestedStatus : "all";

  const MENU = [
    {
      key:"products",
      label:"Товары",
      icon:<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="6" height="6" rx="0.5"/><rect x="9" y="1" width="6" height="6" rx="0.5"/><rect x="1" y="9" width="6" height="6" rx="0.5"/><rect x="9" y="9" width="6" height="6" rx="0.5"/></svg>,
      children:[
        { label:"Все товары", path:"/seller/products" },
        { label:"По статусу", children:[
          { label:"Активные", path:"/seller/products?status=active", count:products.filter(p=>p.status==="active").length },
          { label:"Черновики", path:"/seller/products?status=draft", count:products.filter(p=>p.status==="draft").length },
          { label:"Архив", path:"/seller/products?status=archived", count:products.filter(p=>p.status==="archived").length },
        ]},
      ],
    },
    {
      key:"orders",
      label:"Заказы",
      icon:<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 1h3l1.8 8.4a1 1 0 0 0 1 .8h6.5a1 1 0 0 0 1-.8L16 5H4" strokeLinecap="round" strokeLinejoin="round"/><circle cx="6.5" cy="14" r="1.2"/><circle cx="13" cy="14" r="1.2"/></svg>,
      children:[
        { label:"Все заказы", path:"/seller/orders" },
        { label:"В работе", children:[
          { label:"Новые", path:"/seller/orders?status=new", count:orders.filter(o=>o.status==="new").length },
          { label:"Обрабатываются", path:"/seller/orders?status=processing", count:orders.filter(o=>o.status==="processing").length },
          { label:"Отправлены", path:"/seller/orders?status=shipped", count:orders.filter(o=>o.status==="shipped").length },
        ]},
        { label:"Завершённые", children:[
          { label:"Доставлены", path:"/seller/orders?status=delivered", count:orders.filter(o=>o.status==="delivered").length },
          { label:"Отменены", path:"/seller/orders?status=cancelled", count:orders.filter(o=>o.status==="cancelled").length },
        ]},
      ],
    },
  ];

  const goToMenuItem = (path:string) => {
    setOpenMenu(null);
    setOpenSubmenu(null);
    navigate(path);
  };

  return (
    <div style={{ minHeight:"100vh", background:"#f5f2ee", display:"flex", flexDirection:"column" }}>

      {/* ── Header ── */}
      <header style={{ background:"#fff", borderBottom:"1.5px solid #ede9e2", position:"sticky", top:0, zIndex:40 }}>
        <div style={{ height:4, background:"linear-gradient(90deg,#e84e00 0%,#ff7a2f 50%,#e84e00 100%)" }}/>
        {/* top bar */}
        <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 32px", display:"flex", alignItems:"center", justifyContent:"space-between", height:60 }}>
          {/* logo */}
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:34, height:34, background:"#e84e00", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"><path d="M3 5h14M5 5V3h10v2M6 5v12M14 5v12M3 17h14"/><path d="M8 9h4M8 12h4"/></svg>
            </div>
            <div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:16, letterSpacing:"0.1em", textTransform:"uppercase", color:"#1a1612", lineHeight:1 }}>ГРЯЗЬ&nbsp;&amp;&nbsp;КАМНИ</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:8, letterSpacing:"0.28em", textTransform:"uppercase", color:"#e84e00", lineHeight:1, marginTop:2 }}>Кабинет продавца</div>
            </div>
          </div>
          {/* right */}
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {newOrdersCount>0 && (
              <div style={{ display:"flex", alignItems:"center", gap:6, padding:"5px 12px", background:"#fff8f5", border:"1.5px solid #ffd4c0" }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:"#e84e00" }}/>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, letterSpacing:"0.16em", textTransform:"uppercase", color:"#e84e00" }}>{newOrdersCount} новых заказа</span>
              </div>
            )}
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 12px", background:"#faf8f5", border:"1.5px solid #ede9e2" }}>
              <div style={{ width:26, height:26, borderRadius:"50%", background:"#e84e00", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:10, color:"#fff" }}>ИМ</span>
              </div>
              <div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color:"#1a1612", lineHeight:1 }}>Иван Морозов</div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase", color:"#aaa59f", lineHeight:1, marginTop:2 }}>4WD Parts</div>
              </div>
            </div>
            <button onClick={()=>navigate("/lk")} style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", border:"1.5px solid #e5e0d8", background:"transparent", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", color:"#6b6357", transition:"all 0.15s" }}
              onMouseEnter={e=>{ (e.currentTarget as HTMLButtonElement).style.borderColor="#e84e00"; (e.currentTarget as HTMLButtonElement).style.color="#e84e00"; }}
              onMouseLeave={e=>{ (e.currentTarget as HTMLButtonElement).style.borderColor="#e5e0d8"; (e.currentTarget as HTMLButtonElement).style.color="#6b6357"; }}
            >
              <svg width="11" height="9" viewBox="0 0 14 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M13 6H1M6 1L1 6l5 5"/></svg>
              Личный кабинет
            </button>
          </div>
        </div>
        {/* multilevel navigation */}
        <div style={{ background:"#faf8f5", borderTop:"1px solid #f0ece6" }}>
          <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 32px", display:"flex", alignItems:"stretch" }}>
            {MENU.map(item=>{
              const active = activeKey===item.key;
              const expanded = openMenu===item.key;
              return (
                <div key={item.key} style={{ position:"relative" }}
                  onMouseEnter={()=>setOpenMenu(item.key)}
                  onMouseLeave={()=>{ setOpenMenu(null); setOpenSubmenu(null); }}
                >
                  <button onClick={()=>setOpenMenu(expanded?null:item.key)} aria-expanded={expanded}
                    style={{ height:"100%", display:"flex", alignItems:"center", gap:8, padding:"12px 22px", border:"none", borderBottom:active?"3px solid #e84e00":"3px solid transparent", background:expanded?"#fff":"transparent", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:active?"#e84e00":"#6b6357", transition:"all 0.15s", marginBottom:-1 }}
                  >
                    <span style={{ color:active?"#e84e00":"#aaa59f" }}>{item.icon}</span>
                    {item.label}
                    {item.key==="orders"&&newOrdersCount>0 && (
                      <span style={{ background:"#e84e00", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:9, color:"#fff", padding:"1px 6px" }}>{newOrdersCount}</span>
                    )}
                    <svg width="8" height="5" viewBox="0 0 10 6" fill="none" stroke="currentColor" style={{ marginLeft:2, transform:expanded?"rotate(180deg)":"none", transition:"transform 0.15s" }}><path d="M1 1l4 4 4-4" strokeWidth="1.4" strokeLinecap="round"/></svg>
                  </button>

                  {expanded && (
                    <div style={{ position:"absolute", top:"100%", left:0, width:224, padding:"6px 0", background:"#fff", border:"1px solid #e5e0d8", boxShadow:"0 16px 36px rgba(26,22,18,0.16)", zIndex:60 }}>
                      {item.children.map((child,index)=>{
                        const submenuKey = `${item.key}-${index}`;
                        const hasChildren = "children" in child && child.children;
                        return (
                          <div key={child.label} style={{ position:"relative" }}
                            onMouseEnter={()=>setOpenSubmenu(hasChildren?submenuKey:null)}
                          >
                            <button onClick={()=>hasChildren?setOpenSubmenu(openSubmenu===submenuKey?null:submenuKey):goToMenuItem(child.path!)}
                              style={{ width:"100%", padding:"11px 14px", border:"none", background:openSubmenu===submenuKey?"#fff4ee":"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, textAlign:"left", color:openSubmenu===submenuKey?"#e84e00":"#6b6357" }}
                            >
                              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase" }}>{child.label}</span>
                              {hasChildren && <svg width="5" height="9" viewBox="0 0 6 10" fill="none" stroke="currentColor"><path d="m1 1 4 4-4 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                            </button>

                            {hasChildren && openSubmenu===submenuKey && (
                              <div style={{ position:"absolute", top:-7, left:"100%", width:218, padding:"6px 0", background:"#fff", border:"1px solid #e5e0d8", boxShadow:"0 16px 36px rgba(26,22,18,0.16)", zIndex:61 }}>
                                {child.children!.map(leaf=>(
                                  <button key={leaf.label} onClick={()=>goToMenuItem(leaf.path)}
                                    style={{ width:"100%", padding:"10px 14px", border:"none", background:location.pathname+location.search===leaf.path?"#fff4ee":"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, textAlign:"left", color:location.pathname+location.search===leaf.path?"#e84e00":"#6b6357" }}
                                  >
                                    <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase" }}>{leaf.label}</span>
                                    {"count" in leaf && <span style={{ minWidth:21, height:18, padding:"0 5px", background:"#f5f2ee", color:"#8c8480", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:9 }}>{leaf.count}</span>}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main style={{ flex:1, maxWidth:1400, margin:"0 auto", width:"100%", padding:"32px 32px 60px", boxSizing:"border-box" }}>
        {/* breadcrumb + title */}
        <div style={{ marginBottom:28 }}>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.24em", textTransform:"uppercase", color:"#aaa59f", marginBottom:8 }}>
            Кабинет продавца / {activeKey==="products"?"Товары":"Заказы"}
          </div>
          <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:34, letterSpacing:"0.06em", textTransform:"uppercase", color:"#1a1612", lineHeight:1, margin:"0 0 8px" }}>
            {activeKey==="products"?"Мои товары":"Заказы"}
          </h1>
          <div style={{ width:44, height:3, background:"#e84e00" }}/>
        </div>

        {activeKey==="products" && <ProductsSection key={`products-${productStatus}`} products={products} setProducts={setProducts} initialStatus={productStatus}/>}
        {activeKey==="orders"   && <OrdersSection key={`orders-${orderStatus}`} orders={orders} setOrders={setOrders} products={products} initialStatus={orderStatus}/>}
      </main>

      {/* ── Footer ── */}
      <footer style={{ background:"#fff", borderTop:"1.5px solid #ede9e2" }}>
        <div style={{ maxWidth:1400, margin:"0 auto", padding:"20px 32px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div style={{ display:"flex", gap:24 }}>
            {["Условия для продавцов","Помощь","Тарифы","Правила"].map(l=>(
              <button key={l} style={{ background:"none", border:"none", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", color:"#aaa59f", padding:0 }}
                onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.color="#e84e00"}
                onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.color="#aaa59f"}
              >{l}</button>
            ))}
          </div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase", color:"#ccc5bf" }}>© 2026 ГРЯЗЬ&nbsp;&amp;&nbsp;КАМНИ</div>
        </div>
      </footer>
      <NotificationWidget/>
    </div>
  );
}
