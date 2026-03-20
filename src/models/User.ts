import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "../config/database.js";

interface UserAttributes {
  id: number;
  //user_type: string
  name:string;
  email:string;
  password:string;
  phone?:string;
  status?:boolean;
  is_deleted?:boolean;
  is_verified?:boolean;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'>{}

class User extends Model<UserAttributes,UserCreationAttributes>implements UserAttributes{
  public id!:number;
  public name!:string;
  public email!:string;
  public password!:string;
  public phone?:string;
  public status?:boolean;
  public is_deleted?:boolean;
  public is_verified?:boolean;
}

User.init(
  {
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name:{
      type: DataTypes.STRING,
      allowNull:false
    },   
    email:{
      type: DataTypes.STRING,
      allowNull:false,
      unique:true
    },   
    password:{
      type: DataTypes.STRING,
      allowNull:false
    },   
    phone:{
      type: DataTypes.STRING,
    },    
    status:{
      type: DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue:true
    },    
    is_deleted:{
      type: DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue:false
    },    
    is_verified:{
      type: DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue:false
    }    
  },
  {
    sequelize,
    tableName:"users",
    timestamps:true
  }
)

export default User;