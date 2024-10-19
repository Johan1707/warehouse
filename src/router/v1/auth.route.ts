import type { Hono } from 'hono'

import type { Env } from '@/types'
import { validateRequest } from '@/middlewares'
import { AuthSchema } from '@/schemas'
import { authHandler } from '@/handlers'
import { factoryDB } from '@/app'


export const appAuth: Hono<Env> = factoryDB.createApp().basePath('/auth')

appAuth
    .post('/login', validateRequest('json', AuthSchema), ...authHandler)