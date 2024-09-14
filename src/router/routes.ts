import { Hono } from 'hono'
import { secureHeaders } from 'hono/secure-headers'

import { i18nMiddleware } from '@/middlewares'

export const app = new Hono().basePath('/api/v1.0')

app.use(
    secureHeaders(),
    i18nMiddleware
)

app.post('/menus', (c) => {
    return c.json({ message: 'Hola mundo'})
})