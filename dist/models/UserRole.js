import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";
class UserRole extends Model {
    id;
    user_id;
    role_id;
}
UserRole.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "users",
            key: "id"
        }
    },
    role_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "roles",
            key: "id"
        }
    }
}, {
    sequelize,
    tableName: "user_role",
    timestamps: true
});
export default UserRole;
//# sourceMappingURL=UserRole.js.map