import {Router} from 'express'
import TargetController  from '../controllers/TargetController.mjs'

const routes = Router()

routes.post('/create',TargetController.create)

export default routes