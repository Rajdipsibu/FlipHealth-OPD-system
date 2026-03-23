import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "../config/database.js";

interface ActionAttributes {
  id: number;
  name: string;
  code:string;
  status?:boolean;
  is_deleted?:boolean;
}

interface ActionCreationAttributes extends Optional<ActionAttributes, 'id'>{}

class Action extends Model<ActionAttributes,ActionCreationAttributes>implements ActionAttributes{
  public id!:number;
  public name!:string;
  public code!:string; 
  public status?:boolean;
  public is_deleted?:boolean; 
}

Action.init(
  {
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name:{
      type: DataTypes.STRING,
      allowNull: false
    },
    code:{
      type: DataTypes.STRING,
      allowNull: false
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
    tableName:"actions",
    timestamps:true
  }
)

export default Action;