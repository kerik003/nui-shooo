'use client';

import Link from 'next/link';
import { t } from '../lib/data';
import { useModal } from '../context/ModalContext';
import ContactsModal from './ContactsModal';

export default function Footer() {
  const { openModal } = useModal();
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-col">
          <h4>{t('footerShop')}</h4>
          <Link href="/" className="link">{t('catalog')}</Link>
          <Link href="/about" className="link">{t('aboutUs')}</Link>
          <button className="link" onClick={() => openModal(<ContactsModal />)}>{t('contacts')}</button>
        </div>
        <div className="footer-col">
          <h4>{t('footerReviews')}</h4>
          <a href="https://www.instagram.com/nui.shooo" target="_blank" rel="noopener noreferrer">{t('footerReviewsInsta')}</a>
          <a href="#" onClick={(e) => e.preventDefault()}>{t('footerTelegramChannel')}</a>
        </div>
        <div className="footer-col">
          <h4>{t('footerSocials')}</h4>
          <a
            href="https://www.instagram.com/nui.shooo?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
          <a href="#" onClick={(e) => e.preventDefault()}>{t('telegramLine')}</a>
        </div>
        <div className="footer-col">
          <h4>nui.shooo</h4>
          <p style={{ fontSize: 13, color: '#9a9a9e', maxWidth: 220 }}>{t('footerBrandTagline')}</p>
        </div>
      </div>
      <div className="footer-bottom">{t('footerRights')}</div>
    </footer>
  );
}
