'use client';

import { useState } from 'react';
import { t } from '../../lib/data';
import { useStore } from '../../context/StoreContext';
import ProductCard from '../../components/ProductCard';

export default function FavoritesPage() {
  const { favLists, createFavList, removeFromList, getProduct } = useStore();
  const listNames = Object.keys(favLists);
  const [activeList, setActiveList] = useState(listNames[0] || 'Избранное');
  const [newName, setNewName] = useState('');

  const safeActiveList = listNames.includes(activeList) ? activeList : listNames[0];
  const items = (favLists[safeActiveList] || []).map((id) => getProduct(id)).filter(Boolean);

  function handleCreate() {
    const n = newName.trim();
    if (!n) return;
    createFavList(n);
    setActiveList(n);
    setNewName('');
  }

  return (
    <section>
      <div className="section-title">{t('favoritesTitle')}</div>
      <div className="section-sub">{t('favSub')}</div>
      <div className="fav-lists">
        {listNames.map((n) => (
          <button
            key={n}
            className={`fav-list-chip${n === safeActiveList ? ' active' : ''}`}
            onClick={() => setActiveList(n)}
          >
            {n} ({favLists[n].length})
          </button>
        ))}
      </div>
      <div className="new-list-row">
        <input
          type="text"
          placeholder={t('newListPlaceholder')}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button className="btn btn-outline" onClick={handleCreate}>{t('create')}</button>
      </div>
      <div className="product-grid">
        {items.length ? (
          items.map((p) => (
            <ProductCard product={p} key={p.id} onUnfavorite={() => removeFromList(safeActiveList, p.id)} />
          ))
        ) : (
          <div className="empty-state">{t('emptyList')}</div>
        )}
      </div>
    </section>
  );
}
