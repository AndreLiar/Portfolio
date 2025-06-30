import 'server-only'

const dictionaries: { [key: string]: () => Promise<any> } = {
  en: () => import('../../messages/en.json').then((module) => module.default),
  fr: () => import('../../messages/fr.json').then((module) => module.default),
  de: () => import('../../messages/de.json').then((module) => module.default),
}

export const getDictionary = async (locale: string) => {
    if (dictionaries[locale]) {
        return dictionaries[locale]();
    }
    // Fallback to English if the locale is not found
    return dictionaries.en();
}
