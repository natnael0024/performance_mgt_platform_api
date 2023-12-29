import {Router} from 'express'
import TeamController  from '../controllers/TeamController.mjs'
import {ceo} from '../middlewares/role.mjs'
import {auth} from '../middlewares/auth.mjs'


const routes = Router()

//create
routes.post('/create',ceo,TeamController.create)

//get members of a team
routes.get('/:id/members',auth,TeamController.getTeamMembers)

//get target of a member
routes.get('/:id/members/:memberId',auth,TeamController.getMemberTarget)


export default routes