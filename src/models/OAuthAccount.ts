import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";


class OAuthAccount extends Model {}

OAuthAccount.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  provider: {
    type: DataTypes.ENUM("google", "github"),
    allowNull: false
  },
  provider_acc_id: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  tableName: "oauth_accounts",
  timestamps: true
});

export default OAuthAccount;