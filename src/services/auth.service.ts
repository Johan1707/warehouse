import type { Prisma, PrismaClient } from '@prisma/client'
import type { StatusCode } from 'hono/utils/http-status'

import { base64Decode, passwordVerify } from '@/libs'
import type { AuthResponse, UserWithRole } from '@/types'
import { AuthOutput } from '@/schemas'

const roleSelect: Prisma.RoleSelect = {
    id: true,
    name: true,
    active: true,
}

const userSelect: Prisma.UserSelect = {
    id: true,
    username: true,
    password: true,
    firstName: true,
    lastName: true,
    email: true,
    attempts: true,
    roleId: true,
    lastSeen: true,
    token: true,
    active: true,
    role: {
        select: roleSelect
    },
}


export const authService = async (db: PrismaClient, auth: AuthOutput): Promise<AuthResponse> => {
    try {        
        const user: UserWithRole | null = await db.user.findUnique({ where: { email: auth.email }, select: userSelect })
        
        if(!user) return [{ message: 'error.recordNotFound', status: 404 as StatusCode }, null]        
        if(!user.active) return [{ message: 'auth.error.inactiveUser', status: 401 as StatusCode }, null]

        const password: string = base64Decode(auth.password)
        const validPassword: boolean = await passwordVerify(user.password, password)
        const lastSeen: Date = new Date()

        if(!validPassword) {
            const attemps: number = user.attempts
            if(attemps < 5) {
                await db.user.update({ where: { id: user.id }, data: { attempts: { increment: 1 }}})
                return [{ message: 'auth.error.inactiveUser', status: 401 as StatusCode }, null]
            }

            await db.user.update({ where: { id: user.id }, data: { active: false, lastSeen }})
            return [{ message: 'auth.error.userBlocked', status: 401 as StatusCode }, null]
        }

        await db.user.update({ where: { id: user.id }, data: { attempts: 0, lastSeen }})
        user.lastSeen = lastSeen

        return [null, user]
    } catch {
        return [{ message: 'auth.error.inactiveUser', status: 400 as StatusCode }, null]
    }
}