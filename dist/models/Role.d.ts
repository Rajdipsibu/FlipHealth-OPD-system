import { Model, type Optional } from "sequelize";
interface RoleAttributes {
    id: number;
    name: string;
    code: string;
    description?: string;
}
interface RoleCreationAttributes extends Optional<RoleAttributes, 'id'> {
}
declare class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
    id: number;
    name: string;
    code: string;
    description?: string;
}
export default Role;
//# sourceMappingURL=Role.d.ts.map