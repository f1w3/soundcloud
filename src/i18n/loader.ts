import scheme from "@locales/scheme.json"
import type { I18n, Translations } from '@/i18n/i18n';
import { createI18n, createI18nKeys } from '@/i18n/i18n';

import { locales } from "./locales";

import { app } from "electron";

import { logger } from "../lib/logger";

export const key = createI18nKeys(scheme)

function loadI18n(locale: string): I18n {
    const translations: Translations | undefined = locales[locale];
    if (!translations) {
        const i18n = createI18n(locales.default, locale);
        logger.debug(i18n.translate(key.debug.init.i18n, { locale: locale }))
        return i18n
    }
    const i18n = createI18n(translations, locale);
    logger.debug(i18n.translate(key.debug.init.i18n, { locale: locale }))
    return i18n
}

export const i18n = loadI18n(app.getLocale())
export const translate = i18n.translate