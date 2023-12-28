import {Router} from 'express'
import TeamController  from '../controllers/TeamController.mjs'

const routes = Router()

routes.post('/create',TeamController.create)

export default routes