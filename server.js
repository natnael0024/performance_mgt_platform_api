import  Express  from "express"
import dotenv from 'dotenv'
import errorMiddleware from './middlewares/errorMiddleware.mjs'
import companyRoute from './routes/companyRoute.mjs'
import authRoute from './routes/authRoute.mjs'
import teamRoute from './routes/teamRoute.mjs'
import targetRoute from './routes/targetRoute.mjs'



const app = Express()

const PORT = process.env.PORT || 8080
app.listen(PORT,()=>{
    console.log(`*** server running (${PORT}) *** `)
})
app.use(Express.json())
app.use(errorMiddleware)

app.use('/v1/companies',companyRoute)
app.use('/v1/auth',authRoute)
app.use('/v1/teams',teamRoute)
app.use('/v1/targets',targetRoute)
