import asyncHandler from 'express-async-handler'
import {PrismaClient} from '@prisma/client'
const prisma = new PrismaClient()

export default {
    create: asyncHandler(async(req,res,next)=>{
        try{
            const {company_id, manager_id,team_name,team_description} = req.body
            if(company_id == "" || manager_id == "", team_name==""){
                return res.status(400).json({message: 'these fields are required'})
            }
            const team = await prisma.teams.create({
                data:{
                    company_id,
                    manager_id,
                    team_name,
                    team_description
                }
            })
            res.status(201).json({team})
        }catch(err){
            next(err)
        }
    }),
    
    delete:asyncHandler(async(req,res,next)=>{
        try{
            const {id} = req.params.id
            const team = await prisma.teams.delete({
                where:{
                    id:id
                }
            })
            if(!team){
                return res.status(404).json({message: 'team doesn\'t exist'})
            }
            res.status(200).json({message:'team deleted'})
        }catch(err){
            next(err)
        }
    })

}