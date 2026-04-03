import express from 'express';
import env from './config/env.js';
import sequelize, { connectDB } from './config/database.js';
import router from './routes/routes.js';
const app = express();
import './models/index.js'
import { pagination } from './middlewares/pagination.js';
import cookieParser from 'cookie-parser';

//middleware
app.use(cookieParser());

app.use(express.json());

app.use(pagination);

//routes
app.use('/api/v1',router);

//app listen
const PORT = env.PORT;
app.listen(PORT,async()=>{
  await connectDB();
  console.log(`app is running on http://localhost:${PORT}`);
  
})