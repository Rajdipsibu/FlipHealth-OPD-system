import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "../config/database.js";

interface UserRoleAttributes {
  id: number;
  user_id:number;
  role_id:number;
}

interface UserRoleCreationAttributes extends Optional<UserRoleAttributes, 'id'>{}

class UserRole extends Model<UserRoleAttributes,UserRoleCreationAttributes>implements UserRoleAttributes{
  public id!:number;
  public user_id!:number;
  public role_id!:number;
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
    }    
  },
  {
    sequelize,
    tableName:"userroles",
    timestamps:true
  }
)

export default UserRole;