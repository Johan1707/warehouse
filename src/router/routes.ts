import { useTranslation } from '@intlify/hono'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import type { StatusCode } from 'hono/utils/http-status'

import { appV1 } from './v1'


export const app = new Hono()

app.route('/', appV1)

app.notFound((c) => {
    const t = useTranslation(c)
    return c.json({ message: t('error.notFound' as string) } as object, 404 as StatusCode)
})

app.onError((error, c) => {
    const t = useTranslation(c)
    if(error instanceof HTTPException) {
        if (error.message.includes('Malformed JSON')) {
            return c.json({ message: t('error.onBadJson' as string) } as object, 422 as StatusCode)
        }
        return c.json({ message: t(error.message as string) } as object, 422 as StatusCode)
    }
    return c.json({ message: t('error.unkwon' as string) } as object, 500 as StatusCode)
})