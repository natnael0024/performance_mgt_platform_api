import asyncHandler from 'express-async-handler'
import {PrismaClient} from '@prisma/client'
const prisma = new PrismaClient()

module.exports = {
    create: asyncHandler(async(req,res)=>{
        
    })
}