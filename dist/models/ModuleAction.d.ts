import { Model, type Optional } from "sequelize";
import type Module from "./Module.js";
import type Action from "./Action.js";
interface ModuleActionAttributes {
    id: number;
    module_id: number;
    action_id: number;
}
interface ModuleActionCreationAttributes extends Optional<ModuleActionAttributes, 'id'> {
}
declare class ModuleAction extends Model<ModuleActionAttributes, ModuleActionCreationAttributes> implements ModuleActionAttributes {
    id: number;
    module_id: number;
    action_id: number;
    Module?: Module;
    Action?: Action;
}
export default ModuleAction;
//# sourceMappingURL=ModuleAction.d.ts.map