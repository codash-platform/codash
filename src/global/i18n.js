import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import moment from 'moment'
import {initReactI18next} from 'react-i18next'

// language order for the dropdown from the header
export const languageOrder = ['en', 'de', 'fr', 'ro']
const langResources = {}
languageOrder.map(lang => {
  langResources[lang] = {
    translation: require('../../translations/' + lang + '.json'),
  }
})

i18next
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .on('initialized', () => moment.locale(i18next.language.substring(0, 2)))
  .on('languageChanged', language => moment.locale(language.substring(0, 2)))
  .init({
    interpolation: {
      // React already does escaping
      escapeValue: false,
    },
    debug: process.env.NODE_ENV !== 'production',
    // to prevent languages like "en-US" and keep it "en"
    load: 'languageOnly',
    // languages used in the app in priority order in case of missing translations
    fallbackLng: languageOrder,
    // set ns and key separators to be able to use dots in the keys
    nsSeparator: ':::',
    keySeparator: '::',
    // do not use null or empty values from translations
    // when a value is missing/empty, use the fallback language list
    returnNull: false,
    returnEmptyString: false,
    // Using simple hardcoded resources for simple example
    resources: langResources,
    // react i18next special options (optional)
    react: {
      wait: false,
      bindI18n: 'languageChanged loaded',
      bindStore: 'added removed',
      nsMode: 'default',
    },
  })

export const i18n = i18next
