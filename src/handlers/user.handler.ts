import { useTranslation } from '@intlify/hono'
import type { Context } from 'hono'
import type { StatusCode } from 'hono/utils/http-status'

import { factoryDB } from '@/app'
import type { CreateUserOutput, IdOutput, UpdateUserOutput } from '@/schemas'
import {
    createUserService,
    deleteUserService,
    getAllUsersService,
    getUserByIdService,
    updateUserService,
} from '@/services'
import type { Env, UserResponse, UsersResponse } from '@/types'


export const createUserHandler = factoryDB.createHandlers(async (c: Context<Env>) => {
    const t = useTranslation(c)
    const register: CreateUserOutput = c.req.valid(('json') as never)
    const [error, user]: UserResponse = await createUserService(c.var.db, register)

    if(error) {
        return c.json({ message: t(error.message as string) } as object, error.status as StatusCode)
    }

    return c.json(user, 201 as StatusCode)
})

export const getAllUsersHandler = factoryDB.createHandlers(async (c: Context<Env>) => {
    const t = useTranslation(c)
    const [error, users]: UsersResponse = await getAllUsersService(c.var.db)

    if(error) {
        return c.json({ message: t(error.message as string) } as object, error.status as StatusCode)
    }

    return c.json(users, 200 as StatusCode)
})

export const getUserByIdHandler = factoryDB.createHandlers(async (c: Context<Env>) => {
    const t = useTranslation(c)
    const id: IdOutput = c.req.valid(('param') as never)
    const [error, user]: UserResponse = await getUserByIdService(c.var.db, id)

    if(error) {
        return c.json({ message: t(error.message as string) } as object, error.status as StatusCode)
    }

    return c.json(user, 200 as StatusCode)
})

export const updateUserHandler = factoryDB.createHandlers(async (c: Context<Env>) => {
    const t = useTranslation(c)
    const id: IdOutput = c.req.valid(('param') as never)
    const register: UpdateUserOutput = c.req.valid(('json') as never)
    const [error, user]: UserResponse = await updateUserService(c.var.db, id, register)

    if(error) {
        return c.json({ message: t(error.message as string) } as object, error.status as StatusCode)
    }

    return c.json(user, 200 as StatusCode)
})

export const deleteUserHandler = factoryDB.createHandlers(async (c: Context<Env>) => {
    const t = useTranslation(c)
    const id: IdOutput = c.req.valid(('param') as never)
    const [error, removed]: UserResponse = await deleteUserService(c.var.db, id)
    
    if(error) {
        return c.json({ message: t(error.message as string) } as object, error.status as StatusCode)
    }

    return c.json(removed, 200 as StatusCode)
})