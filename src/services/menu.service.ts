import type { Prisma, PrismaClient, Menu } from '@prisma/client'

import { MenuResponse } from '@/types'
import { StatusCode } from 'hono/utils/http-status'

const menuSelect: Prisma.MenuSelect = {
    id: true,
    title: true,
    route: true,
    icon: true,
    sequence: true,
    style: true,
    menu_id: true,
    active: true
}

const validateParentMenu = async (db: PrismaClient, menuId: number): Promise<boolean> => {
    const existsId: number = await db.menu.count({
        where: {
            id: menuId,
            menu_id: null
        }
    })
    return !!existsId
}

export const createMenuService = async (db: PrismaClient, values: Menu): Promise<MenuResponse> => {
    try {        
        const exists: number = await db.menu.count({
            where: {
                AND: [
                    { title: values.title },
                    { route: values.route },
                    { menu_id: values.menu_id }
                ]
            }
        })
        if(exists) return [{ message: 'error.duplicateRecord', status: 400 as StatusCode }, null]

        if(values.menu_id) {                      
            const existsId = await validateParentMenu(db, values.menu_id)
            if(!existsId) return [{ message: 'error.parentMenuValidate', status: 400 as StatusCode }, null]
        }

        const menu: Menu = await db.menu.create({
            data: values,
            select: menuSelect
        })

        return [null, menu]
    } catch {
        return [{ message: 'error.createRecord', status: 400 as StatusCode }, null]
    }
}