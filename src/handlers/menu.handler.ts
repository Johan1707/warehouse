import type { Context } from 'hono'
import { useTranslation } from '@intlify/hono'
import type { StatusCode } from 'hono/utils/http-status'

import { factoryDB } from '@/app'
import {
    createMenuService,
    getAllMenusService,
    getMenuByIdService,
    updateMenuService,
    deleteMenuService
} from '@/services'
import type {
    Env,
    IdParam,
    MenuResponse,
    MenusResponse
} from '@/types'
import type { CreateMenuOutput, UpdateMenuOutput } from '@/schemas'

export const createMenuHandler = factoryDB.createHandlers(async (c: Context<Env>): Promise<Response> => {
    const t = useTranslation(c)
    const register: CreateMenuOutput = c.req.valid(('json') as never)
    const [error, menu]: MenuResponse = await createMenuService(c.var.db, register)

    if(error) {
        return c.json({ message: t(error.message) }, error.status as StatusCode)
    }

    return c.json(menu, 201 as StatusCode)
})

export const getAllMenusHandler = factoryDB.createHandlers(async (c: Context<Env>): Promise<Response> => {
    const t = useTranslation(c)
    const [error, menus]: MenusResponse = await getAllMenusService(c.var.db)

    if(error) {
        return c.json({ message: t(error.message) }, error.status as StatusCode)
    }

    return c.json(menus, 200 as StatusCode)
})

export const getMenuByIdHandler = factoryDB.createHandlers(async (c: Context<Env>): Promise<Response> => {
    const t = useTranslation(c)
    const id: IdParam = c.req.valid(('param') as never)
    const [error, menu]: MenuResponse = await getMenuByIdService(c.var.db, id)

    if(error) {
        return c.json({ message: t(error.message) }, error.status as StatusCode)
    }

    return c.json(menu, 200 as StatusCode)
})

export const updateMenuHandler = factoryDB.createHandlers(async (c: Context<Env>): Promise<Response> => {
    const t = useTranslation(c)
    const id: IdParam = c.req.valid(('param') as never)
    const register: UpdateMenuOutput = c.req.valid(('json') as never)
    const [error, menu]: MenuResponse = await updateMenuService(c.var.db, id, register)

    if(error) {
        return c.json({ message: t(error.message) }, error.status as StatusCode)
    }

    return c.json(menu, 200 as StatusCode)
})

export const deleteMenuHandler = factoryDB.createHandlers(async (c: Context<Env>): Promise<Response> => {
    const t = useTranslation(c)
    const id: IdParam = c.req.valid(('param') as never)
    const [error, removed]: MenuResponse = await deleteMenuService(c.var.db, id)
    
    if(error) {
        return c.json({ message: t(error.message) }, error.status as StatusCode)
    }

    return c.json(removed, 200 as StatusCode)
})