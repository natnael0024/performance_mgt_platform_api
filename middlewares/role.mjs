import asyncHandler from "express-async-handler"
import jwt from 'jsonwebtoken'

const jwtsec = process.env.JWT_SEC

export const ceo = asyncHandler(async(req,res,next)=>{
    try{
        const token = req.headers.token
        jwt.verify(token,jwtsec,async(err,userInfo)=>{
            if(err){
                return res.status(403).json({message:'Invalid token'})
            }
            const {userId,roleId,companyId} = userInfo
            //check if user is CEO (role 3)
            if(roleId !==3){
                return res.status(403).json({message:'You are unauthorized'})
            }
            next()
        })
    }catch(err){
        next(err)
    }
})

export const manager = asyncHandler(async(req,res,next)=>{
    try{
        const token = req.headers.token
        jwt.verify(token,jwtsec,async(err,userInfo)=>{
            if(err){
                return res.status(403).json({message:'Invalid token'})
            }
            const {userId,roleId,companyId} = userInfo
            //check if user is manager (role 1)
            if(roleId !==1){
                return res.status(403).json({message:'You are unauthorized'})
            }
            next()
        })
    }catch(err){
        next(err)
    }
})

export const teamMember = asyncHandler(async(req,res,next)=>{
    try{
        const token = req.headers.token
        jwt.verify(token,jwtsec,async(err,userInfo)=>{
            if(err){
                return res.status(403).json({message:'Invalid token'})
            }
            const {userId,roleId,companyId} = userInfo
            //check if user is team-member (role 2)
            if(roleId !==2){
                return res.status(403).json({message:'You are unauthorized'})
            }
            next()
        })
    }catch(err){
        next(err)
    }
})