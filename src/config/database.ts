import env from "./env.js";
import { Sequelize } from "sequelize-typescript";

const sequelize = new Sequelize(
  env.DB_NAME,
  env.DB_USER,
  env.DB_PASSWORD,
  {
    host: env.DB_HOST,
    dialect:'mysql'
  }
)

export const connectDB = async()=>{
  try{
    await sequelize.authenticate();
    console.log('MySQL Connection has been established successfully');    
  }catch(error){
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

export default sequelize;