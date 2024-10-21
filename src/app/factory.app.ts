import { PrismaD1 } from '@prisma/adapter-d1'
import { PrismaClient } from '@prisma/client'
import type { Context, Hono, Next } from 'hono'
import { createFactory } from 'hono/factory'

import type { Env } from '@/types'


export default createFactory({
    initApp: (app: Hono<Env>) => {
        app.use(async (c: Context, next: Next) => {
            const adapter = new PrismaD1(c.env.DB)
            const db = new PrismaClient({ adapter })
            c.set('db', db)
            await next()
        })
    }
})