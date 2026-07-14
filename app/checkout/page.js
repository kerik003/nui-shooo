'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { colorName, productName, t } from '../../lib/data';
import { useStore } from '../../context/StoreContext';
import { useModal } from '../../context/ModalContext';
import { saveOrderToSupabase } from '../../lib/supabase';
import { novaPoshtaConfigured, npSearchCities, npLoadWarehouses } from '../../lib/novaposhta';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getProduct, clearCart, nextOrderNumber } = useStore();
  const { openModal, closeModal } = useModal();

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [branch, setBranch] = useState('');
  const [payment, setPayment] = useState('cod');
  const [submitting, setSubmitting] = useState(false);

  // Нова Пошта: поиск города
  const [cityQuery, setCityQuery] = useState('');
  const [cityRef, setCityRef] = useState('');
  const [cityResults, setCityResults] = useState([]);
  const [showCityResults, setShowCityResults] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [warehousesLoading, setWarehousesLoading] = useState(false);
  const npFieldRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (cart.length === 0) router.replace('/cart');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function onDocClick(e) {
      if (npFieldRef.current && !npFieldRef.current.contains(e.target)) setShowCityResults(false);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  function onCityInput(value) {
    setCityQuery(value);
    setCityRef('');
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const results = await npSearchCities(value);
      setCityResults(results);
      setShowCityResults(results.length > 0);
    }, 350);
  }

  async function selectCity(ref, name_) {
    setCityQuery(name_);
    setCityRef(ref);
    setShowCityResults(false);
    setBranch('');
    setWarehouses([]);
    setWarehousesLoading(true);
    const list = await npLoadWarehouses(ref);
    setWarehouses(list);
    setWarehousesLoading(false);
  }

  if (cart.length === 0) return null;

  let total = 0;
  const orderItems = cart.map((c) => {
    const p = getProduct(c.productId);
    const sum = p.price * c.qty;
    total += sum;
    return {
      productId: p.id,
      name: productName(p),
      color: colorName(p.colors[c.colorIndex]),
      size: p.sizes && p.sizes.length ? p.sizes[c.sizeIndex] : null,
      qty: c.qty,
      price: p.price,
      sum,
    };
  });

  async function submitOrder(e) {
    e.preventDefault();
    setSubmitting(true);

    const orderData = {
      name: name.trim(),
      surname: surname.trim(),
      phone: phone.trim(),
      region: novaPoshtaConfigured ? '' : region.trim(),
      city: novaPoshtaConfigured ? cityQuery.trim() : city.trim(),
      branch: novaPoshtaConfigured ? branch : branch.trim(),
      payment,
    };

    const orderNumber = nextOrderNumber();
    await saveOrderToSupabase(orderNumber, orderData, orderItems, total);

    clearCart();
    setSubmitting(false);

    openModal(
      <>
        <h3>{t('thankYou')}</h3>
        <p style={{ fontSize: 15 }}>{t('orderNumberLabel')}: <strong style={{ fontSize: 18 }}>№ {orderNumber}</strong></p>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{t('weWillContact')}</p>
        <button className="btn btn-primary" style={{ width: '100%', marginTop: 10 }} onClick={() => { closeModal(); router.push('/'); }}>
          {t('ok')}
        </button>
      </>
    );
  }

  return (
    <section>
      <div className="section-title">{t('checkoutTitle')}</div>
      <div className="section-sub">{t('checkoutSub')}</div>
      <form className="checkout-form" onSubmit={submitOrder}>
        <input required type="text" placeholder={t('name')} value={name} onChange={(e) => setName(e.target.value)} />
        <input required type="text" placeholder={t('surname')} value={surname} onChange={(e) => setSurname(e.target.value)} />
        <input required type="tel" placeholder={t('phone')} value={phone} onChange={(e) => setPhone(e.target.value)} />

        {novaPoshtaConfigured ? (
          <>
            <div className="np-field" ref={npFieldRef}>
              <input
                type="text"
                placeholder={t('city')}
                autoComplete="off"
                value={cityQuery}
                onChange={(e) => onCityInput(e.target.value)}
              />
              {showCityResults && (
                <div className="np-results">
                  {cityResults.map((r) => (
                    <div className="np-result-item" key={r.ref} onClick={() => selectCity(r.ref, r.name)}>{r.name}</div>
                  ))}
                </div>
              )}
            </div>
            <div className="np-field">
              <select
                disabled={!cityRef || warehousesLoading}
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                required
              >
                <option value="">
                  {!cityRef ? 'Спочатку оберіть місто' : warehousesLoading ? 'Завантаження відділень...' : (warehouses.length === 0 ? 'Відділення не знайдено' : 'Оберіть відділення')}
                </option>
                {warehouses.map((w) => (
                  <option value={w.Description} key={w.Description}>{w.Description}</option>
                ))}
              </select>
            </div>
          </>
        ) : (
          <>
            <input required type="text" placeholder={t('region')} value={region} onChange={(e) => setRegion(e.target.value)} />
            <input required type="text" placeholder={t('city')} value={city} onChange={(e) => setCity(e.target.value)} />
            <input required type="text" placeholder={t('branch')} value={branch} onChange={(e) => setBranch(e.target.value)} />
          </>
        )}

        <div className="field-label" style={{ marginTop: 6 }}>{t('paymentMethod')}</div>
        <label className="pay-option">
          <input type="radio" name="pay" value="cod" checked={payment === 'cod'} onChange={() => setPayment('cod')} /> {t('cod')}
        </label>
        <label className="pay-option">
          <input type="radio" name="pay" value="transfer" checked={payment === 'transfer'} onChange={() => setPayment('transfer')} /> {t('transfer')}
        </label>

        <button type="submit" className="btn btn-primary" style={{ marginTop: 10 }} disabled={submitting}>
          {submitting ? '...' : t('confirmOrder')}
        </button>
      </form>
    </section>
  );
}
