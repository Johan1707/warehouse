import type { Context, MiddlewareHandler, Next } from 'hono'
import { createMiddleware } from 'hono/factory'
import { useTranslation } from '@intlify/hono'
import { verify } from 'hono/jwt'
import type { StatusCode } from 'hono/utils/http-status'

import type { Env } from '@/types'

export const jwtMiddleware: MiddlewareHandler = createMiddleware<Env>(async (c: Context, next: Next): Promise<Response | void> => {
	const t = useTranslation(c)
	try {	
        const authorization: string | undefined = c.req.header('Authorization' as string)

		if (!authorization) {
			return c.json({ message: t('auth.error.unauthorizedUser' as string) } as object, 401 as StatusCode)
		}

		const [, token]: string[] = authorization.split(' ')
		const { userId } = await verify(token, c.env.JWT_KEY)

		c.set('userId', userId)

		await next()
	} catch {
		return c.json({ message: t('auth.error.unauthorizedUser' as string) } as object, 401 as StatusCode)
	}
})