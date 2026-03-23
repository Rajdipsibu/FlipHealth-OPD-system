import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "../config/database.js";

interface RoleAttributes {
  id: number;
  name:string;
  code:string;
  description?:string;
  status?:boolean;
  is_deleted?:boolean;
}

interface RoleCreationAttributes extends Optional<RoleAttributes, 'id'>{}

class Role  extends Model<RoleAttributes,RoleCreationAttributes>implements RoleAttributes{
  public id!:number;
  public name!:string;
  public code!:string;
  public description?:string;
  public status?:boolean;
  public is_deleted?:boolean;
}

Role.init(
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
    code:{
      type: DataTypes.STRING,
      allowNull:false
    },
    description:{
      type:DataTypes.STRING,
    },
    status:{
      type:DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue:true
    },
    is_deleted:{
      type:DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue:false
    } 
  },
  {
    sequelize,
    tableName:"roles",
    timestamps:true
  }
)

export default Role;