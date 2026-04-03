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
import { sendMail } from "../helper/sendmail.js";
import { generateCodeVerifier, generateState, Google } from "arctic";

import { UserService } from "../services/user.service.js";
const userService = new UserService();

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
    const refreshToken  = jwt.sign({ id: user.dataValues.id }, env.REFRESH_SECRET, { expiresIn: "7d" });

    //Store in Sessions Table
    
    // Delete old sessions first if you only want 1 active login
    await Session.destroy({ where: { user_id: user.dataValues.id, type: ['access_token', 'refresh_token']  }});
    
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

    const policies = await getUserPolicies(user.dataValues.id); 

    const userData = { id: user.dataValues.id, user_type: user.dataValues.user_type, policies } ; 

    // 4. Generate New Access Token
    const newAccessToken = jwt.sign( userData, env.JWT_SECRET,  { expiresIn: "1h" } );

    // 5. Update Database: Replace old access_token with new one
    await Session.update(
      {
        token : newAccessToken,
        expires_at: new Date(Date.now() + 60 * 60 * 1000)
      },
      {
        where:{
          user_id:user.dataValues.id,
          type:"access_token"
        }
      }
    );

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
    //Create Flat Dot Notation Array
    const policies:string[] = [];

    const permissionData = permissionRoles.map(p => p.toJSON());

    permissionData.forEach(pd => {
      const module_action = pd.ModuleAction;
      const module_code = module_action?.Module?.code;
      const action_code = module_action?.Action?.code;

      if (module_code && action_code) {
        const policyString = `${module_code}.${action_code}`;
        
        // Ensure no duplicates
        if (!policies.includes(policyString)) {
          policies.push(policyString);
        }
      }
    })
    
    return policies.sort();
  }catch(err){
    console.error("Policy Flattening Error:", err);
    return [];
  }
}

export const forgotPassword = async(req: Request, res: Response) => {
  try{
    const {email} = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    //user exist: check
    const user = await User.findOne({where:{email,is_deleted:false} });

    if(!user){
      return res.status(200).json({ message: "User with this email does not exist" });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    //Set Expiry (e.g., 10 minutes from now)
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const userId = user.dataValues.id;

    const existingOtpSession = await Session.findOne({
      where: { user_id: userId, type: "otp" }
    });

    if(existingOtpSession){
      await existingOtpSession.update({
        token: otp,
        expires_at: otpExpiry
      });
    }else{
      await Session.create({
        user_id: userId,
        type: "otp",
        token: otp,
        expires_at: otpExpiry
      });
    }

    //send mail:
    await sendMail(email,'LOGIN OTP',`your otp is: ${otp}`);
    
    return res.status(200).json({ message: "OTP sent successfully to your email!" , OTP:otp ,purpose:"RESET_PASSWORD"});

    // //generate a random reset token
    // const resetToken = crypto.randomBytes(32).toString("hex");

    // const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    // const existingSession = await Session.findOne({
    //   where: { user_id: userId, type: "reset_token" }
    // });

    // if (existingSession) {
    //   // Update the existing reset_token
    //   await existingSession.update({
    //     token: resetToken,
    //     expires_at: expiresAt
    //   });
    // }else{
    //   // create new row (Type: reset_token)
    //   await Session.create({
    //     user_id:user.dataValues.id,
    //     type:"reset_token",
    //     token:resetToken,
    //     expires_at:new Date(Date.now() + 15 * 60 * 1000) //15 min
    //   });
    // }    

    // //send Email
    // await sendMail(
    //   email,
    //   `reset link`,
    //   `<p>Your reset link: /reset-password?token=${resetToken}</p>`
    // )

    // return res.status(200).json({ message: "Reset link sent to your email.",resetToken });
  }catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  try{
    const { token, newPassword, confirmPassword } = req.body;
    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "Token and new password or confirm Password are required!" });
    }

    if(newPassword != confirmPassword)return res.status(400).json({message:"mismatch password !!"});

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
    const user = await User.findByPk(session.dataValues.user_id);
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

export const sendOtp = async(req: Request, res: Response) =>{
  try{
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    //user exist !
    const user = await User.findOne({ where: { email ,is_deleted:false} });

    if (!user) {
      return res.status(404).json({ message: "User with this email does not exist" });
    }
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    //Set Expiry (e.g., 10 minutes from now)
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const userId = user.dataValues.id;

    const existingOtpSession = await Session.findOne({
      where: { user_id: userId, type: "otp" }
    });

    if(existingOtpSession){
      await existingOtpSession.update({
        token: otp, // Storing the OTP string in the 'token' field
        expires_at: otpExpiry
      });
    }else{
      await Session.create({
        user_id: userId,
        type: "otp",
        token: otp,
        expires_at: otpExpiry
      });
    }
    
    //send mail:
    await sendMail(email,'LOGIN OTP',`your otp is: ${otp}`);

    return res.status(200).json({ message: "OTP sent successfully to your email!" , OTP:otp, purpose:"LOGIN"});
  }catch (error: any) {
    console.error("Send OTP Error:", error.message);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
}

export const verifyOtp = async(req: Request, res: Response) =>{
  try{
    const { email, OTP, purpose } = req.body;
    if (!email || !OTP || !purpose) {
      return res.status(400).json({ message: "Email and OTP and purpose are required" });
    }

    // 1. Find user by email
    const user = await User.findOne({ where: { email:email } });
    if (!user) return res.status(404).json({ message: "User not found" });
    
    const userId = user?.dataValues.id;

    // 1. Find and validate the OTP session
    const sessionOtp = await Session.findOne({
      where:{user_id:userId, type:"otp", token: OTP}
    });

    if (!sessionOtp) {
      return res.status(400).json({ message: "Invalid OTP code" });
    }

    const otp_expiry = sessionOtp?.dataValues.expires_at;

    if (new Date() > otp_expiry) {
      await sessionOtp.destroy();
      return res.status(400).json({ message: "OTP has expired" });
    }

    // --- Path A: LOGIN ---
    if(purpose === 'LOGIN'){
      const policies = await getUserPolicies(userId);

      const userData = {id: user.dataValues.id,user_type: user.dataValues.user_type,policies}

      //token:
      const accessToken  = jwt.sign(userData,env.JWT_SECRET,{expiresIn: "1h"});
      const refreshToken  = jwt.sign({ id: user.dataValues.id }, env.REFRESH_SECRET, { expiresIn: "7d" });

      await sessionOtp.destroy();

      // Delete old sessions first if you only want 1 active login
      await Session.destroy({ where: { user_id: user.dataValues.id, type: ['access_token', 'refresh_token']  }});
      
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

      return res.status(200).json({
        message: "Login successful",
        accessToken,
        refreshToken
      });
    }

    // --- Path B: RESET_PASSWORD ---
    if(purpose === 'RESET_PASSWORD'){
      const resetToken = crypto.randomBytes(32).toString("hex");

      // Replace the OTP session with a Reset Token session
      await sessionOtp.destroy();
      await Session.create({
        user_id:userId,
        type:"reset_token",
        token:resetToken,
        expires_at:new Date(Date.now()+15*60*1000) //15 min validity
      });

      return res.status(200).json({
        message: "OTP verified. You can now reset your password.",
        resetToken //// Frontend will use this in the final /reset-password call
      })
    }

    return res.status(400).json({ message: "Invalid purpose" });
    
  }catch (error: any) {
    console.error("OTP Verification Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getProfile = async(req:Request,res:Response) =>{
  try{
    const id = req.token.id;
    const user = await User.findByPk(id);
    if(!user)return res.status(401).json({message:"user not found !!"});

    //exclude the id:
    const userResponse = user.toJSON() as any ;
    delete userResponse.id;
    delete userResponse.password;

    return res.status(200).json({message:"success",user:userResponse});
  }catch(e){
    console.error(e);
    res.status(500).json({message:"internal server error !!"})
  }
}

export const changePassword = async(req:Request,res:Response) => {
  const {oldPassword, newPassword, confirmPassword} = req.body;

  if(!oldPassword || !newPassword || !confirmPassword){
    return res.status(400).json({message:"all field are required !!"});
  }

  try{
    //find the password and check it correct or not:
    const id = req.token.id
    const user = await User.findByPk(id);
    if(!user)return res.status(400).json({message:"user not found"});

    const user_password = user.dataValues.password;
    const isMatch = bcrypt.compare(user_password,oldPassword);
    if(!isMatch)return res.status(400).json({message:"password is incorrect !!"});

    if(newPassword != confirmPassword){
      return res.status(400).json({message:"password mismatch"});
    }

    //update the password :
    await user.update({password:newPassword});
    return res.status(200).json({message:"password is updated successfully !!"});
  }catch(e){
    console.error(e);
    res.status(500).json({message:"internal server error !!"})
  }
}

//Oauth implementation:
const google = new Google(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  "http://localhost:3300/api/v1/auth/google/callback"
)

export const googleLoginRedirect = async (req:Request, res:Response) => {  
  // 1. Generate security strings
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const url = await google.createAuthorizationURL(state, codeVerifier, ["profile","email"]);

  //store state and codeVerifier in cookies so callback can see them
  res.cookie("google_oauth_state", state, { httpOnly: true, secure: false });
  res.cookie("google_code_verifier",codeVerifier, { httpOnly: true, secure: false });

  //redirect the user to google
  return res.redirect(url.toString());
};

export const googleCallback = async (req:Request, res:Response) => {  
  const code = req.query.code?.toString();
  const state = req.query.state?.toString();

  // Retrieve the stored strings from cookies
  const storedState = req.cookies.google_oauth_state;
  const storedCodeVerifier = req.cookies.google_code_verifier;

  // Validation
  if (!code || !state || !storedState || !storedCodeVerifier || state !== storedState) {
    return res.status(400).send("Invalid state or missing parameters");
  }

  try{
    //3. validate the code and get the access token
    const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier);

    const tokenString = tokens.accessToken();

    //4. Use the token to fetch user info from Google API
    const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo",{
      headers:{ Authorization: `Bearer ${tokenString}`}
    });

    const googleUser = await response.json();

    // console.log("GOOGLE USER DATA:", googleUser);

    const profile = {
      id: googleUser.sub || googleUser.id, 
      displayName: googleUser.name,
      emails: [{ value: googleUser.email }]
    }; 

    if (!profile.id) {
        throw new Error("Could not find a unique ID in Google response");
    }

    //5.Hand this over to your UserService
    const user = await userService.handleOAuthLogin(profile, "google");

    // Clear cookies after use
    res.clearCookie("google_oauth_state");
    res.clearCookie("google_code_verifier");

    //send the accesstoken and refresht token and pass it in the token
    if(!user?.dataValues.id){
      return res.send("user id not found !!");
    }
    const policies = await getUserPolicies(user?.dataValues.id);
    const userData = {id:user?.dataValues.id,user_type:user?.dataValues.user_type,policies}

    //token:
    const accessToken  = jwt.sign(userData,env.JWT_SECRET,{expiresIn: "1h"});
    const refreshToken  = jwt.sign({ id: user.dataValues.id }, env.REFRESH_SECRET, { expiresIn: "7d" });

    //Store in Sessions Table
    
    // Delete old sessions first if you only want 1 active login
    await Session.destroy({ where: { user_id: user.dataValues.id, type: ['access_token', 'refresh_token']  }});
    
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

    return res.status(200).json({
      message: "Login Successful",
      accessToken,
      refreshToken
    });
  }catch(error){
    console.log(error);
    
    return res.status(500).send("Authentication failed");
  }
}