import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";
class PermissionRole extends Model {
    id;
    role_id;
    module_action_id;
    ModuleAction;
}
PermissionRole.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    role_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "roles",
            key: "id"
        }
    },
    module_action_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "moduleactions",
            key: "id"
        }
    }
}, {
    sequelize,
    tableName: "permission_role",
    timestamps: true
});
export default PermissionRole;
//# sourceMappingURL=PermissionRole.js.map