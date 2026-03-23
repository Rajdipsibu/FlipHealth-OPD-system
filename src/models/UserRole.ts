import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "../config/database.js";

interface UserRoleAttributes {
  id: number;
  user_id:number;
  role_id:number;
  status?:boolean;
  is_deleted?:boolean;
}

interface UserRoleCreationAttributes extends Optional<UserRoleAttributes, 'id'>{}

class UserRole extends Model<UserRoleAttributes,UserRoleCreationAttributes>implements UserRoleAttributes{
  public id!:number;
  public user_id!:number;
  public role_id!:number;
  public status?:boolean;
  public is_deleted?:boolean;
}

UserRole.init(
  {
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id:{
      type: DataTypes.INTEGER,
      references:{
        model:"users",
        key:"id"
      }
    },   
    role_id:{
      type: DataTypes.INTEGER,
      references:{
        model:"roles",
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
    tableName:"userroles",
    timestamps:true
  }
)

export default UserRole;