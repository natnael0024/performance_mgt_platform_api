import asyncHandler from 'express-async-handler'
import {PrismaClient} from '@prisma/client'
import jwt from 'jsonwebtoken'
const prisma = new PrismaClient()

const jwtsec = process.env.JWT_SEC

export default {
    create: asyncHandler(async(req,res,next)=>{
        try{
            //verify token
            const token = req.headers.token
            
            jwt.verify(token,jwtsec,async(err,userInfo)=>{
                if(err){
                    return res.status(403).json({message:'Invalid token'})
                }
                const {userId,roleId} = userInfo
                if (roleId != 1){
                    return res.status(403).json({message: 'Only managers can set target'})
                }
                const {member_id,target_description,duration}= req.body
                if( member_id == "" || target_description == "" || duration == ""){
                   return res.status(400).json({message:'These fields are required'}) 
                }
                const target = await prisma.targets.create({
                    data:{
                        manager_id:userId,
                        member_id,
                        target_description,
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
            //check if user is manager
            // find target
            const {id} = req.params.id
            const target = await prisma.targets.delete({
                where:{
                    id: id
                }
            })
            if(!target){
                return res.status(404).json({message: 'target not found'})
            }
            //check if user created the target
            res.status(200).json({message:'target deleted'})

        }catch(err){
            next(err)
        }
    }),

    get: asyncHandler(async(req,res,next)=>{
        const {id} = req.params.id
        try{
            const target = await prisma.targets.findUnique({
                where:{
                    id:id
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

    updateStatus:asyncHandler(async(req,res,next)=>{
        try{
            //check if user is team_member
            //find target ,check if the auth user_id == target.member_id
            const {id} = req.params.id
            const status = req.body.status
            const target = await prisma.targets.update({
                where:{
                    id: id
                },
                data:{
                    status: status
                }
            })
            if(!target){
                return res.status(404).json({message:'target not found'})
            }
        }catch(err){
            next(err)
        }
    })
}