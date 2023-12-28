import {Router} from 'express'
import CompanyController from '../controllers/CompanyController.mjs'
// const routes = require('express').Router();
// const CompanyController = require('../controllers/CompanyController');
const routes = Router()
routes.post('/create', CompanyController.create)

export default routes
// module.exports = routes