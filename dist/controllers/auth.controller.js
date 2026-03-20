import User from "../models/User.js";
import jwt from "jsonwebtoken";
import env from "../config/env.js";
import UserRole from "../models/UserRole.js";
import PermissionRole from "../models/PermissionRole.js";
import bcrypt from "bcrypt";
import ModuleAction from "../models/ModuleAction.js";
import Module from "../models/Module.js";
import Action from "../models/Action.js";
import { Op } from "sequelize";
export const regisgter = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ message: "field are required !!" });
        //check the user already exist or not!
        const isExistUser = await User.findOne({ where: { email: email } });
        if (isExistUser)
            return res.status(400).json({ message: "user already exist !!" });
        //bcrypt password
        const saltRound = 10;
        const hashPassword = await bcrypt.hash(password, saltRound);
        const user = await User.create({
            name,
            email,
            password: hashPassword,
            phone,
        });
        if (!user)
            return res.status(400).json({ message: "user not create !!" });
        return res
            .status(200)
            .json({ message: "user register successfully !!", user });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "internal server error:" });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(401).json({ message: "all field are requierd !!" });
        const user = await User.findOne({ where: { email: email } });
        if (!user)
            return res.status(400).json({ message: "user not found !!" });
        //check the password !
        const isMatch = await bcrypt.compare(password, user.dataValues.password);
        if (!isMatch)
            return res.status(400).json({ message: "invalid credential !!" });
        //Roles:
        const userRoles = await UserRole.findAll({ where: { user_id: user.dataValues.id } });
        const roleIds = userRoles.map((ur) => ur.role_id);
        //Permission:
        const permissionRoles = await PermissionRole.findAll({
            where: {
                role_id: {
                    [Op.in]: roleIds,
                },
            },
            include: [
                {
                    model: ModuleAction,
                    include: [Module, Action],
                },
            ],
        });
        //build policies:
        const policies = [];
        for (const pr of permissionRoles) {
            const ma = pr.ModuleAction;
            const moduleName = ma?.Module?.code;
            const actionName = ma?.Action?.code;
            if (!moduleName || !actionName)
                continue;
            let existing = policies.find((p) => p.module === moduleName);
            if (!existing) {
                existing = { module: moduleName, action: [] };
                policies.push(existing);
            }
            if (!existing.actions.includes(actionName)) {
                existing.actions.push(actionName);
            }
        }
        //token:
        const token = jwt.sign({
            id: user.id,
            email: user.email,
            policies
        }, env.JWT_SECRET, {
            expiresIn: "1h",
        });
        //send the token into the response:
        return res.status(200).json({
            message: "Login Successful !!",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error(error.message);
        res.status(400).json({ message: "internal server error !!!" });
    }
};
//# sourceMappingURL=auth.controller.js.map