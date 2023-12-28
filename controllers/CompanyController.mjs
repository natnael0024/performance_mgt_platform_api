import asyncHandler from 'express-async-handler'
import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

export default {
    create: asyncHandler(async(req,res,next)=>{
        try{
            let company_name = req.body.company_name
            let moto = req.body.moto
            if(company_name == ""){
            return res.status(400).json({message: 'company name can not be empty'})
            }
            const company = await prisma.companies.create({
            data:{
                company_name: company_name,
                moto: moto,
                }
            })
            res.status(201).json({company})
        }catch(error){
            next(error)
        }
    }),
}
