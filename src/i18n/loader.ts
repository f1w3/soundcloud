import scheme from "@locales/scheme.json"

import defaultLocale from '@locales/default.json';
import jaLocale from '@locales/ja.locale.json';

import type { I18n, Translations } from '@/i18n/i18n';
import { createI18n, createI18nKeys } from '@/i18n/i18n';

type TranslationsList = { [key: string]: Translations; }

const locales: TranslationsList = {
    "default": defaultLocale,
    "ja": jaLocale,
};

export const key = createI18nKeys(scheme)

export function loadI18n(locale: string): I18n {
    const translations: Translations | undefined = locales[locale];
    if (!translations) {
        return createI18n(locales.default, locale);
    }
    return createI18n(translations, locale);
}