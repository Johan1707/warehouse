import { 
    object,
    pipe,
    union,
    number,
    string,
    transform,
    integer,
    minValue
 } from 'valibot'

export const IdSchema = object({
    id: pipe(
        union([number('id debe ser numérico'), string('id debe ser numérico')]),
        transform((value) => (+value)),
        integer('id debe ser un número entero'),
        minValue(1, 'id debe ser mayor o igual a 1'),
    )
})