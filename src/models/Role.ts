import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "../config/database.js";

interface RoleAttributes {
  id: number;
  name:string;
  code:string;
  description?:string;
}

interface RoleCreationAttributes extends Optional<RoleAttributes, 'id'>{}

class Role  extends Model<RoleAttributes,RoleCreationAttributes>implements RoleAttributes{
  public id!:number;
  public name!:string;
  public code!:string;
  public description?:string;
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
    }
  },
  {
    sequelize,
    tableName:"roles",
    timestamps:true
  }
)

export default Role;