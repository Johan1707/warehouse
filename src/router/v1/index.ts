import { Hono } from 'hono'
import { secureHeaders } from 'hono/secure-headers'

import { i18nMiddleware, jwtMiddleware } from '@/middlewares'
import { appAuth } from './auth.route'
import { appUser } from './user.route'
import { appMenu } from './menu.route'


export const appV1 = new Hono().basePath('/api/v1.0')

appV1.use(
    secureHeaders(),
    i18nMiddleware
)

appV1.route('/', appAuth)

//appV1.use('/*', jwtMiddleware)

appV1.route('/', appUser)
appV1.route('/', appMenu)