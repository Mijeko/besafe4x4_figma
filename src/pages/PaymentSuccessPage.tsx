import { useNavigate, useSearchParams } from "react-router";

type PaidOrder = {
  orderNumber: string;
  amount: number;
  email: string;
  itemCount: number;
  paymentMethod: string;
  paidAt: string;
};

function getStoredOrder(): PaidOrder | null {
  try {
    const value = sessionStorage.getItem("lastPaidOrder");
    return value ? JSON.parse(value) as PaidOrder : null;
  } catch {
    return null;
  }
}

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const storedOrder = getStoredOrder();
  const amountFromQuery = Number(searchParams.get("amount"));
  const orderNumber = searchParams.get("order") || storedOrder?.orderNumber || "GK-2026-104827";
  const amount = Number.isFinite(amountFromQuery) && amountFromQuery > 0 ? amountFromQuery : storedOrder?.amount || 0;
  const paymentMethod = searchParams.get("payment") || storedOrder?.paymentMethod || "Банковская карта";
  const email = storedOrder?.email || "вашу электронную почту";
  const itemCount = storedOrder?.itemCount || 1;
  const paidAt = storedOrder?.paidAt || new Date().toLocaleString("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-screen bg-background px-6 py-14 text-foreground">
      <main className="mx-auto max-w-5xl">
        <section className="relative overflow-hidden border border-border bg-card">
          <div className="h-1 bg-primary" />
          <div className="grid lg:grid-cols-[1fr_22rem]">
            <div className="px-7 py-10 md:px-12 md:py-14">
              <div className="flex h-16 w-16 items-center justify-center bg-primary text-primary-foreground">
                <svg width="30" height="24" viewBox="0 0 30 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m2 12 8 8L28 2" />
                </svg>
              </div>

              <div className="mt-7 font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-[0.3em] text-primary">Платёж подтверждён</div>
              <div className="mt-2 font-['Barlow_Condensed'] text-5xl font-black uppercase leading-none tracking-wide md:text-6xl">Заказ успешно оплачен</div>
              <p className="mt-5 max-w-2xl text-base leading-7 text-secondary-foreground">
                Спасибо за покупку. Мы уже передали заказ продавцам и отправили подтверждение на {email}.
              </p>

              <div className="mt-9 grid gap-px border border-border bg-border sm:grid-cols-3">
                <div className="bg-card p-5">
                  <div className="font-['Barlow_Condensed'] text-xs uppercase tracking-widest text-muted-foreground">Номер заказа</div>
                  <div className="mt-2 font-['Barlow_Condensed'] text-xl font-black uppercase">{orderNumber}</div>
                </div>
                <div className="bg-card p-5">
                  <div className="font-['Barlow_Condensed'] text-xs uppercase tracking-widest text-muted-foreground">Сумма</div>
                  <div className="mt-2 font-['Barlow_Condensed'] text-xl font-black text-primary">{amount.toLocaleString("ru-RU")} ₽</div>
                </div>
                <div className="bg-card p-5">
                  <div className="font-['Barlow_Condensed'] text-xs uppercase tracking-widest text-muted-foreground">Товаров</div>
                  <div className="mt-2 font-['Barlow_Condensed'] text-xl font-black">{itemCount}</div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button onClick={() => navigate("/lk/purchases")} className="bg-primary px-7 py-3 font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-widest text-primary-foreground">
                  Перейти к заказу
                </button>
                <button onClick={() => navigate("/catalog")} className="border border-border bg-card px-7 py-3 font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-widest text-secondary-foreground transition hover:border-primary hover:text-primary">
                  Продолжить покупки
                </button>
              </div>
            </div>

            <aside className="border-t border-border bg-background p-7 lg:border-l lg:border-t-0">
              <div className="font-['Barlow_Condensed'] text-xl font-black uppercase tracking-wide">Что дальше</div>
              <div className="mt-6">
                {[
                  { title: "Оплата получена", text: paidAt, done: true },
                  { title: "Заказ собирается", text: "Продавцы проверяют наличие и готовят товары", done: false },
                  { title: "Передадим в доставку", text: "Пришлём трек-номер после отправки", done: false },
                ].map((step, index, steps) => (
                  <div key={step.title} className="grid grid-cols-[1.5rem_1fr] gap-3">
                    <div className="flex flex-col items-center">
                      <span className={`mt-1 h-3 w-3 border-2 ${step.done ? "border-primary bg-primary" : "border-border bg-card"}`} />
                      {index < steps.length - 1 && <span className="min-h-16 w-px flex-1 bg-border" />}
                    </div>
                    <div className={index < steps.length - 1 ? "pb-6" : ""}>
                      <div className={`font-['Barlow_Condensed'] text-sm font-bold uppercase tracking-wider ${step.done ? "text-primary" : "text-foreground"}`}>{step.title}</div>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t border-border pt-6">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-['Barlow_Condensed'] text-xs uppercase tracking-widest text-muted-foreground">Способ оплаты</span>
                  <span className="text-right font-['Barlow_Condensed'] text-sm font-bold uppercase">{paymentMethod}</span>
                </div>
                <div className="mt-4 flex items-start gap-3 bg-card p-4">
                  <svg className="mt-0.5 shrink-0 text-primary" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="8" cy="8" r="6.5" />
                    <path d="M8 7v4M8 4.5v.5" strokeLinecap="round" />
                  </svg>
                  <p className="text-xs leading-5 text-secondary-foreground">Сохранять эту страницу не нужно — заказ уже появился в разделе «Покупки».</p>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <div className="mt-5 flex flex-col justify-between gap-2 px-1 font-['Barlow_Condensed'] text-xs uppercase tracking-widest text-muted-foreground sm:flex-row">
          <span>Нужна помощь? +7 (495) 120-44-20</span>
          <span>support@gryazikamni.ru</span>
        </div>
      </main>
    </div>
  );
}
