import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "../config/database.js";
import type ModuleAction from "./ModuleAction.js";

interface PermissionRoleAttributes {
  id: number;
  role_id:number;
  module_action_id:number;
  ModuleAction?: ModuleAction;
}

interface PermissionRoleCreationAttributes extends Optional<PermissionRoleAttributes, 'id'>{}

class PermissionRole   extends Model<PermissionRoleAttributes,PermissionRoleCreationAttributes>implements PermissionRoleAttributes{
  public id!:number;
  public role_id!:number;
  public module_action_id!:number;
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
    }    
  },
  {
    sequelize,
    tableName:"permissionroles",
    timestamps:true
  }
)

export default PermissionRole;