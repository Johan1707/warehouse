import type { Context } from 'hono'
import { useTranslation } from '@intlify/hono'
import type { StatusCode } from 'hono/utils/http-status'
import type { Menu } from '@prisma/client'

import { factoryDB } from '@/app'
import { createMenuService, getAllMenusService } from '@/services'
import type { Env, MenuResponse } from '@/types'

export const createMenuHandler = factoryDB.createHandlers(async (c: Context<Env>): Promise<Response> => {
    const t = useTranslation(c)
    const register: Menu = c.req.valid(('json') as never)
    const [error, menu]: MenuResponse = await createMenuService(c.var.db, register)

    if(error) {
        return c.json({ message: t(error.message) }, error.status as StatusCode)
    }

    return c.json(menu, 201 as StatusCode)
})

export const getAllMenusHandler = factoryDB.createHandlers(async (c: Context<Env>): Promise<Response> => {
    const t = useTranslation(c)
    const [error, menus]: MenuResponse = await getAllMenusService(c.var.db)

    if(error) {
        return c.json({ message: t(error.message) }, error.status as StatusCode)
    }

    return c.json(menus, 200 as StatusCode)
})