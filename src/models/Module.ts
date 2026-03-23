import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "../config/database.js";


interface ModuleAttributes {
  id: number;
  name: string;
  code: string;
  description?: string;
  status?:boolean;
  is_deleted?:boolean;
}

interface ModuleCreationAttributes extends Optional<ModuleAttributes, 'id'>{}

class Module extends Model<ModuleAttributes,ModuleCreationAttributes>implements ModuleAttributes{
  public id!:number;
  public name!:string;
  public code!:string;
  public description?: string;
  public status?:boolean;
  public is_deleted?:boolean;
}

Module.init(
  {
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    code:{
      type:DataTypes.STRING,
      allowNull: false,
      unique:true
    },
    description:{
      type: DataTypes.STRING,
      allowNull: true
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
    tableName:"modules",
    timestamps:true
  }
)


export default Module;
