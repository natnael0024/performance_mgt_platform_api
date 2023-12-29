import asyncHandler from 'express-async-handler'
import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

export default {
    getCompanyManagers: asyncHandler(async(req,res,next)=>{
        try{
            const companyId = req.params.id
            
        }catch(err){
            next(err)
        }
    })
}