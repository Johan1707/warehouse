export type Env = {
    Bindings: {
        [key in keyof CloudflareBindings]: CloudflareBindings[key]
    }
}