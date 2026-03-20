import type { Request, Response } from "express";
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

export const regisgter = async (req: Request, res: Response) => {
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
    if (!user) return res.status(400).json({ message: "user not create !!" });

    return res
      .status(200)
      .json({ message: "user register successfully !!", user });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: "internal server error:" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(401).json({ message: "all field are requierd !!" });

    const user = await User.findOne({ where: { email: email } });
    if (!user) return res.status(400).json({ message: "user not found !!" });

    //check the password !
    const isMatch = await bcrypt.compare(password, user.dataValues.password);
    
    if (!isMatch)
      return res.status(400).json({ message: "invalid credential !!" });

    //Roles:
    const userRoles = await UserRole.findAll({ where: { user_id: user.dataValues.id } });

    const roleIds = userRoles.map((ur) => ur.dataValues.role_id);
    
    
    //Permission:
    const permissionRoles = await PermissionRole.findAll({
      where: { 
        role_id: {
          [Op.in]:roleIds,
        },
      },
      include: [
        {
          model: ModuleAction,
          include: [
            { model: Module },
            { model: Action }
          ],
        },
      ],
    });

    const policies: any[] = [];

    const permissionData = permissionRoles.map(p => p.toJSON());

    for (const pr of permissionData) {
      
      const ma = pr.ModuleAction;
      // console.log(ma);
      
      const moduleName = ma?.Module?.code;
      const actionName = ma?.Action?.code;
      console.log(moduleName,actionName);
      if (!moduleName || !actionName) continue;

      let existing = policies.find((p) => p.module === moduleName) ;
      if (!existing) {
        existing = { module: moduleName, actions: [] };
        policies.push(existing);
      }

      if (!existing.actions.includes(actionName)) {
        existing.actions.push(actionName);
      }
    }
    console.log(policies);
    

    //token:
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        policies 
      },
      env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );
    //send the token into the response:
    return res.status(200).json({
      message: "Login Successful !!",
      token,
      user: {
        id: user.dataValues.id,
        name: user.dataValues.name,
        email: user.dataValues.email,
      },
    });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: "internal server error !!!" });
  }
};
