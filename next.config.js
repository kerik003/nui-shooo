/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Разрешаем показывать фото товаров из Supabase Storage и любых внешних адресов.
    // Если вы точно знаете домен Supabase Storage — можно сузить список для безопасности.
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
};

module.exports = nextConfig;
