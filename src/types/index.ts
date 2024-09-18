import type { Menu } from '@prisma/client'
import type { PrismaClient } from '@prisma/client'
import type { StatusCode } from 'hono/utils/http-status'

export type Env = {
    Bindings: {
        [key in keyof CloudflareBindings]: CloudflareBindings[key]
    }
    Variables: {
        db: PrismaClient
    }
}

export type errorResponse = {
	message: string
	status: StatusCode
}

export type MenuResponse = [errorResponse | null, Menu | Menu[] | null]