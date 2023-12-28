import {Router} from 'express'
import AuthController  from '../controllers/AuthController.mjs'

const routes = Router()

routes.post('/register',AuthController.register)

routes.post('/login', AuthController.login)

export default routes