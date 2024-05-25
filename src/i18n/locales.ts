import defaultLocale from '@locales/default.json';
import jaLocale from '@locales/ja.locale.json';

import type { Translations } from '@/i18n/i18n';

type TranslationsList = { [key: string]: Translations; }

export const locales: TranslationsList = {
    "default": defaultLocale,
    "ja": jaLocale,
};