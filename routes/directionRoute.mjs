import {Router} from 'express'
import DirectionController from '../controllers/DirectionController.mjs'
import {ceo,manager} from '../middlewares/role.mjs'
const routes = Router()

//create by CEO for a team
routes.post('/create',ceo,DirectionController.create)

//get direction for manager
routes.get('/my',manager,DirectionController.getDirections)

//delete
routes.delete('/:id/delete',ceo,DirectionController.delete)


export default routes