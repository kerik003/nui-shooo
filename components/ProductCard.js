'use client';

import { useRouter } from 'next/navigation';
import { productName, productThumb, t } from '../lib/data';
import { useStore } from '../context/StoreContext';
import { useModal } from '../context/ModalContext';
import FavModal from './FavModal';

export default function ProductCard({ product, onUnfavorite }) {
  const router = useRouter();
  const { isFavorited } = useStore();
  const { openModal } = useModal();
  const favActive = isFavorited(product.id);
  const thumb = productThumb(product);

  function open() {
    router.push(`/product/${product.id}`);
  }

  function handleFavClick(e) {
    e.stopPropagation();
    if (onUnfavorite) {
      onUnfavorite();
    } else {
      openModal(<FavModal productId={product.id} />);
    }
  }

  return (
    <div className="product-card">
      <div className="product-thumb" onClick={open}>
        {thumb ? <img src={thumb} alt="" /> : product.icon}
      </div>
      <button className={`fav-toggle${favActive ? ' active' : ''}`} onClick={handleFavClick}>
        {favActive ? '♥' : '♡'}
      </button>
      <div className="product-info" onClick={open}>
        <div className="product-name">{productName(product)}</div>
        <div className="product-price">{product.price} ₴</div>
        <div className={`stock ${product.inStock ? 'in' : 'out'}`}>
          {product.inStock ? t('inStock') : t('outStock')}
        </div>
      </div>
    </div>
  );
}
