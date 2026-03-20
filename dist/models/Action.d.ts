import { Model, type Optional } from "sequelize";
interface ActionAttributes {
    id: number;
    name: string;
    code: string;
}
interface ActionCreationAttributes extends Optional<ActionAttributes, 'id'> {
}
declare class Action extends Model<ActionAttributes, ActionCreationAttributes> implements ActionAttributes {
    id: number;
    name: string;
    code: string;
}
export default Action;
//# sourceMappingURL=Action.d.ts.map