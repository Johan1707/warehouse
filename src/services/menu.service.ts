import type { Prisma, PrismaClient, Menu } from '@prisma/client'
import type { StatusCode } from 'hono/utils/http-status'

import type { MenuResponse, MenusResponse } from '@/types'
import type { CreateMenuOutput, IdOutput, UpdateMenuOutput } from '@/schemas'

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

export const createMenuService = async (db: PrismaClient, values: CreateMenuOutput): Promise<MenuResponse> => {
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
            const existsId: boolean = await validateParentMenu(db, values.menu_id)
            if(!existsId) return [{ message: 'menu.error.parentMenuValidate', status: 400 as StatusCode }, null]
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

export const getAllMenusService = async (db: PrismaClient): Promise<MenusResponse> => {
    try {
        const menus: Menu[] | null[] = await db.menu.findMany({ select: menuSelect })
        return [null, menus]
    } catch {
        return [{ message: 'error.queryRecords', status: 400 as StatusCode }, null]
    }
}

export const getMenuByIdService = async (db: PrismaClient, id: IdOutput): Promise<MenuResponse> => {
    try {        
        const menu: Menu | null = await db.menu.findUnique({ where: id, select: menuSelect })
        if(!menu) return [{ message: 'error.recordNotFound', status: 404 as StatusCode }, null]
        return [null, menu]
    } catch {
        return [{ message: 'error.queryRecord', status: 400 as StatusCode }, null]
    }
}

export const updateMenuService = async (db: PrismaClient, id: IdOutput, values: UpdateMenuOutput): Promise<MenuResponse> => {
    try {
        const exist: number = await db.menu.count({ where: id })
        if(!exist) return [{ message: 'error.recordNotFound', status: 404 as StatusCode }, null]

        const exists: number = await db.menu.count({
            where: {
                AND: [
                    { title: values.title },
                    { route: values.route },
                    { menu_id: values.menu_id }
                ],
                NOT: id
            }
        })
        if(exists) return [{ message: 'error.duplicateRecord', status: 400 as StatusCode }, null]

        if(values.menu_id) {                      
            const existsId: boolean = await validateParentMenu(db, values.menu_id)
            if(!existsId) return [{ message: 'menu.error.parentMenuValidate', status: 400 as StatusCode }, null]
        }

        const menu: Menu = await db.menu.update({
            where: id,
            data: values,
            select: menuSelect
        })

        return [null, menu]
    } catch {
        return [{ message: 'error.updateRecord', status: 400 as StatusCode }, null]
    }
}

export const deleteMenuService = async (db: PrismaClient, id: IdOutput): Promise<MenuResponse> => {
    try {        
        const exist: number = await db.menu.count({ where: id })

        if(!exist) return [{ message: 'error.recordNotFound', status: 404 as StatusCode }, null]

        const menu: Menu = await db.menu.delete({ where: id })
        
        return [null, menu]
    } catch {
        return [{ message: 'error.deleteRecord', status: 400 as StatusCode }, null]
    }
}