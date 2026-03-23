import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "../config/database.js";
import type ModuleAction from "./ModuleAction.js";

interface PermissionRoleAttributes {
  id: number;
  role_id:number;
  module_action_id:number;
  status?:boolean;
  is_deleted?:boolean;
  ModuleAction?: ModuleAction;
}

interface PermissionRoleCreationAttributes extends Optional<PermissionRoleAttributes, 'id'>{}

class PermissionRole   extends Model<PermissionRoleAttributes,PermissionRoleCreationAttributes>implements PermissionRoleAttributes{
  public id!:number;
  public role_id!:number;
  public module_action_id!:number;
  public status?:boolean;
  public is_deleted?:boolean;
  public ModuleAction?: ModuleAction;
}

PermissionRole.init(
  {
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    role_id:{
      type: DataTypes.INTEGER,
      references:{
        model:"roles",
        key:"id"
      }
    },
    module_action_id:{
      type: DataTypes.INTEGER,
      references:{
        model:"moduleactions",
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
    tableName:"permissionroles",
    timestamps:true
  }
)

export default PermissionRole;