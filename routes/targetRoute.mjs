import {Router} from 'express'
import TargetController  from '../controllers/TargetController.mjs'
import {manager,teamMember} from '../middlewares/role.mjs'
import {auth} from '../middlewares/auth.mjs'

const routes = Router()

routes.post('/create',manager,TargetController.create)

//update
routes.post('/:id/update',manager,TargetController.update)

//get assigned targets - for team member
routes.get('/my',auth,TargetController.getAssignedTargets)

//update status for team member
routes.post('/my/:id/update',teamMember,TargetController.updateStatus)

//manager approval
routes.post('/:id/approval',manager,TargetController.updateManagerApproval)



export default routes