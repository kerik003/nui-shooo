'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { catName, fuzzyIncludes, productName, t } from '../lib/data';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';
import FilterSort from '../components/FilterSort';

function CatalogInner() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'all';
  const search = (searchParams.get('q') || '').trim().toLowerCase();
  const { products, loading } = useStore();

  const title = search ? `${t('searchResults')}: "${search}"` : (category === 'all' ? t('allProducts') : catName(category));

  // границы цены среди всех товаров — пересчитываются, когда приходят данные
  const priceBounds = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 1000 };
    const prices = products.map((p) => p.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [products]);

  const [sort, setSort] = useState('default');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [priceMin, setPriceMin] = useState(priceBounds.min);
  const [priceMax, setPriceMax] = useState(priceBounds.max);

  // как только реальные границы цены известны (после загрузки товаров) — подставляем их по умолчанию
  useEffect(() => {
    setPriceMin(priceBounds.min);
    setPriceMax(priceBounds.max);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceBounds.min, priceBounds.max]);

  function handlePriceChange(min, max) {
    setPriceMin(min);
    setPriceMax(max);
  }

  const list = useMemo(() => {
    let filtered = products.filter((p) => {
      const matchCat = category === 'all' || p.category === category;
      const matchSearch = !search || fuzzyIncludes(productName(p), search);
      const matchStock = !onlyInStock || p.inStock;
      const matchPrice = p.price >= priceMin && p.price <= priceMax;
      return matchCat && matchSearch && matchStock && matchPrice;
    });

    if (sort === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price);
    else if (sort === 'name-asc') filtered = [...filtered].sort((a, b) => productName(a).localeCompare(productName(b), 'uk'));

    return filtered;
  }, [products, category, search, onlyInStock, priceMin, priceMax, sort]);

  return (
    <section>
      <div className="section-title">{title}</div>
      <div className="section-sub">{search && list.length === 0 ? t('notFound') : (!search ? t('fastPath') : '')}</div>

      {!loading && products.length > 0 && (
        <FilterSort
          sort={sort}
          onSortChange={setSort}
          onlyInStock={onlyInStock}
          onToggleInStock={setOnlyInStock}
          priceMin={priceMin}
          priceMax={priceMax}
          priceBounds={priceBounds}
          onPriceChange={handlePriceChange}
        />
      )}

      {loading ? (
        <div className="loading-state">Завантаження товарів...</div>
      ) : list.length === 0 ? (
        <div className="empty-state">Немає товарів, що відповідають фільтру</div>
      ) : (
        <div className="product-grid">
          {list.map((p) => (
            <ProductCard product={p} key={p.id} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="loading-state">Завантаження товарів...</div>}>
      <CatalogInner />
    </Suspense>
  );
}
