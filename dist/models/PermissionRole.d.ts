import { Model, type Optional } from "sequelize";
import type ModuleAction from "./ModuleAction.js";
interface PermissionRoleAttributes {
    id: number;
    role_id: number;
    module_action_id: number;
}
interface PermissionRoleCreationAttributes extends Optional<PermissionRoleAttributes, 'id'> {
}
declare class PermissionRole extends Model<PermissionRoleAttributes, PermissionRoleCreationAttributes> implements PermissionRoleAttributes {
    id: number;
    role_id: number;
    module_action_id: number;
    ModuleAction?: ModuleAction;
}
export default PermissionRole;
//# sourceMappingURL=PermissionRole.d.ts.map