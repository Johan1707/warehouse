import type {
    Prisma,
    PrismaClient,
    User,
} from '@prisma/client'
import type { StatusCode } from 'hono/utils/http-status'

import { base64Decode, passwordHash } from '@/libs'
import type { CreateUserOutput, UpdateUserOutput } from '@/schemas'
import type { IdParam, UserResponse, UsersResponse } from '@/types'

const userSelect: Prisma.UserSelect = {
    id: true,
    username: true,
    firstName: true,
    lastName: true,
    email: true,
    active: true
}

export const createUserService = async (db: PrismaClient, values: CreateUserOutput): Promise<UserResponse> => {
    try {        
        const exists: number = await db.user.count({ where: {
                OR: [
                    { username: values.username },
                    { email: values.email },
                ]
            }
        })
        if(exists) return [{ message: 'record_duplicated', status: 400 as StatusCode }, null]

        const password: string = base64Decode(values.password)
        values.password = await passwordHash(password)

        const user: User = await db.user.create({ data: values, select: userSelect })

        return [null, user]
    } catch(e) {
        console.log(e)
        return [{ message: 'error_creating_record', status: 400 as StatusCode }, null]
    }
}

export const getAllUsersService = async (db: PrismaClient): Promise<UsersResponse> => {
    try {
        const users: User[] = await db.user.findMany({ select: userSelect })
        return [null, users]
    } catch {
        return [{ message: 'hello.world', status: 400 as StatusCode }, null]
    }
}

export const getUserByIdService = async (db: PrismaClient, id: IdParam): Promise<UserResponse> => {
    try {        
        const user: User | null = await db.user.findUnique({ where: id, select: userSelect })
        if(!user) return [{ message: 'record_not_exist', status: 404 as StatusCode }, null]
        return [null, user]
    } catch {
        return [{ message: 'error_creating_record', status: 400 as StatusCode }, null]
    }
}

export const updateUserService = async (db: PrismaClient, id: IdParam, values: UpdateUserOutput): Promise<UserResponse> => {
    try {
        const exist: number = await db.user.count({ where: id })
        if(!exist) return [{ message: 'record_not_exist', status: 404 as StatusCode }, null]

        const user: User = await db.user.update({
            where: id,
            data: values,
            select: userSelect
        })

        return [null, user]
    } catch {
        return [{ message: 'error_updating_record', status: 400 as StatusCode }, null]
    }
}

export const deleteUserService = async (db: PrismaClient, id: IdParam): Promise<UserResponse> => {
    try {        
        const exist: number = await db.user.count({ where: id })
        if(!exist) return [{ message: 'record_not_exist', status: 404 as StatusCode }, null]

        const user: User = await db.user.delete({ where: id, select: userSelect })
        
        return [null, user]
    } catch {
        return [{ message: 'error_deleting_record', status: 400 as StatusCode }, null]
    }
}