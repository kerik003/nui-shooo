'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { catName, fuzzyIncludes, productName, t } from '../lib/data';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

function CatalogInner() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'all';
  const search = (searchParams.get('q') || '').trim().toLowerCase();
  const { products, loading } = useStore();

  const title = search ? `${t('searchResults')}: "${search}"` : (category === 'all' ? t('allProducts') : catName(category));
  const list = products.filter((p) => {
    const matchCat = category === 'all' || p.category === category;
    const matchSearch = !search || fuzzyIncludes(productName(p), search);
    return matchCat && matchSearch;
  });

  return (
    <section>
      <div className="section-title">{title}</div>
      <div className="section-sub">{search && list.length === 0 ? t('notFound') : (!search ? t('fastPath') : '')}</div>
      {loading ? (
        <div className="loading-state">Завантаження товарів...</div>
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
