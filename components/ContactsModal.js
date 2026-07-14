'use client';

import { t } from '../lib/data';
import { useModal } from '../context/ModalContext';

export default function ContactsModal() {
  const { closeModal } = useModal();
  return (
    <>
      <h3>{t('contacts')}</h3>
      <div className="contact-line">+380 (00) 000-00-01</div>
      <div className="contact-line">+380 (00) 000-00-02</div>
      <div className="contact-line">+380 (00) 000-00-03</div>
      <div className="contact-line">Telegram: @nui_shooo</div>
      <a
        className="insta-link"
        href="https://www.instagram.com/nui.shooo?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
        target="_blank"
        rel="noopener noreferrer"
      >
        Instagram: nui.shooo
      </a>
      <button className="btn btn-primary" style={{ width: '100%', marginTop: 14 }} onClick={closeModal}>
        {t('done')}
      </button>
    </>
  );
}
