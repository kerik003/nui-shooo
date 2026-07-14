# nui.shooo — Next.js версия

Порт исходного одностраничного сайта (HTML/CSS/JS) на Next.js 14 (App Router).

## Структура

```
app/
  layout.js            — общий layout (провайдеры + шапка/подвал)
  globals.css           — все стили сайта (перенесены без изменений)
  page.js                — каталог/сетка товаров (главная страница, ?category=&q=)
  product/[id]/page.js   — страница товара
  cart/page.js           — корзина
  checkout/page.js       — оформление заказа (+ интеграция Новой пошты)
  favorites/page.js      — избранное (списки)
  about/page.js          — страница "Про нас"
components/
  Header.js, CatStrip.js, Footer.js, SiteChrome.js
  ProductCard.js, FavModal.js, ContactsModal.js
context/
  StoreContext.js        — товары, корзина, избранное (+ localStorage)
  ModalContext.js         — общее модальное окно
lib/
  data.js                 — категории, цвета, тексты интерфейса, демо-товары, поиск с опечатками
  supabase.js              — подключение к Supabase и загрузка/сохранение товаров и заказов
  novaposhta.js            — интеграция с API Новой пошты (поиск города/отделений)
public/assets/logo.png     — плейсхолдер логотипа (замените на свой)
```

## Установка

```bash
npm install
cp .env.local.example .env.local
# впишите свои ключи Supabase / Новой почты в .env.local
npm run dev
```

Откройте http://localhost:3000

## Настройка Supabase

В `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://ваш-проект.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш-anon-ключ
```

Ожидаемые таблицы (как и в исходном сайте):
- `products` — id, category, name_ua, description, price, in_stock, image_urls, colors, sizes, unavailable_colors, unavailable_sizes
- `orders` — order_number, customer_name, customer_surname, phone, region, city, branch, payment_method, items, total

Если переменные не заданы — сайт покажет демонстрационные товары (как и в оригинале).

## Настройка Новой пошты

```
NEXT_PUBLIC_NOVA_POSHTA_API_KEY=ваш-api-ключ
```

Без ключа страница оформления заказа покажет обычные текстовые поля (область/місто/відділення) вместо автопоиска.

## Что изменилось при переносе на Next.js

- Один HTML-файл с ручным управлением "экранами" (`showView`) заменён на настоящие страницы и маршруты App Router (`/`, `/product/[id]`, `/cart`, `/checkout`, `/favorites`, `/about`).
- Категория и поисковый запрос теперь передаются через query-параметры (`/?category=hats&q=шапка`), поэтому можно скопировать ссылку на отфильтрованный каталог.
- Глобальное состояние (товары, корзина, избранное) вынесено в React Context (`StoreContext`) вместо глобальных переменных и ручного вызова функций рендера.
- Корзина и списки избранного по-прежнему сохраняются в `localStorage` браузера — данные не пропадают при обновлении страницы.
- Модальные окна (контакты, добавление в избранное, подтверждение заказа) реализованы через `ModalContext` вместо `innerHTML`.
- Логика (расстояние Левенштейна для нечёткого поиска, подбор цвета по названию, генерация номера заказа) перенесена без изменений в `lib/data.js`.

## Логотип

Замените `public/assets/logo.png` на свой файл с тем же именем (или поменяйте путь в `components/Header.js`).
