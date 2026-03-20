import Action from "./Action.js";
import Module from "./Module.js";
import ModuleAction from "./ModuleAction.js";
import PermissionRole from "./PermissionRole.js";
import Role from "./Role.js";
ModuleAction.belongsTo(Module, { foreignKey: "module_id" });
ModuleAction.belongsTo(Action, { foreignKey: "action_id" });
PermissionRole.belongsTo(ModuleAction, { foreignKey: "module_action_id" });
Role.belongsToMany(ModuleAction, {
    through: PermissionRole,
    foreignKey: 'role_id'
});
ModuleAction.belongsToMany(Role, {
    through: PermissionRole,
    foreignKey: 'module_action_id'
});
//# sourceMappingURL=index.js.map