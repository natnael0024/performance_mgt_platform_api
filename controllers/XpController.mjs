import asyncHandler from 'express-async-handler'
import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

export default {
    addXp: asyncHandler(async(req,res,next)=>{
        try{
            const managerId = req.userId
            const id = req.params.id
            const xp = parseInt(req.body)
            const manager = await prisma.users.findUnique({
                where:{
                    id:managerId
                }
            })
            const member = await prisma.users.findUnique({
                where:{
                    id:id
                }
            })
            if(manager.team_id !== member.team_id){
                return res.status(403).json({message:'This user is not in your team'})
            }
            const user = await prisma.users.update({
                where:{
                    id:id
                },
                data:{
                    xp
                }
            })
        }catch(err){
            next(err)
        }
    })
}