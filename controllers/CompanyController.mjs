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

    getCompanyManagers: asyncHandler(async(req,res,next)=>{
        try{
            const companyId = req.params.id
            const managers = await prisma.users.findMany({
                where:{
                    company_id: parseInt(companyId),
                    role_id: 1
                },
                select:{
                    id: true,
                    first_name: true,
                    last_name:true,
                    image:true
                }
            })
            if(managers.length == 0){
                return res.status(404).json({message: 'No managers in this company'})
            }
            res.status(200).json({managers})
        }catch(err){
            next(err)
        }
    }),

    getCompanyTeamMembers: asyncHandler(async(req,res,next)=>{
        try{
            const companyId = req.params.id
            const teamMembers = await prisma.users.findMany({
                where:{
                    company_id: companyId,
                    role_id: 2
                },
                select:{
                    id: true,
                    first_name: true,
                    last_name:true,
                    image:true
                }
            })
            if(teamMembers.length == 0){
                return res.status(404).json({message:'No team members in this company'})
            }
            
            res.status(200).json({teamMembers})
        }catch(err){
            next(err)
        }
    })
}
