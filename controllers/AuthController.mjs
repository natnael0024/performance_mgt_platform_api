import asyncHandler from 'express-async-handler'
import {PrismaClient} from '@prisma/client'
import bcrypt, { compare } from 'bcrypt'
import jwt from 'jsonwebtoken'

const jwtsec = process.env.JWT_SEC

const prisma = new PrismaClient()

export default {
    register: asyncHandler(async(req,res,next)=>{
       try{
        let { company_id,
                first_name,
                last_name,
                email,
                password,
                role_id,
                team_id,
                level_id,
                xp  } = req.body
        if(first_name == "" || last_name == "" || email =="" || password==""||role_id==""){
            return res.status(400).json({message:'these fields are required'})
        }
        if(  role_id == 2 && team_id == null){
            return res.status(400).json({message:'Team value can not be empty for team member and manager'})
        }
        const userExists = await prisma.users.findFirst({
            where:{
                email:email
            }
        })
        if(userExists){
            return res.status(400).json({message:'A user with this email already exists'})
        }
        password = await bcrypt.hash(password,10)
        const user = await prisma.users.create({
            data:{
                company_id,
                first_name,
                last_name,
                email,
                password,
                role_id,
                team_id,
                level_id,
                xp
            }
        })
        res.status(201).json({user})
       }catch(err){
        next(err)
       }
    }),

    login:asyncHandler(async(req,res,next)=>{
        try{
            const {email,password} = req.body
            if(email == "" || password == ""){
                return res.status(400).json({message:'All fields are required'})
            }
            const user = await prisma.users.findFirst({
                where:{
                    email:email
                }
            })
            if(!user){
                return res.status(404).json({message:'No user with this email'})
            }
            const passMatch = await bcrypt.compare(password,user.password)
            if(!passMatch){
                return res.status(403).json({message:'Incorrect password'})
            }
            
            else{
                const teamid = user.team_id ? user.team_id : null
                const token = jwt.sign({ 
                    userId: user.id,
                    email: user.email,
                    roleId: user.role_id,
                    companyId:user.company_id,
                    teamId: teamid
                }, 
                jwtsec,
                {
                    expiresIn: '7d'
                })
                delete user.password
                res.status(200).cookie('token',token).json({user})
            }
        }catch(err){
            next(err)
        }
    }),
}