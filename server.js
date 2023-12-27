import  Express  from "express"
import dotenv from 'dotenv'

const app = Express()

const PORT = process.env.PORT
app.listen(PORT || 8080,()=>{
    console.log('*** server running ***')
})

