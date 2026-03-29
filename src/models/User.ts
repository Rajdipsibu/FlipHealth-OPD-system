import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "../config/database.js";

type UserRole = "super_admin" | "admin" | "customer" | "doctor" | "pharmacy_owner";
interface UserAttributes {
  id: number;
  user_type:UserRole;
  name:string;
  email:string;
  password:string;
  phone?:string | null;
  status?:boolean;
  is_deleted?:boolean;
  is_verified?:boolean;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'user_type'>{}

class User extends Model<UserAttributes,UserCreationAttributes>implements UserAttributes{
  public id!:number;
  public user_type!: UserRole;
  public name!:string;
  public email!:string;
  public password!:string;
  public phone?:string | null;
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
    user_type:{
      type: DataTypes.ENUM("super_admin","admin","customer","doctor","pharmacy_owner"),
      allowNull:false,
      defaultValue:"customer"
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