'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CATEGORIES, catName, t } from '../lib/data';
import { useStore } from '../context/StoreContext';
import { useModal } from '../context/ModalContext';
import ContactsModal from './ContactsModal';

export default function Header({ searchValue, onSearch }) {
  const router = useRouter();
  const { cartCount, favCount } = useStore();
  const { openModal } = useModal();
  const [catalogOpen, setCatalogOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (navRef.current && !navRef.current.contains(e.target)) setCatalogOpen(false);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  function goHome() {
    router.push('/');
  }

  function goCatalog(catId) {
    setCatalogOpen(false);
    if (catId === 'all') router.push('/');
    else router.push(`/?category=${catId}`);
  }

  return (
    <header className="site-header">
      <div className="header-top">
        <button className="logo-btn" onClick={goHome}>
          <img src="/assets/logo.png" alt="nui.shooo" />
          <span>nui.shooo</span>
        </button>

        <div className="search-wrap">
          <span className="search-icon">🔎</span>
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchValue || ''}
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
        </div>

        <div className="nav-actions" ref={navRef}>
          <div className="nav-item">
            <button className="nav-btn" id="catalogNavBtn" onClick={() => setCatalogOpen((v) => !v)}>
              <span className="hamburger-icon">☰</span> <span className="txt">{t('catalog')}</span>
            </button>
            <div className={`dropdown wide${catalogOpen ? '' : ' hidden'}`}>
              <div className="dropdown-title">{t('categoriesTitle')}</div>
              <div className="catalog-grid">
                {CATEGORIES.map((c) => (
                  <a href="#" key={c.id} onClick={(e) => { e.preventDefault(); goCatalog(c.id); }}>
                    {catName(c.id)}
                  </a>
                ))}
              </div>
              <a href="#" onClick={(e) => { e.preventDefault(); goCatalog('all'); }}>{t('allProductsLink')}</a>
              <div style={{ borderTop: '1px solid #eee', marginTop: 8, paddingTop: 8 }}>
                <Link href="/about" onClick={() => setCatalogOpen(false)}>{t('aboutUs')}</Link>
                <a href="#" onClick={(e) => { e.preventDefault(); setCatalogOpen(false); openModal(<ContactsModal />); }}>
                  {t('contacts')}
                </a>
              </div>
            </div>
          </div>

          <div className="nav-item desktop-only">
            <Link href="/about" className="nav-btn"><span className="txt">{t('aboutUs')}</span></Link>
          </div>

          <div className="nav-item desktop-only">
            <button className="nav-btn" onClick={() => openModal(<ContactsModal />)}>
              <span className="txt">{t('contacts')}</span>
            </button>
          </div>

          <div className="nav-item">
            <Link href="/favorites" className="icon-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span className={`badge${favCount === 0 ? ' hidden' : ''}`}>{favCount}</span>
            </Link>
          </div>

          <div className="nav-item">
            <Link href="/cart" className="icon-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none" />
                <circle cx="17" cy="20" r="1.4" fill="currentColor" stroke="none" />
                <path d="M2.5 3h2l2.2 11.4a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L21 7H6" />
              </svg>
              <span className={`badge${cartCount === 0 ? ' hidden' : ''}`}>{cartCount}</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
