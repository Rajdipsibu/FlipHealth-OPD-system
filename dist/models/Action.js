import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";
class Action extends Model {
    id;
    name;
    code;
}
Action.init({
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
    }
}, {
    sequelize,
    tableName: "actions",
    timestamps: true
});
export default Action;
//# sourceMappingURL=Action.js.map