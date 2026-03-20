import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "../config/database.js";

interface ActionAttributes {
  id: number;
  name: string;
  code:string;
}

interface ActionCreationAttributes extends Optional<ActionAttributes, 'id'>{}

class Action extends Model<ActionAttributes,ActionCreationAttributes>implements ActionAttributes{
  public id!:number;
  public name!:string;
  public code!:string;  
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
    }
  },
  {
    sequelize,
    tableName:"actions",
    timestamps:true
  }
)

export default Action;