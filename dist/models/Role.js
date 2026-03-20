import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";
class Role extends Model {
    id;
    name;
    code;
    description;
}
Role.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
    }
}, {
    sequelize,
    tableName: "roles",
    timestamps: true
});
export default Role;
//# sourceMappingURL=Role.js.map