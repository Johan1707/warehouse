import {
    base64,
    email,
    InferOutput,
    maxLength,
    nonEmpty,
    object,
    pipe,
    string
} from 'valibot'

export const AuthSchema = object({
    email: pipe(
        string(),        
        nonEmpty(),
        email(),
        maxLength(50),
    ),
    password: pipe(
        string(),
        base64(),
        nonEmpty(),
    ),
})

export type AuthOutput = InferOutput<typeof AuthSchema>
