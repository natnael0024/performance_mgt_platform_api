import asyncHandler from "express-async-handler"
import jwt from 'jsonwebtoken'

const jwtsec = process.env.JWT_SEC

export const auth = asyncHandler(async(req,res,next)=>{
    try{
        const token = req.headers.token
        jwt.verify(token,jwtsec,async(err,userInfo)=>{
            if(err){
                return res.status(403).json({message:'Invalid token'})
            }
            next()
        })

    }catch(err){
        next(err)
    }
})
