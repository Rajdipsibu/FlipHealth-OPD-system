import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "../config/database.js";

interface SessionAttributes {
  id: number;
  user_id: number;
  type: "access_token" | "refresh_token" | "reset_token";
  token: string;
  expires_at: Date;
}

interface SessionCreationAttributes extends Optional<SessionAttributes, 'id'>{}


class Session extends Model<SessionAttributes,SessionCreationAttributes>implements SessionAttributes{
  public id!: number;
  public user_id!: number;
  public type!: "access_token" | "refresh_token" | "reset_token";
  public token!: string;
  public expires_at!: Date;
}

Session.init({
  id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  type: { type: DataTypes.ENUM("access_token", "refresh_token", "reset_token"), allowNull: false },
  token: { type: DataTypes.TEXT, allowNull: false },
  expires_at: { type: DataTypes.DATE, allowNull: false }
}, { sequelize, tableName: "sessions" });

export default Session;
