import { Hono } from 'hono'
import { factoryDB } from '@/app'

import { Env } from '@/types'

export const appMenu: Hono<Env> = factoryDB.createApp().basePath('/menus')

