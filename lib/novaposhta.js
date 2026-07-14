/* =========================================================================
   ПОДКЛЮЧЕНИЕ НОВОЙ ПОЧТЫ (автоматический выбор города и отделения)
   Вставьте свой API-ключ в .env.local (получить бесплатно на devcenter.novaposhta.ua).
   Пока ключ не вставлен — на странице оформления заказа будут обычные текстовые поля.
   ========================================================================= */
const NOVA_POSHTA_API_KEY = process.env.NEXT_PUBLIC_NOVA_POSHTA_API_KEY || '';
export const novaPoshtaConfigured = Boolean(NOVA_POSHTA_API_KEY && !NOVA_POSHTA_API_KEY.includes('ВАШ-API-КЛЮЧ'));

async function novaPoshtaRequest(modelName, calledMethod, methodProperties) {
  const res = await fetch('https://api.novaposhta.ua/v2.0/json/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey: NOVA_POSHTA_API_KEY, modelName, calledMethod, methodProperties }),
  });
  return res.json();
}

// поиск городов по части названия (используется в поле "Місто" на странице заказа)
export async function npSearchCities(query) {
  if (!novaPoshtaConfigured || query.trim().length < 2) return [];
  try {
    const data = await novaPoshtaRequest('Address', 'searchSettlements', { CityName: query, Limit: 8 });
    const items = (data.data && data.data[0] && data.data[0].Addresses) || [];
    return items.map((a) => ({ ref: a.DeliveryCity, name: a.Present }));
  } catch (err) {
    console.error('Ошибка поиска города (Нова пошта):', err);
    return [];
  }
}

// получить список отделений для выбранного города
export async function npLoadWarehouses(cityRef) {
  if (!novaPoshtaConfigured) return [];
  try {
    const data = await novaPoshtaRequest('AddressGeneral', 'getWarehouses', { CityRef: cityRef, Limit: 300 });
    return data.data || [];
  } catch (err) {
    console.error('Ошибка загрузки отделений (Нова пошта):', err);
    return [];
  }
}
