import { t } from '../../lib/data';

export const metadata = {
  title: 'Про нас — nui.shooo',
};

export default function AboutPage() {
  return (
    <section className="about-page">
      <h1>{t('aboutTitle')}</h1>
      <p>{t('aboutP1')}</p>
      <h2>{t('returnTitle')}</h2>
      <p>{t('aboutP2')}</p>
      <p>{t('aboutP3')}</p>
      <h2>{t('deliveryTitle')}</h2>
      <p>{t('aboutP4')}</p>
    </section>
  );
}
