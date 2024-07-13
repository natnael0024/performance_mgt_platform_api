import {Router} from 'express'
import ProgressController from '../controllers/ProgressController.mjs'
import {ceo,manager,teamMember} from '../middlewares/role.mjs'

const routes = Router()

//update for member
routes.post('/:id/update',teamMember,ProgressController.updateProgress)

//tracking for manager
routes.get('/:memberid/:id',ProgressController.getMemberProgress)

export default routes