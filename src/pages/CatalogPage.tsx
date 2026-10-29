import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { CATEGORIES, type Product } from "../data/catalog";
import { useCart } from "../context/CartContext";

type CatalogProduct = Product & {
  categorySlug: string;
  categoryName: string;
};

const ALL_PRODUCTS: CatalogProduct[] = CATEGORIES.flatMap((category) =>
  category.products.map((product) => ({
    ...product,
    categorySlug: category.slug,
    categoryName: category.name,
  })),
);

const BRANDS = [...new Set(ALL_PRODUCTS.map((product) => product.brand))].sort();
const SORT_OPTIONS = [
  { value: "popular", label: "По популярности" },
  { value: "new", label: "Сначала новинки" },
  { value: "price-asc", label: "Сначала дешевле" },
  { value: "price-desc", label: "Сначала дороже" },
  { value: "rating", label: "По рейтингу" },
];
const PAGE_SIZE = 9;
const MAX_PRICE = Math.ceil(Math.max(...ALL_PRODUCTS.map((product) => product.price)) / 10000) * 10000;

function Stars({ value, reviews }: { value: number; reviews: number }) {
  return (
    <div className="catalog-product-rating">
      <div>
        {[1, 2, 3, 4, 5].map((star) => (
          <svg key={star} width="11" height="11" viewBox="0 0 12 12" fill={star <= Math.round(value) ? "currentColor" : "#e8e4df"}>
            <path d="m6 1 1.35 2.74 3.15.53-2.25 2.19.53 3.09L6 8 3.22 9.55l.53-3.09L1.5 4.27l3.15-.53L6 1Z" />
          </svg>
        ))}
      </div>
      <b>{value}</b>
      <span>{reviews} отзывов</span>
    </div>
  );
}

function CheckControl({
  checked,
  onChange,
  label,
  count,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  count?: number;
}) {
  return (
    <label className="catalog-check">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <i>
        <svg width="9" height="7" viewBox="0 0 10 8" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="m1 4 3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </i>
      <span>{label}</span>
      {count !== undefined && <em>{count}</em>}
    </label>
  );
}

function ProductCard({
  product,
  view,
  inCart,
  added,
  onOpen,
  onAdd,
}: {
  product: CatalogProduct;
  view: "grid" | "list";
  inCart: boolean;
  added: boolean;
  onOpen: () => void;
  onAdd: () => void;
}) {
  return (
    <article className={`catalog-product-card ${view === "list" ? "is-list" : ""}`}>
      <div className="catalog-product-image" onClick={onOpen}>
        <img src={product.img} alt={product.name} />
        {product.badge && <span style={{ background: product.badgeColor }}>{product.badge}</span>}
        <button aria-label="Добавить в избранное">
          <svg width="17" height="16" viewBox="0 0 18 17" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M9 15.5 2.2 9.1C-1.5 5.5 3.7-.1 7.5 3.3L9 4.8l1.5-1.5c3.8-3.4 9 2.2 5.3 5.8Z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {!product.inStock && <div className="catalog-product-unavailable">Нет в наличии</div>}
      </div>
      <div className="catalog-product-content">
        <div className="catalog-product-overline">
          <span>{product.brand}</span>
          <em>{product.categoryName}</em>
        </div>
        <h3 onClick={onOpen}>{product.name}</h3>
        <Stars value={product.rating} reviews={product.reviews} />
        {view === "list" && <p>{product.description}</p>}
        <div className="catalog-product-buy">
          <div>
            <strong>{product.price.toLocaleString("ru")} ₽</strong>
            {product.oldPrice && <del>{product.oldPrice.toLocaleString("ru")} ₽</del>}
          </div>
          <button disabled={!product.inStock} onClick={onAdd}>
            {added ? "Добавлено" : inCart ? "В корзине" : "В корзину"}
          </button>
        </div>
      </div>
    </article>
  );
}

export function CatalogPage() {
  const navigate = useNavigate();
  const { add, items } = useCart();
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [inStock, setInStock] = useState(false);
  const [saleOnly, setSaleOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("popular");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");
  const [expandedBrands, setExpandedBrands] = useState(false);
  const [collapsedFilters, setCollapsedFilters] = useState<string[]>([]);
  const [added, setAdded] = useState<number | null>(null);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return ALL_PRODUCTS.filter((product) => {
      if (category !== "all" && product.categorySlug !== category) return false;
      if (query && !`${product.name} ${product.brand} ${product.categoryName}`.toLowerCase().includes(query)) return false;
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;
      if (product.price > maxPrice) return false;
      if (inStock && !product.inStock) return false;
      if (saleOnly && !product.oldPrice) return false;
      if (product.rating < minRating) return false;
      return true;
    }).sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "new") return Number(b.badge === "Новинка") - Number(a.badge === "Новинка") || b.id - a.id;
      return b.reviews - a.reviews;
    });
  }, [category, inStock, maxPrice, minRating, saleOnly, search, selectedBrands, sort]);

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const visibleProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const matchingBrands = BRANDS.filter((brand) => brand.toLowerCase().includes(brandSearch.toLowerCase()));
  const visibleBrands = brandSearch || expandedBrands ? matchingBrands : matchingBrands.slice(0, 6);
  const activeFilters =
    selectedBrands.length +
    Number(maxPrice < MAX_PRICE) +
    Number(inStock) +
    Number(saleOnly) +
    Number(minRating > 0);

  useEffect(() => {
    setPage(1);
  }, [category, inStock, maxPrice, minRating, saleOnly, search, selectedBrands, sort]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((current) =>
      current.includes(brand) ? current.filter((item) => item !== brand) : [...current, brand],
    );
  };

  const toggleFilterGroup = (group: string) => {
    setCollapsedFilters((current) =>
      current.includes(group) ? current.filter((item) => item !== group) : [...current, group],
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setMaxPrice(MAX_PRICE);
    setInStock(false);
    setSaleOnly(false);
    setMinRating(0);
  };

  const handleAdd = (product: CatalogProduct) => {
    add({
      id: product.id,
      categorySlug: product.categorySlug,
      name: product.name,
      price: product.price,
      img: product.img,
    });
    setAdded(product.id);
    window.setTimeout(() => setAdded(null), 1600);
  };

  const scrollToCatalog = () => {
    document.getElementById("catalog-products")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="catalog-page">
      <section className="catalog-hero">
        <img src="https://images.unsplash.com/photo-1622300868582-544a4dde5395?w=1600&h=520&fit=crop&auto=format" alt="" />
        <div className="catalog-hero-shade" />
        <div className="catalog-hero-content">
          <span>Магазин сообщества</span>
          <h1>Экипировка</h1>
          <p>Всё для серьёзного бездорожья: от лебёдки до спутниковой связи. Проверено участниками сообщества.</p>
          <div className="catalog-hero-search">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="8" cy="8" r="5.5" />
              <path d="m12 12 4 4" strokeLinecap="round" />
            </svg>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && scrollToCatalog()}
              placeholder="Название, бренд или категория"
            />
            {search && <button className="catalog-search-clear" onClick={() => setSearch("")} aria-label="Очистить поиск">×</button>}
            <button onClick={scrollToCatalog}>Найти</button>
          </div>
        </div>
        <div className="catalog-hero-stat">
          <strong>{CATEGORIES.reduce((sum, item) => sum + item.count, 0)}</strong>
          <span>товаров в каталоге</span>
        </div>
      </section>

      <main className="catalog-main" id="catalog-products">
        <div className="catalog-section-heading">
          <div>
            <span>Выберите направление</span>
            <h2>Категории</h2>
          </div>
          <button onClick={() => setCategory("all")} className={category === "all" ? "is-active" : ""}>Смотреть всё</button>
        </div>

        <div className="catalog-category-strip">
          {CATEGORIES.map((item) => (
            <button
              key={item.slug}
              className={category === item.slug ? "is-active" : ""}
              onClick={() => setCategory(category === item.slug ? "all" : item.slug)}
            >
              <img src={item.img} alt="" />
              <span>
                <strong>{item.name}</strong>
                <small>{item.count} товаров</small>
              </span>
              <svg width="7" height="12" viewBox="0 0 8 14" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="m1 1 6 6-6 6" strokeLinecap="round" />
              </svg>
            </button>
          ))}
        </div>

        <div className="catalog-toolbar">
          <button className="catalog-filter-mobile" onClick={() => setFiltersOpen(true)}>
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 4h14M5 9h8M7 14h4" strokeLinecap="round" />
            </svg>
            Фильтры
            {activeFilters > 0 && <b>{activeFilters}</b>}
          </button>
          <div className="catalog-result-count">
            <strong>{filteredProducts.length}</strong>
            <span>товаров найдено</span>
          </div>
          <div className="catalog-toolbar-actions">
            <label>
              <span>Сортировка:</span>
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
              <svg width="9" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="m1 1 4 4 4-4" strokeLinecap="round" />
              </svg>
            </label>
            <div className="catalog-view-toggle">
              <button className={view === "grid" ? "is-active" : ""} onClick={() => setView("grid")} aria-label="Плитка">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M1 1h6v6H1zM9 1h6v6H9zM1 9h6v6H1zM9 9h6v6H9z" />
                </svg>
              </button>
              <button className={view === "list" ? "is-active" : ""} onClick={() => setView("list")} aria-label="Список">
                <svg width="16" height="14" viewBox="0 0 17 14" fill="currentColor">
                  <path d="M0 0h3v3H0zM5 0h12v3H5zM0 5.5h3v3H0zM5 5.5h12v3H5zM0 11h3v3H0zM5 11h12v3H5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="catalog-layout">
          {filtersOpen && <button className="catalog-filter-backdrop" onClick={() => setFiltersOpen(false)} aria-label="Закрыть фильтры" />}
          <aside className={`catalog-filters ${filtersOpen ? "is-open" : ""}`}>
            <div className="catalog-filter-head">
              <div>
                <span>Настройте выдачу</span>
                <strong>Фильтры</strong>
              </div>
              <button onClick={() => setFiltersOpen(false)} aria-label="Закрыть">×</button>
            </div>

            <div className={`catalog-filter-group ${collapsedFilters.includes("availability") ? "is-collapsed" : ""}`}>
              <button className="catalog-filter-group-toggle" onClick={() => toggleFilterGroup("availability")}>
                <strong>Наличие и выгода</strong>
                <span>
                  {Number(inStock) + Number(saleOnly) > 0 && <b>{Number(inStock) + Number(saleOnly)}</b>}
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="m1 1 4 4 4-4" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
              <div className="catalog-filter-group-body">
                <CheckControl
                  checked={inStock}
                  onChange={() => setInStock((value) => !value)}
                  label="Только в наличии"
                  count={ALL_PRODUCTS.filter((product) => product.inStock).length}
                />
                <CheckControl
                  checked={saleOnly}
                  onChange={() => setSaleOnly((value) => !value)}
                  label="Со скидкой"
                  count={ALL_PRODUCTS.filter((product) => product.oldPrice).length}
                />
              </div>
            </div>

            <div className={`catalog-filter-group ${collapsedFilters.includes("price") ? "is-collapsed" : ""}`}>
              <button className="catalog-filter-group-toggle" onClick={() => toggleFilterGroup("price")}>
                <strong>Цена, ₽</strong>
                <span>
                  {maxPrice < MAX_PRICE && <b>1</b>}
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="m1 1 4 4 4-4" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
              <div className="catalog-filter-group-body">
                <div className="catalog-filter-subhead">
                  <span>Диапазон</span>
                  {maxPrice < MAX_PRICE && <button onClick={() => setMaxPrice(MAX_PRICE)}>Сбросить</button>}
                </div>
                <div className="catalog-price-values">
                  <span>от 0</span>
                  <span>до {maxPrice.toLocaleString("ru")}</span>
                </div>
                <input
                  className="catalog-price-range"
                  type="range"
                  min="5000"
                  max={MAX_PRICE}
                  step="5000"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(Number(event.target.value))}
                  style={{ "--range-progress": `${(maxPrice / MAX_PRICE) * 100}%` } as React.CSSProperties}
                />
              </div>
            </div>

            <div className={`catalog-filter-group ${collapsedFilters.includes("brands") ? "is-collapsed" : ""}`}>
              <button className="catalog-filter-group-toggle" onClick={() => toggleFilterGroup("brands")}>
                <strong>Бренд</strong>
                <span>
                  {selectedBrands.length > 0 && <b>{selectedBrands.length}</b>}
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="m1 1 4 4 4-4" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
              <div className="catalog-filter-group-body">
                <div className="catalog-filter-subhead">
                  <span>{matchingBrands.length} брендов</span>
                  {selectedBrands.length > 0 && <button onClick={() => setSelectedBrands([])}>Сбросить</button>}
                </div>
                <div className="catalog-brand-search">
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <circle cx="7" cy="7" r="5" />
                    <path d="m11 11 3 3" strokeLinecap="round" />
                  </svg>
                  <input value={brandSearch} onChange={(event) => setBrandSearch(event.target.value)} placeholder="Найти бренд" />
                </div>
                <div className="catalog-brand-list">
                  {visibleBrands.map((brand) => (
                    <CheckControl
                      key={brand}
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      label={brand}
                      count={ALL_PRODUCTS.filter((product) => product.brand === brand).length}
                    />
                  ))}
                  {matchingBrands.length === 0 && <span className="catalog-brand-empty">Бренды не найдены</span>}
                </div>
                {!brandSearch && matchingBrands.length > 6 && (
                  <button className="catalog-show-more" onClick={() => setExpandedBrands((value) => !value)}>
                    {expandedBrands ? "Скрыть" : `Показать ещё · ${matchingBrands.length - 6}`}
                    <svg className={expandedBrands ? "is-up" : ""} width="9" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="m1 1 4 4 4-4" strokeLinecap="round" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className={`catalog-filter-group ${collapsedFilters.includes("rating") ? "is-collapsed" : ""}`}>
              <button className="catalog-filter-group-toggle" onClick={() => toggleFilterGroup("rating")}>
                <strong>Рейтинг</strong>
                <span>
                  {minRating > 0 && <b>1</b>}
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="m1 1 4 4 4-4" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
              <div className="catalog-filter-group-body">
                {[4.8, 4.6, 4.4].map((rating) => (
                  <label className="catalog-rating-radio" key={rating}>
                    <input type="radio" checked={minRating === rating} onChange={() => setMinRating(rating)} />
                    <i />
                    <span>
                      <b>★</b> от {rating}
                    </span>
                  </label>
                ))}
                {minRating > 0 && <button className="catalog-inline-reset" onClick={() => setMinRating(0)}>Показать любой рейтинг</button>}
              </div>
            </div>

            {activeFilters > 0 && <button className="catalog-clear-filters" onClick={clearFilters}>Сбросить все фильтры · {activeFilters}</button>}
            <button className="catalog-filter-apply" onClick={() => setFiltersOpen(false)}>
              Показать {filteredProducts.length} товаров
            </button>
          </aside>

          <section className="catalog-results">
            {(activeFilters > 0 || category !== "all" || search) && (
              <div className="catalog-active-filters">
                {category !== "all" && (
                  <button onClick={() => setCategory("all")}>
                    {CATEGORIES.find((item) => item.slug === category)?.name}<span>×</span>
                  </button>
                )}
                {search && <button onClick={() => setSearch("")}>Поиск: {search}<span>×</span></button>}
                {selectedBrands.map((brand) => <button key={brand} onClick={() => toggleBrand(brand)}>{brand}<span>×</span></button>)}
                {inStock && <button onClick={() => setInStock(false)}>В наличии<span>×</span></button>}
                {saleOnly && <button onClick={() => setSaleOnly(false)}>Со скидкой<span>×</span></button>}
                {maxPrice < MAX_PRICE && <button onClick={() => setMaxPrice(MAX_PRICE)}>До {maxPrice.toLocaleString("ru")} ₽<span>×</span></button>}
              </div>
            )}

            {visibleProducts.length > 0 ? (
              <div className={`catalog-product-grid ${view === "list" ? "is-list" : ""}`}>
                {visibleProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    view={view}
                    inCart={items.some((item) => item.id === product.id)}
                    added={added === product.id}
                    onOpen={() => navigate(`/catalog/${product.categorySlug}/${product.id}`)}
                    onAdd={() => handleAdd(product)}
                  />
                ))}
              </div>
            ) : (
              <div className="catalog-empty">
                <svg width="42" height="42" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="21" cy="21" r="13" />
                  <path d="m31 31 10 10M15 18h12M18 25h6" strokeLinecap="round" />
                </svg>
                <strong>Ничего не нашли</strong>
                <p>Попробуйте изменить запрос или сбросить часть фильтров</p>
                <button onClick={() => { clearFilters(); setSearch(""); setCategory("all"); }}>Сбросить фильтры</button>
              </div>
            )}

            {filteredProducts.length > 0 && (
              <div className="catalog-pagination">
                <span>
                  Показано {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredProducts.length)} из {filteredProducts.length}
                </span>
                <div>
                  <button disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} aria-label="Предыдущая страница">
                    <svg width="7" height="12" viewBox="0 0 8 14" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M7 1 1 7l6 6" /></svg>
                  </button>
                  {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
                    <button key={number} className={page === number ? "is-active" : ""} onClick={() => setPage(number)}>{number}</button>
                  ))}
                  <button disabled={page === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))} aria-label="Следующая страница">
                    <svg width="7" height="12" viewBox="0 0 8 14" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m1 1 6 6-6 6" /></svg>
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
