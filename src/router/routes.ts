import { Hono } from 'hono'
import { secureHeaders } from 'hono/secure-headers'

import { i18nMiddleware } from '@/middlewares'
import { appAuth, appMenu } from './v1'

export const app = new Hono().basePath('/api/v1.0')

app.use(
    secureHeaders(),
    i18nMiddleware
)

app.route('/', appAuth)
app.route('/', appMenu)