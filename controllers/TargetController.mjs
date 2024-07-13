import asyncHandler from 'express-async-handler'
import {PrismaClient} from '@prisma/client'
import jwt from 'jsonwebtoken'
const prisma = new PrismaClient()

const jwtsec = process.env.JWT_SEC

export default {
    create: asyncHandler(async(req,res,next)=>{
        try{
            const managerTeamId = req.teamId
            const managerId = req.userId
            const {member_id,target_description,target_value,duration,}= req.body
            if( member_id == null || target_description == null || duration == null){
                return res.status(400).json({message:'These fields are required'}) 
            }
            const member = await prisma.users.findUnique({
                where:{
                    id:member_id
                }
            })
            if(managerTeamId !== member.team_id){
                return res.status(403).json({message:'You can set targets for your team members only'})
            }
            const target = await prisma.targets.create({
                data:{
                    manager_id:managerId,
                    member_id,
                    target_description,
                    target_value,
                    team_id:managerTeamId,
                    duration
                }
            })
            //initialize a progress with value 0
            const progress = await prisma.progresses.create({
                data:{
                    target_id: target.id
                }
            })
            res.status(201).json({target})
        }catch(err){
            next(err)
        }
    }),

    update: asyncHandler(async(req,res,next)=>{
        try{
            const id = parseInt(req.params.id)
            let target = await prisma.targets.findFirst({
                where:{
                    id: id
                }
            })
            if(!target){
                return res.status(404).json({message: 'target not found'})
            }
            //check if user created the target
            if(target.manager_id !== userId){
                return res.status(403).json({message:'unauthorized'})
            }
            const {target_description,duration,target_value, member_id} = req.body
             target = await prisma.targets.update({
                where:{
                    id:id
                },
                data:{
                    target_description,
                    member_id,
                    target_value,
                    duration
                }
            })
            res.status(200).json({target})
        }catch(err){
            next(err)
        }
    }),

    getAssignedTargets: asyncHandler(async(req,res,next)=>{
        try{
            const token = req.headers.token
            jwt.verify(token,jwtsec,async(err,userInfo)=>{
                if(err){
                    return res.status(403).json({message: 'inavalid token'})
                }

                const {userId,roleId} = userInfo

                const assignedTargets = await prisma.targets.findMany({
                    where:{
                        member_id:userId
                    }
                })
                if(assignedTargets.length == 0){
                    return res.status(404).json({message:'You\'ve no assignedTargets'})
                }
                res.status(200).json({assignedTargets})
            })
        }catch(err){
            next(err)
        }
    }),

    updateStatus:asyncHandler(async(req,res,next)=>{
        try{
            //check if user is team_member
            const id = parseInt(req.params.id) //target id
            const status = req.body.status
            const target = await prisma.targets.update({
                where:{
                    id: id,
                    member_id: userId
                },
                data:{
                    status: status
                }
            })
            if(!target){
                return res.status(404).json({message:'target not found'})
            }
            res.status(200).json({target})
        }catch(err){
            next(err)
        }
    }),

    updateManagerApproval: asyncHandler(async(req,res,next)=>{
        const token = req.headers.token
            jwt.verify(token,jwtsec,async(err,userInfo)=>{
                if(err){
                    return res.status(403).json({message: 'inavalid token'})
                }
                const {userId,roleId} = userInfo
                
                if(roleId !== 1){
                    return res.status(403).json({message:'unauthorized'})
                }
                const manager = await prisma.users.findFirst({
                    where:{
                        id: userId
                    }
                })
                const id = parseInt(req.params.id)
                let target = await prisma.targets.findFirst({
                    where:{
                        id:id
                    }
                })

                if(manager.team_id !== target.team_id){
                    return res.status(403).json({message:'Manager can only approve his team\'s targets'})
                }
                const {manager_approval} = req.body
                target = await prisma.targets.update({
                    where:{
                        id:id
                    },
                    data:{
                    manager_approval
                   }
                })
                res.status(200).json({target})
        })
    })
}