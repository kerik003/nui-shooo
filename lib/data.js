// =========================================================================
// СТАТИЧНЫЕ ДАННЫЕ МАГАЗИНА: категории, цвета по умолчанию, демо-товары
// =========================================================================

export const STR = {
  catalog: 'Каталог', categoriesTitle: 'Категорії', allProductsLink: 'Усі товари →', aboutUs: 'Про нас', contacts: 'Контакти',
  phonesTitle: 'Телефони', searchPlaceholder: 'Пошук товару...',
  allProducts: 'Усі товари', fastPath: 'Швидкий шлях від перегляду до покупки',
  searchResults: 'Результати пошуку', notFound: 'Нічого не знайдено — спробуйте інший запит',
  inStock: 'В наявності', outStock: 'Немає в наявності',
  addToList: 'Додати до списку', newListPlaceholder: 'Назва нового списку...', create: 'Створити', done: 'Готово',
  favoritesTitle: 'Обране', cartTitle: 'Кошик', favSub: 'Створюйте власні добірки, наприклад «На зиму» або «Футболки»',
  emptyList: 'У цьому списку поки що порожньо',
  back: '← Назад до каталогу', color: 'Колір', quantity: 'Кількість', buy: 'Купити', outOfStockBtn: 'Немає в наявності',
  emptyCart: 'Ваш кошик порожній', goShopping: 'Перейти до покупок',
  total: 'Разом', checkoutBtn: 'Оформити замовлення', remove: 'Видалити',
  checkoutTitle: 'Оформлення замовлення', checkoutSub: 'Заповніть дані для доставки Новою поштою',
  name: 'Ім\u0027я', surname: 'Прізвище', phone: 'Номер телефону', region: 'Область', city: 'Місто', branch: 'Відділення Нової пошти (номер)',
  paymentMethod: 'Спосіб оплати', cod: 'Оплата при отриманні', transfer: 'Переказ за реквізитами', confirmOrder: 'Підтвердити замовлення',
  thankYou: 'Дякуємо за замовлення!', orderNumberLabel: 'Номер замовлення', weWillContact: 'Ми зв\u0027яжемося з вами для підтвердження.', ok: 'Добре',
  aboutTitle: 'Про nui.shooo',
  aboutP1: 'nui.shooo — магазин аксесуарів: шапки, кепки, сумки, рукавички, ремені, гаманці, рюкзаки, брелоки, шкарпетки та шопери. Ми створюємо речі, які легко обрати і приємно носити щодня.',
  returnTitle: 'Повернення та обмін',
  aboutP2: 'Якщо розмір або модель не підійшли — річ можна обміняти або повернути протягом 14 днів з моменту отримання замовлення. Товар має бути в оригінальному вигляді, без слідів використання, зі збереженими бірками та упаковкою.',
  aboutP3: 'Для оформлення обміну чи повернення зв\u0027яжіться з нами будь-яким зручним способом — телефоном, у Telegram або Instagram (посилання у розділі «Контакти»). Ми допоможемо підібрати потрібний розмір або повернемо вартість товару зручним для вас способом.',
  deliveryTitle: 'Доставка',
  aboutP4: 'Надсилаємо замовлення Новою поштою по всій Україні. Доступна оплата при отриманні або переказ за реквізитами.',
  footerShop: 'Магазин', footerReviews: 'Відгуки', footerSocials: 'Соц. мережі', footerReviewsInsta: 'Відгуки в Instagram', footerTelegramChannel: 'Telegram-канал',
  footerBrandTagline: 'Аксесуари, які легко обрати і приємно носити.', footerRights: '© 2026 nui.shooo. Усі права захищені.',
  telegramLine: 'Telegram: @nui_shooo',
};

export function t(key) {
  return STR[key];
}

// список категорий: id, название (ru/ua), эмодзи-иконка для круглой кнопки
export const CATEGORIES = [
  { id: 'hats', name: 'Шапки', name_ua: 'Шапки', icon: '🧢' },
  { id: 'caps', name: 'Кепки', name_ua: 'Кепки', icon: '🧢' },
  { id: 'bags', name: 'Сумки', name_ua: 'Сумки', icon: '👜' },
  { id: 'gloves', name: 'Перчатки', name_ua: 'Рукавички', icon: '🧤' },
  { id: 'belts', name: 'Ремни', name_ua: 'Ремені', icon: '➰' },
  { id: 'wallets', name: 'Кошельки', name_ua: 'Гаманці', icon: '👛' },
  { id: 'backpacks', name: 'Рюкзаки', name_ua: 'Рюкзаки', icon: '🎒' },
  { id: 'keychains', name: 'Брелки', name_ua: 'Брелоки', icon: '🔑' },
  { id: 'socks', name: 'Носки', name_ua: 'Шкарпетки', icon: '🧦' },
  { id: 'shoppers', name: 'Шоперы', name_ua: 'Шопери', icon: '🛍️' },
];

export function catName(catId) {
  const c = CATEGORIES.find((x) => x.id === catId);
  return c ? c.name_ua : t('allProducts');
}

export function iconForCategory(catId) {
  const c = CATEGORIES.find((x) => x.id === catId);
  return c ? c.icon : '🛍️';
}

// цвета для выбора на странице товара по умолчанию (используются, если в Supabase для товара
// не заполнена колонка colors)
export const COLORS = [
  { name_ua: 'Чорний', hex: '#1c1c1e' },
  { name_ua: 'Графіт', hex: '#5a5a5e' },
  { name_ua: 'Бежевий', hex: '#d8c9ab' },
  { name_ua: 'Білий', hex: '#ffffff' },
];
export function colorName(c) {
  return c.name_ua;
}

// словарь: название цвета (как его впишут в Supabase) → код цвета для кружка.
// это позволяет владельцу магазина просто писать "Чорний, Білий, Синій" текстом,
// не разбираясь в HEX-кодах
export const COLOR_HEX_MAP = {
  'чорний': '#1c1c1e', 'чёрный': '#1c1c1e',
  'білий': '#ffffff', 'белый': '#ffffff',
  'сірий': '#9a9a9e', 'серый': '#9a9a9e',
  'графіт': '#5a5a5e', 'графит': '#5a5a5e',
  'бежевий': '#d8c9ab', 'бежевый': '#d8c9ab',
  'коричневий': '#6b4a34', 'коричневый': '#6b4a34',
  'хакі': '#7c7a5e', 'хаки': '#7c7a5e',
  'синій': '#2b4c8c', 'синий': '#2b4c8c',
  'блакитний': '#5fa8d3', 'голубой': '#5fa8d3',
  'зелений': '#3c6e3c', 'зелёный': '#3c6e3c', 'зеленый': '#3c6e3c',
  'червоний': '#b23b3b', 'красный': '#b23b3b',
  'бордовий': '#6e1f2a', 'бордовый': '#6e1f2a',
  'жовтий': '#e0c23a', 'жёлтый': '#e0c23a', 'желтый': '#e0c23a',
  'помаранчевий': '#d97b29', 'оранжевый': '#d97b29',
  'рожевий': '#e6a4c4', 'розовый': '#e6a4c4',
  'фіолетовий': '#6b4c8c', 'фиолетовый': '#6b4c8c',
};

// подбирает цвет кружка по названию; если названия нет в словаре — нейтральный серый запасной вариант
export function hexForColorName(name) {
  return COLOR_HEX_MAP[name.trim().toLowerCase()] || '#b5b5b5';
}

// определяет, светлый ли цвет — чтобы галочка выбора была тёмной и не терялась на светлом фоне
export function isLightColor(hex) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16), g = parseInt(h.substring(2, 4), 16), b = parseInt(h.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 180;
}

// Название товара: если задано своё название (name_ua) — используем его,
// иначе строим авто-название из категории и номера модели (для демо-товаров).
export function productName(p) {
  if (p.name_ua) return p.name_ua;
  return catName(p.category) + ' — модель ' + (p.modelIndex || 1);
}

// картинка товара (первое фото из списка)
export function productThumb(p) {
  return p.images && p.images.length ? p.images[0] : null;
}

// демонстрационные товары — показываются, пока не подключена Supabase,
// либо если запрос к базе не удался (например, нет интернета)
export function buildDemoProducts() {
  const list = [];
  let id = 1;
  CATEGORIES.forEach((cat) => {
    for (let i = 1; i <= 4; i++) {
      list.push({
        id: 'demo' + id,
        category: cat.id,
        modelIndex: i,
        icon: cat.icon, // эмодзи-заглушка вместо фото
        images: [],
        price: 300 + (id * 17) % 700,
        inStock: id % 4 !== 0,
        colors: COLORS,
        sizes: [],
        unavailableColors: [],
        unavailableSizes: [],
        description: '',
      });
      id++;
    }
  });
  return list;
}

// находит индекс первого доступного варианта (не входящего в список недоступных);
// если все варианты недоступны — просто возвращает первый (0), чтобы страница не сломалась
export function firstAvailableIndex(items, unavailableList, nameFn) {
  if (!unavailableList || unavailableList.length === 0) return 0;
  const idx = items.findIndex((item) => !unavailableList.includes(nameFn(item).toLowerCase()));
  return idx === -1 ? 0 : idx;
}

// =========================================================================
// ПОИСК С УЧЁТОМ ОПЕЧАТОК (расстояние Левенштейна)
// =========================================================================
export function levenshteinDistance(a, b) {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

// проверяет, "похож ли" текст на поисковый запрос — с допуском на опечатки
export function fuzzyIncludes(text, query) {
  text = text.toLowerCase();
  query = query.toLowerCase().trim();
  if (!query) return true;
  if (text.includes(query)) return true;

  const textWords = text.split(/\s+/).filter(Boolean);
  const queryWords = query.split(/\s+/).filter(Boolean);

  return queryWords.every((qw) => textWords.some((tw) => {
    if (tw.includes(qw) || qw.includes(tw)) return true;
    const maxDist = qw.length <= 4 ? 1 : qw.length <= 8 ? 2 : 3;
    return levenshteinDistance(qw, tw) <= maxDist;
  }));
}

// генерация уникального номера заказа из 5-6 цифр
export function generateOrderNumber(usedSet) {
  let num;
  do {
    const sixDigits = Math.random() < 0.5;
    num = sixDigits
      ? String(Math.floor(100000 + Math.random() * 900000))
      : String(Math.floor(10000 + Math.random() * 90000));
  } while (usedSet.has(num));
  usedSet.add(num);
  return num;
}
