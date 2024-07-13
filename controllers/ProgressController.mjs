import asyncHandler from 'express-async-handler'
import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

export default {
    //for team member
    updateProgress : asyncHandler(async(req,res,next)=>{
        const id = parseInt(req.params.id)
        const memberId = req.memberId

        let progress = await prisma.progresses.findFirst({
            where:{
                id:id,
            }
        })
        if(!progress){
            return res.status(404).json({message:'progress not found'})
        }
        if(progress.member_id !== memberId){
            return res.status(403).json({message:'unauthorized'})
        }
        const {progress_value} = req.body
        if (progress_value == null){
            return res.status(400).json({message: 'value required'})
        }
        progress = await prisma.progresses.update({
            where:{
                id:id
            },
            data:{
                progress_value
            }
        })
        res.status(200).json({progress})
    }),

    //for manager
    getMemberProgress: asyncHandler(async(req,res,next)=>{
        try{
            const id = req.params.id
            const progress = await prisma.progresses.findUnique({
                where:{
                    id:id
                },
                select:{
                    progress_value
                }
            })
        }catch(err){
            next(err)
        }
    }),
}