import type { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import env from "../config/env.js";

declare global{
  namespace Express{
    interface Request{
      token?:any;
    }
  }
}

export const userPolicy = (req:Request,res:Response,next:NextFunction) => { 
  try{
    const authHeader = req.headers.authorization;
    if(!authHeader){
      return res.status(401).json({ message: "No token provided" }); 
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }
    const decoded = jwt.verify(token, env.JWT_SECRET) as any;

    //attach to the request:
    req.token = {
      id:decoded.id,
      email:decoded.email,
      policies:decoded.policies || []
    };

    next();
  }catch(err){
    console.error(err);
    return res.status(401).json({ message: "Unauthorized" });
  }
}