import { factoryDB } from '@/app'
import { validateRequest } from '@/middlewares'
import {
    CreateUserSchema,
    IdSchema,
    UpdateUserSchema,
} from '@/schemas'
import {
    createUserHandler,
    deleteUserHandler,
    getAllUsersHandler,
    getUserByIdHandler,
    updateUserHandler,
} from '@/handlers'


export const appUser = factoryDB.createApp().basePath('/users')

appUser
    .post('/', validateRequest('json', CreateUserSchema), ...createUserHandler)
    .get('/', ...getAllUsersHandler)
    .get('/:id', validateRequest('param', IdSchema), ...getUserByIdHandler)
    .put('/:id', validateRequest('param', IdSchema), validateRequest('json', UpdateUserSchema), ...updateUserHandler)
    .delete('/:id', validateRequest('param', IdSchema), ...deleteUserHandler)