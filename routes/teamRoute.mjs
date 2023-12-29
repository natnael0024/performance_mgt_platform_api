import {Router} from 'express'
import TeamController  from '../controllers/TeamController.mjs'

const routes = Router()

//create
routes.post('/create',TeamController.create)

//get members of a team
routes.get('/:id/members',TeamController.getTeamMembers)

//get target of a member
routes.get('/:id/members/:memberId',TeamController.getMemberTarget)


export default routes