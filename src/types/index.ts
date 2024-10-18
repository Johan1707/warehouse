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

export type IdParam = {
    id: number
}
export type StructureError = {
	message: string
	status: StatusCode
}

export type SuccessResponse<M> = [null, M]
export type ErrorResponse = [StructureError, null]
export type ResponseType<T> = T extends ErrorResponse ? ErrorResponse : T;
export type ServiceResponseType<T> = ResponseType<SuccessResponse<T> | ErrorResponse>

export type MenuResponse = ServiceResponseType<Menu>
export type MenusResponse = ServiceResponseType<Menu[]>
