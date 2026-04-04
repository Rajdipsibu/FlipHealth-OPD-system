import { DataTypes, Model } from "sequelize";
import sequelize from '../config/database.js'

class UserMfaConfig extends Model {
  public id!: number;
  public user_id!: number;
  public mfa_type!: string;
  public secret!: string;
  public is_active!: boolean;
  public recovery_codes!: string[];
}

UserMfaConfig.init({
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  mfa_type: {
    type: DataTypes.ENUM('totp', 'sms', 'email'),
    defaultValue: 'totp'
  },
  secret: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  recovery_codes: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  sequelize,
  tableName: "user_mfa_configs"
});

export default UserMfaConfig;