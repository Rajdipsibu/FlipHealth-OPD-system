import { Model, type Optional } from "sequelize";
interface UserRoleAttributes {
    id: number;
    user_id: number;
    role_id: number;
}
interface UserRoleCreationAttributes extends Optional<UserRoleAttributes, 'id'> {
}
declare class UserRole extends Model<UserRoleAttributes, UserRoleCreationAttributes> implements UserRoleAttributes {
    id: number;
    user_id: number;
    role_id: number;
}
export default UserRole;
//# sourceMappingURL=UserRole.d.ts.map