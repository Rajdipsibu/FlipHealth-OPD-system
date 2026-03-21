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
import Session from "../models/Session.js";
import crypto from "crypto";

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

    const policies = await getUserPolicies(user.dataValues.id);
    
    const userData = {id: user.dataValues.id,user_type: user.dataValues.user_type,policies}

    //token:
    const accessToken  = jwt.sign(userData,env.JWT_SECRET,{expiresIn: "1h"});
    const refreshToken  = jwt.sign({ id: user.id }, env.REFRESH_SECRET, { expiresIn: "7d" });

    //Store in Sessions Table
    // Optional: Delete old sessions first if you only want 1 active login
    // await Session.destroy({ where: { user_id: user.id, type: 'access_token' }
    /*
    await Session.bulkCreate([
      { 
        user_id: user.dataValues.id, 
        type: "access_token",
        token: accessToken, 
        expires_at: new Date(Date.now() + 60 * 60 * 1000) 
      },
      { 
        user_id: user.dataValues.id, 
        type: "refresh_token", 
        token: refreshToken, 
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
      }
    ])
    */

    //send the token into the response:
    return res.status(200).json({
      message: "Login Successful",
      accessToken,
      refreshToken
    })

  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: "internal server error !!!" });
  }
};

export const logout = async(req:Request,res:Response) =>{
  try{
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.split(" ")[1];

    if (!accessToken) {
      return res.status(400).json({ message: "No token provided" });
    }

    const userId = req.token.id;
    // 3. Delete BOTH the access token AND the refresh token for this user
    await Session.destroy({ 
      where: { 
        user_id: userId,
        type: ['access_token', 'refresh_token'] 
      } 
    });

    return res.status(200).json({ message: "Logged out successfully from all sessions" });
  }catch (error: any) {
    console.error(error);
    res.status(400).json({ message: "Logout Failed !!" });
  }
}

export const refreshToken = async (req: Request, res: Response) => {
  try{
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: "Refresh token required" });

    // Check if token exists in our Sessions table
    const savedSession = await Session.findOne({ 
      where: { token: refreshToken, type: 'refresh_token' } 
    });
    if (!savedSession) return res.status(403).json({ message: "Invalid refresh token" });

    // Verify JWT signature
    const decoded = jwt.verify(refreshToken, env.REFRESH_SECRET) as any;

    //Fetch User and Policies (to embed in the new Access Token)
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

     // ... Re-run your Policy fetching logic here (from your Login controller) ...
    const policies = await getUserPolicies(user.id); 

    // 4. Generate New Access Token
    const newAccessToken = jwt.sign(
      { id: user.id, user_type: user.user_type, policies },
      env.JWT_SECRET,
      { expiresIn: "1h" }
    );

     // 5. Update Database: Replace old access_token with new one
    await Session.destroy({ where: { user_id: user.id, type: 'access_token' } });
    await Session.create({
      user_id: user.id,
      type: "access_token",
      token: newAccessToken,
      expires_at: new Date(Date.now() + 60 * 60 * 1000)
    });

    return res.status(200).json({ accessToken: newAccessToken });
  }catch (error) {
    return res.status(403).json({ message: "Session expired, please login again" });
  }
}

const getUserPolicies = async(userId:number)=>{
  try{    
    //fetch the all role of that particular user:
    const userRoles = await UserRole.findAll({
      where:{user_id:userId}
    });
    //fetch roleIds:
    const roleIds = userRoles.map((user_role)=>user_role.dataValues.role_id);
    
    //fetch the permission according to roleIds:
    const permissionRoles = await PermissionRole.findAll({
      where:{
        role_id:{[Op.in]:roleIds}
      },
      include:[
        {
          model:ModuleAction,
          include:[
            {model:Module},
            {model:Action}
          ]
        }
      ]
    });

    const policies:any[] = [];

    const permissionData = permissionRoles.map(p => p.toJSON());

    for(const pd of permissionData){
      const module_action = pd.ModuleAction;
      const moduleName = module_action?.Module?.code;
      const actionName = module_action?.Action?.code;
      
      if(!moduleName || !actionName) continue;

      let existing = policies.find((p)=> p.module === moduleName);

      if(!existing){
        existing = {module:moduleName,actions:[]};
        policies.push(existing);
      }

      if(!existing.actions.includes(actionName)){
        existing.actions.push(actionName);
      }
    }

    return policies;
  }catch(err){

  }
}

export const forgotPassword = async(req: Request, res: Response) => {
  try{
    const {email} = req.body;
    const user = await User.findOne({where:{email,is_deleted:false} });

    if(!user){
      return res.status(200).json({ message: "Reset link sent to your email." });
    }

    //generate a random reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Store it in the Sessions table (Type: reset_token)
    await Session.create({
      user_id:user.dataValues.id,
      type:"reset_token",
      token:resetToken,
      expires_at:new Date(Date.now() + 15 * 60 * 1000) //15 min
    });

    //send Email
    //await sendEmail(user.email, `Your reset link: /reset-password?token=${resetToken}`);

    return res.status(200).json({ message: "Reset link sent to your email.",resetToken });
  }catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  try{
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required!" });
    }

    // 1. Find the token in the sessions table and check if it's expired
    const session = await Session.findOne({
      where: {
        token: token,
        type: "reset_token",
        expires_at: { [Op.gt]: new Date() } // Must be greater than "now"
      }
    });

    if (!session) {
      return res.status(400).json({ message: "Invalid or expired reset token!" });
    }

    // 2. Find the user
    const user = await User.findByPk(session.user_id);
    if (!user) return res.status(404).json({ message: "User not found!" });

    // Hash new password and update user
    const hashPassword = await bcrypt.hash(newPassword,10);
    await user.update({ password: hashPassword });

    // 4. IMPORTANT: Delete the reset token so it can't be used again
    await session.destroy();

    // OPTIONAL: Delete all other active access/refresh sessions for security
    // await Session.destroy({ where: { user_id: user.id } });

    return res.status(200).json({ message: "Password updated successfully!" });
  }catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}