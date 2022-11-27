import express, {Request, Response} from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import userRouter from './routes/Users';
import indexRouter from './routes/index'
import {db} from './config'
import adminRoute from './routes/adminRoute';
import vendorRoute from './routes/vendor'

//sequelize connection
db.sync().then(()=>{
    console.log("Db connected successfully")
}).catch(err=>{
    console.log(err)
})

const app = express()

app.use(express.json());
app.use(logger('dev'));
app.use(cookieParser());

//Router middleware
app.use('/', indexRouter)
app.use('/users', userRouter)
app.use('/admins', adminRoute)
app.use('/vendors', vendorRoute)


const port = 4000
app.listen(port,()=>{
    console.log(`Server running on http://localhost:${port}`)
})


export default app