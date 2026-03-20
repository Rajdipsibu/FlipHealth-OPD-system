import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";
class Module extends Model {
    id;
    name;
    code;
    description;
}
Module.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    tableName: "modules",
    timestamps: true
});
export default Module;
//# sourceMappingURL=Module.js.map