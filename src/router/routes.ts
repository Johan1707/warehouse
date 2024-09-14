import { Hono } from 'hono'

export const app = new Hono().basePath('./api/v1.0')