'use client';

import { useRouter } from 'next/navigation';
import { colorName, productName, productThumb, t } from '../../lib/data';
import { useStore } from '../../context/StoreContext';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, getProduct } = useStore();

  if (cart.length === 0) {
    return (
      <section className="cart-page">
        <div className="section-title">{t('cartTitle')}</div>
        <div className="empty-state">
          {t('emptyCart')}
          <br /><br />
          <button className="btn btn-primary" onClick={() => router.push('/')}>{t('goShopping')}</button>
        </div>
      </section>
    );
  }

  let total = 0;
  const rows = cart.map((c, idx) => {
    const p = getProduct(c.productId);
    if (!p) return null;
    const sum = p.price * c.qty;
    total += sum;
    const thumb = productThumb(p);
    return (
      <div className="cart-item" key={idx}>
        <div className="thumb">{thumb ? <img src={thumb} alt="" /> : p.icon}</div>
        <div className="cart-item-info">
          <div className="name">{productName(p)}</div>
          <div className="meta">
            {t('color')}: {colorName(p.colors[c.colorIndex])}
            {p.sizes && p.sizes.length ? ` · Розмір: ${p.sizes[c.sizeIndex]}` : ''}
            {' · '}{t('quantity')}: {c.qty} · {sum} ₴
          </div>
        </div>
        <button className="remove" onClick={() => removeFromCart(idx)}>{t('remove')}</button>
      </div>
    );
  });

  return (
    <section className="cart-page">
      <div className="section-title">{t('cartTitle')}</div>
      {rows}
      <div className="cart-total"><span>{t('total')}</span><span>{total} ₴</span></div>
      <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => router.push('/checkout')}>
        {t('checkoutBtn')}
      </button>
    </section>
  );
}
