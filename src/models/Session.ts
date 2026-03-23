import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "../config/database.js";

interface SessionAttributes {
  id: number;
  user_id: number;
  type: "access_token" | "refresh_token" | "reset_token"|"otp";
  token: string;
  expires_at: Date;
  status?:boolean;
  is_deleted?:boolean;
}

interface SessionCreationAttributes extends Optional<SessionAttributes, 'id'>{}


class Session extends Model<SessionAttributes,SessionCreationAttributes>implements SessionAttributes{
  public id!: number;
  public user_id!: number;
  public type!: "access_token" | "refresh_token" | "reset_token"|"otp";
  public token!: string;
  public expires_at!: Date;
  public status?:boolean;
  public is_deleted?:boolean;
}

Session.init({
  id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  type: { type: DataTypes.ENUM("access_token", "refresh_token", "reset_token","otp"), allowNull: false },
  token: { type: DataTypes.TEXT, allowNull: false },
  expires_at: { type: DataTypes.DATE, allowNull: false },
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
}, { sequelize, tableName: "sessions" });

export default Session;
