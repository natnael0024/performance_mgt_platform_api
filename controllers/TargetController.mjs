import asyncHandler from 'express-async-handler'
import {PrismaClient} from '@prisma/client'
import jwt from 'jsonwebtoken'
const prisma = new PrismaClient()

const jwtsec = process.env.JWT_SEC

export default {
    create: asyncHandler(async(req,res,next)=>{
        try{
            const token = req.headers.token
            
            jwt.verify(token,jwtsec,async(err,userInfo)=>{
                if(err){
                    return res.status(403).json({message:'Invalid token'})
                }
                const {userId,roleId} = userInfo
                if (roleId != 1){
                    return res.status(403).json({message: 'Only managers can set target'})
                }
                const {member_id,target_description,target_value,duration,}= req.body
                if( member_id == "" || target_description == "" || duration == ""){
                   return res.status(400).json({message:'These fields are required'}) 
                }

                const target = await prisma.targets.create({
                    data:{
                        manager_id:userId,
                        member_id,
                        target_description,
                        target_value,
                        duration
                    }
                })
                res.status(201).json({target})
            })
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

                const manager = await prisma.users.findFirst({
                    where:{
                        id: userId
                    }
                })

                // if(manager.team_id == )

                if(roleId !== 1){
                    return res.status(403).json({message:'unauthorized'})
                }
                const id = parseInt(req.params.id) //target id

        })
    })
}