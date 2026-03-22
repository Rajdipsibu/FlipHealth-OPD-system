import type{ Request, Response, NextFunction } from "express";

export const userAccess = (moduleCode:string,actionCode:string) => {
  return (req:Request,res:Response,next:NextFunction)=>{
    try{
      const policies = req.token.policies;
      if(!policies)return res.status(403).json({ message: "No permissions found" });

      //super admin bypass
      if(req.token?.type === "super_admin"){
        return next();
      }

      // Check flat string: 'network.create'
      const requiredPermission = `${moduleCode}.${actionCode}`;

      if (!policies.includes(requiredPermission)) {
        return res.status(403).json({ message: "Forbidden: Access denied" });
      }
      
      next();
    }catch(error){
      return res.status(500).json({
        message: "Authorization error",
      });
    }
  }
}