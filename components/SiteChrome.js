'use client';

import { Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Header from './Header';
import CatStrip from './CatStrip';
import Footer from './Footer';

function SiteChromeInner({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'all';
  const currentSearch = searchParams.get('q') || '';

  function handleSearch(value) {
    const params = new URLSearchParams();
    if (value.trim()) params.set('q', value);
    router.push(`/${params.toString() ? '?' + params.toString() : ''}`);
  }

  return (
    <>
      <Header searchValue={pathname === '/' ? currentSearch : ''} onSearch={handleSearch} />
      <CatStrip currentCategory={pathname === '/' ? currentCategory : 'none'} />
      <main className="container">{children}</main>
      <Footer />
    </>
  );
}

export default function SiteChrome({ children }) {
  return (
    <Suspense fallback={null}>
      <SiteChromeInner>{children}</SiteChromeInner>
    </Suspense>
  );
}
