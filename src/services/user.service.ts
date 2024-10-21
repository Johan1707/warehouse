import type {
    Prisma,
    PrismaClient,
    User,
} from '@prisma/client'
import type { StatusCode } from 'hono/utils/http-status'

import { base64Decode, passwordHash } from '@/libs'
import type { CreateUserOutput, IdOutput, UpdateUserOutput } from '@/schemas'
import type { UserResponse, UsersResponse } from '@/types'

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
        if(exists) return [{ message: 'error.duplicateRecord', status: 400 as StatusCode }, null]

        const password: string = base64Decode(values.password)
        values.password = await passwordHash(password)

        const user: User = await db.user.create({ data: values, select: userSelect })

        return [null, user]
    } catch {
        return [{ message: 'error.createRecord', status: 400 as StatusCode }, null]
    }
}

export const getAllUsersService = async (db: PrismaClient): Promise<UsersResponse> => {
    try {
        const users: User[] = await db.user.findMany({ select: userSelect })
        return [null, users]
    } catch {
        return [{ message: 'error.queryRecords', status: 400 as StatusCode }, null]
    }
}

export const getUserByIdService = async (db: PrismaClient, id: IdOutput): Promise<UserResponse> => {
    try {        
        const user: User | null = await db.user.findUnique({ where: id, select: userSelect })
        if(!user) return [{ message: 'record_not_exist', status: 404 as StatusCode }, null]
        return [null, user]
    } catch {
        return [{ message: 'error.queryRecord', status: 400 as StatusCode }, null]
    }
}

export const updateUserService = async (db: PrismaClient, id: IdOutput, values: UpdateUserOutput): Promise<UserResponse> => {
    try {
        const exist: number = await db.user.count({ where: id })
        if(!exist) return [{ message: 'error.recordNotFound', status: 404 as StatusCode }, null]

        const user: User = await db.user.update({
            where: id,
            data: values,
            select: userSelect
        })

        return [null, user]
    } catch {
        return [{ message: 'error.updateRecord', status: 400 as StatusCode }, null]
    }
}

export const deleteUserService = async (db: PrismaClient, id: IdOutput): Promise<UserResponse> => {
    try {        
        const exist: number = await db.user.count({ where: id })
        if(!exist) return [{ message: 'error.recordNotFound', status: 404 as StatusCode }, null]

        const user: User = await db.user.delete({ where: id, select: userSelect })
        
        return [null, user]
    } catch {
        return [{ message: 'error.deleteRecord', status: 400 as StatusCode }, null]
    }
}