import type { Hono } from 'hono'
import { factoryDB } from '@/app'

import type { Env } from '@/types'
import { validateRequest } from '@/middlewares'
import { CreateMenuSchema } from '@/schemas'
import { createMenuHandler, getAllMenusHandler } from '@/handlers'

export const appMenu: Hono<Env> = factoryDB.createApp().basePath('/menus')

appMenu
    .post('/', validateRequest('json', CreateMenuSchema), ...createMenuHandler)
    .get('/', ...getAllMenusHandler)