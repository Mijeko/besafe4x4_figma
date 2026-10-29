import { Outlet } from "react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";
import NotificationWidget from "./NotificationWidget";

export function Root() {
  return (
    <div style={{ background: "#f5f2ee", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
      <NotificationWidget />
    </div>
  );
}
