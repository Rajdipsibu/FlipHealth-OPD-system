import { Model, type Optional } from "sequelize";
interface UserAttributes {
    id: number;
    name: string;
    email: string;
    password: string;
    phone?: string;
    status?: boolean;
    is_deleted?: boolean;
    is_verified?: boolean;
}
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {
}
declare class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    id: number;
    name: string;
    email: string;
    password: string;
    phone?: string;
    status?: boolean;
    is_deleted?: boolean;
    is_verified?: boolean;
}
export default User;
//# sourceMappingURL=User.d.ts.map