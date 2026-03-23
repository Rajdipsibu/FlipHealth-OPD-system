import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "../config/database.js";
import type Module from "./Module.js";
import type Action from "./Action.js";

interface ModuleActionAttributes {
  id: number;
  module_id:number;
  action_id:number;
  status?:boolean;
  is_deleted?:boolean;
}

interface ModuleActionCreationAttributes extends Optional<ModuleActionAttributes, 'id'>{}

class ModuleAction  extends Model<ModuleActionAttributes,ModuleActionCreationAttributes>implements ModuleActionAttributes{
  public id!:number;
  public module_id!:number;
  public action_id!:number;
  public status?:boolean;
  public is_deleted?:boolean;
  public Module?: Module;
  public Action?:Action;
}

ModuleAction.init(
  {
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    module_id:{
      type: DataTypes.INTEGER,
      references:{
        model:"modules",
        key:"id"
      }
    },
    action_id:{
      type:DataTypes.INTEGER,
      references:{
        model:"actions",
        key:"id"
      }
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
    tableName:"moduleactions",
    timestamps:true
  }
)

export default ModuleAction;
