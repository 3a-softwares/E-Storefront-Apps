import React, { useState } from 'react';
import { Button, Modal } from '@3asoftwares/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog,
  faShoppingBag,
  faShoppingCart,
  faHeadset,
  faEnvelope,
  faPhone,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../i18n/I18nContext';
import { getCurrentUser } from '@3asoftwares/utils/client';

interface WelcomePageProps {
  onSignupClick?: () => void;
  onLoginClick?: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onSignupClick, onLoginClick }) => {
  const user = getCurrentUser();
  const [showSupportModal, setShowSupportModal] = useState(false);
  const { t } = useTranslation();

  const scrollToPlatform = () => {
    document.getElementById('platform-features')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openApp = (url: string) => {
    window.location.href = `${url}?userId=${user ? user.id : ''}`;
  };

  const handleProtectedAppClick = (url: string) => {
    if (user) {
      openApp(url);
    } else if (onLoginClick) {
      onLoginClick();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black-50 via-white to-white-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <section className="container mx-auto px-4 pt-20 sm:pt-32 lg:pt-40 pb-0 sm:pb-16 lg:pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              {t('welcome.title')} <span className="text-blue-600 dark:text-blue-400">{t('welcome.brandName')}</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 mb-4 sm:mb-8">
              {t('welcome.subtitle')}
            </p>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-2">
              {t('welcome.description')}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center mb-8 sm:mb-12 lg:mb-16 w-full sm:w-40 mx-auto">
            <Button
              size="lg"
              variant="primary"
              className="shadow-lg hover:shadow-xl w-full sm:w-auto"
              onClick={scrollToPlatform}
            >
              {t('welcome.getStarted')}
            </Button>
          </div>
        </div>
      </section>

      <section id="platform-features" className="container mx-auto px-4 py-4 sm:py-12 lg:py-16">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 dark:text-white mb-8 sm:mb-10 lg:mb-12">
          {t('features.title')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-900 dark:hover:border-white transition-all flex flex-col">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4 sm:mb-5 lg:mb-6">
              <FontAwesomeIcon icon={faCog} className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-gray-800 dark:text-gray-200" />
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 lg:mb-4">{t('features.adminPortal.title')}</h3>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">
              {t('features.adminPortal.description')}
            </p>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 flex-grow">
              <li className="flex items-start">
                <span className="text-gray-800 dark:text-gray-200 mr-2">✓</span>
                <span>{t('features.adminPortal.features.userManagement')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-800 dark:text-gray-200 mr-2">✓</span>
                <span>{t('features.adminPortal.features.analytics')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-800 dark:text-gray-200 mr-2">✓</span>
                <span>{t('features.adminPortal.features.orderTracking')}</span>
              </li>
            </ul>
            <div className="mt-auto">
              <Button
                variant="primary"
                className="w-full !bg-gray-900 !border-gray-900 hover:!bg-black dark:!bg-gray-100 dark:!text-gray-900 dark:!border-gray-100 dark:hover:!bg-white text-sm sm:text-base"
                onClick={() => handleProtectedAppClick(process.env.ADMIN_APP_URL || 'http://localhost:3001')}
              >
                {t('features.adminPortal.button')}
              </Button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-900 dark:hover:border-white transition-all flex flex-col">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4 sm:mb-5 lg:mb-6">
              <FontAwesomeIcon
                icon={faShoppingBag}
                className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-gray-800 dark:text-gray-200"
              />
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 lg:mb-4">{t('features.sellerPortal.title')}</h3>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">
              {t('features.sellerPortal.description')}
            </p>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 flex-grow">
              <li className="flex items-start">
                <span className="text-gray-800 dark:text-gray-200 mr-2">✓</span>
                <span>{t('features.sellerPortal.features.productCatalog')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-800 dark:text-gray-200 mr-2">✓</span>
                <span>{t('features.sellerPortal.features.inventoryTracking')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-800 dark:text-gray-200 mr-2">✓</span>
                <span>{t('features.sellerPortal.features.salesAnalytics')}</span>
              </li>
            </ul>
            <div className="mt-auto">
              <Button
                variant="primary"
                className="w-full !bg-gray-900 !border-gray-900 hover:!bg-black dark:!bg-gray-100 dark:!text-gray-900 dark:!border-gray-100 dark:hover:!bg-white text-sm sm:text-base"
                onClick={() => handleProtectedAppClick(process.env.SELLER_APP_URL || 'http://localhost:3002')}
              >
                {t('features.sellerPortal.button')}
              </Button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-900 dark:hover:border-white transition-all flex flex-col">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4 sm:mb-5 lg:mb-6">
              <FontAwesomeIcon
                icon={faShoppingCart}
                className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-gray-800 dark:text-gray-200"
              />
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 lg:mb-4">
              {t('features.storefront.title')}
            </h3>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">
              {t('features.storefront.description')}
            </p>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 flex-grow">
              <li className="flex items-start">
                <span className="text-gray-800 dark:text-gray-200 mr-2">✓</span>
                <span>{t('features.storefront.features.productSearch')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-800 dark:text-gray-200 mr-2">✓</span>
                <span>{t('features.storefront.features.secureCheckout')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-800 dark:text-gray-200 mr-2">✓</span>
                <span>{t('features.storefront.features.orderTracking')}</span>
              </li>
            </ul>
            <div className="mt-auto">
              <Button
                variant="primary"
                className="w-full !bg-gray-900 !border-gray-900 hover:!bg-black dark:!bg-gray-100 dark:!text-gray-900 dark:!border-gray-100 dark:hover:!bg-white text-sm sm:text-base"
                onClick={() => openApp(process.env.STOREFRONT_APP_URL || 'http://localhost:3004')}
              >
                {t('features.storefront.button')}
              </Button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-900 dark:hover:border-white transition-all flex flex-col">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4 sm:mb-5 lg:mb-6">
              <FontAwesomeIcon
                icon={faHeadset}
                className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-gray-800 dark:text-gray-200"
              />
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 lg:mb-4">
              {t('features.supportPortal.title')}
            </h3>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">
              {t('features.supportPortal.description')}
            </p>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 flex-grow">
              <li className="flex items-start">
                <span className="text-gray-800 dark:text-gray-200 mr-2">✓</span>
                <span>{t('features.supportPortal.features.ticketManagement')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-800 dark:text-gray-200 mr-2">✓</span>
                <span>{t('features.supportPortal.features.liveChat')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-800 dark:text-gray-200 mr-2">✓</span>
                <span>{t('features.supportPortal.features.knowledgeBase')}</span>
              </li>
            </ul>
            <div className="mt-auto">
              <Button
                variant="primary"
                className="w-full !bg-gray-900 !border-gray-900 hover:!bg-black dark:!bg-gray-100 dark:!text-gray-900 dark:!border-gray-100 dark:hover:!bg-white text-sm sm:text-base"
                onClick={() => handleProtectedAppClick(process.env.SUPPORT_APP_URL || 'http://localhost:3004')}
              >
                {t('features.supportPortal.button')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-4 sm:py-16 lg:py-20">
        <div className="flex flex-col items-center max-w-4xl mx-auto bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-6 sm:p-8 lg:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">{t('cta.title')}</h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8">
            {t('cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full sm:w-auto">
            <Button
              size="lg"
              variant="secondary"
              className="shadow-lg hover:shadow-xl bg-white text-gray-900 hover:bg-gray-100 border-0 w-full sm:w-auto"
              onClick={onSignupClick}
            >
              {t('cta.createAccount')}
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="shadow-lg hover:shadow-xl text-white border-2 border-white hover:bg-white hover:text-gray-900 w-full sm:w-auto"
              onClick={() => setShowSupportModal(true)}
            >
              {t('cta.support')}
            </Button>
          </div>
        </div>
      </section>

      <Modal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
        title={t('support.title')}
        size="md"
      >
        <div className="space-y-6 py-2">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {t('support.description')}
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-600">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-900 dark:bg-gray-100 rounded-full flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="w-5 h-5 text-white dark:text-gray-900"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">{t('support.email')}</h4>
                <a
                  href={`mailto:${t('support.emailAddress')}`}
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:underline font-semibold"
                >
                  {t('support.emailAddress')}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-600">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-900 dark:bg-gray-100 rounded-full flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faPhone}
                  className="w-5 h-5 text-white dark:text-gray-900"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">{t('support.phone')}</h4>
                <a
                  href={`tel:${t('support.phoneNumber')}`}
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:underline font-semibold"
                >
                  {t('support.phoneNumber')}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-600">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-900 dark:bg-gray-100 rounded-full flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faClock}
                  className="w-5 h-5 text-white dark:text-gray-900"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">{t('support.hours')}</h4>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  {t('support.hoursValue')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};