import { Model, type Optional } from "sequelize";
interface ModuleAttributes {
    id: number;
    name: string;
    code: string;
    description?: string;
}
interface ModuleCreationAttributes extends Optional<ModuleAttributes, 'id'> {
}
declare class Module extends Model<ModuleAttributes, ModuleCreationAttributes> implements ModuleAttributes {
    id: number;
    name: string;
    code: string;
    description?: string;
}
export default Module;
//# sourceMappingURL=Module.d.ts.map