import asyncHandler from 'express-async-handler'
import {PrismaClient} from '@prisma/client'
import jwt from 'jsonwebtoken'
const prisma = new PrismaClient()

const jwtsec = process.env.JWT_SEC

export default {
    getTeamMembers: asyncHandler(async(req,res,next)=>{
        try{
            const teamId = req.params.id
            const teamMembers = await prisma.users.findMany({
                where:{
                    team_id: teamId,
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
    }),

    getMemberTarget: asyncHandler(async(req,res,next)=>{
        const {id} = req.params.id //team member id
        try{
            const target = await prisma.targets.findUnique({
                where:{
                    member_id:id
                }
            })
            if(!target){
                return res.status(404).json({message:'target not found'})
            }
            res.status(200),json({target})
        }catch(err){
            next(err)
        }
    }),

    create: asyncHandler(async(req,res,next)=>{
        try{
            const { manager_id,team_name,team_description} = req.body
            if( manager_id == "", team_name==""){
            return res.status(400).json({message: 'these fields are required'})
            }
            //create the team
            const team = await prisma.teams.create({
                data:{
                    company_id:companyId,
                    manager_id,
                    team_name,
                    team_description
                }
            })
            //update the manager set team_id 
            const manager = await prisma.users.update({
                where:{
                    id:manager_id
                },
                data:{
                    team_id: team.id
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