import { createHashRouter as createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { ClubsPage } from "./pages/ClubsPage";
import { HomePage } from "./pages/HomePage";
import { LKPage } from "./pages/LKPage";
import { BlogPage } from "./pages/BlogPage";
import { NewsPage } from "./pages/NewsPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactsPage } from "./pages/ContactsPage";
import { EventsPage } from "./pages/EventsPage";
import { EventDetailPage } from "./pages/EventDetailPage";
import { ClubDetailPage } from "./pages/ClubDetailPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { CatalogPage } from "./pages/CatalogPage";
import { CategoryPage } from "./pages/CategoryPage";
import { ProductPage } from "./pages/ProductPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { SellerPage } from "./pages/SellerPage";
import { BrandsPage } from "./pages/BrandsPage";
import { BrandDetailPage } from "./pages/BrandDetailPage";
import ServicesPage from "./pages/ServicesPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import ToursPage from "./pages/ToursPage";
import TourDetailPage from "./pages/TourDetailPage";
import MobileAppPage from "./pages/MobileAppPage";

export const router = createBrowserRouter([
  { path: "mobile", Component: MobileAppPage },
  { path: "seller", Component: SellerPage },
  { path: "seller/:section", Component: SellerPage },
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: "clubs", Component: ClubsPage },
      { path: "lk", Component: LKPage },
      { path: "lk/:section", Component: LKPage },
      { path: "lk/signals/:signalId", Component: LKPage },
      { path: "blog", Component: BlogPage },
      { path: "news", Component: NewsPage },
      { path: "about", Component: AboutPage },
      { path: "contacts", Component: ContactsPage },
      { path: "events", Component: EventsPage },
      { path: "events/:id", Component: EventDetailPage },
      { path: "tours", Component: ToursPage },
      { path: "tours/:id", Component: TourDetailPage },
      { path: "clubs/:id", Component: ClubDetailPage },
      { path: "catalog", Component: CatalogPage },
      { path: "catalog/:category", Component: CategoryPage },
      { path: "catalog/:category/:id", Component: ProductPage },
      { path: "checkout", Component: CheckoutPage },
      { path: "payment/success", Component: PaymentSuccessPage },
      { path: "brands", Component: BrandsPage },
      { path: "brands/:slug", Component: BrandDetailPage },
      { path: "services", Component: ServicesPage },
      { path: "services/:slug", Component: ServiceDetailPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
