import {Router} from 'express'
import CompanyController from '../controllers/CompanyController.mjs'

const routes = Router()

routes.post('/create', CompanyController.create)
routes.get('/:id/managers', CompanyController.getCompanyManagers)
routes.get('/:id/teamMembers', CompanyController.getCompanyManagers)



export default routes
