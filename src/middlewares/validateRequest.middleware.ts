import type { Context, MiddlewareHandler, ValidationTargets } from 'hono'
import { createMiddleware } from 'hono/factory'
import type { StatusCode } from 'hono/utils/http-status'
import { validator } from 'hono/validator'
import { type ObjectSchema, safeParse, type SafeParseResult } from 'valibot'


export const validateRequest = (typeReq: keyof ValidationTargets, schema: ObjectSchema<any, any>): MiddlewareHandler => createMiddleware(
    validator(typeReq, (value: object, c: Context) => {        
        const { success, issues, output }: SafeParseResult<ObjectSchema<any, any>> = safeParse(schema, value)
        if(!success) {
            return c.json({ message: issues.map(({ message }) => message).join(', ') }, 422 as StatusCode)
        }
        return output
    })
)