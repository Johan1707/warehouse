import {
    boolean,
    maxLength,
    minLength,
    nonEmpty,
    number,
    object,
    optional,
    pipe,
    string,    
} from 'valibot'

export const CreateMenuSchema = object({
    title: pipe(
        string(),
        nonEmpty(),
        minLength(4),
        maxLength(80)
    ),
    route: optional(
        pipe(
            string(),
            maxLength(120)
        )
    ),
    icon: pipe(
        string(),
        maxLength(60)        
    ),
    sequence: optional( number() ),
    style: optional( string() ),
    menu_id: optional( number() ),
    active: boolean()
})