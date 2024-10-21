import { useTranslation } from '@intlify/hono'
import type { Context } from 'hono'
import { sign } from 'hono/jwt'
import type { StatusCode } from 'hono/utils/http-status'
import type { JWTPayload } from 'hono/utils/jwt/types'

import { factoryDB } from '@/app'
import type { AuthOutput } from '@/schemas'
import { authService } from '@/services'
import type { AuthResponse, Env } from '@/types'


export const authHandler = factoryDB.createHandlers(async (c: Context<Env>): Promise<Response> => {
    const t = useTranslation(c)
    const auth: AuthOutput = c.req.valid(('json') as never)

    const [error, user]: AuthResponse = await authService(c.var.db, auth)

    if(error) {
        return c.json({ message: t(error.message as string) } as object, error.status as StatusCode)
    }

    const payload: JWTPayload = {
        userId: user.id,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12
    }

    const token: string = await sign(payload, c.env.JWT_KEY)

    c.header('Authorization', `Barrer ${ token }` as string)
    
    return c.json({
        //id: user.id,
        //username: user.username,
        fullName: `${user.firstName} ${user.lastName}`,
        //email: user.email,
        //attempts: user.attempts,
        lastSeen: user.lastSeen,
        //token: user.token,
        //active: user.active,
        roleName: user.role.name,
    } as object, 200 as StatusCode)
})