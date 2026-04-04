import type { Request, Response } from "express";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import UserMfaConfig from "../models/UserMfaConfig.js";
import { encrypt, decrypt } from "../utils/crypto.util.js";
import User from "../models/User.js";
import { getUserPolicies } from "../helper/user_policy.js";
import { user_token } from "../helper/user_token.js";
import jwt from 'jsonwebtoken';
import env from "../config/env.js";

//Generate the Secret and QR Code
export const setupMFA = async (req: Request, res: Response) => {
  const id = req.token?.id; //userpolicy middileware
  const userId = Number(id)
  if(!userId)return res.status(401).json({message: "userId not found!!"});

  const user = await User.findByPk(userId);
  if(!user)return res.send("user not found!!");

  //generate a new secret
  const secret = await speakeasy.generateSecret({
    name: `FlipHealth:${user.dataValues.email}`,
  });

  // Encrypt the secret before saving
  const encryptedSecret = encrypt(secret.base32);

  const mfaConfig = await UserMfaConfig.findOne({where:{user_id:userId}});
  if(mfaConfig){
    await mfaConfig.update({
      secret:encryptedSecret,
      is_active: false
    })
  }else{
    await UserMfaConfig.create({
      user_id:userId,
      secret:encryptedSecret,
      is_active:false
    })
  }

  //generate qr
  const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

  return res.json({
    message: "MFA Setup initiated",
    qrCode: qrCodeUrl,
    manualCode: secret.base32, //backup if qr code not working
  });
};

//Verify the first code to set is_active = true
export const verifyAndEnableMFA = async (req: Request, res: Response) => {
  const { token } = req.body;
  const userId = (req as any).token.id;

  const mfaConfig = await UserMfaConfig.findOne({ where: { user_id: userId } });
  if(!mfaConfig || !mfaConfig.dataValues.secret) return res.status(404).json({message: "MFA setup not found. Please run the setup (QR code) step first." });

  try{
    const decryptedSecret = decrypt(mfaConfig.dataValues.secret);

    const verified = speakeasy.totp.verify({
      secret: decryptedSecret,
      encoding: 'base32',
      token, //6 digit token 
      window:1
    });

    console.log("Is Verified?:", verified);

    if(verified){
      // mfaConfig.is_active = true;
      // await mfaConfig.save();
      await UserMfaConfig.update({is_active:true},{where:{user_id:userId}});
      return res.json({ message: "MFA enabled successfully" });
    }

    return res.status(400).json({ message: "Invalid OTP code" });

  }catch(error){
    console.error("Decryption Error:", error);
    return res.status(500).json({ message: "Internal security error" });
  }

};

export const loginMFAChallenge = async (req: Request, res: Response) => {
  const { otp } = req.body;

  // Manually get the token from headers
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "No MFA token provided" });
  }
  
  const mfaToken = authHeader.split(' ')[1];
  if(!mfaToken) return ;
  try{
    //Decode it manually
    const decoded:any = jwt.verify(mfaToken,env.JWT_SECRET);

    const userId = decoded.id;
    const isMfaPending = decoded.mfa_pending;

    if (!isMfaPending) {
      return res.status(403).json({ message: "Invalid token type" });
    }

    const mfaConfig = await UserMfaConfig.findOne({where:{user_id:userId, is_active: true }});

    if(!mfaConfig) return res.status(400).json({ message: "MFA not active" });

    const verified = speakeasy.totp.verify({
      secret:decrypt(mfaConfig.dataValues.secret),
      encoding: 'base32',
      token:otp,
      window:1
    });

    if(!verified) return res.status(401).json({ message: "Invalid OTP" });

    //success: Generate and send the REAL JWT tokens here
    const user = await User.findByPk(userId);
    if(!user)return res.send("user not found!!")

    const policies = await getUserPolicies(user.dataValues.id);
      
    const userData = {id: user.dataValues.id,user_type: user.dataValues.user_type,policies}
    const result = await user_token(userData);
  
    //send the token into the response:
    return res.status(200).json({
      message: "Login Successful",
      accessToken:result.accessToken,
      refreshToken:result.refreshToken
    });

  }catch(error){
    return res.status(401).json({ message: "MFA session expired or invalid" });
  }



  const userId = (req as any).token?.id;
  const isMfaPending = (req as any).token?.mfa_pending;

  if (!isMfaPending) {
    return res.status(403).json({ message: "Invalid token type" });
  }
  
}