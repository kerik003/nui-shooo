'use client';

import { useRouter } from 'next/navigation';
import { CATEGORIES, catName, t } from '../lib/data';

export default function CatStrip({ currentCategory }) {
  const router = useRouter();
  const all = [{ id: 'all', icon: '✨' }, ...CATEGORIES];

  function go(catId) {
    router.push(catId === 'all' ? '/' : `/?category=${catId}`);
  }

  return (
    <nav className="cat-strip">
      <div className="cat-strip-inner">
        {all.map((c) => (
          <div
            key={c.id}
            className={`cat-circle${currentCategory === c.id ? ' active' : ''}`}
            onClick={() => go(c.id)}
          >
            <div className="circle">{c.icon}</div>
            <div>{c.id === 'all' ? t('allProducts') : catName(c.id)}</div>
          </div>
        ))}
      </div>
    </nav>
  );
}
