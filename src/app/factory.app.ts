import { createFactory } from 'hono/factory'
import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'
import type { Context, Next, Hono } from 'hono'

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