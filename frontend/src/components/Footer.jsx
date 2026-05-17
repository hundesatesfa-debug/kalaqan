import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-dark border-t border-gray-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="font-bold text-2xl tracking-wider text-white">KALAQAN<span className="text-primary">.</span></span>
            <p className="mt-4 text-gray-400">
              {t('footerDesc')}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">{t('aboutUs')}</a></li>
              <li><a href="#rules" className="text-gray-400 hover:text-primary transition-colors">{t('rules')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">{t('contact')}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-4">{t('followUs')}</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors font-bold">FB</a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors font-bold">TW</a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors font-bold">IG</a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors font-bold">YT</a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Kalaqan Entertainment. {t('allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
}
