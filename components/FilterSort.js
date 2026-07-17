'use client';

export default function FilterSort({
  sort, onSortChange,
  onlyInStock, onToggleInStock,
  priceMin, priceMax, priceBounds, onPriceChange,
}) {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label className="filter-label" htmlFor="sortSelect">Сортування</label>
        <select id="sortSelect" value={sort} onChange={(e) => onSortChange(e.target.value)}>
          <option value="default">За замовчуванням</option>
          <option value="price-asc">Ціна: спочатку дешевші</option>
          <option value="price-desc">Ціна: спочатку дорожчі</option>
          <option value="name-asc">Назва: А → Я</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">
          Ціна: {priceMin}–{priceMax} ₴
        </label>
        <div className="price-range-row">
          <input
            type="range"
            min={priceBounds.min}
            max={priceBounds.max}
            value={priceMin}
            onChange={(e) => onPriceChange(Math.min(Number(e.target.value), priceMax), priceMax)}
          />
          <input
            type="range"
            min={priceBounds.min}
            max={priceBounds.max}
            value={priceMax}
            onChange={(e) => onPriceChange(priceMin, Math.max(Number(e.target.value), priceMin))}
          />
        </div>
      </div>

      <label className="filter-checkbox">
        <input type="checkbox" checked={onlyInStock} onChange={(e) => onToggleInStock(e.target.checked)} />
        Тільки в наявності
      </label>
    </div>
  );
}
