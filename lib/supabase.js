import { createClient } from '@supabase/supabase-js';
import { CATEGORIES, COLORS, hexForColorName, buildDemoProducts } from './data';

/* =========================================================================
   ПОДКЛЮЧЕНИЕ SUPABASE
   Вставьте свои данные в .env.local (см. .env.local.example):
   - NEXT_PUBLIC_SUPABASE_URL: адрес вида https://xxxxx.supabase.co
   - NEXT_PUBLIC_SUPABASE_ANON_KEY: публичный anon-ключ (его безопасно использовать в браузере)
   Пока не заполните .env.local — сайт покажет демонстрационные товары.
   ========================================================================= */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.includes('ВАШ-ПРОЕКТ'));

export const supabaseClient = supabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// Загрузка товаров из таблицы "products" в Supabase.
// Ожидаемые колонки таблицы: id, category, name_ua, description, price, in_stock,
// image_urls (ссылки через запятую), colors (названия цветов через запятую, необязательно),
// sizes (размеры через запятую, необязательно), unavailable_colors и unavailable_sizes
// (те цвета/размеры из списка выше, которых сейчас нет в наличии — через запятую, необязательно)
export async function loadProducts() {
  if (!supabaseConfigured) {
    console.warn('Supabase не настроен — показаны демонстрационные товары. Заполните .env.local.');
    return buildDemoProducts();
  }
  try {
    const { data, error } = await supabaseClient
      .from('products')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;

    const products = (data || []).map((row) => {
      // собираем список фото товара: сначала пробуем новую колонку image_urls (через запятую),
      // если её нет — используем старую одиночную image_url для обратной совместимости
      let images = [];
      if (row.image_urls) {
        images = row.image_urls.split(',').map((s) => s.trim()).filter(Boolean);
      } else if (row.image_url) {
        images = [row.image_url];
      }

      // цвета: просто текст через запятую, например "Чорний, Білий, Синій"
      let colors = COLORS;
      if (row.colors) {
        const names = row.colors.split(',').map((s) => s.trim()).filter(Boolean);
        if (names.length) colors = names.map((n) => ({ name_ua: n, hex: hexForColorName(n) }));
      }

      // размеры: тоже просто текст через запятую, например "S, M, L, XL"
      let sizes = [];
      if (row.sizes) {
        sizes = row.sizes.split(',').map((s) => s.trim()).filter(Boolean);
      }

      const unavailableColors = row.unavailable_colors
        ? row.unavailable_colors.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
        : [];
      const unavailableSizes = row.unavailable_sizes
        ? row.unavailable_sizes.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
        : [];

      return {
        id: row.id,
        category: row.category,
        name_ua: row.name_ua,
        description: row.description || '',
        icon: (CATEGORIES.find((c) => c.id === row.category) || {}).icon || '🛍️',
        images,
        price: row.price,
        inStock: row.in_stock,
        colors,
        sizes,
        unavailableColors,
        unavailableSizes,
      };
    });

    if (products.length === 0) {
      console.warn('Таблица products пуста — показаны демонстрационные товары.');
      return buildDemoProducts();
    }
    return products;
  } catch (err) {
    console.error('Не удалось загрузить товары из Supabase:', err);
    return buildDemoProducts();
  }
}

// сохраняет заказ в таблицу "orders" в Supabase, чтобы владелец магазина мог его увидеть
export async function saveOrderToSupabase(orderNumber, orderData, orderItems, total) {
  if (!supabaseConfigured) {
    console.warn('Supabase не настроен — заказ не сохранён в базе (только показан покупателю).');
    return;
  }
  try {
    const { error } = await supabaseClient.from('orders').insert([{
      order_number: orderNumber,
      customer_name: orderData.name,
      customer_surname: orderData.surname,
      phone: orderData.phone,
      region: orderData.region,
      city: orderData.city,
      branch: orderData.branch,
      payment_method: orderData.payment,
      items: orderItems,
      total,
    }]);
    if (error) throw error;
  } catch (err) {
    console.error('Не удалось сохранить заказ в Supabase:', err);
  }
}
