import type { Context } from 'hono'
import { sign } from 'hono/jwt'
import type { JWTPayload } from 'hono/utils/jwt/types'

import { factoryDB } from '@/app'
import type { AuthResponse } from '@/types'
import { authService } from '@/services'
import { useTranslation } from '@intlify/hono'
import { AuthOutput } from '@/schemas'
import { StatusCode } from 'hono/utils/http-status'

export const authHandler = factoryDB.createHandlers(async (c: Context): Promise<Response> => {
    const t = useTranslation(c)
    const auth: AuthOutput = c.req.valid(('json') as never)

    const [error, user]: AuthResponse = await authService(c.var.db, auth)

    if(error) {
        return c.json({ message: t(error.message) }, error.status as StatusCode)
    }

    const payload: JWTPayload = {
        userId: user.id,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12
    }

    const token = await sign(payload, c.env.JWT_KEY)

    c.header('Authorization', `Barrer ${ token }`)
    
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
    })    
})