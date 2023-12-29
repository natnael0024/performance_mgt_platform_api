import {Router} from 'express'
import TargetController  from '../controllers/TargetController.mjs'

const routes = Router()

routes.post('/create',TargetController.create)

//update
routes.post('/:id/update',TargetController.update)

//get assigned targets - for team member
routes.get('/my',TargetController.getAssignedTargets)

//update status for team member
routes.post('/my/:id/update',TargetController.updateStatus)


export default routes