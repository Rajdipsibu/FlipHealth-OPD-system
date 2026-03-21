import Action from "./Action.js";
import Module from "./Module.js";
import ModuleAction from "./ModuleAction.js";
import PermissionRole from "./PermissionRole.js";
import Role from "./Role.js";
import UserRole from "./UserRole.js";


ModuleAction.belongsTo(Module,{foreignKey:"module_id"});
ModuleAction.belongsTo(Action,{foreignKey:"action_id"});

// PermissionRole <-> ModuleAction
ModuleAction.hasMany(PermissionRole, { foreignKey: 'module_action_id' });
PermissionRole.belongsTo(ModuleAction, { foreignKey: 'module_action_id' });

Role.belongsToMany(ModuleAction,{
  through: PermissionRole, 
  foreignKey:'role_id'
});
ModuleAction.belongsToMany(Role,{
  through:PermissionRole, 
  foreignKey:'module_action_id'
});

UserRole.belongsTo(Role,{foreignKey:"role_id"});
Role.hasMany(Role,{foreignKey:"role_id"})