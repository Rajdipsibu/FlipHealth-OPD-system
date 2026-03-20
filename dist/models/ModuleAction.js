import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";
class ModuleAction extends Model {
    id;
    module_id;
    action_id;
    Module;
    Action;
}
ModuleAction.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    module_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "modules",
            key: "id"
        }
    },
    action_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "actions",
            key: "id"
        }
    }
}, {
    sequelize,
    tableName: "module_action",
    timestamps: true
});
export default ModuleAction;
//# sourceMappingURL=ModuleAction.js.map