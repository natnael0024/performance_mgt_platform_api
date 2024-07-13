import asyncHandler from 'express-async-handler'
import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

export default {
    create:asyncHandler(async(req,res,next)=>{
        try{
            const {team_id,title,details} = req.body
            if(team_id == null || title == null, details == null){
                return res.status(400).json({message:"All fields are required"})
            }
            const team = await prisma.teams.findUnique({
                where:{
                    id:team_id
                }
            })
            if(team.company_id != req.companyId){
                return res.status(403).json({Error:'Attempting to give direction to a team of another company'})
            }
            const direction = await prisma.directions.create({
            data:{
                company_id: req.companyId,
                ceo_id: req.ceoId,
                team_id,
                title,
                details
            }
            })
        res.status(201).json({direction})
        }catch(err){
            next(err)
        }
    }),

    delete:asyncHandler(async(req,res,next)=>{
        try{
            const id = req.params.id

            await prisma.directions.delete({
                where:{
                    id:id
                }
            })
        res.status(201).json({message:'direction has been deleted'})
        }catch(err){
            next(err)
        }
    }),

    //for manager to view direction given by the ceo
    getDirections: asyncHandler(async(req,res,next)=>{
        try{
            const managerId = req.userId
            const manager = await prisma.users.findUnique({
                where:{
                    id: managerId
                }
            })
            const directions = await prisma.directions.findMany({
                where:{
                    team_id: manager.team_id
                }
            })
        res.status(200).json(directions)
        }catch(err){
            next(err)
        }
    })
    
}