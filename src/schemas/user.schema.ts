import {
    base64,
    boolean,
    email,
    InferOutput,
    integer,
    maxLength,
    minLength,
    minValue,
    nonEmpty,
    number,
    object,
    optional,
    pipe,
    regex,
    string,
} from 'valibot'

export const CreateUserSchema = object({
    username: pipe(
        string(),
        nonEmpty(),
        minLength(4),
        maxLength(50),
    ),
    password: pipe(
        string(),
        base64(),
        nonEmpty(),
        minLength(8),
        maxLength(50),
    ),
    firstName: pipe(
        string(),
        nonEmpty(),
        minLength(4),
        maxLength(60),
        regex(/^[a-zÀ-ÿ\u00f1\u00d1\s]{4,60}$/i)
    ),
    lastName: pipe(
        string(),
        nonEmpty(),
        minLength(4),
        maxLength(60),
        regex(/^[a-zÀ-ÿ\u00f1\u00d1\s]{4,60}$/i)
    ),
    email: pipe(
        string(),
        nonEmpty(),
        email(),
        minLength(12),
        maxLength(60),
    ),
    roleId: pipe(
        number(),
        integer(),
        minValue(1),
    ),
    active: optional(boolean())
})

export type CreateUserOutput = InferOutput<typeof CreateUserSchema>

export const UpdateUserSchema = object({
    username: optional(
        pipe(
            string(),
            nonEmpty(),
            minLength(4),
            maxLength(50),
        )
    ),
    password: optional(
        pipe(
            string(),
            base64(),
            nonEmpty(),
            minLength(8),
            maxLength(50),
        )
    ),
    firstName: optional(
        pipe(
            string(),
            nonEmpty(),
            minLength(4),
            maxLength(60),
            regex(/^[a-zÀ-ÿ\u00f1\u00d1\s]{4,60}$/i)
        )
    ),
    lastName: optional(
        pipe(
            string(),
            nonEmpty(),
            minLength(4),
            maxLength(60),
            regex(/^[a-zÀ-ÿ\u00f1\u00d1\s]{4,60}$/i)
        )
    ),
    email: optional(
        pipe(
            string(),
            nonEmpty(),
            email(),
            minLength(12),
            maxLength(60),
        )
    ),
    roleId: optional(
        pipe(
            number(),
            integer(),
            minValue(1),
        )
    ),
    active: optional(boolean())
})

export type UpdateUserOutput = InferOutput<typeof UpdateUserSchema>