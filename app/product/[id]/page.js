'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  colorName, firstAvailableIndex, isLightColor, productName, t,
} from '../../../lib/data';
import { useStore } from '../../../context/StoreContext';
import { useModal } from '../../../context/ModalContext';
import FavModal from '../../../components/FavModal';

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getProduct, isFavorited, addToCart, loading } = useStore();
  const { openModal } = useModal();

  const product = getProduct(id);

  const [colorIndex, setColorIndex] = useState(0);
  const [sizeIndex, setSizeIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);

  // при смене товара — подставляем первый доступный цвет/размер
  useEffect(() => {
    if (!product) return;
    setColorIndex(firstAvailableIndex(product.colors, product.unavailableColors, colorName));
    setSizeIndex(product.sizes && product.sizes.length ? firstAvailableIndex(product.sizes, product.unavailableSizes, (s) => s) : 0);
    setQty(1);
    setImageIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return <div className="loading-state">Завантаження товарів...</div>;
  }
  if (!product) {
    return (
      <div className="product-page">
        <a href="#" className="back-link" onClick={(e) => { e.preventDefault(); router.push('/'); }}>{t('back')}</a>
        <div className="empty-state">Товар не знайдено</div>
      </div>
    );
  }

  const favActive = isFavorited(product.id);
  const hasImages = product.images && product.images.length > 0;

  function handleAddToCart() {
    addToCart(product.id, colorIndex, sizeIndex, qty);
    router.push('/cart');
  }

  return (
    <div className="product-page">
      <a href="#" className="back-link" onClick={(e) => { e.preventDefault(); router.push(product.category ? `/?category=${product.category}` : '/'); }}>
        {t('back')}
      </a>
      <div className="product-detail">
        <div>
          <div className="product-detail-img">
            {hasImages ? <img src={product.images[imageIndex]} alt="" /> : product.icon}
          </div>
          {hasImages && product.images.length > 1 && (
            <div className="thumb-strip">
              {product.images.map((img, i) => (
                <div
                  key={i}
                  className={`thumb-strip-item${i === imageIndex ? ' selected' : ''}`}
                  onClick={() => setImageIndex(i)}
                >
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="product-detail-info">
          <h1>{productName(product)}</h1>
          <div className="price">{product.price} ₴</div>
          <div className={`stock ${product.inStock ? 'in' : 'out'}`} style={{ marginBottom: 8 }}>
            {product.inStock ? t('inStock') : t('outStock')}
          </div>
          {product.description && <div className="product-description">{product.description}</div>}

          <div className="field-label">{t('color')}</div>
          <div className="color-options">
            {product.colors.map((c, i) => {
              const unavailable = product.unavailableColors && product.unavailableColors.includes(colorName(c).toLowerCase());
              return (
                <div
                  key={i}
                  className={`color-dot${i === colorIndex ? ' selected' : ''}${unavailable ? ' unavailable' : ''}`}
                  data-light={isLightColor(c.hex) ? 1 : 0}
                  style={{ background: c.hex }}
                  title={colorName(c) + (unavailable ? ' — немає в наявності' : '')}
                  onClick={unavailable ? undefined : () => setColorIndex(i)}
                />
              );
            })}
            <span className="color-name-label">{colorName(product.colors[colorIndex])}</span>
          </div>

          {product.sizes && product.sizes.length > 0 && (
            <>
              <div className="field-label">Розмір</div>
              <div className="size-options">
                {product.sizes.map((s, i) => {
                  const unavailable = product.unavailableSizes && product.unavailableSizes.includes(s.toLowerCase());
                  return (
                    <button
                      type="button"
                      key={i}
                      className={`size-chip${i === sizeIndex ? ' selected' : ''}${unavailable ? ' unavailable' : ''}`}
                      disabled={unavailable}
                      title={unavailable ? 'Немає в наявності' : undefined}
                      onClick={unavailable ? undefined : () => setSizeIndex(i)}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          <div className="field-label">{t('quantity')}</div>
          <div className="qty-row">
            <button className="qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
            <div className="qty-val">{qty}</div>
            <button className="qty-btn" onClick={() => setQty((q) => q + 1)}>+</button>
          </div>

          <div className="buy-row">
            <button className="btn btn-primary" disabled={!product.inStock} onClick={handleAddToCart}>
              {product.inStock ? t('buy') : t('outOfStockBtn')}
            </button>
            <button className={`heart-big${favActive ? ' active' : ''}`} onClick={() => openModal(<FavModal productId={product.id} />)}>
              {favActive ? '♥' : '♡'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
