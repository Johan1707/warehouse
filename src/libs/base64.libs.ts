import { Buffer } from 'node:buffer'

export const base64Encode = (base64: string): string => Buffer.from(base64, 'utf-8').toString('base64')
export const base64Decode = (base64: string): string => Buffer.from(base64, 'base64').toString('utf-8')