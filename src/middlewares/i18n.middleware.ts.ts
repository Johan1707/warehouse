import { defineI18nMiddleware } from '@intlify/hono'
import type { Context, MiddlewareHandler } from 'hono'
import { accepts } from 'hono/accepts'

import { LOCALES, en, es } from '@/i18n'

const [ DEFAULT_LOCALE ]: string[] = LOCALES

export const i18nMiddleware: MiddlewareHandler = defineI18nMiddleware({
    locale: (c: Context): string => (
        accepts(c, {
            header: 'Accept-Language',
            supports: LOCALES,
            default: DEFAULT_LOCALE
        })
    ),
    messages: {
        en,
        es
    }
})