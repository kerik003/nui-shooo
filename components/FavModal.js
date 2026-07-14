'use client';

import { useState } from 'react';
import { t } from '../lib/data';
import { useStore } from '../context/StoreContext';
import { useModal } from '../context/ModalContext';

export default function FavModal({ productId }) {
  const { favLists, toggleProductInList, createFavList } = useStore();
  const { closeModal } = useModal();
  const [newName, setNewName] = useState('');
  const listNames = Object.keys(favLists);

  function handleCreate() {
    const name = newName.trim();
    if (!name) return;
    createFavList(name, productId);
    setNewName('');
  }

  return (
    <>
      <h3>{t('addToList')}</h3>
      <div className="modal-list">
        {listNames.map((n) => (
          <label className="modal-list-item" key={n}>
            <input
              type="checkbox"
              checked={favLists[n].includes(productId)}
              onChange={() => toggleProductInList(n, productId)}
            />
            <span>{n}</span>
          </label>
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
      <button className="btn btn-primary" style={{ width: '100%', marginTop: 14 }} onClick={closeModal}>
        {t('done')}
      </button>
    </>
  );
}
